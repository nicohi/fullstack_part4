const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.listWithManyBlogs
    .map(b => new Blog(b))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
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

  describe('viewing of a specific blog', () => {
    test('succeeds with valid a valid id', async () => {
    })
    test('fails with status code 404 if note does not exist', async () => {
    })
    test('fails with status code 400 if id is invalid', async () => {
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
    test('fails with status code 400 if data is invalid', async () => {
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 200', async () => {
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
