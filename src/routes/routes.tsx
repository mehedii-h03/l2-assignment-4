import { createBrowserRouter } from "react-router";
import App from "../App";
import Books from "../pages/books/Books";
import BorrowSummary from "../pages/BorrowSummary/BorrowSummary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Books />,
      },
      {
        path: "/borrow-summary",
        element: <BorrowSummary />,
      },
    ],
  },
]);

export default router;
