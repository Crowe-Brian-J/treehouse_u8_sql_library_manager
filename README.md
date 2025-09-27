# Library Manager

Library Manager is a web application for managing a collection of books. Users can add, edit, delete, and search for books with a clean interface and responsive layout.

## Features

- Add new books with title, author, genre, and year fields.
- Edit and update existing books.
- Delete books from the collection.
- Search books by title, author, genre, or year (case-insensitive, partial matches supported).
- Paginated book list for easy navigation.
- Friendly error handling for non-existent routes or invalid book IDs.
- Responsive and professional design using CSS and Pug templates.

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** SQLite with Sequelize ORM
- **Templating Engine:** Pug
- **Styling:** CSS
- **Logging:** Morgan

## Clone Repository

1. Click the '< > Code' Button on the top right of this page. It should be green. Choose how you would like to clone it.
2. Use 'git clone <whatever way you chose>' - then cd into the directory you cloned my repository into
3. Use 'npm install' to install dependencies
4. Set up the database
  - SQLite will be created automatically when you run the app
  - No manual setup required

## Running the Application

1. Run 'npm start' in your command line while in the project directory
2. Open your browser and navigate to http://localhost:3000 to access the book list

## Project Structure

'/models     - Sequelize models'
'/routes     - Express routes'
'/views      - Pug templates for pages'
'/public     - CSS'
'app.js      - Main Express application'

## Validation and Error Handling

- Forms validate required fields (title and author) using Sequelize validation
- Friendly "Page Not Found" for invalid routes
- Error page for unexpected server errors

## License

This project is licensed under the MIT License and used in pursuit of Team Treehouse's Full Stack JavaScript Tech Degree.