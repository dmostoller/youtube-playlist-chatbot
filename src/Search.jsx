import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function Search({ setVideoId}) {
    const [loading, setLoading] = useState(false)

    function toggleLoading() {
      setLoading(!loading)
    }

    const formSchema = yup.object().shape({
        video_id: yup.string().required("Please enter a valid youtube Video Id."),
      })
    
      const formik = useFormik({
        initialValues: {
            video_id: '',
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
            setVideoId(resData.result)
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
            <div className="ui center aligned segment">
              <h2>Enter a Youtube Video ID:</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className='ui huge action input fluid'>
                    <input 
                    type='text' 
                    placeholder='Youtube Video ID...' 
                    name="video_id"
                    value={formik.values.video_id}
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
              {formik.errors && <p style={{color:'red', textAlign:'center'}}>{formik.errors.video_id}</p>}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Search