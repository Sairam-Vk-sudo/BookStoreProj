import React from 'react'
import {Route, Routes} from 'react-router-dom'
import CreateBook from './pages/CreateBook'
import DeleteBook from './pages/DeleteBook'
import EditBook from './pages/EditBook'
import ShowBook from './pages/ShowBook'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import MyBooks from './pages/MyBooks'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyWishlist from './pages/MyWishlist'
const App = () => {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <Routes>
        {/* Public Routes - No Protection */}
        <Route path='/' element={<Home/>} />
        <Route path='/showBook/:id' element={<ShowBook/>} />
        
        {/* Auth Routes - With Custom Protection */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path='/addBook' element={
          <ProtectedRoute>
            <CreateBook/>
          </ProtectedRoute>
        } />
        <Route path='/editBook/:id' element={
          <ProtectedRoute>
            <EditBook/>
          </ProtectedRoute>
        } />
        <Route path='/deleteBook/:id' element={
          <ProtectedRoute>
            <DeleteBook/>
          </ProtectedRoute>
        } />
        <Route path='/wishlist' element={
          <ProtectedRoute>
            <MyWishlist/>
          </ProtectedRoute>
        } />
        <Route path="/myBooks" element={
          <ProtectedRoute>
            <MyBooks/>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}
export default App