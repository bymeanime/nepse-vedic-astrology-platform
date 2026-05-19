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
      // === EXISTING 5 BLOG POSTS (kept exactly as-is) ===
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
      // === NEW BLOG POSTS 6-12 ===
      db.blogPost.create({
        data: {
          slug: 'mercury-retrograde-trading-effects',
          title: 'Mercury Retrograde Effects on NEPSE Trading',
          excerpt: 'How Mercury retrograde periods historically affect trading patterns on the Nepal Stock Exchange.',
          content: 'Mercury retrograde is one of the most well-known astrological phenomena, and its impact on financial markets has been studied extensively. In Vedic astrology, Mercury (Budh) is the karaka of commerce, communication, and intellectual analysis — all critical elements of stock trading. When Mercury goes retrograde, these functions are said to become impaired, leading to increased market confusion, miscommunication of financial data, and erratic price movements. Historical analysis of NEPSE data during Mercury retrograde periods since 2018 shows an average decline of 1.8% in the NEPSE index, with banking and trading stocks being most affected. The key to navigating these periods is defensive positioning: reduce leverage, avoid initiating new large positions, and focus on already-researched blue-chip stocks with strong fundamentals.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[1].id,
          viewCount: 428,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'dashain-festival-market-analysis',
          title: 'Dashain Festival Market Analysis: Historical Patterns & 2026 Outlook',
          excerpt: 'Examining how Nepal\'s biggest festival historically impacts stock market performance.',
          content: 'Dashain, Nepal\'s greatest festival, has a well-documented seasonal effect on the NEPSE market. Historically, the period 2-4 weeks before Dashain sees increased liquidity as expatriate Nepalis send remittances home, and institutional investors position for the festive buying season. Our analysis of NEPSE data from 2015-2025 shows that the banking sub-index gains an average of 3.2% in the month leading up to Dashain, while insurance and hydropower sectors also show positive momentum. In 2026, Dashain falls in early October, and the astrological alignment — with Jupiter firmly in Gemini and Saturn retrograde ending on October 28 — creates a particularly interesting setup. The post-Dashain period (October-November) may see profit-taking, especially if Saturn direct triggers sector rotation out of banking stocks.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[0].id,
          viewCount: 672,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'chilime-hydropower-vedic-review',
          title: 'Chilime Hydropower (CHCL): Vedic Technical Review',
          excerpt: 'An in-depth astrological and technical review of Chilime Hydropower stock for 2026.',
          content: 'Chilime Hydropower Company Ltd. (CHCL) is one of the most popular hydropower stocks on NEPSE, with a market capitalization of NPR 45.15 billion. From a Vedic perspective, CHCL\'s incorporation chart shows strong water-sign influence (Pisces rising), making it particularly sensitive to Jupiter and Saturn transits. With Jupiter in Gemini providing supportive trine energy to Pisces throughout 2026, CHCL benefits from the broader positive outlook for the energy sector. The stock closed at Rs. 476.00 on May 15, 2026, with strong technical support at Rs. 450 and resistance at Rs. 540. Our 12-month target is Rs. 520-540, driven by monsoon season hydroelectric output, Jupiter\'s beneficial transit, and Nepal\'s growing electricity demand. Key risk factors include Saturn retrograde in Pisces (June-October) which may cause temporary pullbacks, and regulatory uncertainty around power tariff revisions.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[2].id,
          viewCount: 389,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'nepal-telecom-stock-analysis',
          title: 'Nepal Telecom (NTC): Comprehensive Stock Analysis',
          excerpt: 'Deep dive into Nepal Telecom stock performance, fundamentals, and astrological indicators.',
          content: 'Nepal Telecom is the largest telecommunications company in Nepal and a blue-chip stock on NEPSE. With a near-monopoly in fixed-line services and the largest mobile subscriber base, NTC provides defensive characteristics that make it attractive during volatile market periods. From a Vedic astrology perspective, NTC is ruled by Mercury (communication) and Jupiter (network expansion). The current Jupiter transit through Gemini — a sign ruled by Mercury — creates exceptional synergy for telecom stocks. Historical data shows that NTC outperforms the NEPSE index by an average of 1.5% during Jupiter-in-Gemini periods. The company\'s fundamentals remain strong with consistent dividend yields of 18-22%, growing 5G infrastructure investments, and expanding fiber-optic network coverage across Nepal. Our recommendation: Accumulate on dips below Rs. 380 for a 12-month target of Rs. 440-460.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[2].id,
          viewCount: 556,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'insurance-sector-vedic-outlook',
          title: 'Insurance Sector Vedic Outlook 2026-2027',
          excerpt: 'Astrological forecast for Nepal\'s insurance sector based on planetary transits through 2026 and 2027.',
          content: 'The insurance sector on NEPSE has historically been influenced by Venus (wealth protection) and Jupiter (growth and expansion) transits. In 2026, the astrological setup for insurance stocks is mixed but leans positive. Jupiter\'s transit through Gemini supports the life insurance sub-sector through improved distribution networks and digital insurance platforms. However, the Saturn retrograde in Pisces from June to October 2026 creates headwinds for non-life insurance companies, particularly those exposed to crop and weather-related policies. Our analysis covers the four major insurance themes for 2026-2027: (1) Life Insurance growth driven by Jupiter-Mercury synergy, (2) Non-life insurance challenges during Saturn retrograde, (3) Reinsurance sector restructuring, and (4) Insurtech opportunities emerging from the Gemini transit. Key stocks to watch include NLIC, SICL, and NLI. We recommend a sector weighting of 15-20% in insurance for balanced Vedic portfolios.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[1].id,
          viewCount: 301,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'banking-sector-quarterly-forecast',
          title: 'Banking Sector Quarterly Forecast: Q1 FY2083/84',
          excerpt: 'Quarterly Vedic-based forecast for Nepal\'s banking sector covering July-September 2026.',
          content: 'Nepal\'s banking sector — the heaviest weighted segment on NEPSE — faces a complex astrological environment in Q1 of FY2083/84 (July-September 2026). The quarter begins with Jupiter firmly in Gemini providing a tailwind for trade-financing and commercial banking activities. However, three significant astrological events create challenges: (1) Saturn retrograde in Pisces from June 15 affects banking sentiment and NPL concerns, (2) Venus retrograde in Leo from July 22 impacts luxury lending and credit card segments, and (3) The Lunar Eclipse in Pisces on September 18 creates additional volatility. Our sector model predicts a net positive quarter with gains of 1.5-2.5% for the banking sub-index, but with significant intra-quarter volatility. We recommend an overweight position in well-capitalized "A" class commercial banks (NABIL, NIMB, EBL) and underweight in development banks and micro-finance institutions during the Saturn retrograde period.',
          status: 'DRAFT',
          authorId: editor.id,
          categoryId: categories[0].id,
          viewCount: 145,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'best-vedic-trading-strategies',
          title: 'Best Vedic Trading Strategies for NEPSE in 2026',
          excerpt: 'Proven Vedic astrology-based trading strategies that Nepali investors can apply to the Nepal Stock Exchange.',
          content: 'Combining Vedic astrology with modern technical analysis creates a powerful framework for trading on NEPSE. In this guide, we present seven battle-tested strategies that have shown consistent results over the past 8 years of backtesting. Strategy 1: The Jupiter Transit Rotation — rotate sector allocations based on Jupiter\'s zodiac transit, moving into the ruling sector 2-3 months before the transit begins. Strategy 2: Saturn Retrograde Defensive Positioning — reduce banking exposure by 30% before Saturn retrograde and increase cash allocation. Strategy 3: Venus Conjunction Capture — buy banking and insurance stocks 3-5 days before Venus-Jupiter or Venus-Mercury conjunctions and sell within 5 days after. Strategy 4: Lunar Phase Trading — initiate new positions during New Moon (Amavasya) and take profits during Full Moon (Purnima). Strategy 5: Eclipse Avoidance — stay in cash during the 3-day window around solar and lunar eclipses. Strategy 6: Mercury Retrograde Hedge — buy gold ETFs or increase fixed deposits during Mercury retrograde periods. Strategy 7: Mars Energy Sector Play — allocate 15-20% to hydropower and energy stocks during Mars fire-sign transits (Aries, Leo, Sagittarius). Each strategy includes specific entry/exit rules, position sizing guidelines, and historical win rates based on NEPSE data from 2018-2025.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[3].id,
          viewCount: 2034,
        },
      }),
    ])

    // ---- CREATE STOCKS ----
    const stocks = await Promise.all([
      // === EXISTING 6 STOCKS (kept exactly as-is) ===
      db.stock.create({ data: { symbol: 'NABIL', name: 'Nabil Bank Ltd.', sector: 'Commercial Banks', description: 'One of the leading commercial banks in Nepal. 52-week range: NPR 480.49 - 554.63. Market Cap: NPR 142.59 billion.' } }),
      db.stock.create({ data: { symbol: 'NIMB', name: 'Nepal Investment Mega Bank Ltd.', sector: 'Commercial Banks', description: 'Major commercial bank in Nepal. Market Cap: NPR 67.57 billion. 52-week range: NPR 167 - 231.' } }),
      db.stock.create({ data: { symbol: 'ADBL', name: 'Agricultural Development Bank Ltd.', sector: 'Development Banks', description: 'Agricultural focused development bank. Market Cap: NPR 44.38 billion. 52-week range: NPR 277 - 344.90.' } }),
      db.stock.create({ data: { symbol: 'NLIC', name: 'Nepal Life Insurance Co. Ltd.', sector: 'Life Insurance', description: 'Leading life insurance company in Nepal. 52-week range: NPR 676.19 - 840.10. Book Value: NPR 124.86.' } }),
      db.stock.create({ data: { symbol: 'CHCL', name: 'Chilime Hydropower Company Ltd.', sector: 'Hydropower', description: 'Hydropower generation company. Market Cap: NPR 45.15 billion. 52-week range: NPR 402 - 538.67.' } }),
      db.stock.create({ data: { symbol: 'NRM', name: 'Nepal Republic Media Ltd.', sector: 'Manufacturing', description: 'Media and manufacturing company in Nepal. Market Cap: NPR 3.63 billion. 52-week range: NPR 390.10 - 562.98.' } }),
      // === NEW STOCKS 7-20 ===
      db.stock.create({ data: { symbol: 'EBL', name: 'Everest Bank Ltd.', sector: 'Commercial Banks', description: 'Joint venture commercial bank in Nepal with strong retail banking presence. Market Cap: NPR 38.92 billion. 52-week range: NPR 310 - 395.' } }),
      db.stock.create({ data: { symbol: 'SBI', name: 'Nepal SBI Bank Ltd.', sector: 'Commercial Banks', description: 'Subsidiary of State Bank of India. Market Cap: NPR 25.40 billion. 52-week range: NPR 245 - 318.' } }),
      db.stock.create({ data: { symbol: 'KBL', name: 'Kumari Bank Ltd.', sector: 'Commercial Banks', description: 'Fast-growing commercial bank with strong digital banking platform. Market Cap: NPR 18.75 billion. 52-week range: NPR 195 - 260.' } }),
      db.stock.create({ data: { symbol: 'GBIME', name: 'Global IME Bank Ltd.', sector: 'Commercial Banks', description: 'Largest commercial bank by branch network in Nepal. Market Cap: NPR 52.30 billion. 52-week range: NPR 148 - 198.' } }),
      db.stock.create({ data: { symbol: 'NICA', name: 'NIC Asia Bank Ltd.', sector: 'Commercial Banks', description: 'Leading commercial bank with focus on SME and corporate banking. Market Cap: NPR 41.20 billion. 52-week range: NPR 420 - 560.' } }),
      db.stock.create({ data: { symbol: 'SUNU', name: 'Sunu Bank Ltd.', sector: 'Development Banks', description: 'Development bank with growing presence in the eastern region of Nepal. Market Cap: NPR 8.50 billion. 52-week range: NPR 135 - 175.' } }),
      db.stock.create({ data: { symbol: 'PRVU', name: 'Prabhu Bank Ltd.', sector: 'Commercial Banks', description: 'Commercial bank with strong SME lending portfolio. Market Cap: NPR 22.10 billion. 52-week range: NPR 165 - 220.' } }),
      db.stock.create({ data: { symbol: 'NBB', name: 'Nepal Bangladesh Bank Ltd.', sector: 'Commercial Banks', description: 'Commercial bank with Indo-Nepal trade financing expertise. Market Cap: NPR 12.80 billion. 52-week range: NPR 128 - 168.' } }),
      db.stock.create({ data: { symbol: 'SBL', name: 'Siddhartha Bank Ltd.', sector: 'Commercial Banks', description: 'Technology-driven commercial bank with strong NRI services. Market Cap: NPR 31.60 billion. 52-week range: NPR 280 - 365.' } }),
      db.stock.create({ data: { symbol: 'RBB', name: 'Rastriya Banijya Bank Ltd.', sector: 'Commercial Banks', description: 'Government-owned commercial bank, largest by deposits. Market Cap: NPR 72.00 billion. 52-week range: NPR 72 - 108.' } }),
      db.stock.create({ data: { symbol: 'BPCL', name: 'Butwal Power Company Ltd.', sector: 'Hydropower', description: 'Pioneer hydropower company in Nepal. Market Cap: NPR 28.50 billion. 52-week range: NPR 310 - 420.' } }),
      db.stock.create({ data: { symbol: 'NTC', name: 'Nepal Telecom Ltd.', sector: 'Telecommunication', description: 'National telecommunications authority of Nepal. Market Cap: NPR 125.00 billion. 52-week range: NPR 355 - 445.' } }),
      db.stock.create({ data: { symbol: 'BHPC', name: 'Bhrikuti Pulp & Paper Ltd.', sector: 'Manufacturing', description: 'Paper manufacturing company with environmental sustainability focus. Market Cap: NPR 2.10 billion. 52-week range: NPR 82 - 125.' } }),
      db.stock.create({ data: { symbol: 'UNL', name: 'Unilever Nepal Ltd.', sector: 'Manufacturing', description: 'FMCG company, subsidiary of Unilever plc. Market Cap: NPR 15.80 billion. 52-week range: NPR 8200 - 12500.' } }),
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
      // New stock prices
      EBL:   { open: 348.00, high: 352.00, low: 346.00, close: 350.00, volume: 15420 },
      SBI:   { open: 275.00, high: 278.00, low: 273.00, close: 276.50, volume: 12850 },
      KBL:   { open: 218.00, high: 221.00, low: 216.00, close: 219.00, volume: 18930 },
      GBIME: { open: 162.00, high: 165.00, low: 161.00, close: 164.00, volume: 45210 },
      NICA:  { open: 475.00, high: 480.00, low: 472.00, close: 478.00, volume: 11200 },
      SUNU:  { open: 142.00, high: 145.00, low: 141.00, close: 144.00, volume: 25600 },
      PRVU:  { open: 178.00, high: 182.00, low: 177.00, close: 180.00, volume: 21300 },
      NBB:   { open: 138.00, high: 140.00, low: 136.00, close: 139.00, volume: 9750 },
      SBL:   { open: 298.00, high: 302.00, low: 296.00, close: 300.00, volume: 16800 },
      RBB:   { open: 85.00, high: 87.00, low: 84.00, close: 86.00, volume: 125400 },
      BPCL:  { open: 345.00, high: 350.00, low: 343.00, close: 348.00, volume: 6780 },
      NTC:   { open: 385.00, high: 390.00, low: 383.00, close: 388.00, volume: 34200 },
      BHPC:  { open: 98.00, high: 100.00, low: 96.00, close: 99.00, volume: 4320 },
      UNL:   { open: 10200.00, high: 10500.00, low: 10100.00, close: 10350.00, volume: 125 },
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
      // === EXISTING 5 INDICES (kept exactly as-is) ===
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
      // === NEW INDICES 6-8 ===
      db.marketIndex.create({
        data: {
          name: 'Insurance',
          value: 5215.73,
          change: 8.45,
          changePercent: 0.16,
          volume: 0,
          date: lastTradingDate,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Finance',
          value: 928.50,
          change: -3.21,
          changePercent: -0.34,
          volume: 0,
          date: lastTradingDate,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Manufacturing',
          value: 1124.38,
          change: 5.67,
          changePercent: 0.51,
          volume: 0,
          date: lastTradingDate,
        },
      }),
    ])

    // ---- CREATE VEDIC EVENTS (2026 dates, mix of active and upcoming) ----
    const vedicEvents = await Promise.all([
      // === EXISTING 5 VEDIC EVENTS (kept exactly as-is) ===
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
      // === NEW VEDIC EVENTS 6-15 ===
      db.vedicEvent.create({
        data: {
          id: 'vedic-mercury-retro-gemini',
          name: 'Mercury Retrograde in Gemini',
          eventType: 'RETROGRADE',
          planet: 'Mercury',
          startDate: new Date('2026-06-18'),
          endDate: new Date('2026-07-12'),
          description: 'Mercury retrograde in its own sign of Gemini creates significant communication disruptions and market confusion. Trading decisions made during this period may need revision. Banking and trading stocks are most affected.',
          marketImpact: 'BEARISH',
          impactStrength: 'MEDIUM',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-sun-transit-cancer',
          name: 'Sun Transit to Cancer',
          eventType: 'TRANSIT',
          planet: 'Sun',
          startDate: new Date('2026-06-15'),
          endDate: new Date('2026-07-16'),
          description: 'The Sun transits through Cancer, the sign of emotions and nurturing. This period typically sees increased government activity and policy announcements. Historically positive for insurance and banking sectors as Cancer governs wealth preservation.',
          marketImpact: 'BULLISH',
          impactStrength: 'LOW',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-venus-retro-leo',
          name: 'Venus Retrograde in Leo',
          eventType: 'RETROGRADE',
          planet: 'Venus',
          startDate: new Date('2026-07-22'),
          endDate: new Date('2026-09-03'),
          description: 'Venus retrograde in Leo affects luxury, entertainment, and financial markets. This period often leads to revaluation of financial assets and reconsideration of investment strategies. Luxury goods and hotel stocks may see corrections.',
          marketImpact: 'BEARISH',
          impactStrength: 'MEDIUM',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-jupiter-direct-gemini',
          name: 'Jupiter Direct in Gemini',
          eventType: 'TRANSIT',
          planet: 'Jupiter',
          startDate: new Date('2026-10-18'),
          endDate: new Date('2026-10-18'),
          description: 'Jupiter resumes direct motion in Gemini after a brief stationary period. This marks a significant shift as Jupiter\'s expansive energy fully activates. Markets typically respond with renewed bullish sentiment and increased investment activity.',
          marketImpact: 'BULLISH',
          impactStrength: 'HIGH',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-new-moon-cancer',
          name: 'New Moon in Cancer',
          eventType: 'CONJUNCTION',
          planet: 'Moon',
          startDate: new Date('2026-07-18'),
          endDate: new Date('2026-07-20'),
          description: 'New Moon (Amavasya) in Cancer creates a powerful reset point for markets. Cancer represents accumulated wealth and financial security in Vedic astrology. New Moon periods are ideal for starting new investment positions.',
          marketImpact: 'BULLISH',
          impactStrength: 'LOW',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-full-moon-capricorn',
          name: 'Full Moon in Capricorn',
          eventType: 'CONJUNCTION',
          planet: 'Moon',
          startDate: new Date('2026-08-01'),
          endDate: new Date('2026-08-03'),
          description: 'Full Moon (Purnima) in Capricorn illuminates matters of career, authority, and large institutions. The opposition between Cancer (Moon) and Capricorn (Sun) creates tension between emotional and practical financial decisions.',
          marketImpact: 'NEUTRAL',
          impactStrength: 'LOW',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-mercury-transit-cancer',
          name: 'Mercury Transit to Cancer',
          eventType: 'TRANSIT',
          planet: 'Mercury',
          startDate: new Date('2026-07-30'),
          endDate: new Date('2026-08-14'),
          description: 'Mercury enters Cancer after retrograde in Gemini, bringing clearer communication to financial markets. Mercury in Cancer enhances intuitive decision-making and favors defensive stock positions. Good period for long-term investment planning.',
          marketImpact: 'BULLISH',
          impactStrength: 'LOW',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-venus-transit-cancer',
          name: 'Venus Transit to Cancer',
          eventType: 'TRANSIT',
          planet: 'Venus',
          startDate: new Date('2026-09-05'),
          endDate: new Date('2026-09-29'),
          description: 'Venus moves into Cancer after its retrograde in Leo. This transit brings wealth-preserving energy to markets. Cancer is an excellent sign for Venus, supporting insurance, banking, and real estate sectors with gentle bullish momentum.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-saturn-direct-pisces',
          name: 'Saturn Direct in Pisces',
          eventType: 'TRANSIT',
          planet: 'Saturn',
          startDate: new Date('2026-10-28'),
          endDate: new Date('2026-10-28'),
          description: 'Saturn resumes direct motion in Pisces, ending its 4.5-month retrograde. This is a major turning point for banking and financial stocks. Historical data shows strong relief rallies in the banking sub-index within 2-3 trading days of Saturn direct.',
          marketImpact: 'BULLISH',
          impactStrength: 'HIGH',
        },
      }),
      db.vedicEvent.create({
        data: {
          id: 'vedic-rahu-transit-aquarius',
          name: 'Rahu Transit to Aquarius',
          eventType: 'TRANSIT',
          planet: 'Rahu',
          startDate: new Date('2027-01-15'),
          endDate: new Date('2028-09-01'),
          description: 'Rahu transits into Aquarius (Shatabhisha nakshatra), bringing disruption and innovation to the technology, telecommunications, and banking sectors. Rahu in Aquarius historically coincides with regulatory changes and market structure reforms.',
          marketImpact: 'NEUTRAL',
          impactStrength: 'HIGH',
        },
      }),
    ])

    // ---- CREATE PREDICTIONS (all future dates, with detailed reasoning) ----
    await Promise.all([
      // === EXISTING 6 PREDICTIONS (kept exactly as-is) ===
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
- Hydropower & Energy: Moderate positive impact from Jupiter's expansive energy
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
The high confidence comes from: (1) Both planets are natural benefics, (2) Conjunction occurs in Venus's own sign Taurus, (3) No major malefic aspects from Saturn or Rahu at this time, (4) Historical correlation of 3 out of 3 similar events producing positive NEPSE sessions.`,
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
Saturn retrograde in Pisces means Saturn appears to move backward from Earth's perspective. In Vedic tradition, this creates a period of "karmic review" for matters related to Pisces — banking regulations, loan portfolios, NPL (Non-Performing Loan) concerns, and interest rate policies. During previous Saturn retrogrades in water signs (Cancer 2015, Scorpio 2017), NEPSE banking sub-index dropped an average of 4.2% over the first two weeks.

NABIL-SPECIFIC ANALYSIS:
NABIL closed at Rs. 527.00 on May 15, 2026. Key factors:
- Technical: NABIL is trading near its 52-week high of Rs. 554.63, making it vulnerable to profit-taking
- Fundamental: Q3 FY2082/83 results showed NPL ratio inching up to 2.1%, a concern that Saturn retrograde may amplify
- Astrological: NABIL's IPO chart shows Saturn in the 10th house (career/public image), meaning retrograde Saturn periods historically trigger sector-wide sell-offs
- Liquidity: Nepal Rastra Bank's tight monetary policy ahead of the fiscal year-end adds further pressure

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
          reasoning: `This monthly prediction covers June 2026, the second full month of Jupiter's transit through Gemini. Jupiter transits are among the most significant long-term astrological influences on financial markets, and this one is particularly relevant for NEPSE.

JUPITER IN GEMINI: THE BIG PICTURE:
Jupiter entered Gemini on May 1, 2026, and will remain there until May 2027 — a full 12-month transit. June represents the first full month where the transit energy is fully established. Gemini is an air sign that rules commerce, communication, intellectual pursuits, and adaptability. For Nepal's economy, this translates into favorable conditions for trade, remittance flows, telecommunications, and financial technology.

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
4. Nepal's trade deficit remains elevated, creating currency pressure

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
Mars is the planet of action, aggression, competition, and courage. Leo is a fiery, royal sign ruled by the Sun that represents leadership, authority, government, and power. When Mars enters Leo, it gains significant strength (Mars is friendly toward the Sun, Leo's ruler). This creates a period of bold market moves, high trading activity, and strong opinions.

However, Mars in Leo is also known for "Raj yog" (royal combination) breaking tendencies — what rises fast can also fall fast. This creates a choppy, volatile market environment rather than a sustained trend.

SECTOR-WISE IMPACT:

POSITIVE SECTORS:
1. Hydropower & Energy: Mars rules energy and Leo represents power generation. Hydropower stocks like CHCL may see 3-5% gains during this period. The monsoon season (full flow in August) adds fundamental support.
2. Construction & Real Estate: Mars is the karaka of land and property. Leo's royal energy favors large infrastructure projects.
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

      // === NEW PREDICTIONS 7-20 ===
      // ===== PREDICTION 7: Weekly — Mercury Retrograde in Gemini + GBIME =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[5].id,
          stockId: stocks[9].id,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 63,
          reasoning: `Mercury retrograde in Gemini begins on June 18, 2026, and lasts until July 12. This prediction focuses on Global IME Bank (GBIME) for the week of June 22-26, when the retrograde energy is at its peak intensity. Mercury is the natural ruler of Gemini, making this retrograde especially potent for markets and commerce.

WHY GBIME IS SPECIFICALLY TARGETED:
Global IME Bank is the largest commercial bank in Nepal by branch network, making it the most exposed bank to transaction volume fluctuations and communication-related disruptions. Mercury retrograde directly affects banking operations, payment processing, digital banking platforms, and customer communication — all areas where GBIME has significant market presence. With GBIME trading at Rs. 164.00, the stock is vulnerable to the confusion and miscommunication that characterize Mercury retrograde periods.

MERCURY RETROGRADE IN GEMINI — DETAILED ANALYSIS:
When Mercury retrogrades in its own sign of Gemini, the effect is magnified because Mercury is both the sign ruler and the retrograding planet. This creates a "double Mercury" effect where all Mercurian qualities — commerce, communication, data processing, and intellectual clarity — are simultaneously amplified and distorted. For stock markets, this manifests as: (1) Erratic price movements with no clear fundamental catalyst, (2) False signals from technical indicators, (3) Miscommunication of corporate earnings and guidance, (4) Increased retail investor confusion leading to panic selling, and (5) Higher-than-normal bid-ask spreads as market makers reduce participation.

GBIME-SPECIFIC RISK FACTORS:
- GBIME recently announced expansion into digital banking, a Mercury-ruled domain that faces execution risks during retrograde
- The bank's Q3 results (due for release during this period) may contain revisions or restatements
- Institutional investors typically reduce positions in banking stocks during Mercury retrograde in air signs
- GBIME's high trading volume (45,210 shares on May 15) means retail participation is significant, and retail investors are most prone to Mercury retrograde panic

EXPECTED GBIME PRICE ACTION:
- Week open (June 22): Rs. 158-162
- Mid-week decline (June 24-25): Rs. 148-155
- Week close (June 26): Rs. 150-156
- Expected decline: 4-6% from pre-retrograde levels

BROADER MARKET CONTEXT:
The banking sub-index typically declines 1.5-2.5% during Mercury retrograde in Gemini. However, individual stocks with high retail participation like GBIME often see outsized declines of 4-7%. Combined with the ongoing Saturn retrograde in Pisces, this creates a double-retrograde bearish scenario for banking stocks.

CONFIDENCE JUSTIFICATION (63%):
Moderate confidence based on: (1) Mercury retrograde in its own sign is historically the strongest retrograde for market disruption, (2) GBIME's specific exposure to transaction and communication services, (3) Confluence with Saturn retrograde creating dual bearish pressure. Confidence reduced from 70% because GBIME has shown resilience during previous retrogrades and may find support at Rs. 150.`,
          targetDate: new Date('2026-06-26'),
        },
      }),
      // ===== PREDICTION 8: Monthly — Sun Transit to Cancer (July 2026) =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[6].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BULLISH',
          confidence: 60,
          reasoning: `The Sun transits through Cancer from June 15 to July 16, 2026. This monthly prediction covers the full transit period, focusing on how the Sun's placement in Cancer — the sign of the Moon — affects broader NEPSE market sentiment and sector performance during this one-month window.

SUN IN CANCER: ASTROLOGICAL SIGNIFICANCE:
In Vedic astrology, the Sun (Surya) represents authority, government, leadership, and the collective ego. When the Sun transits Cancer (Karkata), it enters a sign where it is considered debilitated — meaning its natural strength is diminished. However, the Sun in Cancer creates a unique dynamic for financial markets. Cancer is the 4th sign of the zodiac, ruling home, motherland, real estate, vehicles, and inner peace. For Nepal specifically, Cancer holds special significance because it relates to national identity and domestic economic stability.

WHY THIS TRANSIT IS BULLISH FOR NEPSE:
Despite the Sun being debilitated in Cancer, the practical market effect during this transit has historically been positive for NEPSE. The reasons are threefold: (1) Government spending accelerates as the fiscal year-end approaches (mid-July is the end of FY2082/83), (2) Cancer's watery nature supports the monsoon season, which drives hydropower production and agricultural economic activity, and (3) The debilitated Sun makes institutional investors more cautious, which paradoxically reduces volatility and creates a stable rising market.

SECTOR-WISE EXPECTATIONS:
- Banking: Moderate gains of 1-2%. Government spending on infrastructure projects boosts loan demand. However, the Sun's debilitation means gains are slow and steady rather than explosive.
- Insurance: Strong gains of 2-3%. Cancer rules protection and nurturing, themes that align with insurance. Life insurance companies particularly benefit.
- Hydropower: Gains of 3-5% during the monsoon peak. Full river flow in July maximizes electricity generation, creating both fundamental and astrological tailwinds.
- Real Estate: Positive sentiment driven by Cancer's association with land and property. However, actual gains may be limited by regulatory constraints.
- Manufacturing: Neutral. Input costs may rise during monsoon, but domestic demand remains stable.

MACROECONOMIC FACTORS:
- Remittance inflows typically peak in June-July as Nepali workers abroad send funds before Dashain
- Nepal Rastra Bank's monetary policy review in mid-July is likely to maintain accommodative stance
- The monsoon forecast for 2026 is above-average, supporting agriculture and hydropower sectors
- Nepal's GDP growth forecast for FY2082/83 is 5.8%, with Q4 numbers being particularly strong

HISTORICAL BENCHMARKS:
In the last 5 Sun-in-Cancer transits (2021-2025), NEPSE gained an average of 2.1% with a 4:1 positive-to-negative ratio. The most significant gains occurred in 2023 (+3.2%) when the transit coincided with strong monsoon data and government spending.

RISK FACTORS:
1. Saturn retrograde overlapping this period (June 15 - October 28) creates a Sun-Saturn opposition that may cause brief corrections
2. Mercury retrograde in Gemini (June 18 - July 12) adds market confusion during the first half
3. Global recession fears and US Federal Reserve policy may dampen emerging market enthusiasm
4. Nepal's trade deficit reaching record levels could create currency pressure

CONFIDENCE JUSTIFICATION (60%):
Moderate confidence. The Sun in Cancer transit has a strong historical bullish track record, and the macroeconomic backdrop (monsoon, remittance, government spending) is supportive. However, the overlapping Saturn retrograde and Mercury retrograde reduce confidence. The prediction is BULLISH but with modest expected gains of 1.5-2.5% for the NEPSE index.`,
          targetDate: new Date('2026-07-01'),
        },
      }),
      // ===== PREDICTION 9: Monthly — Venus Retrograde in Leo (August 2026) =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[7].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BEARISH',
          confidence: 61,
          reasoning: `Venus retrograde in Leo begins on July 22, 2026, and lasts until September 3, 2026. This monthly prediction covers the full retrograde period, analyzing its impact on NEPSE market sentiment, sector rotation, and investor behavior. Venus retrograde is one of the more significant planetary events for financial markets.

VENUS RETROGRADE IN LEO: COMPREHENSIVE ANALYSIS:
Venus (Shukra) is the natural karaka of wealth, luxury, comfort, relationships, and financial prosperity. In Vedic astrology, Venus also rules banking, financial institutions, art, entertainment, and feminine energy. When Venus retrogrades in Leo (Simha), these areas undergo a period of reevaluation and reassessment. Leo is a fiery sign ruled by the Sun that represents royalty, authority, drama, and ego. The combination of Venus retrograde in Leo creates a situation where financial confidence is shaken, luxury spending declines, and investors question their portfolio strategies.

KEY THEMES FOR THIS RETROGRADE PERIOD:
1. Reevaluation of Asset Values: Investors may question whether stocks are fairly valued, leading to broad-based selling pressure. This is particularly relevant for NEPSE, where price-to-book ratios for banking stocks remain elevated.
2. Luxury Sector Correction: Hotels, tourism, and premium consumer goods companies may see significant declines as Venus retrograde dampens spending on luxury items.
3. Banking Sector Vulnerability: Venus rules financial institutions, and its retrograde motion may reveal hidden issues in loan portfolios, credit quality, or banking sector profitability.
4. Relationship Strain: Corporate partnerships, mergers, and acquisitions may face delays or cancellations during this period.
5. Gold and Fixed Income Outperformance: Venus retrograde typically drives investors toward safe-haven assets, benefiting gold prices and fixed deposit rates.

MARKET-LEVEL EXPECTATIONS:
The NEPSE index is expected to decline 1.5-3% during the Venus retrograde period (July 22 - September 3). However, the decline is likely to be gradual rather than sharp, with periodic relief rallies when other benefic planets form supportive aspects.

SECTOR-SPECIFIC IMPACT:
- Commercial Banks: Expected decline of 2-3%. Banking is a Venus-ruled sector, and the retrograde may trigger NPL concerns and credit quality reassessment.
- Insurance: Expected decline of 1-2%. Life insurance companies less affected than non-life insurers.
- Hotels & Tourism: Expected decline of 3-5%. Leo rules entertainment and luxury, making this sector the most vulnerable.
- Hydropower: Neutral to slightly positive. Energy stocks are not directly ruled by Venus and may benefit from monsoon-season fundamental strength.
- Manufacturing: Mixed. FMCG companies may see slight gains as consumers shift from luxury to essential goods.
- Telecommunications: Neutral. Tech-sector companies are largely unaffected by Venus retrograde.

TIMING CONSIDERATIONS:
The retrograde effect is strongest in the first and last weeks (July 22-29 and August 27 - September 3). The middle period (August) may see some stabilization as the market adjusts. Additionally, the Full Moon in Capricorn on August 1 and Mars-Saturn opposition on August 10 create additional volatility points within the retrograde window.

HISTORICAL PRECEDENT:
The last Venus retrograde in Leo occurred in July-August 2023. During that period, NEPSE declined 2.3% with hotels and tourism stocks declining 5.8%. Banking stocks declined 2.1% and the overall market showed reduced liquidity.

CONFIDENCE JUSTIFICATION (61%):
Moderate confidence. Venus retrograde in Leo has a well-documented bearish historical record for financial markets. The confidence is moderate rather than high because: (1) The Jupiter in Gemini transit provides some counterbalance, (2) Monsoon season fundamentals may support certain sectors, (3) Government spending ahead of the new fiscal year creates buying pressure. However, the Leo location makes this one of the stronger Venus retrograde configurations for market disruption.`,
          targetDate: new Date('2026-08-01'),
        },
      }),
      // ===== PREDICTION 10: Weekly — Jupiter Direct in Gemini + CHCL =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[8].id,
          stockId: stocks[4].id,
          predictionType: 'WEEKLY',
          prediction: 'BULLISH',
          confidence: 74,
          reasoning: `Jupiter resumes direct motion in Gemini on October 18, 2026. This prediction focuses on Chilime Hydropower (CHCL) for the week of October 19-23, when the direct motion energy creates a powerful catalyst for hydropower stocks. The combination of Jupiter direct and the approaching end of the monsoon season makes this a high-conviction trade.

WHY CHCL IS THE PRIMARY BENEFICIARY:
Chilime Hydropower Company is one of the most established hydropower stocks on NEPSE and is deeply connected to both Jupiter and water-sign energy in Vedic astrology. CHCL's incorporation chart has a Pisces rising sign, and Jupiter's direct motion in Gemini creates a powerful trine (120-degree aspect) to Pisces. This trine is one of the most auspicious aspects in Vedic astrology, representing flow, harmony, and effortless growth. Additionally, CHCL's operational performance peaks during the post-monsoon period (October-November) when reservoir levels are at their highest.

JUPITER DIRECT MOTION — WHAT IT MEANS:
When Jupiter appears to resume forward motion after a retrograde or stationary period, it represents a release of pent-up energy and a restoration of confidence. In financial astrology, Jupiter direct periods are associated with: (1) Renewed institutional buying, (2) Expansion of credit and lending, (3) Positive government policy announcements, (4) Foreign capital inflows into emerging markets, and (5) Broader market rallies. The effect is especially strong when Jupiter stations direct in its own friendly sign — and Gemini is favorable for Jupiter's expansion energy.

CHCL FUNDAMENTAL BACKDROP:
- CHCL operates with 22.1 MW installed capacity, with consistent power generation throughout the year
- The company has an additional 30 MW (Sanjen) and 14.8 MW (Madhya Bhotekoshi) projects under development
- Q2 FY2083/84 results (to be released in October) are expected to show strong earnings driven by peak monsoon generation
- The Nepal Electricity Authority (NEA) has signed favorable power purchase agreements (PPAs) for CHCL's generation
- The stock closed at Rs. 476.00 on May 15, and by October it is expected to be trading near Rs. 490-500 range

EXPECTED CHCL PRICE ACTION:
- Week open (October 19): Rs. 488-495
- Mid-week rally (October 21-22): Rs. 510-520
- Week close (October 23): Rs. 508-518
- Expected gain: 3-5% for the week

CONFLUENCE WITH OTHER EVENTS:
The Jupiter direct motion coincides with: (1) Saturn also preparing to go direct on October 28, creating a "double direct" bullish catalyst, (2) Dashain festival season when market sentiment is traditionally positive, (3) End of monsoon season creating strong hydropower generation data, (4) New fiscal year budget implementation boosting infrastructure spending.

RISK FACTORS:
1. If CHCL's Q2 results disappoint, the bullish thesis is weakened
2. Nepal Electricity Authority payment delays could affect investor sentiment
3. Global energy price volatility may impact the broader energy sector
4. Profit-taking after a potential pre-Dashain rally may limit upside

CONFIDENCE JUSTIFICATION (74%):
High confidence because: (1) Jupiter direct in Gemini creates a direct trine to CHCL's Pisces rising, (2) The fundamental backdrop for hydropower in October is very strong, (3) Dashain season historically produces positive returns, (4) Double direct motion (Jupiter + approaching Saturn direct) creates compounding bullish energy. Confidence reduced from 80% because October 2026 is several months away and global conditions are uncertain.`,
          targetDate: new Date('2026-10-22'),
        },
      }),
      // ===== PREDICTION 11: Daily — New Moon in Cancer =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[9].id,
          stockId: null,
          predictionType: 'DAILY',
          prediction: 'BULLISH',
          confidence: 55,
          reasoning: `The New Moon (Amavasya) occurs in Cancer on July 18, 2026. This daily prediction covers July 20, the first trading day following the New Moon, which is traditionally considered an auspicious time for initiating new investment positions in Vedic financial astrology.

NEW MOON IN CANCER: VEDIC SIGNIFICANCE:
The New Moon represents the start of a new lunar cycle, symbolizing fresh beginnings, new intentions, and the planting of seeds. When this New Moon occurs in Cancer — the sign ruled by the Moon itself — the effect is amplified because the Moon is in its own sign (swasthana). In Cancer, the Moon represents: (1) Emotional security and financial safety nets, (2) Domestic economic stability, (3) Banking and financial institutions that safeguard wealth, (4) Real estate and property markets, and (5) Maternal, nurturing energy that supports long-term investment growth.

WHY THIS NEW MOON IS SPECIAL:
Several factors make this particular New Moon more significant than usual for financial markets: (1) The Moon in Cancer is at its strongest (exalted), providing clear intuition and emotional clarity for investors, (2) Jupiter in Gemini forms a supportive trine aspect to Cancer, amplifying the bullish energy, (3) The New Moon occurs just as Mercury retrograde is ending (July 12), so markets are clearing confusion and finding direction, (4) The monsoon is at its peak, creating strong fundamental tailwinds for the Nepalese economy.

EXPECTED MARKET BEHAVIOR ON JULY 20:
- NEPSE Index: Expected gain of 0.3-0.7% on the trading day
- Banking Sub-index: Strong gains of 0.5-1.2% as Cancer rules banking
- Insurance Sub-index: Moderate gains of 0.4-0.8%
- Trading Volume: 10-15% above average as institutional investors reposition
- Market Breadth: Advance-decline ratio expected at 2:1 or better

SECTOR-SPECIFIC RECOMMENDATIONS:
- BUY: Banking stocks (Cancer-ruled), Insurance stocks, Hydropower (monsoon fundamental support)
- HOLD: Manufacturing, Telecommunication
- CAUTION: Hotels and tourism (Venus retrograde approaching on July 22)

LUNAR CYCLE STRATEGY:
The New Moon in Cancer marks the beginning of the Shukla Paksha (waxing phase), which historically correlates with rising markets. The 15-day period following this New Moon (July 20 - August 3) is expected to be the strongest bullish window of July 2026. Traders should consider: (1) Initiating new long positions on July 20, (2) Adding to existing positions during the waxing phase, (3) Reducing exposure near the Full Moon on August 1 when emotional energy peaks and correction risk increases.

HISTORICAL ANALYSIS:
In the last 8 New Moons in Cancer (2018-2025), NEPSE gained an average of 0.5% on the first trading day following the New Moon. The 15-day Shukla Paksha following these New Moons produced average gains of 1.8%.

CONFIDENCE JUSTIFICATION (55%):
Low-moderate confidence. New Moon predictions have a strong theoretical basis in Vedic astrology, but the effect is often subtle and can be easily overridden by macroeconomic events. The confidence is elevated by: (1) Moon in its own sign, (2) Jupiter trine support, (3) Post-Mercury retrograde clarity. However, confidence is reduced by: (1) Venus retrograde beginning July 22 (just 2 days later), (2) Saturn retrograde creating ongoing banking sector pressure, (3) Daily predictions inherently have wider error margins than weekly or monthly predictions.`,
          targetDate: new Date('2026-07-20'),
        },
      }),
      // ===== PREDICTION 12: Weekly — Full Moon in Capricorn + NLIC =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[10].id,
          stockId: stocks[3].id,
          predictionType: 'WEEKLY',
          prediction: 'NEUTRAL',
          confidence: 50,
          reasoning: `The Full Moon (Purnima) in Capricorn occurs on August 1, 2026. This weekly prediction covers August 3-7 and focuses on Nepal Life Insurance Company (NLIC). The Full Moon creates a dynamic tension between Cancer (where the Moon is exalted) and Capricorn (where the Moon is debilitated), producing mixed signals for financial markets.

FULL MOON IN CAPRICORN: ASTROLOGICAL DYNAMICS:
A Full Moon occurs when the Sun and Moon are exactly opposite each other, creating maximum illumination but also maximum tension. In this case, the Sun is in Cancer and the Moon is in Capricorn — the two signs that represent the home versus the career, the private versus the public, and emotional security versus material ambition. For stock markets, this opposition creates a push-pull dynamic: investors feel both optimistic (Cancer's nurturing energy) and anxious (Capricorn's harsh reality). The result is typically a volatile, directionless market.

WHY NLIC IS THE FOCUS:
Nepal Life Insurance Company is the largest life insurance company in Nepal and serves as a bellwether for the insurance sector. NLIC is particularly sensitive to Moon transits because the insurance industry is fundamentally about risk management and future security — themes ruled by the Moon. The Full Moon in Capricorn affects NLIC because: (1) Capricorn represents long-term financial planning and commitments (life insurance themes), (2) The Sun-Moon opposition creates a reevaluation of insurance needs, (3) NLIC's stock tends to move in a narrow range during Full Moon periods as institutional investors adopt a wait-and-see approach.

NLIC CURRENT POSITION:
NLIC closed at Rs. 762.00 on May 15, 2026, with a 52-week range of Rs. 676.19 - Rs. 840.10. The stock has been in a consolidation phase for the past 3 months, trading between Rs. 740 and Rs. 780. Life insurance stocks in Nepal typically benefit from stable market conditions but underperform during high volatility periods.

EXPECTED NLIC PRICE ACTION:
- Week open (August 3): Rs. 758-765
- Mid-week volatility (August 5): Rs. 748-770
- Week close (August 7): Rs. 755-765
- Expected change: Neutral (within 1% of opening price)

BROADER INSURANCE SECTOR:
The entire insurance sub-index is expected to trade in a narrow range during this week. Life insurance companies (NLIC, SICL, NLI) may show marginal gains of 0.5-1%, while non-life insurance companies face pressure from the ongoing Venus retrograde in Leo (July 22 - September 3). The Full Moon's mixed signals are unlikely to produce a clear directional move.

CONFLUENCE FACTORS:
1. Venus retrograde in Leo is in its third week, creating some ongoing pressure on financial assets
2. Mars is transiting Leo, adding energy but also volatility
3. The monsoon season is at its peak, providing fundamental support to the broader economy
4. The Nepal Rastra Bank is expected to announce monetary policy for the new fiscal year during this period

HISTORICAL PATTERN:
Over the last 6 Full Moons in Capricorn (2019-2025), NLIC showed the following pattern: (1) Average weekly change: -0.2%, (2) Intraday volatility: 2-3%, (3) No significant trend in either direction, (4) Trading volume typically 5-10% below average as institutional investors step back.

CONFIDENCE JUSTIFICATION (50%):
Low confidence, matching the NEUTRAL prediction. The Full Moon in Capricorn creates opposing forces that are difficult to resolve directionally. NLIC's consolidation pattern further suggests a range-bound outcome. The confidence is not higher because: (1) The Venus retrograde adds bearish bias, but the monsoon season and Jupiter transit add bullish bias, (2) NLIC has shown no clear trend, (3) The prediction window is only one week, which is insufficient for the opposing forces to resolve. NEUTRAL is the most honest assessment given these competing factors.`,
          targetDate: new Date('2026-08-07'),
        },
      }),
      // ===== PREDICTION 13: Weekly — Mercury Transit to Cancer + NTC =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[11].id,
          stockId: stocks[17].id,
          predictionType: 'WEEKLY',
          prediction: 'BULLISH',
          confidence: 66,
          reasoning: `Mercury transits into Cancer on July 30, 2026, and remains until August 14. This prediction focuses on Nepal Telecom (NTC) for the week of August 3-7. After the disruptive Mercury retrograde in Gemini (June 18 - July 12), Mercury's entry into Cancer brings clarity and stability to communication and technology stocks.

WHY NTC IS THE PRIMARY BENEFICIARY:
Nepal Telecom is the largest telecommunications company in Nepal and is directly ruled by Mercury (Budh) in Vedic astrology. Mercury represents communication, networks, data transfer, and technology — all core aspects of NTC's business. When Mercury transits through Cancer after a retrograde, it creates a "clean start" energy for communication-sector stocks. NTC specifically benefits because: (1) Mercury in Cancer enhances intuitive decision-making in technology investments, (2) Cancer's nurturing energy supports infrastructure expansion (NTC's fiber-optic and 5G rollout), (3) The transit follows Mercury retrograde, meaning the confusion and miscommunication of the retrograde period is now resolving into clear forward momentum.

MERCURY IN CANCER: DETAILED TRANSIT ANALYSIS:
Mercury in Cancer is an interesting placement because Mercury (an intellectual, analytical planet) is in the sign of emotions and intuition. This creates a blend of analytical thinking with emotional intelligence — an excellent combination for investment decisions in the telecommunications sector. Specifically, Mercury in Cancer: (1) Favors long-term infrastructure investments over short-term speculation, (2) Enhances the value of communication networks and data services, (3) Supports government-related technology initiatives (NTC is majority government-owned), and (4) Creates favorable conditions for corporate partnerships and joint ventures in the telecom space.

NTC FUNDAMENTAL BACKDROP:
- NTC is Nepal's dominant telecommunications provider with over 22 million mobile subscribers
- The company is investing heavily in 5G infrastructure with trials underway in Kathmandu Valley
- Fiber-to-the-home (FTTH) coverage is expanding to 75% of urban areas
- Annual revenue exceeds NPR 38 billion with consistent profitability
- Dividend yield of approximately 20% makes it attractive for income-focused investors
- Stock closed at Rs. 388.00 on May 15, and by August is expected to be near Rs. 395-400

EXPECTED NTC PRICE ACTION:
- Week open (August 3): Rs. 395-400
- Mid-week strength (August 5-6): Rs. 405-412
- Week close (August 7): Rs. 402-410
- Expected gain: 2-4% for the week

BROADER TELECOM SECTOR OUTLOOK:
Nepal's telecommunications sector is poised for significant growth in FY2083/84. Government policy supporting digital Nepal, NTC's 5G rollout, and increasing data consumption across the country create strong fundamental tailwinds. The Mercury transit adds an astrological catalyst to an already-positive fundamental story.

CONFLUENCE WITH OTHER EVENTS:
- Jupiter in Gemini provides supportive trine energy to Cancer-ruled sectors
- Mars in Leo (July 10 - August 24) creates some volatility but also drives technology-sector interest
- Post-Mercury retrograde clarity benefits all communication stocks
- Monsoon season at its peak supports rural telecom infrastructure development

CONFIDENCE JUSTIFICATION (66%):
Moderate-high confidence because: (1) Mercury directly rules NTC and the transit into Cancer is highly favorable, (2) Post-retrograde clarity creates momentum, (3) Fundamental backdrop for Nepal Telecom is very strong, (4) Jupiter trine provides additional support. Confidence reduced from 72% because: (1) Venus retrograde in Leo creates some cross-currents for financial markets overall, (2) NTC is a slow-moving large-cap stock that rarely shows dramatic weekly moves, (3) Government policy changes could affect NTC's business model.`,
          targetDate: new Date('2026-08-07'),
        },
      }),
      // ===== PREDICTION 14: Monthly — Venus Transit to Cancer (September 2026) =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[12].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BULLISH',
          confidence: 62,
          reasoning: `Venus transits into Cancer on September 5, 2026, and remains until September 29. This monthly prediction covers the full transit period, analyzing how Venus — the planet of wealth and prosperity — performs in the nurturing, protective sign of Cancer. This transit follows the Venus retrograde in Leo (July 22 - September 3), creating a significant shift in financial market energy.

VENUS IN CANCER: ASTROLOGICAL SIGNIFICANCE:
Venus (Shukra) in Cancer (Karkata) is considered a highly auspicious placement in Vedic astrology. Cancer is an earthy-water sign that represents home, family, emotional security, and accumulated wealth. Venus in Cancer creates an energy that favors: (1) Wealth preservation over aggressive growth, (2) Investment in tangible assets (real estate, gold, land), (3) Banking and insurance sectors that protect financial security, (4) Consumer goods and food-related companies, and (5) Long-term portfolio building rather than short-term trading.

WHY THIS TRANSIT IS SIGNIFICANT:
This Venus transit is particularly important because it immediately follows the Venus retrograde in Leo (July 22 - September 3). When Venus first enters Cancer, it is at its "fresh" strength — having just recovered from the retrograde period that sapped its energy. This creates a powerful "relief rally" effect as financial markets recover from the revaluation and uncertainty of the retrograde period. Historically, the first Venus transit after a retrograde produces above-average market gains.

MONTHLY FORECAST FOR SEPTEMBER 2026:
The NEPSE index is expected to gain 2.5-4% during September 2026, with the strongest gains occurring in the first two weeks (September 5-18). The period after the Lunar Eclipse (September 18-30) may see some profit-taking, but the overall month should remain positive.

SECTOR-WISE BREAKDOWN:
- Commercial Banks: Expected gains of 3-4%. Venus in Cancer directly supports banking wealth-preservation themes. NABIL, NIMB, and EBL are the primary beneficiaries.
- Insurance: Strong gains of 2-3%. Cancer's protective energy aligns perfectly with insurance sector fundamentals.
- Hydropower: Moderate gains of 1-2%. Post-monsoon season provides fundamental support, though Venus does not directly rule energy.
- Real Estate: Positive sentiment but limited stock market impact (few listed real estate companies on NEPSE).
- Hotels & Tourism: Recovery from Venus retrograde lows. Gains of 2-3% as tourist season approaches.
- Manufacturing: Gains of 1-2%. FMCG and food-processing companies benefit from Venus in Cancer's domestic consumption theme.

MACROECONOMIC SUPPORT:
- September is the pre-Dashain period, historically the strongest month for retail and consumer spending
- Nepal's foreign exchange reserves are expected to improve as remittance flows remain strong
- The Lunar Eclipse in Pisces on September 18 creates a brief interruption, but Venus in Cancer provides recovery energy
- Nepal Rastra Bank's monetary policy for the new fiscal year is expected to be accommodative

HISTORICAL ANALYSIS:
In the last 5 Venus-in-Cancer transits (2019-2025), NEPSE gained an average of 3.2%. The transit following a Venus retrograde (which this is) showed even stronger average gains of 4.1%. Banking stocks gained an average of 4.5% during these periods.

CONFIDENCE JUSTIFICATION (62%):
Moderate confidence. The Venus-in-Cancer transit has a strong historical bullish record, and the "relief rally" following the Venus retrograde adds conviction. However, confidence is moderated by: (1) The Lunar Eclipse in Pisces on September 18 creating mid-month volatility, (2) Global economic uncertainty in September 2026, (3) Nepal's trade deficit remains a concern, (4) The post-retrograde recovery may be slower than expected if investor confidence was deeply shaken.`,
          targetDate: new Date('2026-09-15'),
        },
      }),
      // ===== PREDICTION 15: Weekly — Saturn Direct in Pisces + NABIL =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[13].id,
          stockId: stocks[0].id,
          predictionType: 'WEEKLY',
          prediction: 'BULLISH',
          confidence: 71,
          reasoning: `Saturn resumes direct motion in Pisces on October 28, 2026. This prediction focuses on Nabil Bank (NABIL) for the week of October 29 - November 2, marking a major reversal from the bearish prediction made at the start of Saturn's retrograde on June 15. Saturn direct represents the resolution of the banking sector's karmic review period.

WHY NABIL IS THE PRIMARY BENEFICIARY:
Nabil Bank, as Nepal's largest commercial bank by market capitalization, is the most sensitive stock to Saturn transits through Pisces. During Saturn retrograde (June 15 - October 28), NABIL was predicted to decline 3-5%. Now, as Saturn goes direct, the same forces reverse: NPL concerns ease, banking regulations become clearer, institutional confidence returns, and the "karmic review" of the banking sector is complete. This creates a powerful bullish reversal signal for NABIL specifically and banking stocks generally.

SATURN DIRECT IN PISCES — THE MECHANICS:
Saturn retrograde creates a period of introspection, reassessment, and sometimes punishment for the sectors it governs. In Pisces, this meant banking regulations were scrutinized, NPL ratios were highlighted, and investor confidence in financial institutions was tested. When Saturn goes direct, this review period ends, and the results of the review are integrated into market prices. If the review reveals that the banking sector is fundamentally sound (which it is in Nepal), the result is a relief rally.

SPECIFIC CATALYSTS FOR NABIL:
1. Q2 FY2083/84 Results: NABIL's quarterly results (expected in October) are likely to show stable NPL ratios and improved net interest margins, validating that the Saturn retrograde concerns were overblown.
2. Nepal Rastra Bank Policy: The central bank's monetary policy for the new fiscal year is expected to include liquidity support measures, directly benefiting NABIL's loan growth.
3. Institutional Rebalancing: Large mutual funds and institutional investors who reduced banking exposure during Saturn retrograde will rebalance back, creating strong buying pressure.
4. Dashain Effect: The October 28 date coincides with the post-Dashain period when market sentiment is seasonally positive.

EXPECTED NABIL PRICE ACTION:
- Week open (October 29): Rs. 505-512
- Mid-week rally (October 31 - November 1): Rs. 525-535
- Week close (November 2): Rs. 522-532
- Expected gain: 3-5% for the week, potentially recovering most of the Saturn retrograde losses

BROADER BANKING SECTOR IMPACT:
- NIMB: Expected to gain 2-4%
- EBL: Expected to gain 2-3%
- ADBL: Expected to gain 1-3%
- RBB: Expected to gain 3-5% (government-owned bank benefits most from policy clarity)
- Overall Banking Sub-index: Expected gain of 2.5-3.5%

CONFLUENCE WITH JUPITER DIRECT:
Saturn goes direct on October 28, just 10 days after Jupiter went direct in Gemini (October 18). This "double direct" alignment is extremely rare and historically very bullish for NEPSE. The last time Jupiter and Saturn went direct within 2 weeks of each other was in November 2022, when NEPSE gained 4.5% over the subsequent month.

CONFIDENCE JUSTIFICATION (71%):
High confidence because: (1) Saturn direct is one of the most reliable reversal signals in Vedic financial astrology, (2) The specific stock (NABIL) is the most directly affected, (3) Double direct alignment with Jupiter amplifies the bullish effect, (4) Dashain season provides seasonal support, (5) Fundamental catalysts (Q2 results, NRB policy) align with astrological timing. Confidence reduced from 78% because NABIL's valuation remains elevated and profit-taking may limit upside.`,
          targetDate: new Date('2026-11-02'),
        },
      }),
      // ===== PREDICTION 16: Monthly — Rahu Transit to Aquarius (January 2027) =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[14].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BEARISH',
          confidence: 56,
          reasoning: `Rahu transits into Aquarius on January 15, 2027, and will remain there until approximately September 2028. This monthly prediction covers the initial impact period of January-February 2027, when Rahu's energy first begins to manifest in its new sign. Rahu transits are among the most disruptive and transformative events in Vedic astrology.

RAHU IN AQUARIUS: COMPREHENSIVE ANALYSIS:
Rahu (the North Node of the Moon) is the planet of illusion, disruption, unconventional thinking, and sudden transformation. Aquarius (Kumbha) is an air sign ruled by Saturn that represents technology, telecommunications, mass communication, social networks, and collective innovation. When Rahu enters Aquarius, it creates a powerful combination that affects: (1) Technology and telecommunications sectors with sudden innovation and disruption, (2) Banking sector with potential regulatory changes and digital banking transformation, (3) Social and mass movements that can affect market sentiment, (4) Collective psychology shifts that may drive irrational exuberance or panic, and (5) The emergence of new market leaders and the decline of established ones.

WHY THIS TRANSIT IS BEARISH (INITIALLY):
While Rahu transits ultimately drive innovation and growth, the initial months of a Rahu transit are typically turbulent. The reasons for the bearish initial outlook are: (1) Rahu creates illusion and confusion — investors may misinterpret market signals, (2) Aquarius rules banking regulation, and Rahu's entry may trigger unexpected policy changes from Nepal Rastra Bank, (3) Technology stocks may see speculative bubbles followed by crashes, (4) The collective psychology becomes unsettled as old paradigms are questioned, (5) Rahu's energy is erratic, creating market conditions that are difficult to trade.

MONTHLY FORECAST FOR JANUARY-FEBRUARY 2027:
The NEPSE index is expected to decline 1-3% in January 2027, with potential for sharper declines if Rahu triggers unexpected regulatory changes. February may see some stabilization as markets adapt to the new energy, but the overall two-month period is expected to be negative.

SECTOR-SPECIFIC IMPACT:
- Commercial Banks: Mixed to negative. Rahu in Aquarius may trigger banking regulation changes. Well-capitalized banks (NABIL, NIMB) may weather the storm, but smaller banks face heightened scrutiny.
- Telecommunications: Volatile. NTC may see both sharp gains (from innovation expectations) and sharp declines (from regulatory uncertainty). Net effect is likely neutral to slightly negative.
- Technology Companies: Highly volatile. Rahu in Aquarius creates speculative fervor around technology stocks, but bubbles often burst during Rahu transits.
- Hydropower: Relatively insulated from Rahu's influence. May serve as a safe haven during the volatility.
- Insurance: Neutral. Insurance companies are not directly affected by Rahu in Aquarius.

HISTORICAL PRECEDENT:
The last Rahu transit into Aquarius occurred in March 2025. During the initial 2-month period (March-April 2025), NEPSE declined 2.8% with banking stocks leading the decline. The banking sub-index dropped 4.1% on news of proposed digital banking regulations. Technology stocks saw extreme volatility with several gaining 15-20% before giving back most of those gains.

KEY DATES TO WATCH:
- January 15, 2027: Rahu enters Aquarius — initial market uncertainty
- January 25-28: Rahu conjuncts Saturn (both in Aquarius) — highest volatility period
- February 2027: Market adaptation phase — some stabilization possible
- March-April 2027: Rahu settles into its new sign — trends become clearer

CONFIDENCE JUSTIFICATION (56%):
Low-moderate confidence. Rahu transits are inherently unpredictable — the "planet of illusion" defies conventional forecasting. The bearish initial outlook is based on historical precedent and the nature of Rahu's energy, but the confidence is not high because: (1) Rahu can surprise in either direction, (2) The transit spans 18 months and the initial period may not be representative, (3) Global economic conditions in January 2027 are unknown, (4) Nepal's specific regulatory environment may or may not respond to Rahu's influence.`,
          targetDate: new Date('2027-01-20'),
        },
      }),
      // ===== PREDICTION 17: Weekly — Mars Transit to Leo + BPCL =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[3].id,
          stockId: stocks[16].id,
          predictionType: 'WEEKLY',
          prediction: 'BULLISH',
          confidence: 67,
          reasoning: `Mars transits into Leo on July 10, 2026, and this prediction focuses on Butwal Power Company (BPCL) for the week of July 13-17. BPCL, as a hydropower company, is particularly sensitive to Mars energy due to the fiery, power-generating nature of both Mars and hydropower operations. The combination creates a strong bullish catalyst.

WHY BPCL IS SPECIFICALLY AFFECTED:
Butwal Power Company is a pioneer in Nepal's hydropower sector, and its stock price has shown consistent correlation with Mars transits through fire signs (Aries, Leo, Sagittarius). The reasons are threefold: (1) Mars is the karaka of energy, power, and electricity generation — directly aligning with BPCL's core business of hydroelectric power production, (2) Leo is the sign of royalty and power, representing large-scale energy infrastructure and government-backed power projects, (3) The monsoon season (July) is at its peak during this transit, creating both astrological and fundamental alignment for hydropower stocks.

MARS IN LEO — ENERGY SECTOR IMPACT:
Mars in Leo is one of the most powerful placements for energy-related investments. Mars represents: (1) Raw energy and power generation, (2) Engineering and construction capabilities, (3) Government contracts and infrastructure projects, (4) Aggressive business expansion, and (5) Technical excellence in manufacturing and production. When Mars transits Leo, these qualities are amplified because Leo provides royal authority and scale to Mars's energy. For hydropower stocks specifically, this translates into: (1) Higher electricity generation output, (2) Favorable power purchase agreement negotiations, (3) Government support for energy infrastructure projects, and (4) Increased investor interest in the energy sector.

BPCL FUNDAMENTAL BACKDROP:
- BPCL operates 12.3 MW of hydropower capacity through its flagship Khudi Khola project
- The company has additional projects under development totaling 50+ MW
- Monsoon season in July ensures maximum water flow and generation capacity
- Nepal Electricity Authority (NEA) pays competitive tariffs for BPCL's generation
- BPCL has a strong track record of consistent dividend payments
- Stock closed at Rs. 348.00 on May 15, and by mid-July is expected to be near Rs. 355-360

EXPECTED BPCL PRICE ACTION:
- Week open (July 13): Rs. 355-360
- Mid-week rally (July 15-16): Rs. 370-378
- Week close (July 17): Rs. 365-375
- Expected gain: 3-5% for the week

BROADER HYDROPOWER SECTOR:
The entire hydropower sub-index is expected to gain 2-4% during this week. Chilime (CHCL) and BPCL are the primary beneficiaries, with smaller hydropower companies also seeing positive movement. The Mars transit provides the astrological catalyst while the monsoon season provides fundamental support — a powerful combination.

RISK FACTORS:
1. NEA payment delays could affect investor sentiment toward hydropower stocks
2. Environmental concerns around new hydro projects could create regulatory headwinds
3. Mars in Leo is volatile — sharp gains could be followed by equally sharp corrections
4. Venus retrograde beginning July 22 may limit the sustainability of gains

CONFIDENCE JUSTIFICATION (67%):
Moderate-high confidence because: (1) Mars in Leo is the strongest astrological placement for energy stocks, (2) BPCL has a documented historical correlation with Mars fire-sign transits, (3) Monsoon season provides fundamental support, (4) The timing aligns with peak electricity generation. Confidence reduced from 75% because: (1) Mars energy is inherently volatile and gains may not be sustainable, (2) Venus retrograde approaching July 22 creates headwinds for the broader market, (3) Hydropower stocks are relatively illiquid on NEPSE, limiting the effectiveness of weekly predictions.`,
          targetDate: new Date('2026-07-17'),
        },
      }),
      // ===== PREDICTION 18: Daily — Lunar Eclipse in Pisces + NIMB =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[4].id,
          stockId: stocks[1].id,
          predictionType: 'DAILY',
          prediction: 'BEARISH',
          confidence: 64,
          reasoning: `The Lunar Eclipse in Pisces occurs on September 18, 2026, and this daily prediction covers September 21 — the first trading day within the eclipse's 2-4 week manifestation window. The focus is on Nepal Investment Mega Bank (NIMB), which is particularly sensitive to Pisces-related eclipse energy due to its sector exposure and trading characteristics.

WHY NIMB IS SPECIFICALLY TARGETED:
Nepal Investment Mega Bank is the second-largest commercial bank on NEPSE by trading volume (88,322 shares on May 15) and has a strong retail investor base. During eclipse periods, retail investors are most susceptible to emotional decision-making, fear, and panic selling — all amplified by the Moon's eclipse in Pisces. NIMB is affected because: (1) Banking is a Pisces-ruled sector, and eclipses in Pisces directly target banking stocks, (2) NIMB's high retail ownership means it is more vulnerable to collective emotional reactions, (3) The stock tends to show outsized moves during volatile market periods, making it an amplifier of eclipse energy, (4) NIMB's market capitalization (NPR 67.57 billion) makes it large enough to influence but small enough to move significantly.

LUNAR ECLIPSE IN PISCES — SPECIFIC MECHANISM FOR BANKING:
In Vedic astrology, a lunar eclipse occurs when Rahu (the shadow planet) temporarily "swallows" the Moon. The Moon represents collective psychology, emotional confidence, and public trust. When the Moon is eclipsed in Pisces — the sign governing banking, financial institutions, and large pools of capital — the effect is a sudden loss of confidence in the banking system. This manifests as: (1) Panic selling by retail investors, (2) Sudden widening of bid-ask spreads as market makers reduce participation, (3) Negative news flow or rumors about banking sector health, (4) Institutional profit-taking ahead of anticipated weakness, and (5) Reduced liquidity creating exaggerated price movements.

EXPECTED NIMB PRICE ACTION ON SEPTEMBER 21:
- Opening: Rs. 188-192 (gap down from previous close)
- Morning session (11:00 AM - 1:00 PM): Accelerated selling, potentially reaching Rs. 182-185
- Afternoon recovery attempt: Partial rebound to Rs. 185-188
- Close: Rs. 184-190
- Expected decline: 3-5% on the day

ECLIPSE EFFECT AMPLIFICATION FACTORS:
Several factors make this particular eclipse especially potent for NIMB: (1) Saturn is still retrograde in Pisces (until October 28), creating a double Pisces affliction, (2) The eclipse occurs during the Venus retrograde shadow period (Venus retrograde ended September 3 but the shadow extends to September 20), (3) September is typically a month of market transition before the Dashain rally, creating uncertainty, (4) Mars will be in a contentious aspect with Rahu during this period, adding aggression to the market decline.

HISTORICAL PRECEDENT:
During the last Lunar Eclipse in Pisces (September 7, 2025), NIMB declined 4.2% on the next trading day. Similar eclipses affecting banking signs have produced average single-day declines of 2.5-4% for NIMB specifically.

PROTECTIVE STRATEGIES:
1. Reduce NIMB position by 50% before September 21
2. Place stop-loss orders at Rs. 188 to limit downside
3. Wait at least 3-5 trading days after the eclipse before re-entering banking positions
4. Consider hedging with PUT options on the banking sub-index (if available)

CONFIDENCE JUSTIFICATION (64%):
Moderate-high confidence for a daily eclipse prediction. The confidence is elevated by: (1) Direct Pisces-banking correlation during the eclipse, (2) Saturn retrograde confluence amplifying the effect, (3) NIMB's historical sensitivity to volatile events, (4) Strong precedent from the September 2025 eclipse. Confidence is reduced from 72% because: (1) Daily predictions have wider variance, (2) Pre-Dashain buying may provide unexpected support, (3) Global market conditions on September 21 could override the astrological signal.`,
          targetDate: new Date('2026-09-21'),
        },
      }),
      // ===== PREDICTION 19: Monthly — Jupiter Transit in Gemini + EBL =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[0].id,
          stockId: stocks[6].id,
          predictionType: 'MONTHLY',
          prediction: 'BULLISH',
          confidence: 64,
          reasoning: `Jupiter's transit through Gemini (May 2026 - May 2027) has far-reaching implications for individual stocks. This prediction focuses on Everest Bank Ltd. (EBL) for the month of July 2026, when Jupiter is firmly established in Gemini and the transit energy is at its full maturity. EBL represents a compelling combination of astrological favorability and fundamental strength.

JUPITER IN GEMINI: WHY IT FAVORS EBL SPECIFICALLY:
Everest Bank Ltd. is a joint venture commercial bank with a strong retail banking presence across Nepal. In Vedic astrology, EBL is particularly favored by Jupiter in Gemini for several reasons: (1) Gemini rules commerce, trade, and retail activity — EBL's core business segments, (2) Jupiter in Gemini creates a supportive trine (120-degree aspect) to Libra, which governs EBL's incorporation chart, (3) The transit enhances banking relationships, customer acquisition, and cross-border trade financing — all areas where EBL excels due to its joint venture structure with a major Indian bank, (4) Jupiter's expansive energy supports branch network expansion and digital banking growth.

EBL FUNDAMENTAL ANALYSIS:
- EBL is a joint venture between Nepalese and Indian investors, providing unique access to Indo-Nepal trade corridors
- Market capitalization of NPR 38.92 billion makes it a mid-cap commercial bank with growth potential
- The bank has been expanding its digital banking platform with new mobile and internet banking features
- NPL ratio of approximately 1.8% is below the sector average, indicating strong asset quality
- Capital adequacy ratio (CAR) of 14.2% provides buffer for loan growth
- The bank's Q2 FY2083/84 results (expected in July-August) are likely to show improved net interest margins

ASTROLOGICAL TIMING:
July 2026 represents the third month of Jupiter's Gemini transit, a period when the transit energy is fully established and begins producing tangible results. Key astrological factors for July: (1) Jupiter is at approximately 15-20 degrees Gemini, forming precise trine aspects to benefic planets, (2) The Sun's transit through Cancer (June 15 - July 16) creates a Sun-Jupiter opposition that actually benefits banking through increased government spending, (3) Mercury's transit through Cancer (July 30 onward) provides additional communication-sector support.

EXPECTED EBL PRICE ACTION FOR JULY 2026:
- Month start (July 1): Rs. 350-355
- Mid-month (July 15): Rs. 360-368
- Month end (July 31): Rs. 365-375
- Expected monthly gain: 4-6%

SECTOR COMPARISON:
Within the banking sector, EBL is expected to outperform peers during Jupiter in Gemini because: (1) Its trade-financing focus aligns perfectly with Gemini's commercial energy, (2) Mid-cap banks typically outperform large-cap banks during expansionary transits, (3) The Indo-Nepal trade corridor benefits specifically from Gemini's cross-border commerce theme. Expected banking sector performance: EBL (+4-6%), NIMB (+2-3%), NABIL (+1-2%), KBL (+3-5%).

RISK FACTORS:
1. Saturn retrograde in Pisces (June 15 - October 28) creates headwinds for all banking stocks
2. Mercury retrograde in Gemini (June 18 - July 12) may cause temporary disruption
3. NRB policy changes could affect EBL's trade-financing operations
4. EBL's joint venture structure adds currency and regulatory complexity

CONFIDENCE JUSTIFICATION (64%):
Moderate confidence. The astrological case for EBL outperformance during Jupiter in Gemini is strong, supported by fundamental analysis and historical precedent. Confidence is not higher because: (1) Saturn retrograde creates ongoing sector-wide pressure, (2) Monthly predictions have inherently wider variance, (3) EBL's joint venture structure introduces factors outside the astrological analysis, (4) The banking sector in Nepal is heavily influenced by NRB policy, which operates independently of planetary positions.`,
          targetDate: new Date('2026-07-15'),
        },
      }),
      // ===== PREDICTION 20: Weekly — Saturn Retrograde + NICA =====
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[2].id,
          stockId: stocks[10].id,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 65,
          reasoning: `Saturn retrograde in Pisces begins on June 15, 2026, and this prediction focuses on NIC Asia Bank (NICA) for the week of June 29 - July 3. As Saturn retrograde enters its third week, the initial shock has settled into a sustained period of pressure on banking stocks, with NIC Asia being particularly vulnerable due to its sector positioning and market characteristics.

WHY NICA IS SPECIFICALLY VULNERABLE:
NIC Asia Bank is one of Nepal's leading commercial banks with a focus on SME and corporate banking. It is particularly sensitive to Saturn retrograde in Pisces for several critical reasons: (1) NICA's stock price (Rs. 478.00 on May 15) places it in the premium banking category, making it a prime target for profit-taking when Saturn creates market pressure, (2) The bank's SME-focused lending portfolio is especially vulnerable during Saturn retrograde periods because SMEs face cash flow challenges when the economic cycle slows, (3) NICA has shown the highest beta (volatility) among "A" class banking stocks, meaning it amplifies market movements in both directions, and (4) The bank's rapid expansion over the past 2 years may face scrutiny during Saturn's "karmic review" of the banking sector.

SATURN RETROGRADE WEEK 3 — WHY IT MATTERS:
The third week of Saturn retrograde (June 29 - July 3) is historically one of the weakest periods for banking stocks. By the third week, the initial denial and hope that characterized the first two weeks has given way to acceptance of the retrograde's influence. Key dynamics include: (1) Institutional investors have completed their portfolio rebalancing, resulting in sustained selling pressure, (2) Retail investors who initially held through the decline begin panic selling, (3) Corporate earnings pre-announcements and NPL updates during this period tend to reveal the retrograde's fundamental impact, (4) Market liquidity dries up as both buyers and sellers adopt a defensive posture.

NICA-SPECIFIC RISK FACTORS:
- NICA's SME loan portfolio (approximately 35% of total loans) faces elevated default risk during economic slowdowns
- The bank's cost-to-income ratio of 48% is above the sector average, indicating operational inefficiency that Saturn retrograde may expose
- NICA's stock has gained 25% in the past 6 months, making it vulnerable to a correction
- Trading volume in NICA (11,200 shares on May 15) is relatively low, meaning sell orders can disproportionately impact the price

EXPECTED NICA PRICE ACTION:
- Week open (June 29): Rs. 462-468
- Mid-week decline (July 1-2): Rs. 448-455
- Week close (July 3): Rs. 450-458
- Expected decline: 4-6% for the week

CONFLUENCE WITH MERCURY RETROGRADE:
The week of June 29 - July 3 falls during Mercury retrograde in Gemini (June 18 - July 12). This creates a "double retrograde" scenario where both Saturn and Mercury are retrograde simultaneously. The effect on banking stocks is compounded: (1) Saturn retrograde creates fundamental banking sector pressure, (2) Mercury retrograde creates communication and data disruptions that amplify negative sentiment, (3) The combination historically produces the weakest week of the entire Saturn retrograde period.

COMPARATIVE ANALYSIS:
Among banking stocks, NICA is expected to underperform peers during this week due to its higher beta and SME exposure. Expected comparative performance: NICA (-4 to -6%), NABIL (-2 to -3%), NIMB (-2 to -4%), EBL (-1 to -3%), KBL (-3 to -5%).

CONFIDENCE JUSTIFICATION (65%):
Moderate-high confidence because: (1) Saturn retrograde Week 3 is historically the weakest for banking stocks, (2) Mercury retrograde confluence amplifies the bearish pressure, (3) NICA's specific vulnerabilities (SME exposure, high beta, premium pricing) make it a high-conviction short. Confidence reduced from 70% because: (1) NICA has a strong institutional shareholder base that may provide support, (2) The banking sector may find a technical support level that limits downside, (3) Government or NRB intervention could change the narrative mid-week.`,
          targetDate: new Date('2026-07-03'),
        },
      }),
    ])

    // ---- CREATE SITE SETTINGS ----
    const settingsData = [
      // === EXISTING 16 SETTINGS (kept exactly as-is) ===
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
      // === NEW SETTINGS 17-20 ===
      { key: 'vedic.notification_events', value: 'true', type: 'BOOLEAN', group: 'vedic', description: 'Enable notifications for upcoming vedic events' },
      { key: 'market.prediction_min_confidence', value: '50', type: 'NUMBER', group: 'market', description: 'Minimum confidence threshold for displaying predictions' },
      { key: 'site.show_disclaimer', value: 'true', type: 'BOOLEAN', group: 'general', description: 'Show disclaimer banner on public pages' },
      { key: 'vedic.show_dasha_periods', value: 'true', type: 'BOOLEAN', group: 'vedic', description: 'Show Dasha period information on stock pages' },
    ]

    await Promise.all(
      settingsData.map((s) => db.siteSettings.create({ data: s }))
    )

    // ---- CREATE ACTIVITY LOGS ----
    await Promise.all([
      // === EXISTING 9 ACTIVITY LOGS (kept exactly as-is) ===
      db.activityLog.create({ data: { userId: admin.id, action: 'LOGIN', details: 'Admin logged in successfully', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE user', details: 'Created editor account for Priya Sharma', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Saturn Retrograde 2026 Impact', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Jupiter in Gemini 2026 Effects', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE vedic_event', details: 'Added: Venus-Jupiter Conjunction in Taurus', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE prediction', details: 'Daily BULLISH prediction for May 22 (Venus-Jupiter conjunction)', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'UPDATE settings', details: 'Updated site theme and primary color', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE page', details: 'Published: About Us page', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: viewer.id, action: 'LOGIN', details: 'Viewer Raj Thapa logged in', ipAddress: '192.168.1.3' } }),
      // === NEW ACTIVITY LOGS 10-30 ===
      db.activityLog.create({ data: { userId: editor.id, action: 'UPDATE blog_post', details: 'Updated draft: Nabil Bank Vedic Perspective', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Mercury Retrograde Effects on NEPSE Trading', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE stock', details: 'Added stock: Everest Bank Ltd. (EBL)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE stock', details: 'Added stock: Nepal SBI Bank Ltd. (SBI)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE stock', details: 'Added stock: Kumari Bank Ltd. (KBL)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE stock', details: 'Added stock: Global IME Bank Ltd. (GBIME)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE prediction', details: 'Weekly BEARISH prediction for GBIME (Mercury Retrograde)', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE vedic_event', details: 'Added: Mercury Retrograde in Gemini', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: viewer.id, action: 'LOGIN', details: 'Viewer Raj Thapa logged in from mobile device', ipAddress: '192.168.1.3' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Dashain Festival Market Analysis', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'UPDATE settings', details: 'Updated market refresh interval to 300 seconds', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE vedic_event', details: 'Added: Venus Retrograde in Leo', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Chilime Hydropower Vedic Review', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'DELETE stock', details: 'Removed duplicate stock entry (test data cleanup)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE stock', details: 'Added stock: Nepal Telecom Ltd. (NTC)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: viewer.id, action: 'LOGIN', details: 'Viewer Raj Thapa logged in', ipAddress: '10.0.0.5' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'UPDATE blog_post', details: 'Updated: Banking Sector Quarterly Forecast draft', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE vedic_event', details: 'Added: Saturn Direct in Pisces', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE prediction', details: 'Weekly BULLISH prediction for NABIL (Saturn Direct)', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Insurance Sector Vedic Outlook 2026-2027', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'UPDATE settings', details: 'Enabled vedic event notifications', ipAddress: '192.168.1.1' } }),
    ])

    return success({ message: 'Database seeded successfully with expanded 2026-2027 sample data.' })
  } catch (err) {
    console.error('Seed error:', err)
    return error('Failed to seed database', 500)
  }
}
