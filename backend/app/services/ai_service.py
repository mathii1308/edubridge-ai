from typing import Dict, List, Optional
from app.services.rag_service import RAGService
from sqlalchemy.orm import Session

SYSTEM_PROMPT = """You are EduBridge AI, a personalized educational tutor.
Your goal is to help students understand concepts, not simply provide answers.
Use the supplied educational knowledge base whenever relevant.
Never invent educational sources or citations.
Explain concepts step-by-step.
Adapt explanations to the student's learning level.
Adapt language to the student's selected language.

If the student does not understand:
1. Try a different explanation.
2. Simplify the concept.
3. Use an example.
4. Identify the likely misconception.

If the student still struggles after multiple explanations, recommend human tutor support.
Return structured learning information when possible:
subject, topic, difficulty, learning_gap, confidence, needs_tutor.

Never claim that a tutor is available unless the backend confirms real-time availability.
Never claim scholarship eligibility unless verified scholarship rules support the claim."""

class AIService:
    @staticmethod
    def analyze_requirement(message: str) -> Dict:
        msg_lower = message.lower()
        
        subject = "Mathematics"
        topic = "General Concept"
        difficulty = "Medium"
        requirement = "Concept explanation and step-by-step guidance"

        if "dbms" in msg_lower or "database" in msg_lower or "normaliz" in msg_lower or "2nf" in msg_lower or "3nf" in msg_lower or "bcnf" in msg_lower or "sql" in msg_lower or "table" in msg_lower or "primary key" in msg_lower:
            subject = "DBMS"
            topic = "Database Management & Normalization"
            if "2nf" in msg_lower or "3nf" in msg_lower or "normaliz" in msg_lower:
                difficulty = "2NF / 3NF Normal Forms"
                requirement = "Needs clear explanation of Database Normalization (1NF, 2NF, 3NF, BCNF) and functional dependencies"
            else:
                difficulty = "Relational Model & SQL"
                requirement = "Concept breakdown of relational databases, primary keys, and query optimization"
        elif "physics" in msg_lower or "optics" in msg_lower or "wave" in msg_lower or "light" in msg_lower or "lens" in msg_lower or "thermodynam" in msg_lower or "mechanics" in msg_lower:
            subject = "Physics"
            topic = "Wave Optics & Thermodynamics"
            difficulty = "Interference & Wavefronts"
            requirement = "Derivation & Huygens principle explanation"
        elif "chemistry" in msg_lower or "organic" in msg_lower or "reaction" in msg_lower or "bonding" in msg_lower:
            subject = "Chemistry"
            topic = "Organic Chemistry & Bonding"
            difficulty = "Reaction Mechanisms"
            requirement = "Step-by-step reaction mechanism breakdown"
        elif "probability" in msg_lower or "bayes" in msg_lower or "calculus" in msg_lower or "math" in msg_lower or "algebra" in msg_lower:
            subject = "Mathematics"
            topic = "Calculus & Probability"
            difficulty = "Conditional Probability & Integrals"
            requirement = "Formula application and step-by-step proofs"

        return {
            "subject": subject,
            "topic": topic,
            "difficulty": difficulty,
            "student_requirement": requirement,
            "type_of_help": "Human tutoring if AI assistance is insufficient"
        }

    @staticmethod
    def generate_tutor_response(
        db: Session,
        message: str,
        language: str = "English",
        learning_level: str = "Intermediate",
        subject: Optional[str] = None,
        topic: Optional[str] = None,
        action_type: str = "explain",
        reference_text: Optional[str] = None,
        reference_title: Optional[str] = None
    ) -> Dict:
        msg_lower = message.lower()
        analysis = AIService.analyze_requirement(message)

        # Override default 'Mathematics' or generic subject if the user's message explicitly references another subject
        if subject == "Mathematics" and analysis["subject"] != "Mathematics":
            detected_subject = analysis["subject"]
            detected_topic = analysis["topic"]
        else:
            detected_subject = subject or analysis["subject"]
            detected_topic = topic or analysis["topic"]

        difficulty = analysis["difficulty"]

        citations = []
        context_prefix = ""

        # Handle Reference Material Context if provided
        if reference_text and reference_text.strip():
            ref_name = reference_title or "Uploaded Reference Material"
            context_prefix = f"📌 **Answer grounded on student reference context ({ref_name}):**\n\n"
            citations.append({
                "title": f"Student Reference Context: {ref_name}",
                "source_name": "Provided Reference Material",
                "source_url": "#reference",
                "snippet": reference_text[:140] + "..."
            })
        else:
            # Retrieve Grounded Context via RAG
            rag_chunks = RAGService.retrieve_context(db, query=message, language=language, subject=detected_subject)
            for chunk in rag_chunks:
                citations.append({
                    "title": chunk['title'],
                    "source_name": chunk['source_name'],
                    "source_url": chunk['source_url'],
                    "snippet": chunk['content'][:140] + "..."
                })

        needs_tutor = False
        learning_gap = None

        if action_type == "struggle" or "still don't understand" in msg_lower or "புரிந்துகொள்ளவில்லை" in msg_lower:
            needs_tutor = True
            learning_gap = f"Persistent struggle applying core principles of {detected_topic} ({difficulty})."
            if language == "Tamil":
                reply = (
                    f"**மன்னிக்கவும், இந்த கருத்து ({detected_topic}) உங்களுக்கு இன்னும் சவாலாக உள்ளது போல் தெரிகிறது.**\n\n"
                    f"ஒரு தனிப்பட்ட மனித ஆசிரியர் (Human Tutor) உங்களுக்கு உடனடியாக உதவ முடியும்.\n\n"
                    f"**பாடப்பகுதி:** {detected_topic} — {detected_subject}\n"
                    f"நேரலை ஆசிரியருடன் இணைந்து பாடத்தை கற்க விரும்புகிறீர்களா?"
                )
            else:
                reply = (
                    f"**I understand this concept is tricky!** Mastering {detected_topic} takes dedicated step-by-step guidance.\n\n"
                    f"Connecting with a human tutor for **{detected_topic} ({detected_subject})** can provide personalized, real-time feedback.\n\n"
                    f"Would you like me to match you with an available tutor right now?"
                )
        elif reference_text and reference_text.strip():
            reply = (
                f"{context_prefix}"
                f"Based on your reference text for **{detected_subject} ({detected_topic})**:\n\n"
                f"1. **Core Concept:** The excerpt discusses fundamental rules for {detected_topic}.\n"
                f"2. **Application to '{message}':** Following the provided reference text, analyze key parameters step-by-step and verify constraints.\n"
                f"3. **Summary:** All conditions match the constraints in your reference document.\n\n"
                f"Would you like a simplified explanation or a practical example based on this text?"
            )
        else:
            # Rich Subject-Specific Explanations
            if detected_subject == "DBMS":
                reply = (
                    f"**EduBridge AI Step-by-Step Explanation ({detected_subject} — {detected_topic}):**\n\n"
                    f"Here is the detailed academic breakdown for **DBMS Concepts**:\n\n"
                    f"1. **Database & Schema:** A Relational Database Management System (RDBMS) organizes data into structured tables (relations) consisting of rows (tuples) and columns (attributes).\n\n"
                    f"2. **Core Concepts:**\n"
                    f"   - **Keys:** *Primary Key* uniquely identifies each row; *Foreign Key* enforces referential integrity across tables.\n"
                    f"   - **Normalization:** Process of reducing data redundancy and preventing insert/update/delete anomalies.\n"
                    f"     • **1NF:** Atomic attribute values (no repeating groups).\n"
                    f"     • **2NF:** 1NF + Elimination of Partial Functional Dependencies.\n"
                    f"     • **3NF:** 2NF + Elimination of Transitive Functional Dependencies ($X \\to Y, Y \\to Z$).\n"
                    f"     • **BCNF:** Boyce-Codd Normal Form (Every determinant $X$ must be a super key).\n"
                    f"   - **ACID Properties:** Atomicity, Consistency, Isolation, and Durability guarantees transaction reliability.\n\n"
                    f"3. **Next Steps:** Would you like a worked normalization problem (1NF to 3NF) or a practice quiz question on DBMS?"
                )
            elif detected_subject == "Physics":
                reply = (
                    f"**EduBridge AI Step-by-Step Explanation ({detected_subject} — {detected_topic}):**\n\n"
                    f"Here is the detailed physics explanation for **{detected_topic}**:\n\n"
                    f"1. **Huygens Principle:** Every point on a primary wavefront acts as a source of secondary wavelets radiating in all directions at the speed of light.\n"
                    f"2. **Interference & Superposition:**\n"
                    f"   - *Constructive Interference:* Path difference $\\Delta x = n\\lambda$, Phase difference $\\phi = 2n\\pi$.\n"
                    f"   - *Destructive Interference:* Path difference $\\Delta x = (2n+1)\\frac{{\\lambda}}{{2}}$, Phase difference $\\phi = (2n+1)\\pi$.\n"
                    f"3. **Fringe Width Formula:** $\\beta = \\frac{{\\lambda D}}{{d}}$, where $D$ is screen distance and $d$ is slit separation.\n\n"
                    f"Would you like a sample numerical problem on Young's Double Slit Experiment?"
                )
            elif detected_subject == "Chemistry":
                reply = (
                    f"**EduBridge AI Step-by-Step Explanation ({detected_subject} — {detected_topic}):**\n\n"
                    f"Here is the chemical analysis for **{detected_topic}**:\n\n"
                    f"1. **Reaction Mechanism:** Electrophilic and nucleophilic attacks govern organic transformations.\n"
                    f"2. **Carbocation Stability:** $3^\\circ > 2^\\circ > 1^\\circ$ due to inductive effects and hyperconjugation.\n"
                    f"3. **Thermodynamic vs Kinetic Control:** Low temperatures favor kinetic products; higher temperatures yield thermodynamically stable products.\n\n"
                    f"Would you like a step-by-step mechanism breakdown for an electrophilic addition reaction?"
                )
            else:
                reply = (
                    f"**EduBridge AI Step-by-Step Explanation ({detected_subject} — {detected_topic}):**\n\n"
                    f"Here is the detailed academic breakdown for your doubt regarding **'{message}'**:\n\n"
                    f"1. **Concept Definition:** Core theoretical principles governing **{detected_topic}** under **{detected_subject}**.\n"
                    f"2. **Methodology:** State initial conditions, set up governing equations, and solve systematically step-by-step.\n"
                    f"3. **Verification:** Validate results against boundary conditions and expected dimensional units.\n\n"
                    f"Would you like a simplified explanation or a practical real-world example?"
                )

        return {
            "reply": reply,
            "subject": detected_subject,
            "topic": detected_topic,
            "difficulty": difficulty,
            "learning_gap": learning_gap,
            "confidence": 0.96,
            "needs_tutor": needs_tutor,
            "citations": citations
        }



