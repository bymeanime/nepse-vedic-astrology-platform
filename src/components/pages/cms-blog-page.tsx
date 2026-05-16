'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  PenTool,
  Plus,
  Search,
  Trash2,
  Edit,
  Calendar,
  User,
  Eye,
  Tag,
} from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  status: string
  categoryId: string | null
  viewCount: number
  createdAt: string
  updatedAt: string
  author: { id: string; name: string | null; email: string } | null
  category: { id: string; name: string; slug: string } | null
}

interface Category {
  id: string
  name: string
  slug: string
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  PUBLISHED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  ARCHIVED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export function CmsBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editPost, setEditPost] = useState<BlogPost | null>(null)
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    categoryId: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [blogRes, catRes] = await Promise.allSettled([
        fetch('/api/blog'),
        fetch('/api/categories'),
      ])

      if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
        const data = await blogRes.value.json()
        setPosts(data.data ?? [])
      }
      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const data = await catRes.value.json()
        setCategories(data.data ?? [])
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  function openCreateDialog() {
    setEditPost(null)
    setFormData({ title: '', slug: '', excerpt: '', content: '', status: 'DRAFT', categoryId: '' })
    setDialogOpen(true)
  }

  function openEditDialog(post: BlogPost) {
    setEditPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: '',
      status: post.status,
      categoryId: post.categoryId ?? '',
    })
    setDialogOpen(true)
  }

  function handleTitleChange(title: string) {
    setFormData({
      ...formData,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    })
  }

  async function handleSubmit() {
    if (!formData.title || !formData.slug) {
      toast.error('Title and slug are required')
      return
    }

    setSubmitting(true)
    try {
      if (editPost) {
        const res = await fetch(`/api/blog/${editPost.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            status: formData.status,
            categoryId: formData.categoryId || null,
          }),
        })
        if (res.ok) {
          toast.success('Post updated successfully')
          setDialogOpen(false)
          loadData()
        } else {
          const data = await res.json()
          toast.error(data.error || 'Failed to update post')
        }
      } else {
        const res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            authorId: '1',
          }),
        })
        if (res.ok) {
          toast.success('Post created successfully')
          setDialogOpen(false)
          loadData()
        } else {
          const data = await res.json()
          toast.error(data.error || 'Failed to create post')
        }
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deletePost) return
    try {
      const res = await fetch(`/api/blog/${deletePost.slug}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Post deleted successfully')
        setDeletePost(null)
        loadData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete post')
      }
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-lg font-semibold">Blog Posts</h2>
            <p className="text-sm text-muted-foreground">Manage your blog content</p>
          </div>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Views</TableHead>
                  <TableHead className="hidden lg:table-cell">Author</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden sm:table-cell text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <>
                      <TableRow
                        key={post.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => setExpandedRow(expandedRow === post.id ? null : post.id)}
                      >
                        <TableCell>
                          <div className={`transition-transform ${expandedRow === post.id ? 'rotate-90' : ''}`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M4 2l4 4-4 4" />
                            </svg>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {post.category && (
                            <Badge variant="secondary" className="text-[10px] bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
                              <Tag className="mr-1 h-2.5 w-2.5" />
                              {post.category.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-[10px] ${STATUS_COLORS[post.status] ?? ''}`}>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right">
                          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {post.viewCount}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {post.author?.name ?? 'Unknown'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(post)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              onClick={() => setDeletePost(post)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRow === post.id && (
                        <TableRow key={`${post.id}-expanded`}>
                          <TableCell colSpan={8} className="bg-muted/30 px-6 py-4">
                            <div className="space-y-2">
                              {post.excerpt && (
                                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {post.author?.name ?? 'Unknown'} ({post.author?.email ?? ''})
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Created: {new Date(post.createdAt).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Updated: {new Date(post.updatedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-sm">
                      <PenTool className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                      {posts.length === 0 ? 'No blog posts yet. Create your first post.' : 'No posts match your search.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
            <DialogDescription>
              {editPost ? 'Update the blog post details.' : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="post-title">Title *</Label>
              <Input
                id="post-title"
                placeholder="Post title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-slug">Slug *</Label>
              <Input
                id="post-slug"
                placeholder="post-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-excerpt">Excerpt</Label>
              <Textarea
                id="post-excerpt"
                placeholder="Brief summary of the post..."
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>
            {!editPost && (
              <div className="grid gap-2">
                <Label htmlFor="post-content">Content</Label>
                <Textarea
                  id="post-content"
                  placeholder="Write your blog post content here..."
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editPost ? 'Update Post' : 'Create Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePost} onOpenChange={(open) => !open && setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePost?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
