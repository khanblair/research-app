# ResearchHub - AI-Powered Research Reading Tool

An intelligent research assistant that helps you read, annotate, and cite academic documents with AI-powered features.

## Features

- 📚 **Multi-Format Support** - Read PDF, EPUB, and TXT files
- 🤖 **AI-Powered Q&A** - Ask questions about your documents (Claude Sonnet 4.5)
- ✍️ **Smart Paraphrasing** - Paraphrase text in multiple styles (academic, simple, shorter, formal)
- 📝 **IEEE Citations** - Automatic IEEE-format citations with page/chapter/paragraph references
- 📖 **Bibliography Management** - Auto-generated bibliography with metadata extraction
- 🎨 **Highlighting & Notes** - Color-coded highlights and rich note-taking
- 🔍 **Full-Text Search** - Search across all books, notes, and highlights
- 📤 **Export** - Export notes and bibliography as Markdown or plain text

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS 4, shadcn/ui components
- **Backend**: Convex (real-time database)
- **AI**: Puter.js (Claude Sonnet 4.5)
- **PDF**: pdf.js, EPUB.js, Tesseract.js (OCR)
- **State**: Zustand, React hooks
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Convex account (free tier available)
- Puter.js account (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/research-app.git
cd research-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Convex and Puter.js credentials.

4. Run Convex development server:
```bash
npx convex dev
```

5. In another terminal, run the Next.js development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
research-app/
├── app/                      # Next.js app directory
│   ├── (landing)/           # Public marketing pages
│   ├── (dashboard)/         # Authenticated app pages
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── layout/              # Layout components
│   ├── book/                # Book-related components
│   ├── ai/                  # AI feature components
│   ├── bibliography/        # Citation components
│   ├── notes/               # Note-taking components
│   ├── search/              # Search components
│   └── shared/              # Shared utilities
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   ├── books.ts             # Book CRUD operations
│   ├── notes.ts             # Notes operations
│   ├── highlights.ts        # Highlights operations
│   ├── bibliography.ts      # Citation operations
│   └── search.ts            # Search functionality
├── lib/                     # Frontend utilities
│   ├── puter.ts             # Puter.js client
│   ├── pdf-utils.ts         # PDF processing
│   ├── citation.ts          # IEEE citation formatting
│   ├── export.ts            # Export functionality
│   └── ...                  # Other utilities
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript definitions
├── config/                  # App configuration
└── styles/                  # Additional CSS
```

## Usage

### Uploading Books

1. Navigate to **Library** → **Upload Book**
2. Drag and drop PDF, EPUB, or TXT files
3. Books are automatically processed and stored

### Reading & Annotating

1. Click on any book in your library
2. Use the PDF viewer controls to navigate
3. Select text to create highlights
4. Add notes to any page or highlight

### AI Features

- **Ask Questions**: Select text and ask questions in the AI panel
- **Summarize**: Generate summaries of pages or chapters
- **Paraphrase**: Rephrase text in different styles
- All AI responses include automatic IEEE citations

### Managing Bibliography

1. Navigate to **Bibliography**
2. View all citations from your library
3. Copy citations or export the entire bibliography
4. Citations are automatically generated from book metadata

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Deploying

#### Vercel
```bash
vercel deploy
```

#### Other Platforms
Build the app and deploy the `.next` folder to your hosting platform.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend by [Convex](https://convex.dev)
- AI powered by [Puter.js](https://puter.com)

