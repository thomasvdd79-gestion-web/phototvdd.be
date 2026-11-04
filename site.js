
(function(){
 var d=document,q=function(s,r){return (r||d).querySelector(s)},qa=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
 // mobile menu
 var sh=q('.sheet'),bg=q('.burger.open-menu');
 if(sh&&bg){bg.onclick=function(){sh.classList.add('open');d.body.classList.add('locked');q('.close',sh).focus()};
  q('.close',sh).onclick=function(){sh.classList.remove('open');d.body.classList.remove('locked');bg.focus()}}
 // home: rotating full-screen photographs in random order
 qa('.rot').forEach(function(show){var fs=qa('figure',show),ord=fs.map(function(_,i){return i}),k=0;
  for(var i=ord.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=ord[i];ord[i]=ord[j];ord[j]=t}
  fs.forEach(function(f){f.classList.remove('on')});fs[ord[0]].classList.add('on');
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(function(){fs[ord[k]].classList.remove('on');k=(k+1)%ord.length;fs[ord[k]].classList.add('on')},5200)});
 // index: one size for every title on the site, set so the longest one fits on a line
 var tl=q('.titles');
 if(tl){function fit(){var m=d.createElement('span');m.className='big';m.textContent=tl.dataset.longest;m.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font-size:100px';d.body.appendChild(m);
   var w=m.getBoundingClientRect().width;m.remove();var avail=tl.clientWidth*0.98;tl.style.setProperty('--tsize',Math.min(118,Math.floor(100*avail/w))+'px')}
  fit();addEventListener('resize',fit);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(fit)}
 // index: a photograph follows the cursor over the titles
 var pk=q('.peek');
 if(pk){qa('.titles a').forEach(function(a){
   a.addEventListener('mouseenter',function(){pk.src=a.dataset.cover;pk.classList.add('on')});
   a.addEventListener('mouseleave',function(){pk.classList.remove('on')})});
  d.addEventListener('mousemove',function(ev){pk.style.left=ev.clientX+'px';pk.style.top=ev.clientY+'px'},{passive:true})}
 var num=q('.g-bar .num b');
 function pad(n){return n<10?'0'+n:''+n}
 // slides: one photograph at a time
 var sl=q('.slides');
 if(sl){var ss=qa('.slide',sl),cur=0,tot=ss.length,photoN=qa('.slide img',sl).length;
  function go(n){n=Math.max(0,Math.min(tot-1,n));ss[cur].classList.remove('on');cur=n;ss[cur].classList.add('on');sl.classList.toggle('on-text',ss[cur].classList.contains('text'));
   var p=ss[cur].dataset.n;num.textContent=p?pad(+p):'Text';try{history.replaceState(null,'','#'+(cur+1))}catch(e){}}
  var h=parseInt((location.hash||'').slice(1),10);if(h>1&&h<=tot)go(h-1);
  q('.hit.prev').onclick=q('.b-prev').onclick=function(){go(cur-1)};
  q('.hit.next').onclick=q('.b-next').onclick=function(){go(cur+1)};
  d.addEventListener('keydown',function(ev){if(ev.key==='ArrowRight'||ev.key===' '){ev.preventDefault();go(cur+1)}else if(ev.key==='ArrowLeft'){go(cur-1)}});
  var x0=null;sl.addEventListener('touchstart',function(ev){x0=ev.touches[0].clientX},{passive:true});
  sl.addEventListener('touchend',function(ev){if(x0===null)return;var dx=ev.changedTouches[0].clientX-x0;if(Math.abs(dx)>45)go(cur+(dx<0?1:-1));x0=null})}
 // strip: horizontal row, the mouse wheel scrolls sideways
 var st=q('.strip');
 if(st){st.addEventListener('wheel',function(ev){if(Math.abs(ev.deltaY)>Math.abs(ev.deltaX)&&!ev.target.closest('.tb')){st.scrollLeft+=ev.deltaY;ev.preventDefault()}},{passive:false});
  var figs=qa('figure',st),tk=false;
  function upd(){tk=false;var mid=innerWidth/2,best=null,bd=1e9;figs.forEach(function(f){var r=f.getBoundingClientRect(),dd=Math.abs(r.left+r.width/2-mid);if(dd<bd){bd=dd;best=f}});if(best)num.textContent=pad(+best.dataset.n)}
  st.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});
  function step(dir){var w=st.clientWidth*.8;st.scrollBy({left:dir*w,behavior:'smooth'})}
  q('.b-prev').onclick=function(){step(-1)};q('.b-next').onclick=function(){step(1)};
  d.addEventListener('keydown',function(ev){if(ev.key==='ArrowRight')step(1);else if(ev.key==='ArrowLeft')step(-1)});upd()}
 // scroll: vertical counter
 var sc=q('.scroll');
 if(sc){var fg=qa('figure',sc),tk2=false;
  function up2(){tk2=false;var mid=innerHeight/2,best=null,bd=1e9;fg.forEach(function(f){var r=f.getBoundingClientRect(),dd=Math.abs(r.top+r.height/2-mid);if(dd<bd){bd=dd;best=f}});if(best)num.textContent=pad(+best.dataset.n)}
  addEventListener('scroll',function(){if(!tk2){tk2=true;requestAnimationFrame(up2)}},{passive:true});
  function jump(dir){var mid=innerHeight/2,idx=0,bd=1e9;fg.forEach(function(f,i){var r=f.getBoundingClientRect(),dd=Math.abs(r.top+r.height/2-mid);if(dd<bd){bd=dd;idx=i}});var t=fg[Math.max(0,Math.min(fg.length-1,idx+dir))];t.scrollIntoView({behavior:'smooth',block:'center'})}
  q('.b-prev').onclick=function(){jump(-1)};q('.b-next').onclick=function(){jump(1)};
  d.addEventListener('keydown',function(ev){if(ev.key==='ArrowDown'||ev.key==='ArrowRight'){ev.preventDefault();jump(1)}else if(ev.key==='ArrowUp'||ev.key==='ArrowLeft'){ev.preventDefault();jump(-1)}});up2()}
 // photo viewer (portraits, tear sheets): large photographs one under the other, the site menu stays on top
 var its=qa('[data-lb]');if(!its.length)return;
 var vw=d.createElement('div');vw.className='vw';vw.setAttribute('role','dialog');vw.setAttribute('aria-label','Photo viewer');
 vw.innerHTML='<div class="vw-list"></div><div class="vw-ctl"><span class="vw-n"></span><button type="button" class="vw-up" aria-label="Previous">↑</button><button type="button" class="vw-dn" aria-label="Next">↓</button><button type="button" class="vw-x">Back to all</button></div>';
 var list=q('.vw-list',vw),figs=[],last=null,vn=q('.vw-n',vw);
 its.forEach(function(b,i){var f=d.createElement('figure'),im=d.createElement('img');im.alt=q('img',b).alt;im.decoding='async';im.dataset.src=b.dataset.lb;f.appendChild(im);
  if(b.dataset.cap){var c=d.createElement('figcaption');c.textContent=b.dataset.cap;f.appendChild(c)}list.appendChild(f);figs.push(f)});
 d.body.appendChild(vw);
 function cur(){return Math.round(list.scrollTop/list.clientHeight)}
 function upd(){var k=Math.max(0,Math.min(figs.length-1,cur()));vn.textContent=(k+1)+' / '+figs.length}
 function load(i){for(var j=Math.max(0,i-2);j<Math.min(figs.length,i+4);j++){var im=q('img',figs[j]);if(!im.src)im.src=im.dataset.src}}
 function open(i){last=d.activeElement;load(i);vw.classList.add('open');d.body.classList.add('locked');list.scrollTop=figs[i].offsetTop;upd();
  setTimeout(function(){figs.forEach(function(f){var im=q('img',f);if(!im.src)im.src=im.dataset.src})},400);q('.vw-x',vw).focus({preventScroll:true})}
 function close(){vw.classList.remove('open');d.body.classList.remove('locked');if(last)last.focus()}
 function step(n){list.scrollTo({top:(cur()+n)*list.clientHeight,behavior:'smooth'})}
 its.forEach(function(b,i){b.addEventListener('click',function(){open(i)})});
 list.addEventListener('scroll',upd,{passive:true});
 q('.vw-x',vw).onclick=close;q('.vw-up',vw).onclick=function(){step(-1)};q('.vw-dn',vw).onclick=function(){step(1)};
 d.addEventListener('keydown',function(ev){if(!vw.classList.contains('open'))return;
  if(ev.key==='Escape')close();else if(ev.key==='ArrowDown'||ev.key==='ArrowRight'){ev.preventDefault();step(1)}else if(ev.key==='ArrowUp'||ev.key==='ArrowLeft'){ev.preventDefault();step(-1)}});
})();
