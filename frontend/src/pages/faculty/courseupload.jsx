import React, { useState } from "react";
import Sidebar from "./components/faculty/sidebar1.jsx"; 

const VideoUploadPage = () => {
  const [videoTitle, setVideoTitle] = useState("");
  const [topics, setTopics] = useState("");
  const [transcript, setTranscript] = useState("");
  const [embedLink, setEmbedLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const convertToEmbedLink = (link) => {
    try {
      const url = new URL(link);
      if (url.hostname.includes("youtube.com") && url.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
      } else if (url.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
      } else {
        return link;
      }
    } catch {
      return link;
    }
  };

  const isFormValid = () => {
    return (
      videoTitle.trim() !== "" &&
      topics.trim() !== "" &&
      (videoFile || embedLink)
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Please fill all required fields.");
      return;
    }

    const finalEmbedLink = convertToEmbedLink(embedLink);
    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("topics", topics);
    formData.append("transcript", transcript);
    if (videoFile) formData.append("videoFile", videoFile);
    if (embedLink) formData.append("embedLink", finalEmbedLink);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) alert("Uploaded successfully");
        else alert("Upload failed!!");
      })
      .catch((err) => alert("Error uploading: " + err));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-6">Upload Course Video</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Video Title *</label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded"
              placeholder="Enter video title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Topics Covered *</label>
            <textarea
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded"
              placeholder="List the topics covered"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Transcript (Optional)</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded"
              placeholder="Enter transcript here (if any)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Embed Link (Optional)</label>
            <input
              type="text"
              value={embedLink}
              onChange={(e) => setEmbedLink(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded"
              placeholder="Paste YouTube video link"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium">Upload Video File (Optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="mt-1"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full py-2 text-white font-semibold rounded ${
              isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadPage;