import test from 'node:test';
import assert from 'node:assert/strict';
import {scrollThemeProgress, scrollThemeColors} from '../src/lib/scroll-theme.ts';
test('holds dark through 35%, interpolates, and holds light after 65%', () => {
  assert.equal(scrollThemeProgress(350, 1100, 100), 0);
  assert.ok(Math.abs(scrollThemeProgress(500, 1100, 100) - 0.5) < 1e-10);
  assert.equal(scrollThemeProgress(650, 1100, 100), 1);
  assert.equal(scrollThemeProgress(1000, 1100, 100), 1);
});
test('uses the available scroll range on different viewport sizes and reverses without history', () => {
  const expected = scrollThemeProgress(450, 1100, 100);
  assert.equal(scrollThemeProgress(2250, 5500, 500), expected);
  assert.equal(scrollThemeProgress(350, 1100, 100), 0);
  assert.equal(scrollThemeProgress(-20, 1100, 100), 0);
  assert.equal(scrollThemeProgress(0, 100, 100), 0);
});
test('reduced motion switches once at the midpoint', () => {
  assert.equal(scrollThemeProgress(499, 1100, 100, true), 0);
  assert.equal(scrollThemeProgress(500, 1100, 100, true), 1);
});
test('updates solid palette colors and guards the equal-luminance crossover', () => {
  assert.equal(scrollThemeColors(0)['--theme-bg'], 'rgb(8 8 8)');
  assert.equal(scrollThemeColors(1)['--theme-bg'], 'rgb(255 255 255)');
  assert.equal(scrollThemeColors(1)['--theme-text'], 'rgb(20 20 20)');
  assert.equal(scrollThemeColors(0)['--theme-outline-width'], '0.000px');
  assert.equal(scrollThemeColors(1)['--theme-outline-width'], '0.000px');
  assert.ok(parseFloat(scrollThemeColors(0.5)['--theme-outline-width']) > 0);
  for (const value of Object.values(scrollThemeColors(0.5))) assert.ok(!value.includes('gradient'));
});
test('Shop uses its own 30–65% transition without changing Home timing', () => {
  const shop = y => scrollThemeProgress(y, 1100, 100, false, 0.30, 0.65);
  assert.equal(shop(300), 0);
  assert.ok(Math.abs(shop(475) - 0.5) < 1e-10);
  assert.equal(shop(650), 1);
  assert.ok(shop(350) > 0);
  assert.equal(scrollThemeProgress(350, 1100, 100), 0);
  assert.equal(shop(1000), 1);
  assert.equal(shop(0), 0);
  assert.equal(scrollThemeProgress(2375, 5500, 500, false, 0.30, 0.65), shop(475));
});
test('Shop shares the reduced-motion midpoint state change', () => {
  assert.equal(scrollThemeProgress(499, 1100, 100, true, 0.30, 0.65), 0);
  assert.equal(scrollThemeProgress(500, 1100, 100, true, 0.30, 0.65), 1);
});
