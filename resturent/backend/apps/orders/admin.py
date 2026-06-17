from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('menu_item_name', 'menu_item_price', 'quantity', 'subtotal')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'payment_method', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_method', 'payment_status', 'created_at')
    search_fields = ('user__username', 'user__email', 'delivery_address')
    inlines = [OrderItemInline]
    actions = ['mark_confirmed', 'mark_preparing', 'mark_delivered']

    @admin.action(description='Mark selected orders as confirmed')
    def mark_confirmed(self, request, queryset):
        queryset.update(status='confirmed')

    @admin.action(description='Mark selected orders as preparing')
    def mark_preparing(self, request, queryset):
        queryset.update(status='preparing')

    @admin.action(description='Mark selected orders as delivered')
    def mark_delivered(self, request, queryset):
        queryset.update(status='delivered')
