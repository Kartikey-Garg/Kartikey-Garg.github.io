document.addEventListener("DOMContentLoaded", () => {
    // Chat Functionality
    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-btn");
  
    sendButton.addEventListener("click", () => {
      const userMessage = chatInput.value.trim();
      if (userMessage === "") return;
  
      // Append user message
      appendMessage("user", userMessage);
      chatInput.value = "";
  
      // Simulate AI Response
      appendMessage("ai", "Thinking...");
      setTimeout(() => {
        appendMessage("ai", "This is a simulated AI response.");
      }, 2000);
    });
  
    function appendMessage(sender, message) {
      const messageElement = document.createElement("div");
      messageElement.classList.add(sender === "user" ? "user-message" : "ai-message");
      messageElement.textContent = message;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    // Background Animation
const canvas = document.getElementById("background-animation");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 5 + 2, // Larger initial size
    speedX: Math.random() * 2 - 1,
    speedY: Math.random() * 2 - 1,
    shrinkRate: Math.random() * 0.05 + 0.01, // Rate at which the particle shrinks
  };
}

function createParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    // Update position
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Shrink size
    particle.size -= particle.shrinkRate;

    // If the particle is too small, replace it with a new one
    if (particle.size <= 0) {
      particles[index] = createParticle();
    }

    // Bounce off edges
    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffcc";
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

createParticles();
animateParticles();
});