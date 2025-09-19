import React, { useRef, useState } from "react";
import Card from "./Card";

const Foreground = () => {
  const ref = useRef(null);

  const [data, setData] = useState([
    {
      id: 1,
      desc: "this is the docs important to me",
      filesize: ".9mb",
      close: true,
      tag: { isOpen: true, tagTitle: "Download Now", tagColor: "blue" },
      fileData: null, // 
    },
    {
      id: 2,
      desc: "this is the docs important to me",
      filesize: ".9mb",
      close: false, 
      tag: { isOpen: false, tagTitle: "Download Now", tagColor: "" },
      fileData: null, 
    },
    {
      id: 3,
      desc: "this is the docs important to me",
      filesize: ".9mb",
      close: true,
      tag: { isOpen: true, tagTitle: "Upload", tagColor: "green" },
      fileData: null, 
    },
  ]);

  const handleDelete = (id) => {
    console.log(`Delete triggered for card ID: ${id}`);
    
    if (window.confirm("Are you sure you want to delete this card?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
      console.log(`Card with ID ${id} deleted successfully`);
    }
  };

  const handleEdit = (id, newDesc) => {
    console.log(`Edit triggered for card ID: ${id}, New description: ${newDesc}`);
    
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, desc: newDesc } : item
      )
    );
  };

  const handleUpload = (id) => {
    console.log(`Upload triggered for card ID: ${id}`);
    
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*'; // Accept all file types
    fileInput.style.display = 'none';
    
    // Handle file selection
    fileInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0];
      
      if (selectedFile) {
        console.log(`File selected: ${selectedFile.name}, Size: ${selectedFile.size} bytes`);
        
        // Update the card state with the uploaded file
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  desc: selectedFile.name,
                  filesize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`,
                  fileData: {
                    file: selectedFile,
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    lastModified: selectedFile.lastModified,
                  },
                  tag: {
                    isOpen: true,
                    tagTitle: "Download Now",
                    tagColor: "blue"
                  }
                }
              : item
          )
        );
        
        alert(`File "${selectedFile.name}" uploaded successfully!`);
      }
      
      // Remove the file input from DOM
      document.body.removeChild(fileInput);
    });
    
    // Add to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const addNewCard = () => {
    const newId = Math.max(...data.map(item => item.id)) + 1;
    const newCard = {
      id: newId,
      desc: "New document - Upload a file",
      filesize: "0mb",
      close: true,
      tag: { isOpen: true, tagTitle: "Upload", tagColor: "green" },
      fileData: null, 
    };
    setData(prev => [...prev, newCard]);
  };

  return (
    <div className="fixed z-[3] top-0 left-0 w-full h-full">
      {/* Add New Card Button */}
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={addNewCard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Card
        </button>
      </div>
      
      {/* Cards Container */}
      <div ref={ref} className="w-full h-full flex gap-10 flex-wrap p-5">
        {data.map((item) => (
          <Card
            key={item.id}
            data={item}
            reference={ref}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onUpload={handleUpload}
          />
        ))}
      </div>
    </div>
  );
};

export default Foreground;