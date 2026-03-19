import { motion } from 'framer-motion';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">欢迎来到我的作品集</span>
              </motion.div>

              <h1 className="mb-6">
                你好，我是
                <span className="text-gradient block mt-2">{profile.name}</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/portfolio" className="btn btn-primary inline-flex items-center">
                  查看作品
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <a
                  href={profile.resume}
                  download
                  className="btn btn-outline inline-flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  下载简历
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    5+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">年经验</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    50+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">完成项目</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    15+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">获奖作品</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Avatar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-4 -right-4 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-50"
                />
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50"
                />

                {/* Avatar */}
                <div className="relative z-10">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">精选作品</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              这里展示了我最具代表性的设计作品
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/portfolio/${project.id}`}
                  className="card card-hover block overflow-hidden group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link to="/portfolio" className="btn btn-primary inline-flex items-center">
              查看全部作品
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="mb-6 text-white">让我们一起创造精彩</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              如果您有任何项目想法或合作机会，欢迎随时与我联系
            </p>
            <Link
              to="/contact"
              className="btn bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center"
            >
              联系我
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
