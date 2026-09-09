import { LanguageCode } from '../types';

export interface VoiceParsedListing {
  craft_id: string;
  craft_name: string;
  name: string;
  description: string;
  materials: string[];
  technique: string;
  suggested_price: number;
  production_time: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Northeast' | 'Central';
  confidence_score: number;
}

export interface PriceBreakdown {
  raw_material_cost: number;
  artisan_labor_days: number;
  daily_fair_wage: number;
  total_labor_cost: number;
  heritage_gi_premium: number;
  recommended_price: number;
  artisan_direct_share_percent: number;
  market_comparison_traditional_retail: number;
}

export interface CollaborationMatch {
  partner_craft_name: string;
  partner_state: string;
  complementary_reason: string;
  joint_product_idea: string;
  estimated_joint_value: string;
}

export interface DemandInsight {
  id: string;
  category: string;
  trend: 'RISING' | 'SURGING' | 'STEADY';
  insight_title: string;
  recommendation: string;
  peak_season: string;
  growth_rate: string;
}

// Simulated Multilingual Speech Recognition Presets for testing
export const VOICE_SAMPLE_PRESETS: Record<LanguageCode, { text: string; label: string }> = {
  en: {
    label: 'English (Voice Simulation)',
    text: 'I have made a pure mulberry silk Banarasi saree with real silver zari embroidery using traditional Kadwa technique. It took 45 days of loom work. The base is deep crimson red and contains sacred peacock motifs.',
  },
  hi: {
    label: 'हिन्दी (Voice Simulation)',
    text: 'मैंने शुद्ध कतान सिल्क पर असली चांदी की जरी से काढ़वा तकनीक में यह बनारसी साड़ी बनाई है। इसे हथकरघे पर बुनने में 45 दिन लगे हैं। इसका रंग गहरा लाल है और इसमें पारंपरिक मोर के बूटे हैं।',
  },
  te: {
    label: 'తెలుగు (Voice Simulation)',
    text: 'నేను అసలైన మల్బరీ పట్టు దారాలతో, సహజమైన నీలిరంగుతో పోచంపల్లి డబుల్ ఇక్కత్ చీరను మగ్గంపై 35 రోజులు శ్రమించి నేశాను. ఇందులో సంప్రదాయ రేఖాగణిత నమూనాలు ఉన్నాయి.',
  },
  ta: {
    label: 'தமிழ் (Voice Simulation)',
    text: 'நான் தூய தேக்கு பலகையில் இயற்கை சுண்ணக்கட்டி மற்றும் 22 காரட் தங்க தகடு பதித்து தஞ்சாவூர் ஓவியம் வரைந்துள்ளேன். இதை முடிக்க 25 நாட்கள் ஆனது.',
  },
  kn: {
    label: 'ಕನ್ನಡ (Voice Simulation)',
    text: 'ನಾನು ಆಲೆ ಮರದ ಮೇಲೆ ನೈಸರ್ಗಿಕ ಅರಗು ಮತ್ತು ಅರಿಶಿನ, ಕುಂಕುಮ ಬಣ್ಣಗಳಿಂದ ಚನ್ನಪಟ್ಟಣ ಮರದ ಆಟಿಕೆಗಳನ್ನು ಲೇತ್ ಯಂತ್ರದಲ್ಲಿ ನಯವಾಗಿ ತಿರುಗಿಸಿ ಮಾಡಿದ್ದೇನೆ.',
  },
  ml: {
    label: 'മലയാളം (Voice Simulation)',
    text: 'ഞാൻ പാരമ്പര്യ പിച്ചള ലോഹക്കൂട്ടിൽ മെഴുകുചരട് ചുറ്റി ലോസ്റ്റ് വാക്സ് രീതിയിൽ ധോക്ര ആന ശിൽപം നിർമ്മിച്ചു. ഇത് തയ്യാറാക്കാൻ 20 ദിവസമെടുത്തു.',
  },
  mr: {
    label: 'मराठी (Voice Simulation)',
    text: 'मी अस्सल पैठणी सिल्कवर शुद्ध सोन्याच्या जरीने मोरपंखी पदर विणला आहे. हातमागावर हे तयार करायला मला ४० दिवस लागले आहेत.',
  },
  bn: {
    label: 'বাংলা (Voice Simulation)',
    text: 'আমি বাঁকুড়ার নদীর লাল পলিমাটি দিয়ে নিখুঁত হাত ও চাকার সাহায্যে বিখ্যাত লম্বা কানের বাঁকুড়া টেরাকোটা ঘোড়া তৈরি করেছি। আগুনে পোড়াতে ১৫ দিন লেগেছে।',
  },
  gu: {
    label: 'ગુજરાતી (Voice Simulation)',
    text: 'મેં શુદ્ધ સુતરાઉ કાપડ પર કુદરતી ગળી અને દાડમની છાલના રંગોથી 16 તબક્કામાં હાથથી લાકડાના બ્લોક વડે અજરખ દુપટ્ટો છાપ્યો છે.',
  },
  pa: {
    label: 'ਪੰਜਾਬੀ (Voice Simulation)',
    text: 'ਮੈਂ ਸ਼ੁੱਧ ਖੱਦਰ ਦੇ ਕੱਪੜੇ ਉੱਤੇ ਰੇਸ਼ਮ ਦੇ ਧਾਗਿਆਂ ਨਾਲ ਬਾਗ ਫੁਲਕਾਰੀ ਦੀ ਕਢਾਈ ਹੱਥਾਂ ਨਾਲ ਕੀਤੀ ਹੈ। ਇਸ ਵਿੱਚ 30 ਦਿਨਾਂ ਦੀ ਮਿਹਨਤ ਲੱਗੀ ਹੈ।',
  },
};

export const aiServices = {
  /**
   * Voice-to-Structured Listing AI parser
   */
  parseVoiceListing: async (spokenText: string, language: LanguageCode = 'en'): Promise<VoiceParsedListing> => {
    // Simulate AI latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = spokenText.toLowerCase();

    if (lower.includes('banarasi') || lower.includes('zari') || lower.includes('kadwa') || lower.includes('बनारसी') || lower.includes('साड़ी')) {
      return {
        craft_id: 'craft-varanasi-brocade',
        craft_name: 'Varanasi Zari & Brocade',
        name: 'Pure Katan Silk Handwoven Kadwa Zari Saree',
        description: `Masterfully handwoven on traditional wooden pit-loom over 45 days. Features Kadwa embroidery technique with pure silver electroplated Zari thread and auspicious peacock motifs. Transcribed via voice listing AI (${language}).`,
        materials: ['Pure Mulberry Katan Silk', 'Pure Silver Zari (Kalabattun)', 'Botanical Dyes'],
        technique: 'Kadwa Pit-Loom Tapestry Brocade',
        suggested_price: 24500,
        production_time: '45 Days',
        region: 'North',
        confidence_score: 0.98,
      };
    }

    if (lower.includes('pochampally') || lower.includes('ikat') || lower.includes('ఇక్కత్') || lower.includes('పోచంపల్లి')) {
      return {
        craft_id: 'craft-pochampally-ikat',
        craft_name: 'Pochampally Ikat',
        name: 'Handloom Pure Silk Double Ikat Heritage Saree',
        description: `Mathematical double ikat tie-and-dye handwoven on pit-looms. Dyed with authentic indigofera and alizarin madder dyes before weaving. Transcribed via voice listing AI (${language}).`,
        materials: ['Pure Mulberry Silk', 'Natural Indigofera Indigo', 'Alizarin Madder Dye'],
        technique: 'Double Ikat Chitiki Weaving',
        suggested_price: 18900,
        production_time: '35 Days',
        region: 'South',
        confidence_score: 0.96,
      };
    }

    if (lower.includes('blue pottery') || lower.includes('pottery') || lower.includes('quartz') || lower.includes('पॉटरी')) {
      return {
        craft_id: 'craft-jaipur-blue-pottery',
        craft_name: 'Jaipur Blue Pottery',
        name: 'Hand-painted Cobalt Turquoise Glazed Quartz Vessel',
        description: `Authentic non-clay ceramic hand-moulded with ground quartz and glass, decorated freehand with cobalt oxide floral arabesques and fired at 800°C. Transcribed via voice listing AI (${language}).`,
        materials: ['Ground Quartz Stone', 'Recycled Glass', 'Katira Gum', 'Cobalt Oxide'],
        technique: 'Freehand Cobalt Hand-Painting and Single-Fire Glaze',
        suggested_price: 5200,
        production_time: '12 Days',
        region: 'North',
        confidence_score: 0.95,
      };
    }

    if (lower.includes('dhokra') || lower.includes('metal') || lower.includes('wax') || lower.includes('ढोकरा') || lower.includes('ശിൽപം')) {
      return {
        craft_id: 'craft-bastar-dhokra',
        craft_name: 'Bastar Dhokra Bell Metal',
        name: 'Tribal Lost-Wax Cast Bell Metal Figurine',
        description: `Ancestral 4500-year-old Cire Perdue lost-wax brass casting hand-coiled with wild forest beeswax threads and cast in single unrepeatable clay moulds. Transcribed via voice listing AI (${language}).`,
        materials: ['Recycled Brass Alloy', 'Forest Beeswax', 'Termite Hill Clay'],
        technique: 'Lost-Wax (Cire Perdue) Single Casting',
        suggested_price: 11500,
        production_time: '20 Days',
        region: 'Central',
        confidence_score: 0.97,
      };
    }

    // Default Fallback intelligent parse
    return {
      craft_id: 'craft-kutch-ajrakh',
      craft_name: 'Kutch Ajrakh Block Print',
      name: 'Artisanal Natural Dye Hand-Block Printed Heritage Stole',
      description: `Pure handcrafted heritage item crafted with indigenous natural materials and time-honored traditional techniques. Extracted from artisan voice description: "${spokenText.slice(0, 120)}..."`,
      materials: ['Pure Natural Desi Cotton', 'Natural Plant Indigo', 'Mineral Mordants'],
      technique: 'Multi-stage Traditional Resist Printing',
      suggested_price: 6800,
      production_time: '21 Days',
      region: 'West',
      confidence_score: 0.92,
    };
  },

  /**
   * AI Fair Price Advisor calculation model
   */
  calculateFairPrice: (
    rawMaterialCost: number,
    laborDays: number,
    craftComplexityLevel: 'MODERATE' | 'HIGH' | 'MASTER' = 'HIGH'
  ): PriceBreakdown => {
    // Government / Fair Trade recommended daily artisan living wage: ~₹650 to ₹900/day
    const dailyWageRate = craftComplexityLevel === 'MASTER' ? 950 : craftComplexityLevel === 'HIGH' ? 780 : 650;
    const totalLaborCost = laborDays * dailyWageRate;
    
    // Heritage / GI Lineage factor: 18% to 28%
    const complexityMultiplier = craftComplexityLevel === 'MASTER' ? 0.28 : craftComplexityLevel === 'HIGH' ? 0.22 : 0.15;
    const heritagePremium = Math.round((rawMaterialCost + totalLaborCost) * complexityMultiplier);

    const recommendedPrice = Math.round((rawMaterialCost + totalLaborCost + heritagePremium) / 50) * 50;
    const artisanDirectShare = Math.round(((totalLaborCost + heritagePremium) / recommendedPrice) * 100);
    const traditionalRetailComparison = Math.round(recommendedPrice * 2.4);

    return {
      raw_material_cost: rawMaterialCost,
      artisan_labor_days: laborDays,
      daily_fair_wage: dailyWageRate,
      total_labor_cost: totalLaborCost,
      heritage_gi_premium: heritagePremium,
      recommended_price: recommendedPrice,
      artisan_direct_share_percent: Math.min(88, Math.max(72, artisanDirectShare)),
      market_comparison_traditional_retail: traditionalRetailComparison,
    };
  },

  /**
   * Artisan-to-Artisan Synergy Matchmaker
   */
  getArtisanSynergyRecommendations: (craftId: string): CollaborationMatch[] => {
    switch (craftId) {
      case 'craft-varanasi-brocade':
        return [
          {
            partner_craft_name: 'Channapatna Lacquer Woodcraft',
            partner_state: 'Karnataka',
            complementary_reason: 'Combines Banarasi metallic brocade clutch purse body with ergonomic organic turned wooden handles and clasps.',
            joint_product_idea: 'Heirloom Kadwa Silk & Polished Amber Wood Evening Minaudière',
            estimated_joint_value: '₹14,500 – ₹18,000',
          },
          {
            partner_craft_name: 'Bidriware Silver Inlay',
            partner_state: 'Karnataka',
            complementary_reason: 'Silver Zari embroidery on Katan silk paired with genuine Bidri oxidized silver medallion brooch closures.',
            joint_product_idea: 'Royal Banarasi Stole with Detachable Handcrafted Bidri Brooch',
            estimated_joint_value: '₹22,000 – ₹28,000',
          },
        ];
      case 'craft-madhubani-painting':
        return [
          {
            partner_craft_name: 'Bastar Dhokra Bell Metal',
            partner_state: 'Chhattisgarh',
            complementary_reason: 'Folk painting canvas framed inside an authentic lost-wax cast tribal bronze border with miniature bells.',
            joint_product_idea: 'Sacred Kalpavriksha Painting in Bastar Bronze Cast Frame',
            estimated_joint_value: '₹16,500 – ₹21,000',
          },
          {
            partner_craft_name: 'Assam Cane & Bamboo Craft',
            partner_state: 'Assam',
            complementary_reason: 'Bamboo paper scrolls hand-painted with Madhubani motifs rolled with woven cane caps.',
            joint_product_idea: 'Traditional Eco-Boutique Bamboo Wall Scroll Art',
            estimated_joint_value: '₹6,500 – ₹9,000',
          },
        ];
      default:
        return [
          {
            partner_craft_name: 'Kutch Ajrakh Block Print',
            partner_state: 'Gujarat',
            complementary_reason: 'Natural indigo vegetable dyed linings accentuating handcrafted leather and wooden accessories.',
            joint_product_idea: 'Hand-carved Wood Stationery Chest Lined with Indigo Ajrakh Fabric',
            estimated_joint_value: '₹8,500 – ₹11,000',
          },
          {
            partner_craft_name: 'Jaipur Blue Pottery',
            partner_state: 'Rajasthan',
            complementary_reason: 'Glazed quartz tile coasters set into brass and reclaimed wood serving trays.',
            joint_product_idea: 'Handcrafted Festive Serving Platter with Blue Pottery Insets',
            estimated_joint_value: '₹7,200 – ₹9,500',
          },
        ];
    }
  },

  /**
   * Real-Time Indian Language Chat Translation
   */
  translateChatMessage: async (
    text: string,
    sourceLang: LanguageCode,
    targetLang: LanguageCode
  ): Promise<string> => {
    if (sourceLang === targetLang) return text;
    // Simulate instantaneous translation latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Sample phrase matching for high-fidelity responses
    const clean = text.trim();

    if (clean.includes('price') || clean.includes('cost') || clean.includes('कीमत') || clean.includes('ధర')) {
      if (targetLang === 'hi') return 'क्या इस हस्तनिर्मित उत्पाद के मूल्य में थोड़ा समायोजन संभव है?';
      if (targetLang === 'te') return 'ఈ చేతితో చేసిన వస్తువు ధరలో సర్దుబాటు సాధ్యమా?';
      if (targetLang === 'ta') return 'இந்த கைவினைப் பொருளின் விலையில் சலுகை கிடைக்குமா?';
      if (targetLang === 'en') return 'Is there any custom size or detail adjustment possible for this price?';
    }

    if (clean.includes('time') || clean.includes('deliver') || clean.includes('दिन') || clean.includes('రోజు')) {
      if (targetLang === 'hi') return 'नमस्ते, इसे हथकरघे पर तैयार करके पहुंचाने में लगभग 15 से 20 दिन का समय लगेगा।';
      if (targetLang === 'te') return 'నమస్కారం, ఇది మగ్గంపై పూర్తిగా తయారు చేయడానికి 15-20 రోజుల సమయం పడుతుంది.';
      if (targetLang === 'ta') return 'வணக்கம், இதை தறியில் நெய்து அனுப்ப 15 முதல் 20 நாட்கள் ஆகும்.';
      if (targetLang === 'en') return 'Namaste, since this is 100% handwoven on pit-looms, it will take about 15-20 days to complete and ship.';
    }

    // High quality contextual fallback with note
    return `[Translated from ${sourceLang.toUpperCase()} to ${targetLang.toUpperCase()}]: ${clean}`;
  },

  /**
   * Heritage Market Pulse: "What Should I Make Next?"
   */
  getDemandInsights: (): DemandInsight[] => [
    {
      id: 'insight-1',
      category: 'Handloom & Textiles',
      trend: 'SURGING',
      insight_title: 'Unstitched Festive Kurta Sets in Kutch Ajrakh & Pochampally',
      recommendation: 'Urban buyers seeking breathable natural dyes for festive wear. Combine natural indigo with mustard yellow or madder red.',
      peak_season: 'Upcoming Festive & Autumn Season (Diwali, Dussehra)',
      growth_rate: '+64% searches this month',
    },
    {
      id: 'insight-2',
      category: 'Folk Paintings & Wall Decor',
      trend: 'RISING',
      insight_title: 'Medium-format Framed Madhubani & Warli Story Canvas',
      recommendation: 'Architects and interior designers are seeking authentic folk art with certificates of provenance for home temples and living rooms.',
      peak_season: 'Year-round New Home Griha Pravesh season',
      growth_rate: '+42% commercial inquiries',
    },
    {
      id: 'insight-3',
      category: 'Eco Toys & Living Art',
      trend: 'SURGING',
      insight_title: 'Non-toxic Channapatna Wooden Desk Organizers & Baby Rattles',
      recommendation: 'Corporate gifting mandates are shifting away from plastic merchandise to GI-tagged sustainable handcrafted wooden accessories.',
      peak_season: 'Quarterly Corporate Gifting Window',
      growth_rate: '+81% bulk requests',
    },
    {
      id: 'insight-4',
      category: 'Metalware & Ritual Heirlooms',
      trend: 'STEADY',
      insight_title: 'Miniature Bastar Dhokra Sculptures with Botanical Accents',
      recommendation: 'High demand for compact brass lost-wax figurines under ₹4,000 for boutique souvenir gifting.',
      peak_season: 'Cultural Tourism & NRI Winter Visits',
      growth_rate: '+29% international orders',
    }
  ],
};
