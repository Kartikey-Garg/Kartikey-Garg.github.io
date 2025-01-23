const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let apiKey = "";

// Function to fetch the API key from the config.json file
async function loadConfig() {
    try {
        const response = await fetch("config.json");
        if (!response.ok) {
            throw new Error("Failed to fetch config.json");
        }
        const config = await response.json();
        apiKey = config.apiKey;

        if (!apiKey) {
            throw new Error("API key is missing in config.json");
        }

        console.log("API key loaded successfully.");
    } catch (error) {
        console.error("Error loading config.json:", error);
        displayMessage("Error: Unable to load API key. Please check the configuration.", "ai");
    }
}

// Function to display a message in the chat interface
function displayMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to send the user's message to the Hugging Face API and display the AI's response
async function generateResponse(userMessage) {
    if (!apiKey) {
        displayMessage("Error: API key not loaded. Please try again later.", "ai");
        return;
    }

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
            throw new Error(`API response error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiMessage = data.generated_text || "I'm sorry, I couldn't process that.";
        displayMessage(aiMessage, "ai");
    } catch (error) {
        console.error("Error generating AI response:", error);
        displayMessage("An error occurred while fetching the AI response. Please try again.", "ai");
    }
}

// Function to handle user input and send messages
function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, "user");
    userInput.value = "";

    generateResponse(userMessage);
}

// Event listeners for button click and "Enter" key press
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Load the configuration on initialization
loadConfig();
