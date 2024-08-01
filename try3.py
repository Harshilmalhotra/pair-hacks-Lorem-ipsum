import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import spacy
import io
import numpy as np
import cv2
from langdetect import detect, DetectorFactory
import re

# Ensure consistent language detection
DetectorFactory.seed = 0

# Load your custom SpaCy model
custom_model_path = r"C:\Users\HARSH ARORA\Desktop\spacytr\SAPCYMODEL"

# You can still load the multilingual model for fallback or other languages
nlp_multilingual = spacy.load("xx_ent_wiki_sm")

def detect_language(text):
    try:
        lang = detect(text)
        return lang
    except Exception as e:
        print(f"Error detecting language: {e}")
        return None

def get_spacy_model(language_code):
    # Load your custom model for a specific language or case
    if language_code == 'en':  # Assuming your model is for English
        return spacy.load(custom_model_path)
    elif language_code == 'zh':
        return spacy.load("zh_core_web_sm")
    elif language_code == 'ko':
        return spacy.load("ko_core_web_sm")
    elif language_code == 'ms':
        return nlp_multilingual
    else:
        return nlp_multilingual  # Default to multilingual model

def mask_text(page):
    text_instances = page.get_text("dict")["blocks"]
    
    for block in text_instances:
        if block["type"] == 0:  # This indicates the block contains text
            for line in block["lines"]:
                for span in line["spans"]:
                    text_content = span["text"]
                    bbox = span["bbox"]
                    language_code = detect_language(text_content)
                    nlp_model = get_spacy_model(language_code)
                    
                    if not nlp_model:
                        continue
                    
                    doc = nlp_model(text_content)
                    for ent in doc.ents:
                        if ent.label_ in ["PERSON", "GPE", "ORG", "EMAIL", "PHONE", "ADDRESS"]:
                            print(f"Masking {ent.label_}: {ent.text}")
                            # Mask the entity
                            page.draw_rect(fitz.Rect(bbox), color=(0, 0, 0), fill=(0, 0, 0))

def mask_image(image):
    img = np.array(image)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    
    language_code = detect_language(text)
    nlp_model = get_spacy_model(language_code)
    
    if not nlp_model:
        return

    doc = nlp_model(text)
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "GPE", "ORG", "EMAIL", "PHONE", "ADDRESS"]:
            print(f"Masking {ent.label_}: {ent.text}")
            boxes = pytesseract.image_to_boxes(gray)
            h, w, _ = img.shape
            for box in boxes.splitlines():
                b = box.split()
                if len(b) == 6:
                    char, x1, y1, x2, y2 = b[0], int(b[1]), int(b[2]), int(b[3]), int(b[4])
                    y1 = h - y1
                    y2 = h - y2
                    cv2.rectangle(img, (x1, y2), (x2, y1), (0, 0, 0), -1)

    masked_image = Image.fromarray(img)
    return masked_image

def process_pdf(file_path):
    doc = fitz.open(file_path)

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        mask_text(page)

        # Process images in PDF
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            base_image = doc.extract_image(img[0])
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))
            masked_image = mask_image(image)
            
            # Save the masked image back to PDF
            if masked_image:
                # Note: Replacing images in the PDF is not directly handled in this code.
                pass

    doc.save("masked_output_custommodel.pdf")
    doc.close()

# Example usage
process_pdf("your_file.pdf")
