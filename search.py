from sentence_transformers import SentenceTransformer
from elasticsearch import Elasticsearch

model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
es = Elasticsearch("http://localhost:9200")

def embed_text(text):
    return model.encode(text).tolist()

def search_stories(query, top_k=5):
    query_vec = embed_text(query)
    script_query = {
        "script_score": {
            "query": {"match_all": {}},
            "script": {
                "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                "params": {"query_vector": query_vec}
            }
        }
    }
    res = es.search(index="stories", body={"size": top_k, "query": script_query})
    return [hit["_source"] for hit in res["hits"]["hits"]]

def index_story(story_id, story_text, metadata=None):
    doc = {"text": story_text, "embedding": embed_text(story_text)}
    if metadata:
        doc.update(metadata)
    es.index(index="stories", id=story_id, body=doc)

if __name__ == "__main__":
    # Demo: Index and search a sample story
    sample_id = "demo1"
    sample_text = "Once upon a time, a rabbit and a turtle became friends and went on an adventure."
    index_story(sample_id, sample_text)
    print(search_stories("adventure rabbit turtle"))
