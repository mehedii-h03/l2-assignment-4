import { useState } from "react";
import { MoreVertical } from "lucide-react";

// Types
interface Column {
  key: string;
  label: string;
  className?: string;
  wrap?: boolean;
  render?: (item: any) => React.ReactNode;
  mobile?: {
    primary?: boolean;
  };
}

interface Action {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  hoverColor?: string;
  className?: string;
  disabled?: (item: any) => boolean;
}

interface TableProps {
  title: string;
  data: any[];
  columns: Column[];
  actions?: Action[];
  onRowAction?: (actionKey: string, item: any) => void;
  emptyMessage?: string;
}

function Table({
  data = [],
  columns = [],
  actions = [],
  onRowAction,
  emptyMessage = "No data available",
}: TableProps) {
  const [showMobileActions, setShowMobileActions] = useState<number | null>(
    null
  );

  const handleAction = (actionKey: string, item: any) => {
    if (onRowAction) {
      onRowAction(actionKey, item);
    }
    setShowMobileActions(null);
  };

  const renderCellContent = (item: any, column: Column) => {
    if (column.render) {
      return column.render(item);
    }
    return item[column.key];
  };

  return (
    <div className="">
      {/* Empty State */}
      {data.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-500 text-lg mb-2">{emptyMessage}</div>
        </div>
      )}

      {/* Desktop Table */}
      {data.length > 0 && (
        <>
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-6 py-4 ${column.className || ""} ${
                          column.wrap === false ? "whitespace-nowrap" : ""
                        }`}
                      >
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {actions.map((action) => (
                            <button
                              key={action.key}
                              onClick={() => handleAction(action.key, item)}
                              disabled={
                                action.disabled && action.disabled(item)
                              }
                              className={`p-1 transition-colors duration-200 ${
                                action.disabled && action.disabled(item)
                                  ? "text-gray-300 cursor-not-allowed"
                                  : `text-gray-400 hover:${
                                      action.hoverColor || "text-gray-600"
                                    }`
                              }`}
                              title={action.label}
                            >
                              {action.icon && (
                                <action.icon className="h-4 w-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {columns.slice(0, 2).map((column) => (
                      <div
                        key={column.key}
                        className={column.mobile?.primary ? "mb-1" : ""}
                      >
                        {column.mobile?.primary ? (
                          <div className="font-medium text-gray-900">
                            {renderCellContent(item, column)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {renderCellContent(item, column)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {actions.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowMobileActions(
                            showMobileActions === index ? null : index
                          )
                        }
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showMobileActions === index && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {actions.map((action) => (
                            <button
                              key={action.key}
                              onClick={() => handleAction(action.key, item)}
                              disabled={
                                action.disabled && action.disabled(item)
                              }
                              className={`w-full text-left px-3 py-2 text-sm ${
                                action.disabled && action.disabled(item)
                                  ? "text-gray-400 cursor-not-allowed"
                                  : action.className ||
                                    "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {columns.length > 2 && (
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {columns.slice(2).map((column) => (
                      <div key={column.key} className="flex justify-between">
                        <span className="text-gray-500">{column.label}:</span>
                        <span className="text-gray-900">
                          {renderCellContent(item, column)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Table;
