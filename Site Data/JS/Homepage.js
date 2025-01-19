const canvas = document.getElementById('bouncingBallCanvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursor');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const ballCount = isMobile ? 15 : 30; // Fewer balls on mobile
const maxSpeed = isMobile ? 2 : 4; // Slower movement on mobile

function createBall(x, y, radius, dx, dy, color) {
    return { x, y, radius, dx, dy, color };
}

function randomColor() {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
}

function randomBall() {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    const dx = (Math.random() - 0.5) * maxSpeed;
    const dy = (Math.random() - 0.5) * maxSpeed;
    const color = randomColor();
    return createBall(x, y, radius, dx, dy, color);
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBallPosition(ball) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => {
        drawBall(ball);
        updateBallPosition(ball);
    });

    requestAnimationFrame(animate);
}

for (let i = 0; i < ballCount; i++) {
    balls.push(randomBall());
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Custom cursor
if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}
