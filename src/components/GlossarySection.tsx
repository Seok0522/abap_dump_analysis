
import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { glossaryData } from '../data/glossaryData';

const GlossarySection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-blue-50/50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-blue-600 h-5 w-5" />
          SAP 필수 용어 가이드 (Glossary)
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          IT 전문 용어를 비즈니스 언어와 쉬운 비유로 설명합니다.
        </p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {glossaryData.map((item, index) => (
          <div key={index} className="group">
            <button 
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">
                  {item.term}
                </span>
                {openIndex !== index && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                    {item.analogy}
                  </span>
                )}
              </div>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 pt-0 bg-gray-50/50">
                <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded shrink-0">
                      비유 (Analogy)
                    </span>
                    <p className="text-gray-800 font-medium">"{item.analogy}"</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed pl-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlossarySection;
