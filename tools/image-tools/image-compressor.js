// Image Compressor
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('toolForm');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualitySlider = document.getElementById('quality');
    const maxWidthInput = document.getElementById('maxWidth');
    const maxHeightInput = document.getElementById('maxHeight');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const fileInfo = document.getElementById('fileInfo');
    const originalSizeSpan = document.getElementById('originalSize');
    const compressedSizeSpan = document.getElementById('compressedSize');
    const reductionSpan = document.getElementById('reduction');
    const qualityValueSpan = document.getElementById('qualityValue');

    let originalFile = null;

    // Preview image when selected
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            originalFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                downloadSection.style.display = 'none';
                fileInfo.style.display = 'none';

                // Get original dimensions
                const img = new Image();
                img.onload = function() {
                    maxWidthInput.value = img.width;
                    maxHeightInput.value = img.height;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle aspect ratio changes
    maxWidthInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked) {
            const img = new Image();
            img.onload = function() {
                const ratio = img.height / img.width;
                maxHeightInput.value = Math.round(this.value * ratio);
            };
            img.src = previewImage.src;
        }
    });

    maxHeightInput.addEventListener('input', function() {
        if (maintainAspectRatio.checked) {
            const img = new Image();
            img.onload = function() {
                const ratio = img.width / img.height;
                maxWidthInput.value = Math.round(this.value * ratio);
            };
            img.src = previewImage.src;
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!originalFile) {
            alert('Please select an image first');
            return;
        }

        // Create canvas for compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Calculate new dimensions
            let newWidth = img.width;
            let newHeight = img.height;

            if (maxWidthInput.value && maxWidthInput.value < img.width) {
                newWidth = parseInt(maxWidthInput.value);
                if (maintainAspectRatio.checked) {
                    newHeight = Math.round((newWidth * img.height) / img.width);
                }
            }

            if (maxHeightInput.value && maxHeightInput.value < img.height) {
                newHeight = parseInt(maxHeightInput.value);
                if (maintainAspectRatio.checked) {
                    newWidth = Math.round((newHeight * img.width) / img.height);
                }
            }

            // Set canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw resized image
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert to image with compression
            const quality = qualitySlider.value / 100;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

            // Calculate file sizes
            const originalSize = originalFile.size;
            const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
            const reduction = Math.round((1 - compressedSize / originalSize) * 100);

            // Update file info
            originalSizeSpan.textContent = formatFileSize(originalSize);
            compressedSizeSpan.textContent = formatFileSize(compressedSize);
            reductionSpan.textContent = reduction + '%';
            qualityValueSpan.textContent = qualitySlider.value + '%';
            fileInfo.style.display = 'block';

            // Create download link
            downloadBtn.href = compressedDataUrl;
            downloadBtn.download = originalFile.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg';
            downloadSection.style.display = 'block';
        };

        img.src = URL.createObjectURL(originalFile);
    });

    // Show quality value
    qualitySlider.addEventListener('input', function() {
        qualityValueSpan.textContent = this.value + '%';
    });
});

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 