(function () {
  'use strict';

  // Paste the Website ID from Umami's tracking-code screen to enable analytics.
  // An empty ID keeps analytics completely disabled and sends no network requests.
  const CONFIG = Object.freeze({
    websiteId: 'f9bd1d63-a07a-4d2d-9af1-b934d70f4bd0',
    scriptUrl: 'https://cloud.umami.is/script.js',
    productionHosts: ['leodafloat-ctrl.github.io']
  });

  const ALLOWED_EVENTS = new Set([
    'live_input_started',
    'recording_started',
    'recording_completed',
    'recording_downloaded',
    'audio_file_selected',
    'audio_playback_started',
    'routine_analysis_started',
    'routine_analysis_completed',
    'routine_analysis_cancelled',
    'routine_results_viewed',
    'note_mode_changed',
    'signal_display_mode_changed',
    'spectrum_range_count_changed',
    'spectrum_color_changed',
    'noise_profile_completed',
    'metronome_started'
  ]);

  const ALLOWED_PROPERTIES = new Set([
    'input_type',
    'mode',
    'duration_bucket',
    'analysis_seconds',
    'analysis_number',
    'range_count',
    'color',
    'gate_mode'
  ]);

  const queue = [];
  const enabled = Boolean(CONFIG.websiteId)
    && CONFIG.productionHosts.includes(window.location.hostname);

  function sanitizeProperties(properties) {
    if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return undefined;
    const safe = {};
    Object.entries(properties).forEach(([key, value]) => {
      if (!ALLOWED_PROPERTIES.has(key)) return;
      if (typeof value === 'string') safe[key] = value.slice(0, 64);
      else if (typeof value === 'number' && Number.isFinite(value)) safe[key] = value;
      else if (typeof value === 'boolean') safe[key] = value;
    });
    return Object.keys(safe).length ? safe : undefined;
  }

  function send(name, properties) {
    if (typeof window.umami?.track !== 'function') return false;
    const safeProperties = sanitizeProperties(properties);
    if (safeProperties) window.umami.track(name, safeProperties);
    else window.umami.track(name);
    return true;
  }

  function flushQueue() {
    while (queue.length && typeof window.umami?.track === 'function') {
      const [name, properties] = queue.shift();
      send(name, properties);
    }
  }

  function trackEvent(name, properties) {
    if (!enabled || !ALLOWED_EVENTS.has(name)) return;
    const safeProperties = sanitizeProperties(properties);
    if (!send(name, safeProperties)) queue.push([name, safeProperties]);
  }

  window.BeatboxAnalytics = Object.freeze({
    trackEvent,
    isEnabled: () => enabled
  });

  if (!enabled) return;

  const tracker = document.createElement('script');
  tracker.defer = true;
  tracker.src = CONFIG.scriptUrl;
  tracker.dataset.websiteId = CONFIG.websiteId;
  tracker.dataset.domains = CONFIG.productionHosts.join(',');
  tracker.dataset.doNotTrack = 'true';
  tracker.addEventListener('load', flushQueue, { once: true });
  tracker.addEventListener('error', () => { queue.length = 0; }, { once: true });
  document.head.appendChild(tracker);
}());
