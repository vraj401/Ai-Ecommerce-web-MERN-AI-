import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ name, email, password });
      toast.success("Account created");
      navigate("/login");
    } catch (err) {
      toast.error("Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600">Join us today</p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded focus:border-blue-600 focus:outline-none transition-colors font-inherit"
              required
            />
          </div>

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
            Create Account
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;