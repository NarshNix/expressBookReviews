const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  isValid(username);

  if (!password) {
    res.json("not valid inputs");
    return;
  }

  users.push({ username, password });
  console.log(users);

  return res.status(200).json({ users, message: "books" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const getAllBooks = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 1000); // Simulate delay
      });
    };

    const allBooks = await getAllBooks();
    res.status(200).json({ books: allBooks });
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => res.status(200).json({ book }))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const { author } = req.params;

  try {
    const filteredBooks = Object.fromEntries(
      Object.entries(books).filter(([key, value]) => value.author === author)
    );

    if (Object.keys(filteredBooks).length === 0) {
      throw new Error("No books found for this author");
    }

    res.status(200).json({ books: filteredBooks });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const { title } = req.params;

  try {
    const filteredBooks = Object.fromEntries(
      Object.entries(books).filter(([key, value]) => value.title === title)
    );

    if (Object.keys(filteredBooks).length === 0) {
      throw new Error("No books found with this title");
    }

    res.status(200).json({ books: filteredBooks });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
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
