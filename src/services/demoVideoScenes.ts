// DesiCraft - Official SIH Demo Video Scenes & Narration Script
// Master timing, synchronized narration, high-definition visual state configurations, and subtitles

export interface DemoScene {
  id: number;
  key: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  duration: number;  // in seconds
  title: string;
  subtitle: string;
  badge: string;
  narrationText: string;
  captions: { timeOffset: number; text: string }[];
  highlightFeatures: string[];
  themeColor: string;
  category: 'VISION' | 'PROBLEM' | 'ARCHITECTURE' | 'CUSTOMER' | 'ARTISAN' | 'AI_TOOLS' | 'COLLABORATION' | 'IMPACT';
}

export const DEMO_SCENES: DemoScene[] = [
  {
    id: 1,
    key: 'opening',
    startTime: 0,
    endTime: 15,
    duration: 15,
    title: "DESICRAFT: India's Living Heritage & Artisan Technology Ecosystem",
    subtitle: "Empowering 7+ Million Indian Artisans Through Human-Centered AI & Digital Provenance",
    badge: "01 / OPENING CEREMONY",
    narrationText:
      "Welcome to DesiCraft — India’s Living Heritage and Artisan Technology Ecosystem. Across millions of villages, India is home to the world’s most extraordinary handmade traditions.",
    captions: [
      { timeOffset: 0, text: "Welcome to DesiCraft — India’s Living Heritage & Artisan Technology Ecosystem." },
      { timeOffset: 5, text: "Across millions of villages, India is home to the world's most extraordinary handmade traditions." },
      { timeOffset: 10, text: "From Varanasi Katan Silk to Bastar Dhokra, living heritage crafted across generations." },
    ],
    highlightFeatures: [
      "100% GI Tag Lineage Verification",
      "Human-Centered Technology for Indian Artisans",
      "Direct Bridge Between Heritage Masters & Global Connoisseurs",
    ],
    themeColor: '#D97706', // Warm Amber
    category: 'VISION',
  },
  {
    id: 2,
    key: 'the_problem',
    startTime: 15,
    endTime: 35,
    duration: 20,
    title: "The Critical Challenge Facing Indian Artisans",
    subtitle: "Middlemen Exploitation, Pricing Asymmetry & Risk of Extinction",
    badge: "02 / THE PROBLEM",
    narrationText:
      "Yet, master artisans face devastating barriers: limited digital reach, predatory middlemen, difficult product presentation, unfair pricing, lack of collaboration, and the tragic loss of generational knowledge.",
    captions: [
      { timeOffset: 0, text: "Yet, master artisans face devastating barriers across the traditional craft economy:" },
      { timeOffset: 4, text: "Limited digital reach and dependency on predatory intermediaries." },
      { timeOffset: 9, text: "Complex e-commerce tools requiring literacy and heavy English typing." },
      { timeOffset: 14, text: "Unfair price pressure, lack of collaboration, and generational knowledge at risk." },
    ],
    highlightFeatures: [
      "Predatory Middlemen Take 70–85% of Retail Value",
      "Linguistic Exclusion: 90%+ Artisans Do Not Speak English",
      "Unfair Pricing: Zero Calculation of Labor Days & GI Mastery",
      "Geographic Isolation: Zero Cross-Craft Collaboration",
    ],
    themeColor: '#DC2626', // Urgent Crimson
    category: 'PROBLEM',
  },
  {
    id: 3,
    key: 'enter_desicraft',
    startTime: 35,
    endTime: 55,
    duration: 20,
    title: "Enter DesiCraft: One Account, Two Seamless Modes",
    subtitle: "Dual-Reality Architecture with 10 Indian Regional Languages",
    badge: "03 / CORE INNOVATION",
    narrationText:
      "Enter DesiCraft. Available in 10 Indian languages with voice-first accessibility. Through our Universal Account architecture, one single profile provides two powerful experiences: Customer Mode for discovering heirlooms, and Artisan Mode for running a digital craft business.",
    captions: [
      { timeOffset: 0, text: "Enter DesiCraft: Built from the ground up for India's craft ecosystem." },
      { timeOffset: 4, text: "Available natively across 10 Indian regional languages with voice guidance." },
      { timeOffset: 9, text: "Universal Account Architecture: One identity, two synchronized modes." },
      { timeOffset: 14, text: "Customer Mode ⇋ Artisan Mode: Switch seamlessly in a single click." },
    ],
    highlightFeatures: [
      "10 Indian Languages (Hindi, Telugu, Tamil, Kannada, Bengali, etc.)",
      "Universal Identity: Switch Between Connoisseur & Master Maker",
      "Voice-First Ergonomics Designed for Diverse Literacy Levels",
      "Supabase Synchronized Real-time Cloud Architecture",
    ],
    themeColor: '#059669', // Emerald Green
    category: 'ARCHITECTURE',
  },
  {
    id: 4,
    key: 'customer_map',
    startTime: 55,
    endTime: 80,
    duration: 25,
    title: "Customer Experience: Interactive Heritage Map",
    subtitle: "Geographical Craft Discovery & Telangana Pochampally Showcase",
    badge: "04 / DISCOVERY ENGINE",
    narrationText:
      "In Customer Mode, explore India’s crafts geographically. On our Interactive Heritage Map, hover over regions to reveal centuries of craft traditions. Let’s explore Telangana — home to the historic Pochampally Double Ikat Telia Rumal. In one click, view authentic master artisan creations.",
    captions: [
      { timeOffset: 0, text: "Customer Experience: Explore India's living heritage geographically." },
      { timeOffset: 5, text: "Interactive SVG Heritage Map with animated hover states and craft previews." },
      { timeOffset: 12, text: "Selecting Telangana reveals the legendary Pochampally Double Ikat Telia Rumal." },
      { timeOffset: 18, text: "Direct connection to Gaddam Lakshmi Devi and master handloom creations." },
    ],
    highlightFeatures: [
      "Interactive SVG Map of All 28 States & UTs",
      "Curated GI Tag Masterpieces Linked to Regional Soil & History",
      "Pochampally Ikat: 800-Year-Old Nizami Royal Telia Rumal Weave",
      "Instant 1-Click Transition to Product Showcase",
    ],
    themeColor: '#D97706', // Gold Amber
    category: 'CUSTOMER',
  },
  {
    id: 5,
    key: 'digital_passport',
    startTime: 80,
    endTime: 100,
    duration: 20,
    title: "Digital Craft Passport: Cryptographic Provenance",
    subtitle: "Immutable Product Lineage, GOI GI Tag & Blockchain Verification",
    badge: "05 / AUTHENTICITY",
    narrationText:
      "Every masterpiece on DesiCraft is backed by a Digital Craft Passport. It verifies the artisan lineage, GI tag certification, heritage technique, organic materials, and complete artisan story — secured with cryptographic blockchain hashing and scannable QR verification.",
    captions: [
      { timeOffset: 0, text: "Every authentic masterpiece carries an immutable Digital Craft Passport." },
      { timeOffset: 5, text: "Verified: Product → Artisan Lineage → GI Tag → Region → Materials." },
      { timeOffset: 11, text: "Telia Rumal Double Ikat: Pure Mulberry Silk, Natural Indigo & Madder Dyes." },
      { timeOffset: 15, text: "Tamper-proof cryptographic blockchain hash with scannable QR verification." },
    ],
    highlightFeatures: [
      "Government of India GI Tag Certification (GI-2005-TS-0004)",
      "Artisan Lineage Verification: Gaddam Lakshmi Devi",
      "Full Material Transparency: Organic Mulberry Silk & Natural Plant Dyes",
      "Cryptographic Hash & Verifiable Physical QR Integration",
    ],
    themeColor: '#2563EB', // Sapphire Blue
    category: 'CUSTOMER',
  },
  {
    id: 6,
    key: 'artisan_mode',
    startTime: 100,
    endTime: 120,
    duration: 20,
    title: "Artisan Mode: Dedicated Business Studio",
    subtitle: "End-to-End Enterprise Workspace Built for Traditional Creators",
    badge: "06 / ARTISAN COMMAND CENTER",
    narrationText:
      "Now, let’s switch to Artisan Mode. With a single click, artisans unlock an intelligent, dedicated workspace with real-time order tracking, catalog analytics, AI assistance, and direct communication.",
    captions: [
      { timeOffset: 0, text: "Switching to Artisan Mode with one click — zero friction." },
      { timeOffset: 4, text: "Master Rajeshwar Ansari's dedicated artisan command center." },
      { timeOffset: 9, text: "Real-time order lifecycle tracking: Accepted → Preparing → Shipped → Delivered." },
      { timeOffset: 14, text: "Earnings transparency, guild verification, and integrated AI toolsets." },
    ],
    highlightFeatures: [
      "Transparent Revenue Metrics: ₹1,42,800 Net Artisan Earnings",
      "End-to-End Order Progression with Indian Postal Tracking",
      "Direct Artisan Guild & National Master Award Verification",
      "Modular Navigation: Catalog, Orders, AI Studio, Collaborate, Messages",
    ],
    themeColor: '#7C3AED', // Royal Purple
    category: 'ARTISAN',
  },
  {
    id: 7,
    key: 'voice_creator',
    startTime: 120,
    endTime: 140,
    duration: 20,
    title: "AI Voice Product Creator: Voice-to-Catalog",
    subtitle: "Zero Typing Needed: Real-Time Natural Language NLP & Structured Extraction",
    badge: "07 / VOICE AI",
    narrationText:
      "Artisans no longer struggle with typing product listings. Watch our AI Voice Product Creator in action. An artisan speaks in their native tongue: 'Hand-painted Kalamkari cotton dupatta, made using natural dyes and traditional bamboo pen on organic cotton with sacred Tree of Life and peacock motifs. Suggested price is 4800 rupees.' Instantly, our AI extracts title, craft, materials, technique, and pricing into a ready-to-publish digital passport.",
    captions: [
      { timeOffset: 0, text: "Zero typing needed: An artisan speaks naturally in their mother tongue." },
      { timeOffset: 4, text: "Voice Sample: 'Hand-painted Kalamkari cotton dupatta, made using natural dyes...'" },
      { timeOffset: 10, text: "Real-time AI entity extraction: Title, Craft, Materials, Technique, Price." },
      { timeOffset: 15, text: "Instant generation of a compliant, publish-ready Digital Craft Passport." },
    ],
    highlightFeatures: [
      "Voice Sample: Hand-Painted Kalamkari Natural Dye Cotton Dupatta",
      "Auto-extracted: 18 Days Labor, Organic Cotton, Bamboo Pen Technique",
      "Auto-assigned GI Tag: Srikalahasti Kalamkari (GI-2006-AP-0032)",
      "One-Tap Publish to National & Global Marketplace",
    ],
    themeColor: '#059669', // Emerald
    category: 'AI_TOOLS',
  },
  {
    id: 8,
    key: 'fair_price',
    startTime: 140,
    endTime: 155,
    duration: 15,
    title: "AI Fair Price Advisor: Dignified Living Wages",
    subtitle: "Transparent Formula: Materials + Labor Days + GI Mastery Premium",
    badge: "08 / FAIR TRADE AI",
    narrationText:
      "To protect artisans from exploitation, our AI Fair Price Advisor analyzes indigenous raw material costs, handloom labor days, and Geographical Indication complexity to recommend equitable, living-wage market prices.",
    captions: [
      { timeOffset: 0, text: "Ending distress selling and predatory middlemen markups." },
      { timeOffset: 4, text: "AI Fair Price Advisor: Transparent mathematical valuation model." },
      { timeOffset: 8, text: "Raw Materials (₹4,500) + 25 Loom Labor Days + GI Heritage Premium." },
      { timeOffset: 12, text: "Guarantees a dignified living wage for artisan families." },
    ],
    highlightFeatures: [
      "Dynamic Sliders: Material Cost (₹4,500) & Handloom Time (25 Days)",
      "Craft Mastery Multipliers: Skilled Artisan ⇋ Senior Master ⇋ National Awardee",
      "Fair Living Wage Calculation: ₹750/Day Minimum Baseline",
      "Fair Trade Guarantee Badge Certified on Product Listing",
    ],
    themeColor: '#D97706', // Gold
    category: 'AI_TOOLS',
  },
  {
    id: 9,
    key: 'image_studio',
    startTime: 155,
    endTime: 175,
    duration: 20,
    title: "AI Image Studio: Studio Quality from Budget Phones",
    subtitle: "Interactive Split Comparison: Blur Removal, Edge Sharpness & Color Luster",
    badge: "09 / VISION AI",
    narrationText:
      "With our AI Image Studio, artisans transform blurry photos taken on budget smartphones into pristine, studio-quality catalog showcases with an interactive before-and-after split comparison slider.",
    captions: [
      { timeOffset: 0, text: "Studio-grade catalog imagery without expensive studio cameras." },
      { timeOffset: 5, text: "Artisan takes photo with an entry-level smartphone in workshop lighting." },
      { timeOffset: 10, text: "Interactive Split Slider: Compare raw blurry photo vs AI-enhanced result." },
      { timeOffset: 15, text: "+60% sharpness gain, restored natural dye luster & fabric micro-textures." },
    ],
    highlightFeatures: [
      "Interactive Before / After Split Slider with Smooth Realtime Dragging",
      "Sub-Pixel Micro-Deblur Tailored for Handloom Weaves & Zari Sheen",
      "Restores Fermented Plant Dye Radiance without Artificial Hallucinations",
      "Produces 1080p High-Resolution E-Commerce Ready Visuals",
    ],
    themeColor: '#7C3AED', // Purple
    category: 'AI_TOOLS',
  },
  {
    id: 10,
    key: 'collaboration',
    startTime: 175,
    endTime: 200,
    duration: 25,
    title: "Artisan Collaboration Hub & Private Messaging",
    subtitle: "Cross-State Craft Fusion, Interactive Location Cards & Message Deletion",
    badge: "10 / COLLABORATION",
    narrationText:
      "DesiCraft breaks geographic silos. In our Collaboration Hub, a Banarasi silk weaver connects with Pochampally Ikat and Bastar metalcraft artisans. They propose a 'Craft Fusion' collection, accept proposals, and coordinate directly via private messaging with real-time craft cluster location cards and design attachments.",
    captions: [
      { timeOffset: 0, text: "Breaking craft silos: Artisans collaborate across states and materials." },
      { timeOffset: 5, text: "Search across Kalamkari, Pochampally Ikat & Bastar Bell Metal." },
      { timeOffset: 10, text: "Sending & accepting 'Craft Fusion' proposal: Kadwa Silk x Pochampally Ikat." },
      { timeOffset: 16, text: "Private Seller Chat: Interactive cluster location cards & draft file attachments." },
      { timeOffset: 21, text: "Full communication control with unsend / delete message capability." },
    ],
    highlightFeatures: [
      "AI Curator Matchmaker Recommending High-Value Craft Fusions",
      "1-Click Proposal Dispatch: 'Royal Kadwa x Pochampally Festive Stoles'",
      "Artisan-to-Artisan Chat with Pochampally Weavers Colony Map Card",
      "Secure Design Exchange & Message Deletion / Unsend Controls",
    ],
    themeColor: '#0284C7', // Sky Blue
    category: 'COLLABORATION',
  },
  {
    id: 11,
    key: 'opportunities',
    startTime: 200,
    endTime: 215,
    duration: 15,
    title: "Opportunities Radar: Government Schemes & Fairs",
    subtitle: "PM Vishwakarma, ODOP Subsidies & Direct Master Craftsperson Stalls",
    badge: "11 / SCHEMES RADAR",
    narrationText:
      "Our Opportunities Radar automatically scans and surfaces government welfare schemes like PM Vishwakarma, One District One Product initiatives, and upcoming national craft exhibitions.",
    captions: [
      { timeOffset: 0, text: "Opportunities Radar: Real-time government scheme navigator for artisans." },
      { timeOffset: 5, text: "Direct access to PM Vishwakarma ₹3 Lakh collateral-free credit at 5%." },
      { timeOffset: 9, text: "One District One Product (ODOP) export and stall subsidies." },
      { timeOffset: 12, text: "Instant eligibility checks and 1-click application pathways." },
    ],
    highlightFeatures: [
      "PM Vishwakarma: Toolkit Grants & Subsidized Institutional Credit",
      "ODOP Export Subsidies & Ministry of Textiles Fairs (Surajkund, Dilli Haat)",
      "Automated Eligibility Match Based on Artisan Profile Lineage",
      "Zero Red Tape: Direct Application Assistance",
    ],
    themeColor: '#EA580C', // Orange
    category: 'ARTISAN',
  },
  {
    id: 12,
    key: 'multilingual',
    startTime: 215,
    endTime: 230,
    duration: 15,
    title: "Multilingual Inclusivity & Voice Navigation",
    subtitle: "10 Indian Languages: True Digital Equity Across Every Region",
    badge: "12 / INCLUSIVITY",
    narrationText:
      "With 10 Indian languages and voice-guided tours, DesiCraft removes every technological and literacy barrier, welcoming every artisan and craft connoisseur.",
    captions: [
      { timeOffset: 0, text: "True inclusivity: Technology that speaks India's diverse mother tongues." },
      { timeOffset: 4, text: "Full platform translation across Hindi, Telugu, Tamil, Kannada, Bengali..." },
      { timeOffset: 9, text: "Synchronized audio speech synthesis in all 10 regional languages." },
      { timeOffset: 12, text: "Interactive guided voice tours enabling zero-literacy navigation." },
    ],
    highlightFeatures: [
      "10 Native Languages: Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, English",
      "Synchronized Speech Audio with Native Accent Matching",
      "Self-Paced Guided Audio Assistance for Non-Literate Artisans",
      "Every Indian Creator Empowered in Their Own Language",
    ],
    themeColor: '#0D9488', // Teal
    category: 'ARCHITECTURE',
  },
  {
    id: 13,
    key: 'final_impact',
    startTime: 230,
    endTime: 240,
    duration: 10,
    title: "DESICRAFT: India's Living Heritage & Future",
    subtitle: "Heritage Discovered • Artisans Empowered • Technology Unlocking Growth",
    badge: "13 / GRAND FINALE",
    narrationText:
      "DesiCraft is not just another marketplace. It is a digital ecosystem where heritage is discovered, artisans are empowered, technology removes barriers, and creators can grow together.",
    captions: [
      { timeOffset: 0, text: "DesiCraft is not just another marketplace." },
      { timeOffset: 3, text: "It is a digital ecosystem where heritage is discovered, artisans are empowered," },
      { timeOffset: 6, text: "technology removes barriers, and creators can grow together. DesiCraft: India's Living Heritage." },
    ],
    highlightFeatures: [
      "Living Heritage Preserved for Future Generations",
      "Direct Artisan Dignity & Economic Independence",
      "World-Class Indian Technology Built for SIH 2024 / 2026",
      "DesiCraft: Discover • Create • Sell • Collaborate",
    ],
    themeColor: '#D97706', // Radiant Gold
    category: 'IMPACT',
  },
];

export const TOTAL_DEMO_DURATION = 240; // Exactly 4 minutes (3-4 minutes spec)

export function getSceneAtTime(timeSeconds: number): DemoScene {
  const clamped = Math.max(0, Math.min(TOTAL_DEMO_DURATION, timeSeconds));
  const found = DEMO_SCENES.find((s) => clamped >= s.startTime && clamped < s.endTime);
  return found || DEMO_SCENES[DEMO_SCENES.length - 1];
}

export function getCurrentCaption(scene: DemoScene, timeSeconds: number): string {
  const sceneOffset = Math.max(0, timeSeconds - scene.startTime);
  let activeCaption = scene.captions[0]?.text || '';
  for (const cap of scene.captions) {
    if (sceneOffset >= cap.timeOffset) {
      activeCaption = cap.text;
    }
  }
  return activeCaption;
}
