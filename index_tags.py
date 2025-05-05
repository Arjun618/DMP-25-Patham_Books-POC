from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

def index_metadata(story_id, metadata):
    """
    Update an existing story in Elasticsearch with new metadata fields.
    """
    es.update(index="stories", id=story_id, body={"doc": metadata})

if __name__ == "__main__":
    # Demo: Update a story with metadata
    sample_id = "demo1"
    metadata = {"category": "Adventure", "theme": "Friendship", "elements": ["Animals", "Journey"]}
    index_metadata(sample_id, metadata)
    print(f"Updated {sample_id} with metadata.")
