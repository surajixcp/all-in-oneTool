document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const colorInput = document.getElementById('colorInput');
    const colorPreview = document.getElementById('colorPreview');
    const colorTextInput = document.getElementById('colorTextInput');
    const applyColorBtn = document.getElementById('applyColorBtn');
    
    // RGB Sliders
    const redRange = document.getElementById('redRange');
    const greenRange = document.getElementById('greenRange');
    const blueRange = document.getElementById('blueRange');
    const redValue = document.getElementById('redValue');
    const greenValue = document.getElementById('greenValue');
    const blueValue = document.getElementById('blueValue');
    
    // HSL Sliders
    const hueRange = document.getElementById('hueRange');
    const saturationRange = document.getElementById('saturationRange');
    const lightnessRange = document.getElementById('lightnessRange');
    const hueValue = document.getElementById('hueValue');
    const saturationValue = document.getElementById('saturationValue');
    const lightnessValue = document.getElementById('lightnessValue');
    
    // Color Values
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const rgbaValue = document.getElementById('rgbaValue');
    const hslaValue = document.getElementById('hslaValue');
    
    // Color Scheme
    const schemeSelect = document.getElementById('schemeSelect');
    const colorScheme = document.getElementById('colorScheme');
    
    // Initialize
    updateColorPreview(colorInput.value);
    
    // Event Listeners
    colorInput.addEventListener('input', function() {
        updateColorPreview(this.value);
    });
    
    // RGB Sliders
    redRange.addEventListener('input', function() {
        redValue.textContent = this.value;
        updateFromRGB();
    });
    
    greenRange.addEventListener('input', function() {
        greenValue.textContent = this.value;
        updateFromRGB();
    });
    
    blueRange.addEventListener('input', function() {
        blueValue.textContent = this.value;
        updateFromRGB();
    });
    
    // HSL Sliders
    hueRange.addEventListener('input', function() {
        hueValue.textContent = this.value;
        updateFromHSL();
    });
    
    saturationRange.addEventListener('input', function() {
        saturationValue.textContent = this.value;
        updateFromHSL();
    });
    
    lightnessRange.addEventListener('input', function() {
        lightnessValue.textContent = this.value;
        updateFromHSL();
    });
    
    // Apply color from text input
    applyColorBtn.addEventListener('click', function() {
        applyColorFromText();
    });
    
    colorTextInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            applyColorFromText();
        }
    });
    
    // Color scheme change
    schemeSelect.addEventListener('change', function() {
        generateColorScheme();
    });
    
    // Click to copy color values
    document.querySelectorAll('.color-value').forEach(el => {
        el.addEventListener('click', function() {
            copyToClipboard(this.textContent, this);
        });
    });
    
    // Functions
    function updateColorPreview(color) {
        // Update color preview
        colorPreview.style.backgroundColor = color;
        
        // Parse color to get RGB and HSL values
        const rgb = hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Update RGB sliders
        redRange.value = rgb.r;
        greenRange.value = rgb.g;
        blueRange.value = rgb.b;
        redValue.textContent = rgb.r;
        greenValue.textContent = rgb.g;
        blueValue.textContent = rgb.b;
        
        // Update HSL sliders
        hueRange.value = Math.round(hsl.h);
        saturationRange.value = Math.round(hsl.s * 100);
        lightnessRange.value = Math.round(hsl.l * 100);
        hueValue.textContent = Math.round(hsl.h);
        saturationValue.textContent = Math.round(hsl.s * 100);
        lightnessValue.textContent = Math.round(hsl.l * 100);
        
        // Update color values
        updateColorValues(rgb, hsl);
        
        // Generate color scheme
        generateColorScheme();
    }
    
    function updateFromRGB() {
        const r = parseInt(redRange.value);
        const g = parseInt(greenRange.value);
        const b = parseInt(blueRange.value);
        
        const hex = rgbToHex(r, g, b);
        colorInput.value = hex;
        colorPreview.style.backgroundColor = hex;
        
        const hsl = rgbToHsl(r, g, b);
        
        // Update HSL sliders without triggering events
        hueRange.value = Math.round(hsl.h);
        saturationRange.value = Math.round(hsl.s * 100);
        lightnessRange.value = Math.round(hsl.l * 100);
        hueValue.textContent = Math.round(hsl.h);
        saturationValue.textContent = Math.round(hsl.s * 100);
        lightnessValue.textContent = Math.round(hsl.l * 100);
        
        // Update color values
        updateColorValues({r, g, b}, hsl);
        
        // Generate color scheme
        generateColorScheme();
    }
    
    function updateFromHSL() {
        const h = parseInt(hueRange.value);
        const s = parseInt(saturationRange.value) / 100;
        const l = parseInt(lightnessRange.value) / 100;
        
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        colorInput.value = hex;
        colorPreview.style.backgroundColor = hex;
        
        // Update RGB sliders without triggering events
        redRange.value = rgb.r;
        greenRange.value = rgb.g;
        blueRange.value = rgb.b;
        redValue.textContent = rgb.r;
        greenValue.textContent = rgb.g;
        blueValue.textContent = rgb.b;
        
        // Update color values
        updateColorValues(rgb, {h, s, l});
        
        // Generate color scheme
        generateColorScheme();
    }
    
    function updateColorValues(rgb, hsl) {
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        hexValue.textContent = hex;
        rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
        rgbaValue.textContent = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        hslaValue.textContent = `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, 1)`;
    }
    
    function applyColorFromText() {
        const colorText = colorTextInput.value.trim();
        
        if (!colorText) {
            showToast('Please enter a color value', 'error');
            return;
        }
        
        try {
            // Create a temporary div to test if the color is valid
            const tempDiv = document.createElement('div');
            tempDiv.style.color = colorText;
            document.body.appendChild(tempDiv);
            
            // Get the computed style
            const computedColor = getComputedStyle(tempDiv).color;
            document.body.removeChild(tempDiv);
            
            // Convert RGB from computed style to hex
            const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                const hex = rgbToHex(r, g, b);
                
                colorInput.value = hex;
                updateColorPreview(hex);
                showToast('Color applied successfully', 'success');
            } else {
                showToast('Invalid color format', 'error');
            }
        } catch (e) {
            showToast('Invalid color format', 'error');
        }
    }
    
    function generateColorScheme() {
        const h = parseInt(hueRange.value);
        const s = parseInt(saturationRange.value) / 100;
        const l = parseInt(lightnessRange.value) / 100;
        const schemeType = schemeSelect.value;
        
        let colors = [];
        
        switch (schemeType) {
            case 'monochromatic':
                colors = generateMonochromaticScheme(h, s, l);
                break;
            case 'analogous':
                colors = generateAnalogousScheme(h, s, l);
                break;
            case 'complementary':
                colors = generateComplementaryScheme(h, s, l);
                break;
            case 'triadic':
                colors = generateTriadicScheme(h, s, l);
                break;
            case 'tetradic':
                colors = generateTetradicScheme(h, s, l);
                break;
        }
        
        // Clear previous scheme
        colorScheme.innerHTML = '';
        
        // Add colors to scheme
        colors.forEach((color, index) => {
            const schemeColor = document.createElement('div');
            schemeColor.className = 'scheme-color';
            schemeColor.style.backgroundColor = color;
            
            const colorLabel = document.createElement('div');
            colorLabel.className = 'color-label';
            colorLabel.textContent = color;
            
            schemeColor.appendChild(colorLabel);
            colorScheme.appendChild(schemeColor);
            
            // Add click event to copy color
            schemeColor.addEventListener('click', function() {
                copyToClipboard(color, this);
            });
        });
    }
    
    // Color Scheme Generators
    function generateMonochromaticScheme(h, s, l) {
        const colors = [];
        const steps = 5;
        
        for (let i = 0; i < steps; i++) {
            const newL = Math.max(0, Math.min(1, l - 0.3 + (i * 0.15)));
            const rgb = hslToRgb(h, s, newL);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        }
        
        return colors;
    }
    
    function generateAnalogousScheme(h, s, l) {
        const colors = [];
        const angles = [-30, -15, 0, 15, 30];
        
        angles.forEach(angle => {
            const newH = (h + angle + 360) % 360;
            const rgb = hslToRgb(newH, s, l);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        });
        
        return colors;
    }
    
    function generateComplementaryScheme(h, s, l) {
        const colors = [];
        
        // Add original color
        const rgb1 = hslToRgb(h, s, l);
        colors.push(rgbToHex(rgb1.r, rgb1.g, rgb1.b));
        
        // Add variations of original
        const rgb2 = hslToRgb(h, s * 0.8, l * 1.1);
        colors.push(rgbToHex(rgb2.r, rgb2.g, rgb2.b));
        
        // Add complementary color
        const complementaryH = (h + 180) % 360;
        const rgb3 = hslToRgb(complementaryH, s, l);
        colors.push(rgbToHex(rgb3.r, rgb3.g, rgb3.b));
        
        // Add variations of complementary
        const rgb4 = hslToRgb(complementaryH, s * 0.8, l * 1.1);
        colors.push(rgbToHex(rgb4.r, rgb4.g, rgb4.b));
        
        const rgb5 = hslToRgb(complementaryH, s * 0.9, l * 0.9);
        colors.push(rgbToHex(rgb5.r, rgb5.g, rgb5.b));
        
        return colors;
    }
    
    function generateTriadicScheme(h, s, l) {
        const colors = [];
        const angles = [0, 120, 240];
        
        angles.forEach(angle => {
            const newH = (h + angle) % 360;
            
            // Add main color
            const rgb1 = hslToRgb(newH, s, l);
            colors.push(rgbToHex(rgb1.r, rgb1.g, rgb1.b));
            
            // Add variation
            if (colors.length < 5) {
                const rgb2 = hslToRgb(newH, s * 0.8, l * 1.1);
                colors.push(rgbToHex(rgb2.r, rgb2.g, rgb2.b));
            }
        });
        
        return colors.slice(0, 5);
    }
    
    function generateTetradicScheme(h, s, l) {
        const colors = [];
        const angles = [0, 90, 180, 270];
        
        angles.forEach(angle => {
            const newH = (h + angle) % 360;
            const rgb = hslToRgb(newH, s, l);
            colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        });
        
        // Add one more variation
        const rgb = hslToRgb(h, s * 0.8, l * 1.1);
        colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
        
        return colors;
    }
    
    // Utility Functions
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex to RGB
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }
    
    function rgbToHex(r, g, b) {
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return { h: h * 360, s, l };
    }
    
    function hslToRgb(h, s, l) {
        h /= 360;
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    function copyToClipboard(text, element) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Add copied class
                element.classList.add('copied');
                
                // Show toast
                showToast('Copied to clipboard: ' + text, 'success');
                
                // Remove copied class after animation
                setTimeout(() => {
                    element.classList.remove('copied');
                }, 1500);
            })
            .catch(err => {
                showToast('Failed to copy: ' + err, 'error');
            });
    }
    
    function showToast(message, type = 'info') {
        // Check if toast container exists
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            // Create toast container
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Toast content
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        // Show toast
        bsToast.show();
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
}); 