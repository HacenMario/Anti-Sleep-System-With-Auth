# Anti Sleep System — V2.1

## What's new

- Arabic / French / English interface with persistent language selection.
- Automatic RTL for Arabic and LTR for French/English.
- Localized alerts, authentication UI, settings, dashboard, history, status messages and dynamic notifications.
- Adaptive EAR calibration retained and improved.
- Dual-eye EAR retained.
- PERCLOS retained as a rolling 60-second metric.
- Multi-factor drowsiness risk engine using EAR, PERCLOS, closure duration, head pose, blink rate and face quality.
- Smoothed risk score (EMA) to reduce sudden score spikes.
- Anti-false-alarm state machine requiring sustained evidence before the alarm is triggered.
- Alarm recovery hysteresis so a brief eye opening does not immediately cancel a critical alarm.
- Poor face tracking / extreme head angle reduce risk confidence instead of generating false danger.
- Service Worker cache bumped and `i18n.js` added to the offline shell.

## Language selector

The selector is available in the top toolbar:

- AR — العربية
- FR — Français
- EN — English

The selected language is stored locally in `antiSleepLanguage`.

## Privacy

Camera processing remains local. Only aggregated session summaries are eligible for cloud synchronization when the user is signed in.
