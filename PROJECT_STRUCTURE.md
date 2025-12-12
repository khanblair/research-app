research-app/
│
├── app/
│   ├── (landing)/                          # Public marketing site
│   │   ├── layout.tsx                      # Landing layout (different from app)
│   │   ├── page.tsx                        # Homepage/landing page
│   │   ├── features/
│   │   │   └── page.tsx                    # Features showcase page
│   │   ├── pricing/
│   │   │   └── page.tsx                    # Pricing page (optional)
│   │   ├── about/
│   │   │   └── page.tsx                    # About page
│   │   └── contact/
│   │       └── page.tsx                    # Contact page
│   │
│   ├── (dashboard)/                        # Main authenticated app
│   │   ├── layout.tsx                      # Dashboard layout with sidebar/nav
│   │   ├── page.tsx                        # Dashboard home/overview
│   │   │
│   │   ├── library/                        # Book management
│   │   │   ├── page.tsx                    # Library grid/list view
│   │   │   └── upload/
│   │   │       └── page.tsx                # Upload page
│   │   │
│   │   ├── books/                          # Book reading interface
│   │   │   └── [id]/
│   │   │       ├── page.tsx                # Book reader view
│   │   │       └── layout.tsx              # Reader-specific layout (fullscreen)
│   │   │
│   │   ├── notes/                          # Notes management
│   │   │   ├── page.tsx                    # All notes view
│   │   │   └── [id]/
│   │   │       └── page.tsx                # Single note detail/edit
│   │   │
│   │   ├── bibliography/                   # Bibliography management
│   │   │   ├── page.tsx                    # Bibliography list
│   │   │   └── generate/
│   │   │       └── page.tsx                # Citation generator
│   │   │
│   │   ├── search/                         # Search results
│   │   │   └── page.tsx                    # Global search results
│   │   │
│   │   └── settings/                       # User settings
│   │       ├── page.tsx                    # General settings
│   │       ├── profile/
│   │       │   └── page.tsx                # Profile settings
│   │       └── preferences/
│   │           └── page.tsx                # App preferences
│   │
│   ├── api/                                # API routes (if needed)
│   │   ├── upload/
│   │   │   └── route.ts                    # File upload endpoint
│   │   ├── export/
│   │   │   └── route.ts                    # Export notes/bibliography
│   │   └── ocr/
│   │       └── route.ts                    # OCR processing
│   │
│   ├── layout.tsx                          # Root layout
│   ├── globals.css                         # Global styles
│   ├── favicon.ico
│   └── not-found.tsx                       # 404 page
│
├── components/
│   ├── ui/                                 # Base UI components (shadcn-style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── tooltip.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── progress.tsx
│   │   ├── alert.tsx
│   │   ├── command.tsx                     # Command palette
│   │   ├── popover.tsx
│   │   └── scroll-area.tsx
│   │
│   ├── layout/                             # Layout components
│   │   ├── landing/
│   │   │   ├── Header.tsx                  # Landing page header/navbar
│   │   │   ├── Footer.tsx                  # Landing page footer
│   │   │   ├── Hero.tsx                    # Hero section
│   │   │   ├── Features.tsx                # Features showcase
│   │   │   ├── CTA.tsx                     # Call-to-action sections
│   │   │   └── Testimonials.tsx            # Testimonials (optional)
│   │   │
│   │   └── dashboard/
│   │       ├── Sidebar.tsx                 # Dashboard sidebar nav
│   │       ├── TopNav.tsx                  # Top navigation bar
│   │       ├── MobileNav.tsx               # Mobile hamburger menu
│   │       ├── Breadcrumbs.tsx             # Breadcrumb navigation
│   │       └── UserMenu.tsx                # User profile dropdown
│   │
│   ├── book/                               # Book-related components
│   │   ├── BookCard.tsx                    # Book card for library grid
│   │   ├── BookList.tsx                    # Book list view
│   │   ├── BookUploader.tsx                # Drag-and-drop uploader
│   │   ├── BookMetadataForm.tsx            # Metadata editor
│   │   ├── PDFViewer.tsx                   # PDF viewer component
│   │   ├── PDFControls.tsx                 # Zoom, navigate controls
│   │   ├── TextHighlighter.tsx             # Text selection/highlighting
│   │   ├── HighlightPanel.tsx              # Sidebar with all highlights
│   │   ├── PageNavigator.tsx               # Page navigation UI
│   │   └── BookProgress.tsx                # Reading progress indicator
│   │
│   ├── ai/                                 # AI-powered features
│   │   ├── ChatInterface.tsx               # AI Q&A chat panel
│   │   ├── ChatMessage.tsx                 # Individual chat message
│   │   ├── ParaphrasePanel.tsx             # Paraphrase tool
│   │   ├── ParaphraseStyleSelector.tsx     # Style dropdown (academic, simple, etc.)
│   │   ├── SummaryPanel.tsx                # Summary generator
│   │   ├── QuickActions.tsx                # Quick AI action buttons
│   │   └── AILoading.tsx                   # AI loading states
│   │
│   ├── bibliography/                       # Citation & bibliography
│   │   ├── CitationGenerator.tsx           # IEEE citation form
│   │   ├── CitationCard.tsx                # Individual citation display
│   │   ├── BibliographyList.tsx            # Full bibliography view
│   │   ├── CitationCopyButton.tsx          # Copy citation button
│   │   └── InlineCitation.tsx              # Inline citation badge [1, p. 45]
│   │
│   ├── notes/                              # Note-taking components
│   │   ├── NoteEditor.tsx                  # Rich text note editor
│   │   ├── NoteCard.tsx                    # Note preview card
│   │   ├── NotesList.tsx                   # Notes list view
│   │   ├── NoteFilters.tsx                 # Filter/sort notes
│   │   └── NoteTags.tsx                    # Tag management
│   │
│   ├── search/                             # Search components
│   │   ├── SearchBar.tsx                   # Global search input
│   │   ├── SearchResults.tsx               # Search results list
│   │   ├── SearchFilters.tsx               # Filter search results
│   │   └── SearchHighlight.tsx             # Highlight matches
│   │
│   └── shared/                             # Shared/common components
│       ├── EmptyState.tsx                  # Empty state placeholder
│       ├── ErrorBoundary.tsx               # Error boundary
│       ├── LoadingSpinner.tsx              # Loading indicator
│       ├── ThemeToggle.tsx                 # Light/dark mode toggle
│       ├── FileIcon.tsx                    # File type icons
│       └── ConfirmDialog.tsx               # Confirmation dialogs
│
├── convex/                                 # Convex backend
│   ├── _generated/                         # Auto-generated (gitignored)
│   ├── schema.ts                           # Database schema definitions
│   ├── books.ts                            # Book CRUD operations
│   ├── notes.ts                            # Notes CRUD operations
│   ├── highlights.ts                       # Highlights operations
│   ├── bibliography.ts                     # Bibliography operations
│   ├── search.ts                           # Search functionality
│   ├── metadata.ts                         # Metadata extraction/management
│   ├── http.ts                             # HTTP actions (webhooks)
│   └── lib/
│       ├── utils.ts                        # Backend utilities
│       └── validators.ts                   # Input validation
│
├── lib/                                    # Frontend utilities
│   ├── puter.ts                            # Puter.js SDK initialization
│   ├── pdf-utils.ts                        # PDF processing utilities
│   ├── text-extraction.ts                  # Text extraction logic
│   ├── citation.ts                         # IEEE citation formatting
│   ├── export.ts                           # Export to Markdown/TXT
│   ├── ocr.ts                              # OCR processing
│   ├── file-utils.ts                       # File handling utilities
│   ├── search.ts                           # Client-side search helpers
│   ├── storage.ts                          # localStorage helpers
│   ├── cn.ts                               # Tailwind class merger (shadcn)
│   └── constants.ts                        # App constants
│
├── hooks/                                  # Custom React hooks
│   ├── use-books.ts                        # Book data hooks
│   ├── use-notes.ts                        # Notes hooks
│   ├── use-highlights.ts                   # Highlights hooks
│   ├── use-search.ts                       # Search hooks
│   ├── use-ai.ts                           # Puter.js AI hooks
│   ├── use-pdf.ts                          # PDF viewer hooks
│   ├── use-upload.ts                       # File upload hooks
│   ├── use-theme.ts                        # Theme management
│   ├── use-toast.ts                        # Toast notifications
│   └── use-debounce.ts                     # Debounce utility hook
│
├── types/                                  # TypeScript definitions
│   ├── book.ts                             # Book types
│   ├── note.ts                             # Note types
│   ├── highlight.ts                        # Highlight types
│   ├── citation.ts                         # Citation/bibliography types
│   ├── ai.ts                               # AI request/response types
│   ├── search.ts                           # Search types
│   └── index.ts                            # Barrel exports
│
├── config/                                 # App configuration
│   ├── site.ts                             # Site metadata (name, description, etc.)
│   ├── navigation.ts                       # Navigation menu config
│   └── ai-prompts.ts                       # AI prompt templates
│
├── styles/                                 # Additional styles
│   ├── pdf-viewer.css                      # PDF viewer custom styles
│   └── animations.css                      # Custom animations
│
├── public/                                 # Static assets
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   ├── hero-illustration.svg
│   │   ├── feature-*.svg                   # Feature illustrations
│   │   └── placeholder-book.svg
│   ├── icons/
│   │   ├── file-types/                     # PDF, EPUB, TXT icons
│   │   └── social/                         # Social media icons
│   └── fonts/                              # Custom fonts (if needed)
│
├── .env.local                              # Environment variables (gitignored)
├── .env.example                            # Example env file
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts                      # Tailwind configuration
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json                         # shadcn/ui config
└── README.md