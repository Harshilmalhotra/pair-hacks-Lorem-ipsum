from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import time
from urllib.parse import urljoin
import threading

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
    import shutil
    filename = os.path.basename(filepath)
    processed_filepath = os.path.join(PROCESSED_FOLDER, "")
    
    # Simulate processing
    shutil.copy(filepath, processed_filepath)
    time.sleep(7)  # Simulate time delay for processing

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
