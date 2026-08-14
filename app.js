const $ = (id) => document.getElementById(id);
const waveCanvas = $('waveformCanvas');
const spectrumCanvas = $('spectrumCanvas');
const wctx = waveCanvas.getContext('2d');
const sctx = spectrumCanvas.getContext('2d');

const TRANSLATIONS = {
  en: {
    metronomeControls:'Metronome controls',metro:'METRO',off:'OFF',metronomeBpm:'Metronome BPM',beats:'BEATS',beatsPerMeasure:'Beats per measure',division:'DIVISION',beatDivision:'Beat division',click:'CLICK',metronomeClickSound:'Metronome click sound',digital:'DIGITAL',wood:'WOOD',soft:'SOFT',
    switchLanguage:'切換為繁體中文',micIdle:'MIC IDLE',micLive:'MIC LIVE',micDenied:'MIC ACCESS DENIED',startInput:'START INPUT',stopInput:'STOP INPUT',microphoneAlert:'Microphone access is unavailable. Allow microphone permission and open this page through localhost or HTTPS.',localStarts:'LOCAL {count} STARTS',localStartsLabel:'Starts saved on this device',
    noiseGateControls:'Noise gate controls',gate:'GATE',noiseFloor:'NOISE FLOOR',autoProfile:'AUTO PROFILE',recordNoise:'RECORD NOISE 5s',rerecordNoise:'RE-RECORD NOISE 5s',manual:'MANUAL',waitingInput:'WAITING FOR INPUT',profileRequired:'PROFILE REQUIRED · RECORD ROOM TONE',pleaseQuiet:'PLEASE STAY QUIET',calibrating:'CALIBRATING {seconds}s',locked:'LOCKED · {values} dB',manualStatus:'MANUAL · {value} dB',
    signalHistory:'Signal history',threeBandColors:'Waveform display and colors',displayMode:'MODE',waveDisplayModeLabel:'Signal history display mode',threeBand:'THREE BAND',soundWave:'SOUND WAVE',theme:'THEME',threeBandTheme:'Three band color theme',cyberpunk:'CYBERPUNK',modernDark:'MODERN DARK',neonGlow:'NEON GLOW',custom:'CUSTOM',lowColor:'Low frequency color',midColor:'Mid frequency color',highColor:'High frequency color',bandOrder:'OUT L · M · H IN',waveformCanvas:'Live waveform history',past:'PAST',now:'NOW',historyZoomLabel:'Signal history zoom',historySeconds:'Displayed history window',resetZoom:'Reset zoom',seconds:'{value}s',milliseconds:'{value} ms',
    liveReadout:'Live readout',pitchMode:'NOTE MODE',pitchModeLabel:'Pitch detection mode',oneNote:'ONE NOTE',polyphonicBeta:'POLYPHONIC EXPERIMENT (BETA)',detectedNote:'DETECTED NOTE',listening:'LISTENING',unpitched:'UNPITCHED',cents:'{value} CENTS',secondaryPitch:'SECONDARY PITCH',enhancedOvertone:'ENHANCED OVERTONE',waitingStable:'WAITING FOR STABLE PITCH',betaConfidence:'BETA · {value}% STABLE',independentRelation:'POSSIBLE INDEPENDENT NOTE · WITH {primary}',harmonicRelation:'H{harmonic} · HARMONIC OF {primary}',experimentalAnalysis:'EXPERIMENTAL ANALYSIS',spectralFullness:'SPECTRAL FULLNESS',startMeasure:'Start input to measure frequency coverage.',recordingRoom:'Recording 5 seconds of room tone…',noiseProfileRequired:'Noise profile required',full:'FULL',moderate:'MODERATE',limited:'LIMITED',fullnessDetail:'STRICT ONE-SHOT · Active bands {count}/3{bands} · {mode} thresholds',profileMode:'profile',manualMode:'manual',
    lows:'LOWS',mids:'MIDS',highs:'HIGHS',low:'LOW',mid:'MID',high:'HIGH',balanceEmpty:'BALANCE —',balanceEven:'BALANCE · EVENLY DISTRIBUTED',balanceForward:'BALANCE · {band} FORWARD',
    frequencySpectrum:'Frequency spectrum',ranges:'RANGES',spectrumColor:'Spectrum color',color:'COLOR',peak:'PEAK',blue:'Blue',purple:'Purple',yellow:'Yellow',orange:'Orange',green:'Green',blueSpectrum:'Blue spectrum',purpleSpectrum:'Purple spectrum',yellowSpectrum:'Yellow spectrum',orangeSpectrum:'Orange spectrum',greenSpectrum:'Green spectrum',spectrumCanvas:'20 Hz to 20 kHz live audio spectrum; click to lock frequency and dB reading',microphoneInput:'MICROPHONE INPUT',startHint:'Press Start Input, then make a sound.',cursorLocked:'LOCKED',cursorLive:'LIVE',methodSummary:'20 Hz — 20 kHz · −110 TO 0 dBFS · FULLNESS: STRICT ONE-SHOT · METRONOME INDEPENDENT',creditsMethod:'CREDITS & METHOD',
    methodText:'<b>Method.</b> Independent implementation using a fast 2,048-point transient analyser and smooth 16,384-point FFT from 20 Hz to 20 kHz. Three Band mode uses one amplitude envelope: high energy sits at the center, mid energy in the middle, and low energy at the outer edge. Sound Wave mode shows the raw amplitude signal; below 100 ms it changes to connected samples, with individual sample dots at the deepest zoom. Spectral Fullness is a strict live one-shot reading. Routine Analysis samples frequency-band activity every 200 ms and applies transparent, rule-based feedback locally. These are descriptive frequency-coverage indicators, not quality scores. The metronome is an independent practice aid and does not alter the results. Its click is generated separately from the microphone analyser; headphones are recommended so the microphone does not re-record it.',privacyText:'<b>Privacy.</b> This is not an AI tool. Audio samples are processed temporarily in memory for the live display; they are not uploaded, saved to persistent storage, or used to train a model. The local start count is stored only in this browser.',
    routinePanelLabel:'Routine analysis',routineAnalysis:'ROUTINE ANALYSIS',onDevice:'ON DEVICE',duration:'DURATION',routineDurationLabel:'Routine analysis duration',startRoutine:'START ANALYSIS',cancelRoutine:'CANCEL',routineReady:'Choose a duration, then start when ready.',routineRunning:'ANALYZING FREQUENCY COVERAGE',routineComplete:'ANALYSIS COMPLETE',routineCancelled:'Analysis stopped early; results use the captured portion.',routineInstructions:'Only Low, Mid and High frequency summaries are recorded. Raw audio is never recorded or saved. For better results, capture 5 seconds of room tone first or use the manual threshold.',coverageChartLabel:'Low, mid and high frequency time coverage chart',routineFeedback:'FREQUENCY DISTRIBUTION IDEAS',routineWaiting:'Complete one analysis to see possible directions to explore.',routineDisclaimer:'This analysis describes spectral distribution and sound activity. It is not a rating of beatbox skill, musicality, or performance quality.',routineNeedInput:'Starting microphone input…',routineNeedGate:'For more reliable results, record a noise profile or choose a manual threshold.',routineFocus:'Spectrum Focus · {bands}',routineFocusNarrow:'Spectrum Focus · CONCENTRATED RANGE',routineLowDominantFeedback:'This routine is currently led by low-frequency activity. If you want more layers and clarity, you could explore mid-frequency percussion and brighter elements such as {ideas}.',routineMidDominantFeedback:'The spectral center of this routine is mainly in the mid range. If you want a wider span, you could extend downward and upward with sounds such as {ideas}.',routineHighDominantFeedback:'High-frequency activity is currently more prominent. If you want more weight and lower support, you could explore bass-oriented sounds and mid-frequency body such as {ideas}.',routineLowMidFeedback:'Low and mid frequencies currently provide most of the support, while high-frequency activity appears relatively less often. If you want more brightness, detail, or rhythmic outline, you could explore {ideas}.',routineMidHighFeedback:'Mid and high frequencies are currently more active, while low-frequency activity appears relatively less often. If you want more weight or a lower foundation, you could explore {ideas}.',routineLowHighFeedback:'Low and high frequencies both show clear activity, while the mid range appears relatively less often. If you want denser connections between sounds, you could explore {ideas}.',routineBalancedFeedback:'This routine has sustained activity across low, mid, and high frequencies, giving it relatively broad spectral coverage. If you want to refine it further, you can explore dynamic contrast, space, and sound density between bands rather than necessarily adding more sounds.',routineNarrowFeedback:'Sound activity in this routine stays within a relatively concentrated frequency range. If you want more variation, you could explore different registers, timbres, percussion families, vocal sounds, bass sounds, or textures rather than simply adding volume. Possible starting points include {ideas}.',routineSignalFeedback:'There is not yet enough sustained activity above the current sound thresholds to describe the routine confidently. You can check the input gain or noise-gate profile and try again.',routineCreativeCaveat:'These are optional sound-design directions. A Beatbox sound can contain several frequency components, and an intentional frequency contrast can be kept as it is.',
    wingCredit:'WING · Beatbox spectrum-analysis inspiration (YouTube)',webAudioCredit:'W3C · Web Audio API',filterCredit:'MDN · Standard audio filter types',rekordboxCredit:'rekordbox · 3Band waveform reference',copyrightCredit:'U.S. Copyright Office · Coloration guidance',methodCopyrightCredit:'U.S. Copyright Office · Ideas, methods & systems',frequencyCredit:'MDN · Frequency data',noiseSuppressionCredit:'MDN · Browser noise suppression',noiseGateCredit:'Audacity · Noise gate method',waveformCredit:'Audacity · Waveform zoom & sample display reference',lowNoiseCredit:'Low-frequency noise · 20–200 Hz',praatCredit:'Praat · GPL license',formantCredit:'JASA · LPC & formants',beatboxCredit:'Human beatbox analysis',
    communityPanelLabel:'Credits and community contributions',communityCredits:'CREDITS / COMMUNITY CONTRIBUTIONS',communityToggle:'COMMUNITY ITERATION LOG',communityIntro:'Ideas from the beatbox community that helped shape specific parts of the analyser. Dates show when each contribution entered the project’s iteration history.',wingContribution:'Inspired the spectrum-analysis concept: noticing weaker or missing frequency regions and considering how Low, Mid and High can each support a more complete musical arrangement.',morrisContribution:'Suggested turning frequency gaps into practical sound ideas—such as drums, bass, hi-hats or other elements. This became part of Frequency Distribution Ideas.',chuanContribution:'Taiwan Beatbox Champion who used the analyser for overtone experiments, prompting deeper exploration of multiple vocal frequencies and overtone structures.',geneContribution:'His note-by-note analysis of lip oscillation and different vocal tones inspired the Polyphonic Singing / Multi-pitch direction now available in Note Detect’s Poly mode.',communityClosing:'Built by Leo Dafloat, shaped by ideas, experiments, and feedback from the beatbox community.'
  },
  'zh-Hant': {
    metronomeControls:'節拍器控制',metro:'節拍器',off:'關閉',metronomeBpm:'節拍器速度（BPM）',beats:'拍數',beatsPerMeasure:'每小節拍數',division:'拍值',beatDivision:'拍子音符時值',click:'節拍音',metronomeClickSound:'節拍器音色',digital:'數位',wood:'木質',soft:'柔和',
    switchLanguage:'Switch to English',micIdle:'麥克風待機',micLive:'麥克風收音中',micDenied:'麥克風權限遭拒',startInput:'開始輸入',stopInput:'停止輸入',microphoneAlert:'無法使用麥克風。請允許此網站的麥克風權限，並使用 localhost 或 HTTPS 開啟。',localStarts:'本機啟動 {count} 次',localStartsLabel:'儲存在這台裝置的啟動次數',
    noiseGateControls:'底噪閘門控制',gate:'閘門',noiseFloor:'底噪',autoProfile:'自動取樣',recordNoise:'錄製底噪 5秒',rerecordNoise:'重新錄製底噪 5秒',manual:'手動',waitingInput:'等待輸入',profileRequired:'需要底噪樣本 · 請錄製環境底噪',pleaseQuiet:'請保持安靜',calibrating:'校正中 {seconds}秒',locked:'已鎖定 · {values} dB',manualStatus:'手動 · {value} dB',
    signalHistory:'訊號歷史',threeBandColors:'聲波顯示與顏色',displayMode:'模式',waveDisplayModeLabel:'訊號歷史顯示模式',threeBand:'三頻段',soundWave:'聲波',theme:'主題',threeBandTheme:'三頻段配色主題',cyberpunk:'賽博朋克',modernDark:'現代暗黑',neonGlow:'熱情霓虹',custom:'自訂',lowColor:'低頻顏色',midColor:'中頻顏色',highColor:'高頻顏色',bandOrder:'外層 低 · 中 · 高 內層',waveformCanvas:'即時聲波歷史',past:'過去',now:'現在',historyZoomLabel:'訊號歷史縮放',historySeconds:'顯示的歷史時間範圍',resetZoom:'重設縮放',seconds:'{value}秒',milliseconds:'{value}毫秒',
    liveReadout:'即時讀值',pitchMode:'音高模式',pitchModeLabel:'音高偵測模式',oneNote:'單音',polyphonicBeta:'複音實驗（Beta）',detectedNote:'偵測音高',listening:'聆聽中',unpitched:'無明確音高',cents:'{value} 音分',secondaryPitch:'第二音高',enhancedOvertone:'突出泛音',waitingStable:'等待穩定音高',betaConfidence:'BETA · 穩定度 {value}%',independentRelation:'可能是獨立音高 · 與 {primary} 並存',harmonicRelation:'H{harmonic} · {primary} 的整數倍泛音',experimentalAnalysis:'實驗性分析',spectralFullness:'頻譜飽滿度',startMeasure:'開始輸入以測量頻率涵蓋範圍。',recordingRoom:'正在錄製 5 秒環境底噪…',noiseProfileRequired:'需要先建立底噪樣本',full:'飽滿',moderate:'中等',limited:'有限',fullnessDetail:'嚴格單次判定 · 啟用頻段 {count}/3{bands} · {mode}閾值',profileMode:'自動取樣',manualMode:'手動',
    lows:'低頻',mids:'中頻',highs:'高頻',low:'低頻',mid:'中頻',high:'高頻',balanceEmpty:'頻段平衡 —',balanceEven:'頻段平衡 · 分布均勻',balanceForward:'頻段平衡 · {band}突出',
    frequencySpectrum:'頻率頻譜',ranges:'共振區',spectrumColor:'頻譜顏色',color:'顏色',peak:'峰值',blue:'藍色',purple:'紫色',yellow:'黃色',orange:'橘色',green:'綠色',blueSpectrum:'藍色頻譜',purpleSpectrum:'紫色頻譜',yellowSpectrum:'黃色頻譜',orangeSpectrum:'橘色頻譜',greenSpectrum:'綠色頻譜',spectrumCanvas:'20 Hz 到 20 kHz 即時聲音頻譜，可點擊鎖定頻率與分貝讀值',microphoneInput:'麥克風輸入',startHint:'按下「開始輸入」，然後發出聲音。',cursorLocked:'已鎖定',cursorLive:'即時',methodSummary:'20 Hz — 20 kHz · −110 至 0 dBFS · 飽滿度：嚴格單次判定 · 節拍器獨立運作',creditsMethod:'製作資訊與方法',
    methodText:'<b>方法。</b>本工具為獨立實作，使用快速的 2,048 點瞬態分析器，以及涵蓋 20 Hz 至 20 kHz、經平滑處理的 16,384 點 FFT。三頻段模式採用單一振幅包絡：高頻能量位於中心、中頻位於中層、低頻位於外層。聲波模式顯示原始振幅訊號；縮放至 100 毫秒以下會改用逐點連線，最深縮放會顯示個別取樣點。頻譜飽滿度採嚴格的即時單次判定。段子分析每 200 毫秒記錄一次頻段活動，並完全在本機套用公開的規則式建議。這些都是描述性的頻率覆蓋參考，並非品質評分。節拍器是獨立的練習輔助，不會改變分析結果；節拍音與麥克風分析器分開產生，建議使用耳機，以免麥克風再次收錄節拍音。',privacyText:'<b>隱私。</b>這不是 AI 工具。聲音取樣只會在執行時暫存於記憶體供即時顯示；不會上傳、寫入永久儲存空間或用於訓練模型。本機啟動次數只保存在這個瀏覽器中。',
    routinePanelLabel:'段子分析',routineAnalysis:'段子分析',onDevice:'僅限本機',duration:'時間',routineDurationLabel:'段子分析時間',startRoutine:'開始分析',cancelRoutine:'取消',routineReady:'選擇時間，準備好後開始。',routineRunning:'正在分析頻率覆蓋',routineComplete:'分析完成',routineCancelled:'分析提前停止；結果依已收集的片段計算。',routineInstructions:'只記錄 Low、Mid、High 的頻率摘要，不錄製或保存原始聲音。建議先完成 5 秒底噪取樣，或使用手動閾值。',coverageChartLabel:'低中高頻時間覆蓋圖',routineFeedback:'頻率分布建議',routineWaiting:'完成一次分析後，這裡會顯示可嘗試的聲音配置方向。',routineDisclaimer:'此分析描述的是頻譜配置與聲音活動，不代表 Beatbox 技巧、音樂性或表演品質評分。',routineNeedInput:'正在啟動麥克風…',routineNeedGate:'若要得到更可靠的結果，建議先錄製底噪或選擇手動閾值。',routineFocus:'頻譜重心 · {bands}',routineFocusNarrow:'頻譜重心 · 集中音域',routineLowDominantFeedback:'這段表演目前以低頻活動為主。如果你希望增加更多層次與清晰度，可以嘗試加入中頻 percussion 與較明亮的聲音，例如 {ideas}。',routineMidDominantFeedback:'這段的頻譜重心主要位於中頻。如果你希望增加更大的頻譜跨度，可以往低頻與高頻探索，例如 {ideas}。',routineHighDominantFeedback:'目前高頻活動較突出。如果你希望增加重量與底部支撐，可以探索 bass 類聲音與帶有中頻 body 的 percussion，例如 {ideas}。',routineLowMidFeedback:'目前低頻與中頻提供了主要的聲音支撐，高頻活動相對較少。如果希望增加亮度、細節或節奏輪廓，可以嘗試 {ideas}。',routineMidHighFeedback:'目前中頻與高頻較活躍，而低頻活動相對較少。如果希望增加重量或低頻 foundation，可以嘗試 {ideas}。',routineLowHighFeedback:'目前低頻與高頻都有明顯活動，而中頻相對較少。如果希望讓不同聲音之間的連接更密集，可以嘗試 {ideas}。',routineBalancedFeedback:'這段表演在低、中、高頻都有持續活動，頻譜涵蓋相對廣。如果希望進一步調整，可以開始觀察不同頻段之間的動態對比、留白與聲音密度，而不一定需要加入更多聲音。',routineNarrowFeedback:'目前這段的聲音活動較集中在有限的頻率範圍。如果你希望增加聲音變化，可以嘗試不同音域、不同 timbre 或不同類型的 percussion、vocal、bass 與 texture，而不一定只是增加音量；例如可以從 {ideas} 開始探索。',routineSignalFeedback:'目前超過聲音閾值的持續活動還不足以穩定描述整段配置。可以先檢查輸入 Gain 或底噪閘門，再試一次。',routineCreativeCaveat:'這些只是可選擇的聲音設計方向；一個 Beatbox sound 可能同時包含多個頻率成分。如果目前配置是刻意的聲音設計，也可以維持原本安排。',
    wingCredit:'WING · Beatbox 頻譜分析靈感（YouTube）',webAudioCredit:'W3C · Web Audio API 規範',filterCredit:'MDN · 標準音訊濾波器類型',rekordboxCredit:'rekordbox · 三頻段聲波參考',copyrightCredit:'美國著作權局 · 配色指引',methodCopyrightCredit:'美國著作權局 · 概念、方法與系統',frequencyCredit:'MDN · 頻率資料',noiseSuppressionCredit:'MDN · 瀏覽器降噪',noiseGateCredit:'Audacity · 噪音閘門方法',waveformCredit:'Audacity · 聲波縮放與取樣點顯示參考',lowNoiseCredit:'低頻噪音 · 20–200 Hz',praatCredit:'Praat · GPL 授權',formantCredit:'JASA · LPC 與共振峰',beatboxCredit:'人聲 Beatbox 分析',
    communityPanelLabel:'致謝與社群貢獻',communityCredits:'CREDITS / 社群貢獻',communityToggle:'社群迭代紀錄',communityIntro:'來自 Beatbox 社群的想法，逐步形塑了 Analyzer 中幾個具體的分析方向；日期代表這筆貢獻被加入專案迭代紀錄的時間。',wingContribution:'啟發整個頻譜分析概念：觀察頻譜中較弱或缺失的區域，並思考如何適當照顧 Low、Mid、High，讓聲音更接近完整音樂編排的思維。',morrisContribution:'提出將頻率缺口轉化為實際聲音建議的想法，例如加入對應的鼓聲、Bass、Hi-hat 或其他聲音元素；目前已延伸為「頻率分布建議」。',chuanContribution:'台灣 Beatbox 冠軍，實際使用 Analyzer 進行 Overtone 實驗，讓多重人聲頻率與泛音結構成為後續分析方向。',geneContribution:'其影片中對 Lip Oscillation 與不同 vocal tone 的逐音分析，啟發 Polyphonic Singing / Multi-pitch 的方向，目前已整合於 Note Detect 的 Poly 模式。',communityClosing:'Built by Leo Dafloat, shaped by ideas, experiments, and feedback from the beatbox community.'
  }
};
let currentLanguage=localStorage.getItem('beatbox-language')==='en'?'en':'zh-Hant';
function t(key,vars={}){let value=TRANSLATIONS[currentLanguage][key]??TRANSLATIONS.en[key]??key;Object.entries(vars).forEach(([name,replacement])=>value=value.replace(`{${name}}`,replacement));return value;}
function setStatusText(key){$('statusText').innerHTML=`<i></i> ${t(key)}`;}
function applyLanguage(language){
  currentLanguage=language==='en'?'en':'zh-Hant';document.documentElement.lang=currentLanguage;localStorage.setItem('beatbox-language',currentLanguage);
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
  document.querySelectorAll('[data-i18n-html]').forEach(node=>node.innerHTML=t(node.dataset.i18nHtml));
  document.querySelectorAll('[data-i18n-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-title]').forEach(node=>node.title=t(node.dataset.i18nTitle));
  $('languageButton').textContent=currentLanguage==='zh-Hant'?'EN':'繁中';$('languageButton').setAttribute('aria-label',t('switchLanguage'));
  if(!metronomeRunning)$('metronomePosition').textContent=t('off');
  $('recordLabel').textContent=t(running?'stopInput':'startInput');setStatusText(running?'micLive':'micIdle');
  $('calibrateButton').textContent=calibrationEndsAt?t('calibrating',{seconds:Math.max(0,(calibrationEndsAt-performance.now())/1000).toFixed(1)}):t(profileReady?'rerecordNoise':'recordNoise');
  updateHistoryWindowLabel();
  renderLocalStartCount();setRoutineButtonState();$('routineStatus').textContent=t(routineStatusKey);renderRoutineAdvice(routineState.samples);
  [...$('routineDuration').options].forEach(option=>option.textContent=`${option.value} ${currentLanguage==='en'?'sec':'秒'}`);
  updateGateModeUi();
  if(!running){$('noteCents').textContent=t('listening');$('fullnessDetail').textContent=t('startMeasure');$('balanceText').textContent=t('balanceEmpty');}
  renderPolyphonicResult(lastPolyphonicResult);
}

let audioContext, analyser, transientAnalyser, source, stream, animationId;
let running = false, startedAt = 0, waveform = [], rawWaveform = [], lastFrame = 0;
let timeData, freqData, waveTimeData, waveFreqData, peaks = [];
let lastPitch = null, lastPitchAt = 0;
const MIN_FREQ = 20, MAX_FREQ = 20000;
const MIN_DB = -110, MAX_DB = 0;
const BAND_CONFIG = [
  { key:'low', minHz:20, maxHz:250, suggestions:['Kick','Deep Kick','Lip Bass','Sub-style Bass','Throat Bass','Low Vocal Texture','Bass-oriented Special Sound'] },
  { key:'mid', minHz:250, maxHz:4000, suggestions:['Snare','PF Snare','Inward-style Snare','Clap-like Percussion','Mid Vocal','Percussive Texture','Mid-register Special Sound'] },
  { key:'high', minHz:4000, maxHz:MAX_FREQ, suggestions:['Hi-hat','Click','Rim-like Percussion','Airy Texture','High Vocal','Overtone','Whistle / Squeak','Bright Special Sound'] }
];
const BAND_EDGES = BAND_CONFIG.map(({minHz,maxHz})=>[minHz,maxHz]);
const GATE_MARGINS = [4,8,8];
const FULLNESS_PROFILE_MARGINS = [10,14,18];
const FULLNESS_MANUAL_OFFSETS = [0,4,8];
const ROUTINE_ANALYSIS_CONFIG = {
  sampleIntervalMs:200,
  smoothingAttack:.45,
  smoothingRelease:.2,
  activeStrength:.14,
  minimumAudibleActivity:.1,
  stableActivity:.22,
  stableScore:.24,
  activityWeight:.6,
  relativeEnergyWeight:.4,
  dominanceRatio:1.3
};
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
let pitchMode='single';
let secondaryTrack={type:null,frequency:0,harmonic:0,frames:0,misses:0,confidence:0,primaryFrequency:0};
let lastPolyphonicResult=null;
let routineState={active:false,durationMs:90000,startedAt:0,lastSampleAt:0,samples:[],smoothedStrengths:[0,0,0]},routineStatusKey='routineReady';
const HISTORY_WINDOWS_MS=[20000,10000,6000,4000,3000,1000,500,200,100,50,20,10];
const DEFAULT_HISTORY_ZOOM_INDEX=3,MAX_HISTORY_SECONDS=20,RAW_HISTORY_RATE=8000;
const SPECTRUM_RELEASE_DB_PER_SECOND=18;
let historyZoomIndex=DEFAULT_HISTORY_ZOOM_INDEX,historyWindowMs=HISTORY_WINDOWS_MS[historyZoomIndex];
const WAVE_DISPLAY_DEFAULT_VERSION='three-band-v1';
if(localStorage.getItem('beatbox-wave-default-version')!==WAVE_DISPLAY_DEFAULT_VERSION){localStorage.setItem('beatbox-wave-display','threeBand');localStorage.setItem('beatbox-wave-default-version',WAVE_DISPLAY_DEFAULT_VERSION);}
let waveDisplayMode=localStorage.getItem('beatbox-wave-display')==='soundWave'?'soundWave':'threeBand';

function updateBandColorUi() {
  ['lowBandColor','midBandColor','highBandColor'].forEach((id,i)=>$(id).value=bandColors[i]);
  $('bandGradient').style.background=`linear-gradient(90deg,${bandColors.join(',')})`;
}

const LOCAL_START_COUNT_KEY='beatbox-local-starts-v2';
function localStartCount(){return Math.max(0,Number(localStorage.getItem(LOCAL_START_COUNT_KEY))||0);}
function renderLocalStartCount(){const node=$('localUseCount');node.textContent=t('localStarts',{count:localStartCount()});node.setAttribute('aria-label',t('localStartsLabel'));}
function incrementLocalStartCount(){localStorage.setItem(LOCAL_START_COUNT_KEY,String(localStartCount()+1));renderLocalStartCount();}

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
    metronomeRunning=false;clearInterval(metronomeTimer);metronomeTimer=null;$('metronomeButton').classList.remove('active');$('metronomeButton').setAttribute('aria-pressed','false');$('metronomePosition').textContent=t('off');metronomeContext?.suspend().catch(()=>{});return;
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

// Treat the gate as attenuation in decibels. Interpolating a negative dB value
// toward MIN_DB makes even a partly-open gate crush useful spectrum detail.
function applySpectrumGate(db, gate) {
  if (gate <= .015) return MIN_DB;
  return Math.max(MIN_DB, db - (1 - gate) * 24);
}

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
    running = true; startedAt = performance.now(); lastFrame = startedAt; waveform = []; rawWaveform = [];
    incrementLocalStartCount();
    $('recordButton').classList.add('active'); $('recordLabel').textContent = t('stopInput');
    $('statusText').classList.add('live'); setStatusText('micLive');
    $('calibrateButton').disabled=false;
    $('emptyState').classList.add('hidden');
    updateGateModeUi();
    draw();
  } catch (error) {
    $('statusText').textContent = t('micDenied');
    alert(t('microphoneAlert'));
  }
}

function stopInput() {
  if(routineState.active)finishRoutineAnalysis(true);
  running = false; cancelAnimationFrame(animationId);
  stream?.getTracks().forEach(track => track.stop());
  audioContext?.close();
  const cancelledCalibration=Boolean(calibrationEndsAt);calibrationEndsAt=0;$('calibrateButton').disabled=true;
  if(cancelledCalibration&&!profileReady){$('calibrateButton').textContent=t('recordNoise');setGateStatus(t('waitingInput'));}
  $('recordButton').classList.remove('active'); $('recordLabel').textContent = t('startInput');
  $('statusText').classList.remove('live'); setStatusText('micIdle');
  secondaryTrack={type:null,frequency:0,harmonic:0,frames:0,misses:0,confidence:0,primaryFrequency:0};lastPolyphonicResult=null;renderPolyphonicResult(null);
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

function bandIndexForFrequency(freq) {
  const index=BAND_CONFIG.findIndex((band,i)=>freq<band.maxHz||i===BAND_CONFIG.length-1);
  return Math.max(0,index);
}

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
  $('calibrateButton').textContent=t('calibrating',{seconds:'5.0'});setGateStatus(t('pleaseQuiet'),'calibrating');
}

function finishNoiseCalibration() {
  noiseFloor=calibrationSamples.map(samples=>percentile(samples,.9));rmsNoiseFloor=percentile(calibrationRmsSamples,.9);profileReady=true;calibrationEndsAt=0;currentGates=[0,0,0];
  $('calibrateButton').textContent=t('rerecordNoise');setGateStatus(t('locked',{values:noiseFloor.map(v=>Math.round(v)).join(' / ')}),'ready');
}

function updateGateModeUi() {
  $('gateThreshold').disabled=gateMode!=='manual';
  if(gateMode==='manual')setGateStatus(t('manualStatus',{value:manualThreshold}),'ready');
  else if(profileReady)setGateStatus(t('locked',{values:noiseFloor.map(v=>Math.round(v)).join(' / ')}),'ready');
  else setGateStatus(t(running?'profileRequired':'waitingInput'));
}

function updateVisualGate() {
  const dbs=BAND_EDGES.map(([lo,hi])=>bandEnergy(lo,hi,waveFreqData,transientAnalyser));
  let sum=0;for(const value of waveTimeData)sum+=value*value;
  const rmsDb=20*Math.log10(Math.sqrt(sum/waveTimeData.length)+1e-8);
  if(calibrationEndsAt) {
    dbs.forEach((db,i)=>calibrationSamples[i].push(db));
    calibrationRmsSamples.push(rmsDb);
    const remaining=Math.max(0,(calibrationEndsAt-performance.now())/1000);
    $('calibrateButton').textContent=t('calibrating',{seconds:remaining.toFixed(1)});
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

function noteDetails(freq) {
  if(!freq)return{name:'—',cents:0};
  const midi=69+12*Math.log2(freq/440),nearest=Math.round(midi);
  const notes=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
  return{name:notes[(nearest%12+12)%12]+(Math.floor(nearest/12)-1),cents:Math.round((midi-nearest)*100)};
}

function updateNote(freq) {
  if (!freq) { $('noteName').textContent = '—'; $('noteCents').textContent = t('unpitched'); $('noteHz').textContent = '— Hz'; return; }
  const {name,cents}=noteDetails(freq);$('noteName').textContent=name;
  $('noteCents').textContent = t('cents',{value:`${cents >= 0 ? '+' : ''}${cents}`});
  $('noteHz').textContent = `${freq.toFixed(1)} Hz`;
}

function spectrumDbAt(freq) {
  if(!audioContext||!analyser||!freqData||freq<=0||freq>=audioContext.sampleRate/2)return MIN_DB;
  const index=Math.max(1,Math.min(freqData.length-2,Math.round(freq/(audioContext.sampleRate/analyser.fftSize))));
  return freqData[index];
}

function spectralProminence(freq) {
  if(!audioContext||!analyser||!freqData)return 0;
  const binHz=audioContext.sampleRate/analyser.fftSize,index=Math.max(7,Math.min(freqData.length-8,Math.round(freq/binHz)));
  let floor=0,count=0;
  for(let offset=-7;offset<=7;offset++)if(Math.abs(offset)>2){floor+=freqData[index+offset];count++;}
  return freqData[index]-floor/Math.max(1,count);
}

function spectralFlatness() {
  if(!audioContext||!analyser||!freqData)return 1;
  const binHz=audioContext.sampleRate/analyser.fftSize,start=Math.max(1,Math.floor(55/binHz)),end=Math.min(freqData.length,Math.ceil(5000/binHz));
  let logSum=0,powerSum=0,count=0;
  for(let i=start;i<end;i+=2){const power=10**(freqData[i]/10);logSum+=Math.log(power+1e-14);powerSum+=power;count++;}
  return Math.exp(logSum/Math.max(1,count))/(powerSum/Math.max(1,count)+1e-14);
}

function nearPrimaryHarmonic(freq,primary) {
  if(!primary)return false;
  const ratio=freq/primary,inverse=primary/freq;
  const distance=value=>{const integer=Math.round(value);return integer>=1?Math.abs(1200*Math.log2(value/integer)):Infinity;};
  return distance(ratio)<38||distance(inverse)<38;
}

function harmonicSalience(f0,primaryToExclude=0) {
  let score=0,support=0,used=0;
  for(let harmonic=1;harmonic<=10&&f0*harmonic<5000;harmonic++){
    const frequency=f0*harmonic;
    if(primaryToExclude&&nearPrimaryHarmonic(frequency,primaryToExclude))continue;
    const prominence=spectralProminence(frequency),db=spectrumDbAt(frequency),weight=1/Math.sqrt(harmonic);
    if(db>-82&&prominence>2){score+=(prominence-2)*weight;used++;}
    if(db>-76&&prominence>4.5)support++;
  }
  return{score,support,used};
}

function findIndependentPitch(primary) {
  if(!primary)return null;
  const primarySalience=harmonicSalience(primary),candidates=[];
  for(let step=0;step<=101;step++){
    const frequency=55*2**(step/24);
    if(frequency>1000)break;
    if(Math.abs(1200*Math.log2(frequency/primary))<140||nearPrimaryHarmonic(frequency,primary))continue;
    const salience=harmonicSalience(frequency,primary),fundamentalDb=spectrumDbAt(frequency),fundamentalProminence=spectralProminence(frequency);
    if(salience.support>=4&&salience.used>=4&&fundamentalDb>-72&&fundamentalProminence>5.5)candidates.push({type:'independent',frequency,score:salience.score,support:salience.support,ratio:salience.score/(primarySalience.score+8)});
  }
  candidates.sort((a,b)=>b.score-a.score);const best=candidates[0];
  return best&&best.score>13&&best.ratio>.55?best:null;
}

function findEnhancedOvertone(primary) {
  if(!primary)return null;
  let best=null;
  for(let harmonic=2;harmonic<=16&&primary*harmonic<5000;harmonic++){
    const frequency=primary*harmonic,db=spectrumDbAt(frequency),prominence=spectralProminence(frequency);
    const neighbors=[harmonic-1,harmonic+1].filter(value=>value>0&&primary*value<5000).map(value=>spectrumDbAt(primary*value));
    const boost=db-neighbors.reduce((sum,value)=>sum+value,0)/Math.max(1,neighbors.length),score=boost+prominence*.45;
    if(db>-76&&prominence>5.5&&boost>4.5&&(!best||score>best.score))best={type:'harmonic',frequency,harmonic,score,support:2,ratio:Math.min(1,score/18)};
  }
  return best;
}

function stabilizePolyphonicCandidate(candidate,primary) {
  if(!candidate){
    secondaryTrack.misses++;
    if(secondaryTrack.misses>3)secondaryTrack={type:null,frequency:0,harmonic:0,frames:0,misses:0,confidence:0,primaryFrequency:primary||0};
    return secondaryTrack.frames>0?secondaryTrack:null;
  }
  const sameType=secondaryTrack.type===candidate.type;
  const samePitch=candidate.type==='harmonic'?secondaryTrack.harmonic===candidate.harmonic:secondaryTrack.frequency&&Math.abs(1200*Math.log2(candidate.frequency/secondaryTrack.frequency))<75;
  const samePrimary=secondaryTrack.primaryFrequency&&primary&&Math.abs(1200*Math.log2(primary/secondaryTrack.primaryFrequency))<90;
  if(sameType&&samePitch&&samePrimary){
    secondaryTrack.frequency=secondaryTrack.frequency*.72+candidate.frequency*.28;secondaryTrack.frames=Math.min(10,secondaryTrack.frames+1);
  }else secondaryTrack={...candidate,frames:1,misses:0,confidence:0,primaryFrequency:primary};
  secondaryTrack.misses=0;secondaryTrack.primaryFrequency=primary;
  const required=secondaryTrack.type==='independent'?3:2;
  secondaryTrack.confidence=Math.round(Math.min(94,34+secondaryTrack.frames*8+Math.min(20,(candidate.ratio||0)*20)));
  return secondaryTrack.frames>=required?secondaryTrack:null;
}

function detectPolyphonicPitch(primary) {
  if(!primary||primary<55||primary>700||spectralFlatness()>.24)return stabilizePolyphonicCandidate(null,primary);
  const independent=findIndependentPitch(primary),overtone=findEnhancedOvertone(primary);
  const candidate=independent&&(!overtone||independent.ratio>.62)?independent:overtone;
  return stabilizePolyphonicCandidate(candidate,primary);
}

function renderPolyphonicResult(result) {
  const enabled=pitchMode==='polyphonic',container=$('secondaryPitch');
  $('noteName').closest('.note-block').classList.toggle('polyphonic',enabled);container.hidden=!enabled;
  if(!enabled)return;
  if(!result){$('secondaryPitchLabel').textContent=t('secondaryPitch');$('secondaryNoteName').textContent='—';$('secondaryConfidence').textContent=t('waitingStable');$('secondaryNoteHz').textContent='— Hz';$('pitchRelation').textContent=t('experimentalAnalysis');return;}
  const details=noteDetails(result.frequency),primaryName=noteDetails(result.primaryFrequency).name;
  $('secondaryPitchLabel').textContent=t(result.type==='harmonic'?'enhancedOvertone':'secondaryPitch');$('secondaryNoteName').textContent=details.name;
  $('secondaryConfidence').textContent=t('betaConfidence',{value:result.confidence});$('secondaryNoteHz').textContent=`${result.frequency.toFixed(1)} Hz`;
  $('pitchRelation').textContent=result.type==='harmonic'?t('harmonicRelation',{harmonic:result.harmonic,primary:primaryName}):t('independentRelation',{primary:primaryName});
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
  const values=BAND_EDGES.map(([lo,hi])=>bandEnergy(lo,hi)),[low,mid,high]=values,levels=values.map(dbToLevel);
  ['lowValue','midValue','highValue'].forEach((id,i)=>$(id).textContent=`${Math.round(values[i])} dB`);
  if(gateState.calibrating||gateState.profileMissing){$('fullnessLabel').textContent='—';$('fullnessMeter').style.width='0%';$('fullnessDetail').textContent=t(gateState.calibrating?'recordingRoom':'noiseProfileRequired');return{low,mid,high,level:0,score:0,centroid:spectralCentroid()};}
  const thresholds=gateMode==='profile'
    ? noiseFloor.map((floor,i)=>floor+FULLNESS_PROFILE_MARGINS[i])
    : FULLNESS_MANUAL_OFFSETS.map(offset=>manualThreshold+offset);
  const active=gateState.dbs.map((db,i)=>db>=thresholds[i]),activeCount=active.filter(Boolean).length,score=Math.round(activeCount/3*100);
  const label=t(activeCount===3?'full':activeCount>0?'moderate':'limited');
  $('fullnessLabel').textContent=label;$('fullnessMeter').style.width=`${score}%`;
  const activeNames=['low','mid','high'].filter((_,i)=>active[i]).map(t);
  $('fullnessDetail').textContent=t('fullnessDetail',{count:activeCount,bands:activeNames.length?' · '+activeNames.join(' + '):'',mode:t(gateMode==='profile'?'profileMode':'manualMode')});
  const names=['lows','mids','highs'].map(t), max=Math.max(...levels), min=Math.min(...levels);
  $('balanceText').textContent = max-min < .12 ? t('balanceEven') : t('balanceForward',{band:names[levels.indexOf(max)]});
  return { low, mid, high, level: Math.max(...levels), score, centroid:spectralCentroid() };
}

function routineDurationSeconds(){return [30,45,60,90].includes(Number($('routineDuration').value))?Number($('routineDuration').value):90;}
function routineThresholds(){
  if(gateMode==='manual')return FULLNESS_MANUAL_OFFSETS.map(offset=>manualThreshold+offset);
  return noiseFloor.map((floor,i)=>floor+FULLNESS_PROFILE_MARGINS[i]);
}
function formatRoutineClock(seconds){const safe=Math.max(0,Math.round(seconds)),minutes=Math.floor(safe/60),rest=safe%60;return`${String(minutes).padStart(2,'0')}:${String(rest).padStart(2,'0')}`;}
function setRoutineButtonState(){
  $('routineButton').textContent=t(routineState.active?'cancelRoutine':'startRoutine');$('routineButton').classList.toggle('active',routineState.active);$('routineDuration').disabled=routineState.active;
}
function renderRoutineTimeline(samples=routineState.samples){
  const names=['low','mid','high'],total=Math.max(1,samples.length),bucketCount=Math.min(90,Math.max(1,samples.length));
  names.forEach((name,band)=>{
    const active=samples.reduce((sum,sample)=>sum+(sample.active[band]?1:0),0),percentage=Math.round(active/total*100);
    const colors=[];
    for(let bucket=0;bucket<bucketCount;bucket++){
      const from=Math.floor(bucket*samples.length/bucketCount),to=Math.max(from+1,Math.floor((bucket+1)*samples.length/bucketCount));
      let hits=0;for(let i=from;i<Math.min(samples.length,to);i++)if(samples[i].active[band])hits++;
      const strength=hits/Math.max(1,to-from),start=bucket/bucketCount*100,end=(bucket+1)/bucketCount*100;
      colors.push(`rgba(${band===0?'77,0,255':band===1?'0,255,102':'255,0,127'},${(.08+strength*.88).toFixed(2)}) ${start.toFixed(2)}%`, `rgba(${band===0?'77,0,255':band===1?'0,255,102':'255,0,127'},${(.08+strength*.88).toFixed(2)}) ${end.toFixed(2)}%`);
    }
    $(`${name}CoverageFill`).style.background=samples.length?`linear-gradient(90deg,${colors.join(',')})`:'';
    $(`${name}CoverageValue`).textContent=samples.length?`${percentage}%`:'—';
  });
}

function routineBandStrength(db,threshold){
  return smoothstep((db-threshold+5)/24);
}

function smoothRoutineStrengths(previous,instant){
  return instant.map((value,i)=>{
    const rate=value>previous[i]?ROUTINE_ANALYSIS_CONFIG.smoothingAttack:ROUTINE_ANALYSIS_CONFIG.smoothingRelease;
    return previous[i]+(value-previous[i])*rate;
  });
}

function analyzeBandBalance(samples){
  if(!samples.length)return null;
  const strengths=samples.map(sample=>sample.strengths||sample.active.map(active=>active?1:0));
  const meanStrength=BAND_CONFIG.map((_,band)=>strengths.reduce((sum,values)=>sum+values[band],0)/strengths.length);
  const energyTotal=meanStrength.reduce((sum,value)=>sum+value,0);
  const relativeEnergy=meanStrength.map(value=>energyTotal>1e-6?value/energyTotal:0);
  const activity=BAND_CONFIG.map((_,band)=>samples.reduce((sum,sample,index)=>{
    const active=sample.active?.[band]??strengths[index][band]>=ROUTINE_ANALYSIS_CONFIG.activeStrength;
    return sum+(active?1:0);
  },0)/samples.length);
  const audibleActivity=samples.reduce((sum,sample,index)=>{
    const active=sample.active?.some(Boolean)??strengths[index].some(value=>value>=ROUTINE_ANALYSIS_CONFIG.activeStrength);
    return sum+(active?1:0);
  },0)/samples.length;
  const scores=activity.map((value,i)=>value*ROUTINE_ANALYSIS_CONFIG.activityWeight+relativeEnergy[i]*ROUTINE_ANALYSIS_CONFIG.relativeEnergyWeight);
  const stable=scores.map((score,i)=>score>=ROUTINE_ANALYSIS_CONFIG.stableScore&&activity[i]>=ROUTINE_ANALYSIS_CONFIG.stableActivity);
  return {activity,meanStrength,relativeEnergy,scores,stable,audibleActivity};
}

function classifySpectrumProfile(analysis){
  if(!analysis||analysis.audibleActivity<ROUTINE_ANALYSIS_CONFIG.minimumAudibleActivity)return'insufficientSignal';
  const stableBands=analysis.stable.map((active,index)=>active?index:-1).filter(index=>index>=0);
  if(stableBands.length===3)return'balanced';
  if(stableBands.length===2)return{'0-1':'lowMid','0-2':'lowHigh','1-2':'midHigh'}[stableBands.join('-')];
  if(stableBands.length===1)return`${BAND_CONFIG[stableBands[0]].key}Dominant`;
  const order=[0,1,2].sort((a,b)=>analysis.scores[b]-analysis.scores[a]),[first,second]=order;
  if(analysis.activity[first]>=ROUTINE_ANALYSIS_CONFIG.minimumAudibleActivity&&analysis.scores[first]>=analysis.scores[second]*ROUTINE_ANALYSIS_CONFIG.dominanceRatio)return`${BAND_CONFIG[first].key}Dominant`;
  return'narrow';
}

function routineSuggestionSeed(analysis){
  return analysis.activity.reduce((seed,value,index)=>seed+Math.round(value*997)*(index+3),17);
}

function pickBandSuggestions(bandIndex,count,seed){
  const pool=BAND_CONFIG[bandIndex].suggestions,start=Math.abs(seed+bandIndex*5)%pool.length;
  return Array.from({length:Math.min(count,pool.length)},(_,index)=>pool[(start+index*3)%pool.length]);
}

function formatRoutineIdeas(ideas){
  if(currentLanguage==='zh-Hant')return ideas.join('、');
  if(ideas.length<2)return ideas[0]||'';
  return `${ideas.slice(0,-1).join(', ')} or ${ideas.at(-1)}`;
}

function generateSpectrumFeedback(analysis){
  if(!analysis)return[t('routineWaiting')];
  const profile=classifySpectrumProfile(analysis);
  if(profile==='insufficientSignal')return[t('routineSignalFeedback')];
  const profileBands={lowDominant:[0],midDominant:[1],highDominant:[2],lowMid:[0,1],midHigh:[1,2],lowHigh:[0,2],balanced:[0,1,2]};
  const names=currentLanguage==='zh-Hant'?['低頻','中頻','高頻']:['LOW','MID','HIGH'];
  const lines=[profile==='narrow'?t('routineFocusNarrow'):t('routineFocus',{bands:profileBands[profile].map(index=>names[index]).join(' + ')})];
  if(profile==='balanced'){lines.push(t('routineBalancedFeedback'));return lines;}
  const seed=routineSuggestionSeed(analysis),suggestionPlan={
    lowDominant:[[1,2],[2,2]],midDominant:[[0,2],[2,2]],highDominant:[[0,3],[1,1]],
    lowMid:[[2,4]],midHigh:[[0,4]],lowHigh:[[1,4]],narrow:[[0,1],[1,1],[2,1]]
  };
  const ideas=suggestionPlan[profile].flatMap(([band,count],index)=>pickBandSuggestions(band,count,seed+index*11));
  const feedbackKey={lowDominant:'routineLowDominantFeedback',midDominant:'routineMidDominantFeedback',highDominant:'routineHighDominantFeedback',lowMid:'routineLowMidFeedback',midHigh:'routineMidHighFeedback',lowHigh:'routineLowHighFeedback',narrow:'routineNarrowFeedback'}[profile];
  lines.push(t(feedbackKey,{ideas:formatRoutineIdeas(ideas)}),t('routineCreativeCaveat'));
  return lines;
}

function routineAdvice(samples){return generateSpectrumFeedback(analyzeBandBalance(samples));}
function renderRoutineAdvice(samples){
  const list=$('routineAdviceList'),items=routineAdvice(samples).map(message=>{const item=document.createElement('li');item.textContent=message;return item;});
  list.replaceChildren(...items);
}
async function startRoutineAnalysis(){
  if(routineState.active){finishRoutineAnalysis(true);return;}
  routineStatusKey='routineNeedInput';$('routineStatus').textContent=t(routineStatusKey);
  if(!running)await toggleInput();
  if(!running){routineStatusKey='routineReady';$('routineStatus').textContent=t(routineStatusKey);return;}
  const seconds=routineDurationSeconds(),now=performance.now();routineState={active:true,durationMs:seconds*1000,startedAt:now,lastSampleAt:0,samples:[],smoothedStrengths:[0,0,0]};
  routineStatusKey=gateMode==='profile'&&!profileReady?'routineNeedGate':'routineRunning';$('routineStatus').textContent=t(routineStatusKey);$('routineTime').textContent=`00:00 / ${formatRoutineClock(seconds)}`;$('routineProgress').style.width='0%';
  renderRoutineTimeline([]);renderRoutineAdvice([]);setRoutineButtonState();
}
function updateRoutineAnalysis(gateState,now){
  if(!routineState.active)return;
  const elapsed=now-routineState.startedAt,remaining=Math.max(0,routineState.durationMs-elapsed),progress=Math.min(1,elapsed/routineState.durationMs);
  $('routineTime').textContent=`${formatRoutineClock(elapsed/1000)} / ${formatRoutineClock(routineState.durationMs/1000)}`;$('routineProgress').style.width=`${progress*100}%`;
  if(!gateState.calibrating&&now-routineState.lastSampleAt>=ROUTINE_ANALYSIS_CONFIG.sampleIntervalMs){
    const thresholds=routineThresholds(),instant=gateState.dbs.map((db,i)=>routineBandStrength(db,thresholds[i]));
    routineState.smoothedStrengths=smoothRoutineStrengths(routineState.smoothedStrengths,instant);
    const strengths=[...routineState.smoothedStrengths],active=strengths.map(value=>value>=ROUTINE_ANALYSIS_CONFIG.activeStrength);
    routineState.samples.push({active,strengths,dbs:[...gateState.dbs],thresholds,rmsDb:gateState.rmsDb});routineState.lastSampleAt=now;
    if(routineState.samples.length%5===0)renderRoutineTimeline();
  }
  if(remaining<=0)finishRoutineAnalysis(false);
}
function finishRoutineAnalysis(cancelled=false){
  if(!routineState.active)return;
  routineState.active=false;renderRoutineTimeline();renderRoutineAdvice(routineState.samples);$('routineProgress').style.width=cancelled?`${Math.min(100,routineState.samples.length/(routineState.durationMs/ROUTINE_ANALYSIS_CONFIG.sampleIntervalMs)*100)}%`:'100%';
  routineStatusKey=cancelled?'routineCancelled':'routineComplete';$('routineStatus').textContent=t(routineStatusKey);setRoutineButtonState();
}

function addWaveSlice(gateState) {
  const references=gateMode==='profile'&&profileReady?noiseFloor:[manualThreshold-8,manualThreshold-8,manualThreshold-8];
  const bandWeights=[1.35,1,1];
  const energies=gateState.gates.map((gate,i)=>bandWeights[i]*gate*Math.max(0,Math.min(1,(gateState.dbs[i]-references[i])/42)));
  const sum=energies.reduce((a,b)=>a+b,0),shares=sum>1e-6?energies.map(value=>value/sum):[0,0,0];
  const rmsReference=gateMode==='profile'&&profileReady?rmsNoiseFloor:manualThreshold-8;
  const peak=sum>1e-6?Math.max(0,Math.min(.92,(gateState.rmsDb-rmsReference)/48)):0;
  const now=performance.now();waveform.push({shares,peak,at:now});
  const cutoff=now-MAX_HISTORY_SECONDS*1000;if(waveform[0]?.at<cutoff)waveform=waveform.filter(slice=>slice.at>=cutoff);
}

function addRawWaveSamples(dt) {
  if(!waveTimeData||!audioContext)return;
  const sourceCount=Math.min(waveTimeData.length,Math.max(16,Math.round(audioContext.sampleRate*dt/1000)));
  const outputCount=Math.max(2,Math.round(RAW_HISTORY_RATE*dt/1000)),start=waveTimeData.length-sourceCount;
  for(let i=0;i<outputCount;i++)rawWaveform.push(waveTimeData[Math.min(waveTimeData.length-1,start+Math.floor(i/outputCount*sourceCount))]);
  const maximum=RAW_HISTORY_RATE*MAX_HISTORY_SECONDS;if(rawWaveform.length>maximum)rawWaveform.splice(0,rawWaveform.length-maximum);
}

function drawThreeBandWaveform(w,h,dpr) {
  const mid=h/2,now=performance.now(),windowStart=now-historyWindowMs,visible=waveform.filter(slice=>slice.at>=windowStart);
  const layers=[2,1,0].map(index=>({index,color:bandColors[index]}));
  for(let i=1;i<visible.length;i++){
    const a=visible[i-1],b=visible[i],x0=Math.max(0,(a.at-windowStart)/historyWindowMs*(w-20*dpr)),x1=Math.max(x0+1,(b.at-windowStart)/historyWindowMs*(w-20*dpr));
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
}

function drawRawSoundWave(w,h,dpr) {
  const mid=h/2,visibleCount=Math.min(rawWaveform.length,Math.round(historyWindowMs/1000*RAW_HISTORY_RATE)),start=rawWaveform.length-visibleCount,usable=w-20*dpr;
  if(visibleCount<2)return;
  const pixelsPerSample=usable/(visibleCount-1);
  if(pixelsPerSample>=.85){
    wctx.save();wctx.shadowColor=bandColors[1];wctx.shadowBlur=3*dpr;wctx.strokeStyle=bandColors[1];wctx.lineWidth=Math.max(1,1.05*dpr);wctx.beginPath();
    for(let i=0;i<visibleCount;i++){
      const x=i/(visibleCount-1)*usable,y=mid-rawWaveform[start+i]*h*.43;
      if(i===0)wctx.moveTo(x,y);else wctx.lineTo(x,y);
    }
    wctx.stroke();wctx.shadowBlur=0;
    if(pixelsPerSample>=3){
      wctx.fillStyle='rgba(255,255,255,.92)';
      for(let i=0;i<visibleCount;i++){
        const x=i/(visibleCount-1)*usable,y=mid-rawWaveform[start+i]*h*.43;
        wctx.beginPath();wctx.arc(x,y,Math.max(1.15*dpr,1.4),0,Math.PI*2);wctx.fill();
      }
    }
    wctx.restore();return;
  }
  const buckets=Math.max(2,Math.floor(usable/dpr)),samplesPerBucket=visibleCount/buckets,upper=[],lower=[];
  for(let bucket=0;bucket<buckets;bucket++){
    const from=start+Math.floor(bucket*samplesPerBucket),to=Math.min(rawWaveform.length,start+Math.ceil((bucket+1)*samplesPerBucket));let min=1,max=-1;
    for(let i=from;i<to;i++){const sample=rawWaveform[i];if(sample<min)min=sample;if(sample>max)max=sample;}
    const x=bucket/(buckets-1)*usable;upper.push({x,y:mid-max*h*.43});lower.push({x,y:mid-min*h*.43});
  }
  wctx.beginPath();wctx.moveTo(upper[0].x,upper[0].y);upper.slice(1).forEach(point=>wctx.lineTo(point.x,point.y));for(let i=lower.length-1;i>=0;i--)wctx.lineTo(lower[i].x,lower[i].y);wctx.closePath();wctx.fillStyle=bandColors[1];wctx.globalAlpha=.55;wctx.fill();
  wctx.beginPath();wctx.moveTo(upper[0].x,upper[0].y);upper.slice(1).forEach(point=>wctx.lineTo(point.x,point.y));wctx.strokeStyle='rgba(255,255,255,.82)';wctx.lineWidth=.7*dpr;wctx.stroke();
  wctx.beginPath();wctx.moveTo(lower[0].x,lower[0].y);lower.slice(1).forEach(point=>wctx.lineTo(point.x,point.y));wctx.stroke();
}

function drawWaveform() {
  const {width:w,height:h,dpr}=resizeCanvas(waveCanvas);wctx.clearRect(0,0,w,h);const mid=h/2;
  if(waveDisplayMode==='soundWave')drawRawSoundWave(w,h,dpr);else drawThreeBandWaveform(w,h,dpr);
  wctx.globalAlpha=1;
  wctx.strokeStyle='rgba(255,255,255,.16)';wctx.beginPath();wctx.moveTo(0,mid);wctx.lineTo(w,mid);wctx.stroke();
}

function findSpectralPeaks() {
  const binHz=audioContext.sampleRate/analyser.fftSize, found=[],analysisCeiling=Math.min(MAX_FREQ,audioContext.sampleRate/2)*.95;
  for(let f=40;f<analysisCeiling;f+=binHz){
    const i=Math.round(f/binHz),band=bandIndexForFrequency(f),threshold=gateMode==='manual'?manualThreshold+2:Math.max(-84,noiseFloor[band]+7);
    const shoulder=(freqData[i-3]+freqData[i+3])/2,prominence=freqData[i]-shoulder;
    if(freqData[i]>threshold&&prominence>2.5)found.push({f,db:freqData[i],threshold,prominence});
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
  sctx.save();sctx.globalAlpha=1;sctx.globalCompositeOperation='source-over';sctx.shadowBlur=0;sctx.clearRect(0,0,w,h);
  const binHz=audioContext.sampleRate/analyser.fftSize, decay=dt/1000*SPECTRUM_RELEASE_DB_PER_SECOND;
  for(let i=1;i<freqData.length;i++){const gate=gateState.gates[bandIndexForFrequency(i*binHz)],gatedDb=applySpectrumGate(freqData[i],gate);peaks[i]=Math.max(gatedDb,peaks[i]-decay);}
  let samples=[];
  const nyquist=audioContext.sampleRate/2;
  for(let x=0;x<=w-pad*2;x+=Math.max(1,dpr)){const t=x/(w-pad*2),f=MIN_FREQ*(MAX_FREQ/MIN_FREQ)**t,i=Math.min(freqData.length-1,Math.round(f/binHz)),available=f<=nyquist,gate=available?gateState.gates[bandIndexForFrequency(f)]:0,liveDb=available?applySpectrumGate(freqData[i],gate):MIN_DB,peakDb=available?peaks[i]:MIN_DB;samples.push({x:x+pad,y:h-bottom-dbToLevel(peakDb)*(h-bottom-18*dpr),liveY:h-bottom-dbToLevel(liveDb)*(h-bottom-18*dpr)});}
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
  sctx.restore();
  if (cursorLocked) updateSpectrumCursor(cursorClientX, true);
}

function updateSpectrumCursor(clientX, locked=cursorLocked) {
  const rect=spectrumCanvas.getBoundingClientRect(), pad=22;
  const x=Math.max(pad,Math.min(rect.width-pad,clientX-rect.left));
  const positionRatio=(x-pad)/(rect.width-pad*2), freq=MIN_FREQ*(MAX_FREQ/MIN_FREQ)**positionRatio;
  const binHz=audioContext ? audioContext.sampleRate/analyser.fftSize : 48000/16384;
  const index=Math.max(1,Math.min((freqData?.length||4096)-1,Math.round(freq/binHz)));
  const available=!audioContext||freq<=audioContext.sampleRate/2,rawDb=freqData&&available?freqData[index]:MIN_DB,gate=available?currentGates[bandIndexForFrequency(freq)]:0,db=applySpectrumGate(rawDb,gate),y=rect.height-28-dbToLevel(db)*(rect.height-46);
  const cursor=$('spectrumCursor'); cursor.style.setProperty('--cursor-x',`${x}px`); cursor.style.setProperty('--cursor-y',`${y}px`);
  cursor.classList.add('visible'); cursor.classList.toggle('locked',locked);
  const freqText=freq>=1000?`${(freq/1000).toFixed(2)} kHz`:`${Math.round(freq)} Hz`;
  $('spectrumReadout').textContent=`${t(locked?'cursorLocked':'cursorLive')} · ${freqText} · ${Number.isFinite(db)?db.toFixed(1):'≤ −100'} dBFS`;
}

function draw(now=performance.now()) {
  if(!running)return; analyser.getFloatTimeDomainData(timeData); analyser.getFloatFrequencyData(freqData);transientAnalyser.getFloatTimeDomainData(waveTimeData);transientAnalyser.getFloatFrequencyData(waveFreqData);
  const dt=Math.min(50,now-lastFrame);lastFrame=now;const gateState=updateVisualGate();updateMetrics(gateState);updateRoutineAnalysis(gateState,now);
  if (now-lastPitchAt > 80) { lastPitch=detectPitch(timeData.subarray(0,4096),audioContext.sampleRate); lastPitchAt=now; updateNote(lastPitch);lastPolyphonicResult=pitchMode==='polyphonic'?detectPolyphonicPitch(lastPitch):null;renderPolyphonicResult(lastPolyphonicResult); }
  addWaveSlice(gateState);addRawWaveSamples(dt);drawWaveform();drawSpectrum(dt,gateState);$('timer').textContent=formatTime(now-startedAt);animationId=requestAnimationFrame(draw);
}

function updateHistoryWindowLabel() {
  $('historyWindowLabel').textContent=historyWindowMs>=1000?t('seconds',{value:historyWindowMs/1000}):t('milliseconds',{value:historyWindowMs});
}

function setHistoryZoomIndex(value) {
  historyZoomIndex=Math.max(0,Math.min(HISTORY_WINDOWS_MS.length-1,Math.round(Number(value)||0)));
  historyWindowMs=HISTORY_WINDOWS_MS[historyZoomIndex];
  $('historyZoom').value=String(historyZoomIndex);updateHistoryWindowLabel();
  if(!running)drawWaveform();
}

function formatTime(ms){const total=ms/1000,m=Math.floor(total/60),s=Math.floor(total%60),t=Math.floor((total%1)*10);return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${t}`}
$('recordButton').addEventListener('click',toggleInput);
$('routineButton').addEventListener('click',startRoutineAnalysis);
$('routineDuration').addEventListener('change',()=>{$('routineTime').textContent=`00:00 / ${formatRoutineClock(routineDurationSeconds())}`;});
$('languageButton').addEventListener('click',()=>applyLanguage(currentLanguage==='zh-Hant'?'en':'zh-Hant'));
$('pitchMode').addEventListener('change',event=>{pitchMode=event.target.value==='polyphonic'?'polyphonic':'single';secondaryTrack={type:null,frequency:0,harmonic:0,frames:0,misses:0,confidence:0,primaryFrequency:0};lastPolyphonicResult=null;renderPolyphonicResult(null);});
$('waveDisplayMode').addEventListener('change',event=>{waveDisplayMode=event.target.value==='soundWave'?'soundWave':'threeBand';localStorage.setItem('beatbox-wave-display',waveDisplayMode);drawWaveform();});
$('historyZoom').addEventListener('input',event=>setHistoryZoomIndex(event.target.value));
$('resetHistoryZoom').addEventListener('click',()=>setHistoryZoomIndex(DEFAULT_HISTORY_ZOOM_INDEX));
waveCanvas.closest('.canvas-wrap').addEventListener('wheel',event=>{
  const direction=event.deltaY<0?1:-1;
  const nextIndex=historyZoomIndex+direction;
  if(nextIndex<0||nextIndex>=HISTORY_WINDOWS_MS.length)return;
  event.preventDefault();setHistoryZoomIndex(nextIndex);
},{passive:false});
$('metronomeButton').addEventListener('click',toggleMetronome);
$('bpmInput').addEventListener('change',event=>{event.target.value=metronomeBpm();restartMetronomeClock();});
$('meterBeats').addEventListener('change',normalizeMeterInputs);
$('meterDivision').addEventListener('change',normalizeMeterInputs);
$('calibrateButton').addEventListener('click',startNoiseCalibration);
document.querySelectorAll('input[name="gateMode"]').forEach(input=>input.addEventListener('change',event=>{
  gateMode=event.target.value;
  if(gateMode==='manual'&&calibrationEndsAt){calibrationEndsAt=0;$('calibrateButton').textContent=t('recordNoise');}
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
renderLocalStartCount();renderRoutineTimeline([]);setRoutineButtonState();$('routineTime').textContent=`00:00 / ${formatRoutineClock(routineDurationSeconds())}`;
updateGateModeUi();
restoreBandTheme();
const savedSpectrumInput=document.querySelector(`input[name="spectrumColor"][value="${spectrumColor}"]`);if(savedSpectrumInput)savedSpectrumInput.checked=true;
$('waveDisplayMode').value=waveDisplayMode;
$('pitchMode').value=pitchMode;
localStorage.removeItem('beatbox-pitch-mode');setHistoryZoomIndex(DEFAULT_HISTORY_ZOOM_INDEX);
applyLanguage(currentLanguage);
