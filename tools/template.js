// Tool-specific JavaScript Template

// Tool Configuration
const toolConfig = {
    name: 'Tool Name',
    description: 'Tool description and main functionality',
    category: 'category-name'
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
    
    // Show loading state
    showLoading(document.getElementById('results'));
    
    // Get form data
    const input = document.getElementById('input').value;
    
    // Process input
    processInput(input)
        .then(result => {
            // Display results
            displayResults(result);
        })
        .catch(error => {
            // Handle errors
            handleError(error, document.getElementById('results'));
        });
}

// Process input
async function processInput(input) {
    // Tool-specific processing logic will go here
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                processed: input,
                timestamp: new Date().toISOString()
            });
        }, 500);
    });
}

// Display results
function displayResults(result) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
    
    // Tool-specific results display logic will go here
    resultsContainer.innerHTML = `
        <div class="alert alert-success">
            <h6>Processed Result:</h6>
            <p>${result.processed}</p>
            <small class="text-muted">Processed at: ${result.timestamp}</small>
        </div>
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
                <p>An error occurred while processing your request. Please try again.</p>
            </div>
        `;
    }
} 