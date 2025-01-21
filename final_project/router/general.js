const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, email, password } = req.body;
  isValid(username);

  if (!email || !password) {
    res.json("not valid inputs");
    return;
  }

  users.push({ username, email, password });
  console.log(users);

  return res.status(200).json({ users, message: "books" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const book = books;

  return res.status(200).json({ book, message: "books" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (!isbn) {
    res.send("no book found with that isbn");
    return;
  }

  const getBook = books[isbn];

  return res.status(200).json({ getBook, message: "with isbn" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Extract author from request parameters
  const { author } = req.params;

  if (!author) {
    res.status(400).send("No author provided");
    return;
  }

  // Filter books where the author matches the given parameter
  const filteredBooks = Object.fromEntries(
    Object.entries(books).filter(([key, value]) => value.author === author)
  );

  if (Object.keys(filteredBooks).length === 0) {
    res.status(404).send("No books found for the given author");
    return;
  }

  return res.status(200).json({ books: filteredBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here

  const { title } = req.params;

  if (!title) {
    res.send("no book with that title");
    return;
  }

  const getBookByTitle = Object.fromEntries(
    Object.entries(books).filter(([key, value]) => value.title == title)
  );

  return res.json({ book: getBookByTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  if (!isbn) {
    res.status(400).json({ message: "No ISBN provided" });
    return;
  }

  const book = books[isbn];

  if (!book) {
    res.status(404).json({ message: "Book not found for the given ISBN" });
    return;
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
