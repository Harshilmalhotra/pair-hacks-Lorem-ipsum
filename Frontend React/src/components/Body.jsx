import React, { useState } from 'react';
import axios from 'axios';
import MaskedPdf from './MaskedPdf'; // Ensure this path is correct

function Body({ isDarkMode }) {
  const [file, setFile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPdfPopup, setShowPdfPopup] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.success) {
        setShowSuccessPopup(true);
        setMessage('File uploaded successfully!');
        setPdfUrl(response.data.masked_pdf_url); // Set the URL for the masked PDF
      } else {
        setMessage('Error uploading file');
      }
    }).catch(error => {
      console.error('Error:', error);
      setMessage('Error uploading file');
    });
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  const openPdfPopup = () => {
    setShowPdfPopup(true);
  };

  const closePdfPopup = () => {
    setShowPdfPopup(false);
    clearFile();
  };

  const clearFile = () => {
    setFile(null);
    document.getElementById('fileInput').value = null;
    setPdfUrl(null);
    setMessage('');
  };

  return (
    <div className={`flex justify-center items-center h-[585px] transition-colors duration-500 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`p-6 rounded-lg shadow-lg text-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h1 className="text-3xl font-bold mb-4">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</h1>
        <p className="mb-6">Protect your sensitive information with our robust PDF masking solution</p>
        <div 
          className={`border-4 border-dashed rounded-lg p-6 ${dragging ? 'border-blue-700' : 'border-blue-500'} ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="mb-2">
                {/* Add any additional content here if needed */}
              </div>
              <label htmlFor="fileInput" className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded" type="button">Choose a file</label>
            </div>
          </label>
          <p className="mt-2">{file ? 'Drop your file here' : 'or drag and drop file here.'}</p>
          {file && (
            <>
              <button onClick={handleUpload} className="mt-4 text-white bg-green-500 hover:bg-green-700 py-2 px-4 rounded">
                Upload {file.name}
              </button>
              <button onClick={clearFile} className="mt-4 ml-2 text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded">
                Clear File
              </button>
            </>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-lg shadow-lg text-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Upload Status</h2>
            <p className="mb-6">{message}</p>
            
            <button onClick={openPdfPopup} className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded">
              View Masked PDF
            </button>
            <button onClick={closeSuccessPopup} className="mt-4 text-white bg-gray-500 hover:bg-gray-700 py-2 px-4 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {showPdfPopup && pdfUrl && (
        <MaskedPdf 
          pdfUrl={pdfUrl} 
          onClose={closePdfPopup} 
        />
      )}
    </div>
  );
}

export default Body;
