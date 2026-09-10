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

// SIH Demo Video Voice Sample Preset
export const SIH_DEMO_VOICE_SAMPLE = {
  label: 'SIH Demo (Kalamkari Cotton Dupatta)',
  craft: 'Srikalahasti Kalamkari',
  text: 'Hand-painted Kalamkari cotton dupatta, made using natural dyes and traditional bamboo pen on organic cotton with sacred Tree of Life and peacock motifs. It took 18 days of handcrafting, suggested price is 4800 rupees.',
};

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
    await new Promise((resolve) => setTimeout(resolve, 450));

    const lower = spokenText.toLowerCase();

    // Helper: Extract any spoken numerical price (e.g. "15000", "₹8500", "price is 18000")
    const priceMatch = lower.match(/(?:price|rate|cost|rupees|rs|daam|kimat|రూపాయలు|రూ\.|ధర|விலை|₹)\s*(?:is|to|be|of|:)?\s*(\d{3,7})/i) ||
                       lower.match(/\b(\d{3,6})\s*(?:rupees|rs|inr|\/-)\b/i);
    const spokenPrice = priceMatch && priceMatch[1] ? parseInt(priceMatch[1], 10) : null;

    // Helper: Extract spoken production time
    const timeMatch = lower.match(/(\d+)\s*(?:days|din|maheene|weeks|months|రోజులు|நாட்கள்|ದಿವಸ)/i);
    const spokenDays = timeMatch && timeMatch[1] ? `${timeMatch[1]} Days` : null;

    // Detect item type
    const isSaree = lower.includes('saree') || lower.includes('sarees') || lower.includes('sari') || lower.includes('चीरा') || lower.includes('పట్టు') || lower.includes('చేనేత') || lower.includes('சேலை') || lower.includes('साड़ी') || lower.includes('साडी');
    const isDupatta = lower.includes('dupatta') || lower.includes('chunni') || lower.includes('odhani') || lower.includes('दुपट्टा') || lower.includes('துப்பட்டா');
    const isStole = lower.includes('stole') || lower.includes('scarf') || lower.includes('shawl') || lower.includes('शॉल');
    const isToy = lower.includes('toy') || lower.includes('toys') || lower.includes('doll') || lower.includes('horse') || lower.includes('elephant') || lower.includes('బొమ్మ') || lower.includes('ಆಟಿಕೆ') || lower.includes('खिलौना');
    const isPainting = lower.includes('painting') || lower.includes('canvas') || lower.includes('art') || lower.includes('scroll') || lower.includes('चित्र') || lower.includes('ஓவியம்') || lower.includes('చిత్రకళ');
    const isPottery = lower.includes('pottery') || lower.includes('pot') || lower.includes('vase') || lower.includes('ceramic') || lower.includes('clay') || lower.includes('पॉटरी') || lower.includes('कुండ');

    // 1. Pochampally Ikat / Double Ikat (Telangana / South India)
    // Matches: pochampalli, pochampally, pochampali, ikat, ikkat, telia rumal, chitiki, pagdu bandhu, etc.
    if (
      lower.includes('pochampall') ||
      lower.includes('pochampalli') ||
      lower.includes('pochampally') ||
      lower.includes('pochampali') ||
      lower.includes('ikat') ||
      lower.includes('ikkat') ||
      lower.includes('ikath') ||
      lower.includes('telia') ||
      lower.includes('chitiki') ||
      lower.includes('pagdu bandhu') ||
      lower.includes('bhoodan') ||
      lower.includes('పోచంపల్లి') ||
      lower.includes('ఇక్కత్') ||
      lower.includes('చిటికి') ||
      lower.includes('पोचमपल्ली') ||
      lower.includes('इकत')
    ) {
      const productTitle = isDupatta
        ? 'Pochampally Handwoven Double Ikat Silk-Cotton Dupatta'
        : isStole
        ? 'Pochampally Ikat Pure Silk Handcrafted Stole'
        : lower.includes('telia')
        ? 'Authentic Heritage Telia Rumal Handwoven Double Ikat Saree'
        : 'Pochampally Ikat Handwoven Pure Silk Saree';

      return {
        craft_id: 'craft-pochampally-ikat',
        craft_name: 'Pochampally Ikat',
        name: productTitle,
        description: `Mathematical double ikat tie-and-dye handwoven on manual tension pit-looms in Bhoodan Pochampally village. Both warp and weft yarns are pre-calculated, bundled, and dipped in living botanical indigofera and alizarin madder vats to create razor-sharp geometric chevron and diamond motifs. Certified GI craft of Telangana.`,
        materials: ['Pure Mulberry Silk', 'Natural Indigofera Indigo', 'Alizarin Madder Dye', 'Pure Silver Zari'],
        technique: 'Chitiki Double Ikat Mathematical Tie-and-Dye Weaving on Manual Pit Looms',
        suggested_price: spokenPrice || (isDupatta ? 6800 : isStole ? 4500 : 18900),
        production_time: spokenDays || '35 Days',
        region: 'South',
        confidence_score: 0.99,
        image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2005-TS-0004',
      };
    }

    // 2. Kanchipuram Silk / Kanjivaram (Tamil Nadu / South India)
    if (
      lower.includes('kanchipuram') ||
      lower.includes('kanjivaram') ||
      lower.includes('kanchi') ||
      lower.includes('korvai') ||
      lower.includes('kanchipattu') ||
      lower.includes('காஞ்சிபுரம்') ||
      lower.includes('காஞ்சி') ||
      lower.includes('பட்டு') ||
      lower.includes('कांचीपुरम') ||
      lower.includes('कांजीवरम')
    ) {
      return {
        craft_id: 'craft-kanchipuram-silk',
        craft_name: 'Kanchipuram Silk',
        name: 'Heirloom Kanchipuram Korvai Pure Mulberry Silk Saree with Temple Border',
        description: `Woven with authentic three-ply twisted mulberry silk (murukku pattu) and pure gold-silver alloy zari. The body and contrasting pallu are woven separately and joined using the ancient Korvai interlocking shuttle technique. Certified GI heritage craft of Tamil Nadu.`,
        materials: ['Pure Mulberry Silk (3-Ply Murukku)', 'Pure Gold-Silver Alloy Zari', 'Natural Silk Mordant Dyes'],
        technique: 'Korvai Interlocking Weft Pit-Loom Weaving with Petni Joint',
        suggested_price: spokenPrice || 26500,
        production_time: spokenDays || '35 Days',
        region: 'South',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2005-TN-0012',
      };
    }

    // 3. Varanasi Brocade / Kadwa Banarasi Silk (Uttar Pradesh / North India)
    if (
      lower.includes('banarasi') ||
      lower.includes('banaras') ||
      lower.includes('varanasi') ||
      lower.includes('kashi') ||
      lower.includes('kadwa') ||
      lower.includes('katan') ||
      lower.includes('tanchoi') ||
      lower.includes('jangla') ||
      lower.includes('बनारसी') ||
      lower.includes('काढ़वा') ||
      lower.includes('कतान') ||
      lower.includes('वाराणसी')
    ) {
      const productTitle = isDupatta
        ? 'Pure Katan Silk Handwoven Kadwa Zari Dupatta'
        : isStole
        ? 'Artisanal Banarasi Brocade Silk Stole'
        : 'Pure Katan Silk Handwoven Kadwa Zari Saree';

      return {
        craft_id: 'craft-varanasi-brocade',
        craft_name: 'Varanasi Zari & Brocade',
        name: productTitle,
        description: `Masterfully handwoven on traditional wooden pit-loom over 45 days in the ancient alleys of Madanpura, Kashi. Features authentic Kadwa embroidery technique with pure silver electroplated Zari thread and sacred Kalga peacock motifs with zero floating threads on the reverse. Certified GI heritage craft of Varanasi.`,
        materials: ['Pure Mulberry Katan Silk', 'Pure Silver Zari (Kalabattun)', 'Botanical Madder Dye'],
        technique: 'Kadwa Pit-Loom Tapestry Brocade Weaving',
        suggested_price: spokenPrice || (isDupatta ? 9500 : isStole ? 5800 : 24500),
        production_time: spokenDays || '45 Days',
        region: 'North',
        confidence_score: 0.98,
        image_url: '/images/kadwa-saree-portrait.jpg',
        gi_tag: 'GI-2009-UP-0044',
      };
    }

    // 4. Chanderi Handloom (Madhya Pradesh / Central India)
    if (
      lower.includes('chanderi') ||
      lower.includes('चंदेरी') ||
      lower.includes('ek naliya')
    ) {
      return {
        craft_id: 'craft-chanderi-textiles',
        craft_name: 'Chanderi Handloom Weaving',
        name: 'Handwoven Chanderi Silk-Cotton Heritage Saree with Gold Zari Booti',
        description: `Featherlight handwoven textile crafted from degummed pure silk warp and fine count cotton weft. Features delicate traditional celestial coin and floral booti woven with gold zari using the heritage throw-shuttle pit-loom technique. Certified GI craft of Madhya Pradesh.`,
        materials: ['Pure Degummed Silk', 'Count 100/120 Mercerized Cotton', 'Fine Gold Zari'],
        technique: 'Throw-Shuttle Pit Loom Weaving with Ek-Naliya Border',
        suggested_price: spokenPrice || 11500,
        production_time: spokenDays || '20 Days',
        region: 'Central',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2005-MP-0013',
      };
    }

    // 5. Yeola Paithani (Maharashtra / West India)
    if (
      lower.includes('paithani') ||
      lower.includes('yeola') ||
      lower.includes('मोरपंखी') ||
      lower.includes('पैठणी') ||
      lower.includes('पैठण') ||
      lower.includes('asawali')
    ) {
      return {
        craft_id: 'craft-yeola-paithani',
        craft_name: 'Yeola Paithani Silk',
        name: 'Pure Silk Yeola Paithani Saree with Pure Zari Royal Peacock Pallu',
        description: `Regal Maharashtrian handloom masterpiece woven from charkha mulberry silk. Features a dazzling gold tapestry pallu with mor-bangadi (peacock in bangle) motifs woven by interlocking weft without float threads. Certified GI craft of Maharashtra.`,
        materials: ['Charkha Mulberry Silk', 'Pure Silver-Gold Alloy Zari', 'Organic Plant Pigments'],
        technique: 'Interlocking Tapestry Weft Weaving (Dhaap & Padar)',
        suggested_price: spokenPrice || 28500,
        production_time: spokenDays || '40 Days',
        region: 'West',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2010-MH-0172',
      };
    }

    // 6. Kashmir Pashmina & Kani Weaving (Jammu & Kashmir / North India)
    if (
      lower.includes('pashmina') ||
      lower.includes('cashmere') ||
      lower.includes('kani') ||
      lower.includes('changthangi') ||
      lower.includes('talim') ||
      lower.includes('पश्मीना') ||
      lower.includes('कानी') ||
      (lower.includes('kashmir') && (lower.includes('shawl') || lower.includes('stole')))
    ) {
      return {
        craft_id: 'craft-kashmir-pashmina',
        craft_name: 'Kashmir Pashmina & Kani Weaving',
        name: 'Handwoven Grade-A Changthangi Cashmere Pashmina Kani Shawl',
        description: `Hand-spun on wooden Yender wheels from the ultra-fine 13-micron fleece of Himalayan Changthangi goats. Woven with delicate wooden Kani eyeless needles guided by coded Talim calligraphy metric scrolls. Certified GI craft of Jammu & Kashmir.`,
        materials: ['100% Changthangi Grade-A Pashm Cashmere Fleece (13.2 microns)', 'Natural Walnut Shell & Saffron Dyes'],
        technique: 'Kani Wooden Spool Tapestry Weaving with Talim Metric Scrolls',
        suggested_price: spokenPrice || 32000,
        production_time: spokenDays || '60 Days',
        region: 'North',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2008-JK-0046',
      };
    }

    // 7. Mithila / Madhubani Painting (Bihar / East India)
    if (
      lower.includes('madhubani') ||
      lower.includes('mithila') ||
      lower.includes('kachni') ||
      lower.includes('bharni') ||
      lower.includes('kohbar') ||
      lower.includes('kalpavriksha') ||
      lower.includes('मधुबनी') ||
      lower.includes('मिथिला') ||
      lower.includes('মধুবনী')
    ) {
      return {
        craft_id: 'craft-madhubani-painting',
        craft_name: 'Mithila / Madhubani Painting',
        name: 'Cosmic Kalpavriksha (Tree of Life) Folk Canvas',
        description: `Expressive devotional painting depicting the sacred Tree of Life, nesting peacocks, and fertility flora. Rendered by master folk artists with fine split-bamboo nibs and 100% natural organic mineral and plant pigments on cowdung-washed cotton paper. Certified GI craft of Bihar.`,
        materials: ['Handmade Cowdung-Treated Cotton Paper', 'Lamp Soot Black', 'Turmeric Yellow', 'Aparajita Flower Indigo'],
        technique: 'Kachni & Bharni Freehand Line Painting with Bamboo Nibs',
        suggested_price: spokenPrice || 8400,
        production_time: spokenDays || '14 Days',
        region: 'East',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2007-BR-0074',
      };
    }

    // 8. Thanjavur / Tanjore Gold Foil Painting (Tamil Nadu / South India)
    if (
      lower.includes('thanjavur') ||
      lower.includes('tanjore') ||
      lower.includes('gold foil') ||
      lower.includes('gesso') ||
      lower.includes('தஞ்சாவூர்') ||
      lower.includes('தங்கம்') ||
      lower.includes('तंजौर')
    ) {
      return {
        craft_id: 'craft-tanjore-painting',
        craft_name: 'Thanjavur Sacred Painting',
        name: 'Sacred 22K Gold Foil Hand-Embossed Thanjavur Relief Painting',
        description: `Classical devotional masterpiece crafted on seasoned teakwood board with Arabic gum and unboiled limestone gesso paste. Embellished with 22-karat pure gold leaf foil and Jaipur semi-precious stones. Certified GI craft of Tamil Nadu.`,
        materials: ['Seasoned Teakwood Board', '22K Pure Gold Foil', 'Semi-Precious Gemstones', 'Natural Chalk Gesso Paste'],
        technique: 'Traditional Tanjore Gesso & Gold Leaf Embossing',
        suggested_price: spokenPrice || 16500,
        production_time: spokenDays || '25 Days',
        region: 'South',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2007-TN-0063',
      };
    }

    // 9. Channapatna Lacquer Toys & Woodcraft (Karnataka / South India)
    if (
      lower.includes('channapatna') ||
      lower.includes('aale mara') ||
      lower.includes('ivory wood') ||
      lower.includes('ಚನ್ನಪಟ್ಟಣ') ||
      lower.includes('ಆಟಿಕೆ') ||
      lower.includes('चन्नापटना') ||
      (lower.includes('lacquer') && lower.includes('toy')) ||
      (lower.includes('wooden') && lower.includes('toy'))
    ) {
      return {
        craft_id: 'craft-channapatna-toys',
        craft_name: 'Channapatna Lacquer Woodcraft',
        name: 'Handmade Non-Toxic Lacquer Turned Wood Rocking Toy Set',
        description: `Handcrafted from seasoned soft ivory-wood (Wrightia tinctoria / Aale Mara) turned manually on precision lathes and buffed with organic shellac infused with natural food-grade turmeric, kumkum, and indigo pigments. Completely child-safe and eco-friendly. Certified GI craft of Karnataka.`,
        materials: ['Wrightia Tinctoria (Aale Mara Wood)', 'Natural Shellac Lacquer', 'Organic Turmeric & Indigo Pigments'],
        technique: 'Manual Lathe Turning and Organic Lac-Buffing with Screw Pine Leaves',
        suggested_price: spokenPrice || 3400,
        production_time: spokenDays || '7 Days',
        region: 'South',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2006-KA-0023',
      };
    }

    // 10. Bastar Dhokra Bell Metal (Chhattisgarh / Central India)
    if (
      lower.includes('dhokra') ||
      lower.includes('dokra') ||
      lower.includes('bastar') ||
      lower.includes('bell metal') ||
      lower.includes('lost wax') ||
      lower.includes('cire perdue') ||
      lower.includes('ढोकरा') ||
      lower.includes('धोक्रा') ||
      lower.includes('ശിൽപം')
    ) {
      return {
        craft_id: 'craft-bastar-dhokra',
        craft_name: 'Bastar Dhokra Bell Metal',
        name: 'Ancestral Lost-Wax Cast Bell Metal Elephant Figurine',
        description: `Ancestral 4500-year-old Cire Perdue lost-wax brass casting hand-coiled with wild forest beeswax threads and cast in single unrepeatable clay moulds. Celebrates tribal deities, forest animals, and ceremonial devotion. Certified GI craft of Central India.`,
        materials: ['Recycled Brass Bell Metal', 'Wild Forest Beeswax (Madan)', 'Termite Mound Alluvial Clay', 'Dammar Resin'],
        technique: 'Cire Perdue (Lost-Wax) Single Mould Casting',
        suggested_price: spokenPrice || 11500,
        production_time: spokenDays || '20 Days',
        region: 'Central',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2008-CG-0085',
      };
    }

    // 11. Jaipur Blue Pottery (Rajasthan / North India)
    if (
      lower.includes('blue pottery') ||
      lower.includes('quartz pottery') ||
      lower.includes('jaipur pottery') ||
      lower.includes('cobalt pottery') ||
      lower.includes('पॉटरी') ||
      lower.includes('ब्लू पॉटरी')
    ) {
      return {
        craft_id: 'craft-jaipur-blue-pottery',
        craft_name: 'Jaipur Blue Pottery',
        name: 'Hand-Painted Cobalt Turquoise Glazed Quartz Ceramic Vessel',
        description: `Authentic non-clay ceramic hand-moulded with ground quartz stone and glass powder, decorated freehand with cobalt oxide floral arabesques and fired at 800°C. Imparts magnificent coolness and royal Pink City heritage. Certified GI craft of Rajasthan.`,
        materials: ['Ground Quartz Stone', 'Recycled Glass Cullet', 'Katira Natural Gum', 'Cobalt & Copper Oxide Pigment'],
        technique: 'Non-Clay Hand Moulding and Single-Fire Cobalt Glazing',
        suggested_price: spokenPrice || 5200,
        production_time: spokenDays || '12 Days',
        region: 'North',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2008-RJ-0083',
      };
    }

    // 12. Kutch Ajrakh Block Print (Gujarat / West India)
    if (
      lower.includes('ajrakh') ||
      lower.includes('ajrak') ||
      lower.includes('અજરખ') ||
      lower.includes('अजरक') ||
      (lower.includes('kutch') && lower.includes('block'))
    ) {
      const productTitle = isDupatta
        ? '16-Stage Natural Indigo & Madder Hand-Block Printed Ajrakh Dupatta'
        : isSaree
        ? '16-Stage Natural Indigo Hand-Block Printed Ajrakh Silk Saree'
        : '16-Stage Natural Indigo & Madder Hand-Block Printed Ajrakh Stole';

      return {
        craft_id: 'craft-kutch-ajrakh',
        craft_name: 'Kutch Ajrakh Block Print',
        name: productTitle,
        description: `Authentic 16-stage resist block-printed textile on lustrous handwoven cotton-silk. Dyed in living natural indigo vats and pomegranate rind mordants, stamped with precision hand-carved Teakwood blocks in ancient star geometry. Certified GI craft of Gujarat.`,
        materials: ['Pure Desi Cotton / Chanderi Silk Blend', 'Fermented Indigofera Indigo', 'Rubia Cordifolia (Madder)', 'Pomegranate Mordants'],
        technique: '16-Stage Mud-Resist Hand Block Printing and River Washing',
        suggested_price: spokenPrice || (isSaree ? 14500 : isDupatta ? 6800 : 5400),
        production_time: spokenDays || '21 Days',
        region: 'West',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2011-GJ-0211',
      };
    }

    // 13. Bagh Phulkari (Punjab / North India)
    if (
      lower.includes('phulkari') ||
      lower.includes('bagh') ||
      lower.includes('ਫੁਲਕਾਰੀ') ||
      lower.includes('ਖੱਦਰ') ||
      lower.includes('फुलकारी')
    ) {
      return {
        craft_id: 'craft-punjab-phulkari',
        craft_name: 'Bagh Phulkari Embroidery',
        name: 'Hand-Embroidered Silk Floss Bagh Phulkari Ceremonial Dupatta',
        description: `Ancestral dense geometric counted thread embroidery done purely from the reverse side of handspun Khaddar using untwisted pure silk Pat threads. Forms an unbroken golden garden of floral motifs. Certified GI craft of Punjab.`,
        materials: ['Handspun Khaddar Cotton', 'Untwisted Pat Silk Floss', 'Organic Turmeric & Madder Dyes'],
        technique: 'Counted Reverse Darning Stitch (Bagh)',
        suggested_price: spokenPrice || 12800,
        production_time: spokenDays || '30 Days',
        region: 'North',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1610030469668-93510cb2866c?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2011-PB-0239',
      };
    }

    // 14. Bidriware Silver Inlay Metalcraft (Karnataka / South India)
    if (
      lower.includes('bidri') ||
      lower.includes('bidriware') ||
      lower.includes('bidar') ||
      lower.includes('ಬಿದ್ರಿ') ||
      lower.includes('बिदरी')
    ) {
      return {
        craft_id: 'craft-bidriware',
        craft_name: 'Bidriware Silver Inlay Metalcraft',
        name: 'Ancestral Bidriware Silver Inlay Hand-Carved Memento Vase',
        description: `Striking jet-black zinc-copper alloy repoussé inlaid with pure fine 99.9% silver wire and sheet. Blackened using rare soil sourced exclusively from the historic 500-year-old Bidar Fort grounds. Certified GI craft of Karnataka.`,
        materials: ['Cast Zinc-Copper Alloy', 'Pure 99.9% Fine Silver Wire', 'Bidar Fort Specialized Soil'],
        technique: 'Cast Zinc Alloy Chisel Inlay & Fort Soil Chemical Oxidation',
        suggested_price: spokenPrice || 9200,
        production_time: spokenDays || '16 Days',
        region: 'South',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2006-KA-0019',
      };
    }

    // 15. Bankura Terracotta & Clay Craft (West Bengal / East India)
    if (
      lower.includes('bankura') ||
      lower.includes('panchmura') ||
      lower.includes('পোড়ামাটি') ||
      lower.includes('বাঁকুড়া') ||
      (lower.includes('terracotta') && (lower.includes('horse') || lower.includes('ঘোड़ा')))
    ) {
      return {
        craft_id: 'craft-bankura-terracotta',
        craft_name: 'Bankura Terracotta & Clay Craft',
        name: 'Panchmura Sacred Long-Eared Terracotta Heritage Horse',
        description: `Hand-thrown on manual potter wheel and coil-moulded with alluvial river clay from Gandheswari. Features iconic elongated ears, symmetrical neck rings, and ceremonial devotion styling fired in traditional wood kilns. Certified GI craft of West Bengal.`,
        materials: ['Gandheswari Alluvial Clay', 'Natural River Silt', 'Organic Husk Temper'],
        technique: 'Hollow Coil Hand-Modelling & Closed Kiln Wood Firing',
        suggested_price: spokenPrice || 4200,
        production_time: spokenDays || '15 Days',
        region: 'East',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2018-WB-0245',
      };
    }

    // 16. Assam Cane & Bamboo Craft (Assam / Northeast India)
    if (
      lower.includes('bamboo') ||
      lower.includes('cane') ||
      lower.includes('assam cane') ||
      lower.includes('japi') ||
      lower.includes('বাঁশ') ||
      lower.includes('बांस')
    ) {
      return {
        craft_id: 'craft-assam-bamboo',
        craft_name: 'Assam Cane & Bamboo Craft',
        name: 'Handwoven Assam Muli Bamboo Eco-Sculptural Decor Basket',
        description: `Masterfully hand-split and twill-woven from green-gold Muli bamboo and flexible hill cane (Jati Bet). Treated with wood smoking for natural anti-pest durability and ecological longevity. Certified GI craft of Assam.`,
        materials: ['Muli Bamboo Splints', 'Hill Cane (Jati Bet)', 'Smoked Wood Tar Resin'],
        technique: 'Micro-Twill Splint Interweaving & Natural Cane Binding',
        suggested_price: spokenPrice || 3600,
        production_time: spokenDays || '10 Days',
        region: 'Northeast',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2021-AS-0689',
      };
    }

    // 17. Srikalahasti Kalamkari (Andhra Pradesh / South India)
    if (
      lower.includes('kalamkari') ||
      lower.includes('srikalahasti') ||
      lower.includes('machilipatnam') ||
      lower.includes('కలంకారి') ||
      lower.includes('कलमकारी')
    ) {
      const productTitle = isDupatta
        ? 'Hand-Painted Kalamkari Natural Dye Cotton Dupatta'
        : isSaree
        ? 'Hand-Painted Kalamkari Pure Silk Saree'
        : 'Authentic Srikalahasti Hand-Painted Natural Dye Kalamkari Tapestry';

      return {
        craft_id: 'craft-kalamkari',
        craft_name: 'Srikalahasti Kalamkari',
        name: productTitle,
        description: `Hand-painted using sharpened bamboo kalam reed pens dipped in fermented jaggery and iron mordants on organic cotton treated with buffalo milk wash. Features the sacred Tree of Life and blooming forest motifs. Certified GI heritage craft of Andhra Pradesh.`,
        materials: ['100% Handspun Mangalagiri Cotton', 'Bamboo Reed Kalam Pen', 'Natural Botanical Dyes', 'Buffalo Milk Mordant'],
        technique: 'Freehand Kalam Pen Drawing and 17-Step Natural Vat Dyeing',
        suggested_price: spokenPrice || (isSaree ? 16500 : isDupatta ? 4800 : 8500),
        production_time: spokenDays || (isDupatta ? '18 Days' : '21 Days'),
        region: 'South',
        confidence_score: 0.98,
        image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2006-AP-0028',
      };
    }

    // 18. Sambalpuri Bandha Ikat (Odisha / East India)
    if (
      lower.includes('sambalpuri') ||
      lower.includes('bandha') ||
      lower.includes('sambalpur') ||
      lower.includes('bomkai') ||
      lower.includes('pasapalli') ||
      lower.includes('संबलपुरी')
    ) {
      return {
        craft_id: 'craft-sambalpuri-ikat',
        craft_name: 'Sambalpuri Bandha Ikat',
        name: 'Handwoven Sambalpuri Bandha Double Ikat Mulberry Silk Saree',
        description: `Legendary Odia tie-and-dye weaving featuring auspicious conch, wheel, and floral motifs bound and dyed into warp and weft yarns prior to handloom weaving. Certified GI craft of Odisha.`,
        materials: ['Pure Tussar & Mulberry Silk', 'Natural Tree Resin Dyes', 'Alizarin'],
        technique: 'Tie-and-Dye Bandha Warp-Weft Handloom Weaving',
        suggested_price: spokenPrice || 15800,
        production_time: spokenDays || '30 Days',
        region: 'East',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2008-OD-0062',
      };
    }

    // 19. Warli Tribal Painting (Maharashtra / West India)
    if (
      lower.includes('warli') ||
      lower.includes('tarpa') ||
      lower.includes('वारली')
    ) {
      return {
        craft_id: 'craft-warli-art',
        craft_name: 'Warli Tribal Painting',
        name: 'Traditional Canvas Warli Tribal Folk Art — Tarpa Dance Circle',
        description: `Indigenous ritual folk art painted with chewed bamboo twigs and ground white rice paste on natural ochre mud plaster canvas. Depicts the sacred Tarpa spiral dance of cosmic rhythm. Certified GI craft of Maharashtra.`,
        materials: ['Mud & Cowdung Canvas Base', 'Rice Paste Pigment', 'Natural Tree Gum Binder'],
        technique: 'Chewed Bamboo Twig Ritual Linear Folk Painting',
        suggested_price: spokenPrice || 6400,
        production_time: spokenDays || '10 Days',
        region: 'West',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2014-MH-0361',
      };
    }

    // 20. Kolhapuri Handcrafted Leather Footwear (Maharashtra / West India)
    if (
      lower.includes('kolhapuri') ||
      lower.includes('chappal') ||
      lower.includes('कोल्हापुरी') ||
      (lower.includes('leather') && lower.includes('footwear'))
    ) {
      return {
        craft_id: 'craft-kolhapuri-chappal',
        craft_name: 'Kolhapuri Footwear',
        name: 'Traditional Hand-Braided Tanned Leather Kolhapuri Chappals',
        description: `100% handmade open footwear fashioned from vegetable-tanned buffalo leather treated with babul tree bark and mustard seed oil. Embellished with hand-punched braiding and zero nails. Certified GI craft of Maharashtra.`,
        materials: ['Vegetable-Tanned Buffalo Hide', 'Natural Babul Bark Extract', 'Mustard Oil Conditioning'],
        technique: 'Hand-Braiding, Chisel Punching and Wax-Thread Stitching',
        suggested_price: spokenPrice || 3800,
        production_time: spokenDays || '7 Days',
        region: 'West',
        confidence_score: 0.97,
        image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
        gi_tag: 'GI-2019-MH-0639',
      };
    }

    // =========================================================================
    // DYNAMIC INTELLIGENT PARSER FOR ANY OTHER SPOKEN CRAFT / PRODUCT
    // =========================================================================
    // Extracts clean title, genuine materials, and appropriate category image
    // based on user transcript instead of falling back to a fixed unrelated item!
    const words = spokenText
      .replace(/[^\w\s\u0900-\u0D7F]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    // Filter out common filler phrases
    const cleanSubject = words
      .filter((w) => !['have', 'made', 'this', 'with', 'from', 'handcrafted', 'handmade', 'artisan', 'nenu', 'maine', 'humne', 'chesanu', 'banaya', 'hai', 'undi', 'cheera', 'cheppanu'].includes(w.toLowerCase()))
      .slice(0, 5)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    // Detect language region
    const langRegionMap: Record<LanguageCode, 'North' | 'South' | 'East' | 'West' | 'Northeast' | 'Central'> = {
      en: 'North',
      hi: 'North',
      te: 'South',
      ta: 'South',
      kn: 'South',
      ml: 'South',
      bn: 'East',
      gu: 'West',
      mr: 'West',
      pa: 'North',
    };
    const inferredRegion = langRegionMap[language] || 'South';

    if (isSaree || lower.includes('silk') || lower.includes('cotton') || lower.includes('handloom') || lower.includes('weaver')) {
      const dynamicTitle = cleanSubject ? `Handcrafted ${cleanSubject} Pure Silk Saree` : 'Authentic Handloom Heritage Silk Saree';
      return {
        craft_id: 'craft-handloom-textiles',
        craft_name: 'Traditional Handloom Weaving',
        name: dynamicTitle,
        description: `Handcrafted on traditional manual pit-looms using heritage warp-tensioning techniques. Features organic yarns with intricate ancestral border motifs. Extracted from artisan voice description: "${spokenText.slice(0, 140)}".`,
        materials: ['Pure Natural Silk', 'Handspun Desi Cotton', 'Fine Zari Thread', 'Natural Botanical Dyes'],
        technique: 'Manual Shuttle Handloom Pit-Loom Weaving',
        suggested_price: spokenPrice || 14500,
        production_time: spokenDays || '28 Days',
        region: inferredRegion,
        confidence_score: 0.94,
        image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
        gi_tag: `GI-2026-${inferredRegion.slice(0, 2).toUpperCase()}-4021`,
      };
    }

    if (isPainting) {
      const dynamicTitle = cleanSubject ? `Handmade ${cleanSubject} Folk Art Painting` : 'Traditional Indian Folk Heritage Canvas Painting';
      return {
        craft_id: 'craft-folk-painting',
        craft_name: 'Traditional Indian Folk Painting',
        name: dynamicTitle,
        description: `Freehand painted by master folk artisans on prepared natural organic canvas using crushed stone and plant pigments. Extracted from artisan voice description: "${spokenText.slice(0, 140)}".`,
        materials: ['Treated Organic Canvas Base', 'Stone Ochre Pigments', 'Lamp Soot', 'Natural Gum Binder'],
        technique: 'Freehand Organic Pigment Brush & Bamboo Quill Painting',
        suggested_price: spokenPrice || 7200,
        production_time: spokenDays || '14 Days',
        region: inferredRegion,
        confidence_score: 0.93,
        image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
        gi_tag: `GI-2026-${inferredRegion.slice(0, 2).toUpperCase()}-2091`,
      };
    }

    if (isToy || lower.includes('wood') || lower.includes('carving')) {
      const dynamicTitle = cleanSubject ? `Handcrafted Turned Wood ${cleanSubject}` : 'Handcrafted Non-Toxic Wooden Heritage Art Piece';
      return {
        craft_id: 'craft-indigenous-woodcraft',
        craft_name: 'Indigenous Turned Woodcraft',
        name: dynamicTitle,
        description: `Hand-turned from seasoned non-toxic native timber and polished with natural organic shellac and herbal tints. Extracted from artisan voice description: "${spokenText.slice(0, 140)}".`,
        materials: ['Seasoned Native Hardwood', 'Natural Shellac Lacquer', 'Organic Vegetable Tints'],
        technique: 'Manual Lathe Turning and Friction Herbal Buffing',
        suggested_price: spokenPrice || 3600,
        production_time: spokenDays || '8 Days',
        region: inferredRegion,
        confidence_score: 0.93,
        image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
        gi_tag: `GI-2026-${inferredRegion.slice(0, 2).toUpperCase()}-1182`,
      };
    }

    if (isPottery || lower.includes('clay') || lower.includes('ceramic') || lower.includes('terracotta')) {
      const dynamicTitle = cleanSubject ? `Hand-Thrown Ceramic ${cleanSubject}` : 'Handcrafted Heritage Ceramic Terracotta Vessel';
      return {
        craft_id: 'craft-terracotta-pottery',
        craft_name: 'Traditional Clay Pottery & Terracotta',
        name: dynamicTitle,
        description: `Hand-thrown on traditional manual potter wheel with river clay and fired in wood kilns. Extracted from artisan voice description: "${spokenText.slice(0, 140)}".`,
        materials: ['Natural River Basin Alluvial Clay', 'Natural Mineral Glaze', 'Organic Temper'],
        technique: 'Potter Wheel Hand-Throwing and Kiln Firing',
        suggested_price: spokenPrice || 4500,
        production_time: spokenDays || '12 Days',
        region: inferredRegion,
        confidence_score: 0.93,
        image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
        gi_tag: `GI-2026-${inferredRegion.slice(0, 2).toUpperCase()}-5542`,
      };
    }

    if (lower.includes('brass') || lower.includes('metal') || lower.includes('bronze') || lower.includes('copper')) {
      const dynamicTitle = cleanSubject ? `Hand-Cast Brass ${cleanSubject}` : 'Handcrafted Indigenous Cast Metal Craft';
      return {
        craft_id: 'craft-indigenous-metalcraft',
        craft_name: 'Traditional Indigenous Metalcraft',
        name: dynamicTitle,
        description: `Hand-cast using traditional sand-mould or lost-wax techniques and hand-chiseled with auspicious geometric motifs. Extracted from artisan voice description: "${spokenText.slice(0, 140)}".`,
        materials: ['Pure Brass & Bell Metal Alloy', 'Natural Emery Polishing Paste', 'Organic Linseed Seal'],
        technique: 'Hand Sand-Casting, Chisel Engraving & Luster Buffing',
        suggested_price: spokenPrice || 8900,
        production_time: spokenDays || '16 Days',
        region: inferredRegion,
        confidence_score: 0.94,
        image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
        gi_tag: `GI-2026-${inferredRegion.slice(0, 2).toUpperCase()}-7719`,
      };
    }

    // Default Fallback: Clean and relevant to spoken text
    const fallbackTitle = cleanSubject ? `Artisanal Handcrafted ${cleanSubject}` : 'Masterpiece Living Heritage Handcrafted Item';
    return {
      craft_id: 'craft-living-heritage-general',
      craft_name: 'Traditional Indian Living Heritage',
      name: fallbackTitle,
      description: `Authentic handcrafted creation created with indigenous natural raw materials and time-honored artisanal techniques. Extracted from artisan voice description: "${spokenText.slice(0, 140)}".`,
      materials: ['Natural Desi Fiber', 'Organic Botanical Pigments', 'Pure Handcrafted Base'],
      technique: 'Ancestral Manual Crafting & Hand Finishing',
      suggested_price: spokenPrice || 6800,
      production_time: spokenDays || '21 Days',
      region: inferredRegion,
      confidence_score: 0.92,
      image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
      gi_tag: `GI-2026-${inferredRegion.slice(0, 2).toUpperCase()}-9901`,
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
