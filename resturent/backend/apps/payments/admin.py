from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "user",
        "amount",
        "payment_status",
        "created_at",
    )

    list_filter = (
        "payment_status",
        "created_at",
    )

    search_fields = (
        "user__email",
        "user__username",
        "utr_number",
    )

    readonly_fields = (
        "created_at",
    )