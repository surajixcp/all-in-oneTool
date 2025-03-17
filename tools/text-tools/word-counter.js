// Word Counter Tool Configuration
const toolConfig = {
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in your text',
    category: 'text-tools'
};

// Initialize tool
document.addEventListener('DOMContentLoaded', function() {
    // Update page title and description
    document.title = `${toolConfig.name} - All-in-One Tools`;
    document.querySelector('meta[name="description"]').content = toolConfig.description;
    
    // Update tool header
    document.querySelector('.tool-header h1').textContent = toolConfig.name;
    document.querySelector('.tool-header .lead').textContent = toolConfig.description;
    
    // Initialize form
    initializeForm();
    
    // Add real-time counting
    const textarea = document.getElementById('text');
    if (textarea) {
        textarea.addEventListener('input', handleRealTimeCount);
    }
});

// Initialize form and event listeners
function initializeForm() {
    const form = document.getElementById('toolForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const text = document.getElementById('text').value;
    const countSpaces = document.getElementById('countSpaces').checked;
    const countPunctuation = document.getElementById('countPunctuation').checked;
    
    const result = countText(text, countSpaces, countPunctuation);
    displayResults(result);
}

// Handle real-time counting
function handleRealTimeCount(event) {
    const text = event.target.value;
    const countSpaces = document.getElementById('countSpaces').checked;
    const countPunctuation = document.getElementById('countPunctuation').checked;
    
    const result = countText(text, countSpaces, countPunctuation);
    displayResults(result);
}

// Count text statistics
function countText(text, countSpaces, countPunctuation) {
    // Remove extra whitespace
    const trimmedText = text.trim();
    
    // Count characters
    let charCount = 0;
    if (countSpaces && countPunctuation) {
        charCount = text.length;
    } else {
        charCount = text.replace(/[\s\p{P}]/gu, '').length;
    }
    
    // Count words
    const wordCount = trimmedText ? trimmedText.split(/\s+/).length : 0;
    
    // Count sentences (basic implementation)
    const sentenceCount = trimmedText ? (trimmedText.match(/[.!?]+/g) || []).length : 0;
    
    // Count paragraphs
    const paragraphCount = trimmedText ? trimmedText.split(/\n\s*\n/).length : 0;
    
    // Calculate reading time (assuming 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    return {
        charCount,
        wordCount,
        sentenceCount,
        paragraphCount,
        readingTime,
        timestamp: new Date().toISOString()
    };
}

// Display results
function displayResults(result) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title">Characters</h6>
                        <p class="card-text display-6">${result.charCount}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title">Words</h6>
                        <p class="card-text display-6">${result.wordCount}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title">Sentences</h6>
                        <p class="card-text display-6">${result.sentenceCount}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title">Paragraphs</h6>
                        <p class="card-text display-6">${result.paragraphCount}</p>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="card-title">Estimated Reading Time</h6>
                        <p class="card-text display-6">${result.readingTime} minute${result.readingTime !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>
        </div>
        <small class="text-muted d-block mt-3">Last updated: ${new Date(result.timestamp).toLocaleString()}</small>
    `;
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

function handleError(error, element) {
    console.error(error);
    if (element) {
        element.innerHTML = `
            <div class="alert alert-danger">
                <h6>Error:</h6>
                <p>An error occurred while processing your text. Please try again.</p>
            </div>
        `;
    }
} 