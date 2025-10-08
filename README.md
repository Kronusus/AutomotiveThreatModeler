
# Automotive Threat Modeler

Automotive Threat Modeler is a Next.js web application to assist automotive cybersecurity architects in performing Gemini AI-assisted STRIDE threat modeling for vehicle features according to ISO 21434. No authentication or database is required; all data is held in client memory for the session.

## Features

- Enter a use case (e.g., "Brake the vehicle using foot pedal")
- Define an abstract effect chain (input, behavior, output)
- Describe systems (inputs, outputs, interfaces)
- Generate editable node-link diagrams (Mermaid format) via Gemini AI
- Refine data or directly edit the diagram
- Perform STRIDE-based threat modeling under ISO 21434
- View results in a table (assets, properties, threats, reasoning, damage scenarios)
- Export results to PDF or CSV

## Setup

1. Clone the repository:
	```bash
	git clone https://github.com/Kronusus/AutomotiveThreatModeler.git
	cd AutomotiveThreatModeler
	```
2. Install dependencies:
	```bash
	pnpm install
	# or npm install / yarn install
	```
3. Add your Gemini API key to `.env`:
	```env
	GEMINI_API_KEY=your-gemini-api-key-here
	```
4. Start the development server:
	```bash
	pnpm dev
	# or npm run dev / yarn dev
	```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Fill out the use case, effect chain, and systems forms
2. Click **Generate Visualization** to create a diagram
3. Edit/refine the diagram as needed
4. Click **Perform Threat Modeling** to analyze threats
5. View results and export as PDF/CSV

## Environment Variables

- `GEMINI_API_KEY`: Your Gemini API key (required for AI features)

## Technologies

- Next.js (App Router, TypeScript)
- Tailwind CSS
- mermaid, mermaid-react (diagram rendering)
- Google Generative AI (Gemini)as

## License

Distributed under the GNU Affero General Public License v3. See `LICENSE` for details.
