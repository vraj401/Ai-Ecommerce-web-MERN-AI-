import Cart from "../models/cart.model.js"
import Order from "../models/order.model.js"
import razorpay from "../services/razorpay.service.js"
import crypto from "crypto";

export const createOrder = async(req,res)=>{
   console.log("Creating order for user:", req.user._id);
   const user = req.user;
   const {shippingAddress,paymentMethod} = req.body;

   try{
const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

   const totalAmount = cart.items.reduce(
     (acc, item) =>
        acc + item.product.sellingPrice * item.quantity,
      0
   )



 const options = {
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };


 const order = await razorpay.orders.create(
      options
    );

console.log("Razorpay order created:", order);



res.json(order);


//    const order = await Order.create({
//       user: req.user._id,
//       items: cart.items.map((item) => ({
//         product: item.product._id,
//         quantity: item.quantity,
//       })),
//       totalAmount,
//       shippingAddress: req.body.shippingAddress,
//       paymentMethod: req.body.paymentMethod,
//     });

// io.to(req.user._id.toString()).emit(
//       "order_created",
//       {
//         message: "Order placed successfully",
//         orderId: order._id,
//         totalAmount,
//       }
//     );



   }catch(error){
    console.error("Error creating order:", error);
      res.status(500).json({
      message: error.message,
    });
   }
}


export const createDBorder = async(req,res)=>{
    const user = req.user;
    const {shippingAddress,paymentMethod} = req.body;
    
    try{
const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
   
   const totalAmount = cart.items.reduce(
     (acc, item) =>
        acc + item.product.sellingPrice * item.quantity,
      0
   )
    const order = await Order.create({
        user: req.user._id,
        items: cart.items.map((item) => ({  
            product: item.product._id,
            quantity: item.quantity,
        })),
        totalAmount,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
    })
    
    res.json(order);
    
}catch(error){
    console.error("Error creating order:", error);
      res.status(500).json({
      message: error.message,
    });
   }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate("items.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

      console.log("Expected Signature:", expectedSignature);
      console.log("Razorpay Signature:", razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
      });

    //   // 🔴 SOCKET EVENT
    //   io.to(order.user.toString()).emit(
    //     "payment_success",
    //     {
    //       message: "Payment successful",
    //       orderId,
    //     }
    //   );

      return res.json({ success: true });
    }



    res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};