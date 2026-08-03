import { readFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE_URL = process.env.CHECK_BASE_URL || 'http://localhost:8123';
const SCREENSHOT_DIR = '.check-screenshots';
const BREAKPOINTS = [
  { name: '1024', width: 1024, height: 900 },
  { name: '768', width: 768, height: 900 },
  { name: '480', width: 480, height: 900 },
];

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

let failed = false;
function fail(msg) {
  failed = true;
  console.error(`✗ ${msg}`);
}
function ok(msg) {
  console.log(`✓ ${msg}`);
}

function checkTagBalance() {
  let html = readFileSync('index.html', 'utf8');

  // Strip comments and the contents of script blocks (JSON-LD / JS aren't
  // markup and can legitimately contain bare < / > that would confuse a
  // naive tag scanner).
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');

  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  const stack = [];
  let match;
  let mismatches = 0;

  while ((match = tagRe.exec(html)) !== null) {
    const [full, rawName, selfClosingSlash] = match;
    const name = rawName.toLowerCase();
    const isClosing = full[1] === '/';
    const isSelfClosing = selfClosingSlash === '/' || full.endsWith('/>');

    if (isClosing) {
      if (VOID_ELEMENTS.has(name)) continue;
      if (stack.length === 0 || stack[stack.length - 1] !== name) {
        const line = html.slice(0, match.index).split('\n').length;
        fail(`tag mismatch: found </${name}> at line ${line}, expected </${stack[stack.length - 1] ?? '(nothing open)'}>`);
        mismatches++;
        // best-effort recovery: pop matching tag if it's anywhere in the stack
        const idx = stack.lastIndexOf(name);
        if (idx !== -1) stack.length = idx;
      } else {
        stack.pop();
      }
    } else if (!isSelfClosing && !VOID_ELEMENTS.has(name)) {
      stack.push(name);
    }
  }

  if (stack.length > 0) {
    fail(`unclosed tag(s) at end of file: <${stack.join('>, <')}>`);
    mismatches++;
  }

  if (mismatches === 0) ok('index.html tag balance');
}

async function checkPageAndScreenshot() {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const browser = await chromium.launch();

  for (const bp of BREAKPOINTS) {
    const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));
    page.on('response', (res) => {
      if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
    });

    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

    // Scroll-reveal (.reveal -> .is-visible via IntersectionObserver, see
    // js/main.js) only fires as elements actually cross into the viewport.
    // A screenshot taken right after an instant jump-scroll races that
    // observer and captures still-hidden (opacity: 0) sections. Step down
    // the page like a real user would first so everything has revealed by
    // the time we screenshot.
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < scrollHeight; y += bp.height) {
      await page.evaluate((yPos) => window.scrollTo(0, yPos), y);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/${bp.name}.png`, fullPage: true });
    await page.close();

    if (consoleErrors.length > 0) {
      fail(`console errors at ${bp.width}px: ${consoleErrors.join(' | ')}`);
    } else {
      ok(`no console errors at ${bp.width}px`);
    }

    if (failedRequests.length > 0) {
      fail(`failed network requests at ${bp.width}px: ${failedRequests.join(' | ')}`);
    } else {
      ok(`no failed network requests at ${bp.width}px`);
    }

    ok(`screenshot saved: ${SCREENSHOT_DIR}/${bp.name}.png`);
  }

  await browser.close();
}

checkTagBalance();
await checkPageAndScreenshot();

if (failed) {
  console.error('\ncheck.sh: FAILED');
  process.exit(1);
} else {
  console.log('\ncheck.sh: all checks passed');
}
