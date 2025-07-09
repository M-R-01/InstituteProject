import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/faculty/sidebar1";
import axios from "axios";
import { showFacultyToast } from "../../components/faculty/FacultyToast";
import { use } from "react";

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
      .post(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/new-topic/${CID}`,
        {
          fileName: fileName,
          fileLink: embedLink,
          fileType: fileType,
        },
        {
          headers: {
            Authorization: ` Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        showFacultyToast("File uploaded successfully", "success");
        navigate(`/faculty/courses`);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        showFacultyToast("Error uploading file", "error");
      });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        username={email || "username"}
      />

      <div className="flex-1 flex justify-center items-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-950">
            Course Upload
          </h1>

          <div>
            
          </div>
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded">
            <h2 className="font-bold mb-2">📌 Instructions:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                For <strong>YouTube videos</strong>, use the{" "}
                <span className="text-blue-700 font-semibold">embed link</span>{" "}
                format. Example:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm">
                  https://www.youtube.com/embed/VIDEO_ID
                </code>
              </li>
              <li>
                Do <span className="text-red-600 font-semibold">not</span> paste
                the regular YouTube watch link like:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm">
                  https://www.youtube.com/watch?v=VIDEO_ID
                </code>
              </li>
              <li>
                You can find it under the share option on Youtube.
              </li>
              <li>
                For <strong>PDFs</strong>, upload your file to Google Drive and
                paste only the{" "}
                <span className="text-blue-700 font-semibold">file ID</span>.
                Example:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm">
                  1AbCDeFGhiJkLmNOPqrSTuvWxYZ123456
                </code>
              </li>
              <li>
                Make sure the Drive file is set to{" "}
                <strong>"Anyone with the link can view"</strong>.
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-1 text-blue-500">
              File Name
            </h3>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 py-3   bg-[#fffaf0] text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter video title"
            />
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-1 text-blue-500">
              File Type
            </h3>
            <select
              name="File Type"
              id="options"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full border border-gray-300 rounded p-2   bg-[#fffaf0] text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select file type</option>
              <option value=".mp4">.mp4</option>
              <option value=".pdf">.pdf</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-1 text-blue-500">
              File Link
            </h3>
            <input
              type="text"
              value={embedLink}
              onChange={(e) => setEmbedLink(e.target.value)}
              className="w-full border border-gray-300 rounded p-2   bg-[#fffaf0] text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Paste YouTube video link or Drive Id"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="py-2 px-4 rounded text-white font-semibold bg-blue-500 hover:opacity-90 transition"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;
