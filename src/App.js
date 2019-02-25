import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { useField } from './hooks/index'

const App = () => {
  const username = useField('text')
  const password = useField('text')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value , password: password.value
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      console.log('käyttäjätunnus tai salasana virheellinen')
    }
  }
  function handleBlogAdd() {
    const newBlog = { author: author, title: title, url: url, likes: 0, user: user.id }
    blogService.create(newBlog)
  }


  const loginForm = () => (
    <LoginForm handleLogin={handleLogin} username={username} password={password} />
  )

  function logout() {
    window.localStorage.clear()
    window.location.reload(true)
  }

  const blogForm = () => (
    <div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
  const addBlog = () => (
    <form onSubmit={handleBlogAdd}>
      <div>
        Title
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL
        <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">luo uusi blogi</button>
    </form>

  )
  return (
    <div>

      {user === null ?
        <div>
          <h2>Login</h2>
          {loginForm()} </div> :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p >
          <button type="submit" onClick={logout}>Kirjaudu ulos</button>
          <Togglable buttonLabel='luo uusi blogi'>
            {addBlog()}
          </Togglable>
          {blogForm()}
        </div>
      }
    </div>
  )
}

export default App