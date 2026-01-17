import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogApi, Blog } from './api/blogApi'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function App() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: blogs, isLoading: listLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getAll
  });

  const { data: selectedBlog, isLoading: detailLoading } = useQuery({
    queryKey: ['blog', selectedId],
    queryFn: () => blogApi.getById(selectedId!),
    enabled: !!selectedId,
  });

  const createMutation = useMutation({
    mutationFn: blogApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setIsDialogOpen(false);
      alert("Blog created successfully!");
    },
  });

  const handleCreateBlog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
    });
  };

  if (listLoading) return <div className="p-20 text-center text-[#4F46E5] font-bold">Loading CA Monk...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A]">
      
      <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#4F46E5] p-2 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="text-xl font-normal text-black tracking-tight">CA MONK</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-black">Tools</a>
          <a href="#" className="hover:text-black">Practice</a>
          <a href="#" className="hover:text-black">Events</a>
          <a href="#" className="hover:text-black">Job Board</a>
          <a href="#" className="hover:text-black">Points</a>
        </div>

        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full border-[#3D5AFE] text-[#3D5AFE] hover:bg-[#3D5AFE] hover:text-white">
                + New Post
              </Button>
            </DialogTrigger>
         
            <DialogContent className="bg-white border-none sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-black">Create New Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBlog} className="space-y-4 pt-4">
                <Input name="title" className="bg-white text-black border-slate-200" placeholder="Blog Title" required />
                <Input name="description" className="bg-white text-black border-slate-200" placeholder="Short Summary" required />
                <Textarea name="content" className="bg-white text-black border-slate-200 min-h-[150px]" placeholder="Content..." required />
                <Button type="submit" className="w-full bg-black text-white hover:bg-slate-800" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Posting..." : "Publish Post"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button className="bg-[#4F46E5] square-full px-6 text-white font-semibold">
            Profile
            </Button>
        </div>
      </nav>
   
      <header className="py-16 text-center">
        <h1 className="text-5xl font-extrabold text-[#1A1A1A] mb-4">CA Monk Blog</h1>
        <p className="text-slate-500 text-lg">Stay updated with latest trends in finance accounting and career growth.</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-bold text-l text-[#1A1A1A] uppercase tracking-widest px-2">Latest Articles</h3>
          <div className="space-y-3">
            {blogs?.map((blog: Blog) => {
              const isActive = selectedId === blog.id;
              return (
                <Card 
                  key={blog.id} 
                  onClick={() => setSelectedId(blog.id)}
                  className={`relative cursor-pointer border-none transition-all ${isActive ? 'bg-white shadow-sm' : 'hover:bg-slate-100/50'}`}
                >
                  {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#3D5AFE] rounded-r-full" />}
                  <CardHeader className={`p-5 pl-8 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[#3D5AFE] uppercase">
                      <span>{blog.category?.[0]}</span>
                      <span className="text-slate-400">2 days ago</span>
                    </div>
                    <CardTitle className="text-md font-bold mb-2">{blog.title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{blog.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-8">
          {detailLoading ? (
            <div className="h-[450px] flex items-center justify-center bg-white rounded-3xl animate-pulse text-slate-300">Loading Article...</div>
          ) : selectedBlog ? (
            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-3xl">
              <img src={selectedBlog.coverImage} className="w-full h-[450px] object-cover" alt="Cover" />
              <div className="p-10">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#3D5AFE] uppercase mb-4">
                  <span>{selectedBlog.category?.[0]}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">5 min read</span>
                </div>
                <h2 className="text-4xl font-extrabold text-[#1A1A1A] mb-6 leading-tight">{selectedBlog.title}</h2>
                <Button className="bg-black text-white px-5 py-6 rounded-xl mb-10">Share Article</Button>

                <div className="grid grid-cols-3 border-y border-slate-100 py-6 mb-10 bg-slate-50/50 rounded-xl px-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Category</p>
                    <p className="text-sm font-bold text-slate-700">{selectedBlog.category?.join(" & ")}</p>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Read Time</p>
                    <p className="text-sm font-bold text-slate-700">5 Mins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Date</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(selectedBlog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center border-2 border-dashed rounded-3xl text-slate-400 bg-white">
              Select an article to begin reading
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
