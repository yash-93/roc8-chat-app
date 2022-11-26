const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const { disconnect, on } = require("process");
const { use } = require("./routes/userRoutes");
const user = require("./models/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(bodyParser.json());

app.use(cors());

var userFriends = new Map();
var userOnlineFriends = new Map();
let onlineUsers = new Map();

io.on("connection", (socket) => {
  let u = "";
  socket.on("join", ({ user }, callback) => {
    u = user.userId;
    if (!onlineUsers.has(user.userId)) {
      onlineUsers.set(user.userId, socket.id);
    }
    console.log("Online Users", onlineUsers);
    var temp = user.friends;
    userFriends.set(user.userId, temp);
    console.log("User Friends", userFriends);

    var temp2 = [];
    var friends = userFriends.get(user.userId);
    for (var i = 0; i < friends.length; i++) {
      const iterator1 = onlineUsers.keys();
      for (var j = 0; j < onlineUsers.size; j++) {
        if (friends[i] === iterator1.next().value) {
          temp2.push(friends[i]);
          break;
        }
      }
    }
    userOnlineFriends.set(user.userId, temp2);

    for (var i = 0; i < temp2.length; i++) {
      var temp3 = userOnlineFriends.get(temp2[i]);
      temp3.push(user.userId);
      userOnlineFriends.set(temp2[i], temp3);
    }

    socket.emit("myOnlineFriends", temp2);

    let z;
    for (var i = 0; i < temp2.length; i++) {
      z = userOnlineFriends.get(temp2[i]);
      socket.to(onlineUsers.get(temp2[i])).emit("updateFriends", z);
      console.log(i, " ", onlineUsers.get(temp2[i]), " ", z);
    }

    console.log("User Online Friends", userOnlineFriends);
  });

  socket.on("chatting", (data) => {
    socket.to(onlineUsers.get(data.receiver)).emit("receiverPeer", {
      msg: data.msg,
      id: data.id,
      receiverid: onlineUsers.get(data.receiver),
      senderName: data.senderName,
    });
    socket.emit("senderPeer", {
      msg: data.msg,
      id: data.id,
      receiver: onlineUsers.get(data.receiver),
      senderName: data.senderName,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    onlineUsers.delete(u);

    temp2 = userOnlineFriends.get(u);
    for (var i = 0; i < temp2.length; i++) {
      temp3 = userOnlineFriends.get(temp2[i]);
      temp3.splice(temp3.indexOf(u), 1);
      userOnlineFriends.set(temp2[i], temp3);
      socket.to(onlineUsers.get(temp2[i])).emit("updateFriends", temp2[i]);
    }

    userOnlineFriends.delete(u);
    console.log("*****");
    console.log("Online Users", onlineUsers);
    console.log("User Friends", userFriends);
    console.log("User Online Friends", userOnlineFriends);
  });
});

app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpul6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    server.listen(process.env.PORT);
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.log(error);
  });
