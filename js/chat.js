document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const canvas = document.getElementById("backgroundCanvas");

    // Ensure canvas initialization
    if (canvas) {
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.error("Canvas context is null. Check if the canvas element exists in the DOM.");
            return;
        }

        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create simple animation for the background
        function animateBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#6D83F2");
            gradient.addColorStop(1, "#B0C4F6");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            requestAnimationFrame(animateBackground);
        }

        animateBackground();
    } else {
        console.error("Canvas element with id 'backgroundCanvas' not found.");
    }

    // Function to display messages in the chat
    function displayMessage(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to fetch API key securely from the config file
    async function getApiKey() {
        try {
            const response = await fetch("config.json");
            const config = await response.json();
            return config.apiKey;
        } catch (error) {
            console.error("Error loading API key from config.json:", error);
            return null;
        }
    }

    // Function to generate AI response using Hugging Face API
    async function generateResponse(userMessage) {
        displayMessage("Thinking...", "ai");

        const apiKey = await getApiKey();
        if (!apiKey) {
            displayMessage("Error: API key not found. Please check your configuration.", "ai");
            return;
        }

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
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
            displayMessage("An error occurred while fetching the response.", "ai");
        }
    }

    // Function to handle user input
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
});