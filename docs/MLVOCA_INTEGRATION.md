# Free LLM API Integration (mlvoca.com)

## Overview
This project now supports the free LLM API from mlvoca.com as an alternative to Puter.js, providing unlimited AI access without API keys or usage limits.

## Available Models

### Puter.js Models (require Puter account)
- Claude Sonnet 4.5, 4, 3.5
- GPT-4, GPT-4 Turbo, GPT-3.5 Turbo

### mlvoca.com Models (FREE, no API key)
- **DeepSeek R1 1.5B** - Fast reasoning model
- **TinyLlama** - Lightweight, efficient model

## Setup

### Environment Variables
The API endpoint is configured in `.env.local`:
```env
NEXT_PUBLIC_MLVOCA_API_URL=https://mlvoca.com/api/generate
```

## Usage

### Automatic Provider Selection
The `chatWithAI` function automatically routes to the correct provider based on the model:

```typescript
import { chatWithAI } from "@/lib/puter";

// Uses mlvoca.com (FREE)
const response = await chatWithAI(
  [{ role: "user", content: "Why is the sky blue?" }],
  { model: "deepseek-r1:1.5b" }
);

// Uses Puter.js
const response2 = await chatWithAI(
  [{ role: "user", content: "Explain quantum physics" }],
  { model: "claude-sonnet-4.5" }
);
```

### Direct mlvoca API Usage
You can also use the mlvoca API directly:

```typescript
import { generateWithMlvoca } from "@/lib/mlvoca";

const response = await generateWithMlvoca({
  model: "deepseek-r1:1.5b",
  prompt: "Explain artificial intelligence",
  options: {
    temperature: 0.7,
    num_predict: 500,
  },
});
```

## Features

### mlvoca.com Benefits
✅ **No API Key Required** - Works out of the box  
✅ **No Rate Limits** - Unlimited requests (subject to fair use)  
✅ **No Usage Costs** - Completely free  
✅ **Good for Research** - Encouraged for educational/scientific use  

### Limitations
⚠️ Smaller models (less capable than GPT-4/Claude)  
⚠️ Slower during high usage periods  
⚠️ Commercial use not allowed (contact mlvoca@protonmail.com)  

## Model Selection in UI

All AI features (Chat, Paraphrase, Notes, etc.) now include:
- DeepSeek R1 1.5B (mlvoca.com - Free)
- TinyLlama (mlvoca.com - Free)

Simply select these models from the dropdown to avoid Puter usage limits.

## API Documentation

Full documentation: https://mlvoca.github.io/free-llm-api/

### Endpoint
```
POST https://mlvoca.com/api/generate
```

### Example Request
```bash
curl -X POST https://mlvoca.com/api/generate -d '{
  "model": "deepseek-r1:1.5b",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

## Important Notes

1. **Fair Use**: While there are no hard rate limits, use responsibly
2. **Scientific Use**: Encouraged for research, education, and academic purposes
3. **Commercial Use**: Requires permission - contact mlvoca@protonmail.com
4. **Performance**: May be slower during peak times due to shared resources
5. **No Guarantees**: Service provided "as is" without warranties

## Contact

For questions about mlvoca.com API: mlvoca@protonmail.com

## Legal

By using this integration, you agree to mlvoca.com's:
- [Terms of Use](https://github.com/mlvoca/free-llm-api/blob/main/legal/TERMS_OF_USE.md)
- [Privacy Policy](https://github.com/mlvoca/free-llm-api/blob/main/legal/PRIVACY_POLICY.md)
- [Legal Disclosure](https://github.com/mlvoca/free-llm-api/blob/main/legal/IMPRINT.md)
