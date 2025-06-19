import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/faculty/sidebar1";
import axios from "axios";

const VideoUploadPage = () => {
  const [fileName, setFileName] = useState("");
  const [embedLink, setEmbedLink] = useState("");
  const [fileType, setFileType] = useState("");

  const navigate = useNavigate();
  const { CID } = useParams();

  const [sidebarToggle, setSidebarToggle] = useState(false);

  const email = localStorage.getItem("email");

  const handleSubmit = () => {
    axios
      .post(`https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/new-topic/${CID}`, {
        fileName: fileName,
        fileLink: embedLink,
        fileType: fileType,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        navigate("/faculty/courses");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        username={email || "username"}
      />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-3xl text-black mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-6">Upload File</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded"
              placeholder="Enter video title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">File Type</label>
            <select
              name="File Type"
              className="w-full mt-1 px-4 py-2 border rounded"
              id="options"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value=".mp4">.mp4</option>
              <option value=".pdf">.pdf</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">File Link</label>
            <input
              type="text"
              value={embedLink}
              onChange={(e) => setEmbedLink(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded"
              placeholder="Paste YouTube video link"
            />
          </div>

          <button
            onClick={handleSubmit}
            className={`w-full py-2 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;
