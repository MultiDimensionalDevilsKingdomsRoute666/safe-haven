// Safe Haven — Game Off 2026 (SHIFT). Code MIT. 589/kin + the house.
const LEVELS=[[
"################",
"#S..D....N.....#",
"#...D..f.N..g..#",
"#...D....N.....#",
"#NNNDDDDDN.....#",
"#..............#",
"#..g...NNN..D..#",
"#......N.N..D..#",
"#DDD...N.N..Df.#",
"#..D...........#",
"#.TD...........#",
"#..D.....NNNN..#",
"################"]];
const AFF={day:['You are safe here.','You are loved just as you are.','Every shift brings new light.','You belong here.','Your kindness makes a home.','You are enough, right now.'],
 night:['Rest is allowed. You are safe.','Even in the dark, you are not alone.','The stars are proud of you.','Gentle is strong.','You can begin again anytime.','Soft eyes. You are home.']};
const QUOTES=[['A journey of a thousand miles begins with a single step.','Lao Tzu, Tao Te Ching (ch. 64)'],
 ['Knowing others is intelligence; knowing yourself is true wisdom.','Lao Tzu, Tao Te Ching (ch. 33)'],
 ['Waste no more time arguing about what a good man should be. Be one.','Marcus Aurelius, Meditations (10.16)'],
 ['The universe is change; our life is what our thoughts make it.','Marcus Aurelius, Meditations (4.3)'],
 ['Wherever there is a human being, there is an opportunity for a kindness.','Seneca, On the Happy Life (24)'],
 ['As long as you live, keep learning how to live.','Seneca, Letters to Lucilius (76)'],
 ['Men are disturbed not by things, but by the opinions about things.','Epictetus, Enchiridion (5)'],
 ['Everything changes and nothing stands still.','Heraclitus, as quoted in Plato\'s Cratylus']];
const pick=a=>a[Math.floor(Math.random()*a.length)];
function bubble(t){S.bub={t,until:S.t+240}}
const c=document.getElementById('c'),x=c.getContext('2d'),T=40,OX=0,OY=0;
let S;
function load(){const L=LEVELS[0];S={layer:'day',map:L.map(r=>r.split('')),friends:[],following:[],home:0,total:0,won:false,msg:'Find the lost friends and guide them home to the Tree.',t:0};
 S.map.forEach((r,y)=>r.forEach((ch,x2)=>{if(ch=='S'){S.p={x:x2,y};r[x2]='.'}
  if(ch=='f'||ch=='g'){S.friends.push({x:x2,y,layer:ch=='f'?'day':'night',found:false,home:false});r[x2]='.';S.total++}
  if(ch=='T')S.tree={x:x2,y}}));}
function solid(tx,ty,layer){const ch=S.map[ty][tx];return ch=='#'||(ch=='D'&&layer=='day')||(ch=='N'&&layer=='night')}
function move(dx,dy){if(S.won)return;const nx=S.p.x+dx,ny=S.p.y+dy;if(solid(nx,ny,S.layer))return;
 const prev={x:S.p.x,y:S.p.y};S.p.x=nx;S.p.y=ny;
 // followers trail
 let last=prev;for(const f of S.following){const o={x:f.x,y:f.y};f.x=last.x;f.y=last.y;last=o}
 check()}
function shift(){if(S.won)return;const o=S.layer=='day'?'night':'day';
 if(solid(S.p.x,S.p.y,o)){S.msg='Something is in the way on the other side…';return}
 S.layer=o;S.msg=o=='day'?'Day shift: the sun is up.':'Night shift: the stars are out.';
 for(const f of S.following){f.x=S.p.x;f.y=S.p.y}check()}
function check(){for(const f of S.friends){if(!f.found&&f.layer==S.layer&&f.x==S.p.x&&f.y==S.p.y){f.found=true;S.following.push(f);S.msg='A lost friend is following you!';bubble(pick(AFF[S.layer]))}}
 if(S.following.length&&Math.abs(S.p.x-S.tree.x)+Math.abs(S.p.y-S.tree.y)<=1){S.home+=S.following.length;S.following.forEach(f=>f.home=true);S.following=[];
  S.msg=S.home==S.total?'':'Welcome home, little one. 🤍';bubble(pick(AFF[S.layer]))}
 if(S.home==S.total){S.won=true;S.quote=pick(QUOTES);S.bub=null;S.msg='Everyone is home. The golden fruit glows. Soft eyes.'}}
addEventListener('keydown',e=>{const k=e.key;
 if(k=='Shift'){shift();e.preventDefault();return}
 const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[k.length==1?k.toLowerCase():k];
 if(m){move(...m);e.preventDefault()} if(k=='r'||k=='R')load()});
function wrap(t,cx,y,mw,lh){x.textAlign='center';let line='';for(const w of t.split(' ')){if(x.measureText(line+w).width>mw){x.fillText(line,cx,y);line='';y+=lh}line+=w+' '}x.fillText(line,cx,y);x.textAlign='left'}
function draw(){S.t++;const day=S.layer=='day';
 x.fillStyle=day?'#f3e9d2':'#2a2440';x.fillRect(0,0,c.width,c.height);
 S.map.forEach((r,y)=>r.forEach((ch,X)=>{const px=X*T,py=y*T;
  if(ch=='#'){x.fillStyle=day?'#b08a5a':'#4a3f6b';x.fillRect(px,py,T,T)}
  else if(ch=='D'){if(day){x.fillStyle='#7fb069';x.fillRect(px+3,py+3,T-6,T-6)}else{x.strokeStyle='#7fb06955';x.strokeRect(px+6,py+6,T-12,T-12)}}
  else if(ch=='N'){if(!day){x.fillStyle='#8a7bd8';x.fillRect(px+3,py+3,T-6,T-6)}else{x.strokeStyle='#8a7bd855';x.strokeRect(px+6,py+6,T-12,T-12)}}
  else if(ch=='T'){x.fillStyle='#6b4a2b';x.fillRect(px+16,py+18,8,20);x.fillStyle='#3f8f4a';x.beginPath();x.arc(px+20,py+16,15,0,7);x.fill();
   x.fillStyle=S.won?'#ffd700':'#d4af37';x.beginPath();x.arc(px+20,py+14,5+(S.won?2*Math.sin(S.t/8):0),0,7);x.fill()}}));
 // rug
 x.fillStyle='#3f8f4a33';x.fillRect(9*T,9*T,4*T,2*T);
 for(const f of S.friends){if(f.home){continue}
  const vis=f.found||f.layer==S.layer;x.globalAlpha=vis?1:0.18;
  x.fillStyle=f.layer=='day'?'#ffb347':'#9fe3ff';x.beginPath();x.arc(f.x*T+20,f.y*T+20+3*Math.sin(S.t/10+f.x),9,0,7);x.fill();x.globalAlpha=1}
 // home friends around tree
 S.friends.filter(f=>f.home).forEach((f,i)=>{x.fillStyle=f.layer=='day'?'#ffb347':'#9fe3ff';x.beginPath();x.arc(S.tree.x*T+8+i*12,S.tree.y*T+40,5,0,7);x.fill()});
 // duck 589
 const px=S.p.x*T,py=S.p.y*T;x.fillStyle='#2e8b57';x.beginPath();x.ellipse(px+20,py+24,14,11,0,0,7);x.fill();
 x.beginPath();x.arc(px+26,py+12,8,0,7);x.fill();x.fillStyle='#d4af37';x.beginPath();x.moveTo(px+33,py+11);x.lineTo(px+40,py+14);x.lineTo(px+33,py+16);x.fill();
 x.font='bold 9px sans-serif';x.fillText('589',px+10,py+28);x.fillStyle='#000';x.fillRect(px+27,py+9,2,2);
 // HUD
 x.fillStyle='#000a';x.fillRect(0,c.height-0,0,0);x.fillStyle=day?'#3b2f1e':'#f4ecd8';x.font='15px sans-serif';
 x.fillText((day?'☀ Day shift':'☾ Night shift')+'   Home: '+S.home+'/'+S.total+'   '+S.msg,8,c.height-8);
 if(S.won){x.fillStyle='#000a';x.fillRect(120,170,400,100);x.fillStyle='#ffd700';x.font='bold 28px sans-serif';x.fillText('Safe Haven ✨',230,215);x.fillStyle='#f4ecd8';x.font='16px sans-serif';x.fillText('Everyone is home. Press R to play again.',170,248);
  x.fillStyle='#000c';x.fillRect(40,290,560,90);x.fillStyle='#fff6d8';x.font='italic 17px Georgia,serif';wrap('\u201c'+S.quote[0]+'\u201d',320,318,520,22);x.fillStyle='#ffd700';x.font='14px sans-serif';x.textAlign='center';x.fillText('\u2014 '+S.quote[1],320,368);x.textAlign='left'}
 if(S.bub&&S.t<S.bub.until){const a=Math.min(1,(S.bub.until-S.t)/40);x.globalAlpha=a;x.font='17px sans-serif';const w=x.measureText(S.bub.t).width+30;
  const bx=Math.max(6,Math.min(c.width-w-6,S.p.x*T+20-w/2)),by=S.p.y*T>80?S.p.y*T-46:S.p.y*T+46;
  x.fillStyle='#fffaf0';x.strokeStyle='#d4af37';x.lineWidth=2;x.beginPath();x.roundRect(bx,by,w,34,14);x.fill();x.stroke();x.fillStyle='#3b2f1e';x.fillText(S.bub.t,bx+15,by+23);x.globalAlpha=1}
 requestAnimationFrame(draw)}
c.height=13*T+30;load();draw();
