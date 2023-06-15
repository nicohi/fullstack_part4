const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const checkUserCanModify = async (request, response, next) => {
  request.canModifyBlog = false
  if (request.params.id && request.token) {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (decodedToken.id) {
      const user = await User.findById(decodedToken.id)
      const blog = await Blog.findById(request.params.id)
      const userId = user.id.toString()
      const blogUserId = blog.user.toString()
      request.canModifyBlog = userId === blogUserId
    }
  }
  next()
}

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

blogsRouter.delete('/:id', checkUserCanModify, async (request, response) => {
  if (!request.canModifyBlog) {
    return response.status(401).json({ error: 'blog owned by different user' })
  }
  const result = await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', checkUserCanModify, async (request, response) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (!request.canModifyBlog) {
    return response.status(401).json({ error: 'blog owned by different user' })
  }
  const blog = request.body
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
