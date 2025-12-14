# ResearchHub - Vercel Environment Variables

Add these environment variables to your Vercel project settings:

## Required Environment Variables

### Convex
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL (e.g., https://xxx.convex.cloud)
- `CONVEX_DEPLOYMENT` - Your Convex deployment name (e.g., dev:xxx)

### Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key (pk_test_...)
- `CLERK_SECRET_KEY` - Your Clerk secret key (sk_test_...)

### Optional API Keys
- `PDF_CO_API` - PDF.co API key for advanced text extraction
- `GROK_API_KEY` - Grok AI API key
- `GEMINI_API_KEY` - Google Gemini API key
- `OPEN_ROUTER_API_KEY` - OpenRouter API key
- `HUGGING_FACE_ACCESS_TOKEN` - HuggingFace API token
- `MLVOCA_API_URL` - MLVoca API endpoint
- `APIFREELLM_FREE_URL` - ApiFreeLLM endpoint

## How to Add in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable above with its corresponding value
4. Select the appropriate environments (Production, Preview, Development)
5. Save and redeploy your project

## Important Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never commit API keys to your repository
- All keys in `.env.local` should be added to Vercel for production deployments
