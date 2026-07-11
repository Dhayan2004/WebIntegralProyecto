import io
import pypdf
from sqlalchemy.orm import Session
from app.db.models.document import Document, DocumentChunk
from app.services.rag.llama_index_client import LlamaIndexClient
from llama_index.core import Document as LlamaDocument

class RAGManager:
    @staticmethod
    def ingest_pdf_bytes(db: Session, document_id: str, pdf_bytes: bytes) -> int:
        try:
            # Parse PDF using pypdf
            pdf_file = io.BytesIO(pdf_bytes)
            reader = pypdf.PdfReader(pdf_file)
            
            llama_docs = []
            full_text_list = []
            
            for page_idx, page in enumerate(reader.pages, start=1):
                text = page.extract_text()
                if text and text.strip():
                    full_text_list.append(text)
                    # Create LlamaIndex Document with metadata
                    llama_doc = LlamaDocument(
                        text=text,
                        metadata={
                            "page_number": page_idx
                        }
                    )
                    llama_docs.append(llama_doc)
            
            # If no text could be extracted, use a fallback
            if not llama_docs:
                doc = db.query(Document).filter(Document.id == document_id).first()
                if doc:
                    doc.status = "error"
                    db.commit()
                return 0

            # Split into chunks using LlamaIndex SentenceSplitter
            splitter = LlamaIndexClient.get_splitter()
            nodes = splitter.get_nodes_from_documents(llama_docs)
            
            chunks_created = 0
            for node in nodes:
                # Generate embedding via LlamaIndexClient
                embedding = LlamaIndexClient.get_embedding(node.text)
                
                chunk = DocumentChunk(
                    document_id=document_id,
                    content=node.text,
                    embedding=embedding,
                    page_number=node.metadata.get("page_number", 1)
                )
                db.add(chunk)
                chunks_created += 1
            
            # Update document content with full text and status to ready
            doc = db.query(Document).filter(Document.id == document_id).first()
            if doc:
                doc.content = "\n".join(full_text_list)
                doc.file_size_bytes = len(doc.content.encode("utf-8"))
                doc.status = "ready"
                
            db.commit()
            return chunks_created
            
        except Exception as e:
            print(f"Error during RAG ingestion: {e}")
            doc = db.query(Document).filter(Document.id == document_id).first()
            if doc:
                doc.status = "error"
                db.commit()
            raise e
