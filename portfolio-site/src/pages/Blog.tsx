import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../data/blog';

export default function Blog() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4">博客</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            分享设计思考、经验总结和行业洞察
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    阅读更多 →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
