document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrForm = document.getElementById('qrForm');
    const qrType = document.getElementById('qrType');
    const qrContent = document.getElementById('qrContent');
    const qrSize = document.getElementById('qrSize');
    const sizeValue = document.getElementById('sizeValue');
    const qrForeground = document.getElementById('qrForeground');
    const qrBackground = document.getElementById('qrBackground');
    const qrErrorCorrection = document.getElementById('qrErrorCorrection');
    const qrCodeImage = document.getElementById('qrCodeImage');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const downloadOptions = document.getElementById('downloadOptions');
    const downloadPng = document.getElementById('downloadPng');
    const downloadSvg = document.getElementById('downloadSvg');
    const copyQrCode = document.getElementById('copyQrCode');

    // QR Code API Base URL
    const QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code/';

    // Initialize
    initializeEventListeners();
    updatePlaceholderText();

    // Event Listeners
    function initializeEventListeners() {
        // QR Size Change
        qrSize.addEventListener('input', function() {
            sizeValue.textContent = this.value;
        });

        // QR Type Change
        qrType.addEventListener('change', function() {
            updatePlaceholderText();
        });

        // Form Submit
        qrForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateQrCode();
        });

        // Download Buttons
        downloadPng.addEventListener('click', function() {
            downloadQrCode('png');
        });

        downloadSvg.addEventListener('click', function() {
            downloadQrCode('svg');
        });

        // Copy to Clipboard
        copyQrCode.addEventListener('click', function() {
            copyQrCodeToClipboard();
        });
    }

    // Update Placeholder Text
    function updatePlaceholderText() {
        const type = qrType.value;
        let placeholder = '';

        switch (type) {
            case 'text':
                placeholder = 'Enter your text here...';
                break;
            case 'url':
                placeholder = 'https://example.com';
                break;
            case 'vcard':
                placeholder = 'BEGIN:VCARD\nVERSION:3.0\nN:Last;First\nFN:First Last\nTEL:1234567890\nEMAIL:example@example.com\nEND:VCARD';
                break;
            case 'wifi':
                placeholder = 'WIFI:S:NetworkName;T:WPA;P:Password;;';
                break;
            case 'email':
                placeholder = 'mailto:example@example.com?subject=Subject&body=Body';
                break;
            case 'sms':
                placeholder = 'SMSTO:1234567890:Message';
                break;
        }

        qrContent.placeholder = placeholder;
    }

    // Generate QR Code
    function generateQrCode() {
        const content = qrContent.value.trim();
        
        if (!content) {
            showToast('Please enter content for the QR code', 'error');
            return;
        }

        // Validate URL if URL type is selected
        if (qrType.value === 'url' && !isValidUrl(content)) {
            showToast('Please enter a valid URL', 'error');
            return;
        }

        // Build API URL with parameters
        const params = new URLSearchParams({
            size: `${qrSize.value}x${qrSize.value}`,
            data: content,
            format: 'png',
            color: qrForeground.value.replace('#', ''),
            bgcolor: qrBackground.value.replace('#', ''),
            ecc: qrErrorCorrection.value
        });

        const apiUrl = `${QR_API_BASE}?${params.toString()}`;

        // Show loading state
        qrCodeImage.src = '';
        qrPlaceholder.classList.remove('d-none');
        qrCodeImage.classList.add('d-none');
        downloadOptions.classList.add('d-none');

        // Generate QR code
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to generate QR code');
                }
                return response.blob();
            })
            .then(blob => {
                const imageUrl = URL.createObjectURL(blob);
                qrCodeImage.src = imageUrl;
                qrCodeImage.classList.remove('d-none');
                qrPlaceholder.classList.add('d-none');
                downloadOptions.classList.remove('d-none');
                showToast('QR code generated successfully', 'success');
            })
            .catch(error => {
                console.error('Error generating QR code:', error);
                showToast('Error generating QR code', 'error');
            });
    }

    // Download QR Code
    function downloadQrCode(format) {
        if (!qrCodeImage.src) {
            showToast('Please generate a QR code first', 'error');
            return;
        }

        const fileName = `qrcode-${Date.now()}`;
        
        if (format === 'png') {
            // Download as PNG
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = qrCodeImage.src;
            link.click();
            
            showToast('QR code downloaded as PNG', 'success');
        } else if (format === 'svg') {
            // For SVG, we need to regenerate the QR code
            const params = new URLSearchParams({
                size: `${qrSize.value}x${qrSize.value}`,
                data: qrContent.value,
                format: 'svg',
                color: qrForeground.value.replace('#', ''),
                bgcolor: qrBackground.value.replace('#', ''),
                ecc: qrErrorCorrection.value
            });

            const apiUrl = `${QR_API_BASE}?${params.toString()}`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to generate SVG');
                    }
                    return response.text();
                })
                .then(svgString => {
                    const blob = new Blob([svgString], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    
                    const link = document.createElement('a');
                    link.download = `${fileName}.svg`;
                    link.href = url;
                    link.click();
                    
                    // Clean up
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                    
                    showToast('QR code downloaded as SVG', 'success');
                })
                .catch(error => {
                    console.error('Error generating SVG:', error);
                    showToast('Error generating SVG', 'error');
                });
        }
    }

    // Copy QR Code to Clipboard
    function copyQrCodeToClipboard() {
        if (!qrCodeImage.src) {
            showToast('Please generate a QR code first', 'error');
            return;
        }

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Copy to clipboard
            canvas.toBlob(function(blob) {
                try {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item])
                        .then(() => {
                            showToast('QR code copied to clipboard', 'success');
                        })
                        .catch(err => {
                            console.error('Error copying to clipboard:', err);
                            showToast('Failed to copy to clipboard', 'error');
                        });
                } catch (error) {
                    console.error('Error creating clipboard item:', error);
                    showToast('Your browser does not support copying images to clipboard', 'error');
                }
            });
        };

        img.src = qrCodeImage.src;
    }

    // Validate URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Show Toast Message
    function showToast(message, type = 'info') {
        // Check if toast container exists
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            // Create toast container
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Toast content
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        // Show toast
        bsToast.show();
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
}); 