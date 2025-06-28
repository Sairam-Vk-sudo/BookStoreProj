import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'



const ShowBook = () => {
  const {id} = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("Fetching book with ID:", id)
    axios
    .get(`${import.meta.env.VITE_BACKEND_LINK}api/seeBook/${id}`)
    .then((response) => {
      setBook(response.data)
      setLoading(false)
    })
    .catch((err) => {
      console.error("Error fetching book:", err)
      setLoading(false)
    })
  }, [])
  return (
  loading ? (
    <Spinner />
  ) : book ? (
    <>
    <BackButton />
    <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Id</span>
        <span>{book._id}</span>
      </div>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Title</span>
        <span>{book.title}</span>
      </div>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Author</span>
        <span>{book.author}</span>
      </div>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Description</span>
        <span>{book.description}</span>
      </div>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Publish Year</span>
        <span>{new Date(book.publishedDate).toLocaleDateString()}</span>
      </div>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Create Time</span>
        <span>{new Date(book.createdAt).toString()}</span>
      </div>
      <div className='my-4'>
        <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
        <span>{new Date(book.updatedAt).toString()}</span>
      </div>
    </div>
    </>
  ) : (
    <div>No book found.</div>
  )
)
}

export default ShowBook