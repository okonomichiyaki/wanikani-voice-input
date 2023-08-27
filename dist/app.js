(()=>{function t(t){return t&&t.__esModule?t.default:t}const e={EntryPrompt:"span.page-header__icon.page-header__icon",EntryMeaning:"#section-meaning > section:nth-child(1) > div:nth-child(1) > p",EntryAltMeanings:"#section-meaning > section:nth-child(1) > div:nth-child(2) > p",EntryKanjiReading:".subject-readings__reading--primary .subject-readings__reading-items",EntryVocabReading:".reading-with-audio__reading",Category:"span.quiz-input__question-category",Type:"span.quiz-input__question-type",Prompt:"div.character-header__characters",LessonMeaning:"div.character-header__meaning",Synonyms:"#quiz-user-synonyms script",Subjects:'#quiz-queue > script[data-quiz-queue-target="subjects"]',Next:"div.quiz-input__input-container button"};function n(){const t=document.querySelector(e.Type);return t?t.textContent.trim().toLowerCase():document.location.href.match("vocabulary")||document.location.href.match("kanji")?"reading":document.location.href.match("radicals")?"name":null}function r(){const t=n();return"meaning"===t||"name"===t?"en-US":"reading"===t?"ja-JP":"en-US"}function o(){const t=document.querySelector(e.EntryPrompt);if(!t)return null;let n=t.textContent;return""===n?null:n}function i(){let t="";document.location.href.match("review")&&(t="review"),document.location.href.match("lesson")&&(t="lesson"),document.location.href.match("quiz")&&(t="quiz"),document.location.href.match("vocabulary|radicals|kanji")&&(t="entry");const r=function(){const t=document.querySelector(e.Prompt);if(!t)return o();let n=t.textContent;return""===n&&t.childNodes.length>0&&t.childNodes[0].getAttribute("aria-label")&&(n=t.childNodes[0].getAttribute("aria-label").toLowerCase()),""===n?null:n}(),i=function(){const t=document.querySelector(e.Subjects);if(!t)return function(){const t=o(),n=document.querySelector(e.EntryMeaning);let r=document.querySelector(e.EntryKanjiReading);r||(r=document.querySelector(e.EntryVocabReading));if(!t||!n||!r)return null;const i={},c={};c.meanings=[n.textContent],c.readings=[{reading:r.textContent.trim()}],i[n.textContent]=[c],i[c.readings[0]]=[c],i[t]=[c];const a=document.querySelector(e.EntryAltMeaning);if(a){const t=a.textContent.split(",").map((t=>t.trim()));for(const e of t)i[e]=[c];c.meanings.push(...t)}return i}();const n=JSON.parse(t.textContent),r={};for(const t of n){if(t.primary_reading_type){const e=t[t.primary_reading_type].map((function(t){return{reading:t}}));t.readings=e}"Radical"===t.type&&(t.readings=[]);const e=c(t.id);t.meanings.push(...e);const n=[t.id,t.characters];for(const e of t.meanings)n.push(e.toLowerCase());for(const e of n)r[e]||(r[e]=[]),r[e].push(t)}return r}(),a=r&&i?i[r]:[],s=function(){const t=document.querySelector(e.Category);return t?t.textContent.trim().toLowerCase():document.location.href.match("vocabulary")?"vocabulary":document.location.href.match("kanji")?"kanji":document.location.href.match("radicals")?"radical":null}(),u=n(),l=[],f=[];for(const t of a){t.readings&&l.push(...t.readings.map((t=>t.reading))),f.push(...t.meanings);const e=c(t.id);f.push(...e)}return{page:t,prompt:r,category:s,type:u,meanings:f,readings:l}}function c(t){const n=document.querySelector(e.Synonyms);if(n){const e=JSON.parse(n.textContent);if(e[t])return e[t]}return[]}function a(){const t=document.querySelector(e.Next);return!!t&&(t.click(),!0)}function s(){u("en-US"===r()?"aaa":"あああ")}function u(t){return function(t){const e=document.querySelector("#user-response");e&&(e.value=t)}(t),a()}function l(){const t=document.getElementById("information");if(!t)return!0;return!new Array(t.classList).some((t=>t.toString().includes("open")))}function f(){const t=document.querySelectorAll("#additional-content a");for(let e of t)if(e.textContent.includes("Item Info"))return void(l()&&e.click())}function d(t){return null===t?"null":t!==Object(t)?typeof t:{}.toString.call(t).slice(8,-1).toLowerCase()}function p(t){return"string"!==d(t)||!t.length}function h(t="",e,n){if(p(t))return!1;const r=t.charCodeAt(0);return e<=r&&r<=n}const g={HIRAGANA:"toHiragana",KATAKANA:"toKatakana"},y="hepburn",m={useObsoleteKana:!1,passRomaji:!1,upcaseKatakana:!1,IMEMode:!1,convertLongVowelMark:!0,romanization:y},b=65,w=90,v=12353,j=12438,k=12449,O=12540,C=19968,S=40879,A=12540,_=12539,E=[65313,65338],x=[65345,65370],M=[65377,65381],q=[[12288,12351],M,[12539,12540],[65281,65295],[65306,65311],[65339,65343],[65371,65376],[65504,65518]],z=[...[[12352,12447],[12448,12543],M,[65382,65439]],...q,E,x,[65296,65305],[19968,40959],[13312,19903]],N=[[0,127],[256,257],[274,275],[298,299],[332,333],[362,363]],R=[[32,47],[58,63],[91,96],[123,126],[8216,8217],[8220,8221]];function L(t=""){return z.some((([e,n])=>h(t,e,n)))}function I(t="",e){const n="regexp"===d(e);return!p(t)&&[...t].every((t=>{const r=L(t);return n?r||e.test(t):r}))}var T=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function K(t,e){if(t.length!==e.length)return!1;for(var n=0;n<t.length;n++)if(r=t[n],o=e[n],!(r===o||T(r)&&T(o)))return!1;var r,o;return!0}function J(t,e){void 0===e&&(e=K);var n=null;function r(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];if(n&&n.lastThis===this&&e(r,n.lastArgs))return n.lastResult;var i=t.apply(this,r);return n={lastResult:i,lastArgs:r,lastThis:this},i}return r.clear=function(){n=null},r}var $=Object.prototype.hasOwnProperty;function W(t,e,n){for(n of t.keys())if(D(n,e))return n}function D(t,e){var n,r,o;if(t===e)return!0;if(t&&e&&(n=t.constructor)===e.constructor){if(n===Date)return t.getTime()===e.getTime();if(n===RegExp)return t.toString()===e.toString();if(n===Array){if((r=t.length)===e.length)for(;r--&&D(t[r],e[r]););return-1===r}if(n===Set){if(t.size!==e.size)return!1;for(r of t){if((o=r)&&"object"==typeof o&&!(o=W(e,o)))return!1;if(!e.has(o))return!1}return!0}if(n===Map){if(t.size!==e.size)return!1;for(r of t){if((o=r[0])&&"object"==typeof o&&!(o=W(e,o)))return!1;if(!D(r[1],e.get(o)))return!1}return!0}if(n===ArrayBuffer)t=new Uint8Array(t),e=new Uint8Array(e);else if(n===DataView){if((r=t.byteLength)===e.byteLength)for(;r--&&t.getInt8(r)===e.getInt8(r););return-1===r}if(ArrayBuffer.isView(t)){if((r=t.byteLength)===e.byteLength)for(;r--&&t[r]===e[r];);return-1===r}if(!n||"object"==typeof t){for(n in r=0,t){if($.call(t,n)&&++r&&!$.call(e,n))return!1;if(!(n in e)||!D(t[n],e[n]))return!1}return Object.keys(e).length===r}}return t!=t&&e!=e}const V=(t={})=>Object.assign({},m,t);function F(t,e,n){const r=e;function o(t,e){const n=t.charAt(0);return i(Object.assign({"":n},r[n]),t.slice(1),e,e+1)}function i(t,e,r,c){if(!e)return n||1===Object.keys(t).length?t[""]?[[r,c,t[""]]]:[]:[[r,c,null]];if(1===Object.keys(t).length)return[[r,c,t[""]]].concat(o(e,c));const a=function(t,e){if(void 0!==t[e])return Object.assign({"":t[""]+e},t[e])}(t,e.charAt(0));return void 0===a?[[r,c,t[""]]].concat(o(e,c)):i(a,e.slice(1),r,c+1)}return o(t,0)}function B(t){return Object.entries(t).reduce(((t,[e,n])=>{const r="string"===d(n);return t[e]=r?{"":n}:B(n),t}),{})}function P(t,e){return e.split("").reduce(((t,e)=>(void 0===t[e]&&(t[e]={}),t[e])),t)}function U(t={}){const e={};return"object"===d(t)&&Object.entries(t).forEach((([t,n])=>{let r=e;t.split("").forEach((t=>{void 0===r[t]&&(r[t]={}),r=r[t]})),r[""]=n})),function(t){return function t(e,n){return void 0===e||"string"===d(e)?n:Object.entries(n).reduce(((n,[r,o])=>(n[r]=t(e[r],o),n)),e)}(JSON.parse(JSON.stringify(t)),e)}}function G(t,e){return e?"function"===d(e)?e(t):U(e)(t):t}const H={a:"あ",i:"い",u:"う",e:"え",o:"お",k:{a:"か",i:"き",u:"く",e:"け",o:"こ"},s:{a:"さ",i:"し",u:"す",e:"せ",o:"そ"},t:{a:"た",i:"ち",u:"つ",e:"て",o:"と"},n:{a:"な",i:"に",u:"ぬ",e:"ね",o:"の"},h:{a:"は",i:"ひ",u:"ふ",e:"へ",o:"ほ"},m:{a:"ま",i:"み",u:"む",e:"め",o:"も"},y:{a:"や",u:"ゆ",o:"よ"},r:{a:"ら",i:"り",u:"る",e:"れ",o:"ろ"},w:{a:"わ",i:"ゐ",e:"ゑ",o:"を"},g:{a:"が",i:"ぎ",u:"ぐ",e:"げ",o:"ご"},z:{a:"ざ",i:"じ",u:"ず",e:"ぜ",o:"ぞ"},d:{a:"だ",i:"ぢ",u:"づ",e:"で",o:"ど"},b:{a:"ば",i:"び",u:"ぶ",e:"べ",o:"ぼ"},p:{a:"ぱ",i:"ぴ",u:"ぷ",e:"ぺ",o:"ぽ"},v:{a:"ゔぁ",i:"ゔぃ",u:"ゔ",e:"ゔぇ",o:"ゔぉ"}},Q={".":"。",",":"、",":":"：","/":"・","!":"！","?":"？","~":"〜","-":"ー","‘":"「","’":"」","“":"『","”":"』","[":"［","]":"］","(":"（",")":"）","{":"｛","}":"｝"},X={k:"き",s:"し",t:"ち",n:"に",h:"ひ",m:"み",r:"り",g:"ぎ",z:"じ",d:"ぢ",b:"び",p:"ぴ",v:"ゔ",q:"く",f:"ふ"},Y={ya:"ゃ",yi:"ぃ",yu:"ゅ",ye:"ぇ",yo:"ょ"},Z={a:"ぁ",i:"ぃ",u:"ぅ",e:"ぇ",o:"ぉ"},tt={sh:"sy",ch:"ty",cy:"ty",chy:"ty",shy:"sy",j:"zy",jy:"zy",shi:"si",chi:"ti",tsu:"tu",ji:"zi",fu:"hu"},et=Object.assign({tu:"っ",wa:"ゎ",ka:"ヵ",ke:"ヶ"},Z,Y),nt={yi:"い",wu:"う",ye:"いぇ",wi:"うぃ",we:"うぇ",kwa:"くぁ",whu:"う",tha:"てゃ",thu:"てゅ",tho:"てょ",dha:"でゃ",dhu:"でゅ",dho:"でょ"},rt={wh:"う",kw:"く",qw:"く",q:"く",gw:"ぐ",sw:"す",ts:"つ",th:"て",tw:"と",dh:"で",dw:"ど",fw:"ふ",f:"ふ"};function ot(){const t=B(H),e=e=>P(t,e);function n(t){return Object.entries(t).reduce(((t,[e,r])=>(t[e]=e?n(r):`っ${r}`,t)),{})}return Object.entries(X).forEach((([t,n])=>{Object.entries(Y).forEach((([r,o])=>{e(t+r)[""]=n+o}))})),Object.entries(Q).forEach((([t,n])=>{e(t)[""]=n})),Object.entries(rt).forEach((([t,n])=>{Object.entries(Z).forEach((([r,o])=>{e(t+r)[""]=n+o}))})),["n","n'","xn"].forEach((t=>{e(t)[""]="ん"})),t.c=JSON.parse(JSON.stringify(t.k)),Object.entries(tt).forEach((([t,n])=>{const r=t.slice(0,t.length-1),o=t.charAt(t.length-1);e(r)[o]=JSON.parse(JSON.stringify(e(n)))})),Object.entries(et).forEach((([t,n])=>{const r=t=>t.charAt(t.length-1),o=t=>t.slice(0,t.length-1),i=e(`x${t}`);i[""]=n;var c;e(`l${o(t)}`)[r(t)]=i,(c=t,[...Object.entries(tt),["c","k"]].reduce(((t,[e,n])=>c.startsWith(n)?t.concat(c.replace(n,e)):t),[])).forEach((n=>{["l","x"].forEach((i=>{e(i+o(n))[r(n)]=e(i+t)}))}))})),Object.entries(nt).forEach((([t,n])=>{e(t)[""]=n})),[...Object.keys(X),"c","y","w","j"].forEach((e=>{const r=t[e];r[e]=n(r)})),delete t.n.n,Object.freeze(JSON.parse(JSON.stringify(t)))}let it=null;const ct=U({wi:"ゐ",we:"ゑ"});function at(t=""){return!p(t)&&h(t,b,w)}function st(t=""){return!p(t)&&t.charCodeAt(0)===A}function ut(t=""){return!p(t)&&t.charCodeAt(0)===_}function lt(t=""){return!p(t)&&(!!st(t)||h(t,v,j))}function ft(t=""){const e=[];return t.split("").forEach((t=>{if(st(t)||ut(t))e.push(t);else if(lt(t)){const n=t.charCodeAt(0)+(k-v),r=String.fromCharCode(n);e.push(r)}else e.push(t)})),e.join("")}const dt=J(((t,e,n)=>{let r=(null==it&&(it=ot()),it);return r=t?function(t){const e=JSON.parse(JSON.stringify(t));return e.n.n={"":"ん"},e.n[" "]={"":"ん"},e}(r):r,r=e?ct(r):r,n&&(r=G(r,n)),r}),D);function pt(t="",e={},n){let r;return n?r=e:(r=V(e),n=dt(r.IMEMode,r.useObsoleteKana,r.customKanaMapping)),function(t="",e={},n){const{IMEMode:r,useObsoleteKana:o,customKanaMapping:i}=e;n||(n=dt(r,o,i));return F(t.toLowerCase(),n,!r)}(t,r,n).map((e=>{const[n,o,i]=e;if(null===i)return t.slice(n);const c=r.IMEMode===g.HIRAGANA,a=r.IMEMode===g.KATAKANA||[...t.slice(n,o)].every(at);return c||!a?i:ft(i)})).join("")}function ht(t=""){return!p(t)&&N.some((([e,n])=>h(t,e,n)))}function gt(t="",e){const n="regexp"===d(e);return!p(t)&&[...t].every((t=>{const r=ht(t);return n?r||e.test(t):r}))}function yt(t=""){return h(t,k,O)}function mt(t=""){return!p(t)&&[...t].every(lt)}function bt(t=""){return!p(t)&&[...t].every(yt)}function wt(t=""){return h(t,C,S)}function vt(t=""){return!p(t)&&[...t].every(wt)}function jt(t="",e={passKanji:!0}){const n=[...t];let r=!1;return e.passKanji||(r=n.some(vt)),(n.some(mt)||n.some(bt))&&n.some(gt)&&!r}const kt=(t,e)=>st(t)&&e<1,Ot=(t,e)=>st(t)&&e>0,Ct=t=>["ヶ","ヵ"].includes(t),St={a:"あ",i:"い",u:"う",e:"え",o:"う"};function At(t="",e,{isDestinationRomaji:n,convertLongVowelMark:r}={}){let o="";return t.split("").reduce(((i,c,a)=>{if(ut(c)||kt(c,a)||Ct(c))return i.concat(c);if(r&&o&&Ot(c,a)){const r=e(o).slice(-1);return yt(t[a-1])&&"o"===r&&n?i.concat("お"):i.concat(St[r])}if(!st(c)&&yt(c)){const t=c.charCodeAt(0)+(v-k),e=String.fromCharCode(t);return o=e,i.concat(e)}return o="",i.concat(c)}),[]).join("")}let _t=null;const Et={"あ":"a","い":"i","う":"u","え":"e","お":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ま":"ma","み":"mi","む":"mu","め":"me","も":"mo","ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro","や":"ya","ゆ":"yu","よ":"yo","わ":"wa","ゐ":"wi","ゑ":"we","を":"wo","ん":"n","が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po","ゔぁ":"va","ゔぃ":"vi","ゔ":"vu","ゔぇ":"ve","ゔぉ":"vo"},xt={"。":".","、":",","：":":","・":"/","！":"!","？":"?","〜":"~","ー":"-","「":"‘","」":"’","『":"“","』":"”","［":"[","］":"]","（":"(","）":")","｛":"{","｝":"}","　":" "},Mt=["あ","い","う","え","お","や","ゆ","よ"],qt={"ゃ":"ya","ゅ":"yu","ょ":"yo"},zt={"ぃ":"yi","ぇ":"ye"},Nt={"ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o"},Rt=["き","に","ひ","み","り","ぎ","び","ぴ","ゔ","く","ふ"],Lt={"し":"sh","ち":"ch","じ":"j","ぢ":"j"},It={"っ":"","ゃ":"ya","ゅ":"yu","ょ":"yo","ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o"},Tt={b:"b",c:"t",d:"d",f:"f",g:"g",h:"h",j:"j",k:"k",m:"m",p:"p",q:"q",r:"r",s:"s",t:"t",v:"v",w:"w",x:"x",z:"z"};function Kt(){return null==_t&&(_t=function(){const t=B(Et),e=e=>P(t,e),n=(t,n)=>{e(t)[""]=n};return Object.entries(xt).forEach((([t,n])=>{e(t)[""]=n})),[...Object.entries(qt),...Object.entries(Nt)].forEach((([t,e])=>{n(t,e)})),Rt.forEach((t=>{const r=e(t)[""][0];Object.entries(qt).forEach((([e,o])=>{n(t+e,r+o)})),Object.entries(zt).forEach((([e,o])=>{n(t+e,r+o)}))})),Object.entries(Lt).forEach((([t,e])=>{Object.entries(qt).forEach((([r,o])=>{n(t+r,e+o[1])})),n(`${t}ぃ`,`${e}yi`),n(`${t}ぇ`,`${e}e`)})),t["っ"]=Jt(t),Object.entries(It).forEach((([t,e])=>{n(t,e)})),Mt.forEach((t=>{n(`ん${t}`,`n'${e(t)[""]}`)})),Object.freeze(JSON.parse(JSON.stringify(t)))}()),_t}function Jt(t){return Object.entries(t).reduce(((t,[e,n])=>{if(e)t[e]=Jt(n);else{const r=n.charAt(0);t[e]=Object.keys(Tt).includes(r)?Tt[r]+n:n}return t}),{})}const $t=J(((t,e)=>{let n=function(t){return t===y?Kt():{}}(t);return e&&(n=G(n,e)),n}),D);function Wt(t="",e={},n){const r=V(e);return n||(n=$t(r.romanization,r.customRomajiMapping)),function(t,e,n){n||(n=$t(e.romanization,e.customRomajiMapping));const r=Object.assign({},{isDestinationRomaji:!0},e);return F(At(t,Wt,r),n,!e.IMEMode)}(t,r,n).map((e=>{const[n,o,i]=e;return r.upcaseKatakana&&bt(t.slice(n,o))?i.toUpperCase():i})).join("")}function Dt(t=""){return!p(t)&&R.some((([e,n])=>h(t,e,n)))}function Vt(t="",e={}){const n=V(e);if(n.passRomaji)return At(t,Wt,n);if(jt(t,{passKanji:!0})){return pt(At(t,Wt,n).toLowerCase(),n)}return gt(t)||Dt(t)?pt(t.toLowerCase(),n):At(t,Wt,n)}var Ft={};Ft=function(){function t(t,e,n,r,o){return t<e||n<e?t>n?n+1:t+1:r===o?e:e+1}return function(e,n){if(e===n)return 0;if(e.length>n.length){var r=e;e=n,n=r}for(var o=e.length,i=n.length;o>0&&e.charCodeAt(o-1)===n.charCodeAt(i-1);)o--,i--;for(var c=0;c<o&&e.charCodeAt(c)===n.charCodeAt(c);)c++;if(i-=c,0===(o-=c)||i<3)return i;var a,s,u,l,f,d,p,h,g,y,m,b,w=0,v=[];for(a=0;a<o;a++)v.push(a+1),v.push(e.charCodeAt(c+a));for(var j=v.length-1;w<i-3;)for(g=n.charCodeAt(c+(s=w)),y=n.charCodeAt(c+(u=w+1)),m=n.charCodeAt(c+(l=w+2)),b=n.charCodeAt(c+(f=w+3)),d=w+=4,a=0;a<j;a+=2)s=t(p=v[a],s,u,g,h=v[a+1]),u=t(s,u,l,y,h),l=t(u,l,f,m,h),d=t(l,f,d,b,h),v[a]=d,f=l,l=u,u=s,s=p;for(;w<i;)for(g=n.charCodeAt(c+(s=w)),d=++w,a=0;a<j;a+=2)p=v[a],v[a]=d=t(p,s,d,g,v[a+1]),s=p;return d}}();const Bt={b:"び",ezone:"いぞん",gt:"じき",g:"じ",ec2:"いしつ","ec 2":"いしつ",ec:"いし",agar:"あがる",ol:"おえる",ob:"おび",k:"けい",c:"し",cd:"しり",ck:"しけい",y:"わい",uber:"うば",hulu:"ふる",canyou:"かんゆう",LINE:"らい",2:"つ",3:"さん",5:"ご",9:"きゅう",10:"じゅ",x:"じゅ",1e3:"せん","ワーく":"わく","西国":"さいこく","帰って":"かえって","を呼ぶ":"およぶ","掌蹠":"しょうせき","件名":"けんめい","加藤":"かとう","貨物線":"かもつせん","短足":"たんそく","5回":"ごかい","けえき":"けいき","覗いて":"のぞいて","廃病":"はいびょう","正観":"せいかん","借りに":"かりに","全開":"ぜんかい","九大":"きゅうだい","最速":"さいそく","龍騎":"りゅうき","流星":"りゅうせい","京丹":"きょうたん","広陵":"こうりょう","招かれる":"まねかれる","県境":"けんきょう","胆汁":"たんじゅう","県名":"けんめい","長江":"ちょうこう","性感":"せいかん"};function Pt(t,e){if(!I(t.data))return null;return Gt(t.data)===Gt(e)?e:null}function Ut(t,e){const n=t.data;for(const t of e)if(t===n||t===Bt[n.toLowerCase()])return t;return null}function Gt(t){return t.toLowerCase().replaceAll(" ","")}function Ht(e,n){const r=e.data;for(const e of n){if(Gt(e)===Gt(r))return e;if(t(Ft)(Gt(e),Gt(r))<2)return e}return null}function Qt(t,e){return{success:!0,message:"correct answer",candidate:t,answer:e}}function Xt(t,e,n){const{meanings:r,readings:o,prompt:i}=t;let c=[];c.push({type:"raw",data:n});const a=(s="order",e.reduce((function(t,e){return(t[e[s]]=t[e[s]]||[]).push(e),t}),{}));var s;const u=Object.keys(a).map((t=>parseInt(t))).sort();for(const t of u){const e=a[t],n=[];for(const t of e)for(const e of c)n.push(...t.getCandidates(e.data));c.push(...n)}let l={error:!1,message:"incorrect answer"};for(const t of c){const e=Ht(t,r),n=Ut(t,o),c=Pt(t,i);n?l=Qt(t,n):c&&o.length>0?l=Qt(t,o[0]):e&&(l=Qt(t,e))}return l.candidates=c,l.meanings=r,l.readings=o,l}const Yt="#ffd700",Zt="#000000";function te(){return ee().lightning}function ee(){return unsafeWindow.wkof?unsafeWindow.wkof.settings["wanikani-voice-input"]:{lightning:!1,transcript:!0,transcript_background:Yt,transcript_foreground:Zt,transcript_position:"top",transcript_delay:5e3}}function ne(t,e){if(!("webkitSpeechRecognition"in window))return console.error("[wanikani-voice-input] web speech not supported by this browser!"),null;const n=new webkitSpeechRecognition;return n.continuous=!0,n.interimResults=!0,n.lang=t,n.onresult=t=>{for(let n=t.resultIndex;n<t.results.length;++n){const r=t.results[n][0].transcript.trim(),o=t.results[n].isFinal;e(r,o)}},n.onerror=t=>{"no-speech"!==t.error&&console.error("[wanikani-voice-input] error occurred in recognition:",t.error)},n.onend=()=>{n.start()},n}function re(t,e){t.lang!=e&&(t.stop(),t.lang=e)}function oe(t){let e=t.transcript_position,n="width: 100%; position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;";return"top"===e||"bottom"===e?n+=` ${e}: 0px`:"center"===e&&(n+=" top: 45vh"),n}function ie(t){const e=document.createElement("div");e.id="wanikani-voice-input-transcript-container",e.style=oe(t),document.body.appendChild(e)}let ce=1;function ae(t){const e=document.getElementById(t);if(e){e.parentElement.removeChild(e)}}function se(t,e){if(!t.transcript)return;const n="🎤"+e,r=document.getElementById("transcript-"+(ce-1));if(r&&n===r.textContent)return;const o=ce++,i=`transcript-${o}`,c=document.createElement("p");c.id=i,c.style=function(t){return`color: ${t.transcript_foreground}; background-color: ${t.transcript_background}; font-size: 5vh; pointer-events: auto;`}(t),c.textContent=n;const a=document.querySelector("div#wanikani-voice-input-transcript-container");a.style=oe(t),a.appendChild(c),setTimeout(function(t){return function(){ae(t)}}(i),1e3*t.transcript_delay);const s=o-10;for(let e=o-t.transcript_count;e>=s&&e>=0;e--)ae(`transcript-${e}`)}function ue(t,e,n){t[e]||(t[e]=n),t[e].push(n)}function le(){let t=JSON.parse(GM_getResourceText("jmdict")),e=JSON.parse(GM_getResourceText("kanjidic2")),n={};for(const[e,r]of Object.entries(t))ue(n,e,r);for(const[t,r]of Object.entries(e))ue(n,t,r);const r=Object.keys(n).length;return console.log(`[wanikani-voice-input] got dictionary with ${r} entries`),n}class fe{constructor(t){this.order=0}getCandidates(t){const e=[];if(I(t)){const n=Vt(t,{convertLongVowelMark:!0});e.push({type:"hiragana",data:n})}return e}}class de{constructor(t){this.order=0,this.dictionary=t}getCandidates(t){if(!I(t))return[];const e=[],n=Vt(t);const r=function(t){return t.flatMap((t=>"word"===t.type?t.kana.map(Vt):"character"===t.type?t.readings.map((t=>{let e=t.value;return e.includes(".")&&(e=e.split(".")[0]),Vt(e)})):[]))}(this.dictionary[n]||[]);for(let t of r)e.push({type:"dictionary",data:t});return e}}class pe{constructor(t){this.order=0,this.basicDictionary=new de(t)}getCandidates(t){const e=Vt(t),n=[];if(e.endsWith("する")){const t=e.substring(0,e.length-2),r=this.basicDictionary.getCandidates(t);for(let t of r)n.push({type:"する",data:t+"する"})}return n}}class he{constructor(){this.order=1}getCandidates(t){const e=[],n=function(t){let e=t.length;for(let n=Math.floor(e/2);n>0;n--)if(e%n==0){let r=!0,o=t.slice(0,n);for(let i=n;i<e;i+=n)if(t.slice(i,i+n)!==o){r=!1;break}if(r)return o}return null}(t);return n&&e.push({type:"repeating",data:n}),e}}!function(){const t=["あ","い","う","え","い","お","う","か","き","く","け","け","こ","こ","が","ぎ","ぐ","げ","げ","ご","ご","さ","し","す","せ","せ","そ","そ","ざ","じ","ず","ぜ","ぜ","ぞ","ぞ","た","ち","つ","て","て","と","と","だ","ぢ","づ","で","で","ど","ど","な","に","ぬ","ね","ね","の","の","は","ひ","ふ","へ","へ","ほ","ほ","ば","び","ぶ","べ","べ","ぼ","ぼ","ぱ","ぴ","ぷ","ぺ","ぺ","ぽ","ぽ","ま","み","む","め","め","も","も","や","yi","ゆ","ye","ye","よ","よ","ら","り","る","れ","れ","ろ","ろ","わ","ゐ","wu","ゑ","ゑ","を","を"],e=[];for(let n=0;n<t.length;n+=7){const r=t.slice(n,n+7);e.push(r)}const n={};for(let t=0;t<e.length;t++){const r=e[t];for(let t=0;t<7;t++)(n[r[t]]=n[r[t]]||[]).push(e[0][t])}n["ゃ"]=["あ"],n["ゅ"]=["う"],n["ょ"]=["お","う"]}();class ge{constructor(t){this.order=0,this.dictionary=t}getCandidates(t){if(!t||0===t.length)return[];if(!I(t.split("").filter((t=>" "!==t)).join("")))return[];const e=[];if(t.includes(" ")){const n=t.split(" ").filter((t=>t.length>0)).map((t=>{const e=Vt(t);const n=function(t){return t.flatMap((t=>"word"===t.type?t.kana.map(Vt):"character"===t.type?t.readings.map((t=>{let e=t.value;return e.includes(".")&&(e=e.split(".")[0]),Vt(e)})):[]))}(this.dictionary[e]||[]);return n.length>0?n[0]:""}));e.push({type:"multiple",data:n.join("")})}return e}}const ye="０１２３４５６７８９".split(""),me="0一二三四五六七八九";class be{constructor(t){this.order=0,this.basicDictionary=new de(t)}getCandidates(t){if(!t.match(/\d+/))return[];let e=t;for(let t=0;t<ye.length;t++)e=e.replaceAll(t.toString(),ye[t]);const n=this.basicDictionary.getCandidates(e);let r=t;for(let t=0;t<me.length;t++)r=r.replaceAll(t.toString(),me[t]);n.push({data:r});for(const t of n)t.type="numeral";return n}}function we(){const t=i();"review"!==t.page&&"lesson"!==t.page&&"quiz"!==t.page||function(){ie(ee());const t=le();let e="Flipping",n=i();function o(t){e=t}function c(){a(),o("Flipping")}const l={wrong:s,incorrect:s,mistake:s,"不正解":s,"ふせいかい":s,"間違い":s,"まちがい":s,"だめ":s,"ダメ":s,"駄目":s,next:c,"つぎ":c,"次":c,NEXT:c,"ねくすと":c,"ネクスト":c},d=[new fe,new de(t),new pe(t),new he,new ge(t),new be(t)],p=ne(r(),(function(t,n){se(ee(),t);let r=function(t,e,n,r,o){let c=e,a=null,s=null,u=!1,l=r;if("Ready"===e){const e=Xt(i(),t,r);console.log("[wanikani-voice-input]",r,e),e.candidate&&l!==e.candidate.data&&(l+=` (${e.candidate.data})`),e.success?o?(c="Flipping",a=e.answer):(c="Waiting",a=e.answer):e.error&&(l="!! "+e.message+" !!")}"Waiting"===e&&o&&(c="Flipping",u=te());("Ready"===e||"Flipping"===e)&&o&&n[r]&&(s=n[r]);return{newState:c,transcript:l,answer:a,command:s,lightning:u}}(d,e,l,t,n);se(ee(),r.transcript),e!==r.newState&&o(r.newState),r.answer&&u(r.answer),r.lightning&&setTimeout(a,100),r.command&&r.command()}));function h(t,c){const a=r();re(p,a);const s=function(t){const e=i();return t.prompt!==e.prompt||t.category!==e.category||t.type!==e.type?e:null}(n);"Flipping"===e&&s&&(o("Ready"),n=s)}const g={attributes:!0,childList:!0,subtree:!0};new MutationObserver(h).observe(document.body,g),window.addEventListener("didAnswerQuestion",(function(t){!function(t){if("object"!=typeof t.detail||"object"!=typeof t.detail.results)return console.error("[wanikani-voice-input] didAnswerCorrectly got unexpected event, WaniKani code change?",t),!1;const e=t.detail.results;return t.detail,"string"!=typeof e.action?(console.error("[wanikani-voice-input] didAnswerCorrectly got unexpected event, WaniKani code change?",t),!1):"pass"===e.action}(t)?te()&&setTimeout(f,100):"Ready"===e&&(e="Flipping",te()&&setTimeout(a,100))})),p.start(),e="Ready"}(),t.page}if(unsafeWindow.wkof){!function(t,e){function n(){var e={script_id:"wanikani-voice-input",title:"Voice Input",content:{lightning:{type:"checkbox",label:"Lightning mode",default:!1,hover_tip:"If enabled, automatically advance to the next flashcard on correct answers. If enabled, please disable lightning mode from any other scripts."},transcript:{type:"checkbox",label:"Live transcript",default:!0,hover_tip:"If enabled, displays a live transcript of dictation"},transcript_background:{type:"color",label:"Transcript background color",hover_tip:"Background color for the live transcript",default:Yt},transcript_foreground:{type:"color",label:"Transcript text color",hover_tip:"Text color for the live transcript",default:Zt},transcript_position:{type:"dropdown",label:"Transcript position",hover_tip:"Position on the page for the live transcript",default:"top",content:{top:"Top",bottom:"Bottom"}},transcript_delay:{type:"number",label:"Transcript delay",hover_tip:"Duration in seconds before live transcripts disappear",min:0,default:5},transcript_count:{type:"number",label:"Transcript count",hover_tip:"How many live transcripts to show (recommend setting position to bottom if this is more then 1)",min:1,default:1}}};new t.Settings(e).open()}t.include("Menu,Settings"),t.ready("Menu,Settings").then((function(){t.Menu.insert_script_link({name:"wanikani-voice-input",submenu:"Settings",title:"Voice Input",on_click:n})})).then((function(){return t.Settings.load("wanikani-voice-input")})).then(e)}(unsafeWindow.wkof,we)}else we()})();
//# sourceMappingURL=app.js.map
