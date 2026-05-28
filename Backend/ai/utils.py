import json

def safe_json_load(text):

    try:
        return json.loads(text)

    except:

        cleaned = text.replace("```json", "")
        cleaned = cleaned.replace("```", "")

        return json.loads(cleaned)