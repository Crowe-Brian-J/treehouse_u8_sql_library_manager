const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const booksRouter = require('./routes/books')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/books', booksRouter)

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Sorry, page not found')
  err.status = 404
  res.status(404).render('page-not-found', { error: err })
})

// Global error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500
  err.message = err.message || 'Something went wrong'
  console.error(`Error ${err.status}: ${err.message}`)
  res.status(err.status).render('error', { err })
})

module.exports = app

// Sequelize DB Connection
const { sequelize } = require('./models')

// Using void to avoid ghost semi-colon
void (async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully')
    await sequelize.sync()
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)
  }
})()
