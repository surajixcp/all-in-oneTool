document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sitemapForm');
    const results = document.getElementById('results');
    const sitemapOutput = document.getElementById('sitemapOutput');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateSitemap();
    });

    // Handle copy button click
    copyButton.addEventListener('click', function() {
        copyToClipboard(sitemapOutput.textContent);
    });

    // Handle download button click
    downloadButton.addEventListener('click', function() {
        downloadSitemap(sitemapOutput.textContent);
    });

    // Generate sitemap
    function generateSitemap() {
        const baseUrl = document.getElementById('baseUrl').value;
        const urls = document.getElementById('urls').value.split('\n').filter(url => url.trim());
        const changefreq = document.getElementById('changefreq').value;
        const priority = document.getElementById('priority').value;

        // Create XML sitemap
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        urls.forEach(url => {
            // Ensure URL is absolute
            const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
            
            sitemap += '  <url>\n';
            sitemap += `    <loc>${absoluteUrl}</loc>\n`;
            sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
            sitemap += `    <priority>${priority}</priority>\n`;
            sitemap += '  </url>\n';
        });

        sitemap += '</urlset>';

        // Display results
        sitemapOutput.textContent = sitemap;
        results.classList.remove('d-none');
    }

    // Copy to clipboard function
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show success message
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(function() {
                copyButton.innerHTML = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text to clipboard');
        });
    }

    // Download sitemap function
    function downloadSitemap(content) {
        const blob = new Blob([content], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}); 