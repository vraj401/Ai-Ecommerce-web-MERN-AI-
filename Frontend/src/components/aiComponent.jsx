import { useState } from "react";
import { addToCart } from "../api/cartApi";
import { chatWithAI } from "../api/ai.API";
import { fetchProductsByPids } from "../api/productApi";

function AIChat() {

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const openProductPage = (productId) => {
    window.open(`/product/${productId}`, "_blank", "noopener,noreferrer");
  };

  const sendMessage = async () => {

    if (!message.trim()) return;

    // USER MESSAGE
    const userMessage = {
      type: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const res = await chatWithAI(message);
      const aiData = res.data || {};
      const aiProducts = Array.isArray(aiData.products)
        ? aiData.products
        : [];
      const hasFullProducts = aiProducts.some((product) => product._id);
      const pids = hasFullProducts
        ? []
        : aiProducts
            .map((product) => product.pid || product)
            .filter(Boolean);

      const productRes = pids.length
        ? await fetchProductsByPids(pids)
        : { data: { products: aiProducts } };

      const aiMessage = {
        type: "ai",
        text: aiData.answer || "",
        filters: aiData.filters || {},
        reasoning: aiData.reasoning || "",
        products: productRes.data.products || [],
      };
      

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (err) {
      console.log(err);
    }

    setMessage("");

    setLoading(false);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full shadow-lg text-xl"
      >
        🤖
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="bg-black text-white p-4 font-bold">
            AI Shopping Assistant
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {messages.map((msg, index) => (

              <div key={index}>

                {/* USER MESSAGE */}
                {msg.type === "user" && (
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-[80%]">
                      {msg.text}
                    </div>
                  </div>
                )}

                {/* AI MESSAGE */}
                {msg.type === "ai" && (
                  <div className="space-y-3">
                    {msg.text && (
                      <p className="text-sm text-gray-700">
                        {msg.text}
                      </p>
                    )}

                    {msg.reasoning && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded p-2">
                        {msg.reasoning}
                      </p>
                    )}

                    {Object.keys(msg.filters || {}).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(msg.filters).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}

                    {!msg.products.length && (
                      <p className="text-sm text-gray-500">
                        No products found.
                      </p>
                    )}

                    {msg.products.map((product) => (

                      <div
                        key={product._id}
                        onClick={() => openProductPage(product._id)}
                        className="border rounded-lg p-3 cursor-pointer hover:border-blue-600 hover:shadow-md transition-all"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openProductPage(product._id);
                          }
                        }}
                      >

                        <img
                          src={product.images?.[0]}
                          className="w-full h-32 object-contain"
                        />

                        <h3 className="font-semibold text-sm mt-2">
                          {product.title}
                        </h3>

                        <p className="text-green-600 font-bold">
                          ₹{product.sellingPrice}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product._id, 1)
                          }}
                          className="mt-2 bg-black text-white px-3 py-1 rounded"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}

                  </div>
                )}

              </div>
            ))}

            {loading && (
              <p className="text-gray-500">
                AI is thinking...
              </p>
            )}

          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask AI..."
              className="flex-1 border rounded px-3 py-2"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 rounded"
            >
              Send
            </button>

          </div>
        </div>
      )}
    </>
  );
}

export default AIChat;
