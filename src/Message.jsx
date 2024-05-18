import React from "react";

function Message(props) {
  // console.log(props.message)
  let dataRoll = props.position === "left_bubble" ? "ASSISTANT" : "USER";
  let thisClass = `chat-bubble ${props.position}`;
  return (
    <div data-role={dataRoll} className="bubble-container">
      <div className={thisClass}>
        <div className="ui large message">
          {/* {props.message.replace(/<\/?[^>]+(>|$)/g, "")} */}
          {props.message}
        </div>
      </div>
      <div className="clear"></div>
    </div>
  );
}
export default Message;
