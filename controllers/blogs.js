const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

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
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = (await User.findById(decodedToken.id)).toJSON()
  const blog = request.body
  if ((await Blog.findById(request.params.id)).user !== user.id) {
    return response.status(401).json({ error: 'blog owned by different user' })
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
                                                   blog,
                                                   { new: true, runValidators: true, context: 'query' })
  response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = (await User.findById(decodedToken.id)).toJSON()
  const blog = new Blog({ ...request.body, user: user.id })

  const result = await blog.save()
  await User.findByIdAndUpdate(user.id, { blogs: user.blogs.concat(blog.id) })
  response.status(201).json(result)
})

module.exports = blogsRouter
