from rest_framework import serializers
from .models import Category, MenuItem 
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'is_active')

class MenuItemDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = MenuItem
        fields = (
            'id', 'name', 'slug', 'description', 'price', 'image',
            'category', 'is_vegetarian', 'is_spicy','Non-Vegetarian',
            'preparation_time', 'availability', 'is_active',
            'created_at', 'updated_at',
        )


class MenuItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'image',
            'food_type',
            'is_spicy',
            'preparation_time',
            'availability',
        ]