import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AIGenerator from './pages/AIGenerator';
import Inspiration from './pages/Inspiration';
import NestedTable from './pages/NestedTable';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* AI Generator页面 - 独立布局 */}
          <Route path="/ai-generator" element={<AIGenerator />} />
          
          {/* Inspiration页面 - 独立布局 */}
          <Route path="/inspiration" element={<Inspiration />} />

          {/* NestedTable页面 - 独立布局 */}
          <Route path="/nested-table" element={<NestedTable />} />
          
          {/* 其他页面 - 使用标准布局 */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
