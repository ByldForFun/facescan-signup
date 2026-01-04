// Configuration - Load from config.js
const GOOGLE_SCRIPT_URL = (typeof window !== 'undefined' && window.FACESCAN_CONFIG) 
    ? window.FACESCAN_CONFIG.GOOGLE_SCRIPT_URL 
    : 'https://script.google.com/macros/s/AKfycbwuvkye-MAC5IF4ZkYfLgXUNbqVANwa7bfZ1JW-DVLKbl3C162Qyj1hYBIZRY9jpebR/exec';

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
        shakeInput();
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
        
        // Hide form and related elements
        document.querySelector('.signup-form').style.display = 'none';
        const trustSignals = document.querySelector('.trust-signals');
        if (trustSignals) trustSignals.style.display = 'none';
        const socialProof = document.querySelector('.social-proof');
        if (socialProof) socialProof.style.display = 'none';
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
});

// Shake input on error
function shakeInput() {
    emailInput.style.animation = 'shake 0.5s ease-out';
    setTimeout(() => {
        emailInput.style.animation = '';
    }, 500);
}

// Submit email to Google Sheets
async function submitToGoogleSheets(email) {
    // If no Google Script URL is configured, use local storage as fallback
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        console.warn('Google Script URL not configured. Using localStorage as fallback.');
        saveToLocalStorage(email);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }
    
    // Send data as URL parameters for better compatibility with Google Apps Script
    const params = new URLSearchParams({
        email: email,
        timestamp: new Date().toISOString()
    });
    
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: 'POST',
        redirect: 'follow'
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
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Confetti effect (simple version)
    createConfetti();
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

// Simple confetti effect
function createConfetti() {
    const colors = ['#a78bfa', '#22d3ee', '#10b981', '#f59e0b', '#ef4444'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            opacity: ${0.7 + Math.random() * 0.3};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
    
    // Add confetti animation if not exists
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    top: 100vh;
                    transform: rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 200}px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Input validation on blur
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && !isValidEmail(email)) {
        emailInput.style.borderColor = '#ef4444';
    }
});

emailInput.addEventListener('input', () => {
    emailInput.style.borderColor = '';
});

// Focus effect on input
emailInput.addEventListener('focus', () => {
    const inputGroup = document.querySelector('.input-group');
    if (inputGroup) {
        inputGroup.style.transform = 'scale(1.02)';
        inputGroup.style.transition = 'transform 0.2s ease';
    }
});

emailInput.addEventListener('blur', () => {
    const inputGroup = document.querySelector('.input-group');
    if (inputGroup) {
        inputGroup.style.transform = 'scale(1)';
    }
});

// Navigate to a specific page
function navigateToPage(pageName) {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    // Remove active class from all links and pages
    navLinks.forEach(l => l.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    // Add active class to corresponding nav link and page
    const targetNavLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (targetNavLink) {
        targetNavLink.classList.add('active');
    }
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Page navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            navigateToPage(pageName);
        });
    });
    
    // Handle CTA buttons with data-page attribute (like "Join the Waitlist" button)
    document.querySelectorAll('[data-page]').forEach(el => {
        if (!el.classList.contains('nav-link')) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const pageName = el.getAttribute('data-page');
                navigateToPage(pageName);
                
                // Focus on email input if navigating to home
                if (pageName === 'home') {
                    setTimeout(() => {
                        const emailInput = document.getElementById('emailInput');
                        if (emailInput) {
                            emailInput.focus();
                        }
                    }, 500);
                }
            });
        }
    });
});

// Parallax effect on scroll (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const phonesSection = document.querySelector('.phones-section');
    
    if (phonesSection && scrolled < 600) {
        phonesSection.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        createConfetti();
        console.log('🎮 Konami code activated!');
    }
});
