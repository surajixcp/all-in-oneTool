// Lorem Ipsum Generator Tool

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loremForm = document.getElementById('loremForm');
    const typeSelect = document.getElementById('type');
    const amountInput = document.getElementById('amount');
    const startWithLoremCheckbox = document.getElementById('startWithLorem');
    const formatSelect = document.getElementById('format');
    const htmlOptionsContainer = document.getElementById('htmlOptionsContainer');
    const output = document.getElementById('output');
    const copyBtn = document.getElementById('copyBtn');
    
    // Lorem Ipsum text database
    const loremIpsumText = {
        standard: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        words: [
            "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", 
            "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", 
            "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", 
            "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
            "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", 
            "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", 
            "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde", "omnis", "iste", 
            "natus", "error", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", 
            "quae", "ab", "illo", "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", 
            "explicabo", "nemo", "ipsam", "voluptatem", "quia", "voluptas", "aspernatur", "aut", "odit", "fugit", 
            "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt", "neque", "porro", "quisquam"
        ]
    };
    
    // Show/hide HTML options based on format selection
    formatSelect.addEventListener('change', function() {
        htmlOptionsContainer.style.display = this.value === 'html' ? 'block' : 'none';
    });
    
    // Generate Lorem Ipsum text
    loremForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateLoremIpsum();
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        // Create a temporary textarea to copy the text
        const textarea = document.createElement('textarea');
        
        // If format is HTML, get the innerHTML, otherwise get the textContent
        textarea.value = formatSelect.value === 'html' ? output.innerHTML : output.textContent;
        
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show success message
        showToast('Text copied to clipboard!');
        
        // Visual feedback
        copyBtn.classList.add('copy-success');
        setTimeout(() => {
            copyBtn.classList.remove('copy-success');
        }, 1000);
    });
    
    // Generate Lorem Ipsum text
    function generateLoremIpsum() {
        const type = typeSelect.value;
        const amount = parseInt(amountInput.value);
        const startWithLorem = startWithLoremCheckbox.checked;
        const format = formatSelect.value;
        const htmlTag = document.querySelector('input[name="htmlTag"]:checked')?.value || 'p';
        
        if (amount < 1 || amount > 100) {
            showError('Amount must be between 1 and 100');
            return;
        }
        
        let result = '';
        
        switch (type) {
            case 'paragraphs':
                result = generateParagraphs(amount, startWithLorem);
                break;
            case 'sentences':
                result = generateSentences(amount, startWithLorem);
                break;
            case 'words':
                result = generateWords(amount, startWithLorem);
                break;
        }
        
        // Format the result
        if (format === 'html') {
            result = formatAsHTML(result, type, htmlTag);
        }
        
        // Display the result
        output.innerHTML = result;
    }
    
    // Generate paragraphs
    function generateParagraphs(count, startWithLorem) {
        const paragraphs = [];
        
        for (let i = 0; i < count; i++) {
            if (i === 0 && startWithLorem) {
                paragraphs.push(loremIpsumText.standard);
            } else {
                paragraphs.push(generateRandomParagraph());
            }
        }
        
        return paragraphs.join('\n\n');
    }
    
    // Generate sentences
    function generateSentences(count, startWithLorem) {
        const sentences = [];
        const standardSentences = loremIpsumText.standard.split('. ');
        
        for (let i = 0; i < count; i++) {
            if (i === 0 && startWithLorem) {
                sentences.push(standardSentences[0]);
            } else {
                sentences.push(generateRandomSentence());
            }
        }
        
        return sentences.join('. ') + '.';
    }
    
    // Generate words
    function generateWords(count, startWithLorem) {
        let words = [];
        
        if (startWithLorem) {
            const loremWords = loremIpsumText.standard.split(' ');
            const loremCount = Math.min(count, loremWords.length);
            words = loremWords.slice(0, loremCount);
            count -= loremCount;
        }
        
        while (count > 0) {
            const randomIndex = Math.floor(Math.random() * loremIpsumText.words.length);
            words.push(loremIpsumText.words[randomIndex]);
            count--;
        }
        
        return words.join(' ');
    }
    
    // Generate a random paragraph
    function generateRandomParagraph() {
        const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7 sentences
        const sentences = [];
        
        for (let i = 0; i < sentenceCount; i++) {
            sentences.push(generateRandomSentence());
        }
        
        return sentences.join('. ') + '.';
    }
    
    // Generate a random sentence
    function generateRandomSentence() {
        const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words
        const words = [];
        
        for (let i = 0; i < wordCount; i++) {
            const randomIndex = Math.floor(Math.random() * loremIpsumText.words.length);
            let word = loremIpsumText.words[randomIndex];
            
            // Capitalize the first word
            if (i === 0) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            
            words.push(word);
        }
        
        return words.join(' ');
    }
    
    // Format text as HTML
    function formatAsHTML(text, type, tag) {
        switch (type) {
            case 'paragraphs':
                if (tag === 'li') {
                    return '<ul>\n' + text.split('\n\n').map(p => `  <li>${p}</li>`).join('\n') + '\n</ul>';
                } else {
                    return text.split('\n\n').map(p => `<${tag}>${p}</${tag}>`).join('\n');
                }
            case 'sentences':
                if (tag === 'li') {
                    return '<ul>\n' + text.split('. ').filter(s => s.trim()).map(s => `  <li>${s}.</li>`).join('\n') + '\n</ul>';
                } else {
                    return `<${tag}>${text}</${tag}>`;
                }
            case 'words':
                if (tag === 'li') {
                    return '<ul>\n' + text.split(' ').map(w => `  <li>${w}</li>`).join('\n') + '\n</ul>';
                } else {
                    return `<${tag}>${text}</${tag}>`;
                }
        }
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
    
    // Generate initial Lorem Ipsum
    generateLoremIpsum();
}); 