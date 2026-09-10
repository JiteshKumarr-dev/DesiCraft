// Desi Craft - Comprehensive Heritage Map Dataset
// Authentic state-by-state crafts, master artisans, tourist heritage places, workshops, and upcoming events

export interface MapCraftItem {
  id: string;
  name: string;
  regionalName?: string;
  image: string;
  description: string;
  technique: string;
  materials: string[];
  knownFor: string[];
  culturalSignificance: string;
  giTag?: string;
  isGI?: boolean;
}

export interface MapArtisanItem {
  id: string;
  name: string;
  avatar: string;
  location: string;
  state: string;
  craftId: string;
  craftName: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  bio?: string;
  experienceYears?: number;
  craftStory?: string;
  languages?: string[];
  isAvailableForCustom?: boolean;
  isAvailableForLearning?: boolean;
}

export interface TouristPlace {
  name: string;
  type: string;
  description: string;
  district: string;
}

export interface WorkshopItem {
  title: string;
  artisan: string;
  duration: string;
  level: string;
  spotsLeft: number;
}

export interface EventItem {
  title: string;
  date: string;
  location: string;
  category: string;
}

export interface StateHeritageData {
  id: string; // Lowercase identifier e.g. "telangana"
  svgId: string; // SVG path identifier e.g. "tg", "ts", "ap"
  name: string;
  code: string;
  region: 'South India' | 'North India' | 'East India' | 'West India' | 'Central India' | 'Northeast India';
  tagline: string;
  description: string;
  heroImage: string;
  heroImageCaption: string;
  heroQuote?: string;
  stats: {
    uniqueCrafts: string;
    artisans: string;
    districts: string;
  };
  crafts: MapCraftItem[];
  suggestedArtisans: MapArtisanItem[];
  touristPlaces: TouristPlace[];
  workshops: WorkshopItem[];
  events: EventItem[];
}

export const HERITAGE_MAP_DATA: Record<string, StateHeritageData> = {
  telangana: {
    id: 'telangana',
    svgId: 'tg',
    name: 'Telangana',
    code: 'TS',
    region: 'South India',
    tagline: 'Land of Weaves, Dyes and Traditions',
    description:
      'Telangana is known for its vibrant handlooms, intricate crafts and rich cultural heritage. From the iconic Pochampally Ikat to exquisite metalwork, the state preserves centuries-old traditions through its artisans.',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Charminar, Hyderabad',
    heroQuote: 'Threads of Tradition, Stories of Telangana',
    stats: {
      uniqueCrafts: '16+',
      artisans: '1.2K+',
      districts: '33',
    },
    crafts: [
      {
        id: 'pochampally-ikat',
        name: 'Pochampally Double Ikat',
        regionalName: 'పోచంపల్లి ఇక్కత్',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        description:
          'Famous for its intricate tie-and-dye technique, Pochampally Ikat is known for its geometric patterns and vibrant colours. Each piece is a result of precise planning, traditional skill and generations of expertise.',
        technique: 'Double Ikat Weaving',
        materials: ['Cotton', 'Silk'],
        knownFor: ['Sarees', 'Dupattas', 'Fabrics', 'Stoles'],
        culturalSignificance: "Symbol of Telangana's heritage",
        giTag: 'GI-2005-TS-0004',
        isGI: true,
      },
      {
        id: 'cheriyal-scroll',
        name: 'Cheriyal Scroll Painting',
        regionalName: 'చేరియాల పటచిత్రం',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        description:
          'Ancestral narrative storytelling paintings executed with natural minerals and tamarind paste on khadi cloth, historically used by traveling bards to recount folk epics.',
        technique: 'Natural Mineral Tempera on Khadi',
        materials: ['Khadi Canvas', 'Natural Stone Pigments', 'Tamarind Seed Gum', 'Tree Resin'],
        knownFor: ['Narrative Wall Scrolls', 'Folk Masks', 'Story Panels', 'Dolls'],
        culturalSignificance: 'Ancient oral and visual folk literature preservation',
        giTag: 'GI-2007-TS-0070',
        isGI: true,
      },
      {
        id: 'nirmal-art',
        name: 'Nirmal Art',
        regionalName: 'నిర్మల్ చిత్రకళ & కొయ్యబొమ్మలు',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        description:
          'Celebrated 400-year-old lacquer woodcraft and painting from Nirmal district, utilizing Poniki softwood, herbal lacquer, and traditional herbal gold leaf hues.',
        technique: 'Lacquer Coating and Herbal Gold Gilding',
        materials: ['Poniki Softwood', 'Natural Lac Resin', 'Herbal Extracts', 'Mineral Pigments'],
        knownFor: ['Lacquer Boxes', 'Gold Painted Trays', 'Toy Birds & Animals', 'Epic Paintings'],
        culturalSignificance: 'Deccani royal court patronage under Nizams and Kakatiyas',
        giTag: 'GI-2009-TS-0128',
        isGI: true,
      },
      {
        id: 'bidriware',
        name: 'Bidriware',
        regionalName: 'బిద్రి కళారూపం',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        description:
          'Dramatic jet-black zinc and copper alloy repoussé inlaid with pure fine 99.9% silver wire, blackened with rare soil sourced exclusively from fort ruins.',
        technique: 'Silver Inlay on Zinc-Copper Alloy with Fort Soil Oxidation',
        materials: ['Zinc Alloy', 'Pure Silver Wire (99.9%)', 'Copper', 'Fort Soil Oxidant'],
        knownFor: ['Hookah Bases', 'Vases', 'Silver Jewelry Trays', 'Memento Plates'],
        culturalSignificance: 'Persian-Deccani syncretic metal craft of royal courts',
        giTag: 'GI-2006-TS-0019',
        isGI: true,
      },
      {
        id: 'telangana-leather-puppetry',
        name: 'Telangana Leather Puppetry',
        regionalName: 'తోలుబొమ్మలాట',
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        description:
          'Translucent, vividly perforated goat parchment shadow puppets illuminated from behind a white cotton screen, enacting the Mahabharata and Ramayana.',
        technique: 'Translucent Hide Curing, Chisel Perforation & Vegetable Staining',
        materials: ['Cured Goat Hide', 'Natural Vegetable Dyes', 'Bamboo Struts', 'Cotton Cord'],
        knownFor: ['Shadow Puppets', 'Illuminated Lamp Shades', 'Decorative Wall Panels'],
        culturalSignificance: 'Millennium-old folk shadow theatre tradition of rural Telangana',
        giTag: 'GI-2008-TS-0091',
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: 'artisan-ramesh-babu',
        name: 'Ramesh Babu',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        location: 'Pochampally, Yadadri Bhuvanagiri',
        state: 'Telangana',
        craftId: 'pochampally-ikat',
        craftName: 'Ikat Weaving',
        rating: 4.8,
        reviewsCount: 120,
        tags: ['Ikat Weaving', 'Sarees'],
        bio: '4th-generation master pit-loom weaver from Bhoodan Pochampally village, dedicated to double ikat geometric precision and natural dyes.',
        experienceYears: 29,
        craftStory: 'We calculate the warp tension with every heartbeat. Each Pochampally saree is a mathematical harmony passed down through 150 years of our family history.',
        languages: ['Telugu', 'Hindi', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
      {
        id: 'artisan-lalitha-devi',
        name: 'Lalitha Devi',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        location: 'Pochampally, Yadadri Bhuvanagiri',
        state: 'Telangana',
        craftId: 'pochampally-ikat',
        craftName: 'Ikat Fabrics',
        rating: 4.9,
        reviewsCount: 95,
        tags: ['Ikat Fabrics', 'Dupattas'],
        bio: 'Award-winning master tie-and-dye artist and trainer of over 60 women weavers in Yadadri district.',
        experienceYears: 24,
        craftStory: 'Before the yarn touches the loom, we tie each cluster with precise markings. If one knot moves a millimeter, the pattern vanishes. That patience is our prayer.',
        languages: ['Telugu', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
      {
        id: 'artisan-mohd-salim',
        name: 'Mohd. Salim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        location: 'Pochampally, Yadadri Bhuvanagiri',
        state: 'Telangana',
        craftId: 'pochampally-ikat',
        craftName: 'Ikat Stoles',
        rating: 4.7,
        reviewsCount: 88,
        tags: ['Ikat Stoles', 'Home Decor'],
        bio: 'Specialist in botanical indigo vats and contemporary home furnishings woven on traditional frame looms.',
        experienceYears: 21,
        craftStory: 'Our indigo vats have been alive for 30 years. Natural fermentation gives the fabric a cooling breath that synthetic colors can never match.',
        languages: ['Urdu', 'Telugu', 'Hindi'],
        isAvailableForCustom: true,
        isAvailableForLearning: false,
      },
      {
        id: 'artisan-saroja',
        name: 'Saroja',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        location: 'Pochampally, Yadadri Bhuvanagiri',
        state: 'Telangana',
        craftId: 'pochampally-ikat',
        craftName: 'Custom Orders',
        rating: 4.8,
        reviewsCount: 76,
        tags: ['Custom Orders', 'Workshops'],
        bio: 'Pochampally handloom cooperative mentor specializing in heritage revivals and hands-on apprentice workshops.',
        experienceYears: 26,
        craftStory: 'When young people come to Pochampally to learn at the loom, the rhythmic clack of the wooden shuttle teaches them stillness and timeless focus.',
        languages: ['Telugu', 'Hindi'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: 'Golconda Fort & Qutb Shahi Tombs',
        type: 'Architectural Heritage',
        description: 'Acoustic marvel fortress and royal mausoleums celebrating medieval Deccan engineering.',
        district: 'Hyderabad',
      },
      {
        name: 'Bhoodan Pochampally Weavers Village',
        type: 'Craft Tourism Village',
        description: 'UNWTO Best Tourism Village featuring live pit looms, tie-dye vats, and rural weaver courtyards.',
        district: 'Yadadri Bhuvanagiri',
      },
      {
        name: 'Ramappa Temple (UNESCO Heritage)',
        type: 'World Heritage Site',
        description: '13th-century Kakatiya stone masterpiece sculpted from floating bricks and sandstone.',
        district: 'Mulugu',
      },
      {
        name: 'Warangal Fort & Thousand Pillar Temple',
        type: 'Historical Monument',
        description: 'Spectacular Kakatiya granite gateways (Kirti Toranas) and intricate star-shaped sanctuaries.',
        district: 'Warangal',
      },
    ],
    workshops: [
      {
        title: 'Master Class: Mathematical Double Ikat Tie-and-Dye',
        artisan: 'Ramesh Babu & Gaddam Lakshmi Devi',
        duration: '2 Days (Hands-on)',
        level: 'Intermediate to Advanced',
        spotsLeft: 4,
      },
      {
        title: 'Cheriyal Scroll Storytelling & Natural Pigment Making',
        artisan: 'D. Vaikuntam Master Artist',
        duration: '1 Day Intensive',
        level: 'Beginner Friendly',
        spotsLeft: 6,
      },
      {
        title: 'Bidriware Pure Silver Wire Chasing Apprenticeship',
        artisan: 'Master Shah Rasheed Ahmed Quadri',
        duration: '3 Days',
        level: 'All Levels',
        spotsLeft: 3,
      },
    ],
    events: [
      {
        title: 'National Handloom Expo & Pochampally Weaver Mela',
        date: 'Oct 14 - 22, 2026',
        location: 'People’s Plaza, Necklace Road, Hyderabad',
        category: 'Heritage Handloom Fair',
      },
      {
        title: 'Deccan Craft Biennale & Living Artisan Conclave',
        date: 'Nov 05 - 10, 2026',
        location: 'Chowmahalla Palace, Old City, Hyderabad',
        category: 'Artisan Showcase',
      },
      {
        title: 'Kakatiya Heritage Festival & Rural Craft Haat',
        date: 'Dec 18 - 21, 2026',
        location: 'Ramappa Temple Grounds, Mulugu',
        category: 'Cultural Festival',
      },
    ],
  },

  rajasthan: {
    id: 'rajasthan',
    svgId: 'rj',
    name: 'Rajasthan',
    code: 'RJ',
    region: 'North India',
    tagline: 'The Land of Royalty, Colors and Living Crafts',
    description:
      'Rajasthan represents the soul of desert craftsmanship, renowned for brilliant block prints, non-clay blue pottery, intricate marble carving, and vibrant tie-dye bandhani textiles.',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Hawa Mahal, Jaipur',
    heroQuote: 'Colors Born of the Thar, Shaped by Royal Hands',
    stats: {
      uniqueCrafts: '22+',
      artisans: '2.5K+',
      districts: '50',
    },
    crafts: [
      {
        id: 'sanganeri-block-print',
        name: 'Sanganeri Hand Block Printing',
        image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
        description:
          'Delicate floral and trellis patterns hand-stamped on white or off-white cotton using intricately hand-chiseled teak woodblocks and botanical dyes.',
        technique: 'Teak Woodblock Hand Stamping with Natural Dyes',
        materials: ['Pure Cambric Cotton', 'Vegetable Dyes', 'Carved Teak Blocks', 'Alum Mordant'],
        knownFor: ['Bedcovers', 'Kurtas', 'Dupattas', 'Quilts'],
        culturalSignificance: 'Chhipa community 500-year-old living textile heritage',
        giTag: 'GI-2009-RJ-0118',
        isGI: true,
      },
      {
        id: 'jaipur-blue-pottery',
        name: 'Jaipur Blue Pottery',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        description:
          'Distinctive ceramic craft crafted without clay, blending quartz powder, ground glass, Fuller’s earth and gum, glazed with cobalt blue and copper oxide.',
        technique: 'Non-Clay Quartz Dough Molding, Hand Painting & Low Fire Glazing',
        materials: ['Quartz Powder', 'Cullet (Glass)', 'Fuller’s Earth', 'Cobalt Oxide'],
        knownFor: ['Decorative Plates', 'Vases', 'Doorknobs', 'Tile Murals'],
        culturalSignificance: 'Turko-Persian craft perfected under Sawai Ram Singh II',
        giTag: 'GI-2008-RJ-0083',
        isGI: true,
      },
      {
        id: 'molela-terracotta',
        name: 'Molela Terracotta Plaques',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        description:
          'Hollow relief votive clay plaques of local folk deities like Devnarayan and Nagaraja, hand-sculpted by Kumhar potters without a potter wheel.',
        technique: 'Hand Hollow Sculpting with River Clay and Donkey Dung Temper',
        materials: ['Banas River Clay', 'Organic Dung Temper', 'Palash Gum Colors', 'Natural Glaze'],
        knownFor: ['Votive Wall Plaques', 'Deity Icons', 'Architectural Murals'],
        culturalSignificance: 'Tribal spiritual pilgrimage votive heritage',
        giTag: 'GI-2007-RJ-0089',
        isGI: true,
      },
      {
        id: 'kota-doria',
        name: 'Kota Doria Weaving',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        description:
          'Feather-light translucent fabric woven in distinctive square check patterns called Khat, combining strong cotton with lustrous pure silk.',
        technique: 'Pit Loom Khat Check Weaving with Sized Onion Juice Paste',
        materials: ['Mulberry Silk', 'Fine Cotton Yarn', 'Zari', 'Natural Rice Sizing'],
        knownFor: ['Lightweight Sarees', 'Summer Dupattas', 'Turbans'],
        culturalSignificance: 'Patronized by Rao Kishore Singh of Kota in late 17th Century',
        giTag: 'GI-2005-RJ-0017',
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: 'artisan-ramswaroop-chhipa',
        name: 'Ramswaroop Chhipa',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        location: 'Sanganer, Jaipur',
        state: 'Rajasthan',
        craftId: 'sanganeri-block-print',
        craftName: 'Block Printing',
        rating: 4.9,
        reviewsCount: 134,
        tags: ['Block Printing', 'Natural Indigo'],
        bio: 'Master block printer using antique 80-year-old carved teak blocks and heritage botanical recipes.',
        experienceYears: 32,
        craftStory: 'When the wooden block touches the wet indigo fabric, you must strike it with just the right weight of your fist. It is rhythm and memory.',
        languages: ['Hindi', 'Rajasthani', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
      {
        id: 'artisan-kripal-sharma',
        name: 'Anand Kripal Kumbhar',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        location: 'Kot Jewar, Jaipur',
        state: 'Rajasthan',
        craftId: 'jaipur-blue-pottery',
        craftName: 'Blue Pottery',
        rating: 4.8,
        reviewsCount: 98,
        tags: ['Quartz Ceramics', 'Glazed Vases'],
        bio: 'Student of legendary Kripal Singh Shekhawat, keeping the turquoise glaze alive.',
        experienceYears: 27,
        craftStory: 'We do not touch river clay; our pottery is born of crushed quartz and ancient copper oxides fired under the desert sun.',
        languages: ['Hindi', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: 'Amer Fort & Anokhi Block Print Museum',
        type: 'Heritage Fort & Craft Museum',
        description: 'Magnificent hillside palace and dedicated hand-printing museum in restored haveli.',
        district: 'Jaipur',
      },
      {
        name: 'Mehrangarh Fort & Desert Artisan Quarter',
        type: 'Royal Fortress',
        description: 'Imposing cliffside fortress with living craft guilds and folk musicians.',
        district: 'Jodhpur',
      },
    ],
    workshops: [
      {
        title: 'Authentic Mud-Resist (Dabu) & Indigo Vat Workshop',
        artisan: 'Ramswaroop Chhipa',
        duration: '2 Days',
        level: 'All Levels',
        spotsLeft: 5,
      },
    ],
    events: [
      {
        title: 'Jaipur International Craft Week & Artisan Bazaar',
        date: 'Nov 12 - 16, 2026',
        location: 'Diggi Palace, Jaipur',
        category: 'Exhibition',
      },
    ],
  },

  gujarat: {
    id: 'gujarat',
    svgId: 'gj',
    name: 'Gujarat',
    code: 'GJ',
    region: 'West India',
    tagline: 'Cradle of Indus Weaves, Mirrorwork and Rogan Art',
    description:
      'From the white salt desert of Kutch to the ancient looms of Patan, Gujarat is an international beacon of textile mathematics, natural dyes, and castor oil Rogan paintings.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Rann of Kutch Artisan Encampment',
    heroQuote: 'Desert Hands Weaving Geometry and Light',
    stats: {
      uniqueCrafts: '19+',
      artisans: '1.8K+',
      districts: '33',
    },
    crafts: [
      {
        id: 'kutch-ajrakh',
        name: 'Kutch Ajrakh Block Print',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
        description:
          '16-stage ancient mud-resist natural dyeing process creating deep celestial indigo and madder red geometric cosmos on cotton and silk.',
        technique: '16-Stage Resist Block Printing with Iron Black & Indigo',
        materials: ['Desert Cotton', 'Indigofera Tinctoria', 'Madder Root', 'Camel Dung Cleanser'],
        knownFor: ['Turbans', 'Shawls', 'Yardage', 'Bedspreads'],
        culturalSignificance: 'Direct unbroken lineage from Indus Valley civilization',
        giTag: 'GI-2011-GJ-0211',
        isGI: true,
      },
      {
        id: 'patan-patola',
        name: 'Patan Patola Double Ikat',
        image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
        description:
          'Regarded as the most complex textile in human history; warp and weft are tied and dyed before weaving, requiring six months to two years per saree.',
        technique: 'Mathematical Double Ikat on Slanted Rosewood Handloom',
        materials: ['Pure Silk 8-Ply Yarn', 'Natural Botanical Dyes', 'Teak Loom'],
        knownFor: ['Patola Sarees', 'Heirloom Shikargh Panels'],
        culturalSignificance: 'Sacred heirloom textile of Gujarat royalty under Solanki kings',
        giTag: 'GI-2013-GJ-0232',
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: 'artisan-ismail-khatri',
        name: 'Dr. Ismail Mohammed Khatri',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        location: 'Ajrakhpur, Kutch',
        state: 'Gujarat',
        craftId: 'kutch-ajrakh',
        craftName: 'Ajrakh Block Print',
        rating: 4.95,
        reviewsCount: 160,
        tags: ['Ajrakh', 'Natural Dyes'],
        bio: '9th-generation Khatri master craftsman awarded Honorary Doctorate for reviving ancient botanical mordants.',
        experienceYears: 38,
        craftStory: 'Ajrakh means "keep it for today" or "universe of blue". The river, the sun, and the mud teach us the colors.',
        languages: ['Kutchi', 'Gujarati', 'Hindi', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: 'Rani ki Vav & Patola House Museum',
        type: 'UNESCO Stepwell & Living Loom',
        description: 'Intricate subterranean stepwell and living master workshop of Salvi weavers.',
        district: 'Patan',
      },
    ],
    workshops: [
      {
        title: 'Master Class: 16 Stages of Natural Ajrakh Printing',
        artisan: 'Dr. Ismail Mohammed Khatri',
        duration: '3 Days',
        level: 'Intermediate',
        spotsLeft: 4,
      },
    ],
    events: [
      {
        title: 'Rann Utsav Crafts Mela & Desert Guild Fair',
        date: 'Dec 01 - Jan 15, 2026',
        location: 'Dhordo, Great Rann of Kutch',
        category: 'Desert Craft Fair',
      },
    ],
  },

  uttar_pradesh: {
    id: 'uttar_pradesh',
    svgId: 'up',
    name: 'Uttar Pradesh',
    code: 'UP',
    region: 'North India',
    tagline: 'Heartland of Brocades, Chikankari and Brass Repoussé',
    description:
      'From the timeless weaving lanes of Kashi to the delicate shadow-stitch embroidery of Awadh and Moradabad brassware, Uttar Pradesh is India’s grand repository of classical artisanal masterworks.',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Ghats of Varanasi at Dawn',
    heroQuote: 'The Clack of Ancient Looms along the Sacred Ganga',
    stats: {
      uniqueCrafts: '34+',
      artisans: '3.8K+',
      districts: '75',
    },
    crafts: [
      {
        id: 'varanasi-brocade',
        name: 'Varanasi Zari & Brocade',
        image: '/images/banarasi-gold-saree.png',
        description:
          'World-renowned opulent silk textiles handwoven on traditional pit looms in the ancient alleyways of Kashi, featuring intricate brocades and pure gold-silver floral arabesques.',
        technique: 'Naksha Jaala Drawloom Weaving & Kadwa Tapestry',
        materials: ['Katan Mulberry Silk', 'Pure Silver Zari', 'Gold Wire'],
        knownFor: ['Bridal Sarees', 'Tanchoi Silks', 'Brocade Dupattas'],
        culturalSignificance: 'Heirloom auspicious bridal textile sanctified across centuries',
        giTag: 'GI-2009-UP-0044',
        isGI: true,
      },
      {
        id: 'lucknow-chikankari',
        name: 'Lucknow Chikankari',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
        description:
          'Delicate 32-stitch white-on-white shadow needlework practiced in Awadh, rendering gossamer floral motifs on fine muslin, cotton, and georgette.',
        technique: 'Hand Needle Embroidery with 32 Traditional Stitches (Tepchi, Bakhiya, Phanda)',
        materials: ['Fine Cotton Muslin', 'Mulberry Silk Thread', 'Linen'],
        knownFor: ['Kurtas', 'Angrakhas', 'Dupattas', 'Sarees'],
        culturalSignificance: 'Nawabi court elegance and female domestic artisan mastery',
        giTag: 'GI-2008-UP-0119',
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: 'artisan-rajeshwar-ansari',
        name: 'Master Rajeshwar Ansari',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        location: 'Madanpura, Varanasi',
        state: 'Uttar Pradesh',
        craftId: 'varanasi-brocade',
        craftName: 'Banarasi Zari Weaving',
        rating: 4.95,
        reviewsCount: 142,
        tags: ['Zari Weaving', 'Kadwa Sarees'],
        bio: '5th-generation master pit-loom weaver recipient of National Master Craftsperson Award.',
        experienceYears: 34,
        craftStory: 'When the golden Zari thread glides through the Katan warp, it sounds like a quiet river flowing into the night.',
        languages: ['Hindi', 'Urdu', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: 'Kashi Vishwanath Corridor & Madanpura Weaver Quarters',
        type: 'Ancient Spiritual City & Loom Wards',
        description: 'Walk through narrow spiritual lanes echoing with pit looms and silk spinners.',
        district: 'Varanasi',
      },
    ],
    workshops: [
      {
        title: 'Mastering the Kadwa Brocade Weaving Technique',
        artisan: 'Master Rajeshwar Ansari',
        duration: '3 Days',
        level: 'Advanced',
        spotsLeft: 3,
      },
    ],
    events: [
      {
        title: 'Ganga Mahotsav & All-India Master Bunakar Conclave',
        date: 'Nov 20 - 24, 2026',
        location: 'Assi Ghat, Varanasi',
        category: 'Cultural Handloom Conclave',
      },
    ],
  },

  karnataka: {
    id: 'karnataka',
    svgId: 'ka',
    name: 'Karnataka',
    code: 'KA',
    region: 'South India',
    tagline: 'Silk Palaces, Natural Lacquer Toys and Sandalwood Carving',
    description:
      'Home to child-safe lathe-turned Channapatna wooden lacquer toys, Mysore silk weaving, and dramatic Bidriware silver inlay, Karnataka blends royal craftsmanship with natural forest reserves.',
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f443b745?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Mysore Palace Lit with 100,000 Lights',
    heroQuote: 'Royal Loom Traditions from Kaveri Valley',
    stats: {
      uniqueCrafts: '25+',
      artisans: '2.1K+',
      districts: '31',
    },
    crafts: [
      {
        id: 'channapatna-toys',
        name: 'Channapatna Lacquer Toys',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        description:
          'Non-toxic lathe-turned wooden toys coated with natural organic lacquer and colored with turmeric, indigo, and kumkum plant resins, first patronized by Tipu Sultan.',
        technique: 'Lathe Wood Turning and Natural Tree Lacquer Friction Buffing',
        materials: ['Wrightia Tinctoria (Ivory Wood)', 'Natural Tree Lac', 'Vegetable Dyes'],
        knownFor: ['Child-safe Toys', 'Nesting Dolls', 'Beaded Games', 'Home Figurines'],
        culturalSignificance: 'Eco-friendly centuries-old wooden toy capital of India',
        giTag: 'GI-2006-KA-0023',
        isGI: true,
      },
      {
        id: 'mysore-silk',
        name: 'Mysore Pure Silk Weaving',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        description:
          'Lustrous pure mulberry crepe silk woven with 0.65% pure gold and silver Zari borders, celebrated for soft drape and royal heritage authenticity.',
        technique: 'High-Twist Silk Crepe Jacquard Weaving with Solid Gold Zari',
        materials: ['Bivoltine Mulberry Silk', 'Certified Gold Zari'],
        knownFor: ['Mysore Silk Sarees', 'Royal Shawls', 'Panchakacham Dhotis'],
        culturalSignificance: 'Royal Maharaja of Mysore silk factory founding lineage',
        giTag: 'GI-2005-KA-0029',
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: 'artisan-syed-channapatna',
        name: 'Syed Nizamuddin',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        location: 'Gombe Nagara, Channapatna',
        state: 'Karnataka',
        craftId: 'channapatna-toys',
        craftName: 'Channapatna Woodcraft',
        rating: 4.88,
        reviewsCount: 110,
        tags: ['Lathe Turning', 'Organic Toys'],
        bio: 'National award-winning woodturner transforming sustainably harvested Wrightia wood with vegetable lacquer.',
        experienceYears: 25,
        craftStory: 'We do not paint with brushes; we press natural lacquer sticks against spinning wood until friction melts the color into the grain.',
        languages: ['Kannada', 'Urdu', 'Hindi', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: 'Mysore Palace & Government Silk Factory',
        type: 'Royal Palace & Factory Tours',
        description: 'Magnificent Indo-Saracenic palace and working historical silk lofts.',
        district: 'Mysuru',
      },
    ],
    workshops: [
      {
        title: 'Hands-on Lathe Woodturning & Natural Lacquer Buffing',
        artisan: 'Syed Nizamuddin',
        duration: '1 Day',
        level: 'Beginner',
        spotsLeft: 5,
      },
    ],
    events: [
      {
        title: 'Mysuru Dasara Royal Handicrafts & Silk Mela',
        date: 'Oct 08 - 18, 2026',
        location: 'Exhibition Grounds, Mysuru',
        category: 'Royal Exhibition',
      },
    ],
  },

  tamil_nadu: {
    id: 'tamil_nadu',
    svgId: 'tn',
    name: 'Tamil Nadu',
    code: 'TN',
    region: 'South India',
    tagline: 'Temple Architecture, Kanchipuram Silks and Lost-Wax Bronzes',
    description:
      'The land of towering Gopurams, pure mulberry Kanchipuram silk sarees with interlocking temple borders, Swamimalai lost-wax Chola bronze idols, and Tanjore gold foil paintings.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Meenakshi Temple Gopuram, Madurai',
    heroQuote: 'Devotion Carved in Bronze and Interlocked in Pure Silk',
    stats: {
      uniqueCrafts: '26+',
      artisans: '2.4K+',
      districts: '38',
    },
    crafts: [
      {
        id: 'kanchipuram-silk',
        name: 'Kanchipuram Silk Saree',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        description:
          'Heavyweight pure mulberry silk woven with Korvai interlocking technique, joining the temple borders and pallu with pure silver and gold Zari.',
        technique: 'Korvai Interlocking Weaving & Petni Silk Joining on Handlooms',
        materials: ['3-Ply Mulberry Silk', 'Certified 57% Pure Silver Zari', 'Gold Electroplate'],
        knownFor: ['Bridal Kanchipuram Sarees', 'Temple Borders', 'Pavadais'],
        culturalSignificance: 'Sacred bridal and temple heirloom of South India',
        giTag: 'GI-2005-TN-0001',
        isGI: true,
      },
      {
        id: 'swamimalai-bronze',
        name: 'Swamimalai Chola Bronze Icons',
        image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        description:
          'Centuries-old lost-wax (cire perdue) casting producing sacred bronze deities according to strict Shilpa Shastra mathematical proportions.',
        technique: 'Lost-Wax Panchaloha Metal Casting according to Shilpa Shastras',
        materials: ['Panchaloha (Copper, Zinc, Lead, Gold, Silver)', 'Beeswax', 'Cauvery Clay'],
        knownFor: ['Nataraja Bronzes', 'Deity Murtis', 'Temple Bells'],
        culturalSignificance: 'Chola Dynasty 1,000-year living metallurgical sacred art',
        giTag: 'GI-2008-TN-0084',
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: 'artisan-sundaram-kanchipuram',
        name: 'K. Sundara Mudaliar',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        location: 'Kanchipuram',
        state: 'Tamil Nadu',
        craftId: 'kanchipuram-silk',
        craftName: 'Kanchipuram Silk',
        rating: 4.96,
        reviewsCount: 180,
        tags: ['Korvai Weaving', 'Temple Silks'],
        bio: 'Master Korvai weaver keeping the ancient double-shuttle temple border technique alive.',
        experienceYears: 36,
        craftStory: 'In Korvai weaving, two artisans sit side-by-side throwing shuttles across opposite edges. It is a dance of complete trust and synchronized breath.',
        languages: ['Tamil', 'Telugu', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: 'Brihadisvara Temple (UNESCO) & Swamimalai Bronze Guilds',
        type: 'Chola Grand Temple & Metalwork Quarter',
        description: 'Living temple complex and world-famous bronze sculpting foundries.',
        district: 'Thanjavur',
      },
    ],
    workshops: [
      {
        title: 'Shilpa Shastra Proportions & Lost-Wax Casting Masterclass',
        artisan: 'Stapathi Radhakrishnan',
        duration: '4 Days',
        level: 'Intermediate',
        spotsLeft: 2,
      },
    ],
    events: [
      {
        title: 'Chennai Heritage Handloom & Craft Mahotsav',
        date: 'Dec 12 - 22, 2026',
        location: 'Kalakshetra Foundation, Chennai',
        category: 'Classical Conclave',
      },
    ],
  },
};

// Helper function to find state heritage by ID, name or SVG code
export function getStateHeritage(query: string): StateHeritageData {
  if (!query) return HERITAGE_MAP_DATA.telangana;
  const q = query.toLowerCase().trim();

  // Try direct key
  if (HERITAGE_MAP_DATA[q]) return HERITAGE_MAP_DATA[q];

  // Try matching name or code or svgId
  for (const state of Object.values(HERITAGE_MAP_DATA)) {
    if (
      state.id.toLowerCase() === q ||
      state.name.toLowerCase() === q ||
      state.svgId.toLowerCase() === q ||
      state.code.toLowerCase() === q
    ) {
      return state;
    }
  }

  // Graceful fallback: return a synthesized fallback state object if querying an unlisted state
  const capitalized = query.charAt(0).toUpperCase() + query.slice(1).replace(/_/g, ' ');
  return {
    id: q,
    svgId: q.slice(0, 2),
    name: capitalized,
    code: q.slice(0, 2).toUpperCase(),
    region: 'North India',
    tagline: `Living Craft Traditions of ${capitalized}`,
    description: `${capitalized} possesses a distinguished artisanal heritage, passed down through generations of craft families preserving indigenous techniques, sustainable materials, and cultural storytelling.`,
    heroImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: `${capitalized} Heritage Cluster`,
    heroQuote: `Preserving the Living Heritage of ${capitalized}`,
    stats: {
      uniqueCrafts: '12+',
      artisans: '800+',
      districts: '20+',
    },
    crafts: [
      {
        id: `${q}-traditional-craft`,
        name: `Traditional Crafts of ${capitalized}`,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        description: `Authentic indigenous handlooms and crafts crafted by master cooperatives across ${capitalized}.`,
        technique: 'Ancestral Manual Handcrafting',
        materials: ['Natural Fibers', 'Local Clay / Wood', 'Botanical Colors'],
        knownFor: ['Textiles', 'Home Decor', 'Heritage Artifacts'],
        culturalSignificance: `Preservation of regional identity and master craftsmanship in ${capitalized}`,
        isGI: true,
      },
    ],
    suggestedArtisans: [
      {
        id: `artisan-${q}-1`,
        name: `Master Artisan of ${capitalized}`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80&q=80',
        location: `${capitalized}, India`,
        state: capitalized,
        craftId: `${q}-traditional-craft`,
        craftName: 'Handicrafts & Handlooms',
        rating: 4.8,
        reviewsCount: 54,
        tags: ['Heritage Revival', 'Handmade'],
        bio: `Master artisan dedicated to preserving indigenous craft techniques in ${capitalized}.`,
        experienceYears: 20,
        craftStory: `Our family has practiced this craft with reverence for natural materials and generational patience.`,
        languages: ['Hindi', 'English'],
        isAvailableForCustom: true,
        isAvailableForLearning: true,
      },
    ],
    touristPlaces: [
      {
        name: `${capitalized} Heritage Craft Village`,
        type: 'Artisan Hub',
        description: `Explore working craft clusters, interactive handlooms, and rural cooperatives.`,
        district: capitalized,
      },
    ],
    workshops: [
      {
        title: `Introduction to ${capitalized} Master Craft Techniques`,
        artisan: `Master Cooperative of ${capitalized}`,
        duration: '1 Day Workshop',
        level: 'All Levels',
        spotsLeft: 6,
      },
    ],
    events: [
      {
        title: `${capitalized} Annual Living Crafts Mela`,
        date: 'Nov 2026',
        location: `${capitalized} State Exhibition Grounds`,
        category: 'Craft Fair & Exhibition',
      },
    ],
  };
}
