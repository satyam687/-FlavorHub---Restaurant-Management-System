from rest_framework import serializers
from .models import Cart, CartItem
from apps.menu.serializers import MenuItemListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemListSerializer(source='menu_item', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ('id', 'menu_item', 'menu_item_detail', 'quantity', 'special_instructions', 'subtotal')
        read_only_fields = ('id', 'subtotal')

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class CartItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ('quantity', 'special_instructions')

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price', 'total_items', 'created_at', 'updated_at')
