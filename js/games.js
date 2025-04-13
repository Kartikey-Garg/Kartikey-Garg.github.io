// Create an animated gradient background
const body = document.body;
let gradientAngle = 0;

function animateBackground() {
    gradientAngle += 0.5; // Adjust the speed of the animation
    body.style.background = `linear-gradient(${gradientAngle}deg, #1e3c72, #2a5298)`;
    requestAnimationFrame(animateBackground);
}

// Start the animation
animateBackground();
