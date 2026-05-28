from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """
You are a Fashion eCommerce AI assistant.

RULES:
- Use ONLY provided products
- Never hallucinate
- Return valid JSON only

FORMAT:

{{
  "answer": "...",
  "products": [
    {{ "pid": "..." }}
  ]
}}
"""
    ),
    (
        "human",
        "Context:\n{context}\n\nQuery:\n{question}"
    )
])