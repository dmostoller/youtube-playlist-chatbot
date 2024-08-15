import { useState } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Chat from "./Chat";
import Search from "./Search";
import YoutubeEmbed from "./YoutubeEmbed";
import robot from "./assets/robot-svgrepo-com.svg";

function App() {
  const [videoId, setVideoId] = useState("");

  return (
    <div
      className="ui inverted fluid basic segment"
      style={{ minWidth: "100vw", minHeight: "100vh" }}>
      <div className="ui container" style={{ marginTop: "50px" }}>
        <div className="ui middle aligned center aligned grid">
          <div className="column">
            {videoId ? (
              <div className="ui center aligned inverted segment">
                <h2>
                  Open the chat window below to ask questions about your video.
                </h2>
                <YoutubeEmbed embedId={videoId} />
                <button
                  style={{ margin: "25px" }}
                  className="ui massive inverted circular primary button"
                  onClick={() => setVideoId("")}>
                  Select Another Video
                </button>
              </div>
            ) : (
              <>
                <img
                  style={{ marginTop: "150px" }}
                  className="ui centered tiny image"
                  src={robot}
                  alt="robot"></img>
                <Search onSetVideoId={setVideoId} />
              </>
            )}
            <div style={{ position: "relative", height: "500px" }}>
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
