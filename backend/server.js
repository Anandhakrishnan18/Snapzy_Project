require("dotenv").config();

const express =
  require("express");

const path =
  require("path");

const cors = require("cors");

const connectDB =
  require("./config/db");

connectDB();

const app = express();

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
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

app.listen(
  process.env.PORT,
  () => {
    console.log(
      `Server Running on Port ${process.env.PORT}`
    );
  }
);