const $=id=>document.getElementById(id);
const ICON={play:'<svg viewBox="0 0 14 14"><path d="M2 1l11 6-11 6z"/></svg>Start',pause:'<svg viewBox="0 0 14 14"><path d="M2 1h4v12H2zM8 1h4v12H8z"/></svg>Pause'};
const R=9,C=16;
// ---------- algorithms (generators; each yield = one visible step) ----------
function* bubble(s){const a=s.a,n=a.length;
 for(let i=0;i<n-1;i++){let sw=false;
  for(let j=0;j<n-1-i;j++){s.cmp=[j,j+1];s.msg=`Compare ${a[j]} and ${a[j+1]}`;yield;
   if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];s.swp=[j,j+1];s.msg='Swap';sw=true;yield;s.swp=[]}}
  s.done.add(n-1-i);if(!sw)break}
 for(let i=0;i<n;i++)s.done.add(i);s.cmp=[];s.msg='Sorted'}
function* selection(s){const a=s.a,n=a.length;
 for(let i=0;i<n-1;i++){let m=i;
  for(let j=i+1;j<n;j++){s.cmp=[m,j];s.msg=`Looking for the smallest value; current minimum is ${a[m]}`;yield;if(a[j]<a[m])m=j}
  if(m!==i){[a[i],a[m]]=[a[m],a[i]];s.swp=[i,m];s.msg=`Move ${a[i]} to position ${i}`;yield;s.swp=[]}
  s.done.add(i)}
 s.done.add(n-1);s.cmp=[];s.msg='Sorted'}
function* insertion(s){const a=s.a,n=a.length;s.done.add(0);
 for(let i=1;i<n;i++){let j=i;
  while(j>0){s.cmp=[j-1,j];s.msg=`Insert ${a[j]} into the sorted left side`;yield;
   if(a[j-1]>a[j]){[a[j-1],a[j]]=[a[j],a[j-1]];s.swp=[j-1,j];yield;s.swp=[];j--}else break}
  s.done.add(i)}
 s.cmp=[];s.msg='Sorted'}
function* quick(s){const a=s.a;
 function* qs(l,h){if(l>=h){if(l===h)s.done.add(l);return}
  const p=a[h];s.piv=h;let i=l;
  for(let j=l;j<h;j++){s.cmp=[j,h];s.msg=`Partition around pivot ${p}`;yield;
   if(a[j]<p){[a[i],a[j]]=[a[j],a[i]];s.swp=[i,j];yield;s.swp=[];i++}}
  [a[i],a[h]]=[a[h],a[i]];s.swp=[i,h];yield;s.swp=[];s.piv=-1;s.done.add(i);
  yield*qs(l,i-1);yield*qs(i+1,h)}
 yield*qs(0,a.length-1);s.cmp=[];s.msg='Sorted'}
function* linear(s){const a=s.a;
 for(let i=0;i<a.length;i++){s.cmp=[i];s.msg=`Is ${a[i]} equal to ${s.t}?`;yield;
  if(a[i]===s.t){s.found=i;s.msg=`Found ${s.t} at index ${i}`;return}s.out.add(i)}
 s.cmp=[];s.msg=`${s.t} is not in the array`}
function* binary(s){const a=s.a;let lo=0,hi=a.length-1;
 while(lo<=hi){const m=(lo+hi)>>1;s.lo=lo;s.hi=hi;s.cmp=[m];
  s.msg=`Middle value is ${a[m]}; target is ${s.t}`;yield;
  if(a[m]===s.t){s.found=m;s.msg=`Found ${s.t} at index ${m}`;return}
  if(a[m]<s.t){for(let k=lo;k<=m;k++)s.out.add(k);lo=m+1}else{for(let k=m;k<=hi;k++)s.out.add(k);hi=m-1}}
 s.cmp=[];s.msg=`${s.t} is not in the array`}
function* graph(s,dfs){const id=(r,c)=>r*C+c,[sr,sc]=s.start,[er,ec]=s.end;
 const open=[id(sr,sc)],par={};s.fr=new Set(open);s.vis=new Set();const seen=new Set(open);
 while(open.length){const cur=dfs?open.pop():open.shift();s.fr.delete(cur);s.vis.add(cur);
  s.msg=dfs?'Go as deep as possible, then backtrack':'Explore all neighbours before moving further out';yield;
  if(cur===id(er,ec)){let p=cur;while(p!==undefined){s.path.add(p);p=par[p]}s.msg=`Path found: ${s.path.size} cells`;return}
  const r=cur/C|0,c=cur%C;
  for(const [dr,dc] of [[-1,0],[0,1],[1,0],[0,-1]]){const nr=r+dr,nc=c+dc,n=id(nr,nc);
   if(nr<0||nc<0||nr>=R||nc>=C||seen.has(n)||s.walls.has(n))continue;
   seen.add(n);par[n]=cur;open.push(n);s.fr.add(n)}}
 s.msg='No path exists'}
const ALGOS={
 bubble:{n:'Bubble sort',k:'sort',f:bubble,t:['O(n)','O(n²)','O(n²)','O(1)'],d:'Repeatedly swaps adjacent items that are out of order, so the largest value moves to the end each pass.'},
 selection:{n:'Selection sort',k:'sort',f:selection,t:['O(n²)','O(n²)','O(n²)','O(1)'],d:'Finds the smallest remaining item and places it at the front of the unsorted part.'},
 insertion:{n:'Insertion sort',k:'sort',f:insertion,t:['O(n)','O(n²)','O(n²)','O(1)'],d:'Grows a sorted left side by sliding each new item back into its place.'},
 quick:{n:'Quick sort',k:'sort',f:quick,t:['O(n log n)','O(n log n)','O(n²)','O(log n)'],d:'Picks a pivot, moves smaller items left of it, then sorts each side the same way.'},
 linear:{n:'Linear search',k:'search',f:linear,t:['O(1)','O(n)','O(n)','O(1)'],d:'Checks each item in order until it finds the target.'},
 binary:{n:'Binary search',k:'search',f:binary,t:['O(1)','O(log n)','O(log n)','O(1)'],d:'On sorted data, checks the middle and discards half of the range each step.'},
 bfs:{n:'Breadth-first search',k:'graph',f:s=>graph(s,false),t:['O(V+E)','O(V+E)','O(V+E)','O(V)'],d:'Explores a grid layer by layer and finds the shortest path. Click cells to add walls.'},
 dfs:{n:'Depth-first search',k:'graph',f:s=>graph(s,true),t:['O(V+E)','O(V+E)','O(V+E)','O(V)'],d:'Follows one route as far as it can, then backtracks. The path found is not always the shortest.'}
};
const GROUPS=[['Sorting',['bubble','selection','insertion','quick']],['Searching',['linear','binary']],['Graph traversal',['bfs','dfs']]];
// ---------- state ----------
let cur='bubble',s,gen,timer=null,steps=0,base=[],walls=new Set(),startPos=[4,2],endPos=[4,13],painting=false;
const rnd=n=>Array.from({length:n},()=>5+Math.floor(Math.random()*95));
function newData(){const k=ALGOS[cur].k,n=+$('size').value;
 base=rnd(n);if(k==='search'||cur==='binary')base.sort((a,b)=>a-b);
 if(k==='search'){base=cur==='binary'?base:base;$('tgt').value=base[Math.floor(Math.random()*n)]}}
function reset(){steps=0;stop();const k=ALGOS[cur].k;
 s={a:base.slice(),cmp:[],swp:[],done:new Set(),out:new Set(),piv:-1,found:-1,msg:k==='graph'?'Choose Start point, End point or Walls, click the grid, then press Start':'Press Start or Step to begin',t:+$('tgt').value,
    walls,vis:new Set(),fr:new Set(),path:new Set(),start:startPos,end:endPos};
 if(cur==='binary'){s.a.sort((a,b)=>a-b)}
 gen=ALGOS[cur].f(s);draw()}
function stop(){clearTimeout(timer);timer=null;$('play').innerHTML=ICON.play.replace('Start',steps>0?'Resume':'Start')}
function tick(){const r=gen.next();steps++;draw();if(r.done){stop();return}
 const d=Math.max(5,(101-$('speed').value)*9);timer=setTimeout(tick,d)}
function stepOnce(){stop();const r=gen.next();if(!r.done)steps++;draw()}
// ---------- drawing ----------
function draw(){const k=ALGOS[cur].k,st=$('stage');$('msg').textContent=s.msg;$('steps').textContent='Steps: '+steps;
 if(k==='graph'){st.className='grid';st.style.gridTemplateColumns=`repeat(${C},1fr)`;
  let h='';for(let r=0;r<R;r++)for(let c=0;c<C;c++){const i=r*C+c;let cl='cell';
   if(s.walls.has(i))cl+=' wall';else if(s.path.has(i))cl+=' path';else if(s.fr.has(i))cl+=' fr';else if(s.vis.has(i))cl+=' vis';
   if(r===s.start[0]&&c===s.start[1])cl+=' s';if(r===s.end[0]&&c===s.end[1])cl+=' e';
   h+=`<div class="${cl}" data-i="${i}"></div>`}
  st.innerHTML=h;return}
 st.className='';const a=s.a,show=a.length<=24;let h='';
 a.forEach((v,i)=>{let cl='col';
  if(k==='sort'){if(s.done.has(i))cl+=' ok';if(s.i===i)cl+='';if(i===s.piv)cl+=' piv';if(s.cmp.includes(i))cl+=' cmp';if(s.swp.includes(i))cl+=' swp'}
  else{if(s.out.has(i))cl+=' dim';if(s.cmp.includes(i))cl+=' cmp';if(i===s.found)cl+=' ok'}
  h+=`<div class="${cl}"><i style="height:${v}%"></i><span>${show?v:''}</span></div>`});
 st.innerHTML=h}
function legend(){const k=ALGOS[cur].k;const L={sort:[['--cmp','Comparing'],['--swp','Swapping'],['--piv','Pivot'],['--ok','Sorted']],
 search:[['--cmp','Checking'],['--dim','Ruled out'],['--ok','Found']],
 graph:[['--cmp','In queue / stack'],['#9fb6d9','Visited'],['--ok','Path'],['--swp','Start'],['--piv','End'],['--ink','Wall']]}[k];
 $('legend').innerHTML=L.map(([c,t])=>`<span><b style="background:${c[0]=='-'?`var(${c})`:c}"></b>${t}</span>`).join('')}
function info(){const a=ALGOS[cur],t=a.t;$('info').innerHTML=`<strong>${a.n}</strong><div>${a.d}</div>
<table><tr><th>Best</th><th>Average</th><th>Worst</th><th>Space</th></tr><tr>${t.map(x=>`<td>${x}</td>`).join('')}</tr></table>`}
function select(key){cur=key;const k=ALGOS[key].k;
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===key));
 $('sizeL').style.display=k==='graph'?'none':'';$('tgtL').style.display=k==='search'?'':'none';$('tools').style.display=k==='graph'?'':'none';
 $('shuffle').textContent=k==='graph'?'Clear walls':'New data';
 newData();legend();info();reset()}
// ---------- wiring ----------
$('nav').innerHTML=GROUPS.map(([g,ks])=>`<h2>${g}</h2>`+ks.map(k=>`<button data-k="${k}">${ALGOS[k].n}</button>`).join('')).join('');
$('nav').onclick=e=>{if(e.target.dataset.k)select(e.target.dataset.k)};
$('play').onclick=()=>{if(timer){stop();return}
 if(s.msg==='Sorted'||/Found|not in|Path|No path/.test(s.msg)){reset()}
 $('play').innerHTML=ICON.pause;tick()};
$('step').onclick=stepOnce;
$('reset').onclick=reset;
$('shuffle').onclick=()=>{if(ALGOS[cur].k==='graph')walls.clear();else newData();reset()};
$('size').oninput=()=>{newData();reset()};
$('tgt').onchange=reset;
function paint(e){const c=e.target.closest('.cell');if(!c||ALGOS[cur].k!=='graph')return;
 const i=+c.dataset.i,r=i/C|0,col=i%C,tool=document.querySelector('input[name=tool]:checked').value;
 if(steps>0)reset();
 const isS=r===startPos[0]&&col===startPos[1],isE=r===endPos[0]&&col===endPos[1];
 if(tool==='wall'){if(isS||isE)return;if(e.type==='mouseover'){walls.add(i)}else walls.has(i)?walls.delete(i):walls.add(i)}
 else if(e.type==='mousedown'){walls.delete(i);if(tool==='start'&&!isE)startPos=[r,col];if(tool==='end'&&!isS)endPos=[r,col]}
 else return;
 reset()}
$('stage').onmousedown=e=>{painting=true;paint(e)};
$('stage').onmouseover=e=>{if(painting)paint(e)};
window.onmouseup=()=>painting=false;
$('play').innerHTML=ICON.play;
select('bubble');
