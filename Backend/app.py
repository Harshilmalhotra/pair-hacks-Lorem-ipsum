from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
from urllib.parse import urljoin
import threading
import shutil
import requests

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        # Save the uploaded file
        filepath = os.path.join(UPLOAD_FOLDER, "input.pdf")
        file.save(filepath)
        
        # Process the PDF in a separate thread
        thread = threading.Thread(target=process_pdf, args=(filepath,))
        thread.start()
        
        # Return immediate success response
        base_url = request.base_url
        masked_pdf_url = urljoin(base_url, f'/download/{os.path.basename(filepath)}')
        
        return jsonify({'success': True, 'masked_pdf_url': masked_pdf_url})



def process_pdf(filepath):
    """
    Simulate processing of the PDF file and move it to the processed folder.
    """
    filename = os.path.basename(filepath)
    processed_filepath = os.path.join(PROCESSED_FOLDER, filename)
    
    # Send the PDF to the FastAPI endpoint
    with open(filepath, 'rb') as f:
        response = requests.post("http://localhost:8001/v1/start", files={"pdf": f})
    
    if response.status_code == 200:
        # Save the processed PDF to the processed folder
        with open(processed_filepath, 'wb') as f:
            f.write(response.content)
    else:
        print(f"Failed to process PDF: {response.status_code}")

    # Simulate a do-while loop to keep checking if the file is processed
    while True:
        if os.path.exists(processed_filepath):
            break
        time.sleep(1)  # Check every second

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)