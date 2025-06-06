document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const imageInput = document.getElementById('image-input');
    const originalImage = document.getElementById('original-image');
    const maskImage = document.getElementById('mask-image');
    const overlayImage = document.getElementById('overlay-image');
    const loading = document.getElementById('loading');

    // Display selected image
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage.src = e.target.result;
                originalImage.style.display = 'block';
                maskImage.style.display = 'none';
                overlayImage.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        // Show loading indicator
        loading.classList.remove('hidden');

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send request to backend
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            // Display all images
            originalImage.src = `data:image/png;base64,${result.original}`;
            maskImage.src = `data:image/png;base64,${result.mask}`;
            overlayImage.src = `data:image/png;base64,${result.overlay}`;
            
            originalImage.style.display = 'block';
            maskImage.style.display = 'block';
            overlayImage.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing the image');
        } finally {
            // Hide loading indicator
            loading.classList.add('hidden');
        }
    });
});
