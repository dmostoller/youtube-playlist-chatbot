import { useState } from 'react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import Chat from './Chat'
import Search from './Search'
import YoutubeEmbed from './YoutubeEmbed'

function App() {

  const [videoId, setVideoId] = useState('')


  return (
    <>
      <h1>TutorBot</h1>
      
        { videoId ?
            <div className="ui center aligned segment">
                <h3 style={{color: "green"}}>{videoId}</h3>
                <h3>Open the chat window below to ask questions about your video.</h3>
                < YoutubeEmbed embedId={videoId} />
                <button className="ui huge primary button" onClick={() => setVideoId('')}>Enter another video ID</button>
            </div>
            : <Search onSetVideoId={setVideoId}/>
        }
      <div style={{ position:"relative", height: "500px" }}>
        <Chat />
        </div>
    </>
  )
}

export default App
