import React, { useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

const Card = ({ data, reference, onDelete, onEdit, onUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.desc);

  const handleDownload = (e) => {
    e.stopPropagation();
    
    if (data.fileData && data.fileData.file) {
      // Create download link for the actual uploaded file
      const url = URL.createObjectURL(data.fileData.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.fileData.name;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`Downloaded: ${data.fileData.name}`);
    } else {
      alert("No file available to download. Please upload a file first.");
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this card?")) {
      onDelete(data.id);
    }
  };

  const handleUpload = (e) => {
    e.stopPropagation();
    onUpload(data.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(data.id, editText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(data.desc);
    setIsEditing(false);
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.1 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 40 }}
      className={`relative flex-shrink-0 w-52 h-64 rounded-[40px] text-white py-10 px-8 overflow-hidden ${
        data.fileData ? 'bg-zinc-700/90 border-2 border-green-500' : 'bg-zinc-800/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <FaRegFileAlt />
        {data.fileData && (
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="File uploaded"></div>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-5">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full h-20 bg-zinc-700 text-white text-sm p-2 rounded resize-none"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 bg-green-600 text-xs rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 bg-red-600 text-xs rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p 
            className="text-sm font-semibold leading-tight cursor-pointer hover:text-blue-300"
            onDoubleClick={handleEdit}
            title="Double-click to edit"
          >
            {data.desc}
          </p>
          {data.fileData && (
            <div className="mt-2 text-xs text-green-400">
              <p>Type: {data.fileData.type || 'Unknown'}</p>
              <p>Size: {data.filesize}</p>
            </div>
          )}
        </div>
      )}

      <div className="footer absolute bottom-0 w-full left-0">
        <div className="flex items-center justify-between px-8 py-3 mb-3">
          <h5>{data.filesize}</h5>
          <span 
            className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-500 transition-colors"
            onClick={data.close ? handleDelete : handleDownload}
            title={data.close ? "Delete" : "Download"}
          >
            {data.close ? (
              <IoClose />
            ) : (
              <LuDownload size=".7rem" color="#fff" />
            )}
          </span>
        </div>
        {data.tag.isOpen && (
          <div
            className={`tag w-full py-4 cursor-pointer hover:opacity-80 transition-opacity ${
              data.tag.tagColor === "blue" ? "bg-blue-600" : "bg-green-600"
            } flex items-center justify-center`}
            onClick={(e) => {
              e.stopPropagation();
              if (data.tag.tagTitle === "Upload") {
                handleUpload(e);
              } else if (data.tag.tagTitle === "Download Now") {
                handleDownload(e);
              }
            }}
            title={`Click to ${data.tag.tagTitle}`}
          >
            <h3 className="text-sm font-semibold">{data.tag.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;