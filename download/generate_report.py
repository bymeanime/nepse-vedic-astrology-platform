#!/usr/bin/env python3
"""
NEPSE Vedic Astrology Trading Platform - Body Report Generator
Generates a comprehensive PDF report using ReportLab.
"""

import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Frame, PageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus.flowables import Flowable

# ──────────────────────────────────────────────
# Font Registration
# ──────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('Tinos', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Calibri-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'))

registerFontFamily('Tinos', normal='Tinos', bold='Tinos-Bold')
registerFontFamily('Calibri', normal='Calibri', bold='Calibri-Bold')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')

# ──────────────────────────────────────────────
# Color Palette
# ──────────────────────────────────────────────
ACCENT = colors.HexColor('#2c96b9')
TEXT_PRIMARY = colors.HexColor('#1d1e20')
TEXT_MUTED = colors.HexColor('#7b8288')
BG_SURFACE = colors.HexColor('#d4d9dd')
BG_PAGE = colors.HexColor('#f0f2f3')
TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT = colors.white
TABLE_ROW_EVEN = colors.white
TABLE_ROW_ODD = BG_SURFACE

# ──────────────────────────────────────────────
# Styles
# ──────────────────────────────────────────────
styles = getSampleStyleSheet()

style_h1 = ParagraphStyle(
    'CustomH1',
    fontName='Tinos-Bold',
    fontSize=18,
    leading=24,
    textColor=TEXT_PRIMARY,
    spaceAfter=6,
    spaceBefore=18,
    alignment=TA_LEFT,
)

style_h2 = ParagraphStyle(
    'CustomH2',
    fontName='Tinos-Bold',
    fontSize=14,
    leading=20,
    textColor=ACCENT,
    spaceAfter=6,
    spaceBefore=14,
    alignment=TA_LEFT,
)

style_h3 = ParagraphStyle(
    'CustomH3',
    fontName='Tinos-Bold',
    fontSize=12,
    leading=17,
    textColor=TEXT_PRIMARY,
    spaceAfter=4,
    spaceBefore=10,
    alignment=TA_LEFT,
)

style_body = ParagraphStyle(
    'CustomBody',
    fontName='Tinos',
    fontSize=11,
    leading=18,
    textColor=TEXT_PRIMARY,
    spaceAfter=8,
    spaceBefore=2,
    alignment=TA_LEFT,
    wordWrap='CJK',
)

style_table_header = ParagraphStyle(
    'TableHeader',
    fontName='Tinos-Bold',
    fontSize=9,
    leading=13,
    textColor=TABLE_HEADER_TEXT,
    alignment=TA_LEFT,
    wordWrap='CJK',
)

style_table_cell = ParagraphStyle(
    'TableCell',
    fontName='Tinos',
    fontSize=9,
    leading=13,
    textColor=TEXT_PRIMARY,
    alignment=TA_LEFT,
    wordWrap='CJK',
)

style_bullet = ParagraphStyle(
    'BulletStyle',
    fontName='Tinos',
    fontSize=11,
    leading=18,
    textColor=TEXT_PRIMARY,
    spaceAfter=4,
    spaceBefore=2,
    leftIndent=20,
    bulletIndent=8,
    alignment=TA_LEFT,
    wordWrap='CJK',
)

# ──────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────
def heading1(text):
    return Paragraph(text, style_h1)

def heading2(text):
    return Paragraph(text, style_h2)

def heading3(text):
    return Paragraph(text, style_h3)

def body(text):
    return Paragraph(text, style_body)

def bullet(text):
    return Paragraph(f"\u2022  {text}", style_bullet)

def spacer(pts=12):
    return Spacer(1, pts)

def accent_line():
    return HRFlowable(
        width="100%", thickness=1.5, lineCap='round',
        color=ACCENT, spaceBefore=6, spaceAfter=10
    )

def thin_line():
    return HRFlowable(
        width="100%", thickness=0.5, lineCap='round',
        color=BG_SURFACE, spaceBefore=4, spaceAfter=8
    )

def make_table(headers, rows, col_widths=None):
    """Create a styled table with all cells wrapped in Paragraph."""
    available_width = A4[0] - 2 * inch  # subtract margins
    if col_widths is None:
        num_cols = len(headers)
        col_widths = [available_width / num_cols] * num_cols
    else:
        # Ensure widths sum to available_width
        assert abs(sum(col_widths) - available_width) < 2, \
            f"Column widths sum {sum(col_widths)} != available {available_width}"

    header_row = [Paragraph(h, style_table_header) for h in headers]
    data_rows = []
    for row in rows:
        data_rows.append([Paragraph(str(c), style_table_cell) for c in row])

    table_data = [header_row] + data_rows
    t = Table(table_data, colWidths=col_widths, repeatRows=1)

    style_commands = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('FONTNAME', (0, 0), (-1, 0), 'Tinos-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, ACCENT),
    ]
    # Alternating row colors
    for i in range(1, len(table_data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_commands.append(('BACKGROUND', (0, i), (-1, i), bg))

    t.setStyle(TableStyle(style_commands))
    return t


# ──────────────────────────────────────────────
# Page Template Callbacks
# ──────────────────────────────────────────────
def on_first_page(canvas, doc):
    """No header/footer on first body page (cover is separate)."""
    pass

def on_later_pages(canvas, doc):
    """Add header and footer to subsequent pages."""
    canvas.saveState()
    # Header line
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1.5)
    canvas.line(inch, A4[1] - 0.6 * inch, A4[0] - inch, A4[1] - 0.6 * inch)
    # Header text
    canvas.setFont('Tinos', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(inch, A4[1] - 0.55 * inch, "NEPSE Vedic Astrology Trading Platform | Architecture Report")
    # Footer
    canvas.setStrokeColor(BG_SURFACE)
    canvas.setLineWidth(0.5)
    canvas.line(inch, 0.6 * inch, A4[0] - inch, 0.6 * inch)
    canvas.setFont('Tinos', 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(A4[0] / 2, 0.45 * inch, f"Page {doc.page}")
    canvas.drawRightString(A4[0] - inch, 0.45 * inch, "Confidential | May 2026")
    canvas.restoreState()


# ──────────────────────────────────────────────
# Build Report
# ──────────────────────────────────────────────
def build_report():
    output_path = '/home/z/my-project/download/body.pdf'
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
    )

    story = []
    avail_w = A4[0] - 2 * inch

    # ════════════════════════════════════════════
    # SECTION 1: Executive Summary
    # ════════════════════════════════════════════
    story.append(heading1("1. Executive Summary"))
    story.append(accent_line())
    story.append(body(
        "The NEPSE Vedic Astrology Trading Platform represents a groundbreaking initiative to construct a "
        "first-of-its-kind digital ecosystem that seamlessly bridges the ancient science of Vedic astrology "
        "with modern Nepal Stock Exchange (NEPSE) market analytics. This platform aspires to deliver "
        "predictive trading intelligence by correlating planetary positions, dasha periods, and transit "
        "cycles with real-time stock price movements, sector performance, and macroeconomic indicators. "
        "The project is positioned at the intersection of two rapidly growing domains: fintech innovation "
        "and the global astrology services market."
    ))
    story.append(body(
        "The global astrology application market was valued at approximately $3 billion in 2024 and is "
        "projected to reach $9 billion by 2030, reflecting a compound annual growth rate (CAGR) of nearly "
        "19%. This exponential expansion is driven by increasing smartphone penetration, rising interest in "
        "alternative predictive methodologies, and a cultural renaissance of traditional knowledge systems. "
        "Nepal, as the birthplace of Vedic astrology traditions, offers a uniquely receptive market where "
        "astrological guidance is deeply embedded in daily decision-making, including financial planning."
    ))
    story.append(body(
        "By targeting the Nepalese stock market, this platform captures a significant first-mover advantage. "
        "No existing application or website currently combines real-time NEPSE data with Vedic astrological "
        "calculations in a unified, user-friendly interface. The platform will cater to retail investors, "
        "astrological enthusiasts, day traders, and institutional research teams seeking unconventional "
        "market intelligence. Through a tiered subscription model (Free, Pro, and Enterprise), the platform "
        "aims to generate sustainable revenue while building a loyal community of users who trust both "
        "data-driven and astrological perspectives on market behavior."
    ))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 2: Global Competitive Landscape
    # ════════════════════════════════════════════
    story.append(heading1("2. Global Competitive Landscape"))
    story.append(accent_line())
    story.append(body(
        "A thorough competitive analysis reveals that while financial astrology is a recognized niche "
        "globally, no platform has yet to integrate Vedic astrological intelligence specifically with "
        "Nepal Stock Exchange data. The competitive landscape divides naturally into two categories: "
        "international financial astrology platforms and domestic NEPSE-specific tools. Understanding "
        "both segments is critical for positioning the platform's unique value proposition and identifying "
        "gaps in the current market offering."
    ))

    # 2A. Financial Astrology Platforms
    story.append(heading2("2A. Financial Astrology Platforms (Worldwide)"))
    story.append(body(
        "The international market hosts several established financial astrology platforms that combine "
        "astronomical calculations with market analysis. These platforms vary significantly in their "
        "methodological approach, pricing structure, and target audience. Western financial astrology "
        "platforms primarily utilize Gann angles, planetary cycles, and astronomical ephemeris data, "
        "while Vedic-oriented platforms focus on dasha systems, nakshatra analysis, and traditional "
        "planetary transit interpretation. The following table provides a comprehensive overview of the "
        "leading players in this space, highlighting their core features, pricing models, and geographic "
        "focus areas."
    ))

    fin_astro_headers = ['Platform', 'Type', 'Key Features', 'Pricing', 'Market']
    fin_astro_rows = [
        ['StockAstrologer.com', 'Web App',
         'Astro-based stock analysis, zodiac-market correlation, daily predictions',
         'Free / Paid tiers', 'Global'],
        ['KTCharts', 'Web + Mobile',
         'Vedic astrology + AI analysis, real-time charts, dasha predictions',
         'Subscription-based', 'India / Global'],
        ['AstroNidan', 'Web App',
         'Vedic planetary analysis for market prediction, transit alerts',
         'Freemium', 'India'],
        ['AstroSage', 'Web + Mobile',
         'Stock market predictions via Vedic astrology, kundli matching',
         'Free / Premium', 'India / Global'],
        ['GannTrader', 'Desktop Software',
         'NASA JPL algorithms, Gann angles, WD Gann trading techniques',
         '$3,595+ one-time', 'USA / Global'],
        ['AstroApp Financial', 'Web App',
         'Candlestick + Gann planetary lines, financial horoscopes',
         'Subscription $19.95/mo', 'Global'],
        ['AstralAstrologer', 'Web App',
         'Vedic wisdom + algorithmic indicators, market timing tools',
         'Subscription-based', 'Global'],
        ['Mindsutra Astro Fincalc', 'Desktop',
         'Comprehensive financial astrology software, portfolio astrology',
         'Paid license', 'India / Global'],
    ]
    cw_fin = [avail_w * 0.15, avail_w * 0.11, avail_w * 0.38, avail_w * 0.17, avail_w * 0.19]
    story.append(make_table(fin_astro_headers, fin_astro_rows, cw_fin))
    story.append(spacer(10))

    # 2B. NEPSE-Specific Platforms
    story.append(heading2("2B. NEPSE-Specific Platforms (Nepal)"))
    story.append(body(
        "The Nepalese stock market ecosystem includes several well-established platforms providing "
        "NEPSE data, portfolio management, and financial news. These platforms serve a growing community "
        "of retail and institutional investors in Nepal. However, none of them offer any form of "
        "astrological or alternative predictive analytics. This represents a clear market gap that "
        "our platform is uniquely positioned to fill. The table below summarizes the key domestic "
        "competitors and their market positioning, illustrating the opportunity to differentiate through "
        "Vedic astrology integration."
    ))

    nepse_headers = ['Platform', 'Traffic Rank', 'Key Features', 'Subscription Model']
    nepse_rows = [
        ['NepseAlpha', 'High',
         'Advanced charts, NEPSE live data, sector analysis, historical data',
         'Premium tiers'],
        ['ShareSansar', 'High',
         'Financial news, company data, IPO listings, market analysis',
         'Freemium'],
        ['MeroLagani', 'Popular',
         'Portfolio tracking, watchlists, NEPSE indices, simple UI',
         'Free / Ads'],
        ['NepalStock.com', 'High',
         'Official NEPSE data partner, live indices, company fundamentals',
         'Free'],
        ['Chukul', 'Emerging',
         'Analysis tools, market insights, stock screeners',
         'Freemium'],
        ['SastoShare', 'Leading',
         'Highest subscription count, community features, alerts',
         'Paid tiers'],
        ['SSPro', 'High',
         'Professional analytics, advanced charting, data export',
         'Paid subscription'],
        ['NepalYtix', 'Top 10',
         'NEPSE investor platform rankings, market tools',
         'Freemium'],
    ]
    cw_nepse = [avail_w * 0.15, avail_w * 0.12, avail_w * 0.50, avail_w * 0.23]
    story.append(make_table(nepse_headers, nepse_rows, cw_nepse))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 3: Key Differentiators
    # ════════════════════════════════════════════
    story.append(heading1("3. Key Differentiators & Market Opportunity"))
    story.append(accent_line())
    story.append(body(
        "The NEPSE Vedic Astrology Trading Platform possesses several compelling competitive advantages "
        "that position it for rapid market adoption and sustained growth. These differentiators stem from "
        "the unique convergence of cultural heritage, technological innovation, and an unaddressed market "
        "need. The following points outline the core strategic advantages that will drive user acquisition, "
        "retention, and revenue generation."
    ))
    story.append(bullet(
        "<b>First-Mover Advantage:</b> No platform in the world currently combines Vedic astrology with "
        "NEPSE data. This creates an entirely new product category within the Nepalese fintech ecosystem, "
        "allowing the platform to establish brand authority, capture early adopters, and build network "
        "effects before potential competitors emerge. First-mover status also provides significant media "
        "attention and organic word-of-mouth marketing opportunities."
    ))
    story.append(bullet(
        "<b>Global Astrology Market Growth:</b> The astrology services market is projected to grow from "
        "$3 billion (2024) to $9 billion by 2030, representing a 3x expansion. This growth is fueled by "
        "millennial and Gen Z interest in alternative predictive systems, wellness culture, and the "
        "digitalization of traditional knowledge. By anchoring in this expanding market, the platform "
        "benefits from favorable macroeconomic tailwinds."
    ))
    story.append(bullet(
        "<b>Cultural Resonance:</b> Nepal's deep-rooted connection to Vedic astrology creates a natural "
        "market fit. Unlike Western markets where astrology may face skepticism, Nepalese consumers "
        "routinely consult astrological guidance for major decisions including investments. This cultural "
        "acceptance dramatically reduces customer acquisition costs and accelerates organic growth."
    ))
    story.append(bullet(
        "<b>AI-Enhanced Predictions:</b> The platform leverages hybrid AI-Vedic models that combine "
        "machine learning algorithms (LSTM, NLP) with traditional Jyotish calculations. This dual-engine "
        "approach provides users with both data-driven and astrological perspectives, creating a richer "
        "analytical experience than either methodology alone."
    ))
    story.append(bullet(
        "<b>Multi-Layered Analysis:</b> By integrating technical analysis, fundamental analysis, and "
        "astrological analysis into a single dashboard, the platform offers a holistic investment toolkit. "
        "Users can cross-reference RSI indicators with planetary transits or evaluate P/E ratios alongside "
        "dasha period predictions, enabling more informed decision-making."
    ))
    story.append(bullet(
        "<b>Target Demographics:</b> The platform serves multiple segments: retail investors seeking "
        "alternative insights, astrological enthusiasts exploring financial applications, day traders "
        "looking for timing advantages, and institutional research teams studying behavioral finance "
        "patterns. This multi-segment approach diversifies revenue streams and increases total addressable "
        "market size."
    ))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 4: Emerging Technologies
    # ════════════════════════════════════════════
    story.append(heading1("4. Emerging Technologies & Best Practices"))
    story.append(accent_line())
    story.append(body(
        "Building a world-class trading platform requires leveraging cutting-edge technologies across "
        "the full stack. This section outlines the recommended technology choices for frontend, backend, "
        "AI/ML integration, and Vedic astrology computation, ensuring the platform delivers exceptional "
        "performance, scalability, and user experience."
    ))

    # 4A. Frontend
    story.append(heading2("4A. Frontend Technologies"))
    story.append(body(
        "The frontend layer must deliver a rich, interactive experience with real-time data updates, "
        "complex chart rendering, and responsive design across all devices. Next.js 16 with React 19 "
        "is the recommended framework, providing server-side rendering (SSR), static site generation (SSG), "
        "and the new App Router architecture for optimal performance. Server Components reduce the client-side "
        "JavaScript bundle, improving initial load times and Core Web Vitals scores. The UI layer will "
        "leverage shadcn/ui with Tailwind CSS 4, offering a comprehensive library of accessible, "
        "customizable components that ensure a professional dashboard aesthetic."
    ))
    story.append(body(
        "Real-time market data will be delivered via WebSocket connections, ensuring sub-second latency "
        "for live price updates. For advanced charting, the platform will integrate TradingView Lightweight "
        "Charts for financial candlestick visualization and ECharts for custom dashboards including heat "
        "maps and correlation matrices. Vedic astrology chart rendering (Kundli, Navamsa, planetary "
        "position diagrams) will utilize Canvas API and SVG for high-fidelity graphical output. The entire "
        "frontend will be built mobile-first, with Progressive Web App (PWA) capabilities enabling offline "
        "access to cached data and push notification support."
    ))

    # 4B. Backend
    story.append(heading2("4B. Backend Technologies"))
    story.append(body(
        "The backend architecture will employ Node.js for API gateway and real-time services, paired with "
        "Python FastAPI for compute-intensive tasks such as ML model inference and Vedic calculations. "
        "PostgreSQL serves as the primary database for structured financial data, user profiles, and "
        "subscription management, while Redis provides high-speed caching for frequently accessed market "
        "data and session management. Prisma ORM will manage database interactions with type-safe queries, "
        "migrations, and schema introspection. For real-time event processing, message queues using "
        "RabbitMQ or Apache Kafka will handle market data streams, notification dispatch, and "
        "asynchronous task processing. The entire backend will be containerized with Docker and orchestrated "
        "via Kubernetes for horizontal scaling capability."
    ))

    # 4C. AI/ML
    story.append(heading2("4C. AI/ML Integration"))
    story.append(body(
        "Artificial intelligence and machine learning form the analytical backbone of the prediction "
        "engine. Long Short-Term Memory (LSTM) neural networks will be trained on historical NEPSE price "
        "data, macroeconomic indicators, and planetary position data to generate time-series forecasts. "
        "Natural Language Processing (NLP) models will analyze financial news articles, social media "
        "sentiment, and regulatory announcements to capture market mood indicators. The most innovative "
        "component is the Hybrid AI-Vedic model, which combines traditional planetary calculations "
        "(graha drishti, ashtakavarga scores, dasha periods) with ML-derived pattern recognition to "
        "produce confidence-weighted market predictions. Real-time pattern recognition algorithms will "
        "monitor incoming data streams for anomalous market behavior correlated with astrological events, "
        "triggering automated alerts to subscribers."
    ))

    # 4D. Vedic APIs
    story.append(heading2("4D. Vedic Astrology APIs & Libraries"))
    story.append(body(
        "Several specialized APIs and libraries provide the computational foundation for Vedic "
        "astrological features. The following table summarizes the key options evaluated for integration, "
        "covering endpoint capabilities, data formats, and pricing structures. Selection criteria include "
        "accuracy of planetary calculations (Swiss Ephemeris vs. VSOP87), API response time, supported "
        "chart types, and commercial licensing terms."
    ))

    vedic_headers = ['API / Library', 'Type', 'Key Endpoints', 'Pricing']
    vedic_rows = [
        ['KundliAPI.com', 'REST API',
         '203+ endpoints: Kundli, Matching, Dasha, Panchang, PDF Reports',
         'Freemium / Paid'],
        ['AstrologyAPI.com', 'REST API',
         'Vedic Astrology: Kundli, Panchang, KP, Transit, Horoscope',
         'Subscription tiers'],
        ['vedic-astrology-api (npm)', 'Node.js Library',
         'Rasi, Nakshatra, Lagna, Birth Chart, Planetary Positions',
         'Open Source'],
        ['vedic_astro_npm (GitHub)', 'TypeScript Lib',
         'Panchang, Planetary Positions, Kundali, Dasha System',
         'Open Source (MIT)'],
        ['AstroBeans', 'REST API',
         'Real-time astrology data, Horoscope, Kundli, Match Making',
         'API Key plans'],
        ['AstroWisdoms', 'REST API',
         'SVG chart representations, Nakshatras, Dashas, Transit Charts',
         'Subscription'],
    ]
    cw_vedic = [avail_w * 0.24, avail_w * 0.13, avail_w * 0.42, avail_w * 0.21]
    story.append(make_table(vedic_headers, vedic_rows, cw_vedic))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 5: Performance Benchmarks
    # ════════════════════════════════════════════
    story.append(heading1("5. Performance Benchmarks & Standards"))
    story.append(accent_line())
    story.append(body(
        "Delivering a responsive, reliable user experience is paramount for a trading platform where "
        "every millisecond can impact investment decisions. The following performance benchmarks establish "
        "the minimum acceptable standards for the platform, aligned with Google Core Web Vitals guidelines "
        "and financial industry best practices. These targets will be continuously monitored through "
        "automated performance testing integrated into the CI/CD pipeline."
    ))
    story.append(bullet(
        "<b>Page Load Performance:</b> Target initial page load under 2 seconds. Core Web Vitals must "
        "meet Google's \"Good\" thresholds: Largest Contentful Paint (LCP) below 2.5 seconds, First "
        "Input Delay (FID) below 100 milliseconds, and Cumulative Layout Shift (CLS) below 0.1. "
        "These metrics directly impact SEO rankings and user retention rates."
    ))
    story.append(bullet(
        "<b>Real-Time Data Latency:</b> WebSocket-based market data updates must deliver sub-500ms "
        "latency from exchange tick to user screen. This requires optimized server-side event processing, "
        "efficient binary data serialization (Protocol Buffers or MessagePack), and intelligent client-side "
        "throttling to prevent rendering bottlenecks during high-volatility periods."
    ))
    story.append(bullet(
        "<b>API Response Times:</b> Cached queries must return within 200ms, while complex Vedic "
        "calculations and ML prediction endpoints should complete within 1 second. API rate limiting "
        "and circuit breaker patterns will prevent cascade failures during traffic spikes."
    ))
    story.append(bullet(
        "<b>Infrastructure Reliability:</b> The platform commits to a 99.9% uptime SLA, achieved "
        "through multi-zone cloud deployment (AWS/Azure), automated failover, health check monitoring, "
        "and incident response automation. Database replication and automated backup procedures ensure "
        "zero data loss tolerance."
    ))
    story.append(bullet(
        "<b>Content Delivery & Optimization:</b> All static assets will be served via CDN (CloudFlare "
        "or AWS CloudFront) with aggressive caching headers. Images will use WebP/AVIF formats, "
        "JavaScript bundles will be tree-shaken and code-split, and CSS will be purged of unused rules. "
        "Database query optimization with strategic indexing on frequently queried columns (symbol, "
        "timestamp, planetary_position) will ensure consistent sub-50ms query execution times."
    ))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 6: Proposed Website Architecture
    # ════════════════════════════════════════════
    story.append(heading1("6. Proposed Website Architecture"))
    story.append(accent_line())

    # 6A. System Architecture Overview
    story.append(heading2("6A. System Architecture Overview"))
    story.append(body(
        "The platform adopts a microservices architecture with a centralized API Gateway, enabling "
        "independent scaling, deployment, and fault isolation for each functional domain. The API Gateway "
        "handles authentication (JWT-based), rate limiting, request routing, and response aggregation. "
        "Behind the gateway, specialized microservices manage market data ingestion, Vedic calculations, "
        "user management, prediction processing, and notification delivery."
    ))
    story.append(body(
        "An event-driven data pipeline powers real-time updates throughout the system. Market data "
        "ingestion services consume NEPSE feeds (via API or scraping), normalize the data into a "
        "standard schema, and publish events to a message broker (Kafka/RabbitMQ). Downstream services "
        "subscribe to relevant topics for processing. A multi-tier caching strategy minimizes database "
        "load: CDN caches static assets, Redis caches frequently queried market data (current prices, "
        "indices, watchlists), and the PostgreSQL database serves as the persistent store for historical "
        "data, user profiles, and transactional records. Load balancing with horizontal scaling ensures "
        "the platform can handle traffic surges during market hours and major astrological events."
    ))

    # 6B. Core Modules Table
    story.append(heading2("6B. Core Modules"))
    story.append(body(
        "The platform is organized into nine distinct functional modules, each designed to deliver "
        "a specific capability within the overall ecosystem. Modules are prioritized based on market "
        "demand, technical dependencies, and revenue impact. Priority 0 (P0) modules are essential for "
        "launch, Priority 1 (P1) modules follow in the first growth phase, and Priority 2 (P2) modules "
        "complete the full platform experience."
    ))

    module_headers = ['Module', 'Description', 'Technology', 'Priority']
    module_rows = [
        ['Market Dashboard',
         'Real-time NEPSE indices, customizable watchlists, sector heat maps, market overview with live price feeds',
         'Next.js, ECharts, WebSocket', 'P0'],
        ['Vedic Chart Engine',
         'Kundli generation, Navamsa charts, planetary position calculators, Dasha period timelines',
         'D3.js / Canvas, Vedic APIs', 'P0'],
        ['Astro-Market Correlation',
         'Maps planetary transits to historical market movements, identifies correlation patterns',
         'Python ML, Vedic Calc Engine', 'P0'],
        ['Stock Screener',
         'Multi-criteria stock filtering: technical indicators + astrological favorability scores',
         'PostgreSQL, Prisma, REST API', 'P1'],
        ['Prediction Engine',
         'AI + Vedic combined market predictions with confidence intervals and backtesting',
         'LSTM, NLP, Vedic API, Python', 'P1'],
        ['Portfolio Manager',
         'Track holdings with astrological timing insights, Dasha-based buy/sell suggestions',
         'React, PostgreSQL, Charts', 'P1'],
        ['News & Alerts',
         'Financial news aggregation + astrological event notifications with push delivery',
         'RSS Parser, WebSocket, Push API', 'P2'],
        ['Community Forum',
         'Discussion boards, idea sharing, expert consultations, social trading features',
         'Next.js, PostgreSQL, Realtime DB', 'P2'],
        ['Premium Subscription',
         'Tiered access (Free / Pro / Enterprise), payment via Stripe and Khalti integration',
         'Stripe API, Khalti SDK, Webhook', 'P2'],
    ]
    cw_mod = [avail_w * 0.18, avail_w * 0.38, avail_w * 0.26, avail_w * 0.18]
    story.append(make_table(module_headers, module_rows, cw_mod))
    story.append(spacer(10))

    # 6C. Data Flow Architecture
    story.append(heading2("6C. Data Flow Architecture"))
    story.append(body(
        "The data flow architecture encompasses four primary pipelines that work in concert to deliver "
        "a unified, personalized user experience. Each pipeline handles a specific data domain while "
        "sharing a common event bus for cross-domain intelligence."
    ))
    story.append(bullet(
        "<b>NEPSE Data Ingestion Pipeline:</b> Raw market data is acquired from NEPSE APIs, web "
        "scraping endpoints, or authorized data feeds. Data undergoes normalization (symbol mapping, "
        "price adjustment, timestamp standardization) before being stored in PostgreSQL. A change data "
        "capture (CDC) mechanism publishes update events to Kafka topics consumed by dashboard, "
        "screener, and alerting services."
    ))
    story.append(bullet(
        "<b>Astrological Calculation Pipeline:</b> Ephemeris data (planetary positions, retrograde "
        "periods, eclipses) is computed daily using Swiss Ephemeris algorithms. These calculations feed "
        "into the correlation engine, which cross-references planetary states with historical NEPSE "
        "performance data to generate statistical significance scores for various astrological-market "
        "patterns."
    ))
    story.append(bullet(
        "<b>User Personalization Layer:</b> Each user's birth chart (Janma Kundli) is computed upon "
        "registration and stored securely. The personalization engine maps the user's natal chart to "
        "current planetary transits, generating personalized predictions, favorable investment periods, "
        "and risk assessments based on their individual astrological profile."
    ))
    story.append(bullet(
        "<b>Real-Time Notification Pipeline:</b> An event-driven rules engine monitors incoming market "
        "and astrological events against user-defined criteria and system-generated insights. Matching "
        "events trigger push notifications via WebSocket (in-app), Web Push API (browser), and mobile "
        "push services (via PWA). Notification delivery is tracked and optimized for engagement."
    ))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 7: Development Roadmap
    # ════════════════════════════════════════════
    story.append(heading1("7. Development Roadmap"))
    story.append(accent_line())
    story.append(body(
        "The development roadmap spans 18 months across five distinct phases, progressing from core "
        "platform foundation to enterprise-grade capabilities. Each phase is designed to deliver "
        "measurable user and revenue milestones while incrementally expanding the platform's feature "
        "set and market reach. The phased approach allows for user feedback incorporation, iterative "
        "improvement, and strategic pivots based on market response."
    ))

    road_headers = ['Phase', 'Duration', 'Deliverables', 'Success Metrics']
    road_rows = [
        ['Phase 1: Foundation', 'Months 1-3',
         'Core platform infrastructure, real-time NEPSE data integration, basic market dashboard with watchlists and live indices',
         '1,000 registered users, <2s page load'],
        ['Phase 2: Astro Integration', 'Months 4-6',
         'Vedic chart engine, planetary calculators, Kundli generation, basic astro-market predictions, user birth chart profiles',
         '5,000 users, 500 premium subscribers'],
        ['Phase 3: AI Enhancement', 'Months 7-9',
         'ML prediction models (LSTM), sentiment analysis engine, personalized alerts, backtesting dashboard, correlation analytics',
         '15,000 users, 2,000 premium, 85% prediction accuracy'],
        ['Phase 4: Community & Growth', 'Months 10-12',
         'Community forum, expert marketplace, PWA mobile app, referral program, social trading features, advanced screener',
         '50,000 users, 5,000 premium, 30% MoM growth'],
        ['Phase 5: Enterprise', 'Months 13-18',
         'Broker API integration, white-label solution, institutional analytics dashboard, compliance reporting, API marketplace',
         '100,000 users, 15,000 premium, $500K ARR target'],
    ]
    cw_road = [avail_w * 0.18, avail_w * 0.12, avail_w * 0.42, avail_w * 0.28]
    story.append(make_table(road_headers, road_rows, cw_road))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 8: Risk Assessment
    # ════════════════════════════════════════════
    story.append(heading1("8. Risk Assessment & Mitigation"))
    story.append(accent_line())
    story.append(body(
        "Every innovative platform faces a spectrum of risks that must be proactively identified and "
        "mitigated. The following analysis addresses the primary risk categories for the NEPSE Vedic "
        "Astrology Trading Platform, along with concrete mitigation strategies to ensure sustainable "
        "operations and regulatory compliance."
    ))
    story.append(bullet(
        "<b>Regulatory Compliance:</b> The Securities Board of Nepal (SEBON) maintains strict regulations "
        "regarding financial advice, investment recommendations, and securities market operations. The "
        "platform must include prominent disclaimers stating that astrological predictions are for "
        "educational and entertainment purposes only, and do not constitute licensed financial advice. "
        "Legal counsel specializing in Nepalese securities law will review all user-facing content. "
        "The platform will also implement KYC (Know Your Customer) procedures where required and "
        "maintain audit trails of all advisory interactions."
    ))
    story.append(bullet(
        "<b>Data Accuracy & Reliability:</b> NEPSE data feeds may experience outages, delays, or "
        "inconsistencies. The platform will implement a multi-source data strategy with fallback "
        "mechanisms, caching recent data to serve during outages, and automated data validation checks "
        "that flag anomalies. A data quality dashboard will provide internal visibility into feed health "
        "and accuracy metrics."
    ))
    story.append(bullet(
        "<b>Astrological Disclaimer & User Trust:</b> To maintain credibility and manage expectations, "
        "all prediction features will display confidence intervals, historical accuracy metrics, and "
        "clear disclaimers. A dedicated 'Methodology' section will transparently explain how predictions "
        "are generated, including both the Vedic and AI components. User education content will help "
        "set realistic expectations about prediction accuracy."
    ))
    story.append(bullet(
        "<b>Server Scalability:</b> Traffic spikes during market hours and major astrological events "
        "(eclipses, planetary retrogrades) can strain infrastructure. The platform will deploy on "
        "auto-scaling cloud infrastructure (AWS ECS/EKS) with pre-configured scaling policies, "
        "load testing at 10x expected peak capacity, and a CDN layer to absorb static content demand."
    ))
    story.append(bullet(
        "<b>Security & Data Protection:</b> User birth chart data and financial information require "
        "robust security measures. The platform will implement AES-256 encryption for sensitive data "
        "at rest, TLS 1.3 for all data in transit, role-based access control (RBAC), regular penetration "
        "testing, and compliance with data protection best practices. Payment processing will be handled "
        "through PCI-DSS compliant gateways (Stripe, Khalti) without storing card information locally."
    ))
    story.append(spacer(8))

    # ════════════════════════════════════════════
    # SECTION 9: Conclusion
    # ════════════════════════════════════════════
    story.append(heading1("9. Conclusion & Recommendations"))
    story.append(accent_line())
    story.append(body(
        "The NEPSE Vedic Astrology Trading Platform represents a strategically compelling opportunity "
        "to pioneer a new product category at the intersection of fintech and Vedic tradition. With a "
        "$3 billion global astrology market projected to triple by 2030, Nepal's cultural affinity for "
        "Jyotish, and zero direct competition in the NEPSE-astrology niche, the platform is positioned "
        "for exceptional market traction. The proposed microservices architecture, AI-Vedic hybrid "
        "prediction engine, and phased 18-month roadmap provide a technically sound and commercially "
        "viable path from concept to market leadership."
    ))
    story.append(body(
        "<b>Recommended Immediate Next Steps:</b> (1) Assemble a core team of 2 full-stack developers, "
        "1 Vedic astrology subject matter expert, and 1 data scientist. (2) Secure initial seed funding "
        "of $150,000-$250,000 to cover Phase 1 development and infrastructure costs. (3) Establish "
        "partnerships with NEPSE data providers and select a primary Vedic API partner (KundliAPI.com "
        "recommended for breadth of endpoints). (4) Develop a minimum viable product (MVP) focusing on "
        "the Market Dashboard and basic Vedic Chart Engine within 90 days. (5) Initiate early user "
        "testing with a closed beta group of 100-200 retail investors to validate product-market fit "
        "and refine the user experience before public launch."
    ))
    story.append(body(
        "<b>Long-Term Vision:</b> Beyond the initial 18-month roadmap, the platform should explore "
        "expansion into adjacent South Asian markets (India, Sri Lanka, Bangladesh) where Vedic astrology "
        "and stock market participation share similar cultural resonance. An API marketplace for "
        "third-party developers to build astrology-trading tools on the platform's infrastructure could "
        "create a self-sustaining ecosystem. Ultimately, the platform envisions becoming the definitive "
        "destination for astrology-informed financial intelligence across emerging markets, setting the "
        "global standard for this emerging product category."
    ))

    # ──────────────────────────────────────────────
    # Build PDF
    # ──────────────────────────────────────────────
    doc.build(
        story,
        onFirstPage=on_first_page,
        onLaterPages=on_later_pages,
    )
    print(f"Body PDF generated: {output_path}")


if __name__ == '__main__':
    build_report()
