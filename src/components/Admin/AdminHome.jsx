import React, { useState, useEffect } from "react";
import "../../styles/Home.css";
import axios from "axios";

function AdminHome() {
  const [genre, setGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Popup state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "Fiction",
    img: "",
    copies: 1,
  });
  const [errors, setErrors] = useState({});

  const booksPerPage = 10;

  // Fixed Top 10 Genres
  const genres = [
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

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/books`, {
        params: {
          page: currentPage,
          limit: booksPerPage,
          genre: genre !== "All" ? genre : undefined,
          author: searchQuery.trim() !== "" ? searchQuery : undefined,
        },
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



  // ✅ Validate Form
  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (!formData.copies || formData.copies <= 0)
      newErrors.copies = "Copies must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addBook = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token"); // get token from localStorage
      console.log(token);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/books/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // send token in headers
          },
        }
      );
      alert("🎉 Book Added Successfully!");
      setShowModal(false);
      setFormData({ title: "", author: "", genre: "Fiction", img: "", copies: 1 });
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };



  // When Edit button is clicked
  const handleEdit = (book) => {

    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      img: book.img,
      copies: book.copies,
      id: book._id,
    });

    setShowModal(true);
  };

  // Update book function
  const updateBook = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/books/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("🎉 Book Updated Successfully!");
      setShowModal(false);
      setFormData({ title: "", author: "", genre: "Fiction", img: "", copies: 1 });
      fetchBooks(); // refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update book");
    }
  };

  const deleteBook = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("🎉 Book Deleted Successfully!");
      fetchBooks();
    }
    catch(err){
      alert("Failed To Delete Book");
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.id) {
      updateBook();
    } else {
      addBook();
    }
  };



  return (
    <div className="home-container">
      {/* ✅ Add Book Button */}
      <div className="add-book-container">
        <button className="add-book-button" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Add Book
        </button>
      </div>

      {/* Filters */}
      <div
        className="filters"
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: "none",
              padding: "8px 12px",
              flex: 1,
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="book-card admin" key={book._id}>
              <img src={book.img} alt={book.title} />
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p className="genre-tag">{book.genre}</p>
              <p className="availability">~ {book.copies} Books </p>
              <div className="edit-section">
                <button
                  className="edit-button"
                  onClick={() => {
                    handleEdit(book)
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() =>deleteBook(book._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
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
        <button
          disabled={currentPage === 1 || totalPages === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
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
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Add Book Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Book</h2>
            <form
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <p className="error">{errors.title}</p>}
              </div>

              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
                {errors.author && <p className="error">{errors.author}</p>}
              </div>

              <div className="form-group">
                <label>Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                >
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.genre && <p className="error">{errors.genre}</p>}
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                />
                {errors.img && <p className="error">{errors.img}</p>}
              </div>

              <div className="form-group">
                <label>Copies</label>
                <input
                  type="number"
                  value={formData.copies}
                  onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                />
                {errors.copies && <p className="error">{errors.copies}</p>}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHome;
