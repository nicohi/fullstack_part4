const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.listWithManyBlogs
      .map(b => new Blog(b))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('getting all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body).toHaveLength(helper.listWithManyBlogs.length)
    })
    test('verify that blog posts have unique identifier named "id"', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response.body.map(b => expect(b.id).toBeDefined())
    })
  })

  describe('viewing of a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blog = (await helper.blogsInDb())[0]
      const response = await api
        .get(`/api/blogs/${blog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.title).toContain(blog.title)
      expect(response.body.id).toContain(blog.id)
    })
    test('fails with status code 404 if blog does not exist', async () => {
      await api
        .get(`/api/blogs/${(await helper.nonExistingId())}`)
        .expect(404)
    })
    test('fails with status code 400 if id is invalid', async () => {
      const invalid = 'abcd'
      await api
        .get(`/api/blogs/${invalid}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = helper.listWithOneBlog[0]
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const response = await api.get('/api/blogs')
      const title = response.body.map(r => r.title)
      const author = response.body.map(r => r.author)
      const url = response.body.map(r => r.url)
      expect(response.body).toHaveLength(helper.listWithManyBlogs.length + 1)
      expect(title).toContain(newBlog.title)
      expect(author).toContain(newBlog.author)
      expect(url).toContain(newBlog.url)
    })
    test('sets likes to 0 if not set', async () => {
      // eslint-disable-next-line no-unused-vars
      const { likes, ...newBlog } = helper.listWithOneBlog[0]
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      expect(response.body.likes).toBe(0)
    })
    test('fails with status code 400 if title is missing', async () => {
      // eslint-disable-next-line no-unused-vars
      const { title, ...titleless } = helper.listWithOneBlog[0]
      await api
        .post('/api/blogs')
        .send(titleless)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
    test('fails with status code 400 if url is missing', async () => {
      // eslint-disable-next-line no-unused-vars
      const { url, ...urlless } = helper.listWithOneBlog[0]
      await api
        .post('/api/blogs')
        .send(urlless)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 for existing id', async () => {
      const blog = (await helper.blogsInDb())[0]
      await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(204)
      const blogs = (await helper.blogsInDb())
      expect(blogs.map(b => b.id)).not.toContain(blog.id)
    })
    test('succeeds with status code 204 for nonexisting id', async () => {
      await api
        .delete(`/api/blogs/${(await helper.nonExistingId())}`)
        .expect(204)
    })
    test('fails with status code 400 if id is invalid', async () => {
      const invalid = 'abcd'
      await api
        .delete(`/api/blogs/${invalid}`)
        .expect(400)
    })
  })

  describe('adding 1 to likes of an existing blog succeeds', () => {
    test('succeeds with valid data', async () => {
      const blog = (await helper.blogsInDb())[0]
      const blogPlus = { ...blog, likes: blog.likes + 1 }
      await api
        .put(`/api/blogs/${blogPlus.id}`)
        .send(blogPlus)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const updatedBlog = (await helper.blogsInDb()).find(b => b.id === blog.id)
      expect(updatedBlog.likes).toBe(blog.likes + 1)
      expect(updatedBlog.title).toContain(blog.title)
      expect(updatedBlog.author).toContain(blog.author)
      expect(updatedBlog.url).toContain(blog.url)
    })
    test('fails with status code 400 if id is invalid', async () => {
      const blog = (await helper.blogsInDb())[0]
      const updatedBlog = { ...blog, id: 'aaaaa', likes: blog.likes + 1 }

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(400)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
