# 🚀 Quick Deployment Guide

## Step 1: Update Google Apps Script (5 minutes)

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. **Replace all code** with contents from `google-apps-script-secure.gs`
4. **Update line 12-16** with your domain:
   ```javascript
   ALLOWED_ORIGINS: [
     'https://yoursite.com',  // ← Change this!
     'http://localhost:8000'  // Keep for testing
   ]
   ```
5. Click **Deploy > Manage deployments**
6. Click **Edit** (pencil icon)
7. Change version to "New version"
8. Click **Deploy**
9. Copy the new Web App URL

## Step 2: Configure Your App (2 minutes)

1. Open `config.js` in your project
2. Paste your Google Script URL:
   ```javascript
   const CONFIG = {
       GOOGLE_SCRIPT_URL: 'PASTE_URL_HERE'
   };
   ```
3. Save the file

## Step 3: Test Locally (2 minutes)

```bash
# Start local server
python -m http.server 8000
# or use VS Code Live Server
```

1. Visit `http://localhost:8000`
2. Try submitting your email
3. Check Google Sheet for new entry
4. Try submitting 6 times quickly - should get rate limited!

## Step 4: Deploy to Netlify (5 minutes)

### Option A: Drag & Drop (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Sign up (free)
3. Drag your project folder onto Netlify
4. Done! You get a URL like `https://your-site.netlify.app`

### Option B: GitHub Deploy (Recommended)

1. Push code to GitHub (make sure `.gitignore` excludes `config.js`)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site > Import from Git"
4. Connect GitHub and select repo
5. **Important**: Add environment variable:
   - Key: `GOOGLE_SCRIPT_URL`
   - Value: Your Google Script URL
6. Deploy!

## Step 5: Update Origins (1 minute)

1. Copy your new Netlify URL
2. Go back to Google Apps Script
3. Update `ALLOWED_ORIGINS`:
   ```javascript
   ALLOWED_ORIGINS: [
     'https://your-site.netlify.app',  // ← Your new URL
     'https://yoursite.com'  // If you have custom domain
   ]
   ```
4. Deploy new version

## Step 6: Test Production (1 minute)

1. Visit your live site
2. Submit test email
3. Check Google Sheet
4. Try rate limit (submit 6 times)

## ✅ Done!

Your site is now:
- ✅ Live on HTTPS
- ✅ Protected with rate limiting
- ✅ Validated server-side
- ✅ Spam-resistant
- ✅ Professional

---

## 🎨 Custom Domain (Optional)

### Netlify Custom Domain

1. Buy domain (Namecheap, Google Domains, etc.)
2. In Netlify: **Domain settings > Add custom domain**
3. Follow DNS setup instructions
4. Netlify provides free HTTPS!

---

## 🐛 Troubleshooting

### "Submission failed" error
- Check browser console (F12)
- Verify `config.js` URL is correct
- Test Google Script URL directly

### CORS error
- Make sure Google Script is deployed as "Anyone can access"
- Check ALLOWED_ORIGINS includes your domain

### Emails not appearing
- Check Google Sheet exists
- Verify script has permission to write
- Look at Google Apps Script logs (View > Logs)

### Rate limit too aggressive
- Edit Google Apps Script
- Change line 8: `MAX_REQUESTS_PER_IP: 10` (or higher)
- Deploy new version

---

## 📱 Share Your Site

Your site is ready! Share with:
- Social media
- Email newsletter  
- QR codes
- Link in bio

Track signups in real-time in your Google Sheet! 📊

---

**Total Time: ~15 minutes**  
**Cost: $0** 🎉

