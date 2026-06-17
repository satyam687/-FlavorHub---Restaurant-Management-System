from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer, CartItemUpdateSerializer
from apps.menu.models import MenuItem


class CartDetailView(generics.RetrieveAPIView):
    """Get current user's cart."""
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(APIView):
    """Add an item to the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        menu_item_id = request.data.get('menu_item_id')
        special_instructions = request.data.get('special_instructions', '')

        #  Validate and cast quantity — was silently passing raw string
        try:
            quantity = int(request.data.get('quantity', 1))
            if quantity < 1:
                raise ValueError
        except (TypeError, ValueError):
            return Response(
                {'error': 'quantity must be a positive integer'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            menu_item = MenuItem.objects.get(
                id=menu_item_id, is_active=True, availability='available'
            )
        except MenuItem.DoesNotExist:
            return Response(
                {'error': 'Menu item not found or unavailable'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item=menu_item,
            defaults={'quantity': quantity, 'special_instructions': special_instructions}
        )

        if not created:
            cart_item.quantity += quantity
            if special_instructions:
                cart_item.special_instructions = special_instructions
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
class UpdateCartItemView(generics.UpdateAPIView):
    """Update quantity or instructions for a cart item."""
    serializer_class = CartItemUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Allow PATCH for partial updates (only quantity or only instructions)
    http_method_names = ['patch', 'put']

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # Return full cart so frontend stays in sync
        cart_serializer = CartSerializer(instance.cart)
        return Response(cart_serializer.data)


class RemoveFromCartView(generics.DestroyAPIView):
    """Remove an item from the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ClearCartView(APIView):
    """Clear all items from the cart."""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
