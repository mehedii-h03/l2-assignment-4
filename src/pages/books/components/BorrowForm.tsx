import { X } from "lucide-react";
import { useState } from "react";
import type { Book } from "../Books";
import Modal from "../../../components/ui/Modal";
import { useCreateBorrowRequestMutation } from "../../../redux/api/apiSlice";
import toast from "react-hot-toast";

interface BorrowFormProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BorrowForm = ({ book, isOpen, onClose, onSuccess }: BorrowFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createBorrowRequest] = useCreateBorrowRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const quantity = parseInt(formData.get("quantity") as string) || 1;
      const dueDateString = formData.get("returnDate") as string;

      // Convert date string to ISO format
      const dueDate = new Date(dueDateString).toISOString();

      const borrowData = {
        book: book._id.toString(),
        quantity: quantity,
        dueDate: dueDate,
      };

      const result = await createBorrowRequest(borrowData).unwrap();
      console.log("Borrow request successful:", result);

      toast.success("Borrow request created successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating borrow request:", error);
      toast.error("Failed to create borrow request");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
        <h2 className="text-lg font-medium text-gray-900">Borrow Book</h2>
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
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900">{book.title}</h3>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="text-xs text-gray-500 mt-1">
              Available copies: {book.copies}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              max={book.copies}
              defaultValue="1"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <input
              name="returnDate"
              type="date"
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              required
            />
          </div>
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
            <span>Borrow Book</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BorrowForm;
