from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import openai
from youtube_transcript_api import YouTubeTranscriptApi
from googleapiclient.discovery import build


openai.api_key = os.getenv('OPENAI_API_KEY')
app = Flask(__name__)
CORS(app)

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
        chat_engine = index.as_chat_engine(chat_mode="condense_question", verbose=True)
        response = chat_engine.chat(prompt)  # chat here

        return jsonify({'result' : f"{response}"})

    except Exception as e:
        return jsonify({'error':  f"An error occurred: {e}"})


@app.route("/")
def index():
    return "<h1>Project Server</h1>"


@app.route('/ask_ai', methods=['POST'])
def query_endpoint():
    response = query_index()
    return response


def save_transcripts_to_files(api_key, playlist_id, output_dir):
    # Build the YouTube API client using the provided API key
    youtube = build("youtube", "v3", developerKey=api_key)

    # Get all the videos in the playlist, sorted by date
    videos = []
    next_page_token = None
    while True:
        request = youtube.playlistItems().list(
            part="contentDetails,snippet",
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        response = request.execute()

        # Add each video to the list of videos
        for item in response["items"]:
            video_id = item["contentDetails"]["videoId"]
            video_title = item["snippet"]["title"]
            video_date = item["snippet"]["publishedAt"]
            videos.append((video_id, video_title, video_date))

        # Check if there are more videos to fetch
        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    # Sort the videos by date, descending. Once we reach a file that already exists, we can stop
    # This allows us to run the script again later and only fetch new videos
    videos.sort(key=lambda x: x[2], reverse=True)

    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # For each video, get the transcript and save it to a file if it doesn't already exist
    for video_id, video_title, video_date in videos:
        try:
            # Remove any non-alphanumeric characters from the video title and use it as the filename
            safe_title = "".join([c for c in video_title if c.isalnum() or c.isspace()]).rstrip()
            filename = os.path.join(output_dir, f"{safe_title}.txt")
            if os.path.exists(filename):
                # If the file already exists, assume the rest are there too and stop
                break
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            with open(filename, "w") as file:
                # Write each transcript entry to the file
                for entry in transcript:
                    file.write(entry['text'] + ' ')
            print(f"Transcript saved to {safe_title}.txt")
        except Exception as e:
            print(f"Error fetching transcript for video ID {video_id} ({video_title}): {str(e)}")

youtube_api_key = os.getenv('YOUTUBE_API_KEY')
playlist_id = "PLkiLSmC1caWur5fzZycc6Sh65tYb3OKhS"
output_dir = "data"

save_transcripts_to_files(youtube_api_key, playlist_id, output_dir)



if __name__ == '__main__':
    app.run()
