const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
]

const listWithManyBlogs = [
  {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

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
