// Configuration file - DO NOT commit to git
// Copy this to config.js and add your actual values

const CONFIG = {
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL_HERE'
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.FACESCAN_CONFIG = CONFIG;
}

