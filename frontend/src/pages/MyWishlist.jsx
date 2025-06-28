import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'


const MyWishlist = () => {
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
    const fetchWishlist = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}api/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            // Debug raw response
            console.group('Wishlist Debug:')
            console.log('Raw Response:', response)
            console.log('Response Data Type:', typeof response.data)
            console.log('Is Array?', Array.isArray(response.data))
            
            if (Array.isArray(response.data)) {
                response.data.forEach((book, index) => {
                    console.log(`Book ${index + 1} Details:`)
                    console.table({
                        _id: book._id || 'missing',
                        title: book.title || 'missing',
                        author: book.author || 'missing',
                        publishedDate: book.publishedDate || 'missing',
                        description: book.description || 'missing',
                        addedBy: book.addedBy || 'missing'
                    })
                })
            } else {
                console.warn('Response data is not an array:', response.data)
            }
            console.groupEnd()

            // Only set wishlist if data is valid
            if (Array.isArray(response.data) && response.data.length > 0) {
                setWishlist(response.data)
            } else {
                setError('No valid wishlist data received')
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error)
            setError("Failed to load wishlist")
            toast.error("Failed to load wishlist")
        } finally {
            setLoading(false)
        }
    }
    fetchWishlist()
}, [token])

    return (
        <div className='p-4'>
            <h1 className='text-3xl my-8'>My Wishlist</h1>
            {loading ? (
                <Spinner />
            ) : error ? (
                <div className='text-red-500 text-center'>{error}</div>
            ) : wishlist.length === 0 ? (
                <div className='text-center text-gray-500'>
                    Your wishlist is empty
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {wishlist.map((book, index) => (
                        <div 
                            key={book._id || `wishlist-item-${index}`} 
                            className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 hover:shadow-xl transition-shadow'
                        >
                            <h2 className='text-xl font-bold mb-2'>{book.title}</h2>
                            <p className='text-gray-500 mb-1'>Author: {book.author}</p>
                            <p className='text-gray-500'>
                                Published: {new Date(book.publishedDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyWishlist