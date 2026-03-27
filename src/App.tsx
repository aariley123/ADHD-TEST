import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ADULT_ASRS, CHILD_SNAP_IV, AssessmentData, ADHD_FAQ } from './data/questions';
import { 
  ChevronLeft, ClipboardCheck, User, Baby, ArrowRight, HelpCircle, 
  ChevronDown, AlertCircle, Sparkles, RefreshCw, Info
} from 'lucide-react';

type View = 'gate' | 'home' | 'assessment' | 'result';

const VALID_CODES = [
  '7K2S9D5F',
  'G4T7B2N9',
  'P8R5V1M3',
  'Z6X2C7J5',
  'Q3W9E4S7',
  'A6D2F8G4',
  'H5J7K1L9',
  'U2I6O3P7',
  'Y4E7R2T5',
  'N8B3V6M1',
  'ADHD-TEST-CODE'

];

function Gatekeeper({ onAuthorize }: { onAuthorize: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_CODES.includes(code.trim().toUpperCase())) {
      onAuthorize();
    } else {
      setError('兑换码无效，请检查后重试');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 sm:space-y-8 px-2 sm:px-4"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 text-white rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3">
        <ClipboardCheck size={32} className="sm:w-10 sm:h-10" />
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">输入兑换码</h1>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">请输入您的专属兑换码以开始测评</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="例如: ADHD-2026-001"
            className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl text-center text-base sm:text-lg font-bold tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all uppercase"
          />
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-7 left-0 right-0 text-center text-red-500 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1"
              >
                <AlertCircle size={12} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button 
          type="submit"
          className="w-full py-4 sm:py-5 bg-slate-900 text-white rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          立即验证
        </button>
      </form>

      <div className="pt-8 text-center space-y-4">
        <p className="text-slate-400 text-xs font-medium">没有兑换码？请联系您的服务提供商获取</p>
        <div className="flex justify-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        </div>
      </div>
    </motion.div>
  );
}

const OPTIONS = [
  { label: '从不', value: 0, color: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-200' },
  { label: '很少', value: 1, color: 'bg-blue-50', text: 'text-blue-400', border: 'border-blue-100' },
  { label: '有时', value: 2, color: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-200' },
  { label: '经常', value: 3, color: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' },
  { label: '总是', value: 4, color: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-600' },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 pt-6 sm:pt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <HelpCircle size={18} className="sm:w-5 sm:h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold">常见问题解答</h2>
      </div>
      <div className="space-y-3">
        {ADHD_FAQ.map((item, index) => (
          <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-bold text-slate-700 text-xs sm:text-sm">{item.question}</span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform sm:w-[18px] sm:h-[18px] ${openIndex === index ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="px-4 pb-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('adhd_authorized') === 'true';
  });
  const [view, setView] = useState<View>(isAuthorized ? 'home' : 'gate');

  const handleAuthorize = () => {
    localStorage.setItem('adhd_authorized', 'true');
    setIsAuthorized(true);
    setView('home');
  };
  const [currentData, setCurrentData] = useState<AssessmentData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startAssessment = (data: AssessmentData) => {
    setCurrentData(data);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setView('assessment');
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (currentData && currentQuestionIndex < currentData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setView('result');
    }
  };

  const calculateScore = (): number => {
    if (!currentData) return 0;
    return (Object.values(answers) as number[]).reduce((acc: number, curr: number) => acc + curr, 0);
  };

  const getResultData = () => {
    const score = calculateScore();
    const maxScore = (currentData?.questions.length || 0) * 4;
    const percentage = (score / maxScore) * 100;

    if (percentage < 30) {
      return {
        risk: '低风险',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        feedback: "您的得分较低，目前看来症状并不明显。",
        suggestions: ["继续保持良好的生活作息。", "关注情绪对注意力的短期影响。"]
      };
    }
    if (percentage < 60) {
      return {
        risk: '中等风险',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-100',
        feedback: "您的得分处于中等水平，可能存在一些 ADHD 相关的困扰。",
        suggestions: ["尝试使用清单和提醒工具。", "规律运动有助于提高专注力。"]
      };
    }
    return {
      risk: '高风险',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      feedback: "您的得分较高，具有较明显的 ADHD 倾向，建议咨询专业医生。",
      suggestions: ["寻求专业诊断：建议前往精神科进行评估。", "了解 ADHD 相关书籍，减少自我责备。"]
    };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <div className="max-w-xl mx-auto px-4 py-6 sm:py-12">
        <AnimatePresence mode="wait">
          {view === 'gate' && (
            <Gatekeeper onAuthorize={handleAuthorize} />
          )}

          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 sm:space-y-8">
              <header className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <ClipboardCheck size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">ADHD 专业测评</h1>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">Scientific Screening</p>
                </div>
              </header>

              <div className="grid gap-3 sm:gap-4">
                <button onClick={() => startAssessment(ADULT_ASRS)} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-blue-500 transition-all text-left shadow-sm group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] sm:text-xs uppercase">
                        <User size={12} className="sm:w-3.5 sm:h-3.5" /><span>成人版 (ASRS)</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold">成人注意力缺陷评估</h2>
                      <p className="text-slate-500 text-xs sm:text-sm">适用于 18 岁及以上成年人</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors sm:w-5 sm:h-5" />
                  </div>
                </button>

                <button onClick={() => startAssessment(CHILD_SNAP_IV)} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-emerald-500 transition-all text-left shadow-sm group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] sm:text-xs uppercase">
                        <Baby size={12} className="sm:w-3.5 sm:h-3.5" /><span>儿童版 (SNAP-IV)</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold">儿童注意力缺陷评估</h2>
                      <p className="text-slate-500 text-xs sm:text-sm">适用于 6-18 岁儿童</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors sm:w-5 sm:h-5" />
                  </div>
                </button>
              </div>

              <FAQSection />

              <footer className="pt-8 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
                  <Info size={14} />
                  <span>测评结果仅供参考，不作为临床诊断依据</span>
                </div>
              </footer>
            </motion.div>
          )}

          {view === 'assessment' && currentData && (
            <motion.div key="assessment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <button onClick={() => setView('home')} className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-sm sm:text-base">
                  <ChevronLeft size={18} className="sm:w-5 sm:h-5" /><span>返回</span>
                </button>
                <div className="text-[10px] sm:text-xs font-bold text-slate-400">
                  {currentQuestionIndex + 1} / {currentData.questions.length}
                </div>
              </div>

              <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 space-y-6 sm:space-y-8">
                <div className="h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-blue-600" initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / currentData.questions.length) * 100}%` }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">{currentData.questions[currentQuestionIndex].text}</h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(currentData.questions[currentQuestionIndex].id, option.value)}
                      className={`flex items-center justify-center p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-95 shadow-sm
                        ${option.color} ${option.border} ${option.text}`}
                    >
                      <span className="font-bold text-base sm:text-lg">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'result' && currentData && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 sm:space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 text-center space-y-5 sm:space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold">测评结果</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">{currentData.title}</p>
                </div>

                <div className={`py-2 flex flex-col items-center justify-center relative ${getResultData().color}`}>
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="stroke-slate-100 fill-none"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="282.7"
                        initial={{ strokeDashoffset: 282.7 }}
                        animate={{ 
                          strokeDashoffset: 282.7 - (282.7 * (calculateScore() / (currentData.questions.length * 4))) 
                        }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl sm:text-5xl font-black text-slate-900"
                      >
                        {calculateScore()}
                      </motion.span>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                        / {currentData.questions.length * 4}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest ${getResultData().bg} ${getResultData().color} border ${getResultData().border}`}>
                    <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{getResultData().risk}</span>
                  </div>
                </div>

                <div className={`${getResultData().bg} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-left flex gap-3 border ${getResultData().border}`}>
                  <AlertCircle className={getResultData().color} size={18} />
                  <div className="space-y-1">
                    <p className={`font-bold text-xs sm:text-sm ${getResultData().color}`}>测评结论</p>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{getResultData().feedback}</p>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">建议：</p>
                  <ul className="space-y-2">
                    {getResultData().suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2 text-slate-600 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-left text-[10px] sm:text-sm text-slate-500 bg-slate-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-2">
                  <p className="font-bold text-slate-700">专业说明：</p>
                  <p className="leading-relaxed">{currentData.scoringInfo}</p>
                </div>

                <button onClick={() => setView('home')} className="w-full py-3.5 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-blue-700 transition-all shadow-lg">
                  返回首页
                </button>
              </div>

              <div className="text-center text-slate-400 text-[10px] sm:text-sm px-4 sm:px-8">
                温馨提示：本测评仅作为初步筛查工具。如果您或您的孩子在生活、学习中感到明显困扰，请务必前往正规医疗机构寻求专业医生的帮助。
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
