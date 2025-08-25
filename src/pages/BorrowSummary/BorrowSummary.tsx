import { BarChart3, TrendingUp, Book, Users } from "lucide-react";
import Table from "../../components/ui/Table";
import { useGetBorrowSummaryQuery } from "../../redux/api/apiSlice";

interface BookRow {
  bookTitle: string;
  isbn: string;
  totalQuantityBorrowed: number;
}

interface BorrowSummaryData {
  totalQuantity: number;
  book: {
    title: string;
    isbn: string;
  };
}

const BorrowSummary = () => {
  const {
    data: borrowResponse,
    isLoading,
    error,
  } = useGetBorrowSummaryQuery("");
  const borrowData: BorrowSummaryData[] = borrowResponse?.data || [];

  // Transform API data to match table structure
  const transformedData: BookRow[] = borrowData.map((item) => ({
    bookTitle: item.book.title,
    isbn: item.book.isbn,
    totalQuantityBorrowed: item.totalQuantity,
  }));

  // Calculate summary statistics
  const totalBooks = transformedData.length;
  const totalBorrows = transformedData.reduce(
    (sum, book) => sum + book.totalQuantityBorrowed,
    0
  );
  const averageBorrows =
    totalBooks > 0 ? Math.round(totalBorrows / totalBooks) : 0;
  const mostBorrowedBook =
    transformedData.length > 0
      ? transformedData.reduce(
          (prev, current) =>
            prev.totalQuantityBorrowed > current.totalQuantityBorrowed
              ? prev
              : current,
          transformedData[0]
        )
      : null;

  // Table configuration
  const columns: {
    key: keyof BookRow;
    label: string;
    className?: string;
    wrap?: boolean;
    render?: (item: BookRow) => React.ReactNode;
    mobile?: {
      primary?: boolean;
    };
  }[] = [
    {
      key: "bookTitle",
      label: "Book Title",
      className: "font-medium text-gray-900",
      mobile: { primary: true },
    },
    {
      key: "isbn",
      label: "ISBN",
      className: "text-sm text-gray-600",
      wrap: false,
    },
    {
      key: "totalQuantityBorrowed",
      label: "Total Quantity Borrowed",
      className: "text-sm text-gray-900 font-medium",
      wrap: false,
      render: (item) => (
        <div className="flex items-center">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {item.totalQuantityBorrowed}
          </span>
        </div>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Loading skeleton for cards */}
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="h-6 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 font-medium">
              Error loading borrow summary
            </div>
          </div>
          <p className="text-red-600 text-sm mt-2">
            Failed to load borrowing data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Books */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Book className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-medium text-gray-900">
                  {totalBooks}
                </div>
                <div className="text-sm text-gray-600">
                  Total Books Borrowed
                </div>
              </div>
            </div>
          </div>

          {/* Total Borrows */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-medium text-gray-900">
                  {totalBorrows}
                </div>
                <div className="text-sm text-gray-600">
                  Total Quantity Borrowed
                </div>
              </div>
            </div>
          </div>

          {/* Average Borrows */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-medium text-gray-900">
                  {averageBorrows}
                </div>
                <div className="text-sm text-gray-600">Average per Book</div>
              </div>
            </div>
          </div>

          {/* Most Borrowed */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                {mostBorrowedBook ? (
                  <>
                    <div
                      className="text-lg font-medium text-gray-900 truncate"
                      title={mostBorrowedBook.bookTitle}
                    >
                      {mostBorrowedBook.bookTitle}
                    </div>
                    <div className="text-sm text-gray-600">
                      Most Borrowed ({mostBorrowedBook.totalQuantityBorrowed}{" "}
                      times)
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-medium text-gray-900">
                      No Data
                    </div>
                    <div className="text-sm text-gray-600">
                      No books borrowed yet
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Summary Table */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-4 sm:mb-0">
            Borrow Summary
          </h1>
        </div>
        <Table
          title="Borrow Summary"
          data={transformedData}
          columns={columns}
          emptyMessage="No borrowing data available"
        />
      </div>
    </>
  );
};

export default BorrowSummary;
