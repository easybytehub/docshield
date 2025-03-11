# DocShield - Advanced Open-Source Watermarking Solution

DocShield is an open-source tool designed to safeguard documents and images with intelligent watermarking techniques that resist AI-based removal. It ensures document integrity and authenticity by making unauthorized modifications significantly more challenging.

## Key Features
- **Custom Watermarking:** Apply configurable, text-based watermarks tailored to your needs.
- **AI-Resistant Technology:** Uses advanced wavy patterns and grayscale masking to enhance security.
- **Intuitive Interface:** Drag-and-drop support for seamless image uploads and processing.
- **Optimized Performance:** Fast and efficient image processing.
- **Self-Hosted & Open-Source:** Deploy and customize the solution to fit your specific requirements.

## How It Works
1. Upload an image (PNG, JPG).
2. Enter custom watermark text or use the default option.
3. The system applies the watermark using:
    - Repeated text overlays.
    - Wavy distortions for enhanced protection.
    - Grayscale masking to obscure potential erasure attempts.
4. Download the protected document securely.

## Installation & Setup
### Prerequisites
- **Node.js** (v16 or later)
- **Next.js** framework
- **Tailwind CSS** for modern styling
- **Shadcn/ui** for UI components
- **React Compare Slider** for interactive visualization

### Quick Start
```sh
git clone https://github.com/easybytehub/docshield.git
cd docshield
npm install
npm run dev
```

## Usage
1. Open `http://localhost:3000` in your browser.
2. Upload an image via drag-and-drop or manual selection.
3. Enter a watermark text and process the image.
4. Preview and download the secured document.

## Technology Stack
- **Next.js** - Server-side rendering and optimized performance.
- **TypeScript** - Ensures reliability and maintainability.
- **Tailwind CSS** - Modern, utility-first styling framework.
- **Canvas API** - Efficient client-side image processing.
- **React Compare Slider** - Smooth image comparison experience.
- **Shadcn/ui** - Minimalistic and elegant UI components.

## Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to your branch: `git push origin feature-branch`
5. Submit a pull request for review.

## License
DocShield is distributed under the **GPL-3.0 license**.

## Acknowledgments
Developed and maintained by **[Javier Miralles](https://www.linkedin.com/in/javier-miralles-rancano/)**. An Open Source project by **EasyByte Hub**. Learn more at [EasyByte Hub](https://easybyte.es).

---

🔗 GitHub Repository: [DocShield](https://github.com/easybytehub/docshield)

