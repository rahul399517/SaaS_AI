"use client";

import { Label } from "@/components/ui/label";
import { Trash2, Eye, FileSearch, CloudUpload } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import ToastMessage from "@/components/popup-message";
import ToastErrorMessage from "@/components/errorPopup-message";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { FreightInfoReportList } from "./freight_info";
// Define interfaces
interface ConsignmentNote {
  date_of_issue: string;
  vehicle_number: string;
  origin: string;
  destination: string;
  vehicle_identifiers: string[];
  total_vehicles: number;
  model_counts: Record<string, number>;
  freight_amount: number;
  trip_no: string | null;
  invoice_date: string | null;
  load_no: string | null;
  "tat(date of delivery)": string | null;
  CN_status: string;
}

interface FileData {
  customer: string;
  origin: string[];
  destination: string[];
  trip_no: string | null;
  load_no: string | null;
  "tat(date of delivery)": string | null;
  invoice_date: string | null;
  date_of_issue: string;
  total_vehicles: number;
  total_freight: number;
  vehicle_number: string;
  model_counts: Record<string, number>;
  CN_status: string[];
  consignment_notes: ConsignmentNote[];
  [key: string]: any;
}

interface SelectedFileData {
  data: FileData[];
}

export default function Upload() {
  // State variables
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      name: string;
      uniqueId: string;
      shareable_link: string[];
      download_link: string[];
    }[]
  >([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [object, setObject] = useState({});
  const [toastErrorVisible, setToastErrorVisible] = useState(false);
  const [toastErrorMessage, setToastErrorMessage] = useState("");
  const [selectedFileData, setSelectedFileData] =
    useState<SelectedFileData | null>(null);

  // **Updated State Type: ConsignmentNote[] | FileData | null**
  const [fileInfos, setFileInfos] = useState<
    Record<number, ConsignmentNote[] | FileData | null>
  >({});

  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const host = process.env.NEXT_PUBLIC__API_HOST;

  //AGgrid
  const consignmentNoteColumns = [
    { headerName: "Date Of Issue", field: "date_of_issue" },
    { headerName: "Vehicle Number", field: "vehicle_number" },
    { headerName: "Origin", field: "origin" },
    { headerName: "Destination", field: "destination" },
    {
      headerName: "Vehicle Identifiers",
      field: "vehicle_identifiers",
      valueGetter: (params: any) => params.data.vehicle_identifiers.join(", "),
    },
    { headerName: "Total Vehicles", field: "total_vehicles" },
    {
      headerName: "Model Counts",
      field: "model_counts",
      valueGetter: (params: any) => {
        return Object.entries(params.data.model_counts)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      },
    },
    { headerName: "Freight Amount", field: "freight_amount" },
    { headerName: "CN Status", field: "CN_status" },
  ];

  const fileDataColumns = [
    { headerName: "Customer", field: "customer" },
    {
      headerName: "Origin",
      field: "origin",
      valueGetter: (params: any) => params.data.origin.join(", "),
    },
    {
      headerName: "Destination",
      field: "destination",
      valueGetter: (params: any) => params.data.destination.join(", "),
    },
    { headerName: "Trip No", field: "trip_no" },
    { headerName: "Load No", field: "load_no" },
    { headerName: "Tat (Date of Delivery)", field: "tat(date of delivery)" },
    { headerName: "Invoice Date", field: "invoice_date" },
    { headerName: "Date Of Issue", field: "date_of_issue" },
    { headerName: "Total Vehicles", field: "total_vehicles" },
    { headerName: "Total Freight", field: "total_freight" },
    { headerName: "Vehicle Number", field: "vehicle_number" },
    {
      headerName: "Model Counts",
      field: "model_counts",
      valueGetter: (params: any) => {
        return Object.entries(params.data.model_counts)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      },
    },
    {
      headerName: "CN Status",
      field: "CN_status",
      valueGetter: (params: any) => params.data.CN_status.join(", "),
    },
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      setUploadProgress(0);
      const response = await fetch(`${host}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // **Correction: Handle multiple file uploads correctly**
        // Assuming data.data is an array corresponding to each uploaded file
        const newUploadedFiles = Array.isArray(data.data)
          ? data.data.map((fileData: any, index: number) => ({
              name: files[index]?.name || "Unknown",
              uniqueId: fileData.unique_id,
              shareable_link: fileData.shareable_link || [],
              download_link: fileData.download_link || [],
            }))
          : files.map((file) => ({
              name: file.name,
              uniqueId: data.data.unique_id,
              shareable_link: data.data.shareable_link || [],
              download_link: data.data.download_link || [],
            }));

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
        setToastMessage(data.message || "File(s) uploaded successfully!");
        setToastVisible(true);
        setIsUploaded(true);
      } else {
        const errorData = await response.json();
        setToastErrorMessage(errorData.message || "Failed to upload files!");
        setToastErrorVisible(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "File upload failed!";
      setToastErrorMessage(errorMessage);
      setToastErrorVisible(true);
    } finally {
      setUploadProgress(null);
    }
  };

  // Reset file upload state
  const resetFileUpload = () => {
    setFiles([]);
    setUploadedFiles([]);
    setSelectedFileData(null);
    setIsUploaded(false);
    setFileInfos([]); //   setFileInfos({});
  };

  // Fetch file data based on uniqueId
  const fetchFileData = async (uniqueId: string) => {
    try {
      if (uniqueId) {
        setLoading(true);
        const response = await fetch(
          `${host}/extract_info?upload_id=${uniqueId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSelectedFileData(data);
        } else {
          const errorData = await response.json();
          setToastErrorMessage(errorData.message || "Failed to fetch data!");
          setToastErrorVisible(true);
        }
      } else {
        setToastErrorMessage("Please upload a file first!");
        setToastErrorVisible(true);
      }
    } catch (error: unknown) {
      console.error("Error fetching file data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "File upload failed!";
      setToastErrorMessage(errorMessage);
      setToastErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total freight
  const totalFreight: number = selectedFileData?.data
    ? selectedFileData.data.reduce(
        (acc: number, curr: FileData) => acc + (curr.total_freight || 0),
        0
      )
    : 0;

  // Get customer name
  const customerName: string = selectedFileData?.data
    ? selectedFileData.data.find((item) => item.customer)?.customer || "N/A"
    : "N/A";

  // Render nested values
  const renderValue = (value: unknown) => {
    if (Array.isArray(value)) {
      // Render arrays as bullet lists
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.map((item, i) => (
            <li key={i} className="text-sm text-gray-800">
              {typeof item === "object" ? renderValue(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    } else if (typeof value === "object" && value !== null) {
      // Render nested objects recursively
      return (
        <div className="space-y-3">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <div key={nestedKey} className="border rounded-md p-4 bg-gray-50">
              <div className="text-sm font-medium text-gray-700">
                {nestedKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                :
              </div>
              <div className="mt-2 text-sm text-gray-800">
                {renderValue(nestedValue)}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Render simple values
      return <span>{String(value) || "N/A"}</span>;
    }
  };

  const handleViewFileInfo = () => { //fileIndex: number
    // console.log("here is the file index value ", fileIndex);
  
    if (!selectedFileData || !selectedFileData.data) {
      console.warn("Invalid file index or no data available.");
      return;
    }
  
    let info: ConsignmentNote[] | FileData | null = null;
    let infoMaruti: FileData[] | null = null;
    const fileData = selectedFileData.data[0];
    const customer = fileData.customer.toLowerCase();
  
    if (["kia", "nissan", "mahindra"].includes(customer)) {
      // Access specific consignment note by index
      const fileDataFilter = selectedFileData.data[0];
      info = fileDataFilter.consignment_notes; //fileDataFilter.consignment_notes[fileIndex] 
      console.log("Consignment Notes:", fileData.consignment_notes);
    } else if (customer === "maruti") {
      // Return all data for Maruti
      infoMaruti = selectedFileData.data;
      console.log("File Data (Maruti):", infoMaruti);
    } else {
      info = null;
    }
  
    console.log("Info Selected: ", info);
    // setFileInfos(() => ({
    //   [fileIndex]: info,
    // }));
    // setFileInfos((prev) => ({
    //   [fileIndex]: info,
    // }));
  // console.log("here is the fileinfos",fileInfos)
  //   let rowData = Object.values(fileInfos).filter(Boolean); // Ensure only valid data is passed
  
  //   let object = {
  //     data: customer === "maruti" ? infoMaruti || [] : rowData ,  // Ensuring correct data for Maruti
  //     totalFreight: totalFreight,
  //     customerName: customerName,
  //   };
  //  setObject(object)
  //   console.log("Prepared Object for AgGrid: ", object);
  console.log("here is the fileinfos", fileInfos);

// Directly use fileInfos without filtering
let rowData = Object.values(fileInfos); // let rowData = Array.isArray(fileInfos) ? fileInfos : [];
console.log("here si thhe row data  , ",rowData)
let object = {
  data: customer === "maruti" ? infoMaruti || [] : info,  // Pass entire array to AgGrid
  totalFreight: totalFreight,
  customerName: customerName,
};
setObject(object);
console.log("Prepared Object for AgGrid: ", object);
  };
  useEffect(()=>{
    handleViewFileInfo()
  },[selectedFileData])
  return (
    <div>
      customerName
      <Card className="w-full border border-solid border-gray-200 rounded-lg md:px-7 md:py-6 px-2 py-1 flex md:gap-6 gap-3 flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-gray-900 xl:text-2xl text-base">
            Upload
          </CardTitle>
          {!isUploaded && (
            <CardDescription>Please Upload Documents</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex gap-1.5 flex-col p-0">
          {/* Upload Success or Upload File Section */}
          {isUploaded ? (
            <div className="flex items-center justify-center bg-gray-100 h-44">
              <div className="w-full max-w-[550px] border border-green-400 bg-green-50 p-6 rounded-lg shadow-md flex items-center justify-center gap-4 h-44">
                <div className="flex items-center justify-center bg-green-200 rounded-full h-12 w-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-700">
                    Success!
                  </h3>
                  <p className="text-sm text-green-600">
                    File uploaded successfully. You can proceed with the next
                    step.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* File Upload Section */
            <div className="flex w-full items-center justify-center">
              <Label
                htmlFor="dropzone-file"
                className="relative flex h-44 w-full max-w-[550px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {uploadProgress !== null ? (
                  <div className="flex flex-col items-start gap-4 p-4 w-full bg-gray-50 rounded-md">
                    <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
                    <div className="w-full h-4 bg-gray-200 rounded-md relative overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-md"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Uploading in progress...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-blue-500 dark:text-blue-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-base text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Only png, jpg, jpeg, xlsx, pdf files accepted
                    </p>
                  </div>
                )}

                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute h-full w-full top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
                />
              </Label>
            </div>
          )}

          {/* Upload Button */}
          {files.length >= 1 && !isUploaded && uploadProgress === null && (
            <div className="flex mt-4 align-middle justify-center">
              <Button color="primary" onClick={handleUpload}>
                Upload Selected Files
              </Button>
            </div>
          )}

          <div className="flex md:flex-row flex-col gap-4">
            {/* Selected Files Section */}
            {files.length > 0 && (
              <div className="w-full border border-solid border-gray-200 mt-4 p-4 bg-gray-50 rounded-lg md:w-1/2">
                <div className="flex justify-between mb-4">
                  <h3 className="text-base text-gray-900 font-bold">
                    New Files Selected
                  </h3>
                  <h5 className="text-gray-600 text-sm">
                    {files.length} File(s) Selected
                  </h5>
                </div>
                <div className="grid gap-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col rounded-lg bg-white px-4 py-4 gap-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 w-full">
                          {/* File Initial */}
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-700 font-bold text-2xl rounded-md">
                            {file.name.charAt(0).toUpperCase()}
                          </div>

                          {/* File Name and Uploading Status */}
                          <div className="w-full">
                            <p className="text-lg font-medium text-gray-800">
                              {file.name}
                            </p>
                            {uploadProgress !== null && (
                              <div className="text-sm text-blue-500 flex items-center gap-2 mt-1">
                                <CloudUpload className="w-5 h-5" />
                                Uploading...
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        {/* Uncomment if you want to allow removing files before upload */}
                        {/*
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setFiles((prevFiles) =>
                              prevFiles.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2 className="w-6 h-6" />
                          <span className="sr-only">Remove File</span>
                        </Button>
                        */}
                      </div>

                      {/* Sub-card for File Links */}
                      {isUploaded && uploadedFiles[index] && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow p-4 flex items-start gap-4">
                          <div className="w-full">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">
                              File Links
                            </h4>

                            {uploadedFiles[index].shareable_link &&
                            uploadedFiles[index].download_link ? (
                              <div className="space-y-3">
                                {uploadedFiles[index].shareable_link.map(
                                  (link, i) => (
                                    <div
                                      key={i}
                                      className="flex justify-between items-center bg-white rounded-md p-3 shadow hover:bg-gray-100 transition"
                                    >
                                      <p className="text-sm text-gray-700 font-medium">
                                        File {i + 1}
                                      </p>
                                      <div className="flex gap-3">
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline flex items-center"
                                        >
                                          <Eye className="w-5 h-5 mr-1" />
                                          View
                                        </a>
                                        <a
                                          href={
                                            uploadedFiles[index].download_link[
                                              i
                                            ]
                                          }
                                          download
                                          className="text-green-600 hover:underline flex items-center"
                                        >
                                          Download
                                        </a>
                                        {/* {selectedFileData?.data ? (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-purple-600 border-purple-400 hover:bg-purple-50"
                                            onClick={() =>
                                              handleViewFileInfo(i)
                                            } // **Updated to pass 'index' instead of 'i'**
                                          >
                                            View File Info
                                          </Button>
                                        ) : (
                                          ""
                                        )} */}
                                        {/* View File Info Button */}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No links available
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {isUploaded && (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-400 hover:bg-blue-50"
                            onClick={() =>
                              fetchFileData(
                                uploadedFiles[index]?.uniqueId || ""
                              )
                            }
                          >
                            <FileSearch className="w-5 h-5 mr-2" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Details and Turnover Information */}
            <div className="w-full">
              {loading ? (
                // Skeleton loader while data is loading
                <div className="w-full border border-solid border-gray-200 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                      <p className="text-sm text-gray-600">Processing......</p>
                    </div>
                  </div>
                </div>
              ) : (
                selectedFileData &&
                selectedFileData.data && (
                  <div>
                    {/* Total Turnover Section */}
                    {/* <div className="w-full border border-solid border-gray-200 mt-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-base text-gray-900 font-semibold">
                        Total Turnover based on uploaded data
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 grid-cols-1 mt-4">
                        <div className="text-sm text-gray-900">
                          <strong>Total Freight:</strong> {totalFreight}
                        </div>
                        <div className="text-sm text-gray-900">
                          <strong>Customer Name:</strong> {customerName}
                        </div>
                      </div>
                    </div> */}

                    {/* Turnover Details Section */}
                    <div className="w-full  border-gray-200 mt-1 p-4 bg-white rounded-lg ">
                      

                      {/* {Object.keys(fileInfos).length > 0 && (
                        <div className="w-full border border-solid border-gray-200 p-4 bg-white rounded-lg shadow-md mt-4">
                          <h3 className="text-lg text-gray-800 font-semibold mb-4">
                            Detailed File Information
                          </h3>
                          {Object.entries(fileInfos).map(([fileIndex, info]) => (
                            <div
                              key={fileIndex}
                              className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                              <h4 className="text-md font-semibold text-gray-800 mb-2">
                                File {parseInt(fileIndex) + 1} Information
                              </h4>
                              {info && Array.isArray(info) ? (
                                info.length > 0 ? (
                                  info.map((note, noteIndex) => (
                                    <div
                                      key={noteIndex}
                                      className="mb-3 border rounded-md p-3 bg-gray-100"
                                    >
                                      <h5 className="text-sm font-medium text-gray-700">
                                        Consignment Note {noteIndex + 1}
                                      </h5>
                                      <div className="mt-2 text-sm text-gray-800">
                                        {renderValue(note)}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No consignment notes available.
                                  </p>
                                )
                              ) : info ? (
                                <div className="text-sm text-gray-800">
                                  {renderValue(info)}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No detailed information available.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )} */}

                    
                        {selectedFileData && (
                        
                            <FreightInfoReportList reportData={object} />
                    
                        )}
                        {!selectedFileData && (
                          <p className="text-sm text-gray-500">
                            No detailed information available.
                          </p>
                        )}
                      
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Upload New File Button */}
          {files.length > 0 && !loading && (
            <div className="flex mt-4 align-middle justify-center">
              <Button onClick={resetFileUpload} color="primary">
                Upload New File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Toast Messages */}
      <ToastMessage
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      <ToastErrorMessage
        message={toastErrorMessage}
        visible={toastErrorVisible}
        onClose={() => setToastErrorVisible(false)}
      />
    </div>
  );
}
