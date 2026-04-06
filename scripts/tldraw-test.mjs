import { chromium } from 'playwright'

const TLDRAW_URL = 'https://www.tldraw.com/f/fIP2-VyEU3mIhtk0BF1IM'

async function run() {
  const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  console.log('Navigating...')
  await page.goto(TLDRAW_URL, { timeout: 30000 })
  await page.waitForTimeout(5000)

  await page.screenshot({ path: '/tmp/tldraw-noauth.png' })

  // Check what we see
  const title = await page.title()
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500))
  console.log('Title:', title)
  console.log('Body:', bodyText)

  // Check if there's a sign-in wall
  const hasSignIn = await page.locator('text=Sign in').count()
  console.log('Sign in button count:', hasSignIn)

  // Check if canvas is visible
  const hasCanvas = await page.locator('.tl-canvas, canvas, [data-testid="canvas"]').count()
  console.log('Canvas elements:', hasCanvas)

  await page.waitForTimeout(5000)
  await browser.close()
}

run().catch(console.error)
