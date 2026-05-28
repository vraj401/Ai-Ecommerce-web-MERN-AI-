import sys
import json

from langchain_mistralai import ChatMistralAI

from vectorstore import vectorstore
from query_parser import extract_filters
from reranker import rerank
from prompt import prompt
from utils import safe_json_load

query = sys.argv[1]

# -------------------------
# FILTER EXTRACTION
# -------------------------
filters = extract_filters(query)

# -------------------------
# RETRIEVAL
# -------------------------
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 20,
        "fetch_k": 50,
        "lambda_mult": 0.7
    }
)

docs = retriever.invoke(query)

# -------------------------
# RERANK
# -------------------------
docs = rerank(docs, filters)

# -------------------------
# CONTEXT
# -------------------------
context = "\n\n".join(
    f"""
PID: {doc.metadata.get('pid')}
Title: {doc.metadata.get('title')}
Brand: {doc.metadata.get('brand')}
Price: {doc.metadata.get('selling_price')}
"""
    for doc in docs[:10]
)

# -------------------------
# LLM
# -------------------------
llm = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0,
    response_format={"type": "json_object"}
)

final_prompt = prompt.invoke({
    "context": context,
    "question": query
})

response = llm.invoke(final_prompt)

parsed = safe_json_load(response.content)

# -------------------------
# VALIDATE PRODUCTS
# -------------------------
valid_pids = []

retrieved_pids = {
    doc.metadata.get("pid")
    for doc in docs
}

for p in parsed.get("products", []):

    pid = p.get("pid")

    if pid in retrieved_pids:
        valid_pids.append(pid)

# fallback
if not valid_pids:
    valid_pids = list(retrieved_pids)[:5]

output = {
    "answer": parsed.get("answer", ""),
    "products": valid_pids[:5]
}

print(json.dumps(output, indent=2))