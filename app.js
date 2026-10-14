'use strict';
const vocabulary = {
  easy: [['apple','Apfel'],['dog','Hund'],['house','Haus'],['water','Wasser'],['sun','Sonne'],['book','Buch'],['friend','Freund'],['tree','Baum'],['cat','Katze'],['flower','Blume'],['bird','Vogel'],['milk','Milch'],['bread','Brot'],['moon','Mond'],['school','Schule']],
  medium: [['journey','Reise'],['courage','Mut'],['dream','Traum'],['forest','Wald'],['curious','neugierig'],['beautiful','schön'],['remember','erinnern'],['discover','entdecken'],['knowledge','Wissen'],['butterfly','Schmetterling'],['adventure','Abenteuer'],['kindness','Freundlichkeit'],['rainbow','Regenbogen'],['treasure','Schatz'],['grow','wachsen']]
};
const $ = id => document.getElementById(id);
const key = 'wunderwort-progress-v1';
let state = {coins:0,total:0,feeds:0};
try { const saved = JSON.parse(localStorage.getItem(key)); if(saved && ['coins','total','feeds'].every(k=>Number.isSafeInteger(saved[k]) && saved[k]>=0)) state = saved; } catch {}
const wordsKey = 'wunderwort-vocabulary-v1';
let customWords = [];
function validWords(list) { return Array.isArray(list) && list.length <= 500 && list.every(pair => Array.isArray(pair) && pair.length === 2 && pair.every(word => typeof word === 'string' && word.trim().length > 0 && word.length <= 120)); }
try { const saved = JSON.parse(localStorage.getItem(wordsKey)); if (validWords(saved)) customWords = saved.map(pair => pair.map(word => word.trim())); } catch {}
let deck, index, score, answered, activeWords, editing = null;
let currentQuestion = null;
const normalizeAnswer = value => value.normalize('NFKC').trim().toLocaleLowerCase('de-DE').replace(/[.!?]+$/g,'').replace(/\s+/g,' ');
function directionForQuestion(){const selected=$('direction').value;return selected==='mixed'?(Math.random()<0.5?'en-de':'de-en'):selected;}
function expectedAnswers(value){return value.split(/\s*[,;]\s*/).map(normalizeAnswer).filter(Boolean);}
function customReady() { return new Set(customWords.map(pair => pair[1])).size >= 2; }
function shuffle(items) { const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result; }
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{$('feed-status').textContent='Speichern ist hier nicht verfügbar. Dein Fortschritt bleibt für diese Sitzung.';} updatePet();}
function updatePet(){ $('coins').textContent=state.coins;$('total').textContent=state.total;$('pet-level').textContent=`Level ${1+Math.floor(state.feeds/3)}`;$('feed').disabled=state.coins<20; }
function start(){
 activeWords = ($('level').value === 'custom' ? customWords : vocabulary[$('level').value]).map(pair => [...pair]);
 index=0;score=0;answered=false;currentQuestion=null;$('score-label').textContent='0 richtig';
 if($('level').value==='custom' && !customReady()) {
  deck=[];$('quiz-title').textContent='Deine Wörter warten auf dich';$('answers').replaceChildren();$('write-form').hidden=true;$('round-label').textContent='Noch keine Runde';$('progress-bar').style.width='0%';$('next').hidden=true;$('feedback').textContent='Trage unten mindestens zwei Vokabeln mit unterschiedlichen Übersetzungen ein.';return;
 }
 deck=shuffle(activeWords).slice(0,10);render();
}
function render(){
 answered=false;$('written-answer').disabled=false;$('write-form').querySelector('button').disabled=false;$('next').hidden=true;
 $('round-label').textContent=`Wort ${index+1} von ${deck.length}`;
 $('score-label').textContent=`${score} richtig`;$('progress-bar').style.width=`${index/deck.length*100}%`;
 const direction=directionForQuestion(), pair=deck[index],reverse=direction==='de-en';
 currentQuestion={prompt:pair[reverse?1:0],right:pair[reverse?0:1],direction};
 $('language-label').textContent=reverse?'DEUTSCH → ENGLISCH':'ENGLISCH → DEUTSCH';
 $('quiz-title').textContent=currentQuestion.prompt;
 $('feedback').textContent=$('mode').value==='write'?'Schreibe deine Antwort und prüfe sie.':'Wähle die passende Übersetzung.';
 $('question-area').hidden=false;$('answers').replaceChildren();
 const writing=$('mode').value==='write';$('answers').hidden=writing;$('write-form').hidden=!writing;
 if(writing){$('written-answer').value='';return;}
 const answerIndex=reverse?0:1,right=currentQuestion.right;
 const choices=shuffle([right,...shuffle([...new Set(activeWords.map(v=>v[answerIndex]))].filter(v=>v!==right)).slice(0,3)]);
 choices.forEach((word,i)=>{const button=document.createElement('button');button.className='answer';const letter=document.createElement('b');letter.textContent=String.fromCharCode(65+i);const label=document.createElement('span');label.textContent=word;button.append(letter,label);button.addEventListener('click',()=>answer(word,button));$('answers').append(button);});
}
function finishAnswer(correct,provided,button){
 if(answered)return;answered=true;
 const right=currentQuestion.right;
 if($('mode').value==='write'){$('written-answer').disabled=true;$('write-form').querySelector('button').disabled=true;}
 else for(const option of $('answers').children){option.disabled=true;if(option.lastChild.textContent===right)option.classList.add('correct');}
 if(correct){score++;state.coins+=10;state.total++;save();$('feedback').textContent='Richtig! +10 Sterne für dich und Lumi. ✦';$('pet-message').textContent='Ein neues Wort! Du machst das toll.';}
 else{if(button)button.classList.add('wrong');$('feedback').textContent=`Fast! Die richtige Antwort lautet „${right}“. Du hast „${provided || '–'}“ eingegeben.`;}
 $('score-label').textContent=`${score} richtig`;
 $('next').textContent=index===deck.length-1?'Runde abschließen →':'Nächstes Wort →';$('next').hidden=false;
}
function answer(word,button){finishAnswer(word===currentQuestion.right,word,button);}
$('write-form').addEventListener('submit',event=>{
 event.preventDefault();if(answered||!currentQuestion)return;
 const given=$('written-answer').value.trim();if(!given){$('feedback').textContent='Schreibe zuerst eine Antwort.';return;}
 const correct=expectedAnswers(currentQuestion.right).includes(normalizeAnswer(given))||normalizeAnswer(given)===normalizeAnswer(currentQuestion.right);
 finishAnswer(correct,given,null);
});

$('next').addEventListener('click',()=>{if(index>=deck.length){start();return;}if(!answered)return;index++;if(index<deck.length){render();return;}$('progress-bar').style.width='100%';$('round-label').textContent='Runde abgeschlossen';$('quiz-title').textContent='Gut gemacht! ✨';$('answers').replaceChildren();$('write-form').hidden=true;$('written-answer').disabled=false;$('write-form').querySelector('button').disabled=false;$('feedback').textContent=`Du hast ${score} von ${deck.length} Wörtern richtig beantwortet und ${score*10} Sterne verdient. Bereit für eine neue Runde?`;$('next').textContent='Neue Runde starten →';});
$('level').addEventListener('change',start);
$('direction').addEventListener('change',start);
$('mode').addEventListener('change',start);
$('next').addEventListener('click',()=>{$('written-answer').disabled=false;$('write-form').querySelector('button').disabled=false;});
$('feed').addEventListener('click',()=>{if(state.coins<20)return;state.coins-=20;state.feeds++;save();$('pet-message').textContent='Mmmh, danke! Mit dir wachse ich über mich hinaus.';$('feed-status').textContent=state.feeds%3===0?'Neues Level! Lumi wird immer stärker. ✨':`Noch ${3-state.feeds%3} Leckerbissen bis zum nächsten Level.`;$('pet').classList.remove('celebrate');void $('pet').offsetWidth;$('pet').classList.add('celebrate');});
$('reset').addEventListener('click',()=>{if(!confirm('Möchtest du alle Sterne und Lumis Fortschritt zurücksetzen?'))return;state={coins:0,total:0,feeds:0};save();$('pet-message').textContent='Ich bin bereit für unser Abenteuer!';$('feed-status').textContent='Sammle Sterne mit richtigen Antworten.';start();});
function persistWords(message) {
 try { localStorage.setItem(wordsKey, JSON.stringify(customWords)); $('vocabulary-status').textContent=message; }
 catch { $('vocabulary-status').textContent='Deine Änderungen funktionieren für diese Sitzung, konnten aber nicht dauerhaft gespeichert werden. Sichere deine Liste mit „Liste sichern“.'; }
 renderWords(); if($('level').value==='custom') start();
}
function cancelEdit() { editing=null;$('vocabulary-form').reset();$('save-word').textContent='Hinzufügen +';$('cancel-edit').hidden=true; }
function renderWords() {
 $('vocabulary-count').textContent=`${customWords.length} Wörter`;$('play-custom').disabled=!customReady();$('export-words').disabled=customWords.length===0;
 $('vocabulary-list').replaceChildren();
 if(!customWords.length) { const empty=document.createElement('p');empty.className='empty-list';empty.textContent='Hier ist Platz für deine erste Vokabel. ✧';$('vocabulary-list').append(empty); }
 customWords.forEach((pair,i)=>{
 const row=document.createElement('div');row.className='vocabulary-row';
 const words=document.createElement('div');words.className='vocabulary-words';const word=document.createElement('strong');word.textContent=pair[0];const translation=document.createElement('span');translation.textContent=pair[1];words.append(word,translation);
 const edit=document.createElement('button');edit.type='button';edit.className='word-action';edit.textContent='Bearbeiten';edit.setAttribute('aria-label',`${pair[0]} bearbeiten`);edit.addEventListener('click',()=>{editing=i;$('word-input').value=pair[0];$('translation-input').value=pair[1];$('save-word').textContent='Speichern ✓';$('cancel-edit').hidden=false;$('word-input').focus();});
 const remove=document.createElement('button');remove.type='button';remove.className='word-action';remove.textContent='Löschen';remove.setAttribute('aria-label',`${pair[0]} löschen`);remove.addEventListener('click',()=>{if(!confirm(`„${pair[0]}“ aus deiner Liste löschen?`))return;customWords.splice(i,1);cancelEdit();persistWords('Vokabel gelöscht.');});
 row.append(words,edit,remove);$('vocabulary-list').append(row);
 });
}
$('vocabulary-form').addEventListener('submit',event=>{
 event.preventDefault();const pair=[$('word-input').value.trim(),$('translation-input').value.trim()];
 if(pair.some(word=>!word)){ $('vocabulary-status').textContent='Bitte fülle beide Felder aus.';return; }
 if(customWords.some((existing,i)=>i!==editing && existing[0].toLocaleLowerCase()===pair[0].toLocaleLowerCase())) { $('vocabulary-status').textContent='Diese Vokabel gibt es bereits. Du kannst ihre Übersetzung bearbeiten.';return; }
 if(editing===null && customWords.length>=500) { $('vocabulary-status').textContent='Deine Liste ist voll (500 Wörter).';return; }
 const wasEditing=editing!==null;if(wasEditing)customWords[editing]=pair;else customWords.push(pair);
 cancelEdit();persistWords(wasEditing?'Änderung gespeichert.':'Vokabel hinzugefügt.');$('word-input').focus();
});
$('cancel-edit').addEventListener('click',cancelEdit);
$('play-custom').addEventListener('click',()=>{$('level').value='custom';start();document.querySelector('.quiz').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});$('level').focus({preventScroll:true});});
$('export-words').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(customWords,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='meine-wunderwort-vokabeln.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import-words').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file)return;
 try {
 if(file.size>200000)throw new Error('Datei zu groß.');
 const incoming=JSON.parse(await file.text());if(!validWords(incoming))throw new Error('Ungültige Vokabelliste.');
 const merged=customWords.map(pair=>[...pair]);let added=0;
 for(const pair of incoming){const clean=pair.map(word=>word.trim());if(!merged.some(existing=>existing[0].toLocaleLowerCase()===clean[0].toLocaleLowerCase())){merged.push(clean);added++;}}
 if(merged.length>500)throw new Error('Zusammen mehr als 500 Wörter.');
 customWords=merged;cancelEdit();persistWords(`${added} Vokabeln geladen. Bestehende Wörter wurden beibehalten.`);
 }catch(error){$('vocabulary-status').textContent=`Liste nicht geladen: ${error.message} Verwende eine mit „Liste sichern“ erstellte JSON-Datei.`;}
 finally{event.target.value='';}
});
renderWords();updatePet();start();
