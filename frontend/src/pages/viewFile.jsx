import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ViewFile = () => {
  const { fileId } = useParams();
  const role = localStorage.getItem("role");
  const [fileData, setFileData] = useState([]);
  const [linkType, setLinkType] = useState("");
  const [feedback, setFeedback] = useState("");
  const [quality, setQuality] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackExists, setFeedbackExists] = useState(false);

  const identifyLinkType = (link) => {
    const youtubeLinkRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;
    const driveIdRegex = /^[\w-]{20,}$/;

    if (youtubeLinkRegex.test(link)) {
      setLinkType("youtube");
    } else if (driveIdRegex.test(link)) {
      setLinkType("googleDrive");
    } else {
      setLinkType("");
    }
  };

  useEffect(() => {
    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/get-topic/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setFileData(response.data);
        identifyLinkType(response.data.File_link);
      })
      .catch((error) => {
        console.error("Error fetching file data:", error);
      });


    axios
      .get(
        `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/faculty/get-feedback/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setQuality(response.data.quality || "");
        setRating(response.data.rating || 5);
        setFeedback(response.data.feedback || "");
        setFeedbackExists(response.data.feedback ? true : false);
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim() === "") {
      alert("Feedback cannot be empty");
      return;
    }

    if (feedbackExists) {
      axios
        .put(
          `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/edit-feedback/${fileId}`,
          {
            quality: quality,
            rating: rating,
            feedback: feedback,
            CID: fileData.CID,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          alert("Feedback updated successfully");
          setFeedback("");
        })
        .catch((error) => {
          console.error("Error updating feedback:", error);
          alert("Failed to update feedback");
        });
    } else {
      axios
        .post(
          `https://ee891903-6ca9-497c-8a3c-a66b9f31844e-00-1zmfh43bt3bbm.sisko.replit.dev/reviewer/submit-feedback/${fileId}`,
          {
            quality: quality,
            rating: rating,
            feedback: feedback,
            CID: fileData.CID,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          alert("Feedback submitted successfully");
          setFeedback("");
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
          alert("Failed to submit feedback");
        });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-3/5 bg-gray-300 p-1 gap-2 flex flex-col">
        <div className="p-1 bg-white rounded shadow-md h-full">
          {linkType === "youtube" ? (
            <div className="w-full h-2/3 flex flex-col aspect-video">
              <iframe
                className="w-full h-full rounded-lg shadow-md"
                src={`${fileData.File_link}`}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : linkType === "googleDrive" ? (
            <div className="w-full h-screen p-4">
              <iframe
                src="https://drive.google.com/file/d/1A6vWsmmVHU1ZL5KTyhGFPuKXZYEyXWjl/preview"
                className="w-full h-full rounded border shadow"
                allow="autoplay"
                title="Google Drive PDF Viewer"
              ></iframe>
            </div>
          ) : (
            <div className="w-full h-2/3 flex items-center justify-center">
              <p className="text-gray-500">No valid link provided.</p>
            </div>
          )}

          <div>
            <h1 className="text-2xl text-black font-bold">
              {fileData.File_name}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-2/5 bg-gray-300 pt-1 pb-1 pr-1">
        <form
          className="w-full bg-white p-1 rounded shadow-md flex flex-col gap-4 h-full"
          onSubmit={handleSubmit}
        >
            {/* Quality of the file */}
            <label className="text-left text-black font-semibold block">
              Quality of Resource
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <label
                className={`cursor-pointer text-black rounded-lg p-4 font-medium text-center ${
                  quality === "Excellent" ? "bg-green-500" : "bg-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="quality"
                  value="Excellent"
                  className="hidden"
                  checked={quality === "Excellent"}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={role !== "reviewer"}
                />
                Excellent
              </label>

              <label
                className={`cursor-pointer text-black rounded-lg p-4 font-medium text-center ${
                  quality === "Good" ? "bg-yellow-400" : "bg-yellow-200"
                }`}
              >
                <input
                  type="radio"
                  name="quality"
                  value="Good"
                  className="hidden"
                  checked={quality === "Good"}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={role !== "reviewer"}
                />
                Good
              </label>

              <label
                className={`cursor-pointer text-black rounded-lg p-4 font-medium text-center ${
                  quality === "Moderate" ? "bg-orange-500" : "bg-orange-300"
                }`}
              >
                <input
                  type="radio"
                  name="quality"
                  value="Moderate"
                  className="hidden"
                  checked={quality === "Moderate"}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={role !== "reviewer"}
                />
                Moderate
              </label>

              <label
                className={`cursor-pointer text-black rounded-lg p-4 font-medium text-center ${
                  quality === "Bad" ? "bg-red-600" : "bg-red-400"
                }`}
              >
                <input
                  type="radio"
                  name="quality"
                  value="Bad"
                  className="hidden"
                  checked={quality === "Bad"}
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={role !== "reviewer"}
                />
                Bad
              </label>
            </div>

            <label
              htmlFor="rating"
              className="text-left font-semibold text-sm text-black"
            >
              On a scale of 1 to 10, how much would you rate this resource?
            </label>
            <div className="flex flex-col">
              <input
                type="range"
                id="rating"
                name="rating"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                disabled={role !== "reviewer"}
                list="tickmarks"
                className="w-full h-2 bg-blue-500 rounded-lg cursor-pointer accent-blue-700"
              />
              <datalist
                id="tickmarks"
                className="flex justify-between text-xs text-gray-700 px-[2px] mt-2"
              >
                {[...Array(10)].map((_, i) => (
                  <option
                    key={i}
                    value={i + 1}
                    label={`${i + 1}`}
                    className="text-m "
                  />
                ))}
              </datalist>
            </div>

            {/* Feedback Textarea */}
            <textarea
              id="feedback"
              name="feedback"
              className="w-full h-[50vh] resize-none p-2 bg-white outline-none text-[#B98389] border border-2 border-black rounded"
              placeholder="Write your detailed feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={role !== "reviewer"}
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={role !== "reviewer"}
            >
              {feedbackExists ? "Update Feedback" : "Submit Feedback"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ViewFile;
