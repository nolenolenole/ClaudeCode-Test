export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  tags: string[];
  year: string;
  client?: string;
  role: string;
  duration: string;
  challenge: string;
  solution: string;
  results: string[];
  link?: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface Skill {
  name: string;
  level: number;
  category: string;
  icon?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  duration: string;
  description?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
