// HTML Formatter Tool

document.addEventListener('DOMContentLoaded', function() {
    // Initialize highlight.js
    hljs.highlightAll();

    // DOM Elements
    const htmlInput = document.getElementById('htmlInput');
    const htmlOutput = document.getElementById('htmlOutput');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const indentSize = document.getElementById('indentSize');
    const themeSelect = document.getElementById('themeSelect');
    const wrapLineLength = document.getElementById('wrapLineLength');
    const preserveNewlines = document.getElementById('preserveNewlines');
    const unformatted = document.getElementById('unformatted');

    // Format HTML
    formatBtn.addEventListener('click', formatHTML);
    
    // Clear input
    clearBtn.addEventListener('click', function() {
        htmlInput.value = '';
        htmlOutput.innerHTML = '<pre><code class="language-html"><!-- Formatted HTML will appear here --></code></pre>';
        hljs.highlightAll();
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const formattedHTML = htmlOutput.textContent;
        navigator.clipboard.writeText(formattedHTML).then(function() {
            showToast('HTML copied to clipboard!');
            
            // Visual feedback
            copyBtn.classList.add('copy-success');
            setTimeout(() => {
                copyBtn.classList.remove('copy-success');
            }, 1000);
        });
    });
    
    // Download HTML
    downloadBtn.addEventListener('click', function() {
        const formattedHTML = htmlOutput.textContent;
        const blob = new Blob([formattedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted-html.html';
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
        if (htmlOutput.querySelector('code').textContent !== '<!-- Formatted HTML will appear here -->') {
            formatHTML();
        }
    });
    
    // Format HTML function
    function formatHTML() {
        const input = htmlInput.value.trim();
        
        if (!input) {
            showError('Please enter HTML code');
            return;
        }
        
        try {
            // Get options
            let indent = indentSize.value;
            if (indent === 'tab') {
                indent = '\t';
            }
            
            const options = {
                indent_size: indent === '\t' ? 1 : parseInt(indent),
                indent_char: indent === '\t' ? '\t' : ' ',
                max_preserve_newlines: preserveNewlines.checked ? 2 : 0,
                preserve_newlines: preserveNewlines.checked,
                wrap_line_length: parseInt(wrapLineLength.value),
                unformatted: unformatted.checked ? ['a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u', 'strike', 'big', 'small', 'pre'] : []
            };
            
            // Format HTML using js-beautify
            const formattedHTML = html_beautify(input, options);
            
            // Display formatted HTML with syntax highlighting
            htmlOutput.innerHTML = `<pre><code class="language-html">${escapeHTML(formattedHTML)}</code></pre>`;
            hljs.highlightAll();
            
            // Show success message
            showSuccess('HTML formatted successfully!');
        } catch (error) {
            showError(`Error formatting HTML: ${error.message}`);
            htmlOutput.innerHTML = `<pre><code class="language-html"><!-- Error: ${escapeHTML(error.message)} --></code></pre>`;
            hljs.highlightAll();
        }
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