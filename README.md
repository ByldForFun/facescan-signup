# FaceScan Signup Page

A beautiful, modern signup page for collecting email addresses from users interested in your FaceScan app. The page features a dark theme with purple accents, matching your app's design aesthetic.

![FaceScan Signup](preview.png)

## Features

- ✨ Beautiful, responsive design matching your app's theme
- 📧 Email collection with validation
- 📊 Google Sheets integration for easy data management
- ⚡ Smooth animations and transitions
- 📱 Mobile-friendly and responsive
- ✅ Success/error message handling
- 🔄 Loading states for better UX

## Quick Start

### Option 1: Simple Setup (LocalStorage Fallback)

If you want to test the page immediately without Google Sheets integration:

1. Open `index.html` in your web browser
2. The form will work and save emails to browser localStorage (for testing only)

### Option 2: Full Setup with Google Sheets

#### Step 1: Set Up Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "FaceScan Signups" (or any name you prefer)

#### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Open the `google-apps-script.gs` file from this project
4. Copy ALL the code and paste it into the Apps Script editor
5. Click the **💾 Save** button (or Ctrl+S / Cmd+S)

#### Step 3: Deploy the Web App

1. In Apps Script, click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: FaceScan Signup API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Important**: Authorize the app when prompted
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to [Project Name] (unsafe)" - this is your own script, so it's safe
   - Click "Allow"
7. Copy the **Web App URL** (it looks like: `https://script.google.com/macros/s/...`)

#### Step 4: Configure Your Signup Page

1. Open `script.js` in a text editor
2. Find this line near the top:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec';
   ```
4. Save the file

#### Step 5: Test Your Setup

1. Open `index.html` in your web browser
2. Enter a test email address
3. Click "Join Waitlist"
4. Check your Google Sheet - you should see the email appear!

## File Structure

```
facescan-signup/
├── index.html              # Main HTML file
├── styles.css              # Styling and animations
├── script.js               # Form handling and Google Sheets integration
├── google-apps-script.gs   # Google Apps Script for backend
└── README.md               # This file
```

## Customization

### Colors

The main colors are defined in `styles.css`:

- **Background**: `#1a1d2e` to `#0f1119` (gradient)
- **Purple Accent**: `#9b87f5`
- **Text Colors**: Various shades of gray/white

To change the purple accent color, search for `#9b87f5` in `styles.css` and replace with your preferred color.

### Text Content

Edit `index.html` to change:
- Main heading ("Coming Soon")
- Subheading ("Take a scan to view your health metrics")
- Description text
- Button text ("Join Waitlist")
- Success/error messages

### Logo/Icon

The current design uses an SVG face scan icon. To replace with your own logo:

1. Find the `<div class="icon-container">` section in `index.html`
2. Replace the SVG code with your own logo/image:
   ```html
   <div class="icon-container">
       <img src="your-logo.png" alt="FaceScan Logo" class="logo">
   </div>
   ```

## Deployment

### Deploy to Netlify (Recommended)

1. Create a free account at [Netlify](https://www.netlify.com)
2. Drag and drop your project folder into Netlify
3. Your site is live! You'll get a URL like `https://your-site-name.netlify.app`

### Deploy to GitHub Pages

1. Create a GitHub repository
2. Push your code to the repository
3. Go to repository Settings > Pages
4. Select your main branch and save
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Deploy to Vercel

1. Create a free account at [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel` in your project directory
4. Follow the prompts

## Managing Signups

All signups will appear in your Google Sheet with:
- **Timestamp**: ISO format timestamp
- **Email**: User's email address
- **Date**: Local date
- **Time**: Local time

### Export Emails

To export emails for your email marketing platform:

1. Open your Google Sheet
2. Click on the email column header (B)
3. Go to File > Download > CSV
4. Import the CSV to your email platform (Mailchimp, SendGrid, etc.)

## Troubleshooting

### Emails not appearing in Google Sheets

1. Check that you copied the correct Web App URL
2. Make sure you deployed the Apps Script as "Anyone" can access
3. Check the browser console (F12) for error messages
4. Verify the Apps Script is authorized correctly

### CORS Errors

If you see CORS errors in the browser console:
- This is normal for Google Apps Script
- The script should still work
- If it doesn't, redeploy the Web App and get a new URL

### Testing Locally

You can test the page by:
1. Opening `index.html` directly in a browser (uses localStorage fallback)
2. Using a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have npx)
   npx serve
   ```
   Then visit `http://localhost:8000`

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Optional Enhancements

### Add Email Confirmation

Uncomment the email sending code in `google-apps-script.gs`:

```javascript
// In the doPost function, uncomment:
sendConfirmationEmail(email);

// And uncomment the MailApp.sendEmail line in sendConfirmationEmail function
```

### Add Analytics

Add Google Analytics by adding this to the `<head>` section of `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### Add reCAPTCHA

To prevent spam submissions, add Google reCAPTCHA:
1. Get a site key from [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Add the reCAPTCHA widget to your form
3. Verify the response in your Apps Script

## Support

If you encounter any issues:
1. Check the browser console for error messages (F12)
2. Verify your Google Apps Script is properly deployed
3. Make sure the Web App URL is correctly set in `script.js`

## License

This project is free to use for your FaceScan app.

## Credits

Created for the FaceScan app waitlist page.

