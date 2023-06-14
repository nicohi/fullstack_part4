const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
                          .populate('user', { username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id) 
                          .populate('user', { username: 1, name: 1})
  if (blog) response.json(blog)
  else response.status(404).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
                                                   blog,
                                                   { new: true, runValidators: true, context: 'query' })
  response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response) => {
  const users = await User.find({})
  const user = users[0]
  const blog = new Blog({ ...request.body, user: user.id })

  const result = await blog.save()
  await User.findByIdAndUpdate(user.id, { blogs: user.blogs.concat(blog.id) })
  response.status(201).json(result)
})

module.exports = blogsRouter
