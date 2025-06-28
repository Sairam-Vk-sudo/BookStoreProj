import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Spinner from '../components/Spinner'
import { Link, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'


const CreateBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [publishedDate, setPublishedDate] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSaveBook = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.username) {
        console.log(user.username)
        throw new Error('User not logged in');
        }

    const bookData = {
      title,
      author,
      description,
      publishedDate,
      addedBy: user.username 
    }
    setLoading(true)
    axios
      .post(`${import.meta.env.VITE_BACKEND_LINK}api/addBook`, bookData)
      .then(() => {
        setLoading(false)
        navigate('/')
      })
      .catch((err) => {
        console.error("Error adding book:", err)
        setLoading(false)
      })
  }

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Book</h1>
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
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveBook}>
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateBook