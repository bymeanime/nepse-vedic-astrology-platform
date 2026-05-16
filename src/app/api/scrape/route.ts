import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const urls = [
      'https://nepalstock.com/today-share-price',
      'https://www.sharesansar.com/today',
      'https://merolagani.com/latestmarket',
    ]
    const results = await Promise.allSettled(urls.map(async (url) => {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      const text = await res.text()
      return { url, status: res.status, length: text.length, snippet: text.substring(0, 2000) }
    }))
    return NextResponse.json(results.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason?.message }))
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
