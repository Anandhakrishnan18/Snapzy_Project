import {
  useEffect,
  useState,
  useRef
} from "react";

import "../styles/Messages.css";
import API from "../services/api";
import {
  formatDistanceToNow
} from "date-fns";
import socket
from "../socket";

function Messages() {

  const [users,
    setUsers] =
    useState([]);

  const [selectedUser,
    setSelectedUser] =
    useState(null);

  const [messages,
    setMessages] =
    useState([]);

  const [text,
    setText] =
    useState("");

const chatEndRef =
  useRef(null);

  
  const fetchUsers =
    async () => {

      try {

        const res =
          await API.get(
            "/users/following/list",
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem(
                    "token"
                  )}`
              }
            }
          );

        setUsers(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  const fetchMessages =
    async (userId) => {

      try {

        const res =
          await API.get(
            `/messages/${userId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${localStorage.getItem(
                    "token"
                  )}`
              }
            }
          );

        setMessages(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  const sendMessage =
    async () => {

      if (
        text.trim() === ""
      ) return;

      try {
        const res =
  await API.post(
    "/messages/send",
    {
      receiver:
        selectedUser._id,
      text
    },
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem(
            "token"
          )}`
      }
    }
  );

socket.emit(
  "sendMessage",
  res.data
);

setMessages(
  (prev) => [
    ...prev,
    res.data
  ]
);

setText("");
        
      } catch (error) {

        console.log(error);

      }

    };

useEffect(() => {

  fetchUsers();

}, []);


useEffect(() => {

  chatEndRef.current
    ?.scrollIntoView({
      behavior:
        "smooth"
    });

}, [messages]);

useEffect(() => {

  socket.on(
  "connect",
  () => {

    console.log(
      "🔥 Socket Connected:",
      socket.id
    );

  }
);

  return () => {

    socket.off(
      "connect"
    );

  };

}, []);

useEffect(() => {

  socket.on(
    "receiveMessage",
    (message) => {

      setMessages(
        (prev) => [
          ...prev,
          message
        ]
      );

    }
  );

  return () => {

    socket.off(
      "receiveMessage"
    );

  };

}, []); 

  return (

    <div
      className="messages-page"
    >

      {
        !selectedUser ? (

          <>

            <h2>
              Messages
            </h2>

            {
              users.map(
                (user) => (

                  <div
                    key={user._id}
                    className="message-user"
                    onClick={() => {

                      setSelectedUser(
                        user
                      );

                      fetchMessages(
                        user._id
                      );

                    }}
                  >

                    {
                      user.username
                    }

                  </div>

                )
              )
            }

          </>

        ) : (

          <>

            <button
              onClick={() => {

                setSelectedUser(
                  null
                );

                setMessages(
                  []
                );

              }}
            >
              ← Back
            </button>

            <div
  className="chat-header"
>

  <button
    className="back-btn"
    onClick={() => {

      setSelectedUser(
        null
      );

      setMessages([]);

    }}
  >
    ←
  </button>

  <div
    className="chat-avatar"
  >
    {
      selectedUser.username
        .charAt(0)
        .toUpperCase()
    }
  </div>

  <h2>
    {
      selectedUser.username
    }
  </h2>

</div>
            <div
              className="chat-box"
            >

              
             {
  messages.map(
    (msg) => {

      const currentUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      return (

        <div
          key={
            msg._id
          }
          className={
  (
    msg.sender?._id ||
    msg.sender
  ) === currentUser._id
    ? "my-message"
    : "other-message"
}
        >

          <>
  <div>
    {msg.text}
  </div>

  <small>

    {
      formatDistanceToNow(
        new Date(
          msg.createdAt
        ),
        {
          addSuffix:true
        }
      )
    }

  </small>
</> 

        </div>

      );

    }
  )
}

<div
    ref={chatEndRef}
  />


            </div>

            <div
  className="chat-input"
>

  <input
    type="text"
    value={text}
    placeholder="Type message..."
    onChange={(e) =>
      setText(
        e.target.value
      )
    }
  />

  <button
    onClick={
      sendMessage
    }
  >
    Send
  </button>

</div>

          </>

        )
      }

    </div>

  );

}

export default Messages;    