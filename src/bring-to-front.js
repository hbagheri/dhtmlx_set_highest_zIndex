// bring-to-front -- raise a DHTMLX (or any) modal above everything else
// on the page by setting its inline z-index to one above the current max.
//
// The original problem: a Bootstrap navbar (z-index: 1030) sits above
// DHTMLX's modal window (z-index ~1000). DHTMLX writes z-index inline,
// not via a class, so a static CSS override doesn't always win.
//
//   import { bringToFront } from './src/bring-to-front.js';
//
//   bringToFront();                              // default .dhtmlx_window_active
//   bringToFront('.my-modal');                   // any selector
//   bringToFront(element);                       // a single Element
//   bringToFront(['#a', '#b']);                  // a list
//   bringToFront('.my-modal', someContainer);    // restrict scope
//
// @author Hassan Bagheri <bagheri.h@gmail.com>

/**
 * Read the effective numeric z-index of an element.
 * Falls back to computed style if no inline value is set.
 * Returns 0 when nothing usable is found (treats `auto`/missing as 0).
 *
 * @param {Element|{style:{zIndex:string}}} el
 * @returns {number}
 */
export function getZIndex(el) {
    if (!el) return 0;
    const inline = el.style?.zIndex;
    if (inline) {
        const n = parseInt(inline, 10);
        if (Number.isFinite(n)) return n;
    }
    if (typeof globalThis.getComputedStyle === 'function' && el.nodeType === 1) {
        const n = parseInt(globalThis.getComputedStyle(el).zIndex, 10);
        if (Number.isFinite(n)) return n;
    }
    return 0;
}

/**
 * The maximum z-index across an iterable of elements. Returns 0 if empty
 * or none have a usable z-index.
 *
 * @param {Iterable<Element>} elements
 * @returns {number}
 */
export function maxZIndex(elements) {
    let max = 0;
    for (const el of elements) {
        const z = getZIndex(el);
        if (z > max) max = z;
    }
    return max;
}

/**
 * Bring the target element(s) to the front by setting their inline
 * z-index one above the highest currently in scope.
 *
 * @param {string|Element|Iterable<Element>} target  Selector, element,
 *     or list of elements. Defaults to `.dhtmlx_window_active`.
 * @param {Document|Element} [scope] Where to look for both the target
 *     (when `target` is a selector) and the z-index ceiling. Defaults
 *     to `document`.
 * @returns {number|null} The new z-index applied, or `null` if no
 *     target was found.
 */
export function bringToFront(target = '.dhtmlx_window_active', scope) {
    if (!scope && typeof document !== 'undefined') scope = document;
    if (!scope) return null;

    const targets = resolveTargets(target, scope);
    if (!targets.length) return null;

    const candidates = scope.querySelectorAll('*');
    const topZ = maxZIndex(candidates) + 1;
    for (const el of targets) el.style.zIndex = String(topZ);
    return topZ;
}

function resolveTargets(target, scope) {
    if (typeof target === 'string') {
        return Array.from(scope.querySelectorAll(target));
    }
    if (target && typeof target === 'object' && 'style' in target) {
        return [target];
    }
    if (target && typeof target[Symbol.iterator] === 'function') {
        return Array.from(target);
    }
    return [];
}

// Backwards-compatible alias matching the old global function name.
export const setIndex = () => bringToFront();

export default bringToFront;
