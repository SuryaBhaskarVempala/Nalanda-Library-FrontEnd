import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/Home.css";
import { StoreContext } from "../../context/Store";

function BorrowHistory() {
  const [books, setBooks] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest"); // newest or oldest
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useContext(StoreContext);

  // Fetch borrow history from API
  useEffect(() => {
    const fetchBorrowHistory = async () => {
      const token = localStorage.getItem("token");
       console.log(user);
       console.log(token);
      try {
        if (token) {
          console.log(user);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/borrows/borrowsByMember/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setBooks(response.data);
          setLoading(false);
        }
        else {
          window.location.href = '/login'
        }

      } catch (err) {
        console.error(err);
        setError("Failed to fetch borrow history");
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, []);

  // Handle return
  const handleReturn = async (borrowId) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token+" :  return book")
      if (token) {
        await axios.post(`${import.meta.env.VITE_API_URL}/borrows/returnBookById/${borrowId}`,{}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("📚 Book returned successfully!");
        setBooks((prev) => prev.filter((b) => b._id !== borrowId));
      }
      else{
        window.location.href = '/login'
      }

    } catch (err) {
      console.error(err);
      alert("Failed to return book");
    }
  };

  // Sort by borrow date
  const sortedBooks = [...books].sort((a, b) => {
    const dateA = new Date(a.borrowDate);
    const dateB = new Date(b.borrowDate);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (loading) return <p style={{ textAlign: "center", marginTop:"400px",minHeight:"30vh",color: "#fff" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center",marginTop:"400px",minHeight:"30vh", color: "red" }}>{error}</p>;

  return (
    <div className="home-container">
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}>
        Borrow History
      </h2>
      <h4 style={{ textAlign: "center", color: "#fff", marginBottom: "20px" }}>
        Total Number of Books Borrowed: {books.length}
      </h4>

      {/* Sort Filter */}
      <div className="sort-filter">
        <label htmlFor="sort">Sort By Borrow Date: </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {sortedBooks.length === 0 ? (
          <p className="no-books" style={{ textAlign: "center", color: "#fff",  marginTop:"200px",minHeight:"10vh" }}>
            📚 You have not borrowed any books yet.
          </p>
        ) : (
          sortedBooks.map((book) => (
            <div className="book-card" key={book._id}>
              <img src={book.book.img} alt={book.book.title} />
              <h3>{book.book.title}</h3>
              <p>
                <strong>Author:</strong> {book.book.author}
              </p>
              <p className="genre-tag">{book.book.genre}</p>
              <p className="availability">
                Borrow Date: {new Date(book.borrowDate).toLocaleDateString()}
              </p>

              <button
                className="buy-button"
                onClick={() => handleReturn(book._id)}
              >
                Return
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default BorrowHistory;
