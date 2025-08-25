import { useState } from "react";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import Table from "../../components/ui/Table";
import BookForm from "./components/BookForm";
import BorrowForm from "./components/BorrowForm";
import DeleteDialog from "./components/DeleteDialog";
import { useGetBooksQuery } from "../../redux/api/apiSlice";

// Type definitions
export interface Book {
  _id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  copies: number;
  available: boolean;
  description?: string;
}

type ModalType = "add" | "edit" | "borrow" | "delete" | null;

const Books = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: booksResponse, isLoading, error } = useGetBooksQuery("");
  const books = booksResponse?.data;

  console.log(books);

  // Table configuration
  const columns = [
    {
      key: "title",
      label: "Title",
      className: "font-medium text-gray-900",
      mobile: { primary: true },
      wrap: false,
    },
    {
      key: "author",
      label: "Author",
      className: "text-sm text-gray-600",
      wrap: false,
    },
    {
      key: "genre",
      label: "Genre",
      className: "text-sm text-gray-600",
      wrap: false,
    },
    {
      key: "isbn",
      label: "ISBN",
      className: "text-sm text-gray-600",
      wrap: false,
    },
    {
      key: "copies",
      label: "Copies",
      className: "text-sm text-gray-600",
      wrap: false,
    },
    {
      key: "available",
      label: "Status",
      wrap: false,
      render: (book: Book) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            book.available
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {book.available ? "Available" : "Unavailable"}
        </span>
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "Edit",
      icon: Edit,
      hoverColor: "text-blue-600",
    },
    {
      key: "borrow",
      label: "Borrow",
      icon: BookOpen,
      hoverColor: "text-green-600",
      disabled: (book: Book) => !book.available,
      className: "text-red-600 hover:bg-gray-50",
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      hoverColor: "text-red-600",
      className: "text-red-600 hover:bg-gray-50",
    },
  ];

  // Event handlers
  const handleRowAction = (actionKey: string, book: Book) => {
    setSelectedBook(book);
    switch (actionKey) {
      case "edit":
        setActiveModal("edit");
        break;
      case "borrow":
        setActiveModal("borrow");
        break;
      case "delete":
        setActiveModal("delete");
        break;
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setActiveModal("add");
  };

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedBook(null);
  };

  const handleBorrowSuccess = () => {
    // This will be called when a borrow request is successfully created
    console.log("Borrow request created successfully");
    closeAllModals();
  };

  const handleBookSuccess = () => {
    // This will be called when a book is successfully created or updated
    console.log("Book operation successful");
    closeAllModals();
  };

  const handleDeleteSuccess = () => {
    // This will be called when a book is successfully deleted
    console.log("Book deleted successfully");
    closeAllModals();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-medium text-gray-900 mb-4 sm:mb-0">
          Books
        </h1>
        <button
          onClick={handleAddBook}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {isLoading && <div className="text-center py-4">Loading books...</div>}
      {error && (
        <div className="text-center py-4 text-red-600">Error loading books</div>
      )}

      <Table
        title="Book Library"
        data={books}
        columns={columns}
        actions={actions}
        onRowAction={handleRowAction}
        emptyMessage="No books available"
      />

      {/* Modals - Now using your Modal component with API integration */}
      <BookForm
        isOpen={activeModal === "add"}
        onClose={closeAllModals}
        onSuccess={handleBookSuccess}
      />

      <BookForm
        book={selectedBook}
        isEdit={true}
        isOpen={activeModal === "edit"}
        onClose={closeAllModals}
        onSuccess={handleBookSuccess}
      />

      <BorrowForm
        book={selectedBook!}
        isOpen={activeModal === "borrow"}
        onClose={closeAllModals}
        onSuccess={handleBorrowSuccess}
      />

      <DeleteDialog
        book={selectedBook}
        isOpen={activeModal === "delete"}
        onClose={closeAllModals}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default Books;
