# Wumpus Builder — Personal

Fresh vanilla HTML/CSS/JS app; it does not use the previous LOCK//IN UI, XP, penalties, or social feed. The previously transcribed BAMF data and familiar-food estimates are retained. Artwork supplied by HyperWumpus.

## Open

Double-click Start-Builder.cmd, leave its terminal running, then visit http://127.0.0.1:8081/ . Or run `python server.py --port 8081`. Python 3.9+ is required.

## Edition

Starts with empty private records. Reviewed JSON workout import is available. Meals match the user’s repeatable preferences.

## Working features

- Eight weeks of BAMF sets/reps, logging rows, completion and a rest timer.
- Missing PDF prescriptions remain explicitly unspecified.
- Editable meal portions, reusable foods and label entry; treats are ordinary loggable portions.
- Barcode lookup via Open Food Facts, manual fallback and native camera scanning on supported secure browsers.
- Strength records, weight check-ins, compressed local progress photos, session history.
- JSON backup/validated restore, CSV workout export, archive/new challenge.
- Downloadable calendar reminder; import the .ics file into your calendar. No background app notifications.
- Responsive layout and offline app shell after a successful initial load. Barcode lookup needs internet.

## Data and deployment

Data is in localStorage under `wumpus-builder-personal-v1`. Editions have different keys and default ports. Photos use browser storage; export regular backups. Clearing site data or changing origin/device loses access to local records unless a backup is restored. Nothing is automatically uploaded.

This server is a local development server, not production hosting. For phone use, the site needs HTTPS hosting (or a local-network server without camera/install guarantees). Installability and camera scanning depend on browser support. Native iOS/Android binaries are not supplied.

Before public branded release, confirm permission to distribute program content and use concept artwork. No official partnership is asserted. The private ambassador-account screenshots are excluded.

Before collecting payment: production authentication, server-side entitlements, payment webhooks, account recovery, privacy/support policy, and program licensing are required. A frontend toggle is not a paywall. No checkout or visitor analytics is active.

Food data: https://world.openfoodfacts.org (Open Database License). Generic nutrition estimates are examples; labels and actual portions take priority. Configure BUILDER_CONTACT for deployment requests to their API. Cross-device sync and reviewed PDF extraction remain proposed.
