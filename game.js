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
"################"]];
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
const IMG={};['grass','path','wall','day_wall','night_wall','tree','door_closed','door_open','lantern','friend_day','friend_night','sparkle'].forEach(n=>{const i=new Image();i.src='assets/img/'+n+'.png';IMG[n]=i});
const SFX={};let muted=false;[['shift','ogg'],['found','ogg'],['home','ogg'],['door','ogg'],['win','wav']].forEach(([n,e])=>{const a=new Audio('assets/sfx/'+n+'.'+e);a.volume=.35;SFX[n]=a});
function play(n){if(muted)return;try{const a=SFX[n].cloneNode();a.volume=.35;a.play().catch(()=>{})}catch(e){}}
const c=document.getElementById('c'),x=c.getContext('2d'),T=64,HUD=40;x.imageSmoothingEnabled=false;
let S;
function bubble(t){S.bub={t,until:S.t+240}}
function load(){const L=LEVELS[0];S={layer:'day',map:L.map(r=>r.split('')),friends:[],following:[],home:0,total:0,won:false,doorOpen:false,sparks:[],msg:'Find the lost friends and guide them home to the Tree.',t:S?S.t:0};
 S.map.forEach((r,y)=>r.forEach((ch,X)=>{if(ch=='S'){S.p={x:X,y};r[X]='.'}
  if(ch=='f'||ch=='g'){S.friends.push({x:X,y,layer:ch=='f'?'day':'night',found:false,home:false});r[X]='.';S.total++}
  if(ch=='T')S.tree={x:X,y};if(ch=='H')S.door={x:X,y}}));}
function solid(tx,ty,layer){const ch=S.map[ty][tx];return ch=='#'||ch=='T'||(ch=='H'&&!S.doorOpen)||(ch=='D'&&layer=='day')||(ch=='N'&&layer=='night')}
function move(dx,dy){if(S.won)return;const nx=S.p.x+dx,ny=S.p.y+dy;if(solid(nx,ny,S.layer))return;
 const prev={x:S.p.x,y:S.p.y};S.p.x=nx;S.p.y=ny;
 let last=prev;for(const f of S.following){const o={x:f.x,y:f.y};f.x=last.x;f.y=last.y;last=o}
 check()}
function shift(){if(S.won)return;const o=S.layer=='day'?'night':'day';
 if(solid(S.p.x,S.p.y,o)){S.msg='Something is in the way on the other side\u2026';return}
 S.layer=o;play('shift');S.msg=o=='day'?'Day shift: the sun is up.':'Night shift: the lantern lights the path.';
 for(const f of S.following){f.x=S.p.x;f.y=S.p.y}check()}
function spark(tx,ty){for(let i=0;i<6;i++)S.sparks.push({x:tx*T+32,y:ty*T+32,vx:(Math.random()-.5)*3,vy:-Math.random()*3,life:50})}
function check(){for(const f of S.friends){if(!f.found&&f.layer==S.layer&&f.x==S.p.x&&f.y==S.p.y){f.found=true;S.following.push(f);S.msg='A lost friend is following your lantern!';bubble(pick(AFF[S.layer]));play('found');spark(f.x,f.y)}}
 if(S.following.length&&Math.abs(S.p.x-S.tree.x)+Math.abs(S.p.y-S.tree.y)<=1){S.home+=S.following.length;S.following.forEach(f=>f.home=true);S.following=[];
  bubble(pick(AFF[S.layer]));play('home');spark(S.tree.x,S.tree.y);
  if(S.home==S.total){S.doorOpen=true;play('door');S.msg='Everyone is safe. The home door is open \u2014 step inside.'}else S.msg='Welcome home, little one. \u{1F90D}'}
 if(S.doorOpen&&S.p.x==S.door.x&&S.p.y==S.door.y){S.won=true;S.quote=pick(QUOTES);S.bub=null;play('win');S.msg='Everyone is home. The golden fruit glows. Soft eyes.'}}
addEventListener('keydown',e=>{const k=e.key;
 if(k=='Shift'){shift();e.preventDefault();return}
 if(k=='m'||k=='M'){muted=!muted;S.msg=muted?'Sound off (M)':'Sound on (M)';return}
 const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[k.length==1?k.toLowerCase():k];
 if(m){move(...m);e.preventDefault()} if(k=='r'||k=='R')load()});
function img(n,tx,ty,a=1){if(IMG[n].complete&&IMG[n].naturalWidth){x.globalAlpha=a;x.drawImage(IMG[n],tx*T,ty*T,T,T);x.globalAlpha=1}}
function glow(px,py,r,col){const g=x.createRadialGradient(px,py,2,px,py,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,200,110,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill()}
function wrap(t,cx,y,mw,lh){x.textAlign='center';let line='';for(const w of t.split(' ')){if(x.measureText(line+w).width>mw){x.fillText(line,cx,y);line='';y+=lh}line+=w+' '}x.fillText(line,cx,y);x.textAlign='left'}
function draw(){S.t++;const day=S.layer=='day';x.imageSmoothingEnabled=false;
 S.map.forEach((r,y)=>r.forEach((ch,X)=>{
  img(ch=='p'?'path':'grass',X,y);
  if(ch=='#')img('wall',X,y);
  else if(ch=='D')img('day_wall',X,y,day?1:.22);
  else if(ch=='N')img('night_wall',X,y,day?.22:1);
  else if(ch=='T')img('tree',X,y);
  else if(ch=='H')img(S.doorOpen?'door_open':'door_closed',X,y)}));
 for(const f of S.friends){if(f.home||f.found&&false)continue;const vis=f.found||f.layer==S.layer;
  x.globalAlpha=vis?1:.15;const b=4*Math.sin(S.t/10+f.x);x.drawImage(IMG['friend_'+f.layer],f.x*T,f.y*T+b,T,T);x.globalAlpha=1}
 // shift tint for the whole scene: warm cream by day, navy/violet by night
 x.fillStyle=day?'rgba(255,236,200,0.18)':'rgba(20,18,70,0.62)';x.fillRect(0,0,c.width,c.height-HUD);
 // night path glows faintly, lanterns glow amber (drawn in code)
 x.globalCompositeOperation='lighter';
 if(!day)S.map.forEach((r,y)=>r.forEach((ch,X)=>{if(ch=='p')glow(X*T+32,y*T+32,26,'rgba(255,190,90,0.10)')}));
 const lx=S.p.x*T+50,ly=S.p.y*T+30;glow(lx,ly,day?70:150+4*Math.sin(S.t/9),day?'rgba(255,200,110,0.18)':'rgba(255,190,90,0.45)');
 glow(S.door.x*T+32,S.door.y*T+20,S.doorOpen?160:70,S.doorOpen?'rgba(255,210,120,0.55)':'rgba(255,190,90,0.25)');
 glow(S.tree.x*T+32,S.tree.y*T+28,S.won?140+10*Math.sin(S.t/8):60,'rgba(255,215,0,0.35)');
 x.globalCompositeOperation='source-over';
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
 x.fillText((day?'\u2600 Day shift':'\u263E Night shift')+'   Home: '+S.home+'/'+S.total+'   '+S.msg+(muted?'   \u{1F507}':''),12,c.height-13);
 if(S.bub&&S.t<S.bub.until){const a=Math.min(1,(S.bub.until-S.t)/40);x.globalAlpha=a;x.font='20px sans-serif';const w=x.measureText(S.bub.t).width+34;
  const bx=Math.max(6,Math.min(c.width-w-6,px+32-w/2)),by=py>100?py-54:py+70;
  x.fillStyle='#fffaf0';x.strokeStyle='#d4af37';x.lineWidth=3;x.beginPath();x.roundRect(bx,by,w,40,16);x.fill();x.stroke();x.fillStyle='#3b2f1e';x.fillText(S.bub.t,bx+17,by+27);x.globalAlpha=1}
 if(S.won){const W=c.width;x.fillStyle='#000b';x.fillRect(W/2-300,250,600,110);x.fillStyle='#ffd700';x.font='bold 36px sans-serif';x.textAlign='center';x.fillText('Safe Haven \u2728',W/2,300);
  x.fillStyle='#f4ecd8';x.font='20px sans-serif';x.fillText('Everyone is home. Press R to play again.',W/2,338);
  x.fillStyle='#000c';x.fillRect(60,390,W-120,130);x.fillStyle='#fff6d8';x.font='italic 22px Georgia,serif';wrap('\u201c'+S.quote[0]+'\u201d',W/2,428,W-180,28);
  x.fillStyle='#ffd700';x.font='16px sans-serif';x.textAlign='center';x.fillText('\u2014 '+S.quote[1],W/2,500);x.textAlign='left'}
 requestAnimationFrame(draw)}
c.width=16*T;c.height=13*T+HUD;load();draw();
