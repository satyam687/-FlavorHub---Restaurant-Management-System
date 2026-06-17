from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from apps.orders.models import Order

class CreateUPIPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")

        try:
            order = Order.objects.get(
                id=order_id,
                user=request.user
            )

            UPI_ID = "8966815546@axl"

            upi_link = (
                f"upi://pay?"
                f"pa={UPI_ID}"
                f"&pn=FlavorHub"
                f"&am={order.total_amount}"
                f"&cu=INR"
                f"&tn=Food Order #{order.id}"
            )

            return Response({
                "success": True,
                "order_id": order.id,
                "amount": order.total_amount,
                "upi_link": upi_link
            })

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=404
            )
class VerifyUPIPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        order_id = request.data.get("order_id")
        utr_number = request.data.get("utr_number")

        try:
            order = Order.objects.get(
                id=order_id,
                user=request.user
            )

            Payment.objects.create(
                order=order,
                user=request.user,
                amount=order.total_amount,
                utr_number=utr_number,
                payment_status="completed"
            )

            order.payment_status = "completed"
            order.order_status = "confirmed"
            order.save()

            return Response({
                "success": True
            })

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=400)
 