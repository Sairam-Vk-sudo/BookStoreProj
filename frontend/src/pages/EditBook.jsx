import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import { Link, useNavigate } from 'react-router-dom'

const EditBook = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [publishedDate, setPublishedDate] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_LINK}api/updateBook/${id}`)
      .then((response) => {
        setBook(response.data)
        setTitle(response.data.title)
        setAuthor(response.data.author)
        setDescription(response.data.description)
        setPublishedDate(new Date(response.data.publishedDate).toISOString().split('T')[0])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching book:", err)
        setLoading(false)
      })
  })

  const handleEditBook = () => {
    const updatedBookData = {
      title,
      author,
      description,
      publishedDate
    }
    setLoading(true)
    axios
      .put(`${import.meta.env.VITE_BACKEND_LINK}api/updateBook/${id}`, updatedBookData)
      .then(() => {
        setLoading(false)
        navigate(`/`)
      })
      .catch((err) => {
        console.error("Error updating book:", err)
        setLoading(false)
      })
  }
  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Date</label>
          <input
            type='date'
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditBook}>
          Save
        </button>
      </div>
    </div>
  )
}

export default EditBook