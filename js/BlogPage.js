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
