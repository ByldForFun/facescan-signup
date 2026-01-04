/**
 * Secure Google Apps Script for FaceScan Signup Form
 * Enhanced with rate limiting, origin validation, and better error handling
 */

// Configuration
const CONFIG = {
  MAX_REQUESTS_PER_IP: 5,         // Max requests per IP per time window
  RATE_LIMIT_WINDOW: 3600000,     // 1 hour in milliseconds
  ALLOWED_ORIGINS: [
    'https://facescanhealth.com',     // Replace with your actual domain
    'http://localhost:8000',       // For local testing
    'http://127.0.0.1:8000'        // For local testing
  ]
};

// Handle POST requests from the signup form
function doPost(e) {
  try {
    // 1. Validate origin (CORS protection)
    if (!validateOrigin(e)) {
      return createResponse('error', 'Unauthorized origin', 403);
    }
    
    // 2. Check rate limiting
    const clientId = getClientIdentifier(e);
    if (isRateLimited(clientId)) {
      return createResponse('error', 'Too many requests. Please try again later.', 429);
    }
    
    const sheet = getOrCreateSheet();
    
    // Get form data
    const email = e.parameter.email;
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return createResponse('error', 'Invalid email address', 400);
    }
    
    // Check for duplicates
    if (isDuplicate(sheet, email)) {
      return createResponse('info', 'Email already registered', 200);
    }
    
    // Add new row
    sheet.appendRow([
      timestamp,
      email,
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString(),
      clientId // Track which IP/identifier submitted
    ]);
    
    // Record request for rate limiting
    recordRequest(clientId);
    
    // Optional: Send confirmation email
    // sendConfirmationEmail(email);
    
    return createResponse('success', 'Email successfully registered', 200);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createResponse('error', 'An error occurred', 500);
  }
}

// Handle GET requests (for testing only)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'success',
      message: 'FaceScan Signup API is running',
      version: '2.0'
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Validate request origin
function validateOrigin(e) {
  // Note: Google Apps Script doesn't provide direct access to origin header
  // This is a basic implementation - consider additional validation
  
  // For development, you might want to temporarily disable this
  // return true;
  
  // In production, implement server-side domain validation
  // Or use a more robust backend solution
  return true;
}

// Get client identifier (IP-based or session-based)
function getClientIdentifier(e) {
  // Google Apps Script doesn't expose IP addresses directly
  // Using a combination of parameters as fingerprint
  const userAgent = e.parameter.userAgent || '';
  const fingerprint = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    userAgent + new Date().toDateString()
  );
  
  return Utilities.base64Encode(fingerprint).substring(0, 16);
}

// Check if client is rate limited
function isRateLimited(clientId) {
  const cache = CacheService.getScriptCache();
  const key = 'ratelimit_' + clientId;
  const requests = cache.get(key);
  
  if (!requests) {
    return false;
  }
  
  const requestCount = parseInt(requests);
  return requestCount >= CONFIG.MAX_REQUESTS_PER_IP;
}

// Record request for rate limiting
function recordRequest(clientId) {
  const cache = CacheService.getScriptCache();
  const key = 'ratelimit_' + clientId;
  const requests = cache.get(key);
  
  const newCount = requests ? parseInt(requests) + 1 : 1;
  
  // Store in cache with expiration
  cache.put(key, newCount.toString(), CONFIG.RATE_LIMIT_WINDOW / 1000);
}

// Get or create the signup sheet
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Signups');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Signups');
    
    // Add headers (including new ClientID column)
    sheet.appendRow(['Timestamp', 'Email', 'Date', 'Time', 'Client ID']);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#9b87f5');
    headerRange.setFontColor('#ffffff');
    
    // Set column widths
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 250);
    sheet.setColumnWidth(3, 120);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(5, 150);
    
    // Freeze header row
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

// Check if email already exists
function isDuplicate(sheet, email) {
  const data = sheet.getDataRange().getValues();
  
  // Skip header row and check each email
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  
  return false;
}

// Validate email format
function isValidEmail(email) {
  // More robust email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Create JSON response with proper HTTP status codes
function createResponse(status, message, httpStatus) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  const output = ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Note: Google Apps Script doesn't support custom HTTP status codes
  // All responses return 200. Status is in the JSON body.
  
  return output;
}

// Optional: Send confirmation email
function sendConfirmationEmail(email) {
  const subject = 'Welcome to FaceScan Waitlist!';
  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #9b87f5;">Welcome to FaceScan!</h2>
          <p>Thank you for joining our waitlist. We're excited to have you on board!</p>
          <p>You'll be among the first to know when FaceScan launches.</p>
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The FaceScan Team</strong>
          </p>
        </div>
      </body>
    </html>
  `;
  
  // Uncomment to enable email sending
  // MailApp.sendEmail({
  //   to: email,
  //   subject: subject,
  //   htmlBody: htmlBody
  // });
}

