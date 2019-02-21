import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')

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
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('käyttäjätunnus tai salasana virheellinen')
    }
  }
  function handleBlogAdd() {
    const newBlog = { author: author, title: title, url: url, likes: 0, user: user.id }
    blogService.create(newBlog)
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        käyttäjätunnus
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        salasana
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">kirjaudu</button>
    </form>
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
          {addBlog()}
          {blogForm()}
        </div>
      }
    </div>
  )
}

export default App