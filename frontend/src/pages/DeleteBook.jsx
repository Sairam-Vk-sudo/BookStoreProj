import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'


const DeleteBook = () => {
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleDeleteBook = () => {
    setLoading(true)
    axios
      .delete(`${import.meta.env.VITE_BACKEND_LINK}/deleteBook/${id}`)
      .then(() => {
        setLoading(false)
        navigate('/')
      })
      .catch((err) => {
        console.error("Error deleting book:", err)
        setLoading(false)
      })
  }
  return (
    <div className='p-4'>Add commentMore actions
      <BackButton />
      <h1 className='text-3xl my-4'>Delete Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are You Sure You want to delete this book?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  )
}

export default DeleteBook