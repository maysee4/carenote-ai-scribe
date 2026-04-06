import { chromium } from 'playwright'
import path from 'path'
import os from 'os'

const TLDRAW_URL = 'https://www.tldraw.com/f/fIP2-VyEU3mIhtk0BF1IM'
const BRAVE_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BRAVE_PROFILE = '/tmp/chrome-tldraw-profile'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function toRichText(text) {
  return {
    type: 'doc',
    content: text.split('\n').map(line => ({
      type: 'paragraph',
      content: line ? [{ type: 'text', text: line }] : [],
    })),
  }
}

const CARDS = [
  { x: 0,    y: 0,    w: 1200, h: 120,  color: 'black',      fill: 'solid', text: '🔥  CARENOTE AI — DISCOVERY + DEMO CALL SCRIPT  🔥\nSales playbook for your first NDIS provider conversations' },
  { x: 0,    y: 180,  w: 580,  h: 660,  color: 'green',      fill: 'semi',  text: '🧠  1. DISCOVERY CALL  (15–20 min)\n\nOPEN + FRAME:\n"Before I show you anything — I want to ask a few questions about how you\'re handling documentation."\n"If we can genuinely help — I\'ll show you what we\'ve built."\n"Sound fair?"  ← Wait for yes.\n\nCONTEXT QUESTIONS (let them talk 70%):\n• How do staff currently do shift notes & reports?\n• Typed, handwritten, or voice notes?\n• How long per report on average?\n\nFIND THE PAIN:\n• Does documentation take time away from actual care?\n• Any reports not up to NDIS compliance standard?\n• How often do reports need to be rewritten?\n• Who fixes them — managers?' },
  { x: 620,  y: 180,  w: 580,  h: 660,  color: 'light-blue', fill: 'semi',  text: '📊  QUANTIFY THE PROBLEM\n\nKEY QUESTION:\n"How many hours per week across your whole team is just documentation?"\n→ Wait. Let them think.\n→ THIS is where deals are made.\n\nREFRAME AS EXPERT:\n"Yeah — we see this a lot."\n"Most providers don\'t have a care problem."\n"They have a documentation bottleneck."\n"Staff are doing admin instead of care."\n\nPRE-CLOSE BEFORE DEMO:\n"If staff could just speak or write rough notes…"\n"…and it turned into fully completed, audit-ready NDIS forms automatically…"\n"Would that genuinely help your team?"\n→ Wait for yes.' },
  { x: 0,    y: 900,  w: 580,  h: 700,  color: 'violet',     fill: 'semi',  text: '🔟  DEMO FLOW  (short + clean)\n\nTRANSITION:\n"Got it — that\'s really helpful."\n"Let me show you what we\'ve been building with CareNote AI."\n\nSHOW IN ORDER:\n→ Voice → report (live)\n→ Incident form auto-completed\n→ Structured NDIS output\n→ Dashboard\n\nCORE OFFER LINE:\n"We take any messy care notes, voice recordings, or incomplete forms…"\n"…and turn them into fully completed, audit-ready NDIS documentation — automatically."\n(pause)\n"Instead of staff spending 1–2 hours writing reports…"\n"It takes about 1–2 minutes."\n\nAFTER DEMO:\n"Your team doesn\'t need to worry about wording, structure, or compliance."\n"They just speak or jot rough notes — it becomes audit-ready documentation."' },
  { x: 620,  y: 900,  w: 580,  h: 700,  color: 'orange',     fill: 'semi',  text: '🧠  BETA PILOT OFFER\n\nHOW TO POSITION IT:\n"CareNote AI is currently in beta."\n"We\'re not rolling it out widely yet."\n"We\'re partnering with a small number of NDIS providers to test it in real environments."\n\nPILOT STRUCTURE (30 days):\n• 1 location\n• 5–10 support workers\n• Test documentation workflow end-to-end\n• Collect feedback → improve the system\n\nWHAT THEY GET:\n✓ Early access to AI documentation tools\n✓ Direct input into how the product is built\n✓ Reduced admin burden for their staff\n✓ Competitive advantage\n\nWHAT YOU GET:\n✓ First real user feedback\n✓ First NDIS case study\n✓ Real data to improve the product' },
  { x: 0,    y: 1660, w: 580,  h: 580,  color: 'red',        fill: 'semi',  text: '💰  PRICING  (beta stage)\n\nOPTION 1 — SAFEST:\nFree 30-day pilot\n→ then $2k–$3k/month depending on staff\n\nOPTION 2 — BETTER POSITIONING:\n$500–$1,000 pilot fee\n→ then $2k–$4k/month after\n\nHOW TO SAY IT:\n"Because it\'s still early stage, we\'re not rolling out publicly."\n"We\'re partnering with a small group to test it properly."\n"If the pilot saves your team time — we roll it across the org."\n\n🔥  THE GUARANTEE  (money line):\n"If it doesn\'t save your team at least 5 hours per week…"\n"We\'ll handle the documentation for you until it does."\n"Zero risk on your end."' },
  { x: 620,  y: 1660, w: 580,  h: 580,  color: 'green',      fill: 'semi',  text: '🧠  CLOSE THE CALL\n\nAUTHORITY STACK:\n"CareNote AI is just one system we\'ve built for NDIS providers."\n"Through Elevana AI — we design full AI systems around your workflows."\n"Anything admin-heavy, repetitive, or compliance-related — we can automate."\n\nCLOSE LINE:\n"If it genuinely removes the admin burden from your team…"\n"We can roll it out across your whole organisation."\n"But the first step is just testing it with a small group."\n\nFINAL CLOSE:\n"Would you be open to running a 30-day pilot with a few staff…"\n"…and seeing how much time it actually saves?"\n\n💥  OBJECTION HANDLER:\n"If staff are still manually writing reports…"\n"You\'re paying them to do admin instead of care."\n"What we\'re doing is giving that time back."' },
  { x: 0,    y: 2300, w: 1200, h: 400,  color: 'yellow',     fill: 'semi',  text: '🎯  THE REAL GOAL OF THIS CALL  —  NOT REVENUE  (yet)\n\n1️⃣  First real NDIS provider using CareNote AI in production\n2️⃣  Real feedback from actual support workers in the field\n3️⃣  Fix and sharpen the product with real data\n4️⃣  Create the FIRST CASE STUDY  →  selling becomes 10× easier after just 1 case study\n\nKEY LINE TO USE:\n"We\'re building this WITH providers — not for them."  ← Changes the whole dynamic.\n\nMINDSET: You are NOT selling software yet.\nYou\'re offering early access to an AI documentation system built specifically for NDIS providers.\nThat framing feels innovative — not risky. Once you have 1 case study: this is a $3k–$6k/month product.' },
]

async function run() {
  console.log('Launching Brave...')
  const browser = await chromium.launchPersistentContext(BRAVE_PROFILE, {
    headless: false,
    executablePath: BRAVE_PATH,
    args: ['--no-sandbox'],
    viewport: { width: 1440, height: 900 },
  })

  const page = await browser.newPage()
  await page.goto(TLDRAW_URL, { waitUntil: 'networkidle', timeout: 30000 })
  await sleep(4000)

  await page.mouse.click(700, 450)
  await sleep(500)

  // Clear canvas
  console.log('Clearing canvas...')
  await page.keyboard.press('Escape')
  await sleep(300)
  await page.keyboard.press('Meta+a')
  await sleep(600)
  await page.keyboard.press('Backspace')
  await sleep(1000)

  // Find editor and create shapes
  console.log('Creating shapes...')
  const result = await page.evaluate(async (cards) => {
    const log = []

    // Find editor via React fiber
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

    function toRichText(text) {
      return {
        type: 'doc',
        content: text.split('\n').map(line => ({
          type: 'paragraph',
          content: line ? [{ type: 'text', text: line }] : [],
        })),
      }
    }

    const editor = findEditor()
    if (!editor) return { error: 'Editor not found via fiber' }
    log.push('Editor found ✓')

    // Probe what geo shape props look like
    let defaultGeoProps = {}
    try {
      const util = editor.getShapeUtil('geo')
      defaultGeoProps = util?.getDefaultProps?.() || {}
      log.push('Default geo props: ' + JSON.stringify(Object.keys(defaultGeoProps)))
    } catch(e) {
      log.push('Could not get default geo props: ' + e.message)
    }

    const usesRichText = 'richText' in defaultGeoProps
    log.push('Uses richText: ' + usesRichText)

    let created = 0
    const errors = []

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const id = `shape:carenote-pitch-${i}`

      const baseProps = {
        geo: 'rectangle',
        color: card.color,
        fill: card.fill,
        dash: 'draw',
        size: 'm',
        font: 'mono',
        align: 'start',
        verticalAlign: 'start',
        growY: 0,
        url: '',
        w: card.w,
        h: card.h,
      }

      if (usesRichText) {
        baseProps.richText = toRichText(card.text)
      } else {
        baseProps.text = card.text
      }

      try {
        editor.createShape({ id, type: 'geo', x: card.x, y: card.y, props: baseProps })
        created++
      } catch(e) {
        errors.push(`Card ${i}: ${e.message}`)
        // Try flipping text/richText
        try {
          const altProps = { ...baseProps }
          if (usesRichText) {
            delete altProps.richText
            altProps.text = card.text
          } else {
            delete altProps.text
            altProps.richText = toRichText(card.text)
          }
          editor.createShape({ id: id + '_alt', type: 'geo', x: card.x, y: card.y, props: altProps })
          created++
          errors.push(`  → Card ${i} succeeded with alt format`)
        } catch(e2) {
          errors.push(`  → Alt also failed: ${e2.message}`)
        }
      }
    }

    try { editor.zoomToFit({ animation: { duration: 600 } }) } catch(e) {}

    return { created, total: cards.length, errors, log }
  }, CARDS)

  console.log('Result:', JSON.stringify(result, null, 2))

  await sleep(3000)
  await page.screenshot({ path: '/tmp/tldraw-final.png' })
  console.log('Screenshot at /tmp/tldraw-final.png')

  await sleep(20000)
  await browser.close()
}

run().catch(err => { console.error(err); process.exit(1) })
