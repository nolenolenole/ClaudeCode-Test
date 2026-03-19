import type { Skill, Experience, Education, SocialLink } from '../types';

export const profile = {
  name: '张设计',
  title: '交互设计师',
  bio: '专注于用户体验设计，擅长将复杂的问题转化为简洁优雅的解决方案。拥有5年以上的产品设计经验，服务过多家知名互联网公司。',
  email: 'designer@example.com',
  phone: '+86 138 0000 0000',
  location: '中国 · 上海',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  resume: '/resume.pdf',
};

export const skills: Skill[] = [
  // 设计工具
  { name: 'Figma', level: 95, category: '设计工具' },
  { name: 'Sketch', level: 90, category: '设计工具' },
  { name: 'Adobe XD', level: 85, category: '设计工具' },
  { name: 'Photoshop', level: 88, category: '设计工具' },
  { name: 'Illustrator', level: 82, category: '设计工具' },
  
  // 设计技能
  { name: 'UI设计', level: 95, category: '设计技能' },
  { name: 'UX设计', level: 92, category: '设计技能' },
  { name: '交互设计', level: 94, category: '设计技能' },
  { name: '视觉设计', level: 90, category: '设计技能' },
  { name: '原型设计', level: 93, category: '设计技能' },
  
  // 研究方法
  { name: '用户研究', level: 88, category: '研究方法' },
  { name: '可用性测试', level: 85, category: '研究方法' },
  { name: '数据分析', level: 80, category: '研究方法' },
  
  // 开发技能
  { name: 'HTML/CSS', level: 75, category: '开发技能' },
  { name: 'JavaScript', level: 70, category: '开发技能' },
  { name: 'React', level: 65, category: '开发技能' },
];

export const experiences: Experience[] = [
  {
    id: '1',
    company: '某大型互联网公司',
    position: '高级交互设计师',
    duration: '2022.01 - 至今',
    description: '负责公司核心产品的用户体验设计，带领设计团队完成多个重要项目。',
    achievements: [
      '主导电商平台重设计项目，用户转化率提升30%',
      '建立完整的设计系统，提升团队协作效率40%',
      '指导3名初级设计师，帮助团队成长',
      '获得公司年度最佳设计师奖',
    ],
  },
  {
    id: '2',
    company: '创业公司',
    position: '产品设计师',
    duration: '2020.03 - 2021.12',
    description: '从0到1参与多个产品的设计工作，负责产品的整体用户体验。',
    achievements: [
      '独立完成智能家居App的设计，获得红点设计奖',
      '参与产品战略规划，提出多项创新设计方案',
      '建立用户研究流程，定期进行用户访谈和测试',
      '协助产品获得A轮融资',
    ],
  },
  {
    id: '3',
    company: '设计咨询公司',
    position: 'UI/UX设计师',
    duration: '2019.06 - 2020.02',
    description: '为多家客户提供设计咨询服务，涉及多个行业领域。',
    achievements: [
      '完成15+个客户项目，涵盖金融、教育、医疗等领域',
      '获得客户满意度评分4.8/5.0',
      '参与公司设计规范的制定',
      '组织内部设计分享会',
    ],
  },
];

export const education: Education[] = [
  {
    id: '1',
    school: '某知名大学',
    degree: '硕士',
    field: '交互设计',
    duration: '2017 - 2019',
    description: '专注于人机交互和用户体验研究，毕业论文获得优秀论文奖。',
  },
  {
    id: '2',
    school: '某艺术学院',
    degree: '学士',
    field: '视觉传达设计',
    duration: '2013 - 2017',
    description: '系统学习平面设计、品牌设计等视觉设计相关知识。',
  },
];

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com', icon: 'Github' },
  { name: 'Dribbble', url: 'https://dribbble.com', icon: 'Dribbble' },
  { name: 'Behance', url: 'https://behance.net', icon: 'Palette' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
  { name: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' },
  { name: 'Email', url: 'mailto:designer@example.com', icon: 'Mail' },
];
