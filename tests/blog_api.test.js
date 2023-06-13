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

})

afterAll(async () => {
  await mongoose.connection.close()
})
