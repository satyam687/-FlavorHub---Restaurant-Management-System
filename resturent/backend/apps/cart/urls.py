from django.urls import path
from .views import (
    CartDetailView, AddToCartView, UpdateCartItemView,
    RemoveFromCartView, ClearCartView
)

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart_detail'),
    path('add/', AddToCartView.as_view(), name='add_to_cart'),
    path('items/<int:pk>/', UpdateCartItemView.as_view(), name='update_cart_item'),
    path('items/<int:pk>/remove/', RemoveFromCartView.as_view(), name='remove_cart_item'),
    path('clear/', ClearCartView.as_view(), name='clear_cart'),
]
