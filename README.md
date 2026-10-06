# Wumpus Builder — three editions

New HyperWumpus workout and food tracker, with a personal edition, partnership demo, and public pilot preview. All builds are under [wumpus-builder](wumpus-builder/).

## Live web pages

- [Choose an edition](https://hyperwumpus.github.io/wumpus-builder/)
- [Personal tracker](https://hyperwumpus.github.io/wumpus-builder/personal/)
- [Partnership demo](https://hyperwumpus.github.io/wumpus-builder/demo/)
- [Public preview](https://hyperwumpus.github.io/wumpus-builder/public/)
- [Pitch](https://hyperwumpus.github.io/wumpus-builder/demo/pitch.html)

The static web copies in wumpus-builder/web/ are deployed under a new folder on the existing HyperWumpus Pages site. Barcode lookup there calls Open Food Facts directly; local editions retain the Python proxy. Localhost records require export/restore to transfer to the hosted origin. These pages are publicly accessible, including the personal-edition shell; private tracking data is not hosted.

| Build | Start command | Local URL |
| --- | --- | --- |
| Personal | `python wumpus-builder/personal/server.py --port 8081` | http://127.0.0.1:8081/ |
| Demo | `python wumpus-builder/demo/server.py --port 8082` | http://127.0.0.1:8082/ |
| Public preview | `python wumpus-builder/public/server.py --port 8083` | http://127.0.0.1:8083/ |

On Windows, each edition also includes Start-Builder.cmd. Python 3.9+ is required. The demo pitch is at http://127.0.0.1:8082/pitch.html .

Personal starts empty and supports reviewed JSON workout imports. Demo contains explicitly fictional progress, the internal partnership pitch, ambassador store/code links, and ordinary official product-detail links. Public starts empty with free core tracking and proposed sponsored/premium features. Each edition keeps separate browser records.

Working: eight-week BAMF logging, repeat meals, editable portions, reusable foods, barcode/manual-label entry, local progress photos, strength history, unit conversion, calendar reminder export, backup/restore, and archive/new run. No payments, accounts, cloud sync, PDF extraction, or background notifications are implemented. Camera scanning and install behavior depend on browser support and HTTPS. No official Bucked Up partnership is asserted.

Functional checks: from the repository root, run `node wumpus-builder/check-builder.cjs`. See [validation limits](wumpus-builder/VALIDATION.txt). No full browser visual/mobile QA has been completed. Hosting the GitHub source is not a live deployment.

Suggested commercial path: partner-funded free participant access; negotiate software/pilot fees and content deliverables separately from eligible ambassador commissions. Product-specific referral links must come from the ambassador app; ordinary product-detail links are not automatically attributed.

Only supplied branding assets and source files are included. No personal workout logs, progress photos, private account screenshots, credentials, or source PDFs are committed.

The previous working LOCK//IN bootcamp snapshot remains below and in the root app/ folder. The separate original hyperwumpus/lockin-fitness repository is unchanged.

---

# LOCK//IN Bootcamp Tracker

A separate snapshot of the working LOCK//IN tracker, with the eight-week BAMF Builder schedule, simple repeatable meals, nutrition logging, and workout history.

## Run locally

Requires Python 3.9 or later. No third-party Python packages or API keys.

```sh
python server.py
```

Open http://127.0.0.1:8080/ and leave the server running.
Windows users can double-click Start-Lockin.cmd if Python is on PATH.

This repository contains source code. Uploading it to GitHub does not by itself publish a live website. Food lookup uses the included Python server.

## Ready to track

- Eight-week BAMF Builder schedule with weights, reps/time, completed sets and training history.
- Explicit markers for prescriptions left blank in the supplied workout reference.
- Simple repeating meals: shake and banana, chicken/rice/frozen vegetables for lunch and dinner, yogurt and fruit.
- Swaps for tilapia, tuna/corn/mayo, frozen meal plus cooked chicken, BUILT Puff and watermelon.
- Calories and macros, barcode lookup through Open Food Facts, optional camera scanning where supported.
- Reusable saved food portions, generic estimates clearly marked, and missing bar-label values requested before logging.
- XP, ranks, daily quests, weight history and the original content feed and penalty-vault feature.
- JSON backup export and restore.

## Data

Records are stored in your browser, not on GitHub or the Python server. There are no user accounts, cloud sync or automatic phone reminders. Each browser/device has its own data. Export a backup before clearing browser storage.

Do not commit personal tracking backups to this repository.

## Checks

The app logic checks cover workout targets, set fields, food totals, saved labels, session persistence, weight-unit conversion, daily rollover, duplicate XP protection and backup restore.

```sh
node tests/check-ready.cjs
```

These checks use a small DOM test double; they are not visual browser tests.

## Sources

Based on the creator's original [LOCK//IN Fitness](https://github.com/hyperwumpus/lockin-fitness). This separate project preserves the working version before the Wumpus Builder redesign.

Workouts were transcribed from the user-supplied BAMF Builder reference. This is an independent personal companion, not an official Bucked Up product.

Food estimates are generic and should be checked against your own packages. Open Food Facts lookup data is attributed in the interface. The meal menu is a configurable starter; it does not establish a current calorie prescription.
