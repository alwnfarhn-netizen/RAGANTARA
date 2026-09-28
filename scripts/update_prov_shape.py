import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the eyebrow text
text = re.sub(r"s3\.querySelector\('\.eyebrow'\)\.textContent=prov\.name\+'[^']+'",
              "s3.querySelector('.eyebrow').textContent=prov.name+' • Gerbang Budaya'", text)

# Now let's inject logic to draw the province shape
old_enter = """function enterProvince(){
  enableAudio();
  if(!db||!db.provinces[currentProvinceSlug])return;
  const prov=db.provinces[currentProvinceSlug];
  const orbName=prov.name.toUpperCase();
  document.querySelector('.jatim-orb').style.setProperty('--prov-name','"'+orbName+'"');"""

new_enter = """function enterProvince(){
  enableAudio();
  if(!db||!db.provinces[currentProvinceSlug])return;
  const prov=db.provinces[currentProvinceSlug];
  const orbName=prov.name.toUpperCase();
  
  // Render province SVG instead of orb
  const stage = document.querySelector('.hero-stage');
  const feat = admFeatures.find(f => {
    let n = nameOf(f).toLowerCase().trim();
    let s = nameMap[n] || Object.keys(db.provinces).find(k => db.provinces[k].name.toLowerCase().includes(n) || n.includes(db.provinces[k].name.toLowerCase()));
    return s === currentProvinceSlug;
  });
  
  if (feat) {
    const bbox = bboxOf([feat]), W = 500, H = 500;
    const path = projectPath(feat, bbox, W, H, 40);
    stage.innerHTML = `<svg viewBox="0 0 500 500" style="width:100%;height:100%;max-height:50vh;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.4));animation:floatItem 4s ease-in-out infinite;">
      <defs>
        <linearGradient id="provGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--gold)" />
          <stop offset="100%" stop-color="#9d5724" />
        </linearGradient>
      </defs>
      <path d="${path}" fill="url(#provGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
      <text x="250" y="250" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="28" font-weight="900" letter-spacing="1" style="pointer-events:none;text-shadow:0 2px 10px rgba(0,0,0,0.8)">${orbName}</text>
    </svg><span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span>`;
  } else {
    // Fallback if not found
    stage.innerHTML = `<div class="jatim-orb" style="--prov-name:'${orbName}'"></div><span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span>`;
  }
"""

if old_enter in text:
    text = text.replace(old_enter, new_enter)
    print("Replaced enterProvince successfully")
else:
    print("Could not find enterProvince block")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
