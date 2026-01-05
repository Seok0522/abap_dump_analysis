
import GlossarySection from './GlossarySection';
import ErrorDictionarySection from './ErrorDictionarySection';

const KnowledgeBase = () => {
  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SAP 시스템 지식 백과</h1>
        <p className="text-gray-500 text-lg">
          비즈니스 언어로 번역된 IT 용어 가이드 & 에러 사전
        </p>
      </div>

      {/* Glossary Section */}
      <GlossarySection />

      {/* Error Dictionary Section */}
      <ErrorDictionarySection />
    </div>
  );
};

export default KnowledgeBase;
