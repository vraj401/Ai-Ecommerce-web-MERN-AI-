import json

from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_mistralai import MistralAIEmbeddings
from pathlib import Path


from dotenv import load_dotenv

load_dotenv()

# LOAD JSON 


BASE_DIR = Path(__file__).resolve().parent

json_path = BASE_DIR.parent / "data" / "products.json"

with open(json_path, "r") as f:
    products = json.load(f)
documents = []

# CONVERT PRODUCTS TO DOCUMENTS
for product in products:
    product_details = product.get("productDetails", {})
    details_text = " ".join(f"{k}: {v}" for k, v in product_details.items())

    content = f"""
PID: {product.get("pid")}

Title: {product.get("title")}

Brand: {product.get("brand")}

Category: {product.get("category")}

SubCategory: {product.get("subCategory")}

Description: {product.get("description")}

Selling Price: {product.get("sellingPrice")}

Actual Price: {product.get("actualPrice")}

Discount: {product.get("discountPercentage")}

Rating: {product.get("averageRating")}

Seller: {product.get("seller")}

Product Details: {details_text}

Intent Tags:
Affordable: {product.get("sellingPrice", 0) < 1000}
Premium: {product.get("sellingPrice", 0) > 3000}
High Rated: {product.get("averageRating", 0) > 4}
Discounted: {product.get("discountPercentage", 0) > 20}
"""
    

    
    doc = Document(

    page_content=content,

    metadata={

        # UNIQUE IDENTIFIERS
        "pid": product.get("pid"),
        "title": product.get("title"),

        # PRODUCT INFO
        "brand": product.get("brand"),
        "category": product.get("category"),
        "subCategory": product.get("subCategory"),

        # PRICING
        "sellingPrice": product.get("sellingPrice"),
        "actualPrice": product.get("actualPrice"),
        "discountPercentage": product.get("discountPercentage"),

        # QUALITY
        "averageRating": product.get("averageRating"),
        "stock": product.get("stock"),
        "outOfStock": product.get("outOfStock"),

        # SELLER
        "seller": product.get("seller"),

        # MEDIA
        "images": product.get("images"),

        # EXTRA
        "url": product.get("url")
    }
)

    documents.append(doc)

# SPLITTER
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

# chunks = splitter.split_documents(documents)

# EMBEDDING MODEL
embedding_model = MistralAIEmbeddings(
    model="mistral-embed"
)

# STORE IN CHROMA
vectorstore = Chroma.from_documents(
    documents=documents,
    embedding=embedding_model,
    persist_directory="chroma-db"
)
