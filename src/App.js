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
  const title = useField('text')
  const author = useField('text')
  const url= useState('text')

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
      username.resetter()
      password.resetter()
      console.log('käyttäjätunnus tai salasana virheellinen')
    }
  }
  function handleBlogAdd() {
    const newBlog = { author: author.value, title: title.value, url: url.value, likes: 0, user: user.id }
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
          value={title.value}
          name="title"
          onChange= {title.onChange}
        />
      </div>
      <div>
        Author
        <input
          type="text"
          value={author.value}
          name="author"
          onChange={author.onChange}
        />
      </div>
      <div>
        URL
        <input
          type="text"
          value={url.value}
          name="url"
          onChange={url.onChange}
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