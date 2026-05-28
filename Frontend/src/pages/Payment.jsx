import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import { clearCart, getCart } from "../api/cartApi";
import API from "../api/axios";

function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setpaymentMethod] = useState("Razorpay");
  const [promoCode, setPromoCode] = useState("");
  const [address,setAddress] = useState("kapadwanj");
  const [city,setCity] = useState("kapadwanj");
  const [postalCode,setPostalCode] = useState("387620");
  const [phone,setPhone] = useState("");
  const [country] = useState("India");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {

    const fetchCart = async ()=>{

        const cartResponse = await getCart();
        const cartTotalAmount = cartResponse.data.items.reduce(
     (acc, item) =>
        acc + item.product.sellingPrice * item.quantity,
      0
   )
        setTotalAmount(cartTotalAmount);
    }

    fetchCart();
  }, []);

  const handlePayment = async () => {
    const shippingAddress ={
        address,
        city,
        postalCode,
        phone,
        country
    }

    try {

        const user = JSON.parse(localStorage.getItem("user"));
         const cartResponse = await getCart();
        const cartData = cartResponse.data;
      console.log("Cart data amount in payment:", cartData.totalAmount);
       const DBorderResponse = await API.post("/order/createDBorder", {
            shippingAddress,
            paymentMethod,
            userId: user?._id,
            items: cartData.items.map(item => ({
                product: item._id,
                quantity: item.quantity,
            })),
           
        });
        
        const DBorderData = DBorderResponse.data;
         
        
        if(paymentMethod === "COD"){
            navigate("/");
            return;
        }
      
      const res = await createOrder(shippingAddress, paymentMethod);
      const razorpayOrder = res.data;

        console.log("razorpay:",razorpayOrder);
    
    const options = {
      key: 'rzp_test_SjaQ5jH1ohVMeZ',
      amount: razorpayOrder.amount, // ✅ use backend value
      currency: razorpayOrder.currency,
      name: 'Acme Corp',
      description: 'Test Transaction',
      order_id: razorpayOrder.id, // ✅ IMPORTANT (dynamic)
      handler: async function (response) {
        console.log("Payment success:", response);
        // You can verify the payment on the server here by sending response.razorpay_payment_id, response.razorpay_order_id, and response.razorpay_signature
console.log("razorpay response in handler:", response);

       const verifyResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/order/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: DBorderData._id,
            amount: razorpayOrder.totalAmount,
              
    userId: user?._id
        })
       })


            const verifyData = await verifyResponse.json();
            if(verifyResponse.status === 200){
                toast.success("Payment successful and verified!");
                navigate("/payment-success");
                const clearcart = await clearCart(user?._id);
               setPromoCode("");
               setAddress("");
               setCity("");
               setPostalCode("");
               setPhone("");

            } else {
                alert("Payment verification failed: " + verifyData.message);
            }


      },
      prefill: {
        name: 'Gaurav Kumar',
        email: 'gaurav.kumar@example.com',
        contact: '9999999999'
      },
      theme: { color: '#F37254' }
    };

     const rzp = new window.Razorpay(options);
    rzp.open();

    console.log("rzp response:", rzp);
    rzp.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});

    } catch (err) {
        console.error("Payment error:", err);
      toast.error("Unable to place order");
    }
  };

  const orderSummary = {
    subtotal: totalAmount,
    shipping: 100,
    tax: 50,
    discount: 0,
  };

  const total = orderSummary.subtotal + orderSummary.shipping + orderSummary.tax - orderSummary.discount;

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Payment & Address */}
          <div className="lg:col-span-2">
            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm mb-4"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e)=>{setPhone(e.target.value)}}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm mb-4"
              />

              <input
                type="text"
                placeholder="Address"
                onChange={(e)=>{setAddress(e.target.value)}}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  onChange={(e)=>{setCity(e.target.value)}}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  onChange={(e)=>{setPostalCode(e.target.value)}}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Razorpay */}
              <div className="mb-6 p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: paymentMethod === "Razorpay" ? "#2563eb" : "#e5e7eb",
                  backgroundColor: paymentMethod === "Razorpay" ? "#f0f9ff" : "white"
                }}
                onClick={() => setpaymentMethod("Razorpay")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setpaymentMethod("Razorpay")}
                    className="mr-3 w-5 h-5 cursor-pointer"
                  />
                  <label className="text-base font-semibold text-gray-900 cursor-pointer">
                    Razorpay
                  </label>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: paymentMethod === "COD" ? "#2563eb" : "#e5e7eb",
                  backgroundColor: paymentMethod === "COD" ? "#f0f9ff" : "white"
                }}
                onClick={() => setpaymentMethod("COD")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setpaymentMethod("COD")}
                    className="mr-3 w-5 h-5 cursor-pointer"
                  />
                  <label className="text-base font-semibold text-gray-900 cursor-pointer">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">₹{orderSummary.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-semibold">₹{orderSummary.shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-semibold">₹{orderSummary.tax}</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-semibold">-₹{orderSummary.discount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">₹{total}</span>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:border-blue-600 focus:outline-none text-sm"
                  />
                  <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded font-semibold text-sm hover:bg-gray-300 active:bg-gray-400 transition-colors pointer-events-auto" type="button">
                    Apply
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handlePayment();
                }}
                className="w-full bg-blue-600 text-white py-4 rounded font-bold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors pointer-events-auto"
              >
                Complete Payment
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/cart");
                }}
                className="w-full mt-3 bg-gray-200 text-gray-900 py-3 rounded font-bold text-base hover:bg-gray-300 active:bg-gray-400 transition-colors pointer-events-auto"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
