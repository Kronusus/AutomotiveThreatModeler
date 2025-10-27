
# Automotive Threat Modeler

Automotive Threat Modeler is a Next.js web application to assist automotive cybersecurity architects in performing Gemini AI-assisted STRIDE threat modeling for vehicle features according to ISO 21434. No authentication or database is required; all data is held in client memory for the session.

## Features

- **Interactive 3-Step Workflow**: Define System → Generate Visualization → Analyze Threats
- Enter a use case (e.g., "Brake the vehicle using foot pedal")
- Define an abstract effect chain (input, behavior, output)
- Describe systems with inputs, outputs, and interfaces
- Generate editable node-link diagrams (Mermaid format) via Gemini AI
- Refine data or directly edit the diagram source code
- Perform STRIDE-based threat modeling under ISO 21434
- **Advanced Filtering**: Filter threats by STRIDE category, property, or search
- View results in a professional table format
- **Multiple Export Formats**: PDF (with tables and diagram), JSON, and CSV

## Prerequisites

- **Node.js** 20 or later
- **pnpm** 10 or later (required - npm/yarn are not supported)

## Installation

1. Clone the repository:
	```bash
	git clone https://github.com/Kronusus/AutomotiveThreatModeler.git
	cd AutomotiveThreatModeler
	```

2. Install dependencies using pnpm:
	```bash
	pnpm install
	```

3. Copy `.env.example` to `.env` and update the API key:
	```bash
	cp .env.example .env
	```
	Then edit `.env` with your actual Gemini API key.

4. Start the development server:
	```bash
	pnpm dev
	```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm clean        # Clean build cache and temporary files
```

## Usage

1. **Step 1: Define System**
   - Fill out the use case description
   - Define the effect chain (input → core logic → output)
   - Add systems with their inputs, outputs, and descriptions
   - Use "Load Example Data" to see a sample brake system

2. **Step 2: Generate Visualization**
   - Click "Generate" to create a Mermaid diagram via AI
   - Edit the diagram source code if needed
   - Copy the diagram for external use

3. **Step 3: Analyze Threats**
   - Click "Analyze Threats" to perform STRIDE analysis
   - Filter results by STRIDE category, property, or search
   - Export results in PDF, JSON, or CSV format

## Environment Variables

- `GEMINI_API_KEY`: Your Gemini API key (required for AI features)

## Technologies

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **Mermaid** for diagram rendering
- **Google Generative AI** (Gemini) for threat analysis
- **pdf-lib** for PDF generation
- **pnpm** for package management

## Project Structure

```
AutomotiveThreatModeler/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (visualization, threat modeling, export)
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ThreatModelResults.tsx
│   ├── VisualizationPanel.tsx
│   └── ...
├── lib/                   # Utility functions
│   ├── exporters.ts      # PDF, CSV, JSON export
│   ├── gemini.ts         # Gemini AI integration
│   └── utils.ts          # Helper utilities
├── .npmrc                # Force pnpm usage
└── package.json          # Dependencies and scripts
```

## License

Distributed under the GNU Affero General Public License v3. See `LICENSE` for details.

## Contributing

This project uses pnpm exclusively. Please ensure you have pnpm installed before contributing.

```bash
npm install -g pnpm@latest
```
