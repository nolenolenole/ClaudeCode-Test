import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { profile, skills, experiences, education } from '../data/profile';

export default function About() {
  const skillCategories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="mb-6">关于我</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {profile.bio}
            </p>
            <div className="space-y-3 mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">邮箱：</span> {profile.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">电话：</span> {profile.phone}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">位置：</span> {profile.location}
              </p>
            </div>
            <a href={profile.resume} download className="btn btn-primary inline-flex items-center">
              <Download className="w-5 h-5 mr-2" />
              下载简历
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-center items-center"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full max-w-md rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="mb-8">技能专长</h2>
          {skillCategories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-primary"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="mb-8">工作经历</h2>
          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{exp.position}</h3>
                    <p className="text-primary-600 dark:text-primary-400">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 mt-2 md:mt-0">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {exp.description}
                </p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-primary-600 dark:text-primary-400 mr-2">
                        •
                      </span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="mb-8">教育背景</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div key={edu.id} className="card p-6">
                <h3 className="text-xl font-bold mb-2">{edu.school}</h3>
                <p className="text-primary-600 dark:text-primary-400 mb-2">
                  {edu.degree} · {edu.field}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {edu.duration}
                </p>
                {edu.description && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
