import io
import logging

import pypdf

from app.services.rag.ports import DocumentLoader, LoadedDocument

logger = logging.getLogger(__name__)


class PDFDocumentLoader(DocumentLoader):
    def load(self, raw_bytes: bytes, filename: str) -> list[LoadedDocument]:
        pdf_file = io.BytesIO(raw_bytes)
        reader = pypdf.PdfReader(pdf_file)

        documents: list[LoadedDocument] = []
        for page_idx, page in enumerate(reader.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                documents.append(
                    LoadedDocument(
                        text=text,
                        page_number=page_idx,
                        metadata={"filename": filename, "page": page_idx},
                    )
                )

        if not documents:
            logger.warning("No text extracted from PDF '%s'", filename)

        return documents
