import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EXAMPLES } from '../constants';
import { Navbar } from '../components/Navbar';
import { useApp } from '../contexts/AppContext';

export const Showcase: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
             <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t.showcase.title}</h2>
             <p className="text-slate-600 dark:text-slate-400">{t.showcase.subtitle}</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
            {Object.entries(t.showcase.filters).map(([key, label]) => (
              <button 
                key={key} 
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${key === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent' : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-500'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EXAMPLES.map((example) => (
            <div 
              key={example.id}
              onClick={() => navigate(`/example/${example.id}`)}
              className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              {/* Image container */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-blue-900/20 z-10 group-hover:bg-transparent transition-colors"></div>
                <img 
                  src={example.thumbnail} 
                  alt={example.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 z-20">
                   <span className="px-2 py-1 text-xs font-bold bg-white/90 dark:bg-black/60 backdrop-blur-md text-slate-900 dark:text-white rounded border border-slate-200 dark:border-white/10 shadow-sm">
                     {example.category.toUpperCase()}
                   </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {language === 'zh' ? example.title_zh : example.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                   {language === 'zh' ? example.description_zh : example.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                   <span className={`text-xs font-semibold ${
                     example.difficulty === 'Beginner' ? 'text-green-600 dark:text-green-400' :
                     example.difficulty === 'Intermediate' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                   }`}>
                     {t.showcase.difficulty[example.difficulty.toLowerCase() as keyof typeof t.showcase.difficulty]}
                   </span>
                   <span className="text-blue-600 dark:text-blue-500 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                     {t.showcase.launch} &rarr;
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};