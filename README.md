# bring-to-front

[![tests](https://github.com/hbagheri/dhtmlx_set_highest_zIndex/actions/workflows/test.yml/badge.svg)](https://github.com/hbagheri/dhtmlx_set_highest_zIndex/actions/workflows/test.yml)

A tiny dependency-free utility (~50 lines) that bumps an element's inline
`z-index` to one above everything else on the page.

Originally built to work around a DHTMLX modal getting hidden behind a
Bootstrap navbar, but it's not actually tied to DHTMLX — it works on any
element.

```html
<script type="module">
    import { bringToFront } from './src/bring-to-front.js';

    bringToFront();                       // default: .dhtmlx_window_active
    bringToFront('.my-modal');            // any selector
    bringToFront(document.getElementById('alert'));   // any element
    bringToFront(['.toast', '.lightbox']); // multiple selectors / elements
</script>
```

See `index.html` for a self-contained demo (a fake DHTMLX modal
intentionally hidden behind a fake Bootstrap navbar).

## Why this exists

DHTMLX writes the `z-index` of its active window as an inline `style`
attribute. If something else on the page (a sticky navbar, a fixed
toolbar) has a higher `z-index`, the modal renders behind it. The fix is
to raise the modal's `z-index` above the current maximum on the page.

The original version did this with a jQuery `.attr('style')` string-replace
that only worked if the style attribute already contained `z-index:`. This
rewrite uses `element.style.zIndex` directly, has no jQuery dependency,
and works on any element type.

## API

### `bringToFront(target?, scope?)`

| Param | Type | Default | |
| --- | --- | --- | --- |
| `target` | `string \| Element \| Iterable<Element>` | `'.dhtmlx_window_active'` | Selector, element, or list of elements to raise. |
| `scope` | `Document \| Element` | `document` | Where to look for the target (when it's a selector) and where to scan for the current max z-index. |

**Returns** the new z-index applied, or `null` if no target was found.

### `getZIndex(el)`

Returns the effective numeric z-index of an element (inline first, then
computed style). `auto`, missing or non-numeric → `0`.

### `maxZIndex(elements)`

Highest z-index across an iterable of elements. Returns `0` for an empty
iterable.

### Legacy alias

```js
import { setIndex } from 'bring-to-front';
setIndex();  // same as bringToFront() with defaults
```

## Tests

```bash
npm test
```

Runs 14 unit tests via Node's built-in test runner. The tests use a tiny
DOM stub, so no `jsdom` install is required.

## Demo locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Project layout

```
src/bring-to-front.js          # the module
index.html                     # standalone demo
test/bring-to-front.test.js    # tests
package.json                   # type: module
```

## Migrating from 1.x

The original API was a global `setIndex()` function defined in
`setIndex.js`. Equivalent calls:

| 1.x | 2.x |
| --- | --- |
| `setIndex()` | `bringToFront()` (or `setIndex()` alias) |
| (no other API) | `bringToFront(selectorOrEl, scope)`, `getZIndex(el)`, `maxZIndex(els)` |

The new code has no jQuery dependency.

## License

MIT — see `LICENSE`.
