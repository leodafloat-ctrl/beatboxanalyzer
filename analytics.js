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
    'input_started',
    'valid_signal_detected',
    'analysis_engaged',
    'analysis_completed',
    'recording_started',
    'recording_completed',
    'recording_downloaded',
    'audio_uploaded',
    'playback_started',
    'phrase_analysis_exposed',
    'phrase_analysis_started',
    'phrase_analysis_completed',
    'phrase_analysis_cancelled',
    'feature_first_used',
    'noise_profile_completed',
  ]);

  const ALLOWED_PROPERTIES = new Set([
    'input_type',
    'duration_bucket',
    'features_used_count',
    'feature',
    'gate_mode'
  ]);

  const ALLOWED_PROPERTY_VALUES = Object.freeze({
    input_type: new Set(['microphone', 'upload', 'recording']),
    duration_bucket: new Set(['under_30_seconds', '30_to_59_seconds', '1_to_5_minutes', '5_minutes_plus']),
    feature: new Set(['poly', 'waveform', 'spectrum', 'metronome']),
    gate_mode: new Set(['profile', 'manual'])
  });

  const queue = [];
  const enabled = Boolean(CONFIG.websiteId)
    && CONFIG.productionHosts.includes(window.location.hostname);

  function sanitizeProperties(properties) {
    if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return undefined;
    const safe = {};
    Object.entries(properties).forEach(([key, value]) => {
      if (!ALLOWED_PROPERTIES.has(key)) return;
      if (typeof value === 'string' && ALLOWED_PROPERTY_VALUES[key]?.has(value)) safe[key] = value;
      else if (key === 'features_used_count' && typeof value === 'number' && Number.isFinite(value)) safe[key] = Math.max(0, Math.min(5, Math.round(value)));
    });
    return Object.keys(safe).length ? safe : undefined;
  }

  function send(name, properties) {
    if (typeof window.umami?.track !== 'function') return false;
    try {
      const safeProperties = sanitizeProperties(properties);
      if (safeProperties) window.umami.track(name, safeProperties);
      else window.umami.track(name);
    } catch (_) {
      // Analytics must never interrupt audio, recording, or UI behavior.
    }
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
    const suppliedProperties = properties && typeof properties === 'object' && !Array.isArray(properties) && Object.keys(properties).length > 0;
    const safeProperties = sanitizeProperties(properties);
    if (suppliedProperties && !safeProperties) return;
    if (!send(name, safeProperties) && queue.length < 100) queue.push([name, safeProperties]);
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
