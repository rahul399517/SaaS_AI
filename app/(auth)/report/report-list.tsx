import React, { useRef, useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button"
import {
  AllCommunityModule,
  ModuleRegistry,
  ICellRendererParams
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

// Import Tailwind CSS (ensure Tailwind is set up in your project)
import "tailwindcss/tailwind.css";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ReportListProps {
  reportData: {
    data?: any[];
    total_freight?: number;
  };
}

// 1) Full list of columns that can be toggled
const allAvailableColumns = [
  { headerName: "Upload Id", field: "upload_id", sortable: true, filter: true },
  { headerName: "Customer", field: "customer", sortable: true, filter: true },
  {
    headerName: "Origin",
    field: "origin",
    sortable: true,
    filter: true,
    cellRenderer: (params: any) =>
      Array.isArray(params.value) ? params.value.join(", ") : params.value
  },
  {
    headerName: "Destination",
    field: "destination",
    sortable: true,
    filter: true,
    cellRenderer: (params: any) =>
      Array.isArray(params.value) ? params.value.join(", ") : params.value
  },
  { headerName: "Trip No", field: "trip_no", sortable: true, filter: true },
  { headerName: "Load No", field: "load_no", sortable: true, filter: true },
  {
    headerName: "Invoice Date",
    field: "invoice_date",
    sortable: true,
    filter: "agDateColumnFilter",
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleDateString() : "-"
  },
  {
    headerName: "Date of Issue",
    field: "date_of_issue",
    sortable: true,
    filter: true
  },
  {
    headerName: "Total Vehicle",
    field: "total_vehicles",
    sortable: true,
    filter: true
  },
  {
    headerName: "Vehicle Number",
    field: "vehicle_number",
    sortable: true,
    filter: true
  },
  {
    headerName: "Model Count",
    field: "model_counts",
    sortable: true,
    filter: true,
    cellRenderer: (params: any) =>
      params.value
        ? Object.entries(params.value)
            .map(([model, count]) => `${model}: ${count}`)
            .join(", ")
        : "-"
  },
  {
    headerName: "CN Status",
    field: "cn_status",
    sortable: true,
    filter: true,
    cellRenderer: (params: any) =>
      Array.isArray(params.value) ? params.value.join(", ") : params.value
  },
  {
    headerName: "Consignment Notes",
    field: "consignment_notes",
    sortable: true,
    filter: true,
    minWidth: 800,
    autoHeight: true,
    cellStyle: {
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      cursor: "text"
    },
    cellRenderer: (params: ICellRendererParams) => {
      // 1) If no value or it's not an array, just show a string or dash
      if (!Array.isArray(params.value)) {
        return params.value ? String(params.value) : "-";
      }
      if (params.value.length === 0) {
        return "-";
      }

      // 2) A helper function to recursively handle arrays or objects
      const formatNoteValue = (value: any): string => {
        if (Array.isArray(value)) {
          if (value.length === 0) return "-";
          return value.map((item) => formatNoteValue(item)).join("; ");
        }

        if (value && typeof value === "object") {
          // Filter out keys you don’t want, e.g. "vehicle_identifiers"
          const entries = Object.entries(value).filter(
            ([k]) => k !== "vehicle_identifiers"
          );
          if (entries.length === 0) return "-";
          return entries
            .map(([k, v]) => `${k}: ${formatNoteValue(v)}`)
            .join(", ");
        }

        return String(value ?? "-");
      };

      // 3) Now format each note object in the top-level array
      return params.value
        .map((noteObj: any, index: number) => {
          const info = formatNoteValue(noteObj);
          return `Note ${index + 1}: ${info}`;
        })
        .join("\n\n");
    }
  },
  {
    headerName: "Upload Date",
    field: "upload_date",
    sortable: true,
    filter: true,
    valueFormatter: (params: any) =>
      params.value ? new Date(params.value).toLocaleDateString() : "-"
  },
  {
    headerName: 'File',
    field: 'file_url',
    sortable: true,
    filter: true,
    flex: 1,
    cellRenderer: (params: ICellRendererParams) => {
      const url = params.value;
  
      return url ? (
        <div className="flex justify-center items-center py-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row selection
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none shadow-md transition-all"
            aria-label={`View file at ${url}`}
          >
            View
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center py-2">
          <span className="text-gray-500">No File</span>
        </div>
      );
    },
  },
  
  
];

export const ReportList: React.FC<ReportListProps> = ({ reportData }) => {
  console.log("report data",reportData)
  const gridApi = useRef<any>(null);
  const totalFreight = reportData.total_freight || 0;
  const [clientDate, setClientDate] = useState<string>("");
  useEffect(() => {
    setClientDate(new Date().toLocaleString());
  }, []);
  // 2) Maintain selected columns in state (default: all columns)
  const [selectedColumns, setSelectedColumns] = useState(allAvailableColumns);

  // Handle toggling columns
  const handleColumnToggle = (field: string) => {
    setSelectedColumns((prevColumns) => {
      // If column is already selected, remove it
      if (prevColumns.some((col) => col.field === field)) {
        return prevColumns.filter((col) => col.field !== field);
      } else {
        // Otherwise, add it from the master list
        const colToAdd = allAvailableColumns.find((c) => c.field === field);
        return colToAdd ? [...prevColumns, colToAdd] : prevColumns;
      }
    });
  };

  // 3) Special checkbox column + user-selected columns
  const checkboxColumn = useMemo(
    () => ({
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 50
    }),
    []
  );

  // 4) Final columnDefs for the grid
  const columnDefs = useMemo(() => {
    // Sort selectedColumns to maintain consistent order
    const sortedSelectedColumns = allAvailableColumns.filter((col) =>
      selectedColumns.some((c) => c.field === col.field)
    );
    return [checkboxColumn, ...sortedSelectedColumns];
  }, [checkboxColumn, selectedColumns]);

  // Default column properties
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      flex: 1,
      minWidth: 150
    }),
    []
  );

  // State for showing/hiding the column filter modal
  const [showColumnFilter, setShowColumnFilter] = useState(false);

  // Function to toggle the modal
  const toggleColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-lg bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-2xl font-semibold">Freight Report</h2>
        <div className="text-lg font-medium">
          Total Freight: <span className="font-bold">₹{totalFreight.toLocaleString()}</span>
        </div>
      </div>

      {/* Toolbar with "Filter Columns" button */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <div className="text-sm text-gray-500">
          Showing {reportData.data?.length || 0} records
        </div>
        <button
          onClick={toggleColumnFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Filter Columns
        </button>
      </div>

      {/* Column Filter Modal */}
      {showColumnFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleColumnFilter}
          ></div>
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg z-50 max-w-md w-full mx-4">
            {/* Modal header */}
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="text-lg font-semibold">Select Columns</h3>
              <button
                onClick={toggleColumnFilter}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &#x2715; {/* Unicode for X symbol */}
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4">
              {/* Column selection checkboxes */}
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {allAvailableColumns.map((col) => {
                  const isChecked = selectedColumns.some(
                    (c) => c.field === col.field
                  );
                  return (
                    <label key={col.field} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleColumnToggle(col.field)}
                      />
                      {col.headerName}
                    </label>
                  );
                })}
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex justify-end px-4 py-2 border-t">
              <button
                onClick={toggleColumnFilter}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div
        className="ag-theme-material"
        style={
          {
            width: "100%",
            "--ag-checkbox-size": "20px",
            "--ag-checkbox-checked-color": "black",
            "--ag-checkbox-unchecked-color": "#9c27b0",
            "--ag-checkbox-indeterminate-bg-color": "#ffeb3b",
            "--ag-checkbox-border-color": "transparent",
            "--ag-checkbox-border-radius": "4px"
          } as React.CSSProperties
        }
      >
        <AgGridReact
          rowData={reportData.data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          enableCellTextSelection={true}
          pagination={true}
          paginationPageSize={20}
          rowHeight={60}
          rowSelection="multiple"
          onGridReady={(params) => {
            gridApi.current = params.api;
            params.api.sizeColumnsToFit();
          }}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-100 text-center py-3 border-t">
        <p className="text-sm text-gray-600">
          Data updated: {clientDate || "Loading..."}
        </p>
      </div>
    </div>
  );
};
