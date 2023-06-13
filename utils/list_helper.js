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
  console.log(favourite)
  return favourite
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
}
