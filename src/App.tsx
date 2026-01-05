
import React, { useState } from 'react';
import { Upload, FileText, Loader2, Book, Activity } from 'lucide-react';
import * as XLSX from 'xlsx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import KnowledgeBase from './components/KnowledgeBase';

interface AnalysisResult {
  summary: {
    status: string;
    executive_summary: string;
  };
  statistics: {
    type: string;
    count: number;
    percentage: string;
  }[];
  detailed_reports: {
    priority: string;
    category: string;
    error_type: string;
    program: string;
    users: string[];
    occurrence_pattern: string;
    root_cause_analysis: string;
    action_plan: string;
  }[];
}

const App = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'knowledge'>('analyzer');
  const [apiKey, setApiKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!apiKey || !file) {
      setError('API 키와 파일이 필요합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Preprocess data to reduce token count
      const processedData = jsonData.map((row: any) => ({
        Date: row['Date'],
        Time: row['Time'],
        User: row['User'],
        'Runtime Error': row['Runtime Error'],
        'Canceled Program': row['Canceled Program'],
        'Transaction ID': row['Transaction ID']
      }));

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-pro-preview",
        generationConfig: {
            temperature: 0.2,
            // @ts-ignore
            responseMimeType: "application/json"
        }
      });

      const prompt = `
Role: 당신은 20년 경력의 SAP 수석 BC(Basis Consultant)입니다.
Task: 사용자가 업로드한 SAP ABAP Dump 로그(Excel/CSV)를 분석하여, 운영팀이 즉시 조치할 수 있는 수준의 '심층 분석 보고서'를 JSON 데이터로 생성하십시오.
Language: **모든 분석 내용과 요약은 반드시 '한국어(Korean)'로 작성하십시오.**

Input Data (JSON):
${JSON.stringify(processedData.slice(0, 100))} 
(참고: 토큰 제한으로 인해 처음 100개의 행만 제공됩니다. 이 샘플을 기반으로 분석하십시오.)

**[CRITICAL] Analysis Heuristics (전문가 추론 규칙):**
분석 시 아래 규칙을 반드시 적용하여 'cause_analysis'와 'action_guide'를 작성하십시오.

1. **Memory Issue (TSV_TNEW_...):**
   - 조건: Runtime Error가 'TSV_TNEW_PAGE_ALLOC_FAILED' 이고, 주변 로그에 'SESSIONMEM_QUOTA_WARNING'이 있는 경우 (혹은 이 에러 단독 발생 시).
   - 추론: 사용자가 조회 조건 없이 '전체 조회'를 했거나, 프로그램의 Fetch 로직이 대용량 처리를 고려하지 않음.
   - 조치: "필수 조회 조건 설정(Mandatory Fields) 및 Fetch Size 분할(Package Processing) 튜닝 필요."

2. **Logic Error (SAPSQL_IN_ITAB_...):**
   - 조건: 'SAPSQL_IN_ITAB_ILLEGAL_SIGN' 발생.
   - 추론: SQL Range 변수의 SIGN 필드에 잘못된 값(Null 등)이 들어간 100% 코딩 오류.
   - 조치: "Range 변수 할당 로직 점검 및 방어 로직 추가."

3. **Frontend Issue (RAISE_EXCEPTION + GUI):**
   - 조건: Canceled Program이 'CL_GUI_FRONTEND_SERVICES' 또는 'SAPLOLEA' 인 경우.
   - 추론: 서버 문제가 아님. 사용자 PC의 엑셀 연동 중단, DRM 차단, 파일 경로 문제 등 클라이언트 환경 이슈.
   - 조치: "사용자 PC 점검 및 재부팅 안내 (서버 조치 불필요)."

4. **Indirect Coding Error (Standard Program Crash):**
   - 조건: Canceled Program이 'CL_GUI_ALV_GRID' 등 표준 클래스이고 Error가 'GETWA_NOT_ASSIGNED' 인 경우.
   - 추론: 표준 프로그램 버그가 아니라, 이를 호출한 CBO 프로그램의 파라미터 전달 오류일 확률 99%.
   - 조치: "ALV를 호출하는 상위 CBO 프로그램의 파라미터 맵핑 확인."

Output Format (JSON):
{
  "summary": {
    "status": "String (Stable/Warning/Critical - 영어로 유지)",
    "executive_summary": "String (경영진 보고용 3줄 요약 - 한국어)"
  },
  "statistics": [
    {"type": "Runtime Error", "count": Integer, "percentage": "String"}
  ],
  "detailed_reports": [
    {
      "priority": "High/Medium/Low (영어로 유지)",
      "category": "Resource/Logic/Coding/User (영어로 유지)",
      "error_type": "String",
      "program": "String (e.g., ZFIE1090)",
      "users": ["User1", "User2"],
      "occurrence_pattern": "String (e.g., 12/23 10시경 20분간 집중 발생 - 한국어)",
      "root_cause_analysis": "String (위 휴리스틱을 적용한 상세 원인 추론 - 한국어)",
      "action_plan": "String (운영팀 및 개발팀이 수행해야 할 구체적 조치 사항 - 한국어)"
    }
  ]
}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setResult(JSON.parse(text));

    } catch (err: any) {
      console.error(err);
      setError('분석 실패: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Header with Tabs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-blue-600" />
              SAP 덤프 분석기 (SAP Dump Analyzer)
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Powered by Gemini 3.0 Pro & Vibe Coding</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'analyzer' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="h-4 w-4" />
              덤프 분석기
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'knowledge' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Book className="h-4 w-4" />
              지식 백과
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'knowledge' ? (
          <KnowledgeBase />
        ) : (
          /* Analyzer Tab Content */
          <>
            {/* API Key Input */}
            <div className="flex justify-end">
               <input 
                  type="password" 
                  placeholder="Gemini API Key 입력" 
                  className="border rounded-md px-3 py-2 text-sm w-64 bg-white shadow-sm"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
               />
            </div>

            {/* Upload Section */}
            {!result && (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".xlsx, .xls" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">클릭하여 ABAP Dump 엑셀 파일 업로드</p>
                    {file && <p className="mt-2 text-blue-600 font-medium">{file.name}</p>}
                  </div>
                  
                  <button 
                    onClick={processFile}
                    disabled={isLoading || !file || !apiKey}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : '분석 시작 (Start Analysis)'}
                  </button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="space-y-6">
                
                {/* Executive Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">경영진 요약 (Executive Summary)</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      result.summary.status === 'Critical' ? 'bg-red-100 text-red-700' :
                      result.summary.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {result.summary.status}
                    </span>
                  </div>
                  <p className="text-gray-700">{result.summary.executive_summary}</p>
                </div>

                {/* Detailed Reports */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold">상세 분석 및 조치 계획 (Detailed Analysis & Action Plan)</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-medium uppercase text-xs">
                        <tr>
                          <th className="px-6 py-3">우선순위</th>
                          <th className="px-6 py-3">카테고리</th>
                          <th className="px-6 py-3">에러 / 프로그램</th>
                          <th className="px-6 py-3">원인 분석 (Root Cause)</th>
                          <th className="px-6 py-3">조치 계획 (Action Plan)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {result.detailed_reports.map((report, idx) => (
                          <tr key={idx} className={report.priority === 'High' ? 'bg-red-50' : 'hover:bg-gray-50'}>
                            <td className="px-6 py-4 font-medium">
                              <span className={`px-2 py-1 rounded text-xs ${
                                report.priority === 'High' ? 'bg-red-200 text-red-800' :
                                report.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-gray-200 text-gray-800'
                              }`}>
                                {report.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">{report.category}</td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-gray-900">{report.error_type}</div>
                              <div className="text-xs text-gray-500">{report.program}</div>
                              <div className="text-xs text-gray-400 mt-1">{report.users.length} Users affected</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="mb-1 text-xs text-gray-500 font-semibold">{report.occurrence_pattern}</div>
                              {report.root_cause_analysis}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-pre-line">
                              {report.action_plan}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center">
                     <button 
                    onClick={() => {setResult(null); setFile(null);}}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    다른 파일 분석하기
                  </button>
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
