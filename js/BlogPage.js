const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX *= -1;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY *= -1;
        }

        this.draw();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 5 + 2;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const color = `rgba(255, 255, 255, ${Math.random()})`;
        particles.push(new Particle(x, y, radius, color, speedX, speedY));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
    });

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.length = 0;
    initParticles();
});

// Modal Handling Code
const modal = document.getElementById('blog-modal');
const modalContent = document.getElementById('blog-full-content');

// Function to open the modal and load blog data dynamically
async function openBlog(blogId) {
    try {
        const response = await fetch(`blogs/blog${blogId}.html`);

        if (!response.ok) {
            throw new Error('Failed to load blog content.');
        }

        const blogContent = await response.text();

        modalContent.innerHTML = blogContent;
        modal.classList.remove('hidden');
    } catch (error) {
        modalContent.innerHTML = `<p>Error: Unable to load blog content. Please try again later.</p>`;
        modal.classList.remove('hidden');
        console.error(error);
    }
}

// Function to close the modal
function closeBlog() {
    modal.classList.add('hidden');
    modalContent.innerHTML = ''; // Clear content to save memory
}

// Close modal when clicking outside the content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeBlog();
    }
});
