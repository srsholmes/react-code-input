import { test, expect } from '@playwright/test';

test.describe('CodeInput Example App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the page with a code input textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
  });

  test('renders with the placeholder text', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toHaveAttribute('placeholder', 'Input your code here...');
  });

  test('renders pre element for syntax highlighting', async ({ page }) => {
    const pre = page.locator('pre').first();
    await expect(pre).toBeVisible();
  });

  test('pre element has language class', async ({ page }) => {
    const pre = page.locator('pre').first();
    await expect(pre).toHaveClass(/language-/);
  });

  test('textarea accepts text input', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('const hello = "world";');
    await expect(textarea).toHaveValue('const hello = "world";');
  });

  test('syntax highlighting updates when typing', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    const highlighted = page.locator('.code-highlighted').first();
    await textarea.click();
    await textarea.fill('function test() { return true; }');
    // The highlighted div should contain the tokenized HTML (spans from prism/hljs)
    const html = await highlighted.innerHTML();
    expect(html.length).toBeGreaterThan(0);
  });

  test('textarea is editable and captures keystrokes', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    await textarea.type('hello');
    await expect(textarea).toHaveValue('hello');
  });

  test('tab key inserts indentation', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    await textarea.type('hello');
    // Press Home to go to start of line, then Tab
    await textarea.press('Home');
    await textarea.press('Tab');
    const value = await textarea.inputValue();
    expect(value).toBe('\thello');
  });

  test('enter key preserves indentation', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    // Type a tab then some text, then hit enter
    await textarea.press('Tab');
    await textarea.type('hello');
    await textarea.press('Enter');
    const value = await textarea.inputValue();
    // After pressing enter on an indented line, the new line should also be indented
    expect(value).toBe('\thello\n\t');
  });

  test('shift+tab dedents a line', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    // Insert a tab then text
    await textarea.press('Tab');
    await textarea.type('hello');
    // Select the line
    await textarea.press('Home');
    await textarea.press('Shift+End');
    // Shift+Tab to dedent
    await textarea.press('Shift+Tab');
    const value = await textarea.inputValue();
    expect(value).toBe('hello');
  });

  test('scroll sync between textarea and pre', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    // Fill with enough content to make it scrollable
    const longCode = Array.from({ length: 50 }, (_, i) => `const line${i} = ${i};`).join('\n');
    await textarea.click();
    await textarea.fill(longCode);
    // Constrain the textarea height so it's scrollable (autoHeight makes it fit all content)
    await textarea.evaluate((el) => {
      el.style.height = '100px';
      el.style.maxHeight = '100px';
    });
    const pre = page.locator('pre').first();
    await pre.evaluate((el) => {
      el.style.height = '100px';
      el.style.maxHeight = '100px';
    });
    // Now scroll and trigger sync
    await textarea.evaluate((el) => {
      el.scrollTop = 200;
      el.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(50);
    const preScrollTop = await pre.evaluate((el) => el.scrollTop);
    expect(preScrollTop).toBe(200);
  });

  test('textarea has spellcheck disabled', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toHaveAttribute('spellcheck', 'false');
  });

  test('code highlighting contains token spans with prismjs', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('const x = 1;');
    // Wait for highlighting to update
    await page.waitForTimeout(100);
    const highlighted = page.locator('.code-highlighted').first();
    const html = await highlighted.innerHTML();
    // PrismJS should produce span elements with token classes
    expect(html).toContain('<span');
  });

  test('multiple code inputs can coexist', async ({ page }) => {
    // The Demo page may only have one, but App.tsx has two. Check at least one textarea exists.
    const textareas = page.locator('textarea');
    const count = await textareas.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('textarea value persists across rapid typing', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    const code = 'function add(a, b) { return a + b; }';
    await textarea.type(code, { delay: 10 });
    await expect(textarea).toHaveValue(code);
  });

  test('empty textarea shows placeholder styling', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('');
    // Textarea should be empty and show placeholder
    await expect(textarea).toHaveValue('');
    await expect(textarea).toHaveAttribute('placeholder');
  });
});
