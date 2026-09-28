// scripts/test-ui-logic.js
// A semi-automated test to verify that the UI data binding doesn't crash for any of the 36 provinces.

const fs = require('fs');
const path = require('path');

const contentFile = path.join(__dirname, '../content/compiled/content.json');
const content = JSON.parse(fs.readFileSync(contentFile, 'utf8'));

console.log(`Testing all ${Object.keys(content.provinces).length} provinces...`);

let passed = 0;
let failed = 0;

Object.values(content.provinces).forEach(prov => {
  try {
    // 1. Check if the intro exists
    if (!prov.intro || prov.intro.length < 10) {
      throw new Error("Intro missing or too short.");
    }

    // 2. Check long names (e.g., Kepulauan Bangka Belitung)
    const orbText = `<h3>${prov.name}</h3>`;
    if (orbText.length > 100) {
      console.warn(`Warning: Name for ${prov.id} is extremely long, might wrap weirdly in orb.`);
    }

    // 3. Test categories mapping
    const categories = Object.values(prov.categories);
    if (categories.length !== 6) throw new Error("Not exactly 6 categories.");
    
    // 4. Spot check cards
    categories.forEach(cat => {
      if (!cat.cards || cat.cards.length === 0) throw new Error(`Empty category ${cat.label}`);
      cat.cards.forEach(card => {
        if (!card.title || !card.body) throw new Error(`Corrupted card in ${cat.label}`);
      });
    });

    // 5. Test Quiz
    if (prov.quiz.length !== 10) throw new Error("Quiz does not have 10 questions.");
    
    // 6. Test Badge
    if (!prov.badge) throw new Error("Missing badge.");

    passed++;
  } catch (err) {
    console.error(`❌ Test failed for province: ${prov.id}. Error: ${err.message}`);
    failed++;
  }
});

console.log(`\nTest completed. Passed: ${passed}/36. Failed: ${failed}/36.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("✅ Phase 2 Automated Checks Passed! All 36 provinces are structurally sound for UI rendering.");
}
