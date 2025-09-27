const express = require('express')
const router = express.Router()
const { Book, Sequelize } = require('../models') // import your Book model
const { Op } = Sequelize

// GET /books - list all books - add optional search and pagination
router.get('/', async (req, res, next) => {
  try {
    const { search, page } = req.query
    const limit = 10 // books per page
    const currentPage = parseInt(page) || 1
    const offset = (currentPage - 1) * limit

    // Build search filter
    const where = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { author: { [Op.like]: `%${search}%` } },
            { genre: { [Op.like]: `%${search}%` } },
            { year: { [Op.like]: `%${search}%` } }
          ]
        }
      : {}

    // Find and count all books
    const { count, rows: books } = await Book.findAndCountAll({
      where,
      limit,
      offset,
      order: [['title', 'ASC']]
    })

    const totalPages = Math.ceil(count / limit)
    console.log('req.path:', req.path)

    // Only hide home button if it's the first page and no search query
    const hideHomeButton = currentPage === 1 && !search

    res.render('index', {
      books,
      currentPage,
      totalPages,
      search: search || '',
      hideHomeButton
    })
  } catch (error) {
    next(error)
  }
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
      res.render('new-book', {
        book: req.body,
        path: req.path,
        errors: error.errors
      })
    } else {
      next(error)
    }
  }
})

// GET /books/:id - show details/edit form for a book
router.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    const err = new Error(
      `The book id parameter must be a number, "${req.params.id}" is invalid. Please try again.`
    )
    err.status = 418
    next(err)
  }

  try {
    const book = await Book.findByPk(req.params.id)
    if (book) {
      res.render('update-book', { book, path: req.path })
    } else {
      const err = new Error(`Book #${req.params.id} not found`)
      err.status = 404
      next(err)
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
