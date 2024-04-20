import { React, useState } from 'react'
import { VscSend } from "react-icons/vsc";
import useSendMessage from '../../hooks/useSendMessage';

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return
    }
    await sendMessage(message);
    setMessage("");//clears input box after send

  }

  return (
    <form className='message-input-container' onSubmit={handleSubmit}>
      <div className='full-width'>
        <input
          type='text'
          className='message-input'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}

        />
        <button type='submit' className='send-button'>
          <VscSend />
        </button>
      </div>
    </form>

  )
}

export default MessageInput;
