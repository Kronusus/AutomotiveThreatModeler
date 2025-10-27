
# Automotive Threat Modeler

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10.13-f69220?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

A Next.js web application to assist automotive cybersecurity architects in performing AI-assisted STRIDE threat modeling for vehicle features according to ISO 21434. No authentication or database required—all data is held in client memory for the session.

## ✨ Features

- 🔄 **Interactive 3-Step Workflow**: Define System → Generate Visualization → Analyze Threats
- 🎯 **Use Case Definition**: Describe automotive scenarios (e.g., "Brake the vehicle using foot pedal")
- 🔗 **Effect Chain Modeling**: Define input → processing → output relationships
- 🏗️ **System Architecture**: Describe systems with inputs, outputs, and interfaces
- 🤖 **AI-Powered Visualization**: Generate editable Mermaid diagrams via Gemini AI
- ✏️ **Diagram Editing**: Refine data or directly edit diagram source code
- 🛡️ **STRIDE Analysis**: Perform ISO 21434-compliant threat modeling
- 📊 **Professional Results**: View threats in a comprehensive table format
- 📦 **Multiple Export Formats**: PDF (with tables and diagram), JSON, and CSV
- 🚀 **Lightweight**: No database or authentication required—runs entirely in browser

## 📋 Prerequisites

- **Node.js** 20.0.0 or later
- **pnpm** 10.0.0 or later (required - npm/yarn not supported)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Kronusus/AutomotiveThreatModeler.git
cd AutomotiveThreatModeler

# Install dependencies with pnpm
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# Start the development server
pnpm dev

# Open http://localhost:3000 in your browser
```

## 📖 Usage Guide

### Step 1: Define System
- Fill out the **use case description** (e.g., brake system operation)
- Define the **effect chain**: input → core logic → output
- Add **systems** with their inputs, outputs, and descriptions
- 💡 **Tip**: Use "Load Example Data" to see a sample brake system

### Step 2: Generate Visualization
- Click **"Generate Diagram"** to create a Mermaid diagram via AI
- Review and **edit the diagram** source code if needed
- Copy the diagram for use in external documentation

### Step 3: Analyze Threats
- Click **"Analyze Threats"** to perform STRIDE analysis
- Review identified **security threats** in the results table
- **Export results** in PDF, JSON, or CSV format for documentation

## ⚙️ Environment Variables

Create a `.env.local` or `.env` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

> **Note**: Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 📁 Project Structure

```
AutomotiveThreatModeler/
├── app/
│   ├── api/
│   │   ├── export/       # Export functionality (PDF, CSV, JSON)
│   │   ├── threatmodel/  # STRIDE threat analysis endpoint
│   │   └── visualization/# Diagram generation endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main application UI
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── EffectChainForm.tsx
│   ├── FormSection.tsx
│   ├── StepCard.tsx
│   ├── SystemsForm.tsx
│   ├── ThreatModelResults.tsx
│   ├── UseCaseForm.tsx
│   └── VisualizationPanel.tsx
├── lib/
│   ├── constants.ts      # Example data and configuration
│   ├── exporters.ts      # Export utilities (PDF, CSV, JSON)
│   ├── gemini.ts         # Gemini AI integration
│   ├── hooks.ts          # Custom React hooks
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   ├── validateDiagram.ts
│   └── validateThreatModel.ts
├── .npmrc                # Force pnpm usage
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 📄 License

Distributed under the **GNU Affero General Public License v3.0**. See [`LICENSE`](LICENSE) for details.

## 🔗 Links

- **Repository**: [github.com/Kronusus/AutomotiveThreatModeler](https://github.com/Kronusus/AutomotiveThreatModeler)
- **Issues**: [Report a bug or request a feature](https://github.com/Kronusus/AutomotiveThreatModeler/issues)
- **Gemini AI**: [Google AI Studio](https://aistudio.google.com/)
- **ISO 21434**: [Road vehicles — Cybersecurity engineering](https://www.iso.org/standard/70918.html)

---

<div align="center">
  <p>Built with ❤️ for automotive cybersecurity professionals</p>
  <p>
    <a href="https://nextjs.org">Next.js</a> •
    <a href="https://react.dev">React</a> •
    <a href="https://tailwindcss.com">Tailwind CSS</a> •
    <a href="https://ui.shadcn.com">shadcn/ui</a>
  </p>
</div>
