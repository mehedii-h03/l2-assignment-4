import { X } from "lucide-react";
import { useState } from "react";
import type { Book } from "../Books";
import Modal from "../../../components/ui/Modal";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
} from "../../../redux/api/apiSlice";
import toast from "react-hot-toast";

interface BookFormProps {
  book?: Book | null;
  isEdit?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BookForm = ({
  book,
  isEdit = false,
  isOpen,
  onClose,
  onSuccess,
}: BookFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(book?.available ?? true);
  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const bookData = {
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        genre: formData.get("genre") as string,
        isbn: formData.get("isbn") as string,
        description: formData.get("description") as string,
        copies: parseInt(formData.get("copies") as string) || 0,
        available: isAvailable,
      };

      let result;
      if (isEdit && book?._id) {
        // Update existing book
        result = await updateBook({
          id: book._id,
          ...bookData,
        }).unwrap();
      } else {
        // Create new book
        result = await createBook(bookData).unwrap();
      }

      console.log("Operation successful:", result);
      onSuccess?.();
      toast.success("Book added successfully");
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setOpen={(open) => !open && onClose()}
      width="500px"
      padding="0px"
      borderRadius="8px"
      preventCloseOnClickOutside={isLoading}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">
          {isEdit ? "Edit Book" : "Add New Book"}
        </h2>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              type="text"
              defaultValue={book?.title || ""}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter book title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              name="author"
              type="text"
              defaultValue={book?.author || ""}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              name="genre"
              defaultValue={book?.genre || ""}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 bg-white appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "20px",
              }}
              required
            >
              <option value="" className="text-gray-400">
                Select a genre
              </option>
              <option value="FICTION" className="text-gray-900">
                Fiction
              </option>
              <option value="NON_FICTION" className="text-gray-900">
                Non-Fiction
              </option>
              <option value="SCIENCE" className="text-gray-900">
                Science
              </option>
              <option value="HISTORY" className="text-gray-900">
                History
              </option>
              <option value="BIOGRAPHY" className="text-gray-900">
                Biography
              </option>
              <option value="FANTASY" className="text-gray-900">
                Fantasy
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              name="isbn"
              type="text"
              defaultValue={book?.isbn || ""}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter ISBN"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={book?.description || ""}
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter book description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Copies
            </label>
            <input
              name="copies"
              type="number"
              defaultValue={book?.copies || ""}
              disabled={isLoading}
              min="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter number of copies"
              required
            />
          </div>

          {isEdit && (
            <div className="flex items-center">
              <div className="relative">
                <input
                  name="available"
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  disabled={isLoading}
                  className="sr-only"
                />
                <div
                  onClick={() => !isLoading && setIsAvailable(!isAvailable)}
                  className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isAvailable
                      ? "bg-gray-800 border-gray-800"
                      : "bg-white border-gray-300 hover:border-gray-400"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isAvailable && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <label
                onClick={() => !isLoading && setIsAvailable(!isAvailable)}
                className={`ml-3 text-sm text-gray-700 select-none ${
                  !isLoading ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                Available
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isEdit ? "Update Book" : "Add Book"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookForm;
