document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrForm = document.getElementById('qrForm');
    const urlInput = document.getElementById('urlInput');
    const qrSize = document.getElementById('qrSize');
    const sizeValue = document.getElementById('sizeValue');
    const qrForeground = document.getElementById('qrForeground');
    const qrBackground = document.getElementById('qrBackground');
    const qrErrorCorrection = document.getElementById('qrErrorCorrection');
    const qrIncludeMargin = document.getElementById('qrIncludeMargin');
    const qrCodeImage = document.getElementById('qrCodeImage');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const downloadOptions = document.getElementById('downloadOptions');
    const downloadPng = document.getElementById('downloadPng');
    const downloadSvg = document.getElementById('downloadSvg');
    const copyQrCode = document.getElementById('copyQrCode');
    
    // Current QR Code Data
    let currentQrData = {
        url: '',
        options: {}
    };
    
    // Initialize
    initializeEventListeners();
    
    // Event Listeners
    function initializeEventListeners() {
        // QR Size Change
        qrSize.addEventListener('input', function() {
            sizeValue.textContent = this.value;
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
    
    // Generate QR Code
    function generateQrCode() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showToast('Please enter a valid URL', 'error');
            return;
        }
        
        // Validate URL format
        if (!isValidUrl(url)) {
            showToast('Please enter a valid URL (e.g., https://example.com)', 'error');
            return;
        }
        
        // QR Code options
        const options = {
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            color: {
                dark: qrForeground.value,
                light: qrBackground.value
            },
            errorCorrectionLevel: qrErrorCorrection.value,
            margin: qrIncludeMargin.checked ? 4 : 0
        };
        
        // Store current QR data
        currentQrData = {
            url: url,
            options: options
        };
        
        // Generate QR code
        try {
            // Clear previous QR code
            qrCodeImage.src = '';
            qrPlaceholder.classList.add('d-none');
            
            // Generate QR code as data URL
            QRCode.toDataURL(url, options, function(error, url) {
                if (error) {
                    console.error(error);
                    showToast('Error generating QR code', 'error');
                    return;
                }
                
                // Display QR code
                qrCodeImage.src = url;
                qrCodeImage.classList.remove('d-none');
                downloadOptions.classList.remove('d-none');
                
                showToast('QR code generated successfully', 'success');
            });
        } catch (error) {
            console.error(error);
            showToast('Error generating QR code', 'error');
        }
    }
    
    // Download QR Code
    function downloadQrCode(format) {
        if (!currentQrData.url) {
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
            // Download as SVG
            QRCode.toString(currentQrData.url, {
                ...currentQrData.options,
                type: 'svg'
            }, function(error, svgString) {
                if (error) {
                    console.error(error);
                    showToast('Error generating SVG', 'error');
                    return;
                }
                
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
    
    // Generate QR code on page load with default URL
    generateQrCode();
}); 