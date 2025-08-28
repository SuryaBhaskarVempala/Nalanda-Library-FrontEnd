import React, { useState, useEffect, useContext } from "react";
import "../styles/Home.css";
import axios from "axios";
import { StoreContext } from "../context/Store";

function Home() {
  const [genre, setGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(StoreContext);

  const booksPerPage = 10;

  // Fixed Top 10 Genres
  const genres = [
    "All",
    "Fiction",
    "Non-Fiction",
    "Mystery / Thriller",
    "Romance",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Historical Fiction",
    "Biography / Memoir",
    "Self-Help / Personal Development",
  ];

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token"); // optional, if backend requires auth
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/books`, {
        params: {
          page: currentPage,
          limit: booksPerPage,
          genre: genre !== "All" ? genre : undefined,
          author: searchQuery.trim() !== "" ? searchQuery : undefined,
        },
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
      });

      setBooks(res.data.books);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, genre, searchQuery]);


  const borrowBook = async (email, bookId) => {
    if (email && bookId) {
      console.log(email + " : " + bookId);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/borrows/borrowBookById/`, {
            userEmail: email,
            bookId: bookId
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          alert(response.data.message);
          fetchBooks();
        }
        else {
          window.location.href = '/login';
        }
      }
      catch (err) {
        alert(err.response?.data?.messaage || "Server Not Responding Try Later!")
      }
    }
    else {
      window.location.href = '/login';
    }
  }

  return (
    <div className="home-container">
      {/* Filters */}
      <div
        className="filters"
        style={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Genre Dropdown */}
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setCurrentPage(1);
          }}
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Author Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "6px",
            overflow: "hidden",
            flex: 1,
            maxWidth: "300px",
            marginLeft: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Search by author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: "none", padding: "8px 12px", flex: 1, fontSize: "16px", outline: "none" }}
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => {
            const copies = Number(book.copies);
            const isUnavailable = copies <= 0;

            return (
              <div
                className={`book-card ${isUnavailable ? "unavailable" : ""}`}
                key={book._id}
              >
                <img src={book.img} alt={book.title} />
                <h3>{book.title}</h3>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p className="genre-tag">{book.genre}</p>
                <p className="availability">~ {copies} Books left</p>
                <button
                  className="buy-button"
                  disabled={isUnavailable}
                  onClick={() => {
                    borrowBook(user.email, book._id);
                  }}
                >
                  Borrow
                </button>


                {isUnavailable && (
                  <div className="unavailable-overlay">
                    <span>UnAvailable</span>
                  </div>
                )}


              </div>
            );
          })
        ) : (
          <h2
            style={{
              fontSize: "40px",
              fontFamily: "sans-serif",
              fontWeight: "300",
              gridColumn: "1 / -1",
              marginTop: "200px",
              marginBottom: "50px",
              textAlign: "center",
            }}
          >
            No books found
          </h2>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1 || totalPages === 0} onClick={() => setCurrentPage((p) => p - 1)}>
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
