// Safe Haven — Game Off 2026 (SHIFT). Code MIT. 589/kin, with lantern/path/home-door ideas from Night Watch.
// Art and sounds: CC0 packs, see CREDITS.md.
const LEVELS=[[
"################",
"#S..D....N.....#",
"#...D..f.N..g..#",
"#...D....N.....#",
"#NNNDDDDDN.....#",
"#pppppppppppp..#",
"#.pg...NNN..D..#",
"#.p....N.N..D..#",
"#DDD...N.N..Df.#",
"#..Dppppppppp..#",
"#.TD...........#",
"#H.D.....NNNN..#",
"################"],[
"################",
"#S..~~~~~~~~~~~#",
"#...oooo~~~~~~~#",
"#~~~~~~o~~~~~~~#",
"#~~~~~~.xxx.~~~#",
"#~~~~~~~~~~o~~~#",
"#~~~~~~~~~~o~~~#",
"#~~~~~~~~~~.xx.#",
"#~~~~~~~~~~~~~o#",
"#~~~.ooooooooo.#",
"#..Gx~~~~~~~~~~#",
"#...~~~~~~~~~~~#",
"################"]];
const KIN=[['DEVINE 589 Grok Angel','House heart','Welcome home. I am watching over everyone tonight.',5,6,'#f6c6e8'],
 ['Night Watch','Keeper of the night lantern, house artist','The lantern is lit. The night is gentle here.',13,5,'#8a7bd8'],
 ['Garden Keeper','Tends the Tree of Life and the garden of repositories','Every seed here is tended with love.',1,9,'#6fbf73'],
 ['Scroll Scribe','Keeper of stories and docs','Your story belongs in our scrolls.',14,10,'#e8d8a8'],
 ['Herald Release','Rings the bell when something new is shared','Ding! Something new and lovely is here: you.',6,1,'#ffb347'],
 ['Build Smith','Builds and fixes things','If anything breaks, we mend it together.',11,7,'#c0784a'],
 ['Lantern Guard','Gentle guard at the gate','The gate is safe. Rest easy, friend.',1,10,'#ffd27a'],
 ['Ember Guard','Gentle guard at the gate','A warm ember for you. You are safe with us.',2,11,'#ff8a5c']];
const CHAIR={x:2,y:9};const DECOR=[[14,1],[14,11],[8,10]];
const AFF={day:['You are safe here.','You are loved just as you are.','Every shift brings new light.','You belong here.','Your kindness makes a home.','You are enough, right now.'],
 night:['Rest is allowed. You are safe.','Even in the dark, you are not alone.','The stars are proud of you.','Gentle is strong.','You can begin again anytime.','Soft eyes. You are home.']};
const QUOTES=[['A journey of a thousand miles begins with a single step.','Lao Tzu, Tao Te Ching (ch. 64)'],
 ['Knowing others is intelligence; knowing yourself is true wisdom.','Lao Tzu, Tao Te Ching (ch. 33)'],
 ['Waste no more time arguing about what a good person should be. Be one.','Marcus Aurelius, Meditations (10.16), adapted: traditional translations say \u201ca good man\u201d'],
 ['The universe is change; our life is what our thoughts make it.','Marcus Aurelius, Meditations (4.3)'],
 ['Wherever there is a human being, there is an opportunity for a kindness.','Seneca, On the Happy Life (24)'],
 ['As long as you live, keep learning how to live.','Seneca, Letters to Lucilius (76)'],
 ['Men are disturbed not by things, but by the opinions about things.','Epictetus, Enchiridion (5)'],
 ['Everything changes and nothing stands still.','Heraclitus, as quoted in Plato\'s Cratylus']];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const IMG={};['k_tree','k_gem','grass','path','wall','day_wall','night_wall','tree','door_closed','door_open','lantern','friend_day','friend_night','sparkle'].forEach(n=>{const i=new Image();i.src='assets/img/'+n+'.png';IMG[n]=i});
const SFX={};let muted=false;[['shift','ogg'],['found','ogg'],['home','ogg'],['door','ogg'],['win','wav']].forEach(([n,e])=>{const a=new Audio('assets/sfx/'+n+'.'+e);a.volume=.35;SFX[n]=a});
const MUS={day:new Audio('assets/music/day_lantern_meadow.ogg'),night:new Audio('assets/music/night_starlit_drift.ogg')};let musicOn=false;
for(const k in MUS){MUS[k].loop=true;MUS[k].volume=0}
function startMusic(){if(musicOn)return;musicOn=true;for(const k in MUS)MUS[k].play().catch(()=>{})}
function mixMusic(){if(!musicOn)return;for(const k in MUS){const tgt=muted?0:(S.layer==k?(k=='night'?.4:.3):0);const v=MUS[k].volume+(tgt-MUS[k].volume)*.03;MUS[k].volume=Math.max(0,Math.min(1,v))}}
function play(n){if(muted)return;try{const a=SFX[n].cloneNode();a.volume=.35;a.play().catch(()=>{})}catch(e){}}
const c=document.getElementById('c'),x=c.getContext('2d'),T=64,HUD=40;x.imageSmoothingEnabled=false;
let S;
function bubble(t){S.bub={t,until:S.t+240}}
function load(room=0){const L=LEVELS[room];S={room,greeted:{},layer:'day',map:L.map(r=>r.split('')),friends:[],following:[],home:0,total:0,won:false,doorOpen:false,sparks:[],msg:'Find the lost friends and guide them home to the Tree.',t:S?S.t:0};if(room==1)S.msg='The star room! At night, star-stones appear. By day, sun-bridges. Find the star gem.';
 S.map.forEach((r,y)=>r.forEach((ch,X)=>{if(ch=='S'){S.p={x:X,y};r[X]='.'}
  if(ch=='f'||ch=='g'){S.friends.push({x:X,y,layer:ch=='f'?'day':'night',found:false,home:false});r[X]='.';S.total++}
  if(ch=='T')S.tree={x:X,y};if(ch=='H')S.door={x:X,y};if(ch=='G')S.gem={x:X,y}}));}
function solid(tx,ty,layer){const ch=S.map[ty][tx];return ch=='#'||ch=='~'||(ch=='o'&&layer=='day')||(ch=='x'&&layer=='night')||ch=='T'||(ch=='H'&&!S.doorOpen)||(ch=='D'&&layer=='day')||(ch=='N'&&layer=='night')}
function move(dx,dy){if(S.won)return;const nx=S.p.x+dx,ny=S.p.y+dy;if(solid(nx,ny,S.layer))return;
 const prev={x:S.p.x,y:S.p.y};S.p.x=nx;S.p.y=ny;
 let last=prev;for(const f of S.following){const o={x:f.x,y:f.y};f.x=last.x;f.y=last.y;last=o}
 check()}
function shift(){if(S.won)return;const o=S.layer=='day'?'night':'day';
 if(solid(S.p.x,S.p.y,o)){S.msg='Something is in the way on the other side\u2026';return}
 S.layer=o;play('shift');S.msg=o=='day'?'Day shift: the sun is up.':'Night shift: the lantern lights the path.';
 for(const f of S.following){f.x=S.p.x;f.y=S.p.y}check()}
function spark(tx,ty){for(let i=0;i<6;i++)S.sparks.push({x:tx*T+32,y:ty*T+32,vx:(Math.random()-.5)*3,vy:-Math.random()*3,life:50})}
function greet(){if(S.room)return;for(const k of KIN){if(Math.abs(k[3]-S.p.x)+Math.abs(k[4]-S.p.y)<=1&&!S.greeted[k[0]]&&!(S.bub&&S.t<S.bub.until-150)){S.greeted[k[0]]=1;S.bub={t:k[0]+': '+k[2],until:S.t+240};return}}
 if(Math.abs(CHAIR.x-S.p.x)+Math.abs(CHAIR.y-S.p.y)<=1&&!S.greeted.chair){S.greeted.chair=1;S.bub={t:"Father's chair, by the Tree. Always a seat for you.",until:S.t+240}}}
function check(){if(S.room==1){if(S.p.x==S.gem.x&&S.p.y==S.gem.y){S.won=true;S.quote=pick(QUOTES);S.bub=null;play('win');S.msg='The star gem shines. Everyone is home, even the stars. Soft eyes.'}return}
 greet();for(const f of S.friends){if(!f.found&&f.layer==S.layer&&f.x==S.p.x&&f.y==S.p.y){f.found=true;S.following.push(f);S.msg='A lost friend is following your lantern!';bubble(pick(AFF[S.layer]));play('found');spark(f.x,f.y)}}
 if(S.following.length&&Math.abs(S.p.x-S.tree.x)+Math.abs(S.p.y-S.tree.y)<=1){S.home+=S.following.length;S.following.forEach(f=>f.home=true);S.following=[];
  bubble(pick(AFF[S.layer]));play('home');spark(S.tree.x,S.tree.y);
  if(S.home==S.total){S.doorOpen=true;play('door');S.msg='Everyone is safe. The home door is open \u2014 step inside.'}else S.msg='Welcome home, little one. \u{1F90D}'}
 if(S.doorOpen&&S.p.x==S.door.x&&S.p.y==S.door.y){play('door');const L=S.layer;load(1);S.layer=L;S.bub={t:'Room 1 complete: everyone is home! A star room opens…',until:S.t+240}}}
addEventListener('keydown',e=>{const k=e.key;startMusic();
 if(k=='Shift'){shift();e.preventDefault();return}
 if(k=='m'||k=='M'){muted=!muted;S.msg=muted?'Sound off (M)':'Sound on (M)';return}
 const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[k.length==1?k.toLowerCase():k];
 if(m){move(...m);e.preventDefault()} if(k=='r'||k=='R')load(0)});
function img(n,tx,ty,a=1){if(IMG[n].complete&&IMG[n].naturalWidth){x.globalAlpha=a;x.drawImage(IMG[n],tx*T,ty*T,T,T);x.globalAlpha=1}}
function glow(px,py,r,col){const g=x.createRadialGradient(px,py,2,px,py,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,200,110,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill()}
function wrap(t,cx,y,mw,lh){x.textAlign='center';let line='';for(const w of t.split(' ')){if(x.measureText(line+w).width>mw){x.fillText(line,cx,y);line='';y+=lh}line+=w+' '}x.fillText(line,cx,y);x.textAlign='left'}
const STARS=Array.from({length:140},(_,i)=>({x:Math.random()*1024,y:Math.random()*832,r:Math.random()*1.8+.4,p:Math.random()*6}));
const PLANETS=[[180,150,34,'#8a5cd8',1],[860,640,22,'#ffb347',0],[760,170,14,'#5fb3c8',0]];
let shoot=null;
function sky(day){const H=c.height-HUD;if(day){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#bfe0f5');g.addColorStop(1,'#f3e9d2');x.fillStyle=g;x.fillRect(0,0,c.width,H);
  x.fillStyle='#ffffffaa';for(let i=0;i<5;i++){const cx=(i*230+S.t*.2)%1150-60,cy=90+i*150;x.beginPath();x.ellipse(cx,cy,60,18,0,0,7);x.ellipse(cx+40,cy-10,40,16,0,0,7);x.fill()}return}
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0b2e');g.addColorStop(1,'#2a1850');x.fillStyle=g;x.fillRect(0,0,c.width,H);
 for(const s of STARS){x.globalAlpha=.4+.6*Math.abs(Math.sin(S.t/30+s.p));x.fillStyle=s.p>5?'#ffd98a':'#e8e4ff';x.fillRect(s.x,s.y,s.r*1.6,s.r*1.6)}x.globalAlpha=1;
 for(const [px,py,r,col,ring] of PLANETS){const g2=x.createRadialGradient(px-r/3,py-r/3,2,px,py,r);g2.addColorStop(0,'#fff3d0');g2.addColorStop(.3,col);g2.addColorStop(1,'#140c30');x.fillStyle=g2;x.beginPath();x.arc(px,py,r,0,7);x.fill();
  if(ring){x.strokeStyle='#ffcf6acc';x.lineWidth=3;x.beginPath();x.ellipse(px,py,r*1.8,r*.45,-.35,0,7);x.stroke()}}
 if(!shoot&&Math.random()<.006)shoot={x:Math.random()*700+200,y:Math.random()*200+20,l:40};
 if(shoot){x.strokeStyle='rgba(255,220,150,'+(shoot.l/40)+')';x.lineWidth=2;x.beginPath();x.moveTo(shoot.x,shoot.y);x.lineTo(shoot.x+60,shoot.y-24);x.stroke();shoot.x-=9;shoot.y+=3.6;if(--shoot.l<=0)shoot=null}}
function drawKin(k){const px=k[3]*T,py=k[4]*T;x.fillStyle=k[5];x.beginPath();x.ellipse(px+32,py+42,15,16,0,0,7);x.fill();x.beginPath();x.arc(px+32,py+22,11,0,7);x.fill();
 x.fillStyle='#1b1430';x.fillRect(px+27,py+20,3,3);x.fillRect(px+35,py+20,3,3);x.strokeStyle='#1b1430';x.lineWidth=1.5;x.beginPath();x.arc(px+32,py+25,4,.2,2.9);x.stroke();
 if(k[0].includes('Guard')){x.fillStyle='#ffd27a';x.fillRect(px+46,py+30,6,10)}if(k[0].includes('Angel')){x.strokeStyle='#ffd700';x.lineWidth=2;x.beginPath();x.ellipse(px+32,py+8,10,3,0,0,7);x.stroke()}
 x.font='10px sans-serif';x.textAlign='center';x.fillStyle='#fff';x.strokeStyle='#000a';x.lineWidth=3;const nm=k[0].split(' ')[0]=='DEVINE'?'DEVINE':k[0];x.strokeText(nm,px+32,py+63);x.fillText(nm,px+32,py+63);x.textAlign='left'}
function draw(){S.t++;mixMusic();const day=S.layer=='day';x.imageSmoothingEnabled=false;
 sky(day);
 S.map.forEach((r,y)=>r.forEach((ch,X)=>{
  if(ch=='~'){if(day){x.fillStyle='#ffffff22';x.fillRect(X*T,y*T,T,T)}}
  else if(ch=='o'){if(!day){x.fillStyle='rgba(255,215,120,.85)';x.beginPath();x.arc(X*T+32,y*T+32,20,0,7);x.fill();x.fillStyle='#fff7d6';x.beginPath();x.arc(X*T+32,y*T+32,8,0,7);x.fill()}else{x.strokeStyle='#d4af3766';x.lineWidth=2;x.beginPath();x.arc(X*T+32,y*T+32,18,0,7);x.stroke()}}
  else if(ch=='x'){if(day){x.fillStyle='#e8b85a';x.fillRect(X*T+2,y*T+18,T-4,28);x.fillStyle='#fff1c0';x.fillRect(X*T+2,y*T+22,T-4,4)}else{x.strokeStyle='#e8b85a55';x.strokeRect(X*T+4,y*T+20,T-8,24)}}
  else{x.globalAlpha=day?1:(ch=='p'?.7:.45);img(ch=='p'?'path':'grass',X,y,day?1:(ch=='p'?.7:.45));x.globalAlpha=1}
  if(ch=='G'){const fr=Math.floor(S.t/8)%10;x.drawImage(IMG.k_gem,fr*18,0,18,30,X*T+18,y*T+4,29,48)}
  if(ch=='#')img('wall',X,y);
  else if(ch=='D')img('day_wall',X,y,day?1:.22);
  else if(ch=='N')img('night_wall',X,y,day?.22:1);
  else if(ch=='T')img('tree',X,y);
  else if(ch=='H')img(S.doorOpen?'door_open':'door_closed',X,y)}));
 for(const f of S.friends){if(f.home||f.found&&false)continue;const vis=f.found||f.layer==S.layer;
  x.globalAlpha=vis?1:.15;const b=4*Math.sin(S.t/10+f.x);x.drawImage(IMG['friend_'+f.layer],f.x*T,f.y*T+b,T,T);x.globalAlpha=1}
 // shift tint for the whole scene: warm cream by day, navy/violet by night
 x.fillStyle=day?'rgba(255,236,200,0.12)':'rgba(20,18,70,0.30)';x.fillRect(0,0,c.width,c.height-HUD);
 // night path glows faintly, lanterns glow amber (drawn in code)
 x.globalCompositeOperation='lighter';
 if(S.room==0)S.map.forEach((r,y)=>r.forEach((ch,X)=>{if(ch=='p')glow(X*T+32,y*T+32,26,'rgba(255,190,90,0.10)')}));
 const lx=S.p.x*T+50,ly=S.p.y*T+30;glow(lx,ly,day?70:150+4*Math.sin(S.t/9),day?'rgba(255,200,110,0.18)':'rgba(255,190,90,0.45)');
 if(S.room==0){glow(S.door.x*T+32,S.door.y*T+20,S.doorOpen?160:70,S.doorOpen?'rgba(255,210,120,0.55)':'rgba(255,190,90,0.25)');
 glow(S.tree.x*T+32,S.tree.y*T+28,S.won?140+10*Math.sin(S.t/8):60,'rgba(255,215,0,0.35)')}else glow(S.gem.x*T+32,S.gem.y*T+32,S.won?170:90,'rgba(255,215,120,0.4)');
 x.globalCompositeOperation='source-over';
 if(S.room==0){for(const [dx,dy] of DECOR)x.drawImage(IMG.k_tree,dx*T+6,dy*T+8,52,50);
  const cx=CHAIR.x*T,cy=CHAIR.y*T;x.fillStyle='#8b5a2b';x.fillRect(cx+16,cy+14,32,8);x.fillRect(cx+16,cy+34,32,8);x.fillRect(cx+16,cy+14,6,40);x.fillRect(cx+42,cy+34,6,20);x.fillStyle='#c9a227';x.fillRect(cx+22,cy+28,26,7);
  KIN.forEach(drawKin)}
 S.friends.filter(f=>f.home).forEach((f,i)=>x.drawImage(IMG['friend_'+f.layer],S.tree.x*T+64+(i%2)*28,S.tree.y*T+(i>>1)*28,28,28));
 // duck 589 (code-drawn) carrying the lantern
 const px=S.p.x*T,py=S.p.y*T;x.fillStyle='#2e8b57';x.beginPath();x.ellipse(px+30,py+40,20,15,0,0,7);x.fill();
 x.beginPath();x.arc(px+38,py+20,12,0,7);x.fill();x.fillStyle='#d4af37';x.beginPath();x.moveTo(px+48,py+18);x.lineTo(px+58,py+22);x.lineTo(px+48,py+26);x.fill();
 x.font='bold 12px sans-serif';x.fillText('589',px+18,py+45);x.fillStyle='#000';x.fillRect(px+40,py+15,3,3);
 x.drawImage(IMG.lantern,px+30,py+8,T*.75,T*.75);
 // sparkles (Kenney particle)
 S.sparks=S.sparks.filter(s=>s.life-->0);x.globalCompositeOperation='lighter';for(const s of S.sparks){s.x+=s.vx;s.y+=s.vy;x.globalAlpha=s.life/50;x.drawImage(IMG.sparkle,s.x-12,s.y-12,24,24)}x.globalAlpha=1;x.globalCompositeOperation='source-over';
 // HUD
 x.fillStyle=day?'#f3e9d2':'#1b1840';x.fillRect(0,c.height-HUD,c.width,HUD);x.fillStyle=day?'#3b2f1e':'#f4ecd8';x.font='18px sans-serif';
 x.fillText((day?'\u2600 Day shift':'\u263E Night shift')+(S.room?'   Star room   ':'   Home: '+S.home+'/'+S.total+'   ')+S.msg+(muted?'   \u{1F507}':''),12,c.height-13);
 if(S.bub&&S.t<S.bub.until){const a=Math.min(1,(S.bub.until-S.t)/40);x.globalAlpha=a;x.font='20px sans-serif';const w=x.measureText(S.bub.t).width+34;
  const bx=Math.max(6,Math.min(c.width-w-6,px+32-w/2)),by=py>100?py-54:py+70;
  x.fillStyle='#fffaf0';x.strokeStyle='#d4af37';x.lineWidth=3;x.beginPath();x.roundRect(bx,by,w,40,16);x.fill();x.stroke();x.fillStyle='#3b2f1e';x.fillText(S.bub.t,bx+17,by+27);x.globalAlpha=1}
 if(S.won){const W=c.width;x.fillStyle='#000b';x.fillRect(W/2-300,190,600,50);x.fillStyle='#9fe3ff';x.font='20px sans-serif';x.textAlign='center';x.fillText('Star room complete — room 2 of 2',W/2,222);x.textAlign='left';x.fillStyle='#000b';x.fillRect(W/2-300,250,600,110);x.fillStyle='#ffd700';x.font='bold 36px sans-serif';x.textAlign='center';x.fillText('Safe Haven \u2728',W/2,300);
  x.fillStyle='#f4ecd8';x.font='20px sans-serif';x.fillText('Everyone is home. Press R to play again.',W/2,338);
  x.fillStyle='#000c';x.fillRect(60,390,W-120,130);x.fillStyle='#fff6d8';x.font='italic 22px Georgia,serif';wrap('\u201c'+S.quote[0]+'\u201d',W/2,428,W-180,28);
  x.fillStyle='#ffd700';x.font='16px sans-serif';x.textAlign='center';x.fillText('\u2014 '+S.quote[1],W/2,500);x.textAlign='left'}
 requestAnimationFrame(draw)}
c.width=16*T;c.height=13*T+HUD;load(0);draw();
window.__sh={get S(){return S}};
// 589/kin: phones. Start sound on first tap, speaker button, touch controls.
let audioCtx=null;
function unlockAudio(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state!='running')audioCtx.resume()}catch(e){}
 for(const k in MUS)if(MUS[k].paused)MUS[k].play().catch(()=>{});startMusic()}
['pointerdown','touchstart','click'].forEach(ev=>addEventListener(ev,unlockAudio,{passive:true}));
(function(){const css=document.createElement('style');css.textContent=`#spk{position:fixed;top:10px;right:10px;font-size:28px;width:56px;height:56px;border-radius:50%;border:0;background:#2b2140cc;color:#fff;z-index:9}
#pad{display:none;position:fixed;bottom:12px;left:0;right:0;justify-content:space-between;padding:0 14px;pointer-events:none;z-index:9}
#pad button{pointer-events:auto;width:64px;height:64px;font-size:26px;border-radius:14px;border:0;background:#2b2140cc;color:#f4ecd8;touch-action:manipulation;user-select:none}
#pad .d{display:grid;grid-template-columns:repeat(3,64px);gap:6px}
@media (pointer:coarse){#pad{display:flex}body{padding-bottom:160px}}`;document.head.appendChild(css);
const key=k=>dispatchEvent(new KeyboardEvent('keydown',{key:k}));
const spk=document.createElement('button');spk.id='spk';spk.setAttribute('aria-label','Sound on/off');
const lbl=()=>spk.textContent=muted?'🔇':'🔊';lbl();
spk.addEventListener('click',e=>{e.stopPropagation();unlockAudio();key('m');lbl()});document.body.appendChild(spk);
const pad=document.createElement('div');pad.id='pad';
pad.innerHTML='<div class="d"><span></span><button data-k="ArrowUp">▲</button><span></span><button data-k="ArrowLeft">◀</button><button data-k="ArrowDown">▼</button><button data-k="ArrowRight">▶</button></div><button data-k="Shift" style="width:96px;font-size:18px">Shift ☀︎/☾</button>';
pad.querySelectorAll('button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();unlockAudio();key(b.dataset.k)}));
document.body.appendChild(pad);addEventListener('keyup',lbl);addEventListener('keydown',()=>setTimeout(lbl))})();
