import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { profile } from '../data/profile';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    alert('感谢您的留言！我会尽快回复您。');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4">联系我</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            有任何项目想法或合作机会？欢迎随时与我联系
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">联系方式</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">邮箱</h3>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">电话</h3>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">位置</h3>
                  <p className="text-gray-600 dark:text-gray-400">{profile.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-primary rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">工作时间</h3>
              <p className="opacity-90">周一至周五：9:00 - 18:00</p>
              <p className="opacity-90">周末：预约制</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="card p-8">
              <div className="mb-6">
                <label htmlFor="name" className="block font-medium mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block font-medium mb-2">
                  邮箱 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block font-medium mb-2">
                  主题 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="请输入主题"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block font-medium mb-2">
                  留言 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="请输入您的留言..."
                />
              </div>

              <button type="submit" className="btn btn-primary w-full inline-flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                发送消息
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
