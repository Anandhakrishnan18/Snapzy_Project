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

    const [previews,
  setPreviews] =
  useState([]);

  const [isOnline,
  setIsOnline] =
  useState(false);

  const [onlineUsers,
  setOnlineUsers] =
  useState([]);

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

const fetchPreviews =
  async () => {

    try {

      const res =
        await API.get(
          "/messages/preview/list",
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem(
                  "token"
                )}`
            }
          }
        );

      setPreviews(
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

        fetchPreviews();

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

  fetchPreviews();

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

      const currentUser =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      socket.emit(
        "userOnline",
        currentUser._id
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

useEffect(() => {

  if (
    !selectedUser
  ) return;

  setIsOnline(
    onlineUsers.includes(
      selectedUser._id
    )
  );

}, [
  onlineUsers,
  selectedUser
]);

useEffect(() => {

  socket.on(
    "onlineUsers",
    (users) => {

      setOnlineUsers(
        users
      );

    }
  );

  return () => {

    socket.off(
      "onlineUsers"
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

           <h2 className="messages-title">
  Messages
</h2>

<div className="users-list">

  {
  [...users]
    .sort((a, b) => {

      const aPreview =
        previews.find(
          (p) =>
            p.userId ===
            a._id
        );

      const bPreview =
        previews.find(
          (p) =>
            p.userId ===
            b._id
        );

      const aTime =
        aPreview
          ? new Date(
              aPreview.createdAt
            ).getTime()
          : 0;

      const bTime =
        bPreview
          ? new Date(
              bPreview.createdAt
            ).getTime()
          : 0;

      return (
        bTime - aTime
      );

    })
    .map(
      (user) => (

        <div
          key={user._id}
          className="message-user-card"
         onClick={() => {

  setSelectedUser(
    user
  );

  fetchMessages(
    user._id
  );

  fetchPreviews();

}}
        >

          <div
            className="user-avatar"
          >
            {
              user.username
                .charAt(0)
                .toUpperCase()
            }
          </div>

          <div
            className="user-details"
          >

        <div
  className="user-top-row"
>

  <h3>
    {
      user.username
    }
  </h3>

  <small>

{
  previews.find(
    (p) =>
      p.userId ===
      user._id
  )?.createdAt
    ? formatDistanceToNow(
        new Date(
          previews.find(
            (p) =>
              p.userId ===
              user._id
          ).createdAt
        ),
        {
          addSuffix:false
        }
      )
        .replace(
          " minutes",
          "m"
        )
        .replace(
          " minute",
          "m"
        )
        .replace(
          " hours",
          "h"
        )
        .replace(
          " hour",
          "h"
        )
        .replace(
          " days",
          "d"
        )
        .replace(
          " day",
          "d"
        )
    : ""
}

  </small>

</div>

            <p>

{
  previews.find(
    (p) =>
      p.userId ===
      user._id
  )?.lastMessage ||

  "No messages yet"
}

</p>

          </div>

          {
  previews.find(
    (p) =>
      p.userId ===
      user._id
  )?.unreadCount > 0 && (

    <div
      className="unread-dot"
    >
      {
        previews.find(
          (p) =>
            p.userId ===
            user._id
        ).unreadCount
      }
    </div>

  )
}

        </div>

      )
    )
  }

</div>

          </>

        ) : (

          <>

            
         <div
  className="chat-header"
>

  <button
    className="chat-back-btn"
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
    className="chat-user-info"
  >

    <div
      className="chat-avatar"
    >
      {
        selectedUser.username
          .charAt(0)
          .toUpperCase()
      }
    </div>

    <div>

  <h2>
    {
      selectedUser.username
    }
  </h2>

  <small
    style={{
      color:
        isOnline
          ? "#22c55e"
          : "#ef4444"
    }}
  >
    {
      isOnline
        ? "● Online"
        : "● Offline"
    }
  </small>

</div>

  </div>

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