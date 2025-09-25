const express = require('express')
const router = express.Router()
const { Book, Sequelize } = require('../models') // import your Book model
const { Op } = Sequelize

// GET /books - list all books - add optional search and pagination
router.get('/', (req, res) => {
  res.redirect('/books')
})

// GET /books/new - show form to create a new book
router.get('/new', (req, res) => {
  res.render('new-book', { book: {} })
})

// POST /books/new - create a new book in the database
router.post('/new', async (req, res, next) => {
  try {
    const book = await Book.create(req.body)
    res.redirect('/books')
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.render('new-book', { book: req.body, errors: error.errors })
    } else {
      next(error)
    }
  }
})

// GET /books/:id - show details/edit form for a book
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      res.render('update-book', { book })
    } else {
      const err = new Error('Book not found')
      err.status = 404
      throw err
    }
  } catch (error) {
    next(error)
  }
})

// POST /books/:id - update book info in the database
router.post('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      await book.update(req.body)
      res.redirect('/books')
    } else {
      const err = new Error('Book not found')
      err.status = 404
      throw err
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      req.body.id = req.params.id // keep id for form rendering
      res.render('update-book', { book: req.body, errors: error.errors })
    } else {
      next(error)
    }
  }
})

// POST /books/:id/delete - delete a book
router.post('/:id/delete', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      await book.destroy()
      res.redirect('/books')
    } else {
      const err = new Error('Book not found')
      err.status = 404
      throw err
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
