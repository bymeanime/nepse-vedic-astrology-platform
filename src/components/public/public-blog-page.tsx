'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Calendar, Eye, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string
  status: string; viewCount: number; createdAt: string
  category: { name: string } | null
  author: { name: string | null }
}

export function PublicBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { setPublicPage } = useAppStore()

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/blog')
        if (res.ok) { const data = await res.json(); setPosts((data.data ?? []).filter((p: BlogPost) => p.status === 'PUBLISHED')) }
      } catch { /* Silent */ } finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-amber-300" />
            <Badge variant="outline" className="text-[10px] border-amber-300/30 text-amber-200 bg-amber-500/10">
              Insights & Articles
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">Blog & Articles</h1>
          <p className="text-gray-300 mt-1">Expert analysis on Vedic astrology, market trends, and trading strategies</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-amber-500/20" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {post.category && <Badge variant="secondary" className="text-[10px]">{post.category.name}</Badge>}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author?.name ?? 'Admin'}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.viewCount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <h3 className="text-sm font-medium text-muted-foreground">No articles published yet</h3>
              <p className="text-xs text-muted-foreground mt-1">Check back soon for Vedic astrology insights and market analysis articles.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
