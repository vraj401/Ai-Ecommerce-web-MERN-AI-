import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loginImg from "../assets/Login_img.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
        const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-600">Login to your account</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded focus:border-blue-600 focus:outline-none transition-colors font-inherit"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded focus:border-blue-600 focus:outline-none transition-colors font-inherit"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded text-base font-bold cursor-pointer hover:bg-blue-700 transition-colors mt-2 pointer-events-auto"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;