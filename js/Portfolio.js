// Canvas background animation
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

// Dynamic content loading
const certificationsContainer = document.getElementById('certifications');
const workExperienceContainer = document.getElementById('work-experience');

// Mock dynamic data for certifications and work experience
const certifications = [
    { title: "Certified JavaScript Developer", issuer: "CertifyMe", date: "Jan 2025" },
    { title: "Full-Stack Web Development", issuer: "CodeCamp", date: "Dec 2024" },
    { title: "React Specialist", issuer: "ReactAcademy", date: "Nov 2024" },
];

const workExperience = [
    { position: "Software Engineer", company: "Tech Solutions Inc.", duration: "2023 - Present" },
    { position: "Web Developer Intern", company: "Startup Hub", duration: "2022 - 2023" },
];

// Populate certifications
function loadCertifications() {
    certificationsContainer.innerHTML = certifications
        .map(
            (cert) => `
            <div class="cert-item">
                <h4>${cert.title}</h4>
                <p>${cert.issuer} - ${cert.date}</p>
            </div>
        `
        )
        .join('');
}

// Populate work experience
function loadWorkExperience() {
    workExperienceContainer.innerHTML = workExperience
        .map(
            (job) => `
            <div class="work-item">
                <h4>${job.position}</h4>
                <p>${job.company} (${job.duration})</p>
            </div>
        `
        )
        .join('');
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCertifications();
    loadWorkExperience();
});
