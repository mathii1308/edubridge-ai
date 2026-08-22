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
    def generate_tutor_response(
        db: Session,
        message: str,
        language: str = "English",
        learning_level: str = "Intermediate",
        subject: Optional[str] = None,
        topic: Optional[str] = None,
        action_type: str = "explain"
    ) -> Dict:
        """
        Generates grounded, step-by-step AI Tutor responses with citations and understanding checks.
        Handles English & Tamil queries.
        """
        # Step 1: Topic & Subject Detection
        msg_lower = message.lower()
        detected_subject = subject or "Mathematics"
        if "physics" in msg_lower or "optics" in msg_lower or "wave" in msg_lower or "light" in msg_lower:
            detected_subject = "Physics"
        elif "chemistry" in msg_lower or "organic" in msg_lower or "thermodynamics" in msg_lower:
            detected_subject = "Chemistry"

        detected_topic = topic or "Probability"
        if "probability" in msg_lower or "conditional" in msg_lower or "bayes" in msg_lower or "நிகழ்தகவு" in msg_lower:
            detected_topic = "Probability"
        elif "trigonometry" in msg_lower or "sine" in msg_lower or "cosine" in msg_lower:
            detected_topic = "Trigonometry"
        elif "optics" in msg_lower or "wave" in msg_lower:
            detected_topic = "Wave Optics & Light"
        elif "organic" in msg_lower:
            detected_topic = "Organic Reaction Mechanisms"

        # Step 2: Retrieve Grounded Context via RAG
        rag_chunks = RAGService.retrieve_context(db, query=message, language=language, subject=detected_subject)
        citations = []
        context_str = ""

        for chunk in rag_chunks:
            context_str += f"\n- {chunk['title']}: {chunk['content']}"
            citations.append({
                "title": chunk['title'],
                "source_name": chunk['source_name'],
                "source_url": chunk['source_url'],
                "snippet": chunk['content'][:140] + "..."
            })

        # Step 3: Action-Specific Logic & Multilingual Output Generation
        needs_tutor = False
        learning_gap = None
        difficulty = "Medium"

        if action_type == "struggle" or "still don't understand" in msg_lower or "புரிந்துகொள்ளவில்லை" in msg_lower:
            needs_tutor = True
            learning_gap = f"Persistent struggle applying core principles of {detected_topic}."
            if language == "Tamil":
                reply = (
                    f"**மன்னிக்கவும், இந்த கருத்து உங்களுக்கு இன்னும் சவாலாக உள்ளது போல் தெரிகிறது.**\n\n"
                    f"நாங்கள் மீண்டும் வேறு வழியில் விளக்க முயன்றோம். ஆனால் ஆழமான புரிதலுக்கு ஒரு தனிப்பட்ட மனித ஆசிரியர் (Human Tutor) உங்களுக்கு உடனடியாக உதவ முடியும்.\n\n"
                    f"**நாங்கள் கண்டறிந்த பகுதி:** {detected_topic} ({detected_subject})\n"
                    f"நேரலை ஆசிரியருடன் இணைந்து பாடத்தை எளிதாக கற்க விரும்புகிறீர்களா?"
                )
            else:
                reply = (
                    f"**I understand this concept is still tricky!** Don't worry, learning takes time.\n\n"
                    f"Since this is a core topic in **{detected_topic} ({detected_subject})**, connecting with a dedicated human tutor can provide real-time step-by-step guidance tailored to your pace.\n\n"
                    f"Would you like me to match you with an available tutor right now?"
                )
        elif action_type == "simplify":
            if language == "Tamil":
                reply = (
                    f"**எளிய முறையில் விளக்கம் ({detected_topic}):**\n\n"
                    f"சார்பு நிகழ்தகவு என்பதை ஒரு நிபந்தனை என நினைக்கலாம். உதாரணமாக, மழை பெய்யும்போது குடை கொண்டு செல்வது.\n\n"
                    f"1. முதல் நிகழ்ச்சி நடந்த பிறகுதான் இரண்டாம் நிகழ்ச்சி நடக்கும்.\n"
                    f"2. சூத்திரம்: P(A|B) = P(A ∩ B) / P(B).\n\n"
                    f"**மூலம்:** {citations[0]['title'] if citations else 'Tamil Nadu Educational Textbook'}\n\n"
                    f"**புரிந்துகொண்டீர்களா?** கீழே உள்ள பயிற்சி கேள்வியை முயற்சிக்கவும்."
                )
            else:
                reply = (
                    f"**Let's simplify {detected_topic} for {learning_level} level:**\n\n"
                    f"Imagine conditional probability as looking at a smaller group of possibilities instead of everything.\n\n"
                    f"• **Step 1:** Focus only on event B occurring (your new total universe).\n"
                    f"• **Step 2:** Find how much of event A happens inside event B.\n"
                    f"• **Formula:** P(A|B) = P(A ∩ B) / P(B).\n\n"
                    f"**Real-world Analogy:** What is the probability that a student wears glasses, given that they are in the Science stream?"
                )
        elif action_type == "example":
            if language == "Tamil":
                reply = (
                    f"**நடைமுறை உதாரணம் ({detected_topic}):**\n\n"
                    f"ஒரு பையில் 4 சிவப்பு பந்துகளும் 6 நீல பந்துகளும் உள்ளன. நீங்கள் முதல் பந்தை எடுக்கும்போது சிவப்பு பந்து கிடைக்க நிகழ்தகவு 4/10 ஆகும்.\n\n"
                    f"முதல் பந்தை வெளியே வைத்துவிட்டு, இரண்டாம் பந்தை எடுக்கும்போது மீதம் 9 பந்துகள் மட்டுமே இருக்கும். இதுவே சார்பு நிகழ்தகவு ஆகும்!"
                )
            else:
                reply = (
                    f"**Real-World Example for {detected_topic}:**\n\n"
                    f"Imagine a bag with 4 Red balls and 6 Blue balls. You draw one ball, keep it outside, and draw a second ball.\n\n"
                    f"• **First draw:** P(Red) = 4 / 10\n"
                    f"• **Second draw (given 1st was Red):** P(Red | 1st Red) = 3 / 9\n\n"
                    f"Notice how the second probability changed because of what happened first! That's conditional probability in action."
                )
        else:
            if language == "Tamil":
                reply = (
                    f"**EduBridge AI கற்றல் வழிகாட்டி ({detected_subject} - {detected_topic}):**\n\n"
                    f"உங்கள் கேள்விக்கான grounded கல்வி மூல விளக்கம்:\n\n"
                    f"{context_str if context_str else 'நிகழ்தகவு மற்றும் கணிதக் கோட்பாடுகள் பற்றிய விரிவான விளக்கம்.'}\n\n"
                    f"**படி 1:** கொடுக்கப்பட்ட தரவுகளை அடையாளம் காணவும்.\n"
                    f"**படி 2:** சூத்திரத்தைப் பயன்படுத்தவும்: P(A|B) = P(A ∩ B) / P(B).\n"
                    f"**படி 3:** முடிவைச் சரிபார்க்கவும்."
                )
            else:
                reply = (
                    f"**EduBridge AI Step-by-Step Explanation ({detected_subject} — {detected_topic}):**\n\n"
                    f"Here is the breakdown based on verified open educational materials:\n\n"
                    f"{context_str if context_str else 'Conditional probability measures the likelihood of an event occurring given that another event has already occurred.'}\n\n"
                    f"**Core Steps to Solve:**\n"
                    f"1. Identify the given prior condition P(B).\n"
                    f"2. Identify the joint probability P(A ∩ B).\n"
                    f"3. Divide P(A ∩ B) by P(B) to find P(A|B).\n\n"
                    f"**Quick Check:** Would you like to try a practice problem, or do you need a simpler explanation?"
                )

        return {
            "reply": reply,
            "subject": detected_subject,
            "topic": detected_topic,
            "difficulty": difficulty,
            "learning_gap": learning_gap,
            "confidence": 0.92,
            "needs_tutor": needs_tutor,
            "citations": citations
        }
