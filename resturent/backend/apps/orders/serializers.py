from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'menu_item', 'menu_item_name', 'menu_item_price', 'quantity', 'subtotal')
        read_only_fields = ('id', 'menu_item_name', 'menu_item_price', 'subtotal')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'user_email', 'status', 'total_amount',
            'payment_method', 'payment_status', 'delivery_address',
            'phone', 'special_instructions', 'estimated_delivery_time',
            'actual_delivery_time', 'items', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'user_email', 'status', 'payment_status', 'created_at', 'updated_at')


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = (
            'payment_method', 'delivery_address', 'phone',
            'special_instructions', 'total_amount', 'items'
        )

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must have at least one item.")
        for item in value:
            if item['quantity'] < 1:
                raise serializers.ValidationError("Quantity must be at least 1.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            menu_item = item_data['menu_item']
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                menu_item_name=menu_item.name,
                menu_item_price=menu_item.price,
                quantity=item_data['quantity'],
                subtotal=menu_item.price * item_data['quantity']
            )
        return order


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('status', 'estimated_delivery_time', 'actual_delivery_time')

    def validate_status(self, value):
        valid_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['preparing', 'cancelled'],
            'preparing': ['ready', 'cancelled'],
            'ready': ['out_for_delivery', 'cancelled'],
            'out_for_delivery': ['delivered', 'cancelled'],
            'delivered': [],
            'cancelled': [],
        }
        current_status = self.instance.status
        if value not in valid_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot transition from '{current_status}' to '{value}'."
            )
        return value
