import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";


function Search({ onSetVideoId}) {
    const [loading, setLoading] = useState(false)

    function toggleLoading() {
      setLoading(!loading)
    }

    const formSchema = yup.object().shape({
        video_id: yup.string().required("Please enter a valid Youtube video URL."),
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
            onSetVideoId(resData.result)
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
            <div className="ui center aligned inverted padded segment">
              <div className="ui text container">
              <form className="ui form" onSubmit={formik.handleSubmit}>
                <div className='ui massive transparent fluid action input'>
                    <input 
                    type='text' 
                    placeholder='copy/paste a YouTube video URL here to begin.....' 
                    name="video_id"
                    value={formik.values.video_id}
                    onChange={formik.handleChange}
                    />
                    { loading ? <div className="ui massive loading button"></div> 
                    :
                    <button
                        href="#"
                        type="submit"
                        className="ui massive primary inverted icon button"
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
      </div>
  )
}

export default Search