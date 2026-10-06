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
