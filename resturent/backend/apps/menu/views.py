from rest_framework import generics, permissions

from .models import Category, MenuItem
from .serializers import (
    CategorySerializer,
    MenuItemListSerializer,
    MenuItemDetailSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Read access for everyone.
    Write access only for admin users.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


# ==================================
# Category Views
# ==================================

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"


# ==================================
# Menu Item Views
# ==================================

class MenuItemListView(generics.ListAPIView):
    serializer_class = MenuItemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = MenuItem.objects.filter(
            is_active=True
        ).select_related("category")

        category_slug = self.request.GET.get(
            "category__slug"
        )

        if category_slug:
            queryset = queryset.filter(
                category__slug=category_slug
            )

        return queryset


class FeaturedMenuItemView(generics.ListAPIView):
    serializer_class = MenuItemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return MenuItem.objects.filter(
            is_active=True,
            is_featured=True
        ).select_related("category")


class MenuItemDetailView(generics.RetrieveAPIView):
    queryset = MenuItem.objects.filter(
        is_active=True
    )
    serializer_class = MenuItemDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


# ==================================
# Admin Views
# ==================================

class AdminMenuItemView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all().select_related(
        "category"
    )
    serializer_class = MenuItemDetailSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminMenuItemDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemDetailSerializer
    permission_classes = [permissions.IsAdminUser]