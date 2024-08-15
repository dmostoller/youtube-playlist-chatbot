from flask import Flask, request, jsonify, make_response, render_template
from flask_cors import CORS
import re
import os
import openai
from youtube_transcript_api import YouTubeTranscriptApi
from googleapiclient.discovery import build


openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",    
)

CORS(app)

@app.route("/", defaults={'path': ''})
@app.route("/<string:path>")
@app.route("/<path:path>")
def index(path):
    return render_template("index.html")

def query_index():
    # retrive open ai key
    try:
        from llama_index.core import (
            VectorStoreIndex,
            SimpleDirectoryReader,
            StorageContext,
            load_index_from_storage,
        )

        # check if storage already exists
        PERSIST_DIR = "./storage"
        if not os.path.exists(PERSIST_DIR):
            # load the documents and create the index
            documents = SimpleDirectoryReader("data").load_data()
            index = VectorStoreIndex.from_documents(documents)
            # store it for later
            index.storage_context.persist(persist_dir=PERSIST_DIR)
        else:
            # load the existing index
            storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
            index = load_index_from_storage(storage_context)

        form_json = request.get_json()
        prompt = form_json["prompt"]

        # now query the index
        chat_engine = index.as_chat_engine(chat_mode="condense_plus_context", verbose=True)
        response = chat_engine.chat(prompt)  # chat here

        return jsonify({'result' : f"{response}"})

    except Exception as e:
        return jsonify({'error':  f"An error occurred: {e}"})



@app.route('/ask_ai', methods=['POST'])
def query_endpoint():
    response = query_index()
    return response



@app.route('/create_transcripts', methods=['POST'])
def create_transcripts():
    form_json = request.get_json()
    url = form_json["video_id"]
    video_id = extract_video_id(url)

    save_transcripts_to_files(os.getenv('YOUTUBE_API_KEY'), video_id, "data")
    
    response = jsonify({'result' : video_id})
    return response


def extract_video_id(url):
    regex = r'(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(regex, url)
    return match.group(1) if match else None



def save_transcripts_to_files(api_key, video_id, output_dir):
    # Build the YouTube API client using the provided API key
    youtube = build("youtube", "v3", developerKey=api_key)

    # Get the video details
    request = youtube.videos().list(
        part="snippet",
        id=video_id
    )
    response = request.execute()

    # Extract video details
    if not response["items"]:
        print(f"No video found with ID {video_id}")
        return

    video_title = response["items"][0]["snippet"]["title"]
    video_date = response["items"][0]["snippet"]["publishedAt"]

    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        # Remove any non-alphanumeric characters from the video title and use it as the filename
        safe_title = "".join([c for c in video_title if c.isalnum() or c.isspace()]).rstrip()
        filename = os.path.join(output_dir, f"{safe_title}.txt")
        if os.path.exists(filename):
            print(f"Transcript already exists for {safe_title}.txt")
            return

        # Get the transcript
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        with open(filename, "w") as file:
            # Write each transcript entry to the file
            for entry in transcript:
                file.write(entry['text'] + ' ')
        print(f"Transcript saved to {safe_title}.txt")
    except Exception as e:
        print(f"Error fetching transcript for video ID {video_id} ({video_title}): {str(e)}")


# youtube_api_key = os.getenv('YOUTUBE_API_KEY')
# playlist_id = "PLkiLSmC1caWur5fzZycc6Sh65tYb3OKhS"
# output_dir = "data"

# save_transcripts_to_files(youtube_api_key, playlist_id, output_dir)



if __name__ == '__main__':
    app.run()
