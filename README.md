# AI-Powered Multilingual Search Assistant for StoryWeaver (Pratham Books)

This repository is a **Proof of Concept (POC)** for an AI-powered, multilingual search and tagging assistant for the [StoryWeaver](https://storyweaver.org.in/) platform by Pratham Books. The project demonstrates how modern AI techniques can enable advanced search (text and voice), automatic story tagging, and persona-based metadata generation for digital story libraries.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [How It Works](#how-it-works)
- [Customization](#customization)
- [Limitations & Notes](#limitations--notes)
- [Future Work](#future-work)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Project Overview

**Goal:**
Build a POC for a multilingual, AI-powered search and tagging assistant for StoryWeaver, enabling users to:
- Search stories using text or voice (in Indian languages)
- Automatically generate story tags and metadata using AI
- Support different user personas (e.g., educator, casual reader)

This POC demonstrates the feasibility of integrating speech recognition, semantic search, and AI-based tagging for digital story platforms.

---

## Features

- **Text Search:**
  - Search stories using natural language queries.
  - Uses semantic embeddings for relevant results.

- **Voice Search:**
  - Upload an audio file (e.g., in Hindi) and search stories using the transcribed query.
  - Powered by OpenAI Whisper for speech-to-text and translation.

- **AI Tag Generation:**
  - Paste story text and generate metadata (category, theme, elements) using an LLM.
  - Persona-based tagging: select a persona (e.g., educator) to influence tag generation.

- **Story Indexing:**
  - Index new stories and update their metadata in Elasticsearch for fast retrieval.

- **Modern Frontend:**
  - Simple, responsive UI for demo purposes (HTML/CSS/JS).

---

## Architecture

```
[User] <-> [Frontend (HTML/JS)] <-> [Flask API] <-> [AI Models, Elasticsearch, Whisper]
```

- **Frontend:**
  - `frontend/index.html`, `frontend/main.js`: UI for search, tagging, and persona selection.
- **Backend:**
  - `app.py`: Flask API server, routes for search, tagging, indexing.
  - `search.py`: Semantic search and story indexing using sentence-transformers and Elasticsearch.
  - `asr_client.py`: Speech-to-text and translation using OpenAI Whisper.
  - `tagging.py`: AI-based tag/metadata generation (stubbed with summarization pipeline for demo).
  - `index_tags.py`: Update story metadata in Elasticsearch.

---

## Setup & Installation

### Prerequisites
- Python 3.8+
- [Elasticsearch](https://www.elastic.co/downloads/elasticsearch) running locally (default: `http://localhost:9200`)
- pip (Python package manager)

### Installation Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Arjun618/DMP-25-Patham_Books-POC.git
   cd Pratham_Books
   ```

2. **Create and activate a virtual environment:**
   ```sh
   # Windows
   python -m venv venv
   venv\Scripts\activate
   # Linux/Mac
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Start Elasticsearch:**
   - Download and run Elasticsearch (see [docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)).
   - Ensure it is running at `http://localhost:9200`.

5. **Run the Flask app:**
   ```sh
   python app.py
   ```
   The app will be available at [http://localhost:5000](http://localhost:5000)

---

## Usage Guide

### 1. **Text Search**
- Enter a search query in the search box.
- Click **Search** or press Enter.
- Results will appear below.

### 2. **Voice Search**
- Click **Choose Audio File** and select an audio file (e.g., Hindi speech, `.wav` recommended).
- Click **Voice Search**.
- The system transcribes the audio, translates to English, and performs a search.

### 3. **Generate Tags**
- Select a persona (Default, Educator, Casual Reader).
- Paste story text in the textarea.
- Click **Generate Tags**.
- AI-generated metadata (category, theme, elements) will be shown.

### 4. **Indexing Stories**
- Use the `/index-story` API to add new stories (see API section).
- Use `/index-tags` to update metadata for existing stories.

---

## API Endpoints

All endpoints are served by `app.py` (Flask):

- `POST /text-search`
  - **Body:** `{ "query": "search query" }`
  - **Returns:** `{ "results": [ ... ] }`

- `POST /voice-search`
  - **Form-data:** `audio` (file), `lang` (optional, e.g., `hi` for Hindi)
  - **Returns:** `{ "transcript": "...", "results": [ ... ] }`

- `POST /generate-tags`
  - **Body:** `{ "text": "story text", "persona": "default" }`
  - **Returns:** `{ "category": ..., "theme": ..., "elements": [...] }`

- `POST /index-story`
  - **Body:** `{ "id": "story_id", "text": "story content", "metadata": { ... } }`
  - **Returns:** `{ "status": "indexed", "id": ... }`

- `POST /index-tags`
  - **Body:** `{ "id": "story_id", "metadata": { ... } }`
  - **Returns:** `{ "status": "tags updated", "id": ... }`

---

## Technologies Used

- **Backend:** Flask, Python
- **Search Engine:** Elasticsearch
- **Speech Recognition:** OpenAI Whisper
- **NLP & AI:** Hugging Face Transformers, Sentence Transformers
- **Frontend:** HTML, CSS, JavaScript

---

## How It Works

- **Text Search:**
  - User query is embedded using a sentence transformer.
  - Elasticsearch performs semantic search using vector similarity.

- **Voice Search:**
  - Audio is transcribed and translated to English using Whisper.
  - The transcript is used as a search query.

- **Tag Generation:**
  - Story text and persona are sent to an LLM (stubbed with summarization for demo).
  - Returns category, theme, and elements.

- **Indexing:**
  - Stories and their embeddings/metadata are stored in Elasticsearch for fast retrieval.

---

## Customization

- **Add More Languages:**
  - Whisper supports many Indian languages. Change the `lang` parameter in `/voice-search`.
- **Improve Tagging:**
  - Replace the summarization stub in `tagging.py` with a custom LLM prompt or fine-tuned model.
- **Frontend:**
  - The UI is a simple demo; can be extended or integrated with StoryWeaver.

---

## Limitations & Notes

- This is a POC; not production-ready.
- Tagging uses a summarization model as a placeholder for a real LLM.
- No authentication or user management.
- Elasticsearch must be running locally.
- Whisper model size can be changed for better accuracy/performance.

---

## Future Work

This POC lays the groundwork for a production-grade AI-powered search assistant for StoryWeaver. The following enhancements are planned for future iterations to fully meet the project's requirements and goals:

### Planned Features & Improvements

- **Advanced LLM Integration:**
  - Replace the current summarization stub with state-of-the-art LLMs such as LLaMA 3.1 (8B), Lade, or similar models for more accurate and nuanced metadata tagging.
  - Implement Tree-of-Thought prompting for richer, context-aware tag and theme extraction.

- **Conversational UI:**
  - Develop a web-based chatbot interface that supports both keyword-based and open-ended conversational search.
  - Enable the system to differentiate between direct queries and theme-based exploration, providing a more interactive discovery experience.

- **Enhanced Voice ASR:**
  - Integrate Sarvam APIs or equivalent for robust Indic speech-to-English transcription, improving voice search accuracy across Indian languages.

- **Scalability & Performance:**
  - Optimize backend and Elasticsearch indexing to support 15–16K daily active users (DAUs), with up to 20–25% using voice search.
  - Performance test the system for 3K daily voice users and 360K+ characters/day throughput.

- **Personalization & User Personas:**
  - Expand persona-based search and tagging to better serve teachers, parents, and children, including personalized recommendations and search results.

- **Metadata Matching & Tagging:**
  - Implement advanced keyword extraction and AI-generated thematic tags, indexed in Elasticsearch for fast retrieval.
  - Support future Indic LLM tagging and personalization use cases.

- **Frontend Integration:**
  - Integrate the assistant directly with the StoryWeaver platform for seamless user experience.

### Acceptance Criteria (for Production)
- LLM-generated metadata tagging (Category, Theme, Elements) for the full story set
- End-to-end voice search pipeline (voice → English → search query → book retrieval)
- Conversational UI for both known queries and theme-based exploration
- Metadata indexing utility integrated with Elasticsearch
- System performance validated on target user and data volumes

---

## Acknowledgements
- **Pratham Books** for the StoryWeaver platform and inspiration.
- **OpenAI** for Whisper ASR.
- **Hugging Face** for transformer models.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
