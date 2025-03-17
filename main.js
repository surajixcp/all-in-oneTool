// Main JavaScript File

// Tool Categories and Tools Data
const toolCategories = {
    'image-tools': {
        name: 'Image Tools',
        icon: 'fa-image',
        tools: [
            {
                name: 'Image to PNG',
                url: 'tools/image-tools/image-to-png.html',
                icon: 'fa-file-image',
                description: 'Convert images to PNG format with customizable quality settings.'
            },
            {
                name: 'Image to JPG',
                url: 'tools/image-tools/image-to-jpg.html',
                icon: 'fa-file-image',
                description: 'Convert images to JPG format with quality control options.'
            },
            {
                name: 'Image Resizer',
                url: 'tools/image-tools/image-resizer.html',
                icon: 'fa-expand-arrows-alt',
                description: 'Resize images to specific dimensions while maintaining aspect ratio.'
            },
            {
                name: 'Image Compressor',
                url: 'tools/image-tools/image-compressor.html',
                icon: 'fa-compress-arrows-alt',
                description: 'Compress images to reduce file size without significant quality loss.'
            }
        ]
    },
    'seo-tools': {
        name: 'SEO Tools',
        icon: 'fa-search',
        tools: [
            {
                name: 'Meta Tag Generator',
                url: 'tools/seo-tools/meta-tag-generator.html',
                icon: 'fa-tags',
                description: 'Generate optimized meta tags for better SEO and social media sharing.'
            },
            {
                name: 'Keyword Density Checker',
                url: 'tools/seo-tools/keyword-density-checker.html',
                icon: 'fa-chart-bar',
                description: 'Analyze keyword density in your content for better SEO optimization.'
            },
            {
                name: 'Sitemap Generator',
                url: 'tools/seo-tools/sitemap-generator.html',
                icon: 'fa-sitemap',
                description: 'Generate XML sitemaps for better search engine indexing.'
            }
        ]
    },
    'text-tools': {
        name: 'Text Tools',
        icon: 'fa-font',
        tools: [
            {
                name: 'Word Counter',
                url: 'tools/text-tools/word-counter.html',
                icon: 'fa-calculator',
                description: 'Count words, characters, sentences, and paragraphs in your text.'
            },
            {
                name: 'Text Converter',
                url: 'tools/text-tools/text-converter.html',
                icon: 'fa-exchange-alt',
                description: 'Convert text between different formats and styles.'
            },
            {
                name: 'Grammar Checker',
                url: 'tools/text-tools/grammar-checker.html',
                icon: 'fa-check-circle',
                description: 'Check grammar and spelling in your text content.'
            }
        ]
    },
    'dev-tools': {
        name: 'Developer Tools',
        icon: 'fa-code',
        tools: [
            {
                name: 'JSON Formatter',
                url: 'tools/dev-tools/json-formatter.html',
                icon: 'fa-brackets-curly',
                description: 'Format and validate JSON data with syntax highlighting.'
            },
            {
                name: 'HTML Formatter',
                url: 'tools/dev-tools/html-formatter.html',
                icon: 'fa-code',
                description: 'Format and beautify HTML code with proper indentation.'
            },
            {
                name: 'CSS Minifier',
                url: 'tools/dev-tools/css-minifier.html',
                icon: 'fa-file-code',
                description: 'Minify CSS code to reduce file size and improve load times.'
            },
            {
                name: 'JavaScript Minifier',
                url: 'tools/dev-tools/js-minifier.html',
                icon: 'fa-js',
                description: 'Minify JavaScript code to reduce file size and improve performance.'
            },
            {
                name: 'Code Diff Checker',
                url: 'tools/dev-tools/code-diff.html',
                icon: 'fa-code-compare',
                description: 'Compare two code snippets and highlight the differences.'
            },
            {
                name: 'Lorem Ipsum Generator',
                url: 'tools/dev-tools/lorem-ipsum.html',
                icon: 'fa-text-width',
                description: 'Generate placeholder text for design mockups and layouts.'
            },
            {
                name: 'Color Picker',
                url: 'tools/dev-tools/color-picker.html',
                icon: 'fa-palette',
                description: 'Select and convert colors between different formats (HEX, RGB, HSL).'
            },
            {
                name: 'QR Code Generator',
                url: 'tools/dev-tools/qr-code-generator.html',
                icon: 'fa-qrcode',
                description: 'Generate QR codes for URLs, text, contact information, and more.'
            },
            {
                name: 'URL QR Code Generator',
                url: 'tools/dev-tools/url-qr-generator.html',
                icon: 'fa-link',
                description: 'Quickly generate QR codes for URLs and websites.'
            },
            {
                name: 'Base64 Encoder/Decoder',
                url: 'tools/dev-tools/base64.html',
                icon: 'fa-exchange-alt',
                description: 'Encode or decode text and files to/from Base64 format.'
            }
        ]
    }
};

// Initialize header functionality
function initializeHeader() {
    // Load header and footer
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer').innerHTML = html;
        });

    // Initialize search functionality
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchForm && searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            const results = [];
            // Search through all tools
            Object.values(toolCategories).forEach(category => {
                category.tools.forEach(tool => {
                    if (tool.name.toLowerCase().includes(query) || 
                        tool.description.toLowerCase().includes(query)) {
                        results.push({
                            name: tool.name,
                            url: tool.url,
                            icon: tool.icon,
                            category: category.name
                        });
                    }
                });
            });

            // Display results
            if (results.length > 0) {
                searchResults.querySelector('.list-group').innerHTML = results.map(result => `
                    <a href="${result.url}" class="list-group-item list-group-item-action">
                        <i class="fas ${result.icon} me-2"></i>${result.name}
                        <small class="text-muted d-block">${result.category}</small>
                    </a>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Initialize mobile menu
function initializeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarContent = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarContent) {
        navbarToggler.addEventListener('click', function() {
            navbarContent.classList.toggle('show');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarContent.contains(e.target) && !navbarToggler.contains(e.target)) {
                navbarContent.classList.remove('show');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeMobileMenu();
});

// Generate Tool Cards
function generateToolCards() {
    const toolCardsContainer = document.getElementById('toolCards');
    if (!toolCardsContainer) return;

    Object.entries(toolCategories).forEach(([categoryId, category]) => {
        const categoryHTML = `
            <div class="col-12 mb-4">
                <h2 class="mb-3">
                    <i class="fas ${category.icon} me-2"></i>${category.name}
                </h2>
                <div class="row">
                    ${category.tools.map(tool => `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <i class="fas ${tool.icon} me-2"></i>${tool.name}
                                    </h5>
                                    <p class="card-text">${tool.description}</p>
                                    <a href="${tool.url}" class="btn btn-primary">
                                        <i class="fas fa-play me-2"></i>Use Tool
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        toolCardsContainer.innerHTML += categoryHTML;
    });
}

// Initialize tool cards on homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    generateToolCards();
}

// Utility Functions
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="spinner"></div>';
    }
}

function hideLoading(element, content) {
    if (element) {
        element.innerHTML = content;
    }
}

// Error Handler
function handleError(error, element) {
    console.error(error);
    if (element) {
        element.innerHTML = '<div class="alert alert-danger">An error occurred. Please try again.</div>';
    }
} 