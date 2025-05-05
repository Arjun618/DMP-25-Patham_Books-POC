from transformers import pipeline

# For demo, use a summarization pipeline as a stub for LLM-based tagging
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def generate_metadata(story_text, persona="default"):
    """
    Generate metadata (category, theme, elements) for a story using LLM (stubbed for demo).
    Persona can be used to tune prompt (e.g., 'educator', 'casual reader').
    """
    prompt = (
        f"Analyze the following story and extract: Category, Theme, Story Elements.\n"
        f"Persona: {persona}\nStory: {story_text}\n"
    )
    summary = summarizer(prompt, max_length=60)[0]["summary_text"]
    # Stub: Return fixed metadata for demo
    return {
        "category": "Adventure",
        "theme": "Friendship",
        "elements": ["Animals", "Journey"]
    }

def batch_tag_stories(stories, persona="default"):
    """
    Batch process a list of stories (dicts with 'id' and 'text') and add metadata.
    """
    return [{**story, **generate_metadata(story["text"], persona)} for story in stories]

if __name__ == "__main__":
    # Demo: Tag a sample story
    sample = {"id": "1", "text": "Once upon a time, a rabbit and a turtle became friends and went on an adventure."}
    print(generate_metadata(sample["text"]))
