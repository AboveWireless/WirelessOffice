# WirelessOffice Data Extraction

This repository contains a utility script for extracting text and metadata from PDF files and compiling the results into a single JSON file.

## Usage

1. Install dependencies:

   ```bash
   pip install pdfminer.six PyPDF2
   ```

2. Run the script (adjust the directory path as necessary):

   ```bash
   python extract_pdf_data.py -d "E:\\OneDrive - Above Wireless LLC\\Work\\GTC\\Purchase Repairs - Climbed" -o output.json
   ```

The script will recursively search the given directory for PDF files, extract their text and metadata, and save the combined data into `output.json`.
