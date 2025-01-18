"use client";
import { useState ,useEffect} from "react";
import { CloudDownload, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ReportList } from "./report-list";
import { ChartReport } from "./chart";
export default function Page() {
  const host = process.env.NEXT_PUBLIC__API_HOST;
  const [activeTab, setActiveTab] = useState("listview");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [reportData, setReoportData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    upload_from_date: "",
    upload_to_date: "",
    invoice_from_date: "",
    invoice_to_date: "",
    issue_from_date: "",
    issue_to_date: "",
    vehicle_number: "",
    load_no: "",
    upload_id:"",
    trip_no:"",
  });
  const customers = ["Mahindra", "Kia", "Nissan", "Maruti"];
  const handleCustomerChange = (customer: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customer)
        ? prev.filter((item) => item !== customer)
        : [...prev, customer]
    );
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const toggleDropdown = () => {
    setShowCustomerDropdown(!showCustomerDropdown);
  };
  const generateReport = async () => {
    const queryParams = new URLSearchParams();
    if (selectedCustomers.length) {
      queryParams.append("customer", selectedCustomers.join(","));
    }
    Object.entries(formData).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    try {
      const response = await fetch(
        `${host}/generate_report?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );
      setLoading(true);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setReoportData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };
  const resetFilter=()=>{
    setFormData({
      upload_from_date: "",
      upload_to_date: "",
      invoice_from_date: "",
      invoice_to_date: "",
      issue_from_date: "",
      issue_to_date: "",
      vehicle_number: "",
      load_no: "",
      upload_id:"",
      trip_no:"",
    })
  }
  useEffect(()=>{
    generateReport()
  },[])
  return (
    <div>
      <Card className="w-full border border-solid border-border rounded-lg md:px-7 md:py-6 px-2 py-1 flex md:gap-6 gap-3 flex-col">
        <Tabs
          defaultValue="reports"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <CardHeader className="p-0 flex md:flex-row flex-col justify-between items-center gap-4">
            <div>
              <CardTitle className="text-card-foreground xl:text-2xl text-base">
                Report
              </CardTitle>
              <CardDescription>Your Previous Reports</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <TabsList className="flex">
                <TabsTrigger
                  value="listview"
                  className={`${
                    activeTab === "listview"
                      ? "!bg-foreground !text-white"
                      : "bg-transparent"
                  }`}
                >
                  List
                </TabsTrigger>
                <TabsTrigger
                  value="chartview"
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "chartview"
                      ? "!bg-foreground !text-white"
                      : "bg-transparent"
                  }`}
                >
                  Chart
                </TabsTrigger>
              </TabsList>

              <Button color="primary" className="ml-2 flex items-center">
                <CloudDownload className="!w-6 !h-6 mr-1" /> Export
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex gap-1.5 flex-col p-0">
            <div className="flex md:flex-row flex-col my-5 w-full justify-between gap-6">
              <div className="flex items-center w-full bg-white-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full">
                  <div className="grid grid-cols-4 gap-6 w-full">
                    {/* Upload Date Range Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Upload From Date
                          </label>
                          <input
                            type="date"
                            name="upload_from_date"
                            value={formData.upload_from_date}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Upload To Date
                          </label>
                          <input
                            type="date"
                            name="upload_to_date"
                            value={formData.upload_to_date}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Invoice Date Range Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Invoice From Date
                          </label>
                          <input
                            type="date"
                            name="invoice_from_date"
                            value={formData.invoice_from_date}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Invoice To Date
                          </label>
                          <input
                            type="date"
                            name="invoice_to_date"
                            value={formData.invoice_to_date}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Issue Date Range Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Issue From Date
                          </label>
                          <input
                            type="date"
                            name="issue_from_date"
                            value={formData.issue_from_date}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Issue To Date
                          </label>
                          <input
                            type="date"
                            name="issue_to_date"
                            value={formData.issue_to_date}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vehicle and Load No Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Vehicle Number
                          </label>
                          <input
                            type="text"
                            name="vehicle_number"
                            value={formData.vehicle_number}
                            onChange={handleInputChange}
                            placeholder="Enter Vehicle Number"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Load No</label>
                          <input
                            type="text"
                            name="load_no"
                            value={formData.load_no}
                            onChange={handleInputChange}
                            placeholder="Enter Load No"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Upload ID
                          </label>
                          <input
                            type="text"
                            name="upload_id"
                            value={formData.upload_id}
                            onChange={handleInputChange}
                            placeholder="Enter Upload Id"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Trip No</label>
                          <input
                            type="text"
                            name="trip_no"
                            value={formData.trip_no}
                            onChange={handleInputChange}
                            placeholder="Enter Trip No"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow">
                      <div className="grid grid-cols-2 gap-4">
                         {/* Select Customers Section */}
                    <div className="col-span-4 flex flex-col gap-4 max-w-md">
                      <label className="text-sm font-medium text-gray-700">
                        Select Customers
                      </label>
                      <div className="relative">
                        <div className="flex flex-wrap gap-2 mb-2 max-h-24 overflow-y-auto">
                          {selectedCustomers.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedCustomers.map((customer) => (
                                <div
                                  key={customer}
                                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs shadow-sm"
                                >
                                  <span className="truncate">{customer}</span>
                                  <button
                                    onClick={() =>
                                      handleCustomerChange(customer)
                                    }
                                    className="ml-2 text-gray-500 hover:text-red-700"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => setSelectedCustomers([])}
                                className="text-xs text-blue-500 underline hover:text-blue-700"
                              >
                                Clear All
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={toggleDropdown}
                          className="flex items-center justify-between w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm hover:shadow-md transition"
                        >
                          {selectedCustomers.length > 0 ? (
                            <span className="text-gray-400">
                              {" "}
                              {selectedCustomers.length} Selected Customers
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Select Customers
                            </span>
                          )}
                          {showCustomerDropdown ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        {showCustomerDropdown && (
                          <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-60 overflow-y-auto">
                            <div className="flex items-center justify-between mb-3">
                             
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setSelectedCustomers(customers)
                                  }
                                  className="text-xs text-blue-500 underline hover:text-blue-700"
                                >
                                  Select All
                                </button>
                                {selectedCustomers.length > 0 && (
                                  <button
                                    onClick={() => setSelectedCustomers([])}
                                    className="text-xs text-red-500 underline hover:text-red-700"
                                  >
                                    Clear All
                                  </button>
                                )}
                              </div>
                            </div>
                            <input
                              type="text"
                              placeholder="Search customers..."
                              value={searchTerm || ""}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                            <div className="flex flex-col gap-3">
                              {customers
                                .filter((customer) =>
                                  customer
                                    .toLowerCase()
                                    .includes((searchTerm || "").toLowerCase())
                                )
                                .map((customer) => (
                                  <div
                                    key={customer}
                                    className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md"
                                  >
                                    <Checkbox
                                      id={customer}
                                      checked={selectedCustomers.includes(
                                        customer
                                      )}
                                      onCheckedChange={() =>
                                        handleCustomerChange(customer)
                                      }
                                    />
                                    <label
                                      htmlFor={customer}
                                      className="text-sm text-gray-800 cursor-pointer select-none"
                                    >
                                      {customer}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                      </div>
                    </div>

                    <div className="col-span-4 flex justify-end items-center mt-6">        
                    </div>
                    {/* Button Section */}
                    <div className="col-span-4 flex justify-end items-center mt-6">
                    <Button className=" m-1"   color="primary" onClick={resetFilter}>
                         Reset filter
                        </Button> 
                      {loading ? (
                        <Button className=" m-1"  color="primary">Generating Report .....</Button>
                      ) : (
                        <Button className=" m-1"  color="primary" onClick={generateReport}>
                          Generate Report
                        </Button>
                      )}
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <TabsContent value="listview">
              <ReportList reportData={reportData} />
            </TabsContent>
            <TabsContent value="chartview">
              <ChartReport />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
