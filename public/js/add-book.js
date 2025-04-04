document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-book-form');

    form.addEventListener('submit', (e) => {
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const imageUrl = document.getElementById('imageUrl').value.trim();

        if (!title || !author || !imageUrl) {
            e.preventDefault();
            alert('Please fill in all fields.');
        }
    });
});
