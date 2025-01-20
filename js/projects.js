// Canvas background animation: Floating 3D Cubes
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cubes = [];
const cubeCount = 50;

class Cube {
    constructor(x, y, size, speedX, speedY, rotation) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.rotation = rotation;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += 0.01;

        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;

        this.draw();
    }
}

function initCubes() {
    for (let i = 0; i < cubeCount; i++) {
        const size = Math.random() * 20 + 10;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const rotation = Math.random() * Math.PI * 2;
        cubes.push(new Cube(x, y, size, speedX, speedY, rotation));
    }
}

function animateCubes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cubes.forEach((cube) => cube.update());

    requestAnimationFrame(animateCubes);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cubes.length = 0;
    initCubes();
});

initCubes();
animateCubes();

// Dynamic Project Loading from GitHub
const projectsGrid = document.getElementById('projects-grid');
const GITHUB_USERNAME = 'kartikey-garg';
const REPO_COUNT = 6; // Number of repositories to display

async function fetchProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${REPO_COUNT}`);

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        const repos = await response.json();
        projectsGrid.innerHTML = repos
            .map(
                (repo) => `
                <div class="project-card">
                    <div class="card-content">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available.'}</p>
                        <p><strong>Language:</strong> ${repo.language || 'N/A'}</p>
                        <a href="${repo.html_url}" target="_blank">View Code</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">Live Demo</a>` : ''}
                    </div>
                </div>
            `
            )
            .join('');
    } catch (error) {
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', fetchProjects);