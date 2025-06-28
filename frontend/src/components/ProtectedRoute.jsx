import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token')
    const location = useLocation()

    // List of routes that should bypass token validation
    const publicRoutes = ['/signup', '/login']
    
    const validateToken = (token) => {
        if (!token) return false
        try {
            const decoded = jwtDecode(token)
            const currentTime = Date.now() / 1000
            return decoded.exp > currentTime
        }
        catch (error) {
            console.error('Token verification failed:', error)
            return false
        }
    }

    // Check if current path is in public routes
    if (publicRoutes.includes(location.pathname)) {
        return children
    }

    // For protected routes, validate token
    if (!token || !validateToken(token)) {
        localStorage.removeItem('token')
        toast.error('Please login to continue', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        })
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute