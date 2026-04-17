/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const workerUrl = "https://08-loreal-chat-bot.asiaetienne15.workers.dev/";
const initialMessage = "👋 Hello! How can I help you today?";

// Add one message block to the chat window.
function addMessage(role, text) {
  const messageElement = document.createElement("div");
  messageElement.className = `msg ${role}`;
  messageElement.textContent = text;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return messageElement;
}

// Set initial message
chatWindow.innerHTML = "";
addMessage("ai", initialMessage);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  // Show the user's message right away so the app feels responsive.
  addMessage("user", userMessage);
  userInput.value = "";

  // Add a temporary assistant message while the API request is in progress.
  const pendingReply = addMessage("ai", "Thinking...");

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    pendingReply.textContent = aiMessage;
  } catch (error) {
    pendingReply.textContent =
      "Sorry, I couldn't connect right now. Please try again.";
    console.error("Cloudflare worker error:", error);
  }
});

//cloudflare worker url: https://08-loreal-chat-bot.asiaetienne15.workers.dev/
