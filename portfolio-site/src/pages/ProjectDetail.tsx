import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User, Clock } from 'lucide-react';
import { projects } from '../data/projects';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h1>项目未找到</h1>
          <Link to="/portfolio" className="btn btn-primary mt-8">
            返回作品集
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <Link
          to="/portfolio"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回作品集
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-4">
            {project.category}
          </div>
          <h1 className="mb-6">{project.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {project.longDescription}
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{project.year}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <User className="w-5 h-5 mr-2" />
              <span>{project.role}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-2" />
              <span>{project.duration}</span>
            </div>
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center"
            >
              查看项目
              <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          )}
        </motion.div>

        {/* Images Gallery */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          {project.images.map((image, index) => (
            <motion.img
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              src={image}
              alt={`${project.title} - ${index + 1}`}
              className="w-full rounded-xl shadow-lg"
            />
          ))}
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="mb-4">挑战</h3>
            <p className="text-gray-600 dark:text-gray-400">{project.challenge}</p>
          </div>
          <div>
            <h3 className="mb-4">解决方案</h3>
            <p className="text-gray-600 dark:text-gray-400">{project.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="mb-12">
          <h3 className="mb-6">项目成果</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.results.map((result, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="mb-4">技能标签</h3>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
