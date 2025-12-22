/**
 * Google Apps Script for FaceScan Signup Form
 * 
 * Instructions:
 * 1. Create a new Google Sheets document
 * 2. Open Extensions > Apps Script
 * 3. Delete any code in the editor and paste this entire file
 * 4. Click on "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Paste the URL in script.js where it says GOOGLE_SCRIPT_URL
 */

// Handle POST requests from the signup form
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    
    // Get form data
    const email = e.parameter.email;
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return createResponse('error', 'Invalid email address');
    }
    
    // Check for duplicates
    if (isDuplicate(sheet, email)) {
      return createResponse('info', 'Email already registered');
    }
    
    // Add new row
    sheet.appendRow([
      timestamp,
      email,
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString()
    ]);
    
    // Send confirmation (optional - requires setup)
    // sendConfirmationEmail(email);
    
    return createResponse('success', 'Email successfully registered');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return createResponse('error', 'An error occurred: ' + error.toString());
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'success',
      message: 'FaceScan Signup API is running'
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Get or create the signup sheet
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Signups');
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Signups');
    
    // Add headers
    sheet.appendRow(['Timestamp', 'Email', 'Date', 'Time']);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#9b87f5');
    headerRange.setFontColor('#ffffff');
    
    // Set column widths
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 250);
    sheet.setColumnWidth(3, 120);
    sheet.setColumnWidth(4, 120);
    
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
    if (data[i][1].toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  
  return false;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Create JSON response
function createResponse(status, message) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: Send confirmation email
function sendConfirmationEmail(email) {
  const subject = 'Welcome to FaceScan Waitlist!';
  const body = `
    Hello!
    
    Thank you for joining the FaceScan waitlist. We're excited to have you on board!
    
    We'll notify you as soon as FaceScan is ready for launch.
    
    Best regards,
    The FaceScan Team
  `;
  
  // Uncomment to enable email sending
  // MailApp.sendEmail(email, subject, body);
}

