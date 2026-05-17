# Changelog

All notable changes to this project are documented here.
The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and this project follows [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-05-17

### Rewritten as a dependency-free ES module

### Added

- `src/bring-to-front.js` -- ES module exporting `bringToFront`,
  `getZIndex`, `maxZIndex`, plus a `setIndex` legacy alias.
- `test/bring-to-front.test.js` -- 14 unit tests covering the helpers
  and the public function (Node's built-in test runner + tiny DOM stub).
- `package.json` (`type: module`).
- Interactive demo `index.html` (fake Bootstrap navbar vs fake DHTMLX
  modal, with a "Bring to front" button).
- Real `README.md` with API docs, migration notes, "why this exists".

### Fixed

- Implicit globals (`index_highest`, `style`) leaking onto `window`.
- Fragile regex string-replace on the inline `style` attribute that
  silently did nothing if the target had no `z-index:` already set.
- Only the first matching `.dhtmlx_window_active` was being updated.
- `>=` vs `>` in the running-max loop (harmless but illogical).
- README premise: claimed `$('.dhtmlx_window_active').css('z-index', n)`
  doesn't work. It does; the original workaround was unnecessary.
- Inline `@author Hans Burgman` replaced with the actual author.

### Removed

- jQuery dependency.
- `setIndex.js` (replaced by `src/bring-to-front.js`).

## [1.x] - legacy

Initial jQuery snippet. Source preserved on the GitLab origin.
