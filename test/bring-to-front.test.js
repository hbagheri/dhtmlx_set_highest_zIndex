import { test } from 'node:test';
import assert  from 'node:assert/strict';

import {
    getZIndex,
    maxZIndex,
    bringToFront,
} from '../src/bring-to-front.js';

// ----- tiny DOM stub --------------------------------------------------------
// Just enough surface for the module: { style: { zIndex }, nodeType, ... }
// plus a scope object with querySelectorAll('*') and class selectors.

function makeEl({ zIndex = null, classes = [] } = {}) {
    return {
        nodeType: 1,
        _classes: classes,
        style: { zIndex: zIndex == null ? '' : String(zIndex) },
    };
}

function makeScope(elements) {
    return {
        querySelectorAll(selector) {
            if (selector === '*') return elements;
            if (selector.startsWith('.')) {
                const cls = selector.slice(1);
                return elements.filter(e => e._classes?.includes(cls));
            }
            return [];
        },
    };
}

// ----- getZIndex -----------------------------------------------------------

test('getZIndex: returns 0 for null/undefined', () => {
    assert.equal(getZIndex(null),      0);
    assert.equal(getZIndex(undefined), 0);
});

test('getZIndex: returns 0 for empty/auto inline style', () => {
    assert.equal(getZIndex(makeEl({ zIndex: '' })),     0);
    assert.equal(getZIndex(makeEl({ zIndex: 'auto' })), 0);
});

test('getZIndex: returns parsed integer for numeric inline', () => {
    assert.equal(getZIndex(makeEl({ zIndex: 100 })),    100);
    assert.equal(getZIndex(makeEl({ zIndex: '1500' })), 1500);
    assert.equal(getZIndex(makeEl({ zIndex: -5 })),     -5);
});

// ----- maxZIndex -----------------------------------------------------------

test('maxZIndex: empty iterable -> 0', () => {
    assert.equal(maxZIndex([]), 0);
});

test('maxZIndex: ignores non-numeric values', () => {
    const els = [
        makeEl({ zIndex: 'auto' }),
        makeEl({ zIndex: '' }),
        makeEl({ zIndex: 42 }),
    ];
    assert.equal(maxZIndex(els), 42);
});

test('maxZIndex: returns the highest', () => {
    const els = [makeEl({ zIndex: 10 }), makeEl({ zIndex: 999 }), makeEl({ zIndex: 50 })];
    assert.equal(maxZIndex(els), 999);
});

// ----- bringToFront --------------------------------------------------------

test('bringToFront: no target found -> null', () => {
    const scope = makeScope([makeEl({ zIndex: 5 })]);
    assert.equal(bringToFront('.missing', scope), null);
});

test('bringToFront: bumps target to max + 1', () => {
    const target = makeEl({ classes: ['dhtmlx_window_active'], zIndex: 100 });
    const other  = makeEl({ zIndex: 500 });
    const scope  = makeScope([target, other]);

    const z = bringToFront('.dhtmlx_window_active', scope);
    assert.equal(z, 501);
    assert.equal(target.style.zIndex, '501');
});

test('bringToFront: works when target has no inline z-index', () => {
    const target = makeEl({ classes: ['dhtmlx_window_active'] }); // no z-index
    const other  = makeEl({ zIndex: 2000 });
    const scope  = makeScope([target, other]);

    const z = bringToFront('.dhtmlx_window_active', scope);
    assert.equal(z, 2001);
    assert.equal(target.style.zIndex, '2001');
});

test('bringToFront: updates ALL matching targets to the same z-index', () => {
    const t1 = makeEl({ classes: ['dhtmlx_window_active'] });
    const t2 = makeEl({ classes: ['dhtmlx_window_active'] });
    const other = makeEl({ zIndex: 100 });
    const scope = makeScope([t1, t2, other]);

    const z = bringToFront('.dhtmlx_window_active', scope);
    assert.equal(z, 101);
    assert.equal(t1.style.zIndex, '101');
    assert.equal(t2.style.zIndex, '101');
});

test('bringToFront: accepts a direct element instead of selector', () => {
    const target = makeEl({ zIndex: 1 });
    const other  = makeEl({ zIndex: 50 });
    const scope  = makeScope([target, other]);

    const z = bringToFront(target, scope);
    assert.equal(z, 51);
    assert.equal(target.style.zIndex, '51');
});

test('bringToFront: accepts an array of elements', () => {
    const a = makeEl({ zIndex: 1 });
    const b = makeEl({ zIndex: 2 });
    const c = makeEl({ zIndex: 200 });
    const scope = makeScope([a, b, c]);

    const z = bringToFront([a, b], scope);
    assert.equal(z, 201);
    assert.equal(a.style.zIndex, '201');
    assert.equal(b.style.zIndex, '201');
});

test('bringToFront: empty page -> z = 1', () => {
    const target = makeEl({ classes: ['dhtmlx_window_active'] });
    const scope  = makeScope([target]);

    const z = bringToFront('.dhtmlx_window_active', scope);
    assert.equal(z, 1);
    assert.equal(target.style.zIndex, '1');
});

test('bringToFront: missing scope and no document -> null', () => {
    assert.equal(bringToFront('.x', undefined), null);
});
