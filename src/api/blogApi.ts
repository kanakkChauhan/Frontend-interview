export interface Blog {
  id: number;
  title: string;
  category: string[];
  description: string;
  date: string;
  coverImage: string;
  content: string;
}

const BASE_URL = 'http://localhost:3001';

export const blogApi = {
  // Task 1: Get all blogs
  getAll: async (): Promise<Blog[]> => {
    const res = await fetch(`${BASE_URL}/blogs`);
    return res.json();
  },

  // Task 2: Get a specific blog by ID
  getById: async (id: number): Promise<Blog> => {
    const res = await fetch(`${BASE_URL}/blogs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog details');
    return res.json();
  },

// Add this to your blogApi object in src/api/blogApi.ts
create: async (newBlog: Partial<Blog>): Promise<Blog> => {
  const res = await fetch(`${BASE_URL}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...newBlog,
      category: newBlog.category || ["FINANCE"],
      date: new Date().toISOString(),
      coverImage: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
    }),
  });
  return res.json();
},

};
