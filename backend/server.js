require("dotenv").config();

const express =
  require("express");

  const http =
  require("http");

const {
  Server
} = require(
  "socket.io"
);

const path =
  require("path");

const cors = require("cors");

const connectDB =
  require("./config/db");

connectDB();

const app = express();

const server =
  http.createServer(
    app
  );

const io =
  new Server(
    server,
    {
      cors: {
        origin:
          "http://localhost:5173",
        methods: [
          "GET",
          "POST"
        ]
      }
    }
  );



app.use(cors());

app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/users",
  require("./routes/userRoutes")
);

app.use(
  "/api/posts",
  require("./routes/postRoutes")
);

app.use(
  "/api/comments",
  require("./routes/commentRoutes")
);

app.use(
  "/api/messages",
  require(
    "./routes/messageRoutes"
  )
);

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);


const onlineUsers =
  new Map();


io.on(
  "connection",
  (socket) => {

    console.log(
      "User Connected:",
      socket.id
    );

socket.on(
  "userOnline",
  (userId) => {

    onlineUsers.set(
      userId,
      socket.id
    );

    io.emit(
      "onlineUsers",
      [
        ...onlineUsers.keys()
      ]
    );

  }
);

    socket.on(
      "checkOnline",
      (userId) => {

        socket.emit(
          "userStatus",
          onlineUsers.has(
            userId
          )
        );

      }
    );

    socket.on(
      "sendMessage",
      (message) => {

        socket.broadcast.emit(
          "receiveMessage",
          message
        );

      }
    );

    socket.on(
      "disconnect",
      () => {

        for (
          const [
            userId,
            socketId
          ]
          of onlineUsers
        ) {

          if (
            socketId ===
            socket.id
          ) {

           onlineUsers.delete(
  userId
);

io.emit(
  "onlineUsers",
  [
    ...onlineUsers.keys()
  ]
);

break;

          }

        }

        console.log(
          "User Disconnected:",
          socket.id
        );

      }
    );

  }
);

server.listen(
  process.env.PORT,
  () => {

    console.log(
      `Server Running on Port ${process.env.PORT}`
    );

  }
);