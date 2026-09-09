# Desi Craft

> **India's Living Heritage & Master Artisan Technology Ecosystem**  
> *Preserving 5,000 years of unbroken craft memory through cryptographic provenance, fair-wage AI transparency, and multimodal accessibility across 10 Indian languages.*

---

## Executive Summary

**Desi Craft** is a next-generation cultural commerce and living heritage platform built to empower traditional Indian master craftspeople—weavers, metallurgists, potters, and folk painters—by bridging ancestral artisan knowledge with cutting-edge web technologies.

The platform eliminates predatory middlemen by connecting conscious patrons directly with authenticated artisans, guaranteed by verifiable **Geographical Indications (GI Tags)** and tamper-evident **Digital Craft Passports**.

---

## Key Architectural Features

### 1. Universal Account • Two Switchable Modes
- **One Account, Dual Persona**: Eliminates fragmented role silos. Every user has a single account that switches instantaneously between:
  - **Marketplace & Patron Mode**: Browse curated GI heirlooms, explore regional traditions, listen to oral stories, and adopt traditional looms.
  - **Master Artisan Studio**: Voice-first product creation, fair price advisors, workshop illumination photo enhancement, and collaborative commissions.

### 2. 10-Language Reactive Localization Engine
- Full dynamic localization across **10 Indian Languages**:
  - **English**, **Hindi (हिन्दी)**, **Telugu (తెలుగు)**, **Tamil (தமிழ்)**, **Kannada (ಕನ್ನಡ)**
  - **Malayalam (മലയാളം)**, **Marathi (मराठी)**, **Bengali (বাংলা)**, **Gujarati (ગુજરાતી)**, **Punjabi (ਪੰਜਾਬੀ)**
- **Dual-Callable Translator Pattern**:
  Combines strongly-typed property access (`t.marketplace`, `t.addToCart`) with dynamic natural-language dictionary lookup without runtime overhead.

### 3. Cryptographic Digital Craft Passports & Physical QR Traceability
- Every mastercraft features a verifiable **Digital Craft Passport**:
  - Artisan lineage, geographic coordinates, and master guild credentials.
  - Transparent value breakdown: Fair labor wages, natural material cost, and cultural preservation premium.
  - Physical QR code scanner for instant field verification of authentic GI tags.

### 4. AI-Powered Master Artisan Studio
- **Voice Product Creator**: Speak in any regional Indian language to automatically extract craft techniques, materials, care instructions, and generate listings.
- **Fair Price Advisor**: Intelligent cost breakdown ensuring zero artisan exploitation.
- **Studio Lighting Enhancer**: One-tap simulation converting workshop photos into clean exhibition-grade showcase imagery.

### 5. Oral Living Memory Player
- Preserves intangible cultural memory by playing artisan master stories in their native dialect and rhythm using browser Web Speech Synthesis and curated storytelling scripts.

### 6. National Cultural Radar & Government Schemes
- Integrated tracking of Central and State government welfare and grant programs:
  - **PM Vishwakarma Portal**
  - **One District One Product (ODOP)**
  - **Development Commissioner (Handicrafts)**
  - **GI Registry India**

---

## Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | React 18 / 19 + TypeScript |
| **Bundler & Tooling** | Vite 6 |
| **Styling** | Tailwind CSS + Custom Living Heritage Design Tokens |
| **Icons** | Lucide React |
| **State Architecture** | React Context API with persistent state |
| **Speech & Audio** | Multilingual Web Speech Synthesis API |

---

## Getting Started

### Prerequisites
- Node.js: v18.0.0 or later
- npm: v9.0.0 or later

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JiteshKumarr-dev/DesiCraft.git
   cd DesiCraft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Repository Structure

```text
DesiCraft/
├── public/                     # Static heritage imagery and assets
├── src/
│   ├── components/
│   │   ├── artisan/            # Artisan Studio (Voice Creator, Price Advisor, Photo Enhancer)
│   │   ├── common/             # Global components (Header, Footer, AuthModal, QR, Passport)
│   │   └── customer/           # Patron experience (CustomerHome, StateExplorer, LearningView)
│   ├── context/
│   │   └── AppContext.tsx      # Central reactive state & localization provider
│   ├── data/
│   │   ├── mockData.ts         # Master artisan lineages, GI crafts, and passports
│   │   └── translations.ts     # 10 Indian languages translations & dual callable engine
│   ├── types/
│   │   └── index.ts            # TypeScript domain models and schemas
│   ├── App.tsx                 # Root platform component
│   ├── index.css               # Heritage design system & Tailwind styling
│   └── main.tsx                # Application entry point
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Living Heritage Code of Ethics

All contributions must adhere to the **Desi Craft Code of Cultural Respect**:
1. Zero misrepresentation of unverified industrial goods as handmade or GI-tagged.
2. Protection of artisan intellectual property and oral heritage rights.
3. Accessible UI across bandwidth levels and Indian languages.

---

## License & Attribution

Designed and developed with care for India's master craftspeople.
Copyright 2026 Desi Craft - National Heritage Technology Initiative.
