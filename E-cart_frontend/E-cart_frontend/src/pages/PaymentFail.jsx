import React from "react";

const PaymentFail = () => {
  const status = "cancel";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h1 className="text-2xl font-bold text-red-600">Payment {status === "failed" ? "Failed" : "Canceled"}</h1>
            <p className="mt-4 text-gray-600">Unfortunately, your transaction was not successful.</p>
            <p className="mt-2 text-gray-600">Please try again or contact support.</p>
        <a href="/cart" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
          Go Back to Cart
        </a>
      </div>
    </div>
  );
};

export default PaymentFail;
