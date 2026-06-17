from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    MenuItemListView, MenuItemDetailView,
    AdminMenuItemView, AdminMenuItemDetailView
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category_list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
    path('items/', MenuItemListView.as_view(), name='menu_item_list'),
    path('items/<slug:slug>/', MenuItemDetailView.as_view(), name='menu_item_detail'),
    path('admin/items/', AdminMenuItemView.as_view(), name='admin_menu_item_list'),
    path('admin/items/<int:pk>/', AdminMenuItemDetailView.as_view(), name='admin_menu_item_detail'),
]
 
 