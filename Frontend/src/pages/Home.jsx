import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [hoverCard, setHoverCard] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetchProducts();
      setProducts(res.data.products || res.data);
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Shop Our Collection</h1>
        <p className="text-sm text-gray-600">Discover our wide range of premium products</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-base text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${p._id}`);
              }}
              onMouseEnter={() => setHoverCard(p._id)}
              onMouseLeave={() => setHoverCard(null)}
              className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 shadow-md flex flex-col h-full pointer-events-auto ${
                hoverCard === p._id ? "transform -translate-y-2 shadow-lg" : ""
              }`}
              role="button"
              tabIndex={0}
            >
              <div className="w-full h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                <img 
                  src={p.images?.[0] || "https://via.placeholder.com/250x200?text=Product"} 
                  className="w-full h-full object-cover"
                  alt={p.title}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
                  {p.title}
                </h3>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-blue-600">₹{p.sellingPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;