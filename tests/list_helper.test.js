const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('an empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })

})

describe('favourite blog', () => {
  test('with empty list is null', () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toEqual(null)
  })

  test('with one blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
      title: 'Go To Statement Considered Harmful'
    }
    expect(result).toEqual(expected)
  })

  test('with many blogs', () => {
    const result = listHelper.favouriteBlog(listWithManyBlogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 12,
      title: 'Canonical string reduction',
    }
    expect(result).toEqual(expected)
  })
})

describe('most blogs', () => {
  test('with empty list is null', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual(null)
  })

  test('with one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    }
    expect(result).toEqual(expected)
  })

  test('with many blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3,
    }
    expect(result).toEqual(expected)
  })
})

describe('most likes', () => {
  test('with empty list is null', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual(null)
  })

  test('with one blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    }
    expect(result).toEqual(expected)
  })

  test('with many blogs', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }
    expect(result).toEqual(expected)
  })
})
