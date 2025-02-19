const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
//serve static file of this project
//__dirname->current working directory where the app.js
//is present and join joins it with the public folder
//hence forming the complete path

//this adds the strings in a form of string of paths
app.use(express.static(path.join(__dirname)));

//this serves the frontend files to this server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname));
});




const server = app.listen(PORT, () => {
  console.log(`listening of port ${PORT}`);
});

//initilise the web socket server
const io = require("socket.io")(server);
//set to store the socket ids
let s = new Set();
//create a connection event
//when someone connects print their id
//that was provided to them by this websocket
const updateclients = (socket) => {
  //add current id to the set
  s.add(socket.id);
  //emit event when a client is added
  io.emit("clients-total", s.size);
  socket.on("disconnect", () => {
    s.delete(socket.id);
    //emit event when cleint is disconnected
    io.emit("clients-total", s.size);
    
  });


  socket.on("message", (data) => {
    //sends data to all the other sockets by emitting
    
    socket.broadcast.emit("chat-message", data);
  });

  
  socket.on('feedback',(data)=>{
    socket.broadcast.emit("feedback",data);
  })
};

io.on("connection", updateclients);
