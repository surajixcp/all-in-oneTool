// Image Resizer
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('toolForm');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const qualitySlider = document.getElementById('quality');

    let originalWidth = 0;
    let originalHeight = 0;

    // Preview image when selected
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                downloadSection.style.display = 'none';

                // Get original dimensions
                const img = new Image();
                img.onload = function() {
                    originalWidth = img.width;
                    originalHeight = img.height;
                    widthInput.value = originalWidth;
                    heightInput.value = originalHeight;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle aspect ratio changes
    widthInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked) {
            const ratio = originalHeight / originalWidth;
            heightInput.value = Math.round(this.value * ratio);
        }
    });

    heightInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked) {
            const ratio = originalWidth / originalHeight;
            widthInput.value = Math.round(this.value * ratio);
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        const targetWidth = parseInt(widthInput.value);
        const targetHeight = parseInt(heightInput.value);

        if (targetWidth < 1 || targetHeight < 1) {
            alert('Please enter valid dimensions');
            return;
        }

        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Set canvas dimensions
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Draw resized image
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Convert to image
            const quality = qualitySlider.value / 100;
            const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);

            // Create download link
            downloadBtn.href = resizedDataUrl;
            downloadBtn.download = file.name.replace(/\.[^/.]+$/, '') + '_resized.jpg';
            downloadSection.style.display = 'block';
        };

        img.src = URL.createObjectURL(file);
    });

    // Show quality value
    qualitySlider.addEventListener('input', function() {
        const qualityValue = document.createElement('div');
        qualityValue.className = 'form-text';
        qualityValue.textContent = `Quality: ${this.value}%`;
        this.parentNode.appendChild(qualityValue);
    });
}); 