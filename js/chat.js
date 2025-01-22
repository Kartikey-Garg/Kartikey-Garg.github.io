const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let apiKey = ""; // Will be loaded from config.json

// Load the API key from config.json
async function loadConfig() {
    try {
        const response = await fetch('./config.json');
        if (!response.ok) {
            throw new Error('Failed to load config.json');
        }
        const config = await response.json();
        apiKey = config.apiKey;
        console.log("API Key loaded successfully");
    } catch (error) {
        console.error("Error loading API key:", error);
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
    displayMessage("Thinking...", "ai");

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: userMessage }),
        });

        if (!response.ok) {
            throw new Error("Error generating response: " + response.statusText);
        }

        const data = await response.json();
        const aiMessage = data.generated_text || "I'm sorry, I couldn't process that.";
        displayMessage(aiMessage, "ai");
    } catch (error) {
        console.error("Error generating response:", error);
        displayMessage("An error occurred while fetching the response. Please try again.", "ai");
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

// Initialize: Load the config and prepare for interaction
loadConfig();
