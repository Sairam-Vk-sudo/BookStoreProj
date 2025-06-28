import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'
import {AiOutlineEdit, AiOutlineHeart, AiFillHeart} from 'react-icons/ai'
import {BsInfoCircle} from 'react-icons/bs'
import {MdOutlineAddBox, MdOutlineDelete} from 'react-icons/md'
import { toast } from 'react-toastify'


const Home = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_LINK}api/seeBooks`)
      .then((response) => {
        setBooks(response.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching books:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
  if (token) {
    axios
      .get(`${import.meta.env.VITE_BACKEND_LINK}api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const wishlistIds = response.data.map(book => book._id);
        console.log("Initial wishlist fetched:", wishlistIds);
        setWishlist(wishlistIds);
      })
      .catch(error => {
        console.error('Error fetching initial wishlist:', error);
        toast.error("Failed to load wishlist");
      });
  }
}, [token]);

const isInWishlist = (bookId) => {
    return wishlist.includes(bookId);
  };

  const toggleWishlist = async (bookId) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_LINK}api/wishlist/${bookId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) {
      const isAdded = response.data.inWishlist;
      setWishlist(prevWishlist => {
        if (isAdded) {
          return [...prevWishlist, bookId];
        } else {
          return prevWishlist.filter(id => id !== bookId);
        }
      });
      toast.success(isAdded ? 'Added to wishlist' : 'Removed from wishlist');
    }
  } catch (error) {
    console.error("Error updating wishlist:", error);
    toast.error(error.response?.data?.message || "Failed to update wishlist");
  }
};

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl my-8'>Books List</h1>
        <Link to='/addBook'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {books.map((book, index) => (
            <div key={book._id} className='border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl'>
              <h2 className='absolute top-1 right-2 px-4 py-1 bg-red-300 rounded-lg'>
                {index + 1}
              </h2>
              <h4 className='my-2 text-gray-500'>Title</h4>
              <div className='text-lg font-bold mb-4'>{book.title}</div>
              <h4 className='my-2 text-gray-500'>Author</h4>
              <div className='text-lg mb-4'>{book.author}</div>
              <h4 className='my-2 text-gray-500'>Publish Date</h4>
              <div className='text-lg mb-4'>
                {new Date(book.publishedDate).toLocaleDateString()}
              </div>
              <h4 className='my-2 text-gray-500'>Added By</h4>
              <div className='text-lg mb-4'>{book.addedBy}</div>
            {/* Wishlist heart button */}
              {token && (
    <div 
      className="absolute bottom-2 right-2 cursor-pointer"
      onClick={() => toggleWishlist(book._id)}
    >
      {isInWishlist(book._id) ? (
        <AiFillHeart className="text-2xl text-pink-500" />
      ) : (
        <AiOutlineHeart className="text-2xl hover:text-pink-500" />
      )}
    </div>
  )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home