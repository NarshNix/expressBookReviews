const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secret = "Nandu_srivas";

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (!username || username == "") {
    res.send("Invalid Input");
    return;
  }
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username == username && user.password == password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const registeredUser = authenticatedUser(username, password);
  if (!registeredUser) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT
  const token = jwt.sign({ username }, secret, { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful", token });
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const authHeader = req.headers["authorization"]; // Get the Authorization header
  const { review } = req.body;
  const { isbn } = req.params;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token is missing or invalid" });
  }

  // Extract the token from the "Bearer <token>" format
  const token = authHeader.split(" ")[1];

  try {
    // Replace with your actual secret key
    const verifiedToken = jwt.verify(token, secret); // Verify the token
    console.log(verifiedToken);
    if (!verifiedToken) {
      res.send("not a valid token");
      return;
    }

    const filteredBook = books[isbn].reviews.push(review);
    books.push(...books, filteredBook);

    // Proceed with the logic after token validation
    return res
      .status(200)
      .json({ message: "Token verified successfully", verifiedToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const authHeader = req.headers["authorization"];
  const { isbn } = req.params;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verifiedToken = jwt.verify(token, secret); // Verify the token
    const username = verifiedToken.username; // Extract username

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully",
      book: books[isbn],
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
