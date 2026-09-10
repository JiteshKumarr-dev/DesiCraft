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
  image_url?: string;
  gi_tag?: string;
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
export const VOICE_SAMPLE_PRESETS: Record<LanguageCode, { text: string; label: string; craft: string }> = {
  en: {
    label: 'English (Kadwa Silk Brocade)',
    craft: 'Varanasi Zari & Brocade',
    text: 'I have handwoven a pure mulberry Katan silk Banarasi saree with pure silver zari embroidery using traditional Kadwa technique. It took 45 days of loom work. The base is deep crimson red with sacred Kalga peacock motifs.',
  },
  hi: {
    label: 'हिन्दी (बनारसी कड़वा जरी)',
    craft: 'Varanasi Zari & Brocade',
    text: 'मैंने शुद्ध कतान सिल्क पर असली चांदी की जरी से काढ़वा तकनीक में यह बनारसी साड़ी बनाई है। इसे हथकरघे पर बुनने में 45 दिन लगे हैं। इसका रंग गहरा लाल है और इसमें पारंपरिक मोर के बूटे हैं।',
  },
  te: {
    label: 'తెలుగు (పోచంపల్లి డబుల్ ఇక్కత్)',
    craft: 'Pochampally Ikat',
    text: 'నేను అసలైన మల్బరీ పట్టు దారాలతో, సహజమైన నీలిరంగుతో పోచంపల్లి డబుల్ ఇక్కత్ చీరను మగ్గంపై 35 రోజులు శ్రమించి నేశాను. ఇందులో సంప్రదాయ రేఖాగణిత నమూనాలు ఉన్నాయి.',
  },
  ta: {
    label: 'தமிழ் (தஞ்சாவூர் தங்க ஓவியம்)',
    craft: 'Thanjavur Painting',
    text: 'நான் தூய தேக்கு பலகையில் இயற்கை சுண்ணக்கட்டி மற்றும் 22 காரட் தங்க தகடு பதித்து தஞ்சாவூர் ஓவியம் வரைந்துள்ளேன். இதில் விலைமதிப்பற்ற ரத்தினங்கள் பதிக்கப்பட்டுள்ளன. முடிக்க 25 நாட்கள் ஆனது.',
  },
  kn: {
    label: 'ಕನ್ನಡ (ಚನ್ನಪಟ್ಟಣ ಮರದ ಆಟಿಕೆ)',
    craft: 'Channapatna Toys',
    text: 'ನಾನು ಆಲೆ ಮರದ ಮೇಲೆ ನೈಸರ್ಗಿಕ ಅರಗು ಮತ್ತು ಅರಿಶಿನ, ಕುಂಕುಮ ಬಣ್ಣಗಳಿಂದ ಚನ್ನಪಟ್ಟಣ ಮರದ ರಾಕಿಂಗ್ ಕುದುರೆ ಆಟಿಕೆಯನ್ನು ಲೇತ್ ಯಂತ್ರದಲ್ಲಿ ನಯವಾಗಿ ತಿರುಗಿಸಿ ಮಾಡಿದ್ದೇನೆ. ಇದು ಸಂಪೂರ್ಣ ವಿಷರಹಿತ ನೈಸರ್ಗಿಕ ಕರಕುಶಲ.',
  },
  ml: {
    label: 'മലയാളം (ധോക്ര ലോസ്റ്റ്-വാക്സ്)',
    craft: 'Bastar Dhokra Bell Metal',
    text: 'ഞാൻ പാരമ്പര്യ പിച്ചള ലോഹക്കൂട്ടിൽ മെഴুকുചരട് ചുറ്റി ലോസ്റ്റ് വാക്സ് രീതിയിൽ ധോക്ര ആന ശിൽപം നിർമ്മിച്ചു. ഇത് തയ്യാറാക്കാൻ 20 ദിവസമെടുത്തു.',
  },
  mr: {
    label: 'मराठी (येवला पैठणी साडी)',
    craft: 'Yeola Paithani Silk',
    text: 'मी अस्सल पैठणी सिल्कवर शुद्ध सोन्याच्या जरीने मोरपंखी पदर विणला आहे. हातमागावर हे तयार करायला मला ४० दिवस लागले आहेत. यात पारंपारिक पोपट आणि मोराचे नक्षीकाम आहे.',
  },
  bn: {
    label: 'বাংলা (বাঁকুড়া টেরাকোটা ঘোড়া)',
    craft: 'Bankura Terracotta',
    text: 'আমি বাঁকুড়ার নদীর লাল পলিমাটি দিয়ে নিখুঁত হাত ও চাকার সাহায্যে বিখ্যাত লম্বা কানের বাঁকুড়া টেরাকোটা ঘোড়া তৈরি করেছি। কাঠের আগুনে পোড়াতে ১৫ দিন লেগেছে।',
  },
  gu: {
    label: 'ગુજરાતી (કચ્છ અજરખ બ્લોક પ્રિન્ટ)',
    craft: 'Kutch Ajrakh Block Print',
    text: 'મેં શુદ્ધ સુતરાઉ કાપડ પર કુદરતી ગળી અને દાડમની છાલના રંગોથી 16 તબક્કામાં હાથથી લાકડાના બ્લોક વડે અજરખ દુપટ્ટો છાપ્યો છે. આમાં નક્ષત્ર અને તારાની પરંપરાગત ભાત છે.',
  },
  pa: {
    label: 'ਪੰਜਾਬੀ (ਬਾਗ ਫੁਲਕਾਰੀ ਦੁਪੱਟਾ)',
    craft: 'Bagh Phulkari',
    text: 'ਮੈਂ ਸ਼ੁੱਧ ਖੱਦਰ ਦੇ ਕੱਪੜੇ ਉੱਤੇ ਰੇਸ਼ਮ ਦੇ ਧਾਗਿਆਂ ਨਾਲ ਬਾਗ ਫੁਲਕਾਰੀ ਦੀ ਕਢਾਈ ਹੱਥਾਂ ਨਾਲ ਕੀਤੀ ਹੈ। ਇਸ ਵਿੱਚ 30 ਦਿਨਾਂ ਦੀ ਮਿਹਨਤ ਲੱਗੀ ਹੈ ਅਤੇ ਪਿੱਛੋਂ ਗਿਣ ਕੇ ਕਢਾਈ ਕੀਤੀ ਗਈ ਹੈ।',
  },
};

export const aiServices = {
  /**
   * Voice-to-Structured Listing AI parser
   */
  parseVoiceListing: async (spokenText: string, language: LanguageCode = 'en'): Promise<VoiceParsedListing> => {
    // Realistic AI inference latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lower = spokenText.toLowerCase();

    // 1. Varanasi Brocade / Kadwa Silk
    if (
      lower.includes('banarasi') ||
      lower.includes('zari') ||
      lower.includes('kadwa') ||
      lower.includes('katan') ||
      lower.includes('बनारसी') ||
      lower.includes('साड़ी') ||
      lower.includes('काढ़वा')
    ) {
      return {
        craft_id: 'craft-varanasi-brocade',
        craft_name: 'Varanasi Zari & Brocade',
        name: 'Pure Katan Silk Handwoven Kadwa Zari Saree',
        description: `Masterfully handwoven on traditional wooden pit-loom over 45 days. Features authentic Kadwa embroidery technique with pure silver electroplated Zari thread and auspicious peacock motifs. Certified GI heritage craft of Varanasi.`,
        materials: ['Pure Mulberry Katan Silk', 'Pure Silver Zari (Kalabattun)', 'Botanical Madder Dye'],
        technique: 'Kadwa Pit-Loom Tapestry Brocade Weaving',
        suggested_price: 24500,
        production_time: '45 Days',
        region: 'North',
        confidence_score: 0.98,
        image_url: '/images/kadwa-saree-portrait.jpg',
        gi_tag: 'GI-2009-UP-0044',
      };
    }

    // 2. Pochampally Double Ikat
    if (
      lower.includes('pochampally') ||
      lower.includes('ikat') ||
      lower.includes('ఇక్కత్') ||
      lower.includes('పోచంపల్లి') ||
      lower.includes('chitiki')
    ) {
      return {
        craft_id: 'craft-pochampally-ikat',
        craft_name: 'Pochampally Ikat',
        name: 'Telia Rumal Double Ikat Royal Silk Saree',
        description: `Mathematical double ikat tie-and-dye handwoven on manual tension pit-looms. Yarns are pre-calculated and dyed with authentic indigofera and alizarin madder before weaving. Certified GI craft of Telangana.`,
        materials: ['Pure Mulberry Silk', 'Natural Indigofera Indigo', 'Alizarin Madder Dye'],
        technique: 'Double Ikat Chitiki Tie-and-Dye Weaving',
        suggested_price: 18900,
        production_time: '35 Days',
        region: 'South',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2005-TS-0004',
      };
    }

    // 3. Thanjavur Gold Foil Painting
    if (
      lower.includes('thanjavur') ||
      lower.includes('tanjore') ||
      lower.includes('தஞ்சாவூர்') ||
      lower.includes('ஓவியம்') ||
      lower.includes('தங்கம்') ||
      lower.includes('gold foil')
    ) {
      return {
        craft_id: 'craft-thanjavur-painting',
        craft_name: 'Thanjavur Sacred Painting',
        name: 'Sacred 22K Gold Foil Hand-Embossed Thanjavur Relief Painting',
        description: `Traditional gesso relief artwork crafted on seasoned teakwood board with Arabic gum and unboiled limestone paste. Embellished with 22-karat pure gold leaf foil and Jaipur semi-precious stones. Certified GI craft of Tamil Nadu.`,
        materials: ['Seasoned Teakwood', '22K Pure Gold Foil', 'Semi-Precious Gemstones', 'Natural Chalk Paste'],
        technique: 'Traditional Tanjore Gesso & Gold Leaf Embossing',
        suggested_price: 16500,
        production_time: '25 Days',
        region: 'South',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2007-TN-0082',
      };
    }

    // 4. Channapatna Lacquer Toys
    if (
      lower.includes('channapatna') ||
      lower.includes('toy') ||
      lower.includes('ಆಟಿಕೆ') ||
      lower.includes('ಚನ್ನಪಟ್ಟಣ') ||
      lower.includes('lacquer') ||
      lower.includes('aale mara')
    ) {
      return {
        craft_id: 'craft-channapatna-toys',
        craft_name: 'Channapatna Lacquer Woodcraft',
        name: 'Handmade Non-Toxic Lacquer Turned Wood Rocking Toy Set',
        description: `Handcrafted from soft ivory-wood (Wrightia tinctoria) turned manually on a lathe and buffed with organic shellac infused with natural turmeric, kumkum, and indigo pigments. Completely child-safe and eco-friendly. Certified GI craft of Karnataka.`,
        materials: ['Wrightia Tinctoria (Aale Mara) Wood', 'Natural Shellac Lacquer', 'Organic Turmeric & Indigo Pigments'],
        technique: 'Manual Lathe Turning and Organic Lac-Buffing',
        suggested_price: 3400,
        production_time: '7 Days',
        region: 'South',
        confidence_score: 0.96,
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2006-KA-0012',
      };
    }

    // 5. Bankura Terracotta Horse
    if (
      lower.includes('bankura') ||
      lower.includes('terracotta') ||
      lower.includes('ঘোড়া') ||
      lower.includes('বাঁকুড়া') ||
      lower.includes('টেবাকোটা') ||
      lower.includes('horse')
    ) {
      return {
        craft_id: 'craft-bankura-terracotta',
        craft_name: 'Bankura Terracotta',
        name: 'Panchmura Long-Eared Sacred Terracotta Heritage Horse',
        description: `Hand-thrown on manual potter wheel and coil-moulded with alluvial river clay from Gandheswari. Features iconic elongated ears, symmetrical neck rings, and ceremonial devotion styling fired in traditional wood kilns. Certified GI craft of West Bengal.`,
        materials: ['Gandheswari Alluvial Clay', 'Natural River Silt', 'Organic Husk Temper'],
        technique: 'Hollow Coil Hand-Modelling & Closed Kiln Wood Firing',
        suggested_price: 4200,
        production_time: '15 Days',
        region: 'East',
        confidence_score: 0.96,
        image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2018-WB-0582',
      };
    }

    // 6. Kutch Ajrakh Block Print
    if (
      lower.includes('ajrakh') ||
      lower.includes('kutch') ||
      lower.includes('અજરખ') ||
      lower.includes('બ્લોક') ||
      lower.includes('block print')
    ) {
      return {
        craft_id: 'craft-kutch-ajrakh',
        craft_name: 'Kutch Ajrakh Block Print',
        name: '16-Stage Natural Indigo & Madder Hand-Block Printed Ajrakh Stole',
        description: `Authentic 16-stage resist block-printed textile on lustrous handwoven cotton. Dyed in natural indigo vats and pomegranate rind mordants, stamped with precision hand-carved Teakwood blocks in ancient star geometry. Certified GI craft of Gujarat.`,
        materials: ['Pure Desi Cotton', 'Fermented Indigofera Indigo', 'Pomegranate Rind', 'Rubia Cordifolia Madder'],
        technique: '16-Stage Mud-Resist Hand Block Printing',
        suggested_price: 6800,
        production_time: '21 Days',
        region: 'West',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2011-GJ-0220',
      };
    }

    // 7. Bagh Phulkari
    if (
      lower.includes('phulkari') ||
      lower.includes('bagh') ||
      lower.includes('ਫੁਲਕਾਰੀ') ||
      lower.includes('ਖੱਦਰ') ||
      lower.includes('punjab')
    ) {
      return {
        craft_id: 'craft-punjab-phulkari',
        craft_name: 'Bagh Phulkari Embroidery',
        name: 'Hand-Embroidered Silk Floss Bagh Phulkari Ceremonial Dupatta',
        description: `Ancestral dense geometric counted thread embroidery done purely from the reverse side of handspun Khaddar using untwisted pure silk Pat threads. Forms an unbroken golden garden of floral motifs. Certified GI craft of Punjab.`,
        materials: ['Handspun Khaddar Cotton', 'Untwisted Pat Silk Floss', 'Organic Turmeric & Madder Dyes'],
        technique: 'Counted Reverse Darning Stitch (Bagh)',
        suggested_price: 12800,
        production_time: '30 Days',
        region: 'North',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2011-PB-0239',
      };
    }

    // 8. Yeola Paithani
    if (
      lower.includes('paithani') ||
      lower.includes('पैठणी') ||
      lower.includes('yeola') ||
      lower.includes('मोरपंखी') ||
      lower.includes('पदर')
    ) {
      return {
        craft_id: 'craft-yeola-paithani',
        craft_name: 'Yeola Paithani Silk',
        name: 'Pure Silk Yeola Paithani Saree with Pure Zari Royal Peacock Pallu',
        description: `Regal Maharashtrian handloom masterpiece woven from charkha mulberry silk. Features a dazzling gold tapestry pallu with mor-bangadi (peacock in bangle) motifs woven by interlocking weft without float threads. Certified GI craft of Maharashtra.`,
        materials: ['Charkha Mulberry Silk', 'Pure Silver-Gold Alloy Zari', 'Organic Plant Pigments'],
        technique: 'Interlocking Tapestry Weft Weaving (Dhaap & Padar)',
        suggested_price: 28500,
        production_time: '40 Days',
        region: 'West',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2010-MH-0172',
      };
    }

    // 9. Bastar Dhokra Bell Metal
    if (
      lower.includes('dhokra') ||
      lower.includes('metal') ||
      lower.includes('wax') ||
      lower.includes('ढोकरा') ||
      lower.includes('ശിൽപം') ||
      lower.includes('bastar')
    ) {
      return {
        craft_id: 'craft-bastar-dhokra',
        craft_name: 'Bastar Dhokra Bell Metal',
        name: 'Ancestral Lost-Wax Cast Bell Metal Elephant Figurine',
        description: `Ancestral 4500-year-old Cire Perdue lost-wax brass casting hand-coiled with wild forest beeswax threads and cast in single unrepeatable clay moulds. Certified GI craft of Central India.`,
        materials: ['Recycled Brass Bell Metal', 'Wild Forest Beeswax', 'Termite Mound Alluvial Clay'],
        technique: 'Cire Perdue (Lost-Wax) Single Mould Casting',
        suggested_price: 11500,
        production_time: '20 Days',
        region: 'Central',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2008-CT-0104',
      };
    }

    // 10. Jaipur Blue Pottery
    if (
      lower.includes('blue pottery') ||
      lower.includes('pottery') ||
      lower.includes('quartz') ||
      lower.includes('पॉटरी') ||
      lower.includes('jaipur')
    ) {
      return {
        craft_id: 'craft-jaipur-blue-pottery',
        craft_name: 'Jaipur Blue Pottery',
        name: 'Hand-Painted Cobalt Turquoise Glazed Quartz Ceramic Vessel',
        description: `Authentic non-clay ceramic hand-moulded with ground quartz stone and glass powder, decorated freehand with cobalt oxide floral arabesques and fired at 800°C. Certified GI craft of Rajasthan.`,
        materials: ['Ground Quartz Stone', 'Recycled Glass Powder', 'Katira Natural Gum', 'Cobalt Oxide'],
        technique: 'Non-Clay Hand Moulding and Single-Fire Cobalt Glazing',
        suggested_price: 5200,
        production_time: '12 Days',
        region: 'North',
        confidence_score: 0.95,
        image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2008-RJ-0091',
      };
    }

    // Default Fallback
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
      image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      gi_tag: 'GI-2011-GJ-0220',
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
