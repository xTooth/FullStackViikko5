import PropTypes from 'prop-types'
import React from 'react'

const loginForm = ({
  handleLogin,
  username,
  password
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
                käyttäjätunnus
        <input
          type="text"
          value={username.value}
          name="Username"
          onChange= {username.onChange}
        />
      </div>
      <div>
                salasana
        <input
          type="password"
          value={password.value}
          name="Password"
          onChange= {password.onChange}
        />
      </div>
      <button type="submit">kirjaudu</button>
    </form>
  )
}

loginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired
}

export default loginForm