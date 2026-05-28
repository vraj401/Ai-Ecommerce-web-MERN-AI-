import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Product from './pages/Product';
import Cart from './pages/Cart';
import ProtectedRoute from './protectedRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './pages/Orders';
import { Toaster } from 'react-hot-toast';
import SocketListener from './components/SocketListner';
import AIChat from './components/aiComponent';


function App() {
useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      socket.emit("join_room", user._id);
    }
  }, []);
 
  return (
    <>
       <div className="bg-gray-50 min-h-screen">
     <Toaster position="top-center" />
      <SocketListener />
     <Navbar />

     <AIChat/>

     <Routes>
      <Route path="/" element={
        <ProtectedRoute>
        <Home />
        </ProtectedRoute>        
        } />
      <Route path="/login" element={
        
        <Login />
      } />
      <Route path="/register" element={
        <Register />
      } />
      <Route path="/product/:id" element={
        <ProtectedRoute>
        <Product />
        </ProtectedRoute>   
        } />
      <Route path="/cart" element={
        <ProtectedRoute>
        <Cart />
        </ProtectedRoute>
        } />
      <Route path="/payment" element={
        <ProtectedRoute>
        <Payment />
        </ProtectedRoute>
        } />
      <Route path="/payment-success" element={
        <ProtectedRoute>
        <PaymentSuccess />
        </ProtectedRoute>
        } />
      <Route path="/orders" element={
        <ProtectedRoute>
        <Orders />
        </ProtectedRoute>
        } />
    </Routes>
        </div>
     </>
  )
}

export default App
