from sqlalchemy.orm import Session
from app.models.schemas import EducationalResource, ResourceChunk
from typing import List, Dict

class RAGService:
    @staticmethod
    def retrieve_context(db: Session, query: str, language: str = "English", subject: str = None) -> List[Dict]:
        """
        Retrieves relevant educational resource chunks from the grounded database.
        Performs multi-term keyword matching and subject/language filtering.
        """
        query_terms = [t.lower() for t in query.split() if len(t) > 2]

        resources_query = db.query(EducationalResource).filter(EducationalResource.verified == True)
        if subject:
            resources_query = resources_query.filter(EducationalResource.subject.ilike(f"%{subject}%"))

        resources = resources_query.all()
        matched_chunks = []

        for resource in resources:
            for chunk in resource.chunks:
                content_lower = chunk.content.lower()
                matches = sum(1 for term in query_terms if term in content_lower)

                # Prioritize same language
                lang_bonus = 2 if resource.language.lower() == language.lower() else 0
                score = matches + lang_bonus

                if matches > 0 or len(query_terms) == 0:
                    matched_chunks.append({
                        "title": resource.title,
                        "source_name": resource.source_name,
                        "source_url": resource.source_url,
                        "subject": resource.subject,
                        "language": resource.language,
                        "content": chunk.content,
                        "score": score
                    })

        # Sort by relevance score
        matched_chunks.sort(key=lambda x: x["score"], reverse=True)
        return matched_chunks[:3]  # Top 3 most relevant chunks
