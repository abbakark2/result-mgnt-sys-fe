import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";

export default function BulkUploadStudents() {
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState(null); // faculties + departments
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchMeta = async () => {
    setMetaLoading(true);
    try {
      const response = await axiosClient.get("/students/bulk-upload/meta");
      if (response) {
        setMeta(response.data);
        setMetaLoading(false);
        // console.log(meta);
      }
    } catch (error) {
      console.log(error);
      console.log(meta);
      setMetaLoading(false);
    }
  };

  // Load valid faculty/department names so user knows what to type
  useEffect(() => {
    fetchMeta();
  }, []);

  const handleFile = (selectedFile) => {
    const allowed = ["xlsx", "xls", "csv"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Please upload an Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/students/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setResult({
        success: false,
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        errors: [],
      });
    } finally {
      setLoading(false);
      setFile(null); // reset for next upload
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bulk Student Upload
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Upload an Excel or CSV file to add or update multiple students at
          once.
        </p>
      </div>

      {/* Instructions + Meta */}
      {metaLoading ? (
        <div className="flex items-center justify-center space-x-2 py-10">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          <span className="text-indigo-500 font-medium">
            Loading faculties...
          </span>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-2">
          <p className="font-semibold">Before you upload:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <button
                onClick={() =>
                  window.open("/api/students/bulk-upload/template", "_blank")
                }
                className="underline font-medium"
              >
                Download the template
              </button>{" "}
              and fill it in — do not change the column headers.
            </li>
            <li>
              The <strong>matric number</strong> is the only required unique
              field.
            </li>
            <li>Email is optional — leave the cell blank if unknown.</li>
            {meta && (
              <>
                <li>
                  <strong>Faculty column</strong> must be one of:{" "}
                  {meta.faculties.map((f) => f.name).join(", ")}.
                </li>
                <li>
                  <strong>Department column</strong> must be one of:{" "}
                  {meta.departments.map((d) => d.name).join(", ")}.
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-400"}`}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <p className="text-green-700 font-medium">📄 {file.name}</p>
        ) : (
          <p className="text-gray-500">
            Drag and drop your file here, or{" "}
            <span className="text-blue-600 underline">browse</span>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Supported formats: .xlsx, .xls, .csv
        </p>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
      >
        {loading ? "Uploading, please wait..." : "Upload File"}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg font-medium ${
              result.error_count === 0
                ? "bg-green-50 text-green-800 border border-green-200"
                : result.success_count === 0
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            {result.message}
          </div>

          {result.errors?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                Rows with issues:
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <div
                    key={i}
                    className="bg-red-50 border border-red-100 rounded p-3 text-sm text-red-700"
                  >
                    <span className="font-bold">Row {err.row}:</span>{" "}
                    {err.message}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Fix the issues above in your file and re-upload — already saved
                rows will be updated, not duplicated.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
