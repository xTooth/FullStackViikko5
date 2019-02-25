import React from 'react'
import 'jest-dom/extend-expect'
import { render, cleanup, fireEvent } from 'react-testing-library'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('renders content', () => {
  const blog = {
    author:'asdasd',
    title:'adsadadsasd',
    likes:7
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'adsadadsasd asdasdblog has 7 likes'
  )
})

it('clicking the button twice calls event handler twice', async () => {

  const mockHandler = jest.fn()

  const blog = {
    author:'asdasd',
    title:'adsadadsasd',
    likes:7
  }

  const { getByText } = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)
  expect(mockHandler.mock.calls.length).toBe(2)
})