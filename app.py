from flask import Flask, request, jsonify
from flask_cors import CORS  # Importing CORS for handling cross-origin requests
import time
import os
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
import google.generativeai as genai

# Initialize the Flask app and other components
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from other domains

GOOGLE_API_KEY = "AIzaSyAGd2KSJGw0lLA6EmJLSyRwsJlOX5pGWjs"
genai.configure(api_key=GOOGLE_API_KEY)
pc = Pinecone(api_key="pcsk_GGrv7_6rrs1fyUx2E3nnHrVb7jUkFyvQCyMrKDNdn8ghp1tkanHb1gno58vW8ufAEgGFh")

index_name = "sandalwood-docs"  # change if desired

existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

if index_name not in existing_indexes:
    pc.create_index(
        name=index_name,
        # dimension=1276,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
    while not pc.describe_index(index_name).status["ready"]:
        time.sleep(1)

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
index = pc.Index(index_name)
vector_store = PineconeVectorStore(index=index, embedding=embeddings)

prompt = ChatPromptTemplate.from_template("""
You are an expert in sandalwood cultivation, known for providing clear, accurate, and comprehensive answers.
Given the context below, analyze it step-by-step and respond with a detailed, insightful answer. Ensure that your explanation covers all relevant aspects of the question, including practical advice, scientific background, and common best practices.

<context>
{context}
</context>
Question: {input}

Your answer should be structured as follows:
1. **Initial Analysis**: Briefly restate the question and identify the key aspects to address.
2. **Contextual Insights**: Extract and summarize the most important information from the context provided.
3. **Detailed Explanation**: Provide a thorough response that addresses the question, incorporating practical tips, industry knowledge, and evidence-based practices.
4. **Conclusion**: Summarize the main points and suggest any additional resources or next steps if applicable.
""")


model = genai.GenerativeModel(model_name="gemini-1.5-pro")

llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)

document_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)
retriever = vector_store.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, document_chain)

def model_response(query):
    response = retrieval_chain.invoke({"input": query})
    return response


def translate_text_with_llm(text, target_lang="en"):
    """
    Translates the input text to the target language (English) using LLM.
    """
    try:
        # Using the LLM model to generate content
        response = model.generate_content(f"Translate the following text to {target_lang}: '{text}'")
        
        # Extracting the text from the response
        content = response.candidates[0].content.parts[0].text.strip()
        
        print(content)  # For debugging purposes
        return content
    except Exception as e:
        raise Exception(f"Error during translation: {str(e)}")

@app.route('/query', methods=['POST'])
def process_query():
    data = request.get_json()
    if 'query' not in data:
        return jsonify({"error": "Invalid request. 'query' field is missing."}), 400

    user_query = data['query']

    try:
        # Step 1: Translate the input text to English using the LLM
        translated_text = translate_text_with_llm(user_query)
        
        # Step 2: Send the translated text to your RAG model for response generation
        response = model_response(translated_text)

        return jsonify({
            "original_query": user_query,
            "translated_query": translated_text,
            "response": response['answer']
        })
    except Exception as e:
        return jsonify({"error": f"Error processing the query: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
