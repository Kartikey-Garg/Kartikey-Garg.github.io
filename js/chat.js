import { Client } from "@gradio/client";
document.addEventListener("DOMContentLoaded", () => {
    // Get references to elements
    const messagesContainer = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    
    if (!messagesContainer || !userInput || !sendButton) {
      console.error("Missing essential DOM elements for the chat functionality.");
      return; // Stop execution if elements are missing
    }
  
    // Display a message in the chat interface
    function displayMessage(message, sender) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-message", sender);
      messageDiv.textContent = message;
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }
  
    // Generate AI response using Hugging Face model
    async function generateResponse(userMessage) {
      displayMessage("Thinking...", "bot"); // Temporary message while waiting for a response
  
      try {
        const client = await Client.connect("KartikeyGarg/openai-community-gpt2");
        const result = await client.predict("/predict", { param_0: userMessage });
        const aiMessage = result.data || "Sorry, I couldn't process that.";
        const botMessages = messagesContainer.getElementsByClassName("chat-message bot");
        botMessages[botMessages.length - 1].textContent = aiMessage; // Update "Thinking..." with response
      } catch (error) {
        console.error("Error fetching response from Hugging Face model:", error);
        const botMessages = messagesContainer.getElementsByClassName("chat-message bot");
        botMessages[botMessages.length - 1].textContent =
          "An error occurred. Please try again.";
      }
    }
  
    // Handle sending messages
    function sendMessage() {
      const userMessage = userInput.value.trim();
      if (!userMessage) return;
  
      // Add user message
      displayMessage(userMessage, "user");
      userInput.value = "";
  
      // Generate bot response
      generateResponse(userMessage);
    }
  
    // Event Listeners
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") sendMessage();
    });
  
    // Background Animation
    const canvas = document.getElementById("background-animation");
    const ctx = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const particlesArray = [];
    const colors = ['#FFB6C1', '#FFD700', '#ADFF2F', '#00CED1', '#1E90FF', '#FF69B4']; // Light colors

    class Particle {
      constructor(x, y, size, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
      }
  
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
  
        if (this.size > 0.5) this.size -= 0.05; // Gradually shrink particle size
      }
  
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  
    function initParticles() {
      for (let i = 0; i < 100; i++) {
        addParticle();
      }
    }
  
    function addParticle() {
      const size = Math.random() * 5 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = Math.random() * 1 - 0.5;
      const speedY = Math.random() * 1 - 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
  
      particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
    }
  
    function handleParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
  
        if (particlesArray[i].size <= 0.5) {
          particlesArray.splice(i, 1);
          addParticle();
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
      particlesArray.length = 0;
      initParticles();
    });
  
    initParticles();
    animate();
});
