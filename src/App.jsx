import { useState } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Chat from "./components/Chat";
import Search from "./components/Search";
import YoutubeEmbed from "./components/YoutubeEmbed";
import robot from "./assets/robot-svgrepo-com.svg";
import Favicon from "react-favicon";


function App() {
  const [videoId, setVideoId] = useState("");

  return (
    <div
      className="ui inverted fluid basic segment"
      style={{ minWidth: "100vw", minHeight: "100vh" }}>
      <Favicon url={robot} />
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
                  className="ui huge inverted circular blue button"
                  onClick={() => setVideoId("")}>
                  Select Another Video
                </button>
              </div>
            ) : (
              <>
                <div className="ui container" style={{ marginTop: "125px" }}>
                <img className="ui centered tiny image"src={robot} alt="robot"></img>
                <h1 className="ui center aligned inverted icon header" style={{color: "#00bbff", marginBottom: "0px", marginTop: "10px"}}>
                  Youtube Video Assistant</h1>
                <Search onSetVideoId={setVideoId} />
                </div>
              </>
            )}
            <div style={{ position: "relative", height: "500px" }}>
              <Chat videoId={videoId}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
