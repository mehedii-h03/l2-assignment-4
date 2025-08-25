import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import type { Book } from "../Books";
import { useDeleteBookMutation } from "../../../redux/api/apiSlice";
import toast from "react-hot-toast";

interface DeleteDialogProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DeleteDialog = ({
  book,
  isOpen,
  onClose,
  onSuccess,
}: DeleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteBook] = useDeleteBookMutation();

  if (!book || !isOpen) return null;

  const handleConfirm = async () => {
    if (!book._id) return;

    setIsLoading(true);

    try {
      await deleteBook(book._id).unwrap();
      toast.success("Book deleted successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setOpen={(open) => !open && onClose()}
      width="400px"
      padding="24px"
      borderRadius="8px"
      preventCloseOnClickOutside={isLoading}
    >
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Book</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete "
          <span className="font-medium text-gray-900">{book.title}</span>"? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>Delete Book</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
