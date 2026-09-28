const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../content/raw');
const COMPILED_DIR = path.join(__dirname, '../content/compiled');
const OUTPUT_FILE = path.join(COMPILED_DIR, 'content.json');

// Map based on the specs in 03-SSD.md
const ISLAND_MAPPINGS = {
  jawa: {
    name: 'Jawa',
    provinces: ['banten', 'dki-jakarta', 'jawa-barat', 'jawa-tengah', 'di-yogyakarta', 'jawa-timur']
  },
  sumatra: {
    name: 'Sumatra',
    provinces: ['aceh', 'sumatera-utara', 'sumatera-barat', 'riau', 'kepulauan-riau', 'jambi', 'bengkulu', 'sumatera-selatan', 'kepulauan-bangka-belitung', 'lampung']
  },
  kalimantan: {
    name: 'Kalimantan',
    provinces: ['kalimantan-barat', 'kalimantan-tengah', 'kalimantan-selatan', 'kalimantan-timur', 'kalimantan-utara']
  },
  sulawesi: {
    name: 'Sulawesi',
    provinces: ['sulawesi-utara', 'sulawesi-tengah', 'sulawesi-selatan', 'sulawesi-tenggara', 'gorontalo', 'sulawesi-barat']
  },
  "bali-nusa": {
    name: 'Bali-Nusa',
    provinces: ['bali', 'nusa-tenggara-barat', 'nusa-tenggara-timur']
  },
  papua: {
    name: 'Papua',
    provinces: ['papua', 'papua-barat', 'papua-barat-daya', 'papua-tengah', 'papua-pegunungan', 'papua-selatan']
  }
};

const CATEGORIES_SLUG_MAP = {
  'makanan khas': 'makanan-khas',
  'pakaian adat': 'pakaian-adat',
  'tari dan seni': 'tari-dan-seni',
  'rumah adat': 'rumah-adat',
  'musik tradisi': 'musik-tradisi',
  'cerita rakyat': 'cerita-rakyat'
};

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')           // Replace spaces and underscores with -
    .replace(/[^\w\-]+/g, '')          // Remove all non-word chars
    .replace(/\-\-+/g, '-');           // Replace multiple - with single -
}

function parseMarkdownFile(filePath, allProvincesData) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  let currentProvince = null;
  let currentCategory = null;
  let currentCard = null;
  let isParsingQuiz = false;
  let isParsingReferences = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Province Heading: ## Province Name
    const provMatch = line.match(/^##\s+(.+)$/);
    if (provMatch) {
      let provName = provMatch[1].trim();
      let provId = slugify(provName);

      // Handle DI Yogyakarta / DIY edge case in ID if needed, 
      // but let's stick to slugified name.
      if (provId === 'di-yogyakarta' || provId === 'diy' || provId === 'daerah-istimewa-yogyakarta') {
        provId = 'di-yogyakarta'; // Align with mapping
      }

      currentProvince = {
        id: provId,
        name: provName,
        island: null, // Will be resolved later
        intro: '',
        categories: {},
        quiz: [],
        badge: '',
        references: []
      };
      
      allProvincesData[provId] = currentProvince;
      currentCategory = null;
      currentCard = null;
      isParsingQuiz = false;
      isParsingReferences = false;
      continue;
    }

    if (!currentProvince) continue;

    // Intro: **Pengantar:** ...
    const introMatch = line.match(/^\*\*Pengantar:\*\*\s*(.+)$/i);
    if (introMatch) {
      currentProvince.intro = introMatch[1].trim();
      continue;
    }

    // Cultural Challenge / Quiz Section
    if (line.match(/^###\s+Cultural Challenge/i)) {
      isParsingQuiz = true;
      currentCategory = null;
      currentCard = null;
      continue;
    }

    // Category Heading: ### Category Name
    const catMatch = line.match(/^###\s+(.+)$/);
    if (catMatch && !isParsingQuiz) {
      const catName = catMatch[1].trim();
      const rawCatSlug = slugify(catName);
      // Map to exact required slugs to handle slight typos or variations in source
      let catSlug = rawCatSlug;
      for (const [key, val] of Object.entries(CATEGORIES_SLUG_MAP)) {
        if (slugify(key) === rawCatSlug) catSlug = val;
      }

      currentCategory = {
        label: catName,
        cards: []
      };
      currentProvince.categories[catSlug] = currentCategory;
      currentCard = null;
      continue;
    }

    // Quiz Questions parsing
    if (isParsingQuiz) {
      // Look for: 1. **Soal:** ... **A.** ... **B.** ... **C.** ... **D.** ... **Kunci:** X. **Umpan balik:** ...
      const quizMatch = line.match(/^\d+\.\s+\*\*Soal:\*\*\s+(.+?)\s+\*\*A\.\*\*\s+(.+?)\s+\*\*B\.\*\*\s+(.+?)\s+\*\*C\.\*\*\s+(.+?)\s+\*\*D\.\*\*\s+(.+?)\s+\*\*Kunci:\*\*\s+([A-D])\.\s+\*\*Umpan balik:\*\*\s+(.+)$/i);
      
      if (quizMatch) {
        currentProvince.quiz.push({
          id: `${currentProvince.id}-q${currentProvince.quiz.length + 1}`,
          question: quizMatch[1].trim(),
          options: [
            { id: 'a', text: quizMatch[2].replace(/;$/, '').trim() },
            { id: 'b', text: quizMatch[3].replace(/;$/, '').trim() },
            { id: 'c', text: quizMatch[4].replace(/;$/, '').trim() },
            { id: 'd', text: quizMatch[5].replace(/;$/, '').trim() }
          ],
          correctOptionId: quizMatch[6].toLowerCase(),
          feedback: quizMatch[7].trim()
        });
        continue;
      }

      // Check for badge: **Lencana:** ...
      const badgeMatch = line.match(/^\*\*Lencana:\*\*\s*(.+)$/i);
      if (badgeMatch) {
        currentProvince.badge = badgeMatch[1].replace(/\.$/, '').trim();
        isParsingQuiz = false; // end of quiz questions part
        continue;
      }
    }
    
    // Fallback badge if it comes outside quiz mode
    const badgeMatchFallback = line.match(/^\*\*Lencana:\*\*\s*(.+)$/i);
    if (badgeMatchFallback && !isParsingQuiz && !isParsingReferences) {
        currentProvince.badge = badgeMatchFallback[1].replace(/\.$/, '').trim();
        continue;
    }

    // References section
    if (line.match(/^\*\*Rujukan terpilih:\*\*/i)) {
      isParsingReferences = true;
      continue;
    }

    if (isParsingReferences) {
      const refMatch = line.match(/^-\s+(.+)$/);
      if (refMatch) {
        // Just storing raw text or attempt to extract url, keeping it simple as a string for now
        // Assuming we store it as text and parse later, or just store object
        currentProvince.references.push({
          text: refMatch[1].trim()
        });
      } else if (line.match(/^---/)) {
         isParsingReferences = false;
      }
      continue;
    }

    // Card Heading: #### Card Title
    const cardMatch = line.match(/^####\s+(.+)$/);
    if (cardMatch && currentCategory) {
      const cardTitle = cardMatch[1].trim();
      currentCard = {
        id: `${currentProvince.id}-${slugify(currentCategory.label)}-${slugify(cardTitle)}`,
        title: cardTitle,
        body: ''
      };
      currentCategory.cards.push(currentCard);
      continue;
    }

    // Card Body
    if (currentCard && currentCategory && !isParsingQuiz && !isParsingReferences) {
      // Append line to body
      if (currentCard.body.length > 0) currentCard.body += '\n';
      currentCard.body += trimmed;
    }
  }
}

function main() {
  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.md'));
  let allProvincesData = {};

  files.forEach(file => {
    const filePath = path.join(RAW_DIR, file);
    parseMarkdownFile(filePath, allProvincesData);
  });

  // Attach islands to provinces and build islands array
  let islandsArr = [];
  
  for (const [islandId, islandData] of Object.entries(ISLAND_MAPPINGS)) {
    islandsArr.push({
      id: islandId,
      name: islandData.name,
      provinces: islandData.provinces
    });

    // Tag provinces with their island
    islandData.provinces.forEach(provId => {
      if (allProvincesData[provId]) {
        allProvincesData[provId].island = islandId;
      }
    });
  }

  // Inject image URLs from docs/images
  const docsImagesDir = path.join(__dirname, '../docs/images');
  Object.keys(allProvincesData).forEach(provSlug => {
      const prov = allProvincesData[provSlug];
      const provImgDir = path.join(docsImagesDir, provSlug);
      if (fs.existsSync(provImgDir)) {
          Object.keys(prov.categories).forEach(catSlug => {
              const cat = prov.categories[catSlug];
              const catImgDir = path.join(provImgDir, catSlug);
              if (fs.existsSync(catImgDir)) {
                  const files = fs.readdirSync(catImgDir).filter(f => !f.startsWith('.'));
                  cat.cards.forEach(card => {
                      const shortId = slugify(card.title);
                      const matchedFile = files.find(f => f.startsWith(shortId + '.'));
                      if (matchedFile) {
                          card.imageUrl = 'docs/images/' + provSlug + '/' + catSlug + '/' + matchedFile;
                      }
                  });
              }
          });
      }
  });

  // Validate
  let hasError = false;
  const provIds = Object.keys(allProvincesData);
  
  if (provIds.length !== 36) {
    console.error(`ERROR: Found ${provIds.length} provinces, expected 36.`);
    hasError = true;
  }

  const expectedCategories = Object.values(CATEGORIES_SLUG_MAP);

  provIds.forEach(provId => {
    const prov = allProvincesData[provId];
    if (!prov.island) {
        console.error(`ERROR: Province ${provId} not mapped to any island.`);
        hasError = true;
    }

    const catKeys = Object.keys(prov.categories);
    if (catKeys.length !== 6) {
      console.error(`ERROR: Province ${provId} has ${catKeys.length} categories, expected 6.`);
      hasError = true;
    }
    expectedCategories.forEach(cat => {
      if (!catKeys.includes(cat)) {
        console.error(`ERROR: Province ${provId} missing category '${cat}'.`);
        hasError = true;
      }
    });

    if (prov.quiz.length !== 10) {
      console.error(`ERROR: Province ${provId} has ${prov.quiz.length} quiz questions, expected 10.`);
      hasError = true;
    }
    
    prov.quiz.forEach((q, idx) => {
        if (q.options.length !== 4) {
             console.error(`ERROR: Province ${provId} question ${idx + 1} has ${q.options.length} options, expected 4.`);
             hasError = true;
        }
        if (!['a', 'b', 'c', 'd'].includes(q.correctOptionId)) {
            console.error(`ERROR: Province ${provId} question ${idx + 1} has invalid correctOptionId '${q.correctOptionId}'.`);
            hasError = true;
        }
    });

    const categories = Object.values(prov.categories);
    categories.forEach(cat => {
        cat.cards.forEach((card, idx) => {
            if (!card.title || card.title.trim() === '') {
                 console.error(`ERROR: Province ${provId}, Category ${cat.label}, Card ${idx} missing title.`);
                 hasError = true;
            }
            if (!card.body || card.body.trim() === '') {
                 console.error(`ERROR: Province ${provId}, Category ${cat.label}, Card ${card.title} missing body.`);
                 hasError = true;
            }
        });
    });

    if (!prov.references || prov.references.length === 0) {
      console.error(`ERROR: Province ${provId} has no references.`);
      hasError = true;
    }
  });

  if (hasError) {
    console.error("Validation FAILED. Please fix content or parser.");
    process.exit(1);
  }

  const finalOutput = {
    islands: islandsArr,
    provinces: allProvincesData
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalOutput, null, 2), 'utf-8');
  console.log(`Successfully compiled ${provIds.length} provinces to ${OUTPUT_FILE}`);
}

main();
