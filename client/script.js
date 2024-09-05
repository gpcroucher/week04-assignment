const serverURL = import.meta.env.VITE_SERVER_URL;

const deleteMessagesButton = document.getElementById("deleteMessages");
const getMessagesButton = document.getElementById("getMessages");
const messageForm = document.getElementById("messageForm");
const messagesDisplay = document.getElementById("messagesDisplay"); // todo: might need to change this later
console.log(messagesDisplay);

deleteMessagesButton.addEventListener("click", handleDeleteMessagesButton);
getMessagesButton.addEventListener("click", getMessages);
messageForm.addEventListener("submit", handleSubmitMessageForm);

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

async function handleSubmitMessageForm(event) {
  event.preventDefault();
  console.log("Form submitted!");

  const formData = new FormData(event.target);
  const title = formData.get("title");
  const content = formData.get("content");
  await fetch(`${serverURL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });
  getMessages();
  event.target.reset();
}

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
    messagesDisplay.innerHTML += `<p id="message${message.id}">Title: ${message.title}. Message: ${message.content}</p>`;
    console.log(
      `<p id="message${message.id}>Title: ${message.title}. Message: ${message.content}</p>`
    );
  }
}
