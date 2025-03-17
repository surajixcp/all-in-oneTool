document.addEventListener('DOMContentLoaded', function() {
    // Text Tab Elements
    const textInput = document.getElementById('textInput');
    const encodeText = document.getElementById('encodeText');
    const decodeText = document.getElementById('decodeText');
    const processTextBtn = document.getElementById('processTextBtn');
    const clearTextBtn = document.getElementById('clearTextBtn');
    const textResult = document.getElementById('textResult');
    const textStats = document.getElementById('textStats');
    const copyTextResultBtn = document.getElementById('copyTextResultBtn');
    const downloadTextResultBtn = document.getElementById('downloadTextResultBtn');
    
    // File Tab Elements
    const fileInput = document.getElementById('fileInput');
    const encodeFile = document.getElementById('encodeFile');
    const decodeFile = document.getElementById('decodeFile');
    const processFileBtn = document.getElementById('processFileBtn');
    const clearFileBtn = document.getElementById('clearFileBtn');
    const fileResult = document.getElementById('fileResult');
    const fileStats = document.getElementById('fileStats');
    const copyFileResultBtn = document.getElementById('copyFileResultBtn');
    const downloadFileResultBtn = document.getElementById('downloadFileResultBtn');
    
    // Image Tab Elements
    const imageInput = document.getElementById('imageInput');
    const encodeImage = document.getElementById('encodeImage');
    const decodeImage = document.getElementById('decodeImage');
    const processImageBtn = document.getElementById('processImageBtn');
    const clearImageBtn = document.getElementById('clearImageBtn');
    const imageResult = document.getElementById('imageResult');
    const imageStats = document.getElementById('imageStats');
    const imagePreview = document.getElementById('imagePreview');
    const copyImageResultBtn = document.getElementById('copyImageResultBtn');
    const downloadImageResultBtn = document.getElementById('downloadImageResultBtn');
    
    // File Upload UI
    const fileUploadText = document.querySelector('.file-upload-text');
    const imageUploadText = document.querySelectorAll('.file-upload-text')[1];
    
    // Current Results
    let currentTextResult = '';
    let currentFileResult = '';
    let currentImageResult = '';
    let currentFileName = '';
    let currentImageName = '';
    let currentImageType = '';
    
    // Initialize Event Listeners
    initTextTab();
    initFileTab();
    initImageTab();
    
    // Text Tab Functions
    function initTextTab() {
        processTextBtn.addEventListener('click', processText);
        clearTextBtn.addEventListener('click', clearText);
        copyTextResultBtn.addEventListener('click', copyTextResult);
        downloadTextResultBtn.addEventListener('click', downloadTextResult);
    }
    
    function processText() {
        const text = textInput.value.trim();
        
        if (!text) {
            showToast('Please enter some text', 'error');
            return;
        }
        
        try {
            if (encodeText.checked) {
                // Encode text to Base64
                currentTextResult = btoa(text);
                textResult.textContent = currentTextResult;
                textStats.innerHTML = `
                    Original size: ${formatBytes(text.length)} | 
                    Encoded size: ${formatBytes(currentTextResult.length)} | 
                    Increase: ${Math.round((currentTextResult.length - text.length) / text.length * 100)}%
                `;
            } else {
                // Decode Base64 to text
                currentTextResult = atob(text);
                textResult.textContent = currentTextResult;
                textStats.innerHTML = `
                    Encoded size: ${formatBytes(text.length)} | 
                    Decoded size: ${formatBytes(currentTextResult.length)} | 
                    Decrease: ${Math.round((text.length - currentTextResult.length) / text.length * 100)}%
                `;
            }
            
            // Enable buttons
            copyTextResultBtn.disabled = false;
            downloadTextResultBtn.disabled = false;
            
            showToast('Processing completed successfully', 'success');
        } catch (error) {
            console.error('Error processing text:', error);
            textResult.textContent = 'Error: ' + error.message;
            textStats.textContent = '';
            
            // Disable buttons
            copyTextResultBtn.disabled = true;
            downloadTextResultBtn.disabled = true;
            
            showToast('Error processing text. Make sure the input is valid.', 'error');
        }
    }
    
    function clearText() {
        textInput.value = '';
        textResult.textContent = '';
        textStats.textContent = '';
        currentTextResult = '';
        
        // Disable buttons
        copyTextResultBtn.disabled = true;
        downloadTextResultBtn.disabled = true;
    }
    
    function copyTextResult() {
        if (!currentTextResult) {
            showToast('No result to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(currentTextResult)
            .then(() => {
                showToast('Result copied to clipboard', 'success');
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                showToast('Failed to copy to clipboard', 'error');
            });
    }
    
    function downloadTextResult() {
        if (!currentTextResult) {
            showToast('No result to download', 'error');
            return;
        }
        
        const blob = new Blob([currentTextResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const operation = encodeText.checked ? 'encoded' : 'decoded';
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `base64-${operation}-${Date.now()}.txt`;
        link.click();
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('Result downloaded successfully', 'success');
    }
    
    // File Tab Functions
    function initFileTab() {
        fileInput.addEventListener('change', handleFileSelect);
        processFileBtn.addEventListener('click', processFile);
        clearFileBtn.addEventListener('click', clearFile);
        copyFileResultBtn.addEventListener('click', copyFileResult);
        downloadFileResultBtn.addEventListener('click', downloadFileResult);
    }
    
    function handleFileSelect(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Update file name display
            fileUploadText.textContent = file.name;
            currentFileName = file.name;
            
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showToast('File is too large. Maximum size is 5MB.', 'error');
                fileInput.value = '';
                fileUploadText.textContent = 'Choose a file...';
                processFileBtn.disabled = true;
                return;
            }
            
            // Enable process button
            processFileBtn.disabled = false;
        } else {
            fileUploadText.textContent = 'Choose a file...';
            processFileBtn.disabled = true;
        }
    }
    
    function processFile() {
        const file = fileInput.files[0];
        
        if (!file) {
            showToast('Please select a file', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        if (encodeFile.checked) {
            // Encode file to Base64
            reader.onload = function(e) {
                try {
                    const arrayBuffer = e.target.result;
                    const bytes = new Uint8Array(arrayBuffer);
                    let binary = '';
                    
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    
                    currentFileResult = btoa(binary);
                    
                    // Display result (truncate if too long)
                    if (currentFileResult.length > 10000) {
                        fileResult.textContent = currentFileResult.substring(0, 10000) + '... (truncated for display)';
                    } else {
                        fileResult.textContent = currentFileResult;
                    }
                    
                    // Update stats
                    fileStats.innerHTML = `
                        File: ${file.name} | 
                        Original size: ${formatBytes(file.size)} | 
                        Encoded size: ${formatBytes(currentFileResult.length)} | 
                        Increase: ${Math.round((currentFileResult.length - file.size) / file.size * 100)}%
                    `;
                    
                    // Enable buttons
                    copyFileResultBtn.disabled = false;
                    downloadFileResultBtn.disabled = false;
                    
                    showToast('File encoded successfully', 'success');
                } catch (error) {
                    console.error('Error encoding file:', error);
                    fileResult.textContent = 'Error: ' + error.message;
                    fileStats.textContent = '';
                    
                    // Disable buttons
                    copyFileResultBtn.disabled = true;
                    downloadFileResultBtn.disabled = true;
                    
                    showToast('Error encoding file', 'error');
                }
            };
            
            reader.readAsArrayBuffer(file);
        } else {
            // Decode Base64 to file
            reader.onload = function(e) {
                try {
                    const text = e.target.result;
                    
                    // Validate Base64
                    if (!isValidBase64(text)) {
                        throw new Error('Invalid Base64 format');
                    }
                    
                    const binary = atob(text);
                    const bytes = new Uint8Array(binary.length);
                    
                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    
                    currentFileResult = bytes;
                    
                    // Display result info
                    fileResult.textContent = 'Binary data ready for download';
                    
                    // Update stats
                    fileStats.innerHTML = `
                        File: ${file.name} | 
                        Encoded size: ${formatBytes(text.length)} | 
                        Decoded size: ${formatBytes(bytes.length)} | 
                        Decrease: ${Math.round((text.length - bytes.length) / text.length * 100)}%
                    `;
                    
                    // Enable buttons
                    copyFileResultBtn.disabled = true; // Can't copy binary data
                    downloadFileResultBtn.disabled = false;
                    
                    showToast('File decoded successfully', 'success');
                } catch (error) {
                    console.error('Error decoding file:', error);
                    fileResult.textContent = 'Error: ' + error.message;
                    fileStats.textContent = '';
                    
                    // Disable buttons
                    copyFileResultBtn.disabled = true;
                    downloadFileResultBtn.disabled = true;
                    
                    showToast('Error decoding file. Make sure the file contains valid Base64 data.', 'error');
                }
            };
            
            reader.readAsText(file);
        }
    }
    
    function clearFile() {
        fileInput.value = '';
        fileUploadText.textContent = 'Choose a file...';
        fileResult.textContent = '';
        fileStats.textContent = '';
        currentFileResult = '';
        currentFileName = '';
        
        // Disable buttons
        processFileBtn.disabled = true;
        copyFileResultBtn.disabled = true;
        downloadFileResultBtn.disabled = true;
    }
    
    function copyFileResult() {
        if (!currentFileResult || typeof currentFileResult !== 'string') {
            showToast('No text result to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(currentFileResult)
            .then(() => {
                showToast('Result copied to clipboard', 'success');
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                showToast('Failed to copy to clipboard', 'error');
            });
    }
    
    function downloadFileResult() {
        if (!currentFileResult) {
            showToast('No result to download', 'error');
            return;
        }
        
        let blob;
        let extension = '';
        
        if (encodeFile.checked) {
            // Download as text file
            blob = new Blob([currentFileResult], { type: 'text/plain' });
            extension = 'txt';
        } else {
            // Download as binary file
            blob = new Blob([currentFileResult], { type: 'application/octet-stream' });
            
            // Try to preserve original extension
            if (currentFileName) {
                const parts = currentFileName.split('.');
                if (parts.length > 1) {
                    extension = parts.pop();
                }
            }
            
            if (!extension) {
                extension = 'bin';
            }
        }
        
        const url = URL.createObjectURL(blob);
        const operation = encodeFile.checked ? 'encoded' : 'decoded';
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `base64-${operation}-${Date.now()}.${extension}`;
        link.click();
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        showToast('Result downloaded successfully', 'success');
    }
    
    // Image Tab Functions
    function initImageTab() {
        imageInput.addEventListener('change', handleImageSelect);
        processImageBtn.addEventListener('click', processImage);
        clearImageBtn.addEventListener('click', clearImage);
        copyImageResultBtn.addEventListener('click', copyImageResult);
        downloadImageResultBtn.addEventListener('click', downloadImageResult);
    }
    
    function handleImageSelect(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                imageInput.value = '';
                imageUploadText.textContent = 'Choose an image...';
                processImageBtn.disabled = true;
                return;
            }
            
            // Update image name display
            imageUploadText.textContent = file.name;
            currentImageName = file.name;
            currentImageType = file.type;
            
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image is too large. Maximum size is 5MB.', 'error');
                imageInput.value = '';
                imageUploadText.textContent = 'Choose an image...';
                processImageBtn.disabled = true;
                return;
            }
            
            // Enable process button
            processImageBtn.disabled = false;
        } else {
            imageUploadText.textContent = 'Choose an image...';
            processImageBtn.disabled = true;
        }
    }
    
    function processImage() {
        const file = imageInput.files[0];
        
        if (!file) {
            showToast('Please select an image', 'error');
            return;
        }
        
        if (encodeImage.checked) {
            // Encode image to Base64
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    currentImageResult = e.target.result; // This is already Base64 data URL
                    
                    // Extract the Base64 part (remove data:image/jpeg;base64, prefix)
                    const base64Data = currentImageResult.split(',')[1];
                    
                    // Display result (truncate if too long)
                    if (base64Data.length > 10000) {
                        imageResult.textContent = base64Data.substring(0, 10000) + '... (truncated for display)';
                    } else {
                        imageResult.textContent = base64Data;
                    }
                    
                    // Show image preview
                    imagePreview.src = currentImageResult;
                    imagePreview.classList.remove('d-none');
                    
                    // Update stats
                    imageStats.innerHTML = `
                        Image: ${file.name} | 
                        Original size: ${formatBytes(file.size)} | 
                        Base64 size: ${formatBytes(base64Data.length)} | 
                        Data URL size: ${formatBytes(currentImageResult.length)}
                    `;
                    
                    // Enable buttons
                    copyImageResultBtn.disabled = false;
                    downloadImageResultBtn.disabled = false;
                    
                    showToast('Image encoded successfully', 'success');
                } catch (error) {
                    console.error('Error encoding image:', error);
                    imageResult.textContent = 'Error: ' + error.message;
                    imageStats.textContent = '';
                    imagePreview.classList.add('d-none');
                    
                    // Disable buttons
                    copyImageResultBtn.disabled = true;
                    downloadImageResultBtn.disabled = true;
                    
                    showToast('Error encoding image', 'error');
                }
            };
            
            reader.readAsDataURL(file);
        } else {
            // Decode Base64 to image
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const text = e.target.result.trim();
                    
                    // Check if it's a data URL or just Base64
                    let base64Data = text;
                    let mimeType = 'image/png'; // Default mime type
                    
                    if (text.startsWith('data:')) {
                        // It's a data URL
                        const parts = text.split(',');
                        const mimeMatch = parts[0].match(/data:(.*?);base64/);
                        
                        if (mimeMatch && mimeMatch[1]) {
                            mimeType = mimeMatch[1];
                        }
                        
                        base64Data = parts[1];
                    }
                    
                    // Validate Base64
                    if (!isValidBase64(base64Data)) {
                        throw new Error('Invalid Base64 format');
                    }
                    
                    // Create data URL if it's just Base64
                    currentImageResult = text.startsWith('data:') ? text : `data:${mimeType};base64,${base64Data}`;
                    
                    // Show image preview
                    imagePreview.src = currentImageResult;
                    imagePreview.classList.remove('d-none');
                    
                    // Display result info
                    imageResult.textContent = 'Image decoded successfully';
                    
                    // Update stats
                    imageStats.innerHTML = `
                        MIME type: ${mimeType} | 
                        Base64 length: ${formatBytes(base64Data.length)}
                    `;
                    
                    // Enable buttons
                    copyImageResultBtn.disabled = false;
                    downloadImageResultBtn.disabled = false;
                    
                    showToast('Image decoded successfully', 'success');
                } catch (error) {
                    console.error('Error decoding image:', error);
                    imageResult.textContent = 'Error: ' + error.message;
                    imageStats.textContent = '';
                    imagePreview.classList.add('d-none');
                    
                    // Disable buttons
                    copyImageResultBtn.disabled = true;
                    downloadImageResultBtn.disabled = true;
                    
                    showToast('Error decoding image. Make sure the file contains valid Base64 data.', 'error');
                }
            };
            
            reader.readAsText(file);
        }
    }
    
    function clearImage() {
        imageInput.value = '';
        imageUploadText.textContent = 'Choose an image...';
        imageResult.textContent = '';
        imageStats.textContent = '';
        imagePreview.classList.add('d-none');
        currentImageResult = '';
        currentImageName = '';
        currentImageType = '';
        
        // Disable buttons
        processImageBtn.disabled = true;
        copyImageResultBtn.disabled = true;
        downloadImageResultBtn.disabled = true;
    }
    
    function copyImageResult() {
        if (!currentImageResult) {
            showToast('No result to copy', 'error');
            return;
        }
        
        // If it's a data URL, extract the Base64 part
        let textToCopy = currentImageResult;
        
        if (currentImageResult.startsWith('data:')) {
            textToCopy = currentImageResult.split(',')[1];
        }
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showToast('Base64 data copied to clipboard', 'success');
            })
            .catch(err => {
                console.error('Error copying to clipboard:', err);
                showToast('Failed to copy to clipboard', 'error');
            });
    }
    
    function downloadImageResult() {
        if (!currentImageResult) {
            showToast('No result to download', 'error');
            return;
        }
        
        if (encodeImage.checked) {
            // Download as text file
            const base64Data = currentImageResult.split(',')[1];
            const blob = new Blob([base64Data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `base64-image-${Date.now()}.txt`;
            link.click();
            
            // Clean up
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
        } else {
            // Download as image
            const extension = getExtensionFromMimeType(currentImageType || 'image/png');
            const url = currentImageResult;
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `decoded-image-${Date.now()}.${extension}`;
            link.click();
        }
        
        showToast('Result downloaded successfully', 'success');
    }
    
    // Utility Functions
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    function isValidBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (err) {
            return false;
        }
    }
    
    function getExtensionFromMimeType(mimeType) {
        const mimeToExt = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/svg+xml': 'svg',
            'image/webp': 'webp',
            'image/bmp': 'bmp',
            'image/tiff': 'tiff'
        };
        
        return mimeToExt[mimeType] || 'png';
    }
    
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