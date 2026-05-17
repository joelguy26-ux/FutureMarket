# Future Market Invoice Generator

A professional PDF invoice generator for freelancers and small businesses. Generate beautiful invoices instantly with automatic logo color extraction.

## ✨ Features

- **Professional PDF Generation** - Client-side PDF creation using jsPDF
- **Logo Color Extraction** - Automatically extracts colors from your logo and applies them throughout the invoice
- **Real-time Preview** - See calculations instantly
- **Responsive Design** - Works on all devices
- **Offline Capable** - Works after initial load
- **No Backend Required** - Fully static, no server needed

## 🚀 Quick Start

### Local Testing

1. Simply open `index.html` in your web browser
2. Fill out the invoice form
3. Generate and download your PDF invoice

That's it! No installation or setup required.

## 📁 Project Structure

```
invoice_generator/
├── index.html                      # Main static HTML file (single-page app)
├── README.md                       # This file
├── GITHUB_PAGES_DEPLOYMENT.md     # Deployment guide for GitHub Pages
└── SELLING_ON_SHOPIFY.md          # Guide for selling the product on Shopify
```

## 🌐 Deployment

### GitHub Pages (Recommended)

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select branch: `main` (or `master`)
4. Select folder: `/ (root)`
5. Save

Your site will be live at: `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`

See `GITHUB_PAGES_DEPLOYMENT.md` for detailed instructions.

### Other Static Hosting

This static site works on any static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- Any web server

Simply upload `index.html` to your hosting provider.

## 🎨 Features Explained

### Logo Color Extraction

When you upload a logo, the app automatically:
- Extracts the dominant color from your logo
- Applies that color to invoice headers, titles, and accents
- Ensures proper contrast for readability

### PDF Generation

- Professional, clean design
- Auto-generated invoice numbers
- Automatic calculations (subtotal, tax, total)
- Customizable business and client information
- Logo placement (top-right)

## 💻 Technology

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **jsPDF** - Client-side PDF generation (loaded via CDN)
- **Canvas API** - Logo color extraction
- **No Dependencies** - Everything works out of the box

## 📝 Usage

1. Fill in your business information
2. Add client details
3. Enter service/item details
4. (Optional) Upload a logo for branding
5. Preview calculations
6. Generate and download PDF

## 🔒 Privacy

- All processing happens in your browser
- No data is sent to any server
- No tracking or analytics
- 100% client-side

## 📄 License

Free to use for personal and commercial projects.

## 🤝 Support

For deployment questions, see `GITHUB_PAGES_DEPLOYMENT.md`.
