# FaceScan Signup Page

A secure, modern signup page for FaceScan waitlist with Google Sheets integration.

## 🔒 Security Features

- **Rate Limiting**: Prevents spam submissions
- **Content Security Policy**: Protects against XSS attacks
- **Email Validation**: Client and server-side validation
- **Duplicate Prevention**: Checks for existing emails
- **Environment Config**: Keeps sensitive data out of source code

## 📋 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd facescan-signup
```

### 2. Configure Google Sheets Backend

1. Create a new Google Sheets document
2. Open **Extensions > Apps Script**
3. Delete default code and paste contents from `google-apps-script-secure.gs`
4. Update `CONFIG.ALLOWED_ORIGINS` with your domain
5. Click **Deploy > New deployment**
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
6. Copy the Web App URL

### 3. Configure Application

1. Copy the config example:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your Google Script URL:
   ```javascript
   const CONFIG = {
       GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_SCRIPT_URL_HERE'
   };
   ```

3. **IMPORTANT**: Never commit `config.js` to git!

### 4. Install Dependencies (Optional - for minification)

```bash
npm install
```

### 5. Run Locally

```bash
npm run serve
# or
python -m http.server 8000
```

Visit: `http://localhost:8000`

## 🚀 Deployment

### Option 1: Static Hosting (Recommended)

Deploy to any static host:
- **Netlify**: Drag & drop your folder
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Enable in repo settings
- **Cloudflare Pages**: Connect your repo

**Important**: Set up environment variables in your hosting platform:
- Variable name: `GOOGLE_SCRIPT_URL`
- Value: Your Google Apps Script URL

### Option 2: Build for Production

```bash
npm run build
```

This creates minified versions:
- `script.min.js` - Minified JavaScript
- `styles.min.css` - Minified CSS

Update `index.html` to use minified files:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

## 🛡️ Security Best Practices

### What's Protected
✅ Google Sheets data is server-side (users can't access directly)  
✅ Rate limiting prevents spam  
✅ Email validation prevents invalid data  
✅ CSP headers prevent XSS attacks  
✅ Duplicate checking prevents re-submissions  

### What's NOT Protected (Frontend Reality)
⚠️ **API endpoint URL is visible** - This is normal for frontend apps  
⚠️ **HTML/CSS/JS code is visible** - Users can always view frontend code  
⚠️ **Email format is visible** - This is necessary for form functionality  

### Additional Protection

1. **Use HTTPS**: Always deploy with HTTPS (free with most hosts)
2. **Monitor submissions**: Check Google Sheets regularly for abuse
3. **Set up alerts**: Use Google Sheets scripts to notify you of suspicious activity
4. **Consider adding CAPTCHA**: For high-traffic sites, add reCAPTCHA

### Adding reCAPTCHA (Optional)

1. Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Add to `index.html`:
   ```html
   <script src="https://www.google.com/recaptcha/api.js" async defer></script>
   ```
3. Add reCAPTCHA widget to form
4. Verify token server-side in Google Apps Script

## 📊 Monitoring

Check your Google Sheet to monitor:
- Submission rate
- Duplicate attempts
- Invalid email patterns
- Client ID patterns (detect bots)

## 🔧 Troubleshooting

### "CORS Error" when submitting
- Ensure your Google Apps Script is deployed as "Anyone can access"
- Check `CONFIG.ALLOWED_ORIGINS` in Google Script

### Submissions not appearing
- Check browser console for errors
- Verify `config.js` has correct URL
- Test Google Script URL directly in browser

### Rate limit too strict
- Adjust `MAX_REQUESTS_PER_IP` in `google-apps-script-secure.gs`
- Default: 5 requests per hour per client

## 📝 Files Overview

- `index.html` - Main page with security headers
- `styles.css` - Styling
- `script.js` - Frontend logic
- `config.js` - **Private** configuration (not in git)
- `config.example.js` - Example config template
- `google-apps-script-secure.gs` - Secure backend script
- `package.json` - Build scripts
- `.gitignore` - Excludes sensitive files

## 🤝 Contributing

When contributing:
1. Never commit `config.js`
2. Use `config.example.js` as template
3. Test with local server before deploying
4. Keep dependencies minimal

## 📄 License

MIT License - Feel free to use for your projects!

---

**Remember**: Frontend code is ALWAYS visible to users. The key is protecting your backend (Google Sheets) and preventing abuse through rate limiting and validation. 🔐

