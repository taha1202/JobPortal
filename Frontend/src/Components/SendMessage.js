import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SendMessage = () => {
  const [messages, setMessages] = useState([]); 
  const [message, setMessage] = useState(""); 
  const [senders, setSenders] = useState([]); 
  const [selectedSender, setSelectedSender] = useState(null); 
  const { id } = useParams(); 

  
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://jobportal-ubcf.onrender.com/api/get-messages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data.messages);

        const uniqueSenders = [
          ...new Map(
            data.messages.map((msg) => [
              msg.sender_id,
              { id: msg.sender_id, name: `${msg.first_name} ${msg.last_name}` },
            ])
          ).values(),
        ];
        setSenders(uniqueSenders);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  // Fetch messages for the selected sender
  useEffect(() => {
    if (selectedSender) {
      const fetchMessagesForSender = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `https://jobportal-ubcf.onrender.com/api/get-messages/${selectedSender.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch messages for this sender");
          }

          const data = await response.json();
          setMessages(data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };

      fetchMessagesForSender();
    }
  }, [selectedSender]);

  const handleSendMessage = async (rec_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://jobportal-ubcf.onrender.com/api/send-message/${rec_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert ("Message Sent Successfully");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Messages</h3>
        <ul>
          {senders.map((sender) => (
            <li
              key={sender.id}
              onClick={() => setSelectedSender(sender)}
              className={selectedSender?.id === sender.id ? "active" : ""}
            >
              {sender.name} 
            </li>
          ))}
        </ul>
      </div>

    
      <div className="chat-content">
        <div className="chat-header">
          <h3>
            {selectedSender
              ? `Messages with ${selectedSender.name}`
              : id
              ? `Start a conversation with User ${id}`
              : "Select a sender"}
          </h3>
        </div>
        <div className="chat-messages">
          
            <div
              className={`message ${
                messages.sender_id === selectedSender?.id ? "received" : "sent"
              }`}
            >
              {messages.content}
            </div>
         
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() =>
              handleSendMessage(selectedSender ? selectedSender.id : id)
            }
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
