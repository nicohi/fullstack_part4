const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const validationError = message => {
  let e = new Error(message)
  e.name = 'ValidationError'
  return e
}

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (password.length <= 3) {
    throw validationError('password must be longer than 3 characters')
  }
  if (username.length <= 3) {
    throw validationError('username must be longer than 3 characters')
  }
  const users = await User.find({})
  if (users.map(u => u.username).includes(username)) {
    throw validationError('username must be unique')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
