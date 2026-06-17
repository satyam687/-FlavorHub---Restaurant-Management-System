import api from "./axios";

export const createUPIPayment = (orderId) =>
    api.post("/payments/upi/create/", {
        order_id: orderId
    });

export const verifyUPIPayment = (data) =>
    api.post("/payments/upi/verify/", data);
 