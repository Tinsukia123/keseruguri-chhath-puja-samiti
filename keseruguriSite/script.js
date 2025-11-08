// script.js - KeseruguriSite
function setLang(code){
  document.querySelectorAll('.lang').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.' + code).forEach(el=>el.classList.add('active'));
  window.scrollTo({top:0,behavior:'smooth'});
}
setLang('hi');

async function loadManifest(){
  try{
    const res = await fetch('images/list.json', {cache: "no-store"});
    if(!res.ok) throw new Error('No manifest');
    const data = await res.json();
    return data.images || [];
  }catch(e){
    return [ 'IMG-20251108-WA0088.jpg', 'IMG-20251108-WA0089.jpg', 'IMG-20251108-WA0090.jpg' ];
  }
}

function buildSlider(images){
  const slidesEl = document.getElementById('slides');
  const dotsContainer = document.getElementById('dots');
  const captionEl = document.getElementById('caption');
  const thumbsEl = document.getElementById('thumbs');
  slidesEl.innerHTML = '';
  dotsContainer.innerHTML = '';
  thumbsEl.innerHTML = '';

  const captions = images.map(fn => captionFromFilename(fn));

  images.forEach((img, idx) => {
    const div = document.createElement('div');
    div.className = 'slide';
    const im = document.createElement('img');
    im.src = 'images/' + img;
    im.alt = captions[idx] || ('Image ' + (idx+1));
    div.appendChild(im);
    slidesEl.appendChild(div);

    const d = document.createElement('div');
    d.className = 'dot' + (idx===0 ? ' active' : '');
    d.dataset.i = idx;
    d.addEventListener('click', ()=>{ goto(parseInt(d.dataset.i)); resetTimer(); });
    dotsContainer.appendChild(d);

    const th = document.createElement('img');
    th.src = 'images/' + img;
    th.dataset.index = idx;
    th.className = 'thumb' + (idx===0 ? ' active' : '');
    th.addEventListener('click', ()=>{ goto(parseInt(th.dataset.index)); resetTimer(); });
    thumbsEl.appendChild(th);
  });

  let index = 0;
  let timer = null;
  const N = images.length;
  const slides = slidesEl.children;
  function refresh(){
    slidesEl.style.transform = 'translateX(' + (-index*100) + '%)';
    captionEl.textContent = captions[index] || '';
    Array.from(dotsContainer.children).forEach((d,ii)=> d.classList.toggle('active', ii===index));
    Array.from(thumbsEl.children).forEach((t,ii)=> t.classList.toggle('active', ii===index));
  }
  function goto(i){ index = (i+N)%N; refresh(); }
  function next(){ goto((index+1)%N); }
  function resetTimer(){ if(timer) clearInterval(timer); timer = setInterval(next, 4000); }
  refresh(); resetTimer();
}

function captionFromFilename(name){
  if(name.toLowerCase().includes('morning')) return 'Morning Arghya';
  if(name.toLowerCase().includes('evening')) return 'Evening Offerings';
  return name.replace(/[-_]/g,' ').replace('.jpg','');
}

loadManifest().then(images => {
  if(images.length===0){
    document.getElementById('slides').innerHTML = '<div><p style="padding:20px">No images found in /images/ folder.</p></div>';
  } else {
    buildSlider(images);
  }
});
