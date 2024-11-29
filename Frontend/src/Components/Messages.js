import React, { useEffect, useState } from 'react'

const Messages = () => {
    const [messages, setMessages] = useState([]); 
    const [message, setMessage] = useState(""); 
    const [senders, setSenders] = useState([]); 
    const [selectedSender, setSelectedSender] = useState(null); 
  
    useEffect(() => {
        const fetchMessages = async () => {
          const token = localStorage.getItem("token");
          try {
            const response = await fetch("http://localhost:5000/api/get-messages", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
      
            const data = await response.json();
            console.log("Fetched messages:", data.messages);
      
            if (Array.isArray(data.messages)) {
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
            } else {
              console.error("API did not return an array:", data.messages);
              setMessages([]);
            }
          } catch (err) {
            console.error("Error fetching messages:", err);
            setMessages([]); 
          }
        };
      
        fetchMessages();
      }, []);
  
    useEffect(() => {
      if (selectedSender) {
        const fetchMessagesForSender = async () => {
          const token = localStorage.getItem("token");
          try {
            const response = await fetch(
              `http://localhost:5000/api/get-messages/${selectedSender.id}`,
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
            console.log(data);
            setMessages(data.messages);
          } catch (err) {
            console.error("Error fetching messages:", err);
          }
        };
  
        fetchMessagesForSender();
      }
    }, [selectedSender]);
  
    // Handle sending a message
    const handleSendMessage = async (rec_id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5000/api/send-message/${rec_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              message,
            }),
          }
        );
  
        const data = await response.json();
        console.log(data);
  
        if (response.ok) {
          setMessages([...messages, { content: message, sender_id: rec_id }]);
          setMessage("");
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
  
        {/* Main Chat Content */}
        <div className="chat-content">
          {/* Chat Header */}
          <div className="chat-header">
            <h3>
              {selectedSender
                ? `Messages with ${selectedSender.name}` 
                : "Select a sender"}
            </h3>
          </div>
  
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender_id === selectedSender?.id ? "received" : "sent"
                }`}
              >
                {msg.content}
              </div>
            ))}
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
                handleSendMessage(selectedSender)
              }
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

export default Messages
