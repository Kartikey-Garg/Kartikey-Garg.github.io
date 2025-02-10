// Canvas background animation: Network Nodes
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nodes = [];
const nodeCount = 100;
const maxDistance = 150;

class Node {
    constructor(x, y, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }

        this.draw();
    }
}

function connectNodes() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.sqrt(
                (nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2
            );

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function initNodes() {
    for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        nodes.push(new Node(x, y, speedX, speedY));
    }
}

function animateNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((node) => node.update());
    connectNodes();

    requestAnimationFrame(animateNodes);
}

// Handle responsive canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    nodes.length = 0;
    initNodes();
});

// Initialize and animate
initNodes();
animateNodes();

// Dynamic Content Integration: Credly and LinkedIn APIs
const certificationsContainer = document.getElementById('certifications');
const workExperienceContainer = document.getElementById('work-experience');

// Fetch Credly Certifications
async function fetchCertifications() {
    try {
        const response = await fetch('https://api.credly.com/v1/organizations/your-org-id/badges', {
            headers: {
                Authorization: 'Bearer XXXXXXXXXX',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch certifications.');
        }

        const data = await response.json();
        certificationsContainer.innerHTML = data.data
            .map(
                (cert) => `
                <div class="cert-item">
                    <img src="${cert.badge_template.image_url}" alt="${cert.badge_template.name}" class="cert-badge">
                    <h4>${cert.badge_template.name}</h4>
                    <p>Issued by: ${cert.badge_template.issuer.name}</p>
                </div>
            `
            )
            .join('');
    } catch (error) {
        certificationsContainer.innerHTML = '<p>Error loading certifications. Please try again later.</p>';
        console.error(error);
    }
}

// Fetch LinkedIn Work Experience
async function fetchWorkExperience() {
    try {
        const response = await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: 'Bearer XXXXXXXXXX',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch work experience.');
        }

        const data = await response.json();
        workExperienceContainer.innerHTML = `
            <div class="work-item">
                <h4>${data.localizedHeadline}</h4>
                <p>${data.firstName} ${data.lastName}</p>
            </div>
        `;
    } catch (error) {
        workExperienceContainer.innerHTML = '<p>Error loading work experience. Please try again later.</p>';
        console.error(error);
    }
}

// Load Data on Page Load
document.addEventListener('DOMContentLoaded', () => {
    fetchCertifications();
    fetchWorkExperience();
});

document.addEventListener("DOMContentLoaded", () => {
    const showMoreButton = document.getElementById("show-more-badges");
    const badgeGrid = document.getElementById("badge-grid");

    showMoreButton.addEventListener("click", () => {
        // Add more badges when the button is clicked
        const moreBadges = `
            <div class="badge">
                <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="another-badge-id" data-share-badge-host="https://www.credly.com"></div>
                <script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
            </div>
            <div class="badge">
                <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="another-badge-id" data-share-badge-host="https://www.credly.com"></div>
                <script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
            </div>
            <!-- Add more badges as needed -->
        `;
        badgeGrid.insertAdjacentHTML("beforeend", moreBadges);
        showMoreButton.style.display = "none"; // Hide the button after showing more badges
    });
});

// IBM Watson Assistant Chat Integration
window.watsonAssistantChatOptions = {
    integrationID: "46f6f74c-3122-4218-b053-e9ae9255b8a9", // The ID of this integration.
    region: "us-south", // The region your integration is hosted in.
    serviceInstanceID: "fe133dc3-4df7-408e-9b11-c23537f1aec4", // The ID of your service instance.
    onLoad: async (instance) => { await instance.render(); }
};
setTimeout(function(){
    const t=document.createElement('script');
    t.src="https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
});
