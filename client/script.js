const messageForm = document.getElementById("messageForm");

messageForm.addEventListener("submit", handleSubmitMessageForm);

function handleSubmitMessageForm(event) {
  event.preventDefault();
  console.log("Form submitted!");

  const formData = new FormData(event.target);
  const title = formData.get("title");
  const content = formData.get("content");
  debugger;
  fetch("http://localhost:8080/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });
  event.target.reset();
}

// const randomForm = document.getElementById("randomForm");
// const randomOutput = document.getElementById("randomOutput");
// randomForm.addEventListener("submit", async function (event) {
//   event.preventDefault();
//   const response = await fetch("http://localhost:8080/mesages/random");
//   const message = await response.json();
//   console.log(message);
//   randomOutput.innerText = message.message;
// });
