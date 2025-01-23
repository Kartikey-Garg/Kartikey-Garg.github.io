const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const API_KEY = "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"; // Replace with your actual API key

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
            headers: { Authorization: `Bearer ${API_KEY}` },
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

// Animated background
const canvas = document.getElementById("background-animation");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];

// Particle object
class Particle {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

// Handle particle animation
function initParticles() {
    for (let i = 0; i < 100; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 2 - 1;
        const speedY = Math.random() * 2 - 1;

        particlesArray.push(new Particle(x, y, size, speedX, speedY));
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        if (particlesArray[i].size <= 0.3) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Initialize particles and start animation
initParticles();
animate();
