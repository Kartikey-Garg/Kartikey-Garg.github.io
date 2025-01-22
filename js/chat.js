const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let apiKey = "";

// Fetch API key from config.json
async function loadConfig() {
    try {
        const response = await fetch("config.json");
        const config = await response.json();
        apiKey = config.apiKey;
    } catch (error) {
        console.error("Error loading config.json:", error);
        displayMessage("Error: Unable to load API key. Please check the configuration.", "ai");
    }
}

// Display a message in the chat interface
function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Generate AI response using Hugging Face's Inference API
async function generateResponse(userMessage) {
    if (!apiKey) {
        displayMessage("Error: API key not loaded.", "ai");
        return;
    }

    displayMessage("Thinking...", "ai");

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ inputs: userMessage }),
        });

        if (!response.ok) {
            throw new Error("Error generating response: " + response.statusText);
        }

        const data = await response.json();
        const aiMessage = data.generated_text || "I'm sorry, I couldn't process that.";
        displayMessage(aiMessage, "ai");
    } catch (error) {
        console.error(error);
        displayMessage("An error occurred while fetching the response.", "ai");
    }
}

// Handle user input
function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, "user");
    userInput.value = "";

    generateResponse(userMessage);
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Initialize by loading the config
loadConfig();
