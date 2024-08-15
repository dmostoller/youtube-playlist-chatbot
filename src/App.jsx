import { useState } from 'react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import Chat from './Chat'
import Search from './Search'

function App() {



  return (
    <>
      <h1>TutorBot</h1>
      <Search />
      <div style={{ position:"relative", height: "500px" }}>
        <Chat />
        </div>
    </>
  )
}

export default App
