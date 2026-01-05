
import { useState, useMemo } from 'react';
import { Search, AlertTriangle, Database, Code2, Network, User, CheckCircle2, SearchX } from 'lucide-react';
import { errorDictionaryData, ErrorCategory } from '../data/errorDictionaryData';

const ErrorDictionarySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Critical', 'Database', 'Logic', 'Interface', 'User'];

  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      case 'Database': return <Database className="h-4 w-4" />;
      case 'Logic': return <Code2 className="h-4 w-4" />;
      case 'Interface': return <Network className="h-4 w-4" />;
      case 'User': return <User className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const filteredData = useMemo(() => {
    let items: { cat: string; item: any }[] = [];
    
    // Flatten data for filtering
    errorDictionaryData.forEach((cat: ErrorCategory) => {
      if (activeCategory === 'All' || activeCategory === cat.category) {
        cat.items.forEach(item => {
          items.push({ cat: cat.category, item });
        });
      }
    });

    // Apply Search
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      items = items.filter(({ item }) => 
        item.code.toLowerCase().includes(lowerTerm) || 
        item.title.toLowerCase().includes(lowerTerm) ||
        item.mean.toLowerCase().includes(lowerTerm)
      );
    }

    return items;
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              런타임 에러 사전 (Error Dictionary)
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Top 30 빈출 런타임 에러를 쉽게 찾아보세요.
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="에러코드 또는 한글명 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeCategory === cat 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {activeCategory === cat && cat !== 'All' && getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map(({ cat, item }, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${
                cat === 'Critical' ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {item.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    cat === 'Critical' ? 'bg-red-50 text-red-600' : 
                    cat === 'Database' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {cat}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              
              <div className="mb-4">
                <span className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-medium mb-2">
                  💡 {item.mean}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              
              <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <span>담당 부서</span>
                <span className="font-semibold text-gray-600 flex items-center gap-1">
                  {item.dept.includes('개발') ? '🛠️' : item.dept.includes('Help') ? '💻' : '⚙️'} 
                  {item.dept}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <SearchX className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">검색 결과가 없습니다.</p>
          <p className="text-xs text-gray-400 mt-1">다른 키워드로 검색해보세요.</p>
        </div>
      )}
    </div>
  );
};

export default ErrorDictionarySection;
