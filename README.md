# Gibraltar Chatbot

##  Project Description

Gibraltar is a fully client-side AI-powered chatbot web application,
that runs entirely in the browser without any backend server.
It retrieves relevant information from a resume,
and generates context-aware answers using Retrieval-Augmented Generation (RAG).
The system eliminates server infrastructure,
improves privacy,
and demonstrates how modern web technologies can host lightweight AI systems entirely on the client side.
* Live Link: https://gibraltar-chatbot.netlify.app/

##  Table of Contents

* [Motivation](#motivation)
  
* [Features](#features)
  
* [Tech Stack](#tech-stack)

* [Installation](#installation)

* [Running the Project](#running-the-project)
  
* [How to Use](#how-to-use)
  
* [What I Learned](#what-i-learned)
  
* [Project Highlights](#project-highlights)

---

##  Motivation

* Traditional resumes are static documents, forcing recruiters to manually search for relevant information where important details may be overlooked.
* My goal was to transform a static resume into an interactive knowledge system, allowing recruiters to quickly retrieve specific information through conversational interaction.
* I wanted to build a cost-effective, privacy-first AI application without relying on expensive cloud APIs or backend infrastructure.

---

##  Features

*  **Interactive Resume Exploration:** Recruiters can ask natural language questions about projects, skills, and experience.
*  **Retrieval-Augmented Generation (RAG):** Combines semantic search with language generation for accurate, context-aware responses.
*  **Browser-Based AI Model Execution:** Runs a lightweight language model directly inside the user's browser using WebGPU.
*  **Vector Similarity Search:** Uses pre-built embeddings and cosine similarity to retrieve the most relevant resume information locally.
*  **Nested Conversations:** Allows users to branch off into nested chat threads based on specific context without losing the main conversation history.
*  **Privacy-Focused Design:** All computations happen locally in the browser; no data leaves the user's device.

---

##  Tech Stack

* **Frontend:** React.js, Vite, JavaScript, Carbon Design System
* **AI/ML Integration:** Transformers.js, WebGPU
* **Models:** SmolLM2-1.7B-Instruct (Text Generation), all-MiniLM-L6-v2 (Vector Embeddings)
* **State Management:** React Context API (`ChatContext`)
* **Scripting:** Node.js (for pre-building resume embeddings)

---

##  Installation

1. **Clone the repository**

```bash
git clone https://github.com/sakshibhongle1221/gibraltar-chatbot.git
```
2. **Navigate to the folder and install dependencies**

```bash
cd gibraltar-chatbot
npm install
```
##  Running the Project
1. **Pre-build the Resume Embeddings**

```bash
node scripts/prebuildEmbeddings.cjs
```
2. **Start the User Frontend**

```bash
npm run dev
```

Your app will run at:

* Frontend UI: http://localhost:5173 (or default Vite port)

---

##  How to Use
* Open the web application and type a question about Sakshi's resume (e.g., "What projects has Sakshi worked on?").

* Wait for the initial download of the lightweight language and embedding models into your browser cache.

* Click the "Nest" button on any specific response block to open a nested chat thread based on that retained context.

* Use the sidebar to create new chats or switch between active conversation threads.

---

##  What I Learned
* Implementing a fully client-side Retrieval-Augmented Generation (RAG) pipeline without any backend servers

* Integrating machine learning models directly into a React application using Transformers.js and WebGPU execution

* Parsing markdown documents and generating static vector embeddings for semantic search

* Managing complex nested state architectures in React using the Context API to handle multi-level conversational UI

---

##  Project Highlights
* Complete elimination of server infrastructure and backend costs by hosting the AI systems entirely on the client side.

* Ensures 100% user privacy as all prompts and context remain local to the browser.

* Demonstrstrates advanced frontend engineering with a highly scalable, nested React Context architecture

---

> Built with ❤️.
