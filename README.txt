AMORA WEBSITE — VITE + REACT PRODUCTION READY

1. HOW TO RUN LOCALLY:
   - Double-click OPEN_AMORA.bat. It will automatically launch the Vite dev server and open http://localhost:3000 in your browser with fast Hot Module Replacement.
   - Alternatively, open PowerShell/Command Prompt in this folder and run:
       npm run dev
     or to test the production build:
       npm run build
       npm run preview

2. HOW TO DEPLOY TO VERCEL:
   - Method A (Vercel Web UI):
     1. Go to https://vercel.com/new
     2. Import your GitHub repository (or upload this folder)
     3. Vercel automatically detects "Vite" preset:
        - Build Command: npm run build
        - Output Directory: dist
     4. Click "Deploy". Your site goes live instantly with global CDN caching and security headers.
   - Method B (Vercel CLI):
     Run: npx vercel --prod

3. ASSETS & SEO:
   - All brand assets (AMORA emblem, Kathiravan V, Nithiarasu N, Vignesh C photos) are in /public/assets.
   - vercel.json, robots.txt, sitemap.xml, and Schema.org structured data are fully configured.
