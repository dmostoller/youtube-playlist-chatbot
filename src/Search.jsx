import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function Search() {
    const [loading, setLoading] = useState(false)
    const [playlistId, setPlaylistId] = useState('')

    function toggleLoading() {
      setLoading(!loading)
    }

    const formSchema = yup.object().shape({
        youtube_playlist_id: yup.string().required("Please enter a valid youtube playlist Id."),
      })
    
      const formik = useFormik({
        initialValues: {
            youtube_playlist_id: '',
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
        // console.log(values)
        setLoading(true)
        fetch("http://127.0.0.1:5000/create_transcripts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify(values),
        }).then((res) => {
            res.json().then((resData) => {
            console.log(resData)
            setPlaylistId(resData.result)
            formik.resetForm()
            setLoading(false)
          })
         .catch((err) => console.log(
          "error: ", err));
        
    })
        },
    })
    


  return (
    <div className="ui centered grid">
        <div className="row">
          <div className="column">
        { playlistId ?
            <div className="ui center aligned segment">
                <h3 style={{color: "green"}}>{playlistId}</h3>
                <h3>Open the chat window below to ask questions about the videos in your playlist.</h3>
                <button className="ui huge primary button" onClick={() => setPlaylistId('')}>Enter another playlist ID</button>
            </div>
            
          :

            <div className="ui center aligned segment">
              <h2>Enter a Youtube Playlist ID:</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className='ui huge action input fluid'>
                    <input 
                    type='text' 
                    placeholder='Youtube Playlist ID...' 
                    name="youtube_playlist_id"
                    value={formik.values.youtube_playlist_id}
                    onChange={formik.handleChange}
                    />
                    { loading ? <div className="ui huge loading button"></div> 
                    :
                    <button
                        href="#"
                        type="submit"
                        className="ui huge primary icon button"
                        >
                        <i className="send icon"></i>
                    </button>
                    }
                </div>
              </form>
              {formik.errors && <p style={{color:'red', textAlign:'center'}}>{formik.errors.youtube_playlist_id}</p>}
            </div>

            }  
          </div>
        </div>
      </div>
  )
}

export default Search