# GitHub Pages Deployment Guide

This guide will help you deploy the Future Market Invoice Generator to GitHub Pages.

## Prerequisites

- A GitHub account
- This repository cloned on your computer

## Step 1: Prepare Your Repository

1. Make sure all your files are committed:
   ```bash
   git add .
   git commit -m "Convert to static site for GitHub Pages"
   ```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top right of the repository)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)` (since `index.html` is in the root)
5. Click **Save**

## Step 3: Access Your Site

- Your site will be available at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`
- It may take a few minutes for GitHub to build and deploy your site
- You'll see a green checkmark when it's ready

## Step 4: Update Links (if needed)

If your repository is not in the root of your GitHub Pages site, you may need to update internal links. The current setup should work if `index.html` is in the root directory.

## File Structure

```
invoice_generator/
├── index.html          # Main static HTML file (single-page app)
├── README.md           # Project documentation
└── GITHUB_PAGES_DEPLOYMENT.md  # This file
```

## Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file in your repository root with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## Troubleshooting

### Site not loading
- Wait 5-10 minutes after enabling Pages
- Check the **Actions** tab for build errors
- Ensure `index.html` is in the root directory

### PDF generation not working
- Check browser console for errors
- Ensure jsPDF CDN is loading (check network tab)
- Try a different browser

### Logo color extraction not working
- Ensure logo file is a valid image format (PNG, JPG, GIF)
- Check browser console for errors
- Try with a different logo

## Features

✅ **Fully Static** - No server required
✅ **Client-Side PDF Generation** - Uses jsPDF library
✅ **Logo Color Extraction** - Automatically extracts colors from logos
✅ **Responsive Design** - Works on all devices
✅ **Offline Capable** - Works after initial load

## Notes

- All processing happens in the browser
- No data is sent to any server
- PDFs are generated client-side
- Logo colors are extracted using Canvas API

