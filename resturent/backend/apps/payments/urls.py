from django.urls import path
from .views import CreateUPIPaymentView, VerifyUPIPaymentView

urlpatterns = [
    path(
        "upi/create/",
        CreateUPIPaymentView.as_view(),
        name="upi-create"
    ),
    path(
        "upi/verify/",
        VerifyUPIPaymentView.as_view(),
        name="upi-verify"
    ),
]

