import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';
import { socialLinks } from '../../data/profile';

const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <span className="font-display font-bold text-xl">张设计</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              专注于用户体验设计，擅长将复杂的问题转化为简洁优雅的解决方案。
            </p>
            <div className="flex space-x-4">
              {socialLinks.slice(0, 4).map((social) => {
                const Icon = iconMap[social.icon] || Mail;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  作品集
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  关于我
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  博客
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="mailto:designer@example.com"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  designer@example.com
                </a>
              </li>
              <li>+86 138 0000 0000</li>
              <li>中国 · 上海</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
              © {currentYear} 张设计. Made with{' '}
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> in Shanghai
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                隐私政策
              </Link>
              <Link
                to="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                使用条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
