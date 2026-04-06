import { chromium } from 'playwright'

const TLDRAW_URL = 'https://www.tldraw.com/f/fIP2-VyEU3mIhtk0BF1IM'

async function run() {
  const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  await page.goto(TLDRAW_URL, { timeout: 30000 })
  await page.waitForTimeout(4000)
  await page.mouse.click(700, 450)
  await page.waitForTimeout(500)

  const probe = await page.evaluate(() => {
    function findEditor() {
      for (const el of document.querySelectorAll('*')) {
        const key = Object.keys(el).find(k => k.startsWith('__reactFiber'))
        if (!key) continue
        let node = el[key]
        for (let i = 0; i < 300; i++) {
          if (!node) break
          try {
            if (node.memoizedProps?.editor?.createShape) return node.memoizedProps.editor
          } catch (e) { /* */ }
          node = node.return
        }
      }
      return null
    }

    const editor = findEditor()
    if (!editor) return { error: 'No editor' }

    // Get default props for various shape types
    const result = { found: true }
    for (const type of ['note', 'geo', 'text', 'frame']) {
      try {
        const util = editor.getShapeUtil(type)
        result[type] = util?.getDefaultProps?.() || 'no getDefaultProps'
      } catch(e) {
        result[type + '_err'] = e.message
      }
    }

    // Try creating one simple note to see what error we get
    try {
      editor.createShape({
        id: 'shape:test1',
        type: 'note',
        x: 0, y: 0,
        props: { richText: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }] } }
      })
      result.noteCreate = 'SUCCESS'
    } catch(e) {
      result.noteCreate = 'FAIL: ' + e.message
    }

    // Try creating one geo shape
    try {
      const geoProps = editor.getShapeUtil('geo').getDefaultProps()
      const textKey = 'richText' in geoProps ? 'richText' : 'text'
      const textVal = textKey === 'richText'
        ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test geo' }] }] }
        : 'test geo'

      editor.createShape({
        id: 'shape:test2',
        type: 'geo',
        x: 200, y: 0,
        props: { ...geoProps, [textKey]: textVal, w: 300, h: 200, color: 'blue', fill: 'semi' }
      })
      result.geoCreate = 'SUCCESS'
    } catch(e) {
      result.geoCreate = 'FAIL: ' + e.message
    }

    return result
  })

  console.log(JSON.stringify(probe, null, 2))
  await page.waitForTimeout(3000)
  await page.screenshot({ path: '/tmp/tldraw-probe.png' })
  await browser.close()
}

run().catch(console.error)
