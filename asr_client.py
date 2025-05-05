import whisper
import os

# Load Whisper model once at module level for efficiency
model = whisper.load_model("base")  # You can use "small", "medium", "large" as needed

def transcribe_audio(audio_path, lang="hi"):
    """
    Transcribe audio file using Whisper and return English transcript.
    lang: ISO 639-1 code (e.g., 'hi' for Hindi, 'bn' for Bengali, etc.)
    """
    result = model.transcribe(audio_path, language=lang, task="translate")
    return result["text"]

if __name__ == "__main__":
    # Demo: Transcribe a sample file
    if os.path.exists("sample.wav"):
        print(transcribe_audio("sample.wav", lang="hi"))
    else:
        print("No sample.wav found for demo.")
