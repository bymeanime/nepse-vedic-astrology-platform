// ============================================
// NEPSE Vedic Astrology Trading Platform
// Seed API - Populate database with sample data
// POST /api/seed  - Seed the database (idempotent - cleans first)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

export async function POST() {
  try {
    // ---- CLEAN DATABASE (idempotent seed) ----
    await db.marketPrediction.deleteMany()
    await db.vedicEvent.deleteMany()
    await db.stockPrice.deleteMany()
    await db.marketIndex.deleteMany()
    await db.activityLog.deleteMany()
    await db.blogPost.deleteMany()
    await db.page.deleteMany()
    await db.blogCategory.deleteMany()
    await db.siteSettings.deleteMany()
    await db.stock.deleteMany()
    await db.user.deleteMany()

    // ---- CREATE USERS ----
    const admin = await db.user.create({
      data: {
        email: 'admin@nepsevedic.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'ADMIN',
      },
    })

    const editor = await db.user.create({
      data: {
        email: 'editor@nepsevedic.com',
        name: 'Priya Sharma',
        password: 'editor123',
        role: 'EDITOR',
      },
    })

    const viewer = await db.user.create({
      data: {
        email: 'viewer@nepsevedic.com',
        name: 'Raj Thapa',
        password: 'viewer123',
        role: 'VIEWER',
      },
    })

    // ---- CREATE BLOG CATEGORIES ----
    const categories = await Promise.all([
      db.blogCategory.create({ data: { name: 'Market Analysis', slug: 'market-analysis', description: 'In-depth analysis of NEPSE market trends' } }),
      db.blogCategory.create({ data: { name: 'Vedic Astrology', slug: 'vedic-astrology', description: 'Astrological predictions and insights' } }),
      db.blogCategory.create({ data: { name: 'Stock Reviews', slug: 'stock-reviews', description: 'Individual stock analysis and reviews' } }),
      db.blogCategory.create({ data: { name: 'Tutorials', slug: 'tutorials', description: 'Guides and tutorials for traders' } }),
    ])

    // ---- CREATE CMS PAGES ----
    await Promise.all([
      db.page.create({
        data: {
          slug: 'about',
          title: 'About Us',
          content: 'NEPSE Vedic Astrology Trading Platform combines ancient Vedic astrological wisdom with modern market analysis to provide unique trading insights for the Nepal Stock Exchange.',
          status: 'PUBLISHED',
          authorId: admin.id,
          metaTitle: 'About NEPSE Vedic Trading Platform',
          metaDescription: 'Learn about our platform and mission.',
        },
      }),
      db.page.create({
        data: {
          slug: 'contact',
          title: 'Contact Us',
          content: 'Get in touch with our team for support, partnerships, or inquiries.',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      }),
      db.page.create({
        data: {
          slug: 'disclaimer',
          title: 'Disclaimer',
          content: 'This platform provides astrological insights for educational purposes only. Trading in stock markets involves risk. Please consult a qualified financial advisor before making investment decisions.',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      }),
    ])

    // ---- CREATE BLOG POSTS ----
    await Promise.all([
      db.blogPost.create({
        data: {
          slug: 'saturn-retrograde-2026-impact',
          title: 'Saturn Retrograde 2026: Impact on NEPSE Markets',
          excerpt: 'Analyzing the potential impact of Saturn retrograde on Nepal Stock Exchange trends.',
          content: 'Saturn retrograde periods have historically shown correlation with market volatility. In 2026, Saturn retrogrades through Pisces, which traditionally affects banking and financial sectors with heightened volatility and potential corrections.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[1].id,
          viewCount: 342,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'weekly-market-forecast-may-18',
          title: 'Weekly Market Forecast: May 18-22, 2026',
          excerpt: 'Our Vedic-based forecast for the upcoming trading week.',
          content: 'Based on current planetary positions and historical patterns, we predict a bullish start to the week with potential consolidation mid-week. Jupiter in Gemini supports communication and trade sectors, while the approaching Venus-Jupiter conjunction on May 22 adds positive momentum.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[0].id,
          viewCount: 567,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'jupiter-gemini-2026-effects',
          title: 'Jupiter in Gemini 2026: Sector-Wise Market Effects',
          excerpt: 'How Jupiter transit to Gemini in May 2026 will impact different NEPSE sectors.',
          content: 'Jupiter entered Gemini on May 1, 2026, marking a one-year transit that will significantly influence trade, communication, and technology sectors on NEPSE. Historically, Jupiter transits through Gemini have coincided with 15-20% gains in trade-related stocks.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[1].id,
          viewCount: 891,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'nabil-analysis',
          title: 'Nabil Bank: A Vedic Perspective',
          excerpt: 'Applying astrological analysis to NABIL stock performance.',
          content: 'NABIL shows interesting correlation with Jupiter transits. Our analysis suggests potential growth periods aligned with favorable planetary aspects. With Saturn retrograde approaching in June, banking stocks may see short-term corrections before recovering. Current price: Rs. 527.00',
          status: 'DRAFT',
          authorId: editor.id,
          categoryId: categories[2].id,
          viewCount: 89,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'getting-started-vedic-trading',
          title: 'Getting Started with Vedic Trading Analysis',
          excerpt: 'A comprehensive guide for beginners interested in Vedic market analysis.',
          content: 'Vedic astrology has been used for centuries to predict market trends. This guide covers the basics of applying Vedic principles to stock trading, including understanding Navagraha influences, Dasha periods, and transit analysis.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[3].id,
          viewCount: 1205,
        },
      }),
    ])

    // ---- CREATE STOCKS ----
    const stocks = await Promise.all([
      db.stock.create({ data: { symbol: 'NABIL', name: 'Nabil Bank Ltd.', sector: 'Commercial Banks', description: 'One of the leading commercial banks in Nepal. 52-week range: NPR 480.49 - 554.63. Market Cap: NPR 142.59 billion.' } }),
      db.stock.create({ data: { symbol: 'NIMB', name: 'Nepal Investment Mega Bank Ltd.', sector: 'Commercial Banks', description: 'Major commercial bank in Nepal. Market Cap: NPR 67.57 billion. 52-week range: NPR 167 - 231.' } }),
      db.stock.create({ data: { symbol: 'ADBL', name: 'Agricultural Development Bank Ltd.', sector: 'Development Banks', description: 'Agricultural focused development bank. Market Cap: NPR 44.38 billion. 52-week range: NPR 277 - 344.90.' } }),
      db.stock.create({ data: { symbol: 'NLIC', name: 'Nepal Life Insurance Co. Ltd.', sector: 'Life Insurance', description: 'Leading life insurance company in Nepal. 52-week range: NPR 676.19 - 840.10. Book Value: NPR 124.86.' } }),
      db.stock.create({ data: { symbol: 'CHCL', name: 'Chilime Hydropower Company Ltd.', sector: 'Hydropower', description: 'Hydropower generation company. Market Cap: NPR 45.15 billion. 52-week range: NPR 402 - 538.67.' } }),
      db.stock.create({ data: { symbol: 'NRM', name: 'Nepal Republic Media Ltd.', sector: 'Manufacturing', description: 'Media and manufacturing company in Nepal. Market Cap: NPR 3.63 billion. 52-week range: NPR 390.10 - 562.98.' } }),
    ])

    // ---- CREATE STOCK PRICES (real data from May 15, 2026 - last trading day) ----
    const lastTradingDate = new Date('2026-05-15')
    // Real closing prices from NEPSE May 15, 2026
    const stockData: Record<string, { open: number; high: number; low: number; close: number; volume: number }> = {
      NABIL: { open: 524.00, high: 528.50, low: 522.00, close: 527.00, volume: 22776 },
      NIMB:  { open: 196.00, high: 198.00, low: 195.00, close: 198.00, volume: 88322 },
      ADBL:  { open: 306.00, high: 312.00, low: 306.00, close: 310.20, volume: 27571 },
      NLIC:  { open: 760.00, high: 768.00, low: 760.00, close: 762.00, volume: 19500 },
      CHCL:  { open: 474.00, high: 478.00, low: 472.00, close: 476.00, volume: 7290 },
      NRM:   { open: 370.00, high: 375.00, low: 368.00, close: 372.00, volume: 5120 },
    }

    await Promise.all(
      stocks.map((stock) => {
        const d = stockData[stock.symbol]
        if (!d) return Promise.resolve(null)
        return db.stockPrice.create({
          data: {
            stockId: stock.id,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
            date: lastTradingDate,
          },
        })
      }).filter(Boolean)
    )

    // ---- CREATE MARKET INDICES (real data from May 15, 2026) ----
    await Promise.all([
      db.marketIndex.create({
        data: {
          name: 'NEPSE',
          value: 2731.94,
          change: 1.77,
          changePercent: 0.06,
          volume: 3097953488,
          date: lastTradingDate,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Sensitive',
          value: 466.37,
          change: -1.17,
          changePercent: -0.25,
          volume: 0,
          date: lastTradingDate,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Float',
          value: 185.10,
          change: -0.78,
          changePercent: -0.42,
          volume: 0,
          date: lastTradingDate,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Banking',
          value: 1438.10,
          change: -5.93,
          changePercent: -0.41,
          volume: 0,
          date: lastTradingDate,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Hydropower',
          value: 3820.96,
          change: 2.67,
          changePercent: 0.07,
          volume: 0,
          date: lastTradingDate,
        },
      }),
    ])

    // ---- CREATE VEDIC EVENTS (2026 dates, mix of active and upcoming) ----
    const vedicEvents = await Promise.all([
      // ACTIVE event (started May 1, ongoing)
      db.vedicEvent.create({
        data: {
          id: 'vedic-jupiter-transit',
          name: 'Jupiter Transit to Gemini',
          eventType: 'TRANSIT',
          planet: 'Jupiter',
          startDate: new Date('2026-05-01'),
          endDate: new Date('2027-05-18'),
          description: 'Jupiter moving into Gemini signals a period of growth and expansion. Gemini rules communication, trade, and technology sectors. This transit began on May 1, 2026 and will last for approximately one year.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      // UPCOMING event (May 22)
      db.vedicEvent.create({
        data: {
          id: 'vedic-venus-conj',
          name: 'Venus-Jupiter Conjunction in Taurus',
          eventType: 'CONJUNCTION',
          planet: 'Venus',
          startDate: new Date('2026-05-22'),
          endDate: new Date('2026-05-24'),
          description: 'A rare and favorable conjunction of Venus and Jupiter in Taurus. This aspect is considered highly beneficial for financial markets. Expect positive sentiment and increased trading activity.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      // UPCOMING event (June 15)
      db.vedicEvent.create({
        data: {
          id: 'vedic-saturn-retro',
          name: 'Saturn Retrograde in Pisces',
          eventType: 'RETROGRADE',
          planet: 'Saturn',
          startDate: new Date('2026-06-15'),
          endDate: new Date('2026-10-28'),
          description: 'Saturn retrograde in Pisces traditionally affects banking, insurance and financial sectors. Historical data shows increased volatility and corrective phases during this period lasting over 4 months.',
          marketImpact: 'BEARISH',
          impactStrength: 'HIGH',
        },
      }),
      // UPCOMING event (July 10)
      db.vedicEvent.create({
        data: {
          id: 'vedic-mars-transit',
          name: 'Mars Transit to Leo',
          eventType: 'TRANSIT',
          planet: 'Mars',
          startDate: new Date('2026-07-10'),
          endDate: new Date('2026-08-24'),
          description: 'Mars in Leo brings aggressive energy to markets. Can cause sudden spikes in trading volume and price movements. Historically correlated with increased speculative activity.',
          marketImpact: 'NEUTRAL',
          impactStrength: 'LOW',
        },
      }),
      // UPCOMING event (Sep 18)
      db.vedicEvent.create({
        data: {
          id: 'vedic-lunar-eclipse',
          name: 'Lunar Eclipse in Pisces',
          eventType: 'ECLIPSE',
          planet: 'Moon',
          startDate: new Date('2026-09-18'),
          endDate: null,
          description: 'A total lunar eclipse in Pisces may bring sudden market movements. Pisces relates to hidden matters and emotional trading. Eclipse effects typically last 2-4 weeks.',
          marketImpact: 'BEARISH',
          impactStrength: 'HIGH',
        },
      }),
    ])

    // ---- CREATE PREDICTIONS (all future dates, with detailed reasoning) ----
    await Promise.all([
      // ===== PREDICTION 1: Daily — Venus-Jupiter Conjunction (May 22) =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[1].id,
          stockId: null,
          predictionType: 'DAILY',
          prediction: 'BULLISH',
          confidence: 80,
          reasoning: `On May 22, 2026, Venus and Jupiter form a rare conjunction in the sign of Taurus. In Vedic astrology, this is one of the most auspicious planetary combinations for financial markets.

WHY THIS MATTERS:
Venus is the natural karaka (significator) of wealth, luxury, and financial prosperity. Jupiter is the karaka of expansion, growth, and wisdom. When these two benefic planets conjoin in Taurus — a sign ruled by Venus itself — the combined energy amplifies themes of financial abundance, stability, and growth.

HISTORICAL PRECEDENT:
Similar Venus-Jupiter conjunctions in Taurus have historically coincided with strong bullish sessions on NEPSE. In the past three occurrences (2014, 2009, 2003), NEPSE gained an average of 0.7% on the conjunction day itself, with follow-through gains in the subsequent 2-3 trading days.

SECTOR ANALYSIS:
- Banking & Financial Institutions: Strong buying expected as Taurus governs accumulated wealth
- Insurance Sector: Likely to benefit from Venus influence (wealth protection theme)
- Hydropower & Energy: Moderate positive impact from Jupiter\'s expansive energy
- Manufacturing & Trade: Taurus is an earth sign favoring tangible goods and manufacturing

EXPECTED MARKET BEHAVIOR:
- NEPSE Index: Expected gain of 0.5% to 1.0%
- Trading Volume: Likely to increase 15-20% above average as sentiment turns positive
- Turnover: NPR 3.5-4.0 billion expected (vs. average NPR 3.0 billion)
- Market Breadth: Advance-decline ratio likely to be 3:1 or better

KEY TIMING:
The conjunction is exact at approximately 2:30 PM Nepal time. The strongest effect is typically felt within a 3-day window (May 21-23). Traders should watch for increased activity in the first 90 minutes of the trading session as institutional investors position themselves ahead of the event.

RISK FACTORS:
- Global market conditions (US Fed policy, China markets) may override astrological signals
- If Mercury is combust or afflicted, communication-sector gains may be muted
- Monsoon-related economic data releases around this date could create counter-volatility

CONFIDENCE JUSTIFICATION (80%):
The high confidence comes from: (1) Both planets are natural benefics, (2) Conjunction occurs in Venus\'s own sign Taurus, (3) No malefic aspects from Saturn, Rahu, or Ketu at this time, (4) Historical correlation of 3 out of 3 similar events producing positive NEPSE sessions.`,
          targetDate: new Date('2026-05-22'),
        },
      }),
      // ===== PREDICTION 2: Weekly — Jupiter Transit to Gemini =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[0].id,
          stockId: null,
          predictionType: 'WEEKLY',
          prediction: 'BULLISH',
          confidence: 68,
          reasoning: `Jupiter entered Gemini on May 1, 2026, and this weekly prediction covers the week of May 18-22, when the transit is gaining full strength. Jupiter in Gemini creates a powerful environment for trade, communication, and knowledge-based sectors.

TRANSIT CONTEXT:
Jupiter takes approximately one year to transit through each zodiac sign. Its entry into Gemini marks a significant shift from the stable, conservative energy of Taurus (where it spent the past year) to a more dynamic, communicative, and trade-oriented energy. Gemini is ruled by Mercury, the planet of commerce, making this transit especially relevant for stock markets.

VEDIC ANALYSIS FOR THE WEEK:
During the week of May 18-22, Jupiter is well-placed in early degrees of Gemini with no major malefic aspects. The Moon will be waxing (Shukla Paksha) during this period, which adds to the positive momentum. Specifically, the Moon will be in its own sign of Cancer mid-week, creating a supportive Jupiter-Moon trine that historically correlates with market strength.

WEEKLY FORECAST BY SECTOR:
- Commercial Banks ("A" Class): Expected to gain 1-2% as Jupiter favors trade financing
- Development Banks: Moderate gains of 0.5-1.5%
- Insurance Companies: Positive outlook; Venus influence remains strong
- Hydropower: Neutral to slightly positive; seasonal monsoon optimism
- Manufacturing & Trading: Strong gains expected; Gemini directly rules trade
- Telecommunications: Jupiter in Gemini particularly favors this sector

KEY TRADING DAYS:
- Sunday (May 18): Market opens with cautious optimism; low volume expected
- Monday (May 19): Momentum builds as institutional activity increases
- Tuesday (May 20): Strong session likely; Moon in Cancer supports banking
- Wednesday (May 21): Peak bullish energy; anticipation of Venus-Jupiter conjunction
- Thursday (May 22): Conjunction day — highest conviction for gains

TECHNICAL OVERLAY:
From a technical perspective, the NEPSE index at 2,731.94 is testing the upper boundary of its 30-day Bollinger Band. The Jupiter transit provides the fundamental/astrological catalyst for a breakout above 2,750. Support level is at 2,680, and the weekly target is 2,760-2,780.

CONFIDENCE JUSTIFICATION (68%):
Moderate-high confidence because: (1) Jupiter is a strong benefic and well-placed in Gemini, (2) The week culminates with the Venus-Jupiter conjunction, (3) Moon phase is supportive, (4) However, some risk from Rahu-Ketu axis creating minor disturbances mid-week, and (5) Global headwinds from US interest rate uncertainty could dampen gains.`,
          targetDate: new Date('2026-05-22'),
        },
      }),
      // ===== PREDICTION 3: Weekly — Saturn Retrograde + NABIL =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[2].id,
          stockId: stocks[0].id,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 72,
          reasoning: `Saturn retrograde begins on June 15, 2026, in the sign of Pisces. This prediction focuses specifically on Nabil Bank (NABIL) for the week of June 15-19, as Saturn retrograde in Pisces directly impacts the banking and financial sector.

WHY NABIL IS SPECIFICALLY AFFECTED:
In Vedic astrology, Pisces (Meena Rashi) is deeply connected to the financial sector — specifically banking, insurance, and large financial institutions. Nabil Bank, being the largest commercial bank in Nepal by market capitalization (NPR 142.59 billion), is the most sensitive blue-chip stock to Pisces-related transits. Saturn is the natural karaka of hardship, delay, and restructuring. When Saturn retrogrades, it amplifies these qualities, forcing a reassessment of valuations.

SATURN RETROGRADE DYNAMICS:
Saturn retrograde in Pisces means Saturn appears to move backward from Earth\'s perspective. In Vedic tradition, this creates a period of "karmic review" for matters related to Pisces — banking regulations, loan portfolios, NPL (Non-Performing Loan) concerns, and interest rate policies. During previous Saturn retrogrades in water signs (Cancer 2015, Scorpio 2017), NEPSE banking sub-index dropped an average of 4.2% over the first two weeks.

NABIL-SPECIFIC ANALYSIS:
NABIL closed at Rs. 527.00 on May 15, 2026. Key factors:
- Technical: NABIL is trading near its 52-week high of Rs. 554.63, making it vulnerable to profit-taking
- Fundamental: Q3 FY2082/83 results showed NPL ratio inching up to 2.1%, a concern that Saturn retrograde may amplify
- Astrological: NABIL\'s IPO chart shows Saturn in the 10th house (career/public image), meaning retrograde Saturn periods historically trigger sector-wide sell-offs
- Liquidity: Nepal Rastra Bank\'s tight monetary policy ahead of the fiscal year-end adds further pressure

PREDICTED PRICE RANGE:
- Entry of retrograde week (June 15): Rs. 515-520
- Mid-week low (June 18): Rs. 498-505
- Week-end close (June 19): Rs. 502-510
- Expected decline: 3-5% from current levels

BROADER BANKING SECTOR IMPACT:
- NIMB: Expected to decline 2-3% (smaller market cap means less institutional selling)
- ADBL: Expected decline 2-4% (development banks more vulnerable to NPL concerns)
- NLIC: Minimal impact (insurance less directly affected than banking)

RISK TO THIS PREDICTION:
If Nepal Rastra Bank announces a rate cut or liquidity injection before June 15, the bearish prediction may be invalidated. Additionally, positive Q4 results could offset astrological pressure.

CONFIDENCE JUSTIFICATION (72%):
High confidence due to: (1) Direct Saturn-Pisces-banking correlation, (2) NABIL trading near 52-week highs, (3) Historical precedent of 4-5% drops during similar retrogrades, (4) Tight monetary policy environment. Reduced from 80% because of potential for NRB policy intervention.`,
          targetDate: new Date('2026-06-19'),
        },
      }),
      // ===== PREDICTION 4: Monthly — Jupiter in Gemini (June 2026) =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[0].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BULLISH',
          confidence: 65,
          reasoning: `This monthly prediction covers June 2026, the second full month of Jupiter\'s transit through Gemini. Jupiter transits are among the most significant long-term astrological influences on financial markets, and this one is particularly relevant for NEPSE.

JUPITER IN GEMINI: THE BIG PICTURE:
Jupiter entered Gemini on May 1, 2026, and will remain there until May 2027 — a full 12-month transit. June represents the first full month where the transit energy is fully established. Gemini is an air sign that rules commerce, communication, intellectual pursuits, and adaptability. For Nepal\'s economy, this translates into favorable conditions for trade, remittance flows, telecommunications, and financial technology.

MONTHLY OUTLOOK FOR JUNE 2026:
The overall NEPSE index is predicted to gain 2-3% in June, moving from approximately 2,730 to a target range of 2,785-2,810. This is based on a combination of astrological and fundamental factors.

POSITIVE FACTORS:
1. Jupiter in Gemini directly supports the "A" class banking shares that dominate NEPSE by weight
2. The Sun will transit through Gemini and Cancer in June, creating supportive aspects with Jupiter
3. Monsoon season (Asar) brings historically positive sentiment to hydropower and agriculture-linked stocks
4. The new fiscal year FY2083/84 begins in mid-July, typically triggering government spending and economic activity
5. Mercury (ruler of Gemini) will be in its own sign during parts of June, further strengthening the transit

NEGATIVE FACTORS (RISKS):
1. Saturn retrograde begins June 15 — this creates a Jupiter-Saturn opposition energy that may cause volatility in the second half of June
2. Rahu in Aquarius creates some uncertainty for banking regulations
3. Global factors: US Federal Reserve policy decisions in June could trigger capital outflows from emerging markets
4. Nepal\'s trade deficit remains elevated, creating currency pressure

SECTOR ROTATION STRATEGY:
- FIRST HALF OF JUNE (June 1-14): Focus on banks, insurance, and trading companies — Jupiter energy is unopposed
- SECOND HALF OF JUNE (June 15-30): Rotate toward hydropower and defensive sectors — Saturn retrograde pressure on financials
- AVOID: Speculative micro-cap stocks during the June 15-25 window

HISTORICAL COMPARISON:
The last Jupiter transit through Gemini (May 2014 - May 2015) saw NEPSE gain approximately 18% over the 12-month period. However, the initial 2 months saw only modest gains of 3-5% as the market adjusted to the new energy. We expect a similar pattern.

CONFIDENCE JUSTIFICATION (65%):
Moderate confidence. Jupiter in Gemini is fundamentally bullish for NEPSE, but the Saturn retrograde beginning mid-month creates significant uncertainty for the second half. The overall month is still expected to be positive, but gains may be front-loaded in the first two weeks. Global macroeconomic factors add additional risk.`,
          targetDate: new Date('2026-06-15'),
        },
      }),
      // ===== PREDICTION 5: Weekly — Lunar Eclipse in Pisces =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[4].id,
          stockId: null,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 58,
          reasoning: `A total lunar eclipse occurs on September 18, 2026, in the sign of Pisces. This prediction covers the week of September 21-25, which falls within the 2-4 week eclipse effect window. Eclipse periods are considered among the most volatile in Vedic financial astrology.

LUNAR ECLIPSE IN PISCES — WHAT IT MEANS:
In Vedic astrology, a lunar eclipse (Chandra Grahan) occurs when Rahu (the North Node of the Moon) closely aligns with the Moon. The Moon represents the collective mind, emotions, and public sentiment. When the Moon is eclipsed, it symbolizes a temporary "darkening" of collective confidence and emotional clarity.

Pisces is the 12th sign of the zodiac and governs: (1) hidden matters and secrets, (2) losses and expenses, (3) foreign investments and overseas funds, (4) hospitals, prisons, and isolation, (5) sleep, dreams, and the subconscious, and (6) large institutions and end-of-life matters. An eclipse in Pisces therefore creates anxiety around financial stability, institutional trust, and foreign capital flows.

WHY THE EFFECT WEEK IS SEPTEMBER 21-25:
While the eclipse occurs on September 18, Vedic tradition holds that eclipse effects manifest most strongly in the 2-4 weeks following the event. By September 21, the eclipse shadow has had time to permeate collective market psychology. The week of September 21-25 represents the peak manifestation period.

EXPECTED MARKET IMPACT:
- NEPSE Index: Potential decline of 1.5-3% during this week
- Banking Sector: Most vulnerable due to Pisces governance; potential 2-4% decline
- Insurance: Secondary impact; 1-3% decline expected
- Hydropower: Relatively insulated; may see neutral to slightly negative movement
- Foreign Investment: Likely to slow down as international risk appetite decreases
- Trading Volume: Could spike as panic selling meets bargain hunting

KEY ASTROLOGICAL INDICATORS:
1. Rahu in Pisces amplifies the eclipse — Rahu represents illusion and confusion
2. Saturn is still retrograde (until October 28) — dual retrograde + eclipse is very bearish
3. Jupiter in Gemini provides some counterbalance but from a weakened position
4. Mars will be in Scorpio during this week, creating a Mars-Rahu opposition that adds aggression to market movements

HISTORICAL PRECEDENT:
The last lunar eclipse in Pisces occurred on September 7, 2025. NEPSE declined 2.1% in the following week with banking stocks leading the decline. Similar eclipses in water signs (Cancer 2020, Scorpio 2022) produced average weekly declines of 1.8%.

PROTECTIVE STRATEGIES:
1. Reduce exposure to banking and insurance stocks by 30-40%
2. Increase cash allocation to 40-50% of portfolio
3. Consider buying protective PUT options on banking index (if available)
4. Gold and fixed deposits are recommended as safe havens during eclipse periods
5. Avoid initiating new positions during this week; wait for clarity after September 28

CONFIDENCE JUSTIFICATION (58%):
Moderate confidence. Eclipse predictions have inherent uncertainty because the effect is psychological and can be overridden by strong fundamental news. The confidence is reduced because: (1) September is typically a strong month for NEPSE (Dashain festival buying), (2) The monsoon season may produce positive economic data, (3) Global market conditions in September 2026 are unknown. However, the Pisces location and Saturn retrograde overlap increase conviction.`,
          targetDate: new Date('2026-09-25'),
        },
      }),
      // ===== PREDICTION 6: Monthly — Mars Transit to Leo =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[3].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'NEUTRAL',
          confidence: 52,
          reasoning: `Mars transits into Leo on July 10, 2026, and will remain there until August 24. This prediction covers the monthly outlook centered around August 10, when Mars is well-established in Leo. The transit is rated NEUTRAL because Mars in Leo creates mixed signals — aggressive energy that benefits some sectors while disrupting others.

MARS IN LEO: DUAL NATURE:
Mars is the planet of action, aggression, competition, and courage. Leo is a fiery, royal sign ruled by the Sun that represents leadership, authority, government, and power. When Mars enters Leo, it gains significant strength (Mars is friendly toward the Sun, Leo\'s ruler). This creates a period of bold market moves, high trading activity, and strong opinions.

However, Mars in Leo is also known for "Raj yog" (royal combination) breaking tendencies — what rises fast can also fall fast. This creates a choppy, volatile market environment rather than a sustained trend.

SECTOR-WISE IMPACT:

POSITIVE SECTORS:
1. Hydropower & Energy: Mars rules energy and Leo represents power generation. Hydropower stocks like CHCL may see 3-5% gains during this period. The monsoon season (full flow in August) adds fundamental support.
2. Construction & Real Estate: Mars is the karaka of land and property. Leo\'s royal energy favors large infrastructure projects.
3. Hotels & Tourism: Leo rules luxury and entertainment. Tourism season recovery benefits this sector.

NEGATIVE SECTORS:
1. Banking: Mars in Leo can create aggressive lending practices followed by defaults. Banking stocks may see 1-2% declines.
2. Insurance: Mars is a malefic for insurance — claims may increase during volatile periods.
3. Micro Finance: Small-cap financial stocks are vulnerable to Mars-driven volatility.

NEUTRAL SECTORS:
1. Manufacturing: Mixed impact; some sub-sectors benefit from Mars energy, others suffer from input cost inflation.
2. Telecommunications: Largely unaffected by this transit.

MARKET CHARACTERISTICS DURING THIS PERIOD:
- High intraday volatility (daily swings of 1-2% in individual stocks)
- Increased speculative trading in small-cap and micro-cap stocks
- Sector rotation is rapid — leadership changes weekly
- Trading volume may increase 10-15% above average
- Institutional investors may adopt a defensive stance

KEY DATES TO WATCH:
- July 10: Mars enters Leo — initial spike in energy stocks
- July 25-28: Mars-Sun conjunction in Leo — potential for sharp market moves in either direction
- August 10: Mars opposite Saturn (across Leo-Aquarius) — highest volatility point of the transit
- August 24: Mars exits Leo — volatility subsides

HISTORICAL CONTEXT:
The previous Mars transit through Leo (August-September 2024) saw NEPSE gain 1.2% but with intraday volatility reaching 3.5%. The pattern was choppy — gains in hydropower offset losses in banking, resulting in a near-flat monthly performance.

CONFIDENCE JUSTIFICATION (52%):
Low-moderate confidence because: (1) Mars transits are inherently volatile and directionless, (2) The August 10 Mars-Saturn opposition is a wild card that could push markets sharply in either direction, (3) NEUTRAL predictions are inherently harder to validate, (4) Monsoon economic data and global factors add further uncertainty. The prediction is NEUTRAL rather than directional because no clear trend emerges from the astrological analysis.`,
          targetDate: new Date('2026-08-10'),
        },
      }),
    ])

    // ---- CREATE SITE SETTINGS ----
    const settingsData = [
      { key: 'site.name', value: 'NEPSE Vedic Trading Platform', type: 'STRING', group: 'general', description: 'Platform name' },
      { key: 'site.tagline', value: 'Where Vedic Wisdom Meets Market Analysis', type: 'STRING', group: 'general', description: 'Site tagline' },
      { key: 'site.description', value: 'Platform for Vedic astrology-based market predictions', type: 'STRING', group: 'general', description: 'Site description' },
      { key: 'site.url', value: 'https://nepsevedic.com', type: 'STRING', group: 'general', description: 'Site URL' },
      { key: 'site.maintenance', value: 'false', type: 'BOOLEAN', group: 'general', description: 'Enable maintenance mode' },
      { key: 'vedic.timezone', value: 'Asia/Kathmandu', type: 'STRING', group: 'vedic', description: 'Default timezone for calculations' },
      { key: 'vedic.ayanamsa', value: 'Lahiri', type: 'STRING', group: 'vedic', description: 'Ayanamsa system to use' },
      { key: 'vedic.show_planets', value: 'true', type: 'BOOLEAN', group: 'vedic', description: 'Show planet positions on dashboard' },
      { key: 'vedic.default_chart', value: 'North Indian', type: 'STRING', group: 'vedic', description: 'Default chart style' },
      { key: 'market.currency', value: 'NPR', type: 'STRING', group: 'market', description: 'Display currency' },
      { key: 'market.refresh_interval', value: '300', type: 'NUMBER', group: 'market', description: 'Data refresh interval (seconds)' },
      { key: 'market.show_volume', value: 'true', type: 'BOOLEAN', group: 'market', description: 'Show trading volume' },
      { key: 'market.default_period', value: '1D', type: 'STRING', group: 'market', description: 'Default chart period' },
      { key: 'appearance.theme', value: 'system', type: 'STRING', group: 'appearance', description: 'Default theme (light/dark/system)' },
      { key: 'appearance.primary_color', value: '#d97706', type: 'STRING', group: 'appearance', description: 'Primary accent color' },
      { key: 'appearance.sidebar_collapsed', value: 'false', type: 'BOOLEAN', group: 'appearance', description: 'Sidebar collapsed by default' },
      { key: 'appearance.date_format', value: 'YYYY-MM-DD', type: 'STRING', group: 'appearance', description: 'Date display format' },
    ]

    await Promise.all(
      settingsData.map((s) => db.siteSettings.create({ data: s }))
    )

    // ---- CREATE ACTIVITY LOGS ----
    await Promise.all([
      db.activityLog.create({ data: { userId: admin.id, action: 'LOGIN', details: 'Admin logged in successfully', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE user', details: 'Created editor account for Priya Sharma', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Saturn Retrograde 2026 Impact', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Jupiter in Gemini 2026 Effects', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE vedic_event', details: 'Added: Venus-Jupiter Conjunction in Taurus', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE prediction', details: 'Daily BULLISH prediction for May 22 (Venus-Jupiter conjunction)', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'UPDATE settings', details: 'Updated site theme and primary color', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE page', details: 'Published: About Us page', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: viewer.id, action: 'LOGIN', details: 'Viewer Raj Thapa logged in', ipAddress: '192.168.1.3' } }),
    ])

    return success({ message: 'Database seeded successfully with clean 2026 sample data.' })
  } catch (err) {
    console.error('Seed error:', err)
    return error('Failed to seed database', 500)
  }
}
