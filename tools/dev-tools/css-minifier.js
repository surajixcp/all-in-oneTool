// CSS Minifier Tool

document.addEventListener('DOMContentLoaded', function() {
    // Initialize highlight.js
    hljs.highlightAll();

    // DOM Elements
    const cssInput = document.getElementById('cssInput');
    const cssOutput = document.getElementById('cssOutput');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const removeComments = document.getElementById('removeComments');
    const optimizeSelectors = document.getElementById('optimizeSelectors');
    const mergeMedia = document.getElementById('mergeMedia');
    const originalSizeEl = document.getElementById('originalSize');
    const minifiedSizeEl = document.getElementById('minifiedSize');
    const reductionEl = document.getElementById('reduction');

    // Minify CSS
    minifyBtn.addEventListener('click', minifyCSS);
    
    // Clear input
    clearBtn.addEventListener('click', function() {
        cssInput.value = '';
        cssOutput.innerHTML = '<pre><code class="language-css">/* Minified CSS will appear here */</code></pre>';
        hljs.highlightAll();
        updateStats(0, 0);
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const minifiedCSS = cssOutput.textContent;
        navigator.clipboard.writeText(minifiedCSS).then(function() {
            showToast('CSS copied to clipboard!');
            
            // Visual feedback
            copyBtn.classList.add('copy-success');
            setTimeout(() => {
                copyBtn.classList.remove('copy-success');
            }, 1000);
        });
    });
    
    // Download CSS
    downloadBtn.addEventListener('click', function() {
        const minifiedCSS = cssOutput.textContent;
        const blob = new Blob([minifiedCSS], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minified.css';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    });
    
    // Minify CSS function
    function minifyCSS() {
        const input = cssInput.value.trim();
        
        if (!input) {
            showError('Please enter CSS code');
            return;
        }
        
        try {
            // Get options
            const options = {
                level: {
                    1: {
                        all: true,
                        removeComments: removeComments.checked,
                        removeWhitespace: true
                    },
                    2: {
                        all: optimizeSelectors.checked,
                        mergeMedia: mergeMedia.checked,
                        restructureRules: optimizeSelectors.checked,
                        mergeSemantically: optimizeSelectors.checked,
                        mergeIntoShorthands: optimizeSelectors.checked
                    }
                }
            };
            
            // Create a new CleanCSS instance
            const cleanCSS = new CleanCSS(options);
            
            // Minify the CSS
            const minified = cleanCSS.minify(input);
            
            if (minified.errors && minified.errors.length) {
                throw new Error(minified.errors.join(', '));
            }
            
            // Display minified CSS with syntax highlighting
            cssOutput.innerHTML = `<pre><code class="language-css">${escapeHTML(minified.styles)}</code></pre>`;
            hljs.highlightAll();
            
            // Update stats
            const originalSize = new Blob([input]).size;
            const minifiedSize = new Blob([minified.styles]).size;
            updateStats(originalSize, minifiedSize);
            
            // Show success message
            showSuccess('CSS minified successfully!');
        } catch (error) {
            showError(`Error minifying CSS: ${error.message}`);
            cssOutput.innerHTML = `<pre><code class="language-css">/* Error: ${escapeHTML(error.message)} */</code></pre>`;
            hljs.highlightAll();
        }
    }
    
    // Update stats
    function updateStats(originalSize, minifiedSize) {
        originalSizeEl.textContent = formatBytes(originalSize);
        minifiedSizeEl.textContent = formatBytes(minifiedSize);
        
        let reduction = 0;
        if (originalSize > 0) {
            reduction = Math.round((1 - (minifiedSize / originalSize)) * 100);
        }
        
        reductionEl.textContent = reduction;
    }
    
    // Format bytes to human-readable format
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    // Escape HTML to prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Show success message
    function showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
    
    // Show error message
    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    // Show toast message
    function showToast(message) {
        const toastDiv = document.createElement('div');
        toastDiv.className = 'toast align-items-center text-white bg-primary border-0 position-fixed bottom-0 end-0 m-3';
        toastDiv.setAttribute('role', 'alert');
        toastDiv.setAttribute('aria-live', 'assertive');
        toastDiv.setAttribute('aria-atomic', 'true');
        toastDiv.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-info-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        document.body.appendChild(toastDiv);
        
        // Show toast
        const toast = new bootstrap.Toast(toastDiv, { delay: 3000 });
        toast.show();
        
        // Remove from DOM after hiding
        toastDiv.addEventListener('hidden.bs.toast', function() {
            toastDiv.remove();
        });
    }
}); 