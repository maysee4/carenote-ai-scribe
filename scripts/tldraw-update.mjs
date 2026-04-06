import { chromium } from 'playwright'
import path from 'path'
import os from 'os'

const TLDRAW_FOLDER_URL = 'https://www.tldraw.com/f/fIP2-VyEU3mIhtk0BF1IM'

// The new CareNote AI pitch content structured as tldraw cards
const PITCH_CONTENT = [
  {
    id: 'card-title',
    type: 'header',
    text: '🔥 CARENOTE AI — FULL DISCOVERY + DEMO CALL SCRIPT',
    x: 0, y: 0, w: 900, h: 80,
  },
  {
    id: 'card-discovery',
    type: 'section',
    text: `🧠 1. DISCOVERY CALL (15–20 mins)

OPEN + FRAME (CONTROL THE CALL)
"Hey, appreciate you jumping on."
"Before I show you anything — I just want to ask a few questions about how you're currently handling documentation…"
"And then if it looks like we can help — I'll show you exactly what we've built."
"Sound fair?" → Wait for yes

CONTEXT QUESTIONS (LET THEM TALK 70%)
• "How are your staff currently doing shift notes and reports?"
• "Is it mostly typed, handwritten, or voice notes?"
• "How long does each report take on average?"

FIND THE PAIN
• "Does documentation take time away from actual care?"
• "Any issues with reports not being up to standard?"
• "How often do reports need to be corrected or rewritten?"
• "Who's usually fixing that — managers?"`,
    x: 0, y: 120, w: 860, h: 420,
  },
  {
    id: 'card-quantify',
    type: 'section',
    text: `📊 QUANTIFY THE PROBLEM (VERY IMPORTANT)

"If you had to estimate…"
"How many hours a week are being spent just on documentation across your team?"
→ Wait. Let them think. THIS is where deals are made.

REFRAME AS EXPERT
"Yeah — we see this a lot."
"Most providers don't have a care problem…"
"They've got a documentation bottleneck."
"Staff are doing admin instead of care."

PRE-CLOSE BEFORE DEMO
"If there was a way your staff could just speak or write rough notes…"
"…and it automatically turned into fully completed, audit-ready forms…"
"Would that actually help your team?"
→ Wait for yes.`,
    x: 900, y: 120, w: 800, h: 400,
  },
  {
    id: 'card-demo',
    type: 'section',
    text: `🔟 DEMO FLOW (SHORT + CLEAN)

TRANSITION:
"Got it — that's really helpful."
"Let me show you what we've been building with CareNote AI."

SHOW:
→ Voice → report
→ Incident form
→ Structured output
→ Dashboard

CORE OFFER LINE:
"We take any messy care notes, voice recordings, or incomplete documentation…"
"…and turn it into fully completed, audit-ready NDIS forms inside your existing system — like AlayaCare — automatically."

"So instead of staff spending 1–2 hours writing reports…"
"It takes about 1–2 minutes."

AFTER DEMO:
"Your team doesn't need to worry about wording, structure, or compliance anymore…"
"They just speak or jot rough notes…"
"…and everything gets turned into proper, audit-ready documentation."`,
    x: 0, y: 580, w: 860, h: 460,
  },
  {
    id: 'card-pilot',
    type: 'section',
    text: `🧠 BETA PILOT OFFER

POSITION:
"CareNote AI is currently in beta."
"We're not rolling it out widely yet."
"We're working with a small number of providers to run pilot programs."

PILOT STRUCTURE:
• 1 location
• 5–10 support workers
• 30 days
• Test documentation workflow
• Collect feedback → improve the system

WHAT THEY GET:
✓ Early access to AI tools
✓ Input into how the product is built
✓ Reduced admin workload for staff
✓ Competitive advantage

WHAT YOU GET:
✓ First real user feedback
✓ First case study
✓ Real data`,
    x: 900, y: 560, w: 800, h: 480,
  },
  {
    id: 'card-pricing',
    type: 'section',
    text: `💰 PRICING (BETA STAGE)

Option 1 — Safest:
Free 30-day pilot
→ then $2k–$3k/month depending on staff

Option 2 — Better positioning:
$500–$1,000 pilot fee
→ then $2k–$4k/month after

HOW TO PHRASE IT:
"Because this is still early stage, we're not rolling it out publicly yet."
"We're partnering with a small number of providers to test it properly."
"If the pilot works and genuinely saves your team time, we roll it out across the organisation."

🔥 GUARANTEE (MONEY LINE):
"If it doesn't save your team at least 5 hours per week…"
"We'll literally handle the documentation for you until it does."
"So there's zero risk on your end."`,
    x: 0, y: 1080, w: 860, h: 440,
  },
  {
    id: 'card-close',
    type: 'section',
    text: `🧠 CLOSE (LOW PRESSURE)

AUTHORITY STACK:
"CareNote AI is just one system we've built for NDIS providers…"
"Through Elevana AI, we design full AI systems around your workflows."
"Anything admin-heavy, repetitive, or compliance-related — we can automate that."

CLOSE:
"If the system genuinely removes that admin workload from your team…"
"Then we can roll it out across your organisation."
"But the first step is just testing it."

FINAL CLOSE:
"Would you be open to running a small pilot with a few staff…"
"…and seeing how much time it actually saves in your environment?"

💥 OBJECTION HANDLER:
"If your staff are still manually writing reports…"
"You're basically paying them to do admin instead of care."
"What we're doing is giving that time back."`,
    x: 900, y: 1080, w: 800, h: 440,
  },
  {
    id: 'card-goals',
    type: 'highlight',
    text: `🎯 THE REAL GOAL OF THIS CALL

Not revenue (yet).

1️⃣ First real NDIS provider using it
2️⃣ Feedback from support workers
3️⃣ Fix the product
4️⃣ Create first case study

Once you have 1 case study, selling becomes 10× easier.

KEY LINE:
"We're building this WITH providers, not FOR them."
→ That changes the whole dynamic.

MINDSET:
You are NOT selling software yet.
You're offering:
"Early access to an AI documentation system built specifically for NDIS providers."
That feels innovative, not risky.`,
    x: 0, y: 1560, w: 1740, h: 300,
  },
]

async function run() {
  const braveProfile = path.join(os.homedir(), 'Library/Application Support/BraveSoftware/Brave-Browser')

  console.log('Launching Brave with existing profile...')
  const browser = await chromium.launchPersistentContext(braveProfile, {
    headless: false,
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    args: ['--no-sandbox'],
    viewport: { width: 1440, height: 900 },
  })

  const page = await browser.newPage()

  console.log('Navigating to tldraw folder...')
  await page.goto(TLDRAW_FOLDER_URL, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(3000)

  // Take screenshot to see what's there
  await page.screenshot({ path: '/tmp/tldraw-folder.png', fullPage: false })
  console.log('Screenshot saved to /tmp/tldraw-folder.png')

  // Look for "care note" document in the folder
  const items = await page.$$('[data-testid="file-button"], .tl-file-item, a[href*="tldraw"]')
  console.log(`Found ${items.length} items in folder`)

  // Try to find and click the care note document
  const allText = await page.evaluate(() => {
    const elements = document.querySelectorAll('*')
    const matches = []
    elements.forEach(el => {
      const text = el.textContent?.trim()
      if (text && text.toLowerCase().includes('care') && el.children.length === 0) {
        matches.push({ tag: el.tagName, text: text.slice(0, 100), class: el.className })
      }
    })
    return matches.slice(0, 20)
  })

  console.log('Elements containing "care":', JSON.stringify(allText, null, 2))

  await page.waitForTimeout(5000)
  await page.screenshot({ path: '/tmp/tldraw-folder-2.png' })

  console.log('Done. Check /tmp/tldraw-folder.png to see the current state.')
  // Keep browser open for inspection
  await page.waitForTimeout(10000)
  await browser.close()
}

run().catch(console.error)
