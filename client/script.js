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
