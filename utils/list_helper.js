const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  const favourite = blogs.reduce(
  // eslint-disable-next-line no-unused-vars
    (liked, { id, url, ...b}) => (!liked || b.likes > liked.likes) ? b : liked,
    null)
  return favourite
}

const mostBlogs = (blogs) => {
  const blogCount = blogs.reduce(
    (bc, b) => {
      if (bc[b.author]) bc[b.author] += 1
      else bc[b.author] = 1
      return bc
    },
    {})
  const most = Object.keys(blogCount).reduce(
    (m, author) => m.blogs > blogCount[author] ? m : { author: author, blogs: blogCount[author] },
    {})

  return most.author ? most : null
}

const mostLikes = (blogs) => {
  const likeCount = blogs.reduce(
    (bc, b) => {
      if (bc[b.author]) bc[b.author] += b.likes
      else bc[b.author] = b.likes
      return bc
    },
    {})
  const most = Object.keys(likeCount).reduce(
    (m, author) => m.likes > likeCount[author] ? m : { author: author, likes: likeCount[author] },
    {})

  return most.author ? most : null
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
