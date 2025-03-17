// JSON Formatter Tool

document.addEventListener('DOMContentLoaded', function() {
    // Initialize highlight.js
    hljs.highlightAll();

    // DOM Elements
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const indentSize = document.getElementById('indentSize');
    const themeSelect = document.getElementById('themeSelect');
    const sortKeys = document.getElementById('sortKeys');

    // Format JSON
    formatBtn.addEventListener('click', formatJSON);
    
    // Clear input
    clearBtn.addEventListener('click', function() {
        jsonInput.value = '';
        jsonOutput.innerHTML = '<pre><code class="language-json">// Formatted JSON will appear here</code></pre>';
        hljs.highlightAll();
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const formattedJSON = jsonOutput.textContent;
        navigator.clipboard.writeText(formattedJSON).then(function() {
            showToast('JSON copied to clipboard!');
            
            // Visual feedback
            copyBtn.classList.add('copy-success');
            setTimeout(() => {
                copyBtn.classList.remove('copy-success');
            }, 1000);
        });
    });
    
    // Download JSON
    downloadBtn.addEventListener('click', function() {
        const formattedJSON = jsonOutput.textContent;
        const blob = new Blob([formattedJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-json.json';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    });
    
    // Change theme
    themeSelect.addEventListener('change', function() {
        const theme = this.value;
        const link = document.querySelector('link[href*="highlight.js"]');
        link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${theme}.min.css`;
        
        // Re-highlight
        if (jsonOutput.querySelector('code').textContent !== '// Formatted JSON will appear here') {
            formatJSON();
        }
    });
    
    // Format JSON function
    function formatJSON() {
        const input = jsonInput.value.trim();
        
        if (!input) {
            showError('Please enter JSON data');
            return;
        }
        
        try {
            // Parse JSON to validate it
            let parsedJSON = JSON.parse(input);
            
            // Sort keys if option is selected
            if (sortKeys.checked) {
                parsedJSON = sortObjectKeys(parsedJSON);
            }
            
            // Format with selected indent
            let indent = Number(indentSize.value);
            if (indentSize.value === 'tab') {
                indent = '\t';
            }
            
            // Convert back to string with formatting
            const formattedJSON = JSON.stringify(parsedJSON, null, indent);
            
            // Display formatted JSON with syntax highlighting
            jsonOutput.innerHTML = `<pre><code class="language-json">${escapeHTML(formattedJSON)}</code></pre>`;
            hljs.highlightAll();
            
            // Show success message
            showSuccess('JSON formatted successfully!');
        } catch (error) {
            showError(`Invalid JSON: ${error.message}`);
            jsonOutput.innerHTML = `<pre><code class="language-json">// Error: ${escapeHTML(error.message)}</code></pre>`;
            hljs.highlightAll();
        }
    }
    
    // Sort object keys recursively
    function sortObjectKeys(obj) {
        // If not an object or is null, return as is
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        
        // Handle arrays
        if (Array.isArray(obj)) {
            return obj.map(sortObjectKeys);
        }
        
        // Sort object keys
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
                result[key] = sortObjectKeys(obj[key]);
                return result;
            }, {});
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