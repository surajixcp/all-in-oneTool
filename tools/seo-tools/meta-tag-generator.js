document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('metaTagForm');
    const results = document.getElementById('results');
    const metaTagsOutput = document.getElementById('metaTagsOutput');
    const copyButton = document.getElementById('copyButton');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateMetaTags();
    });

    // Handle copy button click
    copyButton.addEventListener('click', function() {
        copyToClipboard(metaTagsOutput.textContent);
    });

    // Generate meta tags
    function generateMetaTags() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const keywords = document.getElementById('keywords').value;
        const ogTitle = document.getElementById('ogTitle').value || title;
        const ogDescription = document.getElementById('ogDescription').value || description;
        const ogImage = document.getElementById('ogImage').value;
        const ogUrl = document.getElementById('ogUrl').value;
        const twitterCard = document.getElementById('twitterCard').value;
        const twitterTitle = document.getElementById('twitterTitle').value || title;
        const twitterDescription = document.getElementById('twitterDescription').value || description;
        const twitterImage = document.getElementById('twitterImage').value || ogImage;

        let metaTags = '<!-- Basic Meta Tags -->\n';
        metaTags += `<title>${title}</title>\n`;
        metaTags += `<meta name="description" content="${description}">\n`;
        if (keywords) {
            metaTags += `<meta name="keywords" content="${keywords}">\n`;
        }

        // Open Graph Tags
        metaTags += '\n<!-- Open Graph Tags -->\n';
        metaTags += `<meta property="og:title" content="${ogTitle}">\n`;
        metaTags += `<meta property="og:description" content="${ogDescription}">\n`;
        if (ogImage) {
            metaTags += `<meta property="og:image" content="${ogImage}">\n`;
        }
        if (ogUrl) {
            metaTags += `<meta property="og:url" content="${ogUrl}">\n`;
        }
        metaTags += '<meta property="og:type" content="website">\n';

        // Twitter Card Tags
        metaTags += '\n<!-- Twitter Card Tags -->\n';
        metaTags += `<meta name="twitter:card" content="${twitterCard}">\n`;
        metaTags += `<meta name="twitter:title" content="${twitterTitle}">\n`;
        metaTags += `<meta name="twitter:description" content="${twitterDescription}">\n`;
        if (twitterImage) {
            metaTags += `<meta name="twitter:image" content="${twitterImage}">\n`;
        }

        // Display results
        metaTagsOutput.textContent = metaTags;
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
}); 