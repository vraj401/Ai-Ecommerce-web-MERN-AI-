import { useEffect, useState } from "react";
import { addToCart } from "../api/cartApi";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../api/productApi";
import { trackEvent } from "../utils/track";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
  if (product) {
    trackEvent("VIEW_PRODUCT", {
      productId: product._id,
      category: product.category,
    });
  }
}, [product]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchProductById(id);
      setProduct(res.data);
    };

    load();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Login required or error");
    }
  };

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading product details...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
          {/* Image Section */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-5">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/400?text=Product"}
              className="w-full h-auto"
              alt={product.title}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-start">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* Price Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-4xl font-bold text-blue-600">₹{product.sellingPrice}</p>
              {product.originalPrice && product.originalPrice > product.sellingPrice && (
                <p className="text-sm text-gray-400 mt-2">
                  <strike>₹{product.originalPrice}</strike>
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.description || "High-quality product with excellent features and durability."}
            </p>

            {/* Specifications */}
            <div className="mb-6 text-sm">
              {product.category && (
                <div className="flex py-2 text-gray-600">
                  <span className="font-semibold text-gray-900 min-w-max mr-4">Category:</span>
                  <span>{product.category}</span>
                </div>
              )}
              {product.brand && (
                <div className="flex py-2 text-gray-600">
                  <span className="font-semibold text-gray-900 min-w-max mr-4">Brand:</span>
                  <span>{product.brand}</span>
                </div>
              )}
              {product.inStock !== undefined && (
                <div className="flex py-2 text-gray-600">
                  <span className="font-semibold text-gray-900 min-w-max mr-4">Availability:</span>
                  <span className={product.inStock ? "text-green-600" : "text-red-500"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full bg-blue-600 text-white py-3 rounded font-bold text-base cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-colors pointer-events-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;