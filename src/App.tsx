
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadSection } from './components/UploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { RecommendationSection } from './components/RecommendationSection';
import { StylePreview } from './components/StylePreview';
import { analyzeFace, getRecommendations } from './services/geminiService';
import { FacialAnalysis, RecommendationSet } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCcw, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  loginWithGoogle, 
  logout, 
  subscribeToAuth, 
  saveAnalysis 
} from './services/firebaseService';
import { User as FirebaseUser } from 'firebase/auth';

type AppStep = 'landing' | 'processing' | 'results';

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [analysis, setAnalysis] = useState<FacialAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationSet | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [hairType, setHairType] = useState<'straight' | 'curly' | 'wavy'>('straight');

  const [userImage, setUserImage] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const handlePreviewClick = (index: number) => {
    setActivePreviewIndex(index);
    const element = document.getElementById('preview');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleUpload = async (imageBase64: string) => {
    setStep('processing');
    setIsAnalyzing(true);
    setUserImage(imageBase64);
    
    try {
      // 1. Analyze Face
      const faceAnalysis = await analyzeFace(imageBase64);
      setAnalysis(faceAnalysis);
      
      // 2. Get Recommendations
      const styles = await getRecommendations(faceAnalysis, gender, hairType);
      setRecommendations(styles);
      
      // 3. Save to Firebase if logged in
      if (user) {
        await saveAnalysis(user.uid, imageBase64, faceAnalysis, styles);
      }
      
      setStep('results');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#333333', '#111111']
      });
    } catch (error: any) {
      console.error("Processing failed:", error);
      setStep('landing');
      const isFetchError = error.message?.includes('fetch') || error.message?.includes('NetworkError');
      alert(isFetchError 
        ? "AI Neural link interrupted. Please check your connection and refresh the interface." 
        : "Biometric analysis failed. Ensure your face is clearly visible and centered.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleDownloadReport = () => {
    if (!analysis || !recommendations) return;
    
    const reportContent = `
FACEFRAME AI - TRANSFORMATION REPORT
------------------------------------
Date: ${new Date().toLocaleDateString()}
Status: Complete
Protocol: FF_v4.2

[ SUBJECT PROFILE ]
Gender: ${gender.toUpperCase()}
Hair Type: ${hairType.toUpperCase()}

[ BIOMETRIC ANALYSIS ]
Face Shape: ${analysis.faceShape.toUpperCase()}
Confidence: ${analysis.confidenceScores.shape}%
Symmetry: ${analysis.symmetry}%

Analysis: ${analysis.summaryAnalysis}

Key Features:
- Jawline: ${analysis.jawline}
- Forehead: ${analysis.forehead}
- Cheekbones: ${analysis.cheekbones}
- Hairline: ${analysis.hairline}
- Skin Tone: ${analysis.skinTone}

[ STYLE RECOMMENDATIONS ]
${recommendations.bestStyles.map((s, i) => `
${i + 1}. ${s.name.toUpperCase()}
   Rationale: ${s.whyItWorks || s.description}
   Suitability: ${s.suitabilityScore}%
`).join('')}

[ EXPERT TIPS ]
${analysis.tips.map((t, i) => `- ${t}`).join('\n')}

[ CELEBRITY INSPIRATION ]
${recommendations.celebrityInspiration.join(', ')}

------------------------------------
END OF REPORT / FF_PROTOCOL_GENERATED
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `FaceFrame_Analysis_${new Date().toISOString().split('T')[0]}.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (e) {
      console.error("Download fallback triggered:", e);
      window.open(url, '_blank');
    }
  };

  const reset = () => {
    setStep('landing');
    setAnalysis(null);
    setRecommendations(null);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-cyan selection:text-black font-sans">
      <Navbar user={user} onLogin={handleLogin} onLogout={logout} />
      
      <main>
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero />
              <div className="py-24 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
                 <div className="absolute inset-0 face-mesh opacity-5 pointer-events-none" />
                 <div className="text-center mb-12 relative">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 mb-4 font-black">CORE_SYSTEM_INTERFACE_01</p>
                    <h2 className="text-4xl font-bold uppercase tracking-tight mb-8">Begin Transformation.</h2>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-xl">
                        {(['male', 'female'] as const).map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === g ? 'bg-brand-cyan text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white/60'}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-xl">
                        {(['straight', 'wavy', 'curly'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setHairType(t)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${hairType === t ? 'bg-brand-cyan text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white/60'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>
                 <UploadSection onUpload={handleUpload} isLoading={isAnalyzing} />
              </div>
              
              {/* Features Grid */}
              <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                 <FeatureCard 
                    number="FF_01" 
                    title="Biometric Precision" 
                    desc="Mapping 128 unique facial landmarks to determine your exact structural DNA."
                 />
                 <FeatureCard 
                    number="FF_02" 
                    title="Style Intelligence" 
                    desc="Our models are trained on centuries of grooming aesthetics and modern fashion trends."
                 />
                 <FeatureCard 
                    number="FF_03" 
                    title="Generative Preview" 
                    desc="See your future profile instantly with photorealistic AI hairstyle generation."
                 />
              </section>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 face-mesh opacity-20" />
              <div className="w-48 h-48 relative">
                  <div className="absolute inset-0 rounded-[3rem] border-2 border-cyan-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-[3rem] border-2 border-brand-cyan/40 border-t-brand-cyan animate-spin" />
                  <div className="absolute inset-8 rounded-2xl border border-cyan-500/10 flex items-center justify-center bg-cyan-500/5 backdrop-blur-xl">
                      <Sparkles className="w-12 h-12 text-brand-cyan animate-pulse" />
                  </div>
              </div>
              <div className="space-y-4 relative">
                <h2 className="text-4xl font-bold uppercase tracking-tighter">Parsing DNA</h2>
                <div className="flex flex-col items-center gap-2">
                   <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] font-black">Running Biometric Validation...</p>
                   <p className="invisible text-white/20 text-[10px] font-mono animate-pulse">FF_LOAD_SEQUENCE_ACTIVE</p>
                </div>
              </div>
              
              <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    className="h-full bg-brand-cyan shadow-[0_0_20px_#22d3ee]"
                    animate={{ x: [-256, 256] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
              </div>
            </motion.div>
          )}

          {step === 'results' && analysis && recommendations && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 pb-20"
            >
              <div className="max-w-6xl mx-auto px-6 flex justify-between items-center mb-16">
                 <Button 
                   variant="ghost" 
                   onClick={reset}
                   className="glass rounded-xl text-cyan-400/60 hover:text-cyan-400 flex items-center gap-2 group px-6 h-12 uppercase font-black text-[10px] tracking-widest border-cyan-500/10"
                 >
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                    New Analysis
                 </Button>
                 <div className="flex gap-4">
                    <Button variant="outline" size="sm" className="rounded-xl border-white/10 gap-2 font-black text-[10px] px-6 h-12 uppercase tracking-widest glass hover:border-cyan-500/30">
                       <Share2 className="w-4 h-4" /> Share_Profile
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleDownloadReport}
                      className="rounded-xl bg-brand-cyan text-black font-black gap-2 px-6 h-12 uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                    >
                       <Download className="w-4 h-4" /> Full_Report
                    </Button>
                 </div>
              </div>

              <AnalysisDashboard analysis={analysis} userImage={userImage} />
              
              <div className="my-24 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <RecommendationSection recommendations={recommendations} onPreview={handlePreviewClick} />

              <div className="my-32 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

              <StylePreview 
                recommendations={recommendations} 
                beforeImage={userImage} 
                activeIndex={activePreviewIndex}
                onIndexChange={setActivePreviewIndex}
              />

              {/* AI Stylist Chat Prompt */}
              <div className="max-w-4xl mx-auto mt-32 p-16 glass rounded-[4rem] text-center space-y-8 border-cyan-500/10 relative overflow-hidden group">
                 <div className="absolute inset-0 face-mesh opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" />
                 <div className="w-20 h-20 rounded-[2rem] bg-cyan-500/10 flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 shadow-2xl relative">
                    <Sparkles className="w-10 h-10 text-brand-cyan" />
                 </div>
                 <h3 className="text-4xl font-bold uppercase tracking-tight relative">Deep Layer Consult</h3>
                 <p className="text-white/40 max-w-sm mx-auto text-sm leading-relaxed relative">
                   Personalized advice on maintenance, products, and structural optimization direct from the neural engine.
                 </p>
                 <Button className="relative rounded-xl bg-brand-cyan text-black font-black px-12 h-14 uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 text-xs">
                    Initiate Consult_v4
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-24 px-6 border-t border-white/5 bg-black relative">
         <div className="absolute inset-0 face-mesh opacity-5 pointer-events-none" />
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-cyan shadow-[0_0_15px_#22d3ee]" />
                <span className="text-xl font-bold tracking-tight uppercase">FaceFrame<span className="text-cyan-400 font-black">AI</span></span>
              </div>
              <p className="text-sm text-white/30 max-w-sm leading-relaxed font-medium">
                Establishing the global standard for biometric grooming intelligence and cinematic style synthesis.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-8">Protocol</h4>
              <ul className="space-y-4 text-xs text-white/30 font-bold">
                <li><a href="#" className="hover:text-cyan-400 transition-all">Vision_API</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-all">Neuro_Style_01</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-all">Bio_Labs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-8">Node</h4>
              <ul className="space-y-4 text-xs text-white/30 font-bold">
                <li><a href="#" className="hover:text-cyan-400 transition-all">Journal</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-all">Manifesto</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-all">Privacy_v2.0</a></li>
              </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <p className="text-[10px] font-mono tracking-widest text-white/10 uppercase">© 2026 / FF_PROTOCOLS / ACCORDS_ACTIVE</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/40">
               <a href="#" className="hover:text-cyan-400 transition-all">TWITTER_X</a>
               <a href="#" className="hover:text-cyan-400 transition-all">INSTA_GRID</a>
               <a href="#" className="hover:text-cyan-400 transition-all">DISCORD_SV</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="glass p-10 rounded-[2.5rem] border-white/5 group hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden">
     <div className="absolute inset-0 face-mesh opacity-5 group-hover:opacity-10 transition-opacity" />
     <p className="text-xs font-mono font-black text-cyan-400/40 mb-8 transition-colors group-hover:text-cyan-400">{number}</p>
     <h3 className="text-2xl font-bold tracking-tight uppercase mb-4 transition-transform group-hover:translate-x-1">{title}</h3>
     <p className="text-sm text-white/30 leading-relaxed font-medium group-hover:text-white/50 transition-colors">{desc}</p>
  </div>
);
