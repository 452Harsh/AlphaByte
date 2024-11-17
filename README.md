# 🌱 AlphaByte: Audio Processing Pipeline for Sandalwood Cultivation  
 
*Preserving indigenous knowledge on sandalwood cultivation through cutting-edge AI.*  

---

## 📜 Table of Contents  
- [Overview](#-overview)  
- [Features](#-features)  
- [System Architecture](#-system-architecture)  
- [Installation](#-installation)  
 

---

## 📖 Overview  
AlphaByte is a pipeline designed to convert Kannada audio resources on sandalwood cultivation into a user-friendly, queryable system. This project ensures that valuable indigenous knowledge is preserved and made accessible worldwide.  

---

## ✨ Features  
- **Speech Recognition**: Leverages OpenAI’s Whisper model for accurate transcription of Kannada audio.  
- **Text Translation**: Converts Kannada text to English using Generative AI while maintaining cultural nuances.  
- **Efficient Storage**: Stores processed data as vector embeddings in Pinecone for rapid retrieval.  
- **Q&A System**: Retrieves and generates responses to user queries using embedded content.  
- **Interactive UI**: Provides an accessible chatbot interface supporting text and voice inputs.  

---

## 🛠️ System Architecture  
The system is divided into the following components:  
1. **Speech Recognition**: Kannada audio → Transcribed text.  
2. **Text Translation**: Transcription → English text.  
3. **Vector Embedding**: Text → Semantic embeddings (Pinecone storage).  
4. **Retrieval and Q&A**: Semantic search + AI-generated answers.  
5. **User Interface**: Intuitive web-based interface for interaction.

## 🖥️ Installation  

1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/your-repo/alphabyte.git  
   cd alphabyte/sandalwood-website
   for website running
   npm i 
   npm run dev


   for model 
   cd alphabyte
   python app.py





