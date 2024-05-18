import React, { useState } from "react";
import Message from "./Message";
import "./Chat.css";
import { useFormik } from "formik";
import * as yup from "yup";
import robot from "./assets/robot-svgrepo-com.svg"

function Chat() {
  // this function opens the chat
  function openChart() {
    document.getElementById("assistant-chat").classList.add("show");
    document.getElementById("assistant-chat").classList.remove("hide");
  }

  // this function opens the chat
  function closeChart() {
    document.getElementById("assistant-chat").classList.add("hide");
    document.getElementById("assistant-chat").classList.remove("show");
  }

  function chat_scroll_up() {
    let elem = document.querySelector(".start-chat");
    setTimeout(() => {
      elem.scrollTo({
        top: elem.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  }
  const [loading, setLoading] = useState(false)
  function toggleLoading() {
    setLoading(!loading)
  }

  const [chatMessages, setchatMessages] = useState([
    {
      position: "left_bubble",
      message: "Hello there, my name is TutorBot. I'm here to help you understand Kabayun's production tutorials. Do you have any questions for me? Remember, I'm not a real person so please make your questions as detailed as possible.",
    },
  ]);

  const formSchema = yup.object().shape({
    prompt: yup.string().required("Please type your question in the box below."),
  })

  const formik = useFormik({
    initialValues: {
        prompt: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
    // console.log(values)
    setLoading(true)
    fetch("/ask_ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(values),
    }).then((res) => {
        res.json().then((resData) => {
        // console.log(resData)
        const messages = [
          ...chatMessages,
          {
            position: "right_bubble",
            message: values.prompt,
          },
          {
            position: "left_bubble",
            message: resData.result,
          },
        ];
        // console.log(resData)
        setchatMessages(messages);
        chat_scroll_up()
        formik.resetForm()
        setLoading(false)
      })
     .catch((err) => console.log(err));
    
})
    },
})

    

  return (
    <div>
      <div>
        <div id="assistant-chat" className="hide ai_chart">
          <div className="header-chat">
            <div className="head-home">
                <img className="robot-avatar" src={robot} alt="robot"></img>
                <span><h2>TutorBot</h2></span>
            </div>
          </div>

          <div className="start-chat">
            <div className="assistant-chat-body">
              {chatMessages.map((chatMessage, key) => (
                <Message
                  key={key}
                  position={chatMessage.position}
                  message={chatMessage.message}
                />
              ))}
            </div>
            <div className="ui attached segment">
            <form onSubmit={formik.handleSubmit}>
            {formik.errors && <p style={{color:'red', textAlign:'center'}}>{formik.errors.prompt}</p>}
            <div className="ui action input large fluid">
              <input
                type="text"
                name="prompt"
                value={formik.values.prompt}
                onChange={formik.handleChange}
                placeholder="What can I help you with..."
                maxLength="400"
              />
            {loading ?
            <button className="ui large loading button"></button>
            :
              <button
                href="#send_message"
                type="submit"
                className="ui icon large button"
                >
                <i className="send icon"></i>
              </button>
            }
            </div>
            </form>
            </div>
          </div>

          <button 
          className="ui inverted circular basic violet icon button" 
          style={{position: "absolute", top: "10px", right: "7px"}}
          href="#close" onClick={closeChart}>
            <i className="close icon"></i>
          </button>
        </div>
        <button
          onClick={openChart}
          className="ui circular icon huge violet button"
          style={{position: "fixed", right: "20px", bottom: "20px"}}
          href="#load_chart"
          title="Show Chat"
        >
              Production Questions? Ask Me!
        </button>
      </div>
    </div>
  );
}

export default Chat;
