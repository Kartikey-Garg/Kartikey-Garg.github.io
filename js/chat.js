const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

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
        // Fetch the API key dynamically from config.json
        const configResponse = await fetch("config.json");
        const config = await configResponse.json();
        const apiKey = config.apiKey;

        // Send the user input to Hugging Face's API
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

// Initialization message
console.log("Chat interface is ready for use.");

// Canvas background animation: Particle Network
const canvas = document.getElementById('particleNetworkCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;
const maxDistance = 100;

function createParticle(x, y) {
    return {
        x: x || Math.random() * canvas.width,
        y: y || Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 2,
    };
}

function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function updateParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x > canvas.width || particle.x < 0) particle.vx *= -1;
    if (particle.y > canvas.height || particle.y < 0) particle.vy *= -1;
}

function drawLine(p1, p2) {
    const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
        ctx.stroke();
        ctx.closePath();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        drawParticle(particle);
        updateParticle(particle);

        for (let i = index + 1; i < particles.length; i++) {
            drawLine(particle, particles[i]);
        }
    });

    requestAnimationFrame(animate);
}

for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});