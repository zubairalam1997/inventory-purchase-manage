import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import List from './components/list_items/list_items';
import AddItems from './components/list_items/addItems';
import LoginPage from './components/authentication/login';
import SignUpPage from './components/authentication/signup';
import IssuedItems from './components/list_items/issued_items/issuedItems';
import ChatRoom from './components/list_items/issued_items/item_issuing_form';
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/context/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/addItems" element={<ProtectedRoute><AddItems /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/issued-items" element={<ProtectedRoute><IssuedItems /></ProtectedRoute>} />
          <Route path="/chat-room" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
