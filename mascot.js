/* Nov8rs mascot assistant. Desktop only. Loaded by site.js after the page is ready. */
(function(){
'use strict';
/* ---- settings ---- */
var C={
  quote:'https://nov8rs-quote-with-faq.vercel.app/',   /* quote builder URL */
  img:'',                 /* default mascot image (set by site.js) */
  poses:{},               /* optional: {wave:'url',hug:'url',think:'url',celebrate:'url'} when you have the extra images */
  firstDelay:8,           /* seconds before first appearance */
  gap:45,                 /* seconds between automatic messages */
  maxAuto:4,              /* automatic messages per page view */
  hideDays:30,            /* how long "Hide tips" lasts */
  quietPages:['/privacy','/terms','/thank-you','/checkout'],
  minWidth:1024
};
var o=window.NV_MASCOT||{};for(var k in o)if(o[k])C[k]=o[k];
var mq=matchMedia('(min-width:'+C.minWidth+'px) and (hover:hover) and (pointer:fine)');
if(!mq.matches||!C.img)return;
var topic=document.body.getAttribute('data-topic')||'general';
var quiet=document.body.hasAttribute('data-quiet')||C.quietPages.some(function(p){return location.pathname.indexOf(p)===0});
var isHome=/^\/?(index\.html)?$/.test(location.pathname.replace(/^.*\//,'/'))||location.pathname==='/';

var GREET=["Hi there! Need more customers? I can point you in the right direction.","Welcome to NOV8RS. Get a free, personalized quote in about 2 minutes, no sales call.","Hello! Have a look around. I'll share a quick tip or two along the way."];
var CTA={gaseo:"Want to show up on Google, Maps and AI apps? Get your free quote in 2 minutes.",ads:"Ready for more calls this month? See what your ads plan would cost, free.",website:"Thinking about a new website? Get your price in about 2 minutes.",infra:"Never miss another call. See what AI would cost for your business.",general:"See exactly what it would cost to grow your business. Free quote, no sales call."};
var EXIT=["Before you go: your free quote takes about 2 minutes, and there's no sales call.","Leaving already? Grab a free quote. It's emailed to you, no obligation."];
var TIPS=[
["general","Most customers check a business online before they call. What they find decides whether they call you or a competitor."],
["general","The businesses that grow fastest usually combine a few channels, like ads for calls now and Google for the long run."],
["general","Tracking where every enquiry comes from tells you exactly which marketing is worth paying for."],
["general","Answering enquiries quickly is one of the simplest ways to win more jobs."],
["general","Happy customers are your best marketing. Asking them for a review takes seconds."],
["general","Consistent marketing beats bursts. A steady presence keeps you top of mind when people are ready to buy."],
["general","A clear offer, like “Free inspection” or “Same-day quotes”, gives people a reason to choose you today."],
["gaseo","Google shows a map with three local businesses for many “near me” searches. Being in those three is worth a lot of calls."],
["gaseo","Photos, opening hours and services on your Google listing all help Google match you to the right searches."],
["gaseo","Answering common customer questions on your website helps you show up in Google’s quick answers."],
["gaseo","Being listed in trusted directories for your industry helps Google and AI apps trust your business."],
["gaseo","Getting found online is like owning, not renting: once you rank, calls keep coming without paying per click."],
["gaseo","AI apps like ChatGPT and Gemini often recommend businesses that are mentioned on several trusted websites."],
["gaseo","Keeping your Google listing active with posts and new photos shows Google your business is open and busy."],
["gaseo","Each town or area you serve can have its own page on your website, helping you show up in each one."],
["ads","You can set a daily budget on Google and Meta ads, so you never spend more than you planned."],
["ads","Ads can be shown only in the areas you serve, at the times you’re open."],
["ads","Call-only ads let people ring you straight from Google with one tap."],
["ads","Meta ads can show your offer to people similar to your existing customers."],
["ads","Short video ads often stand out more than images on Facebook and Instagram."],
["ads","Google shows a few ads above the results for many searches, and they take up much of what people see first on a phone."],
["ads","Every ad click can be tracked to a call or form, so you can see the real cost of each new customer."],
["ads","Seasonal offers, like “Spring AC check”, give your ads a timely reason to click."],
["website","Your homepage has seconds to say what you do, where you do it and how to contact you."],
["website","A phone number people can tap on their phone makes calling you effortless."],
["website","Before-and-after photos of your work help visitors picture the result."],
["website","Clear prices or starting prices on your website can attract better-fit enquiries."],
["website","A chat or enquiry form that replies instantly keeps visitors from leaving to check competitors."],
["website","Pages that load quickly keep more visitors, especially on a phone with a weak signal."],
["website","Every page should end with one clear next step, like “Get a free quote”."],
["brand","Customers remember how your business made them feel more than any single ad."],
["brand","A simple, memorable logo works better than a detailed one, especially at small sizes like app icons."],
["brand","The colors you choose shape how people feel about your business before they read a word."],
["brand","Consistent branding across your van, website and social media makes a small business look established."],
["brand","A clear one-line description of what you do helps people remember and recommend you."],
["social","Showing the people behind your business builds trust faster than polished ads."],
["social","Replying to comments quickly encourages more people to engage with your posts."],
["social","Posting customer success stories gives future customers proof that you deliver."],
["social","Tips and how-to posts get saved and shared, reaching people who don’t follow you yet."],
["social","Planning a month of posts in advance keeps your page active even in your busiest weeks."],
["cold","Emails that name a real problem the other business faces get far more replies than generic pitches."],
["cold","A soft question at the end, like “Worth a quick chat?”, gets more replies than a hard sell."],
["cold","Emailing a small, well-chosen list usually beats emailing thousands of random contacts."],
["cold","A friendly follow-up a few days later often gets the reply the first email didn’t."],
["infra","AI can reply to every website enquiry in seconds, even at night and on weekends."],
["infra","Missed-call text back sends an automatic message to callers you couldn’t answer, so they don’t call a competitor."],
["infra","Automatic appointment reminders help reduce no-shows."],
["infra","AI can answer the same common questions all day, freeing your team for the work that matters."],
["infra","Automated follow-ups make sure every quote you send gets chased, without anyone remembering to do it."],
["infra","AI can ask for a review automatically after each job, helping your Google rating grow."]
];

function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function track(ev){(window.dataLayer=window.dataLayer||[]).push({event:ev,topic:topic,page:location.pathname})}
function hidden(){var t=+ls('nv_m_hide')||0;return t>Date.now()}

var shown=[];try{shown=JSON.parse(ss('nv_m_tips')||'[]')}catch(e){}
function nextTip(){
  var pools=[topic,'general'],i,idx=-1;
  for(var p=0;p<pools.length&&idx<0;p++){var c=[];for(i=0;i<TIPS.length;i++)if(TIPS[i][0]===pools[p]&&shown.indexOf(i)<0)c.push(i);if(c.length)idx=pick(c)}
  if(idx<0){var all=[];for(i=0;i<TIPS.length;i++)if(shown.indexOf(i)<0)all.push(i);if(!all.length){shown=[];all=TIPS.map(function(_,j){return j})}idx=pick(all)}
  shown.push(idx);ss('nv_m_tips',JSON.stringify(shown));return TIPS[idx][1];
}

/* ---- build ---- */
var root=document.createElement('div');root.className='nvm';
var bub=document.createElement('div');bub.className='nvm-s';bub.setAttribute('role','status');bub.setAttribute('aria-live','polite');
var btn=document.createElement('button');btn.type='button';btn.className='nvm-b';btn.setAttribute('aria-label','NOV8RS assistant: show a tip');
var img=document.createElement('img');img.alt='';img.src=C.img;img.width=98;img.height=132;btn.appendChild(img);
root.appendChild(bub);root.appendChild(btn);document.body.appendChild(root);
if(hidden())root.classList.add('mini');

var autoCount=0,lastAuto=0,typingUntil=0,hideT=0,POSES=['wave','hug','think','celebrate'];
function pose(p){POSES.forEach(function(x){root.classList.remove(x)});if(p&&p!=='idle')root.classList.add(p);img.src=C.poses[p]||C.img;root.classList.remove('bump');void root.offsetWidth;root.classList.add('bump')}
function close(){bub.classList.remove('on');root.classList.remove('talk');pose('idle');clearTimeout(hideT)}
function say(p,label,text,cta){
  pose(p);
  bub.innerHTML='';
  if(label){var l=document.createElement('small');l.textContent=label;bub.appendChild(l)}
  var s=document.createElement('span');s.textContent=text;bub.appendChild(s);
  if(cta){var a=document.createElement('a');a.className='go';a.href=C.quote+'?utm_source=nov8rs.com&utm_medium=website&utm_campaign=instant_quote&utm_content=mascot';a.textContent='Get my free quote →';a.addEventListener('click',function(){track('nv_mascot_cta')});bub.appendChild(document.createElement('br'));bub.appendChild(a)}
  if(!hidden()){var h=document.createElement('button');h.type='button';h.className='hide';h.textContent='Hide tips';h.addEventListener('click',function(){ls('nv_m_hide',String(Date.now()+C.hideDays*864e5));track('nv_mascot_hide');close();root.classList.add('mini')});bub.appendChild(h)}
  var x=document.createElement('button');x.type='button';x.className='x';x.setAttribute('aria-label','Close');x.textContent='×';x.addEventListener('click',close);bub.appendChild(x);
  bub.classList.add('on');root.classList.add('talk');
  clearTimeout(hideT);hideT=setTimeout(close,9000);
}
/* automatic messages obey: quiet pages, hide-tips, max per page, gap, and typing */
function auto(fn){
  if(quiet||hidden()||autoCount>=C.maxAuto||!mq.matches)return;
  var now=Date.now(),wait=Math.max(lastAuto?lastAuto+C.gap*1000-now:0,typingUntil-now,0);
  if(wait>0){setTimeout(function(){auto(fn)},wait+60);return}
  autoCount++;lastAuto=now;fn();
}

/* ---- behavior ---- */
var appeared=false;
function appear(){
  if(appeared||!mq.matches)return;appeared=true;root.classList.add('on');
  setTimeout(function(){auto(function(){if(isHome)say('wave','',pick(GREET));else say('idle','Did you know?',nextTip())})},700);
}
setTimeout(appear,C.firstDelay*1000);
var did60=false;
function onScroll(){
  var max=document.documentElement.scrollHeight-innerHeight,p=max>0?scrollY/max:0;
  if(p>.3)appear();
  if(p>.6&&!did60&&topic!=='general'){did60=true;auto(function(){say('hug','',CTA[topic]||CTA.general,true)})}
}
addEventListener('scroll',onScroll,{passive:true});
setTimeout(function(){appear();auto(function(){say('think','Did you know?',nextTip())})},40000);
document.addEventListener('mouseout',function(e){
  if(e.relatedTarget||e.clientY>0||ss('nv_m_exit'))return;ss('nv_m_exit','1');appear();
  auto(function(){say('think','Before you go…',pick(EXIT),true)});
});
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('[data-cta]');if(!a||root.contains(a))return;
  appear();say('celebrate','','Great choice! It only takes about 2 minutes.');
});
btn.addEventListener('click',function(){say('think','Did you know?',nextTip(),autoCount>1)});
function typing(e){var t=e.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)){typingUntil=Date.now()+20000;if(bub.classList.contains('on'))close()}}
document.addEventListener('focusin',typing);document.addEventListener('input',typing);
var onMq=function(){root.style.display=mq.matches?'':'none'};
if(mq.addEventListener)mq.addEventListener('change',onMq);else if(mq.addListener)mq.addListener(onMq);
})();
