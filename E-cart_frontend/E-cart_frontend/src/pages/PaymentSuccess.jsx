import React, { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { getProfile } from './auth';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");

    const location = useLocation();
    const searchParamsObject = new URLSearchParams(location.search);
    const orderIds = searchParamsObject.get("order_ids")?.split(",") || [];

    const updateOrders = async (orderIds) => {
        let user_profile = await getProfile();
        user_profile = user_profile.data
    
        const order_response = await fetch("http://127.0.0.1:8004/api/update/orders/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            "customer_id": user_profile.id,
            "order_ids": orderIds,
            "method": "stripe"
            }),
        });
        return order_response    
    };

    useEffect(() => {
        updateOrders(orderIds)
    }, [orderIds]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
                <h1 className="mt-2 text-2xl text-gray-600">Order {orderId} created</h1>
                <p className="mt-4 text-gray-600">Thank you for your payment. Your transaction was completed successfully.</p>
                <p className="mt-2 text-gray-600">You will receive a confirmation email shortly.</p>
                <a href="/orders" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
                    Go Back Order
                </a>
            </div>
        </div>
    );
};

export default PaymentSuccess;
