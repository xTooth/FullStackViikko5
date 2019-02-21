import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('käyttäjätunnus tai salasana virheellinen')
    }
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
      <button type="submit" onClick={logout}>Kirjaudu ulos</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
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
          {blogForm()}
        </div>
      }
    </div>
  )
}

export default App