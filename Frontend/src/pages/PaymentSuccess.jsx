import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Your order has been placed successfully.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
