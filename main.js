//initialise the socket connection
//from frontend we are connection with outr backend websocket server
const socket = io();


const clienttotal = document.querySelector(".clients-total");
socket.on("clients-total", (data) => {
  clienttotal.innerText = `Total clients: ${data}`;
});

const messageContainer = document.querySelector(".message-container");
const nameInput = document.querySelector(".name-input");
const messageForm = document.querySelector(".message-form");
const messageInput = document.querySelector(".message-input");
const messageTone=new Audio('./mssgtone.mp3');


const sendMessage = () => {
  //whenever this function called then only create this json
  //data and send it to the server
  if(messageInput.value=='') return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    date: new Date(),
  };
 
  socket.emit('message',data);
  addmessagetoui(true,data);
  messageInput.value='';
};

socket.on('chat-message',((data)=>{
  messageTone.play();
    addmessagetoui(false,data);
}))

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});


const addmessagetoui=(isown,data)=>{
  clearFeedback();
 const element=`<li class="${isown?"message-right":"message-left"}">
          <p class="message">
            ${data.message}
            <span>${data.name} | ${moment(data.date).fromNow()}</span>
          </p>
        </li>`
        messageContainer.innerHTML+=element;
        scrolltobottom();
}


const scrolltobottom=()=>{
    messageContainer.scrollTo(0,messageContainer.scrollHeight);
}


 messageInput.addEventListener('focus',((e)=>{
    const data={
      feedback:`${nameInput.value} is typing...`
    }
    socket.emit('feedback',(data));
 }))
 messageInput.addEventListener('keypress',(()=>{
  socket.emit('feedback',{
    feedback:`${nameInput.value} is typing...`
  })
 }))
 messageInput.addEventListener('blur',(()=>{
  socket.emit('feedback',{
    feedback:''
  })
 }))



 //listening to the other 
 //events emitted by the other sockets for the feedback
 socket.on('feedback',((data)=>{
  clearFeedback();
  const element=`<li class="message-feedback">
            <p class="feedback" id="feedback">
                ${data.feedback}
            </p>

        </li>`
        messageContainer.innerHTML+=element;
 }))

 
 const clearFeedback=()=>{
  document.querySelectorAll('li.message-feedback').forEach((element)=>{
    element.parentNode.removeChild(element);
  })
 }
 const nameInputBox=document.querySelector('.name-input-box');
 nameInput.addEventListener("mouseenter", function() {
  nameInputBox.style.visibility = "visible";
});

// Hide the h3 element when mouse leaves the input field
nameInput.addEventListener("mouseleave", function() {
  nameInputBox.style.visibility = "hidden";
})


