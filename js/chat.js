document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const canvas = document.getElementById("backgroundCanvas");

    let apiKey = ""; // Replace with your API key directly for now.

    // Initialize the canvas
    if (canvas) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Canvas context is null. Check if the canvas element exists in the DOM.");
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create gradient animation for the canvas
        let colorOffset = 0;

        function animateBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${colorOffset}, 100%, 70%)`);
            gradient.addColorStop(1, `hsl(${colorOffset + 60}, 100%, 80%)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            colorOffset += 0.5;
            if (colorOffset > 360) colorOffset = 0;

            requestAnimationFrame(animateBackground);
        }

        animateBackground();
    } else {
        console.error("Canvas element with id 'backgroundCanvas' not found.");
    }

    // Function to display chat messages
    function displayMessage(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Generate AI response using Hugging Face API
    async function generateResponse(userMessage) {
        displayMessage("Thinking...", "ai");

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
});
