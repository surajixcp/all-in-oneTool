document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keywordDensityForm');
    const results = document.getElementById('results');
    const keywordTable = document.getElementById('keywordTable');
    const totalWordsSpan = document.getElementById('totalWords');
    const uniqueWordsSpan = document.getElementById('uniqueWords');
    const avgWordLengthSpan = document.getElementById('avgWordLength');
    const topKeywordSpan = document.getElementById('topKeyword');
    const topFrequencySpan = document.getElementById('topFrequency');
    const topDensitySpan = document.getElementById('topDensity');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeKeywords();
    });

    // Analyze keywords
    function analyzeKeywords() {
        const text = document.getElementById('text').value;
        const minWordLength = parseInt(document.getElementById('minWordLength').value);
        const minFrequency = parseInt(document.getElementById('minFrequency').value);

        // Clean and tokenize text
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length >= minWordLength);

        // Count word frequencies
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        // Calculate statistics
        const totalWords = words.length;
        const uniqueWords = Object.keys(wordFreq).length;
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / totalWords;

        // Sort keywords by frequency
        const sortedKeywords = Object.entries(wordFreq)
            .filter(([_, freq]) => freq >= minFrequency)
            .sort((a, b) => b[1] - a[1]);

        // Update statistics display
        totalWordsSpan.textContent = totalWords;
        uniqueWordsSpan.textContent = uniqueWords;
        avgWordLengthSpan.textContent = avgWordLength.toFixed(1);

        // Update top keyword display
        if (sortedKeywords.length > 0) {
            const [topWord, topFreq] = sortedKeywords[0];
            const topDensity = (topFreq / totalWords * 100).toFixed(2);
            topKeywordSpan.textContent = topWord;
            topFrequencySpan.textContent = topFreq;
            topDensitySpan.textContent = topDensity + '%';
        } else {
            topKeywordSpan.textContent = '-';
            topFrequencySpan.textContent = '0';
            topDensitySpan.textContent = '0%';
        }

        // Update keyword table
        keywordTable.innerHTML = '';
        sortedKeywords.forEach(([word, freq]) => {
            const density = (freq / totalWords * 100).toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${word}</td>
                <td>${freq}</td>
                <td>${density}%</td>
            `;
            keywordTable.appendChild(row);
        });

        // Show results
        results.classList.remove('d-none');
    }
}); 