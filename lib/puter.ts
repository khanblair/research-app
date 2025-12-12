// IMPORTANT:
// @heyputer/puter.js registers custom elements (e.g. "puter-dialog") at module-eval time.
// With Next.js + HMR, re-evaluating the module can crash with:
// "the name 'puter-dialog' has already been used with this registry".
// To avoid that, do NOT import the SDK at module scope; lazy-load it in the browser and
// reuse a global singleton (window.puter) when available.

type PuterClient = any;

let puterClient: PuterClient | null = null;
let puterImportPromise: Promise<PuterClient> | null = null;

export const initPuter = async (): Promise<PuterClient | null> => {
  if (typeof window === 'undefined') return null;

  // If Puter is already on window (from a previous load), reuse it.
  if ((window as any).puter) {
    puterClient = (window as any).puter;
    return puterClient;
  }

  if (puterClient) return puterClient;

  if (!puterImportPromise) {
    puterImportPromise = import('@heyputer/puter.js')
      .then((mod: any) => {
        const client = mod?.default ?? mod?.puter ?? mod;
        // The SDK also attaches itself to window in browser environments.
        if ((window as any).puter) {
          puterClient = (window as any).puter;
        } else {
          puterClient = client;
          (window as any).puter = client;
        }
        return puterClient;
      })
      .catch((err: any) => {
        // If HMR caused a duplicate custom element registration, we can often recover by
        // using the already-registered global instance.
        const msg = err?.message || String(err);
        if (msg.includes('CustomElementRegistry') && (window as any).puter) {
          puterClient = (window as any).puter;
          return puterClient;
        }
        throw err;
      });
  }

  return await puterImportPromise;
};

export const getPuter = async (): Promise<PuterClient> => {
  const client = puterClient ?? (await initPuter());
  if (!client) throw new Error('Puter client not initialized');
  return client;
};

// AI Chat with configurable model (defaults to Claude Sonnet 4.5)
export const chatWithAI = async (
  messages: Array<{ role: string; content: string }>,
  options?: { 
    temperature?: number; 
    max_tokens?: number;
    model?: string; // Support different models: 'claude-sonnet-4.5', 'gpt-4', 'gpt-4-turbo', etc.
  }
) => {
  const client = await getPuter();

  try {
    // Check if client.ai exists
    if (!client.ai || !client.ai.chat) {
      console.error('Puter AI not available. Make sure Puter.js is properly initialized.');
      throw new Error('Puter AI service not available. This feature requires a Puter account.');
    }

    const response = await client.ai.chat(messages, {
      model: options?.model || 'claude-sonnet-4.5',
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2000,
    });

    // Handle ChatResponse (non-streaming)
    if (response && typeof response === 'object') {
      // Check for message.content (standard structure)
      if ('message' in response && response.message?.content) {
        const content = response.message.content;
        // Extract text from content if it's an object
        if (typeof content === 'string') {
          return { text: content };
        } else if (Array.isArray(content)) {
          // Handle array of content items
          const textParts = content
              .map(item => {
                if (typeof item === 'string') return item;
                if (item && typeof item === 'object') {
                  if ('text' in item && typeof (item as any).text === 'string') {
                    return (item as any).text;
                  }
                  if ('content' in item && typeof (item as any).content === 'string') {
                    return (item as any).content;
                  }
                }
                return '';
              })
            .filter(Boolean);
          return { text: textParts.join('\n') };
        } else if (typeof content === 'object' && content !== null) {
          // Extract text from object content
          return { text: (content as any).text || JSON.stringify(content) };
        }
      }
      
      // Check for choices array (OpenAI-style format)
      if ('choices' in response && Array.isArray((response as any).choices)) {
        const firstChoice = (response as any).choices[0];
        const content = firstChoice?.message?.content || firstChoice?.text;
        if (content) return { text: content };
      }
      
      // Check for direct text property (some providers/versions)
      if ('text' in response) {
        return { text: (response as any).text };
      }
    }
    
    // For async iterable (streaming), collect chunks
    if (response && Symbol.asyncIterator in response) {
      let fullText = '';
      for await (const chunk of response as AsyncIterable<any>) {
        if (chunk?.text) {
          fullText += chunk.text;
        } else if (chunk?.delta?.content) {
          fullText += chunk.delta.content;
        }
      }
      return { text: fullText };
    }
    
    console.warn('Unexpected AI response format:', response);
    return { text: '' };
  } catch (error: any) {
    // Enhanced error logging
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    console.error('Puter AI chat error:', errorMessage, JSON.stringify(error, null, 2));
    throw new Error(`AI chat failed: ${errorMessage}`);
  }
};

// File upload to Puter cloud storage
export const uploadToPuter = async (file: File): Promise<string> => {
  const client = await getPuter();

  try {
    const uploadedFiles = await client.fs.upload(file);
    // fs.upload returns an array of FSItem objects
    if (Array.isArray(uploadedFiles) && uploadedFiles.length > 0) {
      return uploadedFiles[0].path || uploadedFiles[0].name;
    }
    throw new Error('Upload failed: No files returned');
  } catch (error) {
    console.error('Puter file upload error:', error);
    throw error;
  }
};

export const readBlobFromPuter = async (pathOrUrl: string): Promise<Blob> => {
  const client = await getPuter();

  // If it's already an http(s) URL, fetch it normally.
  if (/^https?:\/\//i.test(pathOrUrl)) {
    const res = await fetch(pathOrUrl);
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
    return await res.blob();
  }

  // blob: URLs are not stable across reloads; they often break.
  if (/^blob:/i.test(pathOrUrl)) {
    throw new Error('This file URL is a temporary blob URL. Please re-upload the file.');
  }

  // Otherwise treat as Puter filesystem path.
  return await client.fs.read(pathOrUrl);
};

// OCR using Puter Vision API
export const performOCR = async (imageUrl: string): Promise<string> => {
  let client: PuterClient;
  try {
    client = await getPuter();
    if (!client?.ai || !client.ai.chat) {
      throw new Error('Puter AI service not available or not authenticated');
    }
  } catch (initErr: any) {
    const msg = initErr?.message || String(initErr);
    console.warn('Puter client initialization failed:', msg);
    throw new Error(`Puter Vision unavailable: ${msg}`);
  }

  try {
    // Use AI chat with vision-capable model for OCR
    const response = await client.ai.chat({
      model: 'claude-sonnet-4.5',
      messages: [
        {
          role: 'user',
          content: `Extract all text from this image accurately, preserving formatting where possible. Image: ${imageUrl}`,
        },
      ],
    });
    
    // Handle both sync and async responses
    if (typeof response === 'object' && 'text' in response) {
      return (response.text as string) || '';
    }
    
    // For async iterable, collect chunks
    if (Symbol.asyncIterator in response) {
      let fullText = '';
      for await (const chunk of response) {
        if ('text' in chunk) {
          fullText += chunk.text;
        }
      }
      return fullText;
    }
    
    return '';
  } catch (error: any) {
    const msg = error?.message || JSON.stringify(error) || String(error);
    console.error('Puter OCR error:', msg, error);
    throw new Error(`Puter OCR failed: ${msg}`);
  }
};
