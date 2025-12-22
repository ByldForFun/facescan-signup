// Configuration - Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuvkye-MAC5IF4ZkYfLgXUNbqVANwa7bfZ1JW-DVLKbl3C162Qyj1hYBIZRY9jpebR/exec';

// DOM Elements
const form = document.getElementById('signupForm');
const emailInput = document.getElementById('emailInput');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Disable form and show loading
    setLoading(true);
    hideMessages();
    
    try {
        // Submit to Google Sheets
        await submitToGoogleSheets(email);
        
        // Show success message
        showSuccess();
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
});

// Submit email to Google Sheets
async function submitToGoogleSheets(email) {
    // If no Google Script URL is configured, use local storage as fallback
    if (GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbwuvkye-MAC5IF4ZkYfLgXUNbqVANwa7bfZ1JW-DVLKbl3C162Qyj1hYBIZRY9jpebR/exec') {
        console.warn('Google Script URL not configured. Using localStorage as fallback.');
        saveToLocalStorage(email);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('timestamp', new Date().toISOString());
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    
    if (result.status !== 'success') {
        throw new Error(result.message || 'Submission failed');
    }
    
    return result;
}

// Fallback: Save to localStorage
function saveToLocalStorage(email) {
    const signups = JSON.parse(localStorage.getItem('facescan_signups') || '[]');
    signups.push({
        email: email,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('facescan_signups', JSON.stringify(signups));
    console.log('Email saved to localStorage:', email);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// UI State Management
function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'flex' : 'none';
    emailInput.disabled = loading;
}

function showSuccess() {
    successMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Input validation on blur
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && !isValidEmail(email)) {
        emailInput.style.borderColor = '#ff6b6b';
    }
});

emailInput.addEventListener('input', () => {
    emailInput.style.borderColor = '';
});

