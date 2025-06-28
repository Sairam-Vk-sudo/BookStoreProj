import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'
import {AiOutlineEdit} from 'react-icons/ai'
import {BsInfoCircle} from 'react-icons/bs'
import {MdOutlineAddBox, MdOutlineDelete} from 'react-icons/md'


const myBooks = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    
      const fetchBooks = async () => {
        try{
          setLoading(true)
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}api/myBooks`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          console.log("Books fetched:", response.data)
          if (response.status === 200) {
            console.log("Books fetched successfully:", response.data)
            setLoading(false)
            setBooks(response.data)
          } else {
            console.error("Failed to fetch books:", response.statusText)
          }
      } catch (error) {
          console.error("Error fetching books:", error)
        }
    };

    fetchBooks()
  }, [])

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
              <div className='flex justify-between items-center gap-x-2 mt-4 p-4'>
                <Link to={`/showBook/${book._id}`}>
                  <BsInfoCircle className='text-2xl text-green-800 hover:text-black' />
                </Link>
                <Link to={`/editBook/${book._id}`}>
                  <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-black' />
                </Link>
                <Link to={`/deleteBook/${book._id}`}>
                <MdOutlineDelete className='text-2xl text-red-600 hover:text-black' />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default myBooks