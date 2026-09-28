import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add button to topbar
btn_html = '<button class="pill" style="cursor:pointer;border-color:rgba(255,212,107,0.4);color:#ffd46b" onclick="showBadges()">🏆 Lencana (<span id="badgeCount">0</span>/36)</button>'
text = text.replace('<span class="pill" id="crumb">Dunia</span>', btn_html + '\n    <span class="pill" id="crumb">Dunia</span>')

# Add modal HTML
modal_html = """
<div id="badgeModal" class="glass" style="display:none;position:absolute;z-index:9999;top:50%;left:50%;transform:translate(-50%, -50%);width:min(90vw,700px);max-height:80vh;overflow-y:auto;padding:30px;border-radius:24px;background:rgba(5,16,31,0.95)">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
    <h3 style="margin:0">🏆 Koleksi Lencana</h3>
    <button class="pill" onclick="document.getElementById('badgeModal').style.display='none'" style="cursor:pointer;background:rgba(255,255,255,0.1)">Tutup ✕</button>
  </div>
  <div id="badgeGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:15px"></div>
</div>
"""
text = text.replace('<div class="toast" id="toast"></div>', '<div class="toast" id="toast"></div>\n' + modal_html)

# Inject JS for badges
js_vars = """let unlockedBadges=JSON.parse(localStorage.getItem('ragantara_badges')||'[]');
function updateBadgeCount(){const e=document.getElementById('badgeCount');if(e)e.textContent=unlockedBadges.length;}
function showBadges(){
  const g=document.getElementById('badgeGrid');g.innerHTML='';
  Object.values(db.provinces).forEach(p=>{
    const u=unlockedBadges.includes(p.id), c=u?'#ffd46b':'#3a4b61', f=u?'':'filter:grayscale(1) opacity(0.3)';
    g.innerHTML+=`<div style="padding:15px;border-radius:15px;background:rgba(255,255,255,0.05);text-align:center;border:1px solid ${u?'rgba(255,212,107,0.3)':'transparent'}"><div style="font-size:42px;${f}">🏆</div><div style="font-size:12px;margin-top:12px;font-weight:bold;color:${c};line-height:1.2">${p.badge||'Penjelajah'}</div><div style="font-size:10px;color:#8a9fb8;margin-top:6px">${p.name}</div></div>`;
  });
  document.getElementById('badgeModal').style.display='block';
}
"""
text = text.replace('let nameMap={};', 'let nameMap={};\n' + js_vars)

# Inject updateBadgeCount into initDB
text = text.replace("console.log('DB loaded:',Object.keys(db.provinces).length,'provinces');", "console.log('DB loaded:',Object.keys(db.provinces).length,'provinces');updateBadgeCount();")

# Update showResult
old_showResult = """function showResult(){
  document.getElementById('score').textContent=scoreN+'/'+quiz.length;
  document.getElementById('resultText').textContent=scoreN===quiz.length?'Hebat! Semua tantangan berhasil dijawab. Kamu menjadi Penjelajah Budaya!':'Perjalanan selesai. Jelajahi kembali objek budaya untuk menemukan informasi yang terlewat.';
  go(8);
  if(isAudio){playSfx('music');setTimeout(()=>playSfx('music'),350);}
}"""

new_showResult = """function showResult(){
  document.getElementById('score').textContent=scoreN+'/'+quiz.length;
  if(scoreN===quiz.length) {
    const bName=db.provinces[currentProvinceSlug].badge||'Penjelajah Budaya';
    document.getElementById('resultText').textContent='Hebat! Semua tantangan berhasil dijawab. Kamu mendapat lencana '+bName+'!';
    if(!unlockedBadges.includes(currentProvinceSlug)){
      unlockedBadges.push(currentProvinceSlug);
      localStorage.setItem('ragantara_badges', JSON.stringify(unlockedBadges));
      updateBadgeCount();
      toast('🏆 Lencana baru terbuka!');
    }
  } else {
    document.getElementById('resultText').textContent='Perjalanan selesai. Jelajahi kembali objek budaya untuk menemukan informasi yang terlewat.';
  }
  go(8);
  if(isAudio){playSfx('music');setTimeout(()=>playSfx('music'),350);}
}"""
text = text.replace(old_showResult, new_showResult)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Added badges')
