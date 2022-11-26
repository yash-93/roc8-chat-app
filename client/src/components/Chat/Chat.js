import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";

import FriendList from "./Friends/FriendList";
import MessageSection from "./Messages/MessageSection";
import Navbar from "./NavBar/Navbar";
import Slider from "../Slider/Slider";
import UserContext from "../UserContext";
import "./Chat.css";

let socket;

const Chat = () => {
  const context = useContext(UserContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [room, setRoom] = useState(null);
  const [friendList, setFriendList] = useState([]);
  const [onlineFriendsList, setOnlineFriendsList] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const ENDPOINT = `${process.env.REACT_APP_DOMAIN}`;
  var user;
  var friendIdList;

  const handleSlider = () => {
    setShowSlider(!showSlider);
  };

  const getFriendData = async () => {
    try {
      for (var i = 0; i < friendIdList.length; i++) {
        const result = await fetch(
          `${process.env.REACT_APP_DOMAIN}/api/users/${friendIdList[i]}`
        );
        const responseData = await result.json();
        var temp = {};
        temp.id = friendIdList[i];
        temp.username = responseData.user.username;
        setFriendList((oldList) => [...oldList, temp]);
        console.log(responseData.user.username);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      if (user) {
        friendIdList = onlineFriendsList;
        console.log(friendIdList.length);
        getFriendData();
      } else {
        throw new Error("Error Occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("userData"));
    fetchData();
  }, [onlineFriendsList]);

  useEffect(() => {
    user.friends.map((f) => {
      if (!localStorage.getItem(`msgs_${f}`)) {
        localStorage.setItem(`msgs_${f}`, JSON.stringify(new Array()));
      }
    });
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("join", { user });
    console.log(socket);
    socket.on("myOnlineFriends", (temp2, callback) => {
      setOnlineFriendsList(temp2);
      console.log(typeof temp2);
    });
    socket.on("updateFriends", (temp3) => {
      setFriendList([]);
      setOnlineFriendsList(temp3);
    });

    socket.on("receiverPeer", (data) => {
      var temp = { user: user.username, text: data.msg, name: data.senderName };
      console.log(data.id + " " + context.receiverId);
      if (data.id === context.receiverId) {
        setMsgs((msgs) => [...msgs, temp]);
      }
      var temp_msgs = JSON.parse(localStorage.getItem(`msgs_${data.id}`));
      temp_msgs.push(temp);
      localStorage.setItem(`msgs_${data.id}`, JSON.stringify(temp_msgs));
      console.log(temp_msgs);
    });

    socket.on("senderPeer", (data) => {
      var temp = { user: user.username, text: data.msg, name: data.senderName };
      console.log(context.receiverId);
      setMsgs((msgs) => [...msgs, temp]);
      var temp_msgs = JSON.parse(
        localStorage.getItem(`msgs_${context.receiverId}`)
      );
      temp_msgs.push(temp);
      localStorage.setItem(
        `msgs_${context.receiverId}`,
        JSON.stringify(temp_msgs)
      );
      console.log(temp_msgs);
    });
  }, [user]);

  const messageSectionHandler = (name, id) => {
    user = JSON.parse(localStorage.getItem("userData"));
    setCurrentChat(name);
    setReceiverId(id);
    context.receiverId = id;
    console.log(receiverId);
    setRoom("room" + name);
    let show_msgs = JSON.parse(localStorage.getItem(`msgs_${id}`));
    console.log(show_msgs);
    setMsgs(show_msgs);
  };

  const messageHandler = (msg, id, receiver, senderName) => {
    socket.emit("chatting", { msg, id, receiver, senderName });
  };

  return (
    <React.Fragment>
      <Navbar handleSlider={handleSlider} showSlider={showSlider} />
      <div id="main-chat-container">
        <FriendList
          id="friend-list"
          messageSectionHandler={messageSectionHandler}
          friendList={friendList}
        />
        <UserContext.Provider value={context.receiverId}>
          <MessageSection
            selectedFriend={currentChat}
            messageHandler={messageHandler}
            receiverId={receiverId}
            msgs={msgs}
          />
        </UserContext.Provider>
      </div>
      {showSlider && (
        <Slider handleSlider={handleSlider} showSlider={showSlider} />
      )}
    </React.Fragment>
  );
};

export default Chat;
