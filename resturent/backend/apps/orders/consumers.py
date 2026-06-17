import json
from channels.generic.websocket import AsyncWebsocketConsumer


class OrderConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.order_id = self.scope.get(
            "url_route", {}
        ).get(
            "kwargs", {}
        ).get(
            "order_id"
        )

        self.group_name = (
            f"order_{self.order_id}"
            if self.order_id
            else "orders_all"
        )

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data.get("type") == "ping":
            await self.send(
                text_data=json.dumps({
                    "type": "pong"
                })
            )

    async def order_status_update(self, event):
        await self.send(
            text_data=json.dumps({
                "type": "order_status_update",
                "data": event["data"]
            })
        ) 
 