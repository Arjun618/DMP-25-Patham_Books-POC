from flask import Flask, request, jsonify, send_from_directory
from asr_client import transcribe_audio
from search import search_stories, index_story
from tagging import generate_metadata
from index_tags import index_metadata
import os

app = Flask(__name__, static_folder='frontend')

# Serve frontend files
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

@app.route("/voice-search", methods=["POST"])
def voice_search():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
            
        audio = request.files["audio"]
        lang = request.form.get("lang", "hi")
        temp_path = "temp.wav"
        audio.save(temp_path)
        transcript = transcribe_audio(temp_path, lang)
        results = search_stories(transcript)
        os.remove(temp_path)
        return jsonify({"transcript": transcript, "results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/text-search", methods=["POST"])
def text_search():
    try:
        data = request.json
        if not data or 'query' not in data or not data['query'].strip():
            return jsonify({"error": "Query cannot be empty"}), 400
            
        query = data["query"]
        results = search_stories(query)
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/generate-tags", methods=["POST"])
def generate_tags():
    try:
        data = request.json
        if not data or 'text' not in data or not data['text'].strip():
            return jsonify({"error": "Story text cannot be empty"}), 400
            
        story_text = data["text"]
        persona = data.get("persona", "default")
        tags = generate_metadata(story_text, persona)
        return jsonify(tags)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/index-story", methods=["POST"])
def index_story_api():
    try:
        data = request.json
        if not data or 'id' not in data or 'text' not in data:
            return jsonify({"error": "Story ID and text are required"}), 400
            
        story_id = data["id"]
        story_text = data["text"]
        metadata = data.get("metadata")
        index_story(story_id, story_text, metadata)
        return jsonify({"status": "indexed", "id": story_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/index-tags", methods=["POST"])
def index_tags_api():
    try:
        data = request.json
        if not data or 'id' not in data or 'metadata' not in data:
            return jsonify({"error": "Story ID and metadata are required"}), 400
            
        story_id = data["id"]
        metadata = data["metadata"]
        index_metadata(story_id, metadata)
        return jsonify({"status": "tags updated", "id": story_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
