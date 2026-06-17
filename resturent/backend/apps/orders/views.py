import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer, OrderStatusUpdateSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow users to access their own orders, admins can access all."""
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related('user').prefetch_related('items').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method', 'payment_status']
    search_fields = ['user__username', 'user__email', 'delivery_address']
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.select_related('user').prefetch_related('items').all()
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action == 'update_status':
            return OrderStatusUpdateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        self._notify_order_update(order)

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """Admin: Update order status with WebSocket notification."""
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        self._notify_order_update(order)
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'], url_path='my-orders')
    def my_orders(self, request):
        """Get current user's orders."""
        orders = self.get_queryset()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_order(self, request, pk=None):
        """Cancel an order if it's still pending/confirmed."""
        order = self.get_object()
        if order.status not in ['pending', 'confirmed']:
            return Response(
                {'error': f'Cannot cancel order in {order.status} status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'cancelled'
        order.save()
        self._notify_order_update(order)
        return Response(OrderSerializer(order).data)

    def _notify_order_update(self, order):
        """Send real-time WebSocket notification for order status change."""
        channel_layer = get_channel_layer()
        if channel_layer:
            order_data = OrderSerializer(order).data
            async_to_sync(channel_layer.group_send)(
                f'order_{order.id}',
                {
                    'type': 'order_status_update',
                    'data': order_data
                }
            )
            async_to_sync(channel_layer.group_send)(
                'orders_all',
                {
                    'type': 'order_status_update',
                    'data': order_data
                }
            )
