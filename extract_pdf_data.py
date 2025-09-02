import os
import json
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from pdfminer.high_level import extract_text
from PyPDF2 import PdfReader

def extract_pdf_data(pdf_path: str) -> dict:
    """Extract text and metadata from a single PDF file."""
    data = {"file": os.path.basename(pdf_path)}

    try:
        data["text"] = extract_text(pdf_path)
    except Exception as exc:  # pragma: no cover - extraction failures
        data["text_error"] = str(exc)

    try:
        reader = PdfReader(pdf_path)
        if reader.metadata:
            data["metadata"] = {k: str(v) for k, v in reader.metadata.items()}
    except Exception as exc:  # pragma: no cover
        data["metadata_error"] = str(exc)

    return data

def gather_pdfs(root_dir: str) -> list:
    """Recursively find PDF files in *root_dir*."""
    return [
        os.path.join(dirpath, filename)
        for dirpath, _, filenames in os.walk(root_dir)
        for filename in filenames
        if filename.lower().endswith(".pdf")
    ]

def main(directory: str, output: str) -> None:
    pdf_paths = gather_pdfs(directory)
    results = []

    with ThreadPoolExecutor() as executor:
        future_map = {
            executor.submit(extract_pdf_data, path): path for path in pdf_paths
        }
        for future in as_completed(future_map):
            try:
                results.append(future.result())
            except Exception as exc:  # pragma: no cover
                results.append({"file": os.path.basename(future_map[future]), "error": str(exc)})

    with open(output, "w", encoding="utf-8") as fh:
        json.dump(results, fh, ensure_ascii=False, indent=2)

def cli() -> None:
    parser = argparse.ArgumentParser(
        description="Extract text and metadata from all PDF files within a directory."
    )
    parser.add_argument(
        "-d",
        "--directory",
        default=r"E:\\OneDrive - Above Wireless LLC\\Work\\GTC\\Purchase Repairs - Climbed",
        help="Directory containing PDF files",
    )
    parser.add_argument(
        "-o", "--output", default="pdf_data.json", help="Output JSON file"
    )
    args = parser.parse_args()
    main(args.directory, args.output)

if __name__ == "__main__":  # pragma: no cover
    cli()
