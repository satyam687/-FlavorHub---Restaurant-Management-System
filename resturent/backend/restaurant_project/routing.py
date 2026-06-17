from django.urls import path
from apps.orders.consumers import OrderConsumer

websocket_urlpatterns = [
    path('ws/orders/<int:order_id>/', OrderConsumer.as_asgi()),
    path('ws/orders/', OrderConsumer.as_asgi()),
]
