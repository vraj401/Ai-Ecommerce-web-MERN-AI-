from langchain_community.vectorstores import Chroma
from langchain_mistralai import MistralAIEmbeddings
from dotenv import load_dotenv
load_dotenv()
from config import CHROMA_PATH

embedding_model = MistralAIEmbeddings(
    model="mistral-embed"
)

vectorstore = Chroma(
    persist_directory=str(CHROMA_PATH),
    embedding_function=embedding_model
)