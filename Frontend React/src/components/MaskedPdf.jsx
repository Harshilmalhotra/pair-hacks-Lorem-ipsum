import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MaskedPdf({ pdfUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    axios.get(pdfUrl, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfData(url);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching PDF:', error);
      setLoading(false);
    });
  }, [pdfUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = 'masked.pdf'; // Specify a default filename for the download
    link.click();
  };

  if (loading) {
    return <div>Loading PDF...</div>;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-90 z-50">
      <div className="relative bg-white pt-10 pb-11 rounded-lg shadow-lg">
        <div className="absolute top-2 right-2">
          <button 
            onClick={onClose}  
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close"
          >
            ❌
          </button>
        </div>
        <embed src={pdfData} type="application/pdf" width="800" height="600" />
        <div className="absolute bottom-1 right-1">
          <button 
            onClick={handleDownload} 
            className="text-blue-500 hover:text-blue-700 focus:outline-none border border-blue-500 p-1 rounded-lg"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaskedPdf;
