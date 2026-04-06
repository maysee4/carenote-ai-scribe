import { chromium } from 'playwright'

const TLDRAW_URL = 'https://www.tldraw.com/f/fIP2-VyEU3mIhtk0BF1IM'

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Convert plain text to tldraw v3 richText ProseMirror format
function rt(text) {
  return {
    type: 'doc',
    content: text.split('\n').map(line =>
      line.trim()
        ? { type: 'paragraph', content: [{ type: 'text', text: line }] }
        : { type: 'paragraph' }
    ),
  }
}

// 8 pitch cards for the CareNote AI sales playbook
const CARDS = [
  {
    id: 'title',
    x: 0, y: 0, w: 1300, h: 130,
    color: 'black', fill: 'solid', size: 'xl', font: 'mono',
    text: '🔥  CARENOTE AI — DISCOVERY + DEMO CALL SCRIPT  🔥\nSales playbook for NDIS provider conversations  •  Built by Elevana AI',
  },
  {
    id: 'discovery',
    x: 0, y: 190, w: 630, h: 700,
    color: 'green', fill: 'semi', font: 'mono',
    text: `🧠  1. DISCOVERY CALL  (15–20 min)

OPEN + FRAME THE CALL:
"Before I show you anything — I want to ask a few questions about how you're handling documentation."
"If we can genuinely help — I'll show you what we've built."
"Sound fair?"  ← Wait for yes.

CONTEXT QUESTIONS  (let them talk 70%):
• How do staff currently do shift notes & reports?
• Typed, handwritten, or voice notes?
• How long per report on average?

FIND THE PAIN:
• Does documentation take time away from actual care?
• Any reports not up to NDIS compliance standard?
• How often are reports rewritten?
• Who fixes them — managers?`,
  },
  {
    id: 'quantify',
    x: 670, y: 190, w: 630, h: 700,
    color: 'light-blue', fill: 'semi', font: 'mono',
    text: `📊  QUANTIFY THE PROBLEM

KEY QUESTION:
"How many hours per week across your whole team is just documentation?"
→ Wait. Let them think.
→ THIS is where deals are made.

REFRAME AS EXPERT:
"Yeah — we see this a lot."
"Most providers don't have a care problem."
"They have a documentation bottleneck."
"Staff are doing admin instead of care."

PRE-CLOSE BEFORE DEMO:
"If staff could just speak or write rough notes…"
"…and it turned into fully completed, audit-ready NDIS forms automatically…"
"Would that genuinely help your team?"
→ Wait for yes.`,
  },
  {
    id: 'demo',
    x: 0, y: 950, w: 630, h: 750,
    color: 'violet', fill: 'semi', font: 'mono',
    text: `🔟  DEMO FLOW  (short + clean)

TRANSITION:
"Got it — that's really helpful."
"Let me show you what we've been building with CareNote AI."

SHOW IN ORDER:
→ Voice → report (live)
→ Incident form auto-completed
→ Structured NDIS output
→ Dashboard

CORE OFFER LINE:
"We take any messy care notes, voice recordings, or incomplete forms…"
"…and turn them into fully completed, audit-ready NDIS documentation — automatically."
(pause)
"Instead of staff spending 1–2 hours writing reports…"
"It takes about 1–2 minutes."

AFTER DEMO:
"Your team doesn't need to worry about wording, structure, or compliance."
"They just speak or jot rough notes…"
"…and it becomes proper, audit-ready documentation."`,
  },
  {
    id: 'pilot',
    x: 670, y: 950, w: 630, h: 750,
    color: 'orange', fill: 'semi', font: 'mono',
    text: `🧠  BETA PILOT OFFER

POSITION IT:
"CareNote AI is currently in beta."
"We're not rolling it out widely yet."
"We're partnering with a small number of NDIS providers to test it in real environments."

PILOT STRUCTURE  (30 days):
• 1 location
• 5–10 support workers
• Test documentation workflow end-to-end
• Collect feedback → improve the system

WHAT THEY GET:
✓ Early access to AI documentation tools
✓ Direct input into how the product is built
✓ Reduced admin burden for their staff
✓ Competitive advantage over other providers

WHAT YOU GET:
✓ First real user feedback
✓ First NDIS case study
✓ Real data to improve the product`,
  },
  {
    id: 'pricing',
    x: 0, y: 1760, w: 630, h: 620,
    color: 'red', fill: 'semi', font: 'mono',
    text: `💰  PRICING  (beta stage)

OPTION 1 — SAFEST:
Free 30-day pilot
→ then $2k–$3k/month depending on staff count

OPTION 2 — BETTER POSITIONING:
$500–$1,000 pilot fee  (skin in game)
→ then $2k–$4k/month after

HOW TO SAY IT ON THE CALL:
"Because it's still early stage, we're not rolling out publicly."
"We're partnering with a small group to test it properly."
"If the pilot saves your team time — we roll it across the org."

🔥  THE GUARANTEE  (money line):
"If it doesn't save your team at least 5 hours per week…"
"We'll handle the documentation for you until it does."
"Zero risk on your end."`,
  },
  {
    id: 'close',
    x: 670, y: 1760, w: 630, h: 620,
    color: 'green', fill: 'semi', font: 'mono',
    text: `🧠  CLOSE THE CALL

AUTHORITY STACK:
"CareNote AI is just one system we've built for NDIS providers."
"Through Elevana AI — we design full AI systems around your workflows."
"Anything admin-heavy, repetitive, compliance-related — we automate."

CLOSE LINE:
"If it genuinely removes the admin burden from your team…"
"We can roll it out across your whole organisation."
"But the first step is just testing it with a small group."

FINAL CLOSE:
"Would you be open to running a 30-day pilot with a few staff…"
"…and seeing how much time it actually saves?"

💥  OBJECTION HANDLER:
"If staff are still manually writing reports…"
"You're paying them to do admin instead of care."
"What we're doing is giving that time back."`,
  },
  {
    id: 'goals',
    x: 0, y: 2440, w: 1300, h: 420,
    color: 'yellow', fill: 'semi', font: 'mono',
    text: `🎯  THE REAL GOAL OF THIS CALL  —  NOT REVENUE  (yet)

1️⃣  First real NDIS provider using CareNote AI in production
2️⃣  Real feedback from actual support workers in the field
3️⃣  Fix and sharpen the product with real data
4️⃣  Create the FIRST CASE STUDY  →  selling becomes 10× easier after just 1 case study

KEY LINE TO USE:
"We're building this WITH providers — not for them."  ← Changes the whole dynamic of the conversation.

MINDSET:  You are NOT selling software yet.
You're offering: "Early access to an AI documentation system built specifically for NDIS providers."
That framing feels innovative — not risky.
Once you have 1 case study showing time saved: this is a $3k–$6k/month product easily.`,
  },
]

async function run() {
  console.log('Launching browser...')
  const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  console.log('Opening tldraw document...')
  await page.goto(TLDRAW_URL, { timeout: 30000 })
  await sleep(4000)

  // Focus canvas
  await page.mouse.click(700, 450)
  await sleep(500)

  // Select all + delete any existing content
  console.log('Clearing canvas...')
  await page.keyboard.press('Escape')
  await sleep(300)
  await page.keyboard.press('Meta+a')
  await sleep(600)
  await page.keyboard.press('Backspace')
  await sleep(1000)

  // Create all cards
  console.log('Creating pitch cards...')
  const result = await page.evaluate((cards, rtFn) => {
    function rt(text) {
      return {
        type: 'doc',
        content: text.split('\n').map(line =>
          line.trim()
            ? { type: 'paragraph', content: [{ type: 'text', text: line }] }
            : { type: 'paragraph' }
        ),
      }
    }

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
    if (!editor) return { error: 'Editor not found' }

    let created = 0
    const errors = []

    for (const card of cards) {
      try {
        editor.createShape({
          id: `shape:pitch-${card.id}`,
          type: 'geo',
          x: card.x,
          y: card.y,
          props: {
            geo: 'rectangle',
            w: card.w,
            h: card.h,
            color: card.color,
            fill: card.fill,
            dash: 'draw',
            size: card.size || 'm',
            font: card.font || 'mono',
            align: 'start',
            verticalAlign: 'start',
            growY: 0,
            url: '',
            scale: 1,
            labelColor: 'black',
            richText: rt(card.text),
          },
        })
        created++
      } catch (e) {
        errors.push(`${card.id}: ${e.message}`)
      }
    }

    // Zoom to fit all content
    try { editor.zoomToFit({ animation: { duration: 800 } }) } catch (e) {}

    return { created, total: cards.length, errors }
  }, CARDS)

  console.log('Result:', JSON.stringify(result, null, 2))

  await sleep(3000)
  await page.screenshot({ path: '/tmp/tldraw-done.png', fullPage: false })
  console.log('Screenshot saved to /tmp/tldraw-done.png')

  console.log('Keeping browser open 20s to allow cloud sync...')
  await sleep(20000)
  await browser.close()
  console.log('Done!')
}

run().catch(console.error)
