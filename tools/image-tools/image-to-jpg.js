// Image to JPG Converter
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('toolForm');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualitySlider = document.getElementById('quality');
    const backgroundColorPicker = document.getElementById('backgroundColor');

    // Preview image when selected
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                downloadSection.style.display = 'none';
            };
            reader.readAsDataURL(file);
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

        // Create canvas for conversion
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Set canvas dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Fill background with selected color
            ctx.fillStyle = backgroundColorPicker.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Convert to JPG
            const quality = qualitySlider.value / 100;
            const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);

            // Create download link
            downloadBtn.href = jpgDataUrl;
            downloadBtn.download = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
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