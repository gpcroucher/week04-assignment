const serverURL = import.meta.env.VITE_SERVER_URL;

const deleteMessagesButton = document.getElementById("deleteMessages");
const getMessagesButton = document.getElementById("getMessages");
const messageForm = document.getElementById("messageForm");
const messagesDisplay = document.getElementById("messagesDisplay"); // todo: might need to change this later
const usernameInput = document.getElementById("usernameInput");

deleteMessagesButton.addEventListener("click", handleDeleteMessagesButton);
getMessagesButton.addEventListener("click", getMessages);
messageForm.addEventListener("submit", handleSubmitMessageForm);

// prompt for a password and then attempt to DELETE from the server
async function handleDeleteMessagesButton(event) {
  event.preventDefault();
  const password = prompt(
    "This will delete all messages from the database. Please enter password:"
  );
  if (!password) {
    console.log("Delete messages cancelled: No password entered.");
    return;
  }
  const resultObject = await fetch(`${serverURL}/clear?password=${password}`, {
    method: "DELETE",
  });
  console.log(resultObject);
  const result = await resultObject.json();
  console.log(result);
  if (result == false) {
    console.log("Delete messages cancelled: Incorrect password.");
    return;
  }
  if (result !== null) {
    alert(`${result} rows deleted.`);
  }
  getMessages();
}

// get the form data and POST it to the server
async function handleSubmitMessageForm(event) {
  event.preventDefault();
  console.log("Form submitted!");

  const time = new Date();

  const formData = new FormData(event.target);
  const username = formData.get("username");
  const title = formData.get("title");
  const content = formData.get("content");
  await fetch(`${serverURL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      title: title,
      content: content,
      time: time,
    }),
  });
  getMessages();
  event.target.reset();
  // username field stays filled in when the other fields are reset
  usernameInput.value = username; // I don't like this but I can't think of a better way
}

// GET the messages from the server
async function getMessages() {
  const messages = await fetch(`${serverURL}/messages`);
  const messagesData = await messages.json();
  // messagesDisplay.innerText = await messagesData;
  messagesDisplay.innerHTML = "";
  console.log("messagesData:", messagesData);

  if (messagesData.length === 0) {
    messagesDisplay.innerText = "No messages to display :(";
    return;
  }

  for await (const message of messagesData) {
    console.log(message);

    // create a div with all the message info in it
    const newDiv = document.createElement("div");
    newDiv.id = `messageContainer${message.id}`;
    newDiv.classList.add("message-container");
    messagesDisplay.appendChild(newDiv);

    const newTitleElement = document.createElement("h3");
    newTitleElement.id = `messageTitle${message.id}`;
    newTitleElement.textContent = `${message.title}`;
    newDiv.appendChild(newTitleElement);

    const newUsernameElement = document.createElement("p");
    newUsernameElement.id = `messageUsername${message.id}`;
    newUsernameElement.textContent = `${message.username}`;
    newDiv.appendChild(newUsernameElement);

    const messageTime = new Date(message.time);
    const newTimeElement = document.createElement("time");
    newTimeElement.id = `messageTime${message.id}`;
    newTimeElement.datetime = message.time;
    // this abominable line of code isn't quite working - must be a better way?
    newTimeElement.textContent = `${messageTime.getUTCDate()}/${
      messageTime.getUTCMonth() + 1
    }/${messageTime.getUTCFullYear()} at ${messageTime.getUTCHours()}:${messageTime.getUTCMinutes()}:${messageTime.getUTCSeconds()}`;
    newDiv.appendChild(newTimeElement);

    const newMessageElement = document.createElement("p");
    newMessageElement.id = `message${message.id}`;
    newMessageElement.textContent = `${message.content}`;
    newDiv.appendChild(newMessageElement);
  }
}
