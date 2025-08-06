function showTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  document.querySelectorAll('.tab-nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleEquipment(header) {
  const content = header.nextElementSibling;
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

function toggleLog(header) {
  const body = header.nextElementSibling;
  body.style.display = body.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  // シナリオ履歴の折り畳みイベント登録
  document.querySelectorAll('.log-header').forEach(header => {
    header.addEventListener('click', () => toggleLog(header));
  });

  const chartCanvas = document.getElementById('statusChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    const ctx = chartCanvas.getContext('2d');

    function getFinalValue(label) {
      const card = Array.from(document.querySelectorAll('.stat-card'))
        .find(el => el.querySelector('h4').textContent === label);
      return card ? parseInt(card.querySelector('.final').textContent, 10) : 0;
    }

    const labels = ['器用', '機敏', '知恵', '体格', '意志', '幸運'];
    const data = labels.map(getFinalValue);

    const chartColor = 'rgba(255,99,132,1)';
    const chartFill  = 'rgba(255,99,132,0.25)';

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: '',
          data,
          backgroundColor: chartFill,
          borderColor: chartColor,
          borderWidth: 2,
          pointBackgroundColor: chartColor
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: { label: ctx => `${ctx.label}: ${ctx.formattedValue}` }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: 'rgba(255,255,255,0.2)' },
            angleLines: { color: 'rgba(255,255,255,0.2)' },
            pointLabels: {
              color: '#fff',
              font: { size: 16, weight: 'bold' },
              backdropColor: 'rgba(0,0,0,0.5)',
              backdropPadding: 5
            }
          }
        }
      },
    });
  }

  // 右側情報のセット（境遇に説明文追加）
  let fateRaw = document.querySelector('#info .info-item:nth-child(6)')?.textContent || '';
  const power = document.querySelector('.stat-card:last-child .bonus-tag')?.textContent || '';
  const sinRaw = document.querySelector('#info .info-item:nth-child(4)')?.textContent || '';

  const fateMatch = fateRaw.match(/^(.+?【(.+?)】)(.*)$/);
  let fateTitle = '';
  let fateDesc = '';
  if (fateMatch) {
    fateTitle = `境遇 ${fateMatch[2]}`;
    fateDesc = fateMatch[3].trim();
  }

  const powerText = `権力Lv. ${power.replace('権力Lv','')}`;
  const sinLabel = sinRaw.replace('原罪', '').trim();

document.getElementById('fateBox').innerHTML = fateDesc
  ? `<div style="font-weight:bold; text-align:left; font-size:1.6rem;">${fateTitle}</div><div style="font-size:1rem; font-weight:normal; text-align:left; margin-top:4px;">${fateDesc}</div>`
  : `<div style="font-weight:bold; text-align:left; font-size:1.6rem;">${fateTitle}</div>`;

document.getElementById('powerBox').innerHTML = `<div style="font-weight:bold; text-align:left; font-size:1.6rem;">${powerText}</div>`;

document.getElementById('sinBox').innerHTML = `
  <div style="font-weight:bold; text-align:left; font-size:1.6rem;">
    原罪 <img src="sin-wrath.png" alt="原罪アイコン" class="sin-icon"> ${sinLabel}
  </div>`;



document.querySelectorAll('.play-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    const voice = icon.getAttribute('data-voice');
    if (!voice) return;
    const audio = document.getElementById('voice-audio');
    audio.src = voice;
    audio.play().catch(e => console.error('音声再生エラー:', e));
  });
});


});

// 上に戻るボタン
const topBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    topBtn.style.display = 'block';
  } else {
    topBtn.style.display = 'none';
  }
});
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const bg = document.querySelector('.background-image');
  // 逆方向に動かす: 下にスクロールすると背景が上に動く
  const offset = scrollY * -0.5;  // -0.2 は動きの速さ（調整可）
  bg.style.backgroundPosition = `center calc(150% + ${offset}px)`;
});

function updateHeroImage() {
  const img = document.querySelector('.hero img');
  const scrollY = window.scrollY;
  // スクロールが増えるほど上へ動く（係数0.05は調整用）
  img.style.transform = `translate(5%, ${-scrollY * 0.3}px)`;
}
document.addEventListener('DOMContentLoaded', updateHeroImage);
window.addEventListener('scroll', updateHeroImage);