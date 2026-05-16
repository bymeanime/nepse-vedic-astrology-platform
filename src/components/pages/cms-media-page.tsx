'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageIcon, Search, Upload, Trash2, Eye, FileImage, Download } from 'lucide-react'
import { toast } from 'sonner'

interface MediaItem {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt: string | null
  createdAt: string
}

export function CmsMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data.data ?? [])
      }
    } catch {
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('alt', file.name.replace(/\.[^.]+$/, ''))

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        toast.success('File uploaded successfully')
        setUploadDialogOpen(false)
        loadMedia()
      } else {
        const err = await res.json()
        toast.error(err.error?.message ?? 'Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    }
    e.target.value = ''
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/media/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('File deleted')
        setDeleteOpen(false)
        loadMedia()
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Failed to delete')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const getMimeTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    if (mimeType.startsWith('video/')) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
    if (mimeType.startsWith('audio/')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  }

  const filteredMedia = media.filter((item) => {
    const matchesSearch =
      item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'image' && item.mimeType.startsWith('image/')) ||
      (typeFilter === 'video' && item.mimeType.startsWith('video/')) ||
      (typeFilter === 'other' && !item.mimeType.startsWith('image/') && !item.mimeType.startsWith('video/'))
    return matchesSearch && matchesType
  })

  const stats = {
    total: media.length,
    images: media.filter((m) => m.mimeType.startsWith('image/')).length,
    totalSize: media.reduce((acc, m) => acc + m.size, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-amber-600" />
            Media Library
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize uploaded files and images
          </p>
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.images}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSize(stats.totalSize)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <FileImage className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode('table')}
                >
                  <FileImage className="h-4 w-4 rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setPreviewItem(item)
                    setPreviewOpen(true)
                  }}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {item.mimeType.startsWith('image/') ? (
                      <img
                        src={item.url}
                        alt={item.alt ?? item.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileImage className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{item.originalName}</p>
                    <p className="text-[10px] text-muted-foreground">{formatSize(item.size)}</p>
                  </div>
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7 bg-white/90 dark:bg-gray-900/90"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewItem(item)
                        setPreviewOpen(true)
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-7 w-7 bg-white/90 dark:bg-gray-900/90 hover:bg-rose-100 hover:text-rose-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(item.id)
                        setDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredMedia.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    {media.length === 0
                      ? 'No files uploaded yet. Upload your first file to get started.'
                      : 'No files match your search or filter.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Size</TableHead>
                    <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedia.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                            <FileImage className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{item.originalName}</p>
                            <p className="text-[10px] text-muted-foreground">{item.filename}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${getMimeTypeColor(item.mimeType)}`}
                        >
                          {item.mimeType.split('/')[1]?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{formatSize(item.size)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                          onClick={() => {
                            setDeleteId(item.id)
                            setDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMedia.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                        No media files found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload an image or file to your media library.
            </DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              Drag and drop or click to select a file
            </p>
            <Input
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={handleUpload}
              className="max-w-xs mx-auto"
            />
            <p className="text-[10px] text-muted-foreground mt-2">
              Supports images, videos, audio, PDF, and documents
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewItem?.originalName ?? 'Preview'}</DialogTitle>
            <DialogDescription>
              {previewItem?.alt} &middot; {previewItem && formatSize(previewItem.size)} &middot;{' '}
              {previewItem?.mimeType}
            </DialogDescription>
          </DialogHeader>
          {previewItem?.mimeType.startsWith('image/') && (
            <div className="flex justify-center bg-muted rounded-lg p-4">
              <img
                src={previewItem.url}
                alt={previewItem.alt ?? previewItem.originalName}
                className="max-h-[400px] object-contain rounded"
              />
            </div>
          )}
          {previewItem && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Filename</p>
                <p className="font-medium">{previewItem.originalName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{previewItem.mimeType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{formatSize(previewItem.size)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">{new Date(previewItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            {previewItem && (
              <Button variant="outline" asChild>
                <a href={previewItem.url} download={previewItem.originalName} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
