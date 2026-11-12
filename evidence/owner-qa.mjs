import {chromium} from '/Users/USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));const base='http://127.0.0.1:62263/';const b=await chromium.launch({channel:'chrome',headless:true});const results=[];
try{for(const [name,width,height,colorScheme]of [['desktop',1440,900,'light'],['mobile',390,844,'light'],['mobile-dark',390,844,'dark'],['small-mobile',360,780,'light']]){
 const p=await b.newPage({viewport:{width,height},colorScheme,reducedMotion:'reduce',javaScriptEnabled:false});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base,{waitUntil:'networkidle'});await p.locator('#contact').scrollIntoViewIfNeeded();await p.evaluate(()=>scrollTo(0,0));
 const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,width:i.clientWidth,height:i.clientHeight})),links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.getAttribute('href')})),h1:document.querySelector('h1').innerText,internalText:/TODO|Reserved for Final|Shown in Demo|QA Gate|Placeholder|lorem ipsum|concept illustration|AI.generated|rights status|source URL|prompt|hash|PMO|not authorized/i.test(document.body.innerText),bodyText:document.body.innerText}));
 await p.screenshot({path:path.join(root,name+'-qa-full.png'),fullPage:true});
 await p.locator('#hero .button').click();const anchor=await p.evaluate(()=>({hash:location.hash,contactTop:document.querySelector('#contact').getBoundingClientRect().top}));
 await p.locator('footer a').click();const back=await p.evaluate(()=>location.hash);
 results.push({name,width,height,colorScheme,noJS:true,reducedMotion:true,...state,anchor,back,errors});await p.close();
}fs.writeFileSync(path.join(root,'OWNER_QA.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(({bodyText,links,images,...x})=>({...x,imagesOK:images.every(i=>i.ok),phoneLinks:links.filter(l=>/^(tel|mailto):/.test(l.href))})),null,2));}finally{await b.close()}
