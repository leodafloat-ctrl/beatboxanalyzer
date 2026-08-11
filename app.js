const $ = (id) => document.getElementById(id);
const waveCanvas = $('waveformCanvas');
const spectrumCanvas = $('spectrumCanvas');
const wctx = waveCanvas.getContext('2d');
const sctx = spectrumCanvas.getContext('2d');

let audioContext, analyser, transientAnalyser, source, stream, animationId;
let running = false, startedAt = 0, waveform = [], lastFrame = 0;
let timeData, freqData, waveTimeData, waveFreqData, peaks = [];
let lastPitch = null, lastPitchAt = 0;
const MIN_FREQ = 20, MAX_FREQ = 20000;
const MIN_DB = -110, MAX_DB = 0;
const BAND_EDGES = [[20,250],[250,4000],[4000,MAX_FREQ]];
const GATE_MARGINS = [4,8,8];
const FULLNESS_PROFILE_MARGINS = [10,14,18];
const FULLNESS_MANUAL_OFFSETS = [0,4,8];
const BAND_THEMES = {
  cyberpunk: ['#4d00ff','#00ff66','#ff007f'],
  modernDark: ['#4a4a4a','#a3e4d7','#f4d03f'],
  neonGlow: ['#0000ff','#ff3333','#ffff00']
};
const SPECTRUM_COLORS = ['#18aaff','#8b5cf6','#f4d03f','#ff8a24','#20d875'];
let noiseFloor = [-92,-100,-105], currentGates = [0,0,0], profileReady = false;
let calibrationEndsAt = 0, calibrationSamples = [[],[],[]], calibrationRmsSamples = [], rmsNoiseFloor = -70;
let gateMode = 'profile', manualThreshold = -70, resonanceBands = [], formantLimit = 5;
let cursorLocked = false, cursorClientX = 0;
let bandColors = [...BAND_THEMES.cyberpunk];
let spectrumColor = SPECTRUM_COLORS.includes(localStorage.getItem('beatbox-spectrum-color'))?localStorage.getItem('beatbox-spectrum-color'):SPECTRUM_COLORS[0];
let metronomeContext=null,metronomeTimer=null,metronomeRunning=false,metronomeBeat=0,nextMetronomeTime=0;

function updateBandColorUi() {
  ['lowBandColor','midBandColor','highBandColor'].forEach((id,i)=>$(id).value=bandColors[i]);
  $('bandGradient').style.background=`linear-gradient(90deg,${bandColors.join(',')})`;
}

function applyBandTheme(theme) {
  if(BAND_THEMES[theme])bandColors=[...BAND_THEMES[theme]];
  updateBandColorUi();
  localStorage.setItem('beatbox-band-theme',theme);
  localStorage.setItem('beatbox-band-colors',JSON.stringify(bandColors));
}

function restoreBandTheme() {
  const savedTheme=localStorage.getItem('beatbox-band-theme')||'cyberpunk';
  let savedColors=null;
  try{savedColors=JSON.parse(localStorage.getItem('beatbox-band-colors')||'null');}catch{}
  if(Array.isArray(savedColors)&&savedColors.length===3)bandColors=savedColors;
  else if(BAND_THEMES[savedTheme])bandColors=[...BAND_THEMES[savedTheme]];
  $('bandTheme').value=(BAND_THEMES[savedTheme]||savedTheme==='custom')?savedTheme:'cyberpunk';
  updateBandColorUi();
}

function metronomeBeats(){return Math.max(1,Math.min(32,Math.round(Number($('meterBeats').value)||4)));}
function metronomeDivision(){return Math.max(1,Math.min(32,Math.round(Number($('meterDivision').value)||4)));}
function metronomeBpm(){return Math.max(40,Math.min(240,Number($('bpmInput').value)||100));}

function normalizeMeterInputs() {
  $('meterBeats').value=String(metronomeBeats());
  $('meterDivision').value=String(metronomeDivision());
  restartMetronomeClock();
}

function clickPreset(accent) {
  const presets={
    digital:{type:'square',normal:1050,accent:1550,gain:.075,duration:.035},
    wood:{type:'triangle',normal:620,accent:920,gain:.11,duration:.05},
    soft:{type:'sine',normal:440,accent:660,gain:.09,duration:.075}
  };
  const preset=presets[$('clickSound').value]||presets.digital;
  return {...preset,frequency:accent?preset.accent:preset.normal};
}

function scheduleMetronomeClick(time,accent) {
  const preset=clickPreset(accent),oscillator=metronomeContext.createOscillator(),gain=metronomeContext.createGain();
  oscillator.type=preset.type;oscillator.frequency.setValueAtTime(preset.frequency,time);
  gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(preset.gain,time+.003);gain.gain.exponentialRampToValueAtTime(.0001,time+preset.duration);
  oscillator.connect(gain);gain.connect(metronomeContext.destination);oscillator.start(time);oscillator.stop(time+preset.duration+.01);
}

function runMetronomeScheduler() {
  const beats=metronomeBeats();
  while(nextMetronomeTime<metronomeContext.currentTime+.1){
    const beatInBar=metronomeBeat%beats;
    scheduleMetronomeClick(nextMetronomeTime,beatInBar===0);$('metronomePosition').textContent=`${beatInBar+1}/${beats}`;
    metronomeBeat++;nextMetronomeTime+=60/metronomeBpm();
  }
}

function restartMetronomeClock() {
  if(!metronomeRunning)return;
  clearInterval(metronomeTimer);metronomeBeat=0;$('metronomePosition').textContent=`1/${metronomeBeats()}`;nextMetronomeTime=metronomeContext.currentTime+.06;
  runMetronomeScheduler();metronomeTimer=setInterval(runMetronomeScheduler,25);
}

function toggleMetronome() {
  if(metronomeRunning){
    metronomeRunning=false;clearInterval(metronomeTimer);metronomeTimer=null;$('metronomeButton').classList.remove('active');$('metronomeButton').setAttribute('aria-pressed','false');$('metronomePosition').textContent='OFF';metronomeContext?.suspend().catch(()=>{});return;
  }
  metronomeContext??=new (window.AudioContext||window.webkitAudioContext)();metronomeRunning=true;$('metronomeButton').classList.add('active');$('metronomeButton').setAttribute('aria-pressed','true');restartMetronomeClock();metronomeContext.resume().catch(()=>{});
}

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width; canvas.height = height;
  }
  return { width, height, dpr };
}

function freqToX(freq, width, pad = 0) {
  const t = Math.log10(Math.max(freq, MIN_FREQ) / MIN_FREQ) / Math.log10(MAX_FREQ / MIN_FREQ);
  return pad + Math.max(0, Math.min(1, t)) * (width - pad * 2);
}

function dbToLevel(db) { return Math.max(0, Math.min(1, (db - MIN_DB) / (MAX_DB - MIN_DB))); }

async function toggleInput() {
  if (running) return stopInput();
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 16384;
    analyser.smoothingTimeConstant = 0.62;
    analyser.minDecibels = MIN_DB;
    analyser.maxDecibels = MAX_DB;
    transientAnalyser = audioContext.createAnalyser();
    transientAnalyser.fftSize = 2048;
    transientAnalyser.smoothingTimeConstant = 0.08;
    transientAnalyser.minDecibels = MIN_DB;
    transientAnalyser.maxDecibels = MAX_DB;
    source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    source.connect(transientAnalyser);
    timeData = new Float32Array(analyser.fftSize);
    freqData = new Float32Array(analyser.frequencyBinCount);
    waveTimeData = new Float32Array(transientAnalyser.fftSize);
    waveFreqData = new Float32Array(transientAnalyser.frequencyBinCount);
    peaks = new Float32Array(freqData.length).fill(MIN_DB);
    currentGates=[0,0,0];resonanceBands=[];
    running = true; startedAt = performance.now(); lastFrame = startedAt; waveform = [];
    $('recordButton').classList.add('active'); $('recordLabel').textContent = 'STOP INPUT';
    $('statusText').classList.add('live'); $('statusText').innerHTML = '<i></i> MIC LIVE';
    $('calibrateButton').disabled=false;
    $('emptyState').classList.add('hidden');
    updateGateModeUi();
    draw();
  } catch (error) {
    $('statusText').textContent = 'MIC ACCESS DENIED';
    alert('無法使用麥克風。請允許此網站的麥克風權限，並使用 localhost 或 HTTPS 開啟。');
  }
}

function stopInput() {
  running = false; cancelAnimationFrame(animationId);
  stream?.getTracks().forEach(track => track.stop());
  audioContext?.close();
  const cancelledCalibration=Boolean(calibrationEndsAt);calibrationEndsAt=0;$('calibrateButton').disabled=true;
  if(cancelledCalibration&&!profileReady){$('calibrateButton').textContent='RECORD NOISE 5s';setGateStatus('WAITING FOR INPUT');}
  $('recordButton').classList.remove('active'); $('recordLabel').textContent = 'START INPUT';
  $('statusText').classList.remove('live'); $('statusText').innerHTML = '<i></i> MIC IDLE';
}

function bandEnergy(lo, hi, data=freqData, node=analyser) {
  const binHz = audioContext.sampleRate / node.fftSize;
  const a = Math.max(1, Math.floor(lo / binHz));
  const b = Math.min(data.length - 1, Math.ceil(hi / binHz));
  let power = 0;
  for (let i = a; i <= b; i++) power += 10 ** (data[i] / 10);
  return 10 * Math.log10(power / Math.max(1, b - a + 1) + 1e-12);
}

function smoothstep(value) {
  const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);
}

function bandIndexForFrequency(freq) { return freq<250?0:freq<4000?1:2; }

function percentile(values,p) {
  if(!values.length)return MIN_DB;
  const sorted=[...values].sort((a,b)=>a-b);return sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*p))];
}

function setGateStatus(text,state='') {
  const status=$('gateStatus');status.textContent=text;status.className=state;
}

function startNoiseCalibration() {
  if(!running)return;
  gateMode='profile';$('profileMode').checked=true;profileReady=false;calibrationSamples=[[],[],[]];calibrationRmsSamples=[];calibrationEndsAt=performance.now()+5000;currentGates=[0,0,0];
  $('calibrateButton').textContent='CALIBRATING 5.0s';setGateStatus('PLEASE STAY QUIET','calibrating');
}

function finishNoiseCalibration() {
  noiseFloor=calibrationSamples.map(samples=>percentile(samples,.9));rmsNoiseFloor=percentile(calibrationRmsSamples,.9);profileReady=true;calibrationEndsAt=0;currentGates=[0,0,0];
  $('calibrateButton').textContent='RE-RECORD NOISE 5s';setGateStatus(`LOCKED · ${noiseFloor.map(v=>Math.round(v)).join(' / ')} dB`,'ready');
}

function updateGateModeUi() {
  $('gateThreshold').disabled=gateMode!=='manual';
  if(gateMode==='manual')setGateStatus(`MANUAL · ${manualThreshold} dB`,'ready');
  else if(profileReady)setGateStatus(`LOCKED · ${noiseFloor.map(v=>Math.round(v)).join(' / ')} dB`,'ready');
  else setGateStatus(running?'PROFILE REQUIRED · RECORD ROOM TONE':'WAITING FOR INPUT');
}

function updateVisualGate() {
  const dbs=BAND_EDGES.map(([lo,hi])=>bandEnergy(lo,hi,waveFreqData,transientAnalyser));
  let sum=0;for(const value of waveTimeData)sum+=value*value;
  const rmsDb=20*Math.log10(Math.sqrt(sum/waveTimeData.length)+1e-8);
  if(calibrationEndsAt) {
    dbs.forEach((db,i)=>calibrationSamples[i].push(db));
    calibrationRmsSamples.push(rmsDb);
    const remaining=Math.max(0,(calibrationEndsAt-performance.now())/1000);
    $('calibrateButton').textContent=`CALIBRATING ${remaining.toFixed(1)}s`;
    if(remaining<=0) finishNoiseCalibration();
    currentGates=[0,0,0];
    return {dbs,gates:currentGates,rmsDb,active:[false,false,false],calibrating:true};
  }
  if(gateMode==='profile'&&!profileReady){currentGates=[1,1,1];return{dbs,gates:currentGates,rmsDb,active:[false,false,false],profileMissing:true};}
  const gates=gateMode==='manual'?dbs.map(db=>smoothstep((db-manualThreshold)/12)):dbs.map((db,i)=>smoothstep((db-(noiseFloor[i]+GATE_MARGINS[i]))/12));
  currentGates=gates;
  return {dbs,gates,rmsDb,active:gates.map(g=>g>.18),calibrating:false};
}

function detectPitch(buffer, sampleRate) {
  let rms = 0;
  for (const x of buffer) rms += x * x;
  rms = Math.sqrt(rms / buffer.length);
  if (rms < .015) return null;
  const minLag = Math.floor(sampleRate / 1000), maxLag = Math.min(Math.floor(sampleRate / 55), buffer.length / 2);
  let bestLag = -1, best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let ac = 0, e1 = 0, e2 = 0;
    for (let i = 0; i < buffer.length - lag; i++) { const a=buffer[i], b=buffer[i+lag]; ac+=a*b; e1+=a*a; e2+=b*b; }
    const score = ac / Math.sqrt(e1 * e2 + 1e-12);
    if (score > best) { best = score; bestLag = lag; }
  }
  return best > .72 ? sampleRate / bestLag : null;
}

function updateNote(freq) {
  if (!freq) { $('noteName').textContent = '—'; $('noteCents').textContent = 'UNPITCHED'; $('noteHz').textContent = '— Hz'; return; }
  const midi = 69 + 12 * Math.log2(freq / 440), nearest = Math.round(midi);
  const notes = ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
  $('noteName').textContent = notes[(nearest % 12 + 12) % 12] + (Math.floor(nearest / 12) - 1);
  const cents = Math.round((midi - nearest) * 100);
  $('noteCents').textContent = `${cents >= 0 ? '+' : ''}${cents} CENTS`;
  $('noteHz').textContent = `${freq.toFixed(1)} Hz`;
}

function spectralCentroid() {
  const binHz=audioContext.sampleRate/analyser.fftSize;
  let weighted=0, powerSum=0;
  for(let i=Math.max(1,Math.floor(MIN_FREQ/binHz));i<Math.min(freqData.length,Math.ceil(MAX_FREQ/binHz));i++) {
    const power=10**(freqData[i]/10); weighted+=i*binHz*power; powerSum+=power;
  }
  return weighted/(powerSum+1e-12);
}

function updateMetrics(gateState) {
  const low = bandEnergy(20, 250), mid = bandEnergy(250, 4000), high = bandEnergy(4000, MAX_FREQ);
  const values = [low, mid, high], levels = values.map(dbToLevel);
  ['lowValue','midValue','highValue'].forEach((id,i)=>$(id).textContent=`${Math.round(values[i])} dB`);
  if(gateState.calibrating||gateState.profileMissing){$('fullnessLabel').textContent='—';$('fullnessMeter').style.width='0%';$('fullnessDetail').textContent=gateState.calibrating?'Recording 5 seconds of room tone…':'Noise profile required';return{low,mid,high,level:0,score:0,centroid:spectralCentroid()};}
  const thresholds=gateMode==='profile'
    ? noiseFloor.map((floor,i)=>floor+FULLNESS_PROFILE_MARGINS[i])
    : FULLNESS_MANUAL_OFFSETS.map(offset=>manualThreshold+offset);
  const active=gateState.dbs.map((db,i)=>db>=thresholds[i]),activeCount=active.filter(Boolean).length,score=Math.round(activeCount/3*100);
  const label=activeCount===3?'Full':activeCount>0?'Moderate':'Limited';
  $('fullnessLabel').textContent=label;$('fullnessMeter').style.width=`${score}%`;
  const activeNames=['LOW','MID','HIGH'].filter((_,i)=>active[i]);
  $('fullnessDetail').textContent=`STRICT ONE-SHOT · Active bands ${activeCount}/3${activeNames.length?' · '+activeNames.join(' + '):''} · ${gateMode} thresholds`;
  const names=['LOWS','MIDS','HIGHS'], max=Math.max(...levels), min=Math.min(...levels);
  $('balanceText').textContent = max-min < .12 ? 'BALANCE · EVENLY DISTRIBUTED' : `BALANCE · ${names[levels.indexOf(max)]} FORWARD`;
  return { low, mid, high, level: Math.max(...levels), score, centroid:spectralCentroid() };
}

function addWaveSlice(gateState) {
  const references=gateMode==='profile'&&profileReady?noiseFloor:[manualThreshold-8,manualThreshold-8,manualThreshold-8];
  const bandWeights=[1.35,1,1];
  const energies=gateState.gates.map((gate,i)=>bandWeights[i]*gate*Math.max(0,Math.min(1,(gateState.dbs[i]-references[i])/42)));
  const sum=energies.reduce((a,b)=>a+b,0),shares=sum>1e-6?energies.map(value=>value/sum):[0,0,0];
  const rmsReference=gateMode==='profile'&&profileReady?rmsNoiseFloor:manualThreshold-8;
  const peak=sum>1e-6?Math.max(0,Math.min(.92,(gateState.rmsDb-rmsReference)/48)):0;
  waveform.push({shares,peak});
  const maxSlices=Math.ceil(waveCanvas.clientWidth/4);if(waveform.length>maxSlices)waveform.splice(0,waveform.length-maxSlices);
}

function drawWaveform() {
  const {width:w,height:h,dpr}=resizeCanvas(waveCanvas);wctx.clearRect(0,0,w,h);const mid=h/2,step=4*dpr;
  const layers=[2,1,0].map(index=>({index,color:bandColors[index]}));
  for(let i=1;i<waveform.length;i++){
    const a=waveform[i-1],b=waveform[i],x0=w-waveform.length*step+(i-1)*step-18*dpr,x1=x0+step;
    const amp0=a.peak*h*.42,amp1=b.peak*h*.42;
    let inner0=0,inner1=0;
    layers.forEach(layer=>{
      const outer0=inner0+amp0*a.shares[layer.index],outer1=inner1+amp1*b.shares[layer.index];
      if(outer0+outer1>.5*dpr){
        wctx.beginPath();wctx.moveTo(x0,mid-inner0);wctx.lineTo(x0,mid-outer0);wctx.lineTo(x1,mid-outer1);wctx.lineTo(x1,mid-inner1);wctx.closePath();
        wctx.fillStyle=layer.color;wctx.globalAlpha=.42+Math.max(a.peak,b.peak)*.56;wctx.fill();
        wctx.beginPath();wctx.moveTo(x0,mid+inner0);wctx.lineTo(x0,mid+outer0);wctx.lineTo(x1,mid+outer1);wctx.lineTo(x1,mid+inner1);wctx.closePath();wctx.fill();
      }
      inner0=outer0;inner1=outer1;
    });
  }
  wctx.globalAlpha=1;
  wctx.strokeStyle='rgba(255,255,255,.16)';wctx.beginPath();wctx.moveTo(0,mid);wctx.lineTo(w,mid);wctx.stroke();
}

function findSpectralPeaks() {
  const binHz=audioContext.sampleRate/analyser.fftSize, found=[],analysisCeiling=Math.min(MAX_FREQ,audioContext.sampleRate/2)*.95;
  for(let f=40;f<analysisCeiling;f+=binHz){
    const i=Math.round(f/binHz),band=bandIndexForFrequency(f),threshold=gateMode==='manual'?manualThreshold+2:Math.max(-78,noiseFloor[band]+9);
    const shoulder=(freqData[i-3]+freqData[i+3])/2,prominence=freqData[i]-shoulder;
    if(currentGates[band]>.08&&freqData[i]>threshold&&prominence>2.2)found.push({f,db:freqData[i],threshold,prominence});
  }
  return found.sort((a,b)=>(b.db-b.threshold)-(a.db-a.threshold)).slice(0,16).sort((a,b)=>a.f-b.f);
}

function updateResonanceBands(detections,dt) {
  const grouped=[];
  detections.forEach(point=>{const last=grouped.at(-1);if(last&&Math.log2(point.f/last.f)<.20){last.f=(last.f*last.count+point.f)/(last.count+1);last.db=Math.max(last.db,point.db);last.threshold=Math.max(last.threshold,point.threshold);last.prominence=Math.max(last.prominence,point.prominence);last.count++;}else grouped.push({...point,count:1});});
  resonanceBands.forEach(track=>track.strength=Math.max(0,track.strength-dt*.00032));
  grouped.forEach(group=>{
    const target=smoothstep((group.db-group.threshold)/18)*smoothstep(group.prominence/8),match=resonanceBands.filter(track=>Math.abs(Math.log2(track.freq/group.f))<.22).sort((a,b)=>Math.abs(a.freq-group.f)-Math.abs(b.freq-group.f))[0];
    if(match){match.freq=match.freq*.82+group.f*.18;match.strength=Math.max(target,match.strength*.78+target*.22);match.width=Math.min(5,match.width*.8+group.count*.2);}
    else resonanceBands.push({freq:group.f,strength:target,width:group.count});
  });
  resonanceBands=resonanceBands.filter(track=>track.strength>.08).sort((a,b)=>b.strength-a.strength).slice(0,formantLimit);
}

function smoothSpectrumPoints(points) {
  if(points.length<5)return points;
  return points.map((p,i)=>{
    if(i<2||i>points.length-3)return p;
    const weights=[1,2,3,2,1]; let y=0, liveY=0;
    for(let k=-2;k<=2;k++){y+=points[i+k].y*weights[k+2];liveY+=points[i+k].liveY*weights[k+2];}
    return {...p,y:y/9,liveY:liveY/9};
  });
}

function traceSmoothPath(ctx,points,key) {
  ctx.moveTo(points[0].x,points[0][key]);
  for(let i=1;i<points.length-1;i++){
    const next=points[i+1], midX=(points[i].x+next.x)/2, midY=(points[i][key]+next[key])/2;
    ctx.quadraticCurveTo(points[i].x,points[i][key],midX,midY);
  }
  ctx.lineTo(points.at(-1).x,points.at(-1)[key]);
}

function drawSpectrum(dt,gateState) {
  const {width:w,height:h,dpr}=resizeCanvas(spectrumCanvas), pad=22*dpr, bottom=28*dpr;
  sctx.clearRect(0,0,w,h); const binHz=audioContext.sampleRate/analyser.fftSize, decay=dt*.035;
  for(let i=1;i<freqData.length;i++){const gate=gateState.gates[bandIndexForFrequency(i*binHz)],gatedDb=MIN_DB+(freqData[i]-MIN_DB)*gate;peaks[i]=Math.max(gatedDb,peaks[i]-decay);}
  let samples=[];
  const nyquist=audioContext.sampleRate/2;
  for(let x=0;x<=w-pad*2;x+=Math.max(1,dpr)){const t=x/(w-pad*2),f=MIN_FREQ*(MAX_FREQ/MIN_FREQ)**t,i=Math.min(freqData.length-1,Math.round(f/binHz)),available=f<=nyquist,gate=available?gateState.gates[bandIndexForFrequency(f)]:0,liveDb=available?MIN_DB+(freqData[i]-MIN_DB)*gate:MIN_DB,peakDb=available?peaks[i]:MIN_DB;samples.push({x:x+pad,y:h-bottom-dbToLevel(peakDb)*(h-bottom-18*dpr),liveY:h-bottom-dbToLevel(liveDb)*(h-bottom-18*dpr)});}
  samples=smoothSpectrumPoints(samples);
  const base=spectrumColor, accent=spectrumColor, peak='#ffffff';
  const gradient=sctx.createLinearGradient(0,h-bottom,0,10*dpr);gradient.addColorStop(0,base+'8f');gradient.addColorStop(.55,accent+'c9');gradient.addColorStop(1,peak+'f2');
  sctx.beginPath();traceSmoothPath(sctx,samples,'y');sctx.lineTo(samples.at(-1).x,h-bottom);sctx.lineTo(samples[0].x,h-bottom);sctx.closePath();sctx.fillStyle=gradient;sctx.fill();
  updateResonanceBands(findSpectralPeaks(),dt);
  sctx.save();sctx.beginPath();traceSmoothPath(sctx,samples,'y');sctx.lineTo(samples.at(-1).x,h-bottom);sctx.lineTo(samples[0].x,h-bottom);sctx.closePath();sctx.clip();
  resonanceBands.forEach(track=>{
    const x=freqToX(track.freq,w,pad),radius=(7+track.width*2.5+track.strength*12)*dpr,alpha=Math.min(.88,.12+track.strength*.8);
    const white=sctx.createLinearGradient(x-radius,0,x+radius,0);white.addColorStop(0,'rgba(255,255,255,0)');white.addColorStop(.42,`rgba(255,255,255,${(alpha*.45).toFixed(2)})`);white.addColorStop(.5,`rgba(255,255,255,${alpha.toFixed(2)})`);white.addColorStop(.58,`rgba(255,255,255,${(alpha*.45).toFixed(2)})`);white.addColorStop(1,'rgba(255,255,255,0)');
    sctx.fillStyle=white;sctx.fillRect(x-radius,10*dpr,radius*2,h-bottom-10*dpr);
  });
  sctx.restore();
  const intensityStroke=sctx.createLinearGradient(0,h-bottom,0,18*dpr);intensityStroke.addColorStop(0,accent);intensityStroke.addColorStop(.58,accent);intensityStroke.addColorStop(1,peak);
  sctx.beginPath();traceSmoothPath(sctx,samples,'y');sctx.strokeStyle=intensityStroke;sctx.lineWidth=1.15*dpr;sctx.lineJoin='round';sctx.lineCap='round';sctx.shadowBlur=9*dpr;sctx.shadowColor=accent;sctx.stroke();sctx.shadowBlur=0;
  sctx.beginPath();traceSmoothPath(sctx,samples,'liveY');sctx.strokeStyle=accent;sctx.lineWidth=.65*dpr;sctx.globalAlpha=.55;sctx.stroke();sctx.globalAlpha=1;
  if (cursorLocked) updateSpectrumCursor(cursorClientX, true);
}

function updateSpectrumCursor(clientX, locked=cursorLocked) {
  const rect=spectrumCanvas.getBoundingClientRect(), pad=22;
  const x=Math.max(pad,Math.min(rect.width-pad,clientX-rect.left));
  const t=(x-pad)/(rect.width-pad*2), freq=MIN_FREQ*(MAX_FREQ/MIN_FREQ)**t;
  const binHz=audioContext ? audioContext.sampleRate/analyser.fftSize : 48000/16384;
  const index=Math.max(1,Math.min((freqData?.length||4096)-1,Math.round(freq/binHz)));
  const available=!audioContext||freq<=audioContext.sampleRate/2,rawDb=freqData&&available?freqData[index]:MIN_DB,gate=available?currentGates[bandIndexForFrequency(freq)]:0,db=MIN_DB+(rawDb-MIN_DB)*gate,y=rect.height-28-dbToLevel(db)*(rect.height-46);
  const cursor=$('spectrumCursor'); cursor.style.setProperty('--cursor-x',`${x}px`); cursor.style.setProperty('--cursor-y',`${y}px`);
  cursor.classList.add('visible'); cursor.classList.toggle('locked',locked);
  const freqText=freq>=1000?`${(freq/1000).toFixed(2)} kHz`:`${Math.round(freq)} Hz`;
  $('spectrumReadout').textContent=`${locked?'LOCKED':'LIVE'} · ${freqText} · ${Number.isFinite(db)?db.toFixed(1):'≤ −100'} dBFS`;
}

function draw(now=performance.now()) {
  if(!running)return; analyser.getFloatTimeDomainData(timeData); analyser.getFloatFrequencyData(freqData);transientAnalyser.getFloatTimeDomainData(waveTimeData);transientAnalyser.getFloatFrequencyData(waveFreqData);
  const dt=Math.min(50,now-lastFrame);lastFrame=now;const gateState=updateVisualGate();updateMetrics(gateState);
  if (now-lastPitchAt > 80) { lastPitch=detectPitch(timeData.subarray(0,4096),audioContext.sampleRate); lastPitchAt=now; updateNote(lastPitch); }
  addWaveSlice(gateState);drawWaveform();drawSpectrum(dt,gateState);$('timer').textContent=formatTime(now-startedAt);animationId=requestAnimationFrame(draw);
}

function formatTime(ms){const total=ms/1000,m=Math.floor(total/60),s=Math.floor(total%60),t=Math.floor((total%1)*10);return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${t}`}
$('recordButton').addEventListener('click',toggleInput);
$('metronomeButton').addEventListener('click',toggleMetronome);
$('bpmInput').addEventListener('change',event=>{event.target.value=metronomeBpm();restartMetronomeClock();});
$('meterBeats').addEventListener('change',normalizeMeterInputs);
$('meterDivision').addEventListener('change',normalizeMeterInputs);
$('calibrateButton').addEventListener('click',startNoiseCalibration);
document.querySelectorAll('input[name="gateMode"]').forEach(input=>input.addEventListener('change',event=>{
  gateMode=event.target.value;
  if(gateMode==='manual'&&calibrationEndsAt){calibrationEndsAt=0;$('calibrateButton').textContent='RECORD NOISE 5s';}
  updateGateModeUi();
}));
$('gateThreshold').addEventListener('input',event=>{manualThreshold=Number(event.target.value);gateMode='manual';$('manualMode').checked=true;$('gateThresholdValue').textContent=`${manualThreshold} dB`;updateGateModeUi();});
$('formantCount').addEventListener('input',event=>{formantLimit=Number(event.target.value);$('formantCountValue').textContent=String(formantLimit);resonanceBands=resonanceBands.slice(0,formantLimit);});
$('bandTheme').addEventListener('change',event=>applyBandTheme(event.target.value));
['lowBandColor','midBandColor','highBandColor'].forEach((id,index)=>$(id).addEventListener('input',event=>{
  bandColors[index]=event.target.value;$('bandTheme').value='custom';updateBandColorUi();
  localStorage.setItem('beatbox-band-theme','custom');localStorage.setItem('beatbox-band-colors',JSON.stringify(bandColors));
}));
document.querySelectorAll('input[name="spectrumColor"]').forEach(input=>input.addEventListener('change',event=>{
  spectrumColor=event.target.value;localStorage.setItem('beatbox-spectrum-color',spectrumColor);
}));
spectrumCanvas.addEventListener('pointermove',e=>{if(!cursorLocked)updateSpectrumCursor(e.clientX,false)});
spectrumCanvas.addEventListener('pointerleave',()=>{if(!cursorLocked)$('spectrumCursor').classList.remove('visible')});
spectrumCanvas.addEventListener('click',e=>{cursorLocked=!cursorLocked;cursorClientX=e.clientX;updateSpectrumCursor(e.clientX,cursorLocked)});
window.addEventListener('resize',()=>{if(!running){resizeCanvas(waveCanvas);resizeCanvas(spectrumCanvas)}});
resizeCanvas(waveCanvas);resizeCanvas(spectrumCanvas);
updateGateModeUi();
restoreBandTheme();
const savedSpectrumInput=document.querySelector(`input[name="spectrumColor"][value="${spectrumColor}"]`);if(savedSpectrumInput)savedSpectrumInput.checked=true;
