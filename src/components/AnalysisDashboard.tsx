import React from 'react';
import { FacialAnalysis } from '@/types';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dna, 
  Target, 
  Sparkles, 
  Zap, 
  Activity, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: FacialAnalysis;
}

export const AnalysisDashboard = ({ analysis }: AnalysisDashboardProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-12 py-12 px-6 max-w-6xl mx-auto"
    >
      <div className="text-center space-y-4">
        <Badge variant="outline" className="px-4 py-1 border-cyan-500/20 text-[10px] uppercase tracking-widest bg-cyan-500/5 text-cyan-400 font-mono">
          Artificial Intelligence Analysis
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase">Your Facial Profile</h2>
        <p className="text-white/40 max-w-lg mx-auto text-sm">
          A clear, precision map of your facial structure and recommended styling directions.
        </p>
      </div>

      {/* Summary Analysis Section */}
      <motion.div variants={item} className="max-w-4xl mx-auto">
        <Card className="glass p-8 border-cyan-500/10 relative overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-cyan text-black text-[9px] font-black uppercase tracking-widest rounded-b-xl shadow-lg">
                Your Style Summary
            </div>
            <p className="text-lg md:text-xl font-medium leading-relaxed mt-4 italic text-white/90">
              "{analysis.summaryAnalysis}"
            </p>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Shape Card */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="glass h-full p-8 relative overflow-hidden group border-cyan-500/10">
             <div className="absolute inset-0 face-mesh opacity-20" />
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Dna className="w-32 h-32 text-cyan-400" />
             </div>
             
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Target className="w-6 h-6 text-cyan-400" />
                   </div>
                   <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Facial Features</p>
                      <h3 className="text-3xl font-bold uppercase tracking-tight">{analysis.faceShape} Face Shape</h3>
                   </div>
                   <div className="ml-auto">
                      <Badge className="bg-brand-cyan text-black hover:bg-cyan-400 px-4 py-1 border-none font-black text-[10px] uppercase">
                        {analysis.confidenceScores.shape}% MATCH
                      </Badge>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6">
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-cyan-400">
                        <span>Symmetry Level</span>
                        <span>{analysis.symmetry}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-cyan shadow-[0_0_10px_#22d3ee]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.symmetry}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed italic">
                        "{analysis.proportions}"
                      </p>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-cyan-400">
                        <span>Profile Defined</span>
                        <span>{analysis.confidenceScores.features}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-cyan shadow-[0_0_10px_#22d3ee]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.confidenceScores.features}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed italic">
                        "{analysis.jawline}"
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   <FeatureBit label="Cheekbones" value={analysis.cheekbones} icon={<Activity className="w-3 h-3"/>} />
                   <FeatureBit label="Forehead" value={analysis.forehead} icon={<Zap className="w-3 h-3"/>} />
                   <FeatureBit label="Eye Shape" value={analysis.eyeShape} icon={<Sparkles className="w-3 h-3"/>} />
                   <FeatureBit label="Skin Tone" value={analysis.skinTone} icon={<CheckCircle2 className="w-3 h-3"/>} />
                </div>
             </div>
          </Card>
        </motion.div>

        {/* Side Info Cards */}
        <div className="space-y-6">
          <motion.div variants={item}>
            <Card className="glass p-6 space-y-4 border-l-2 border-l-cyan-500/40 relative overflow-hidden">
               <div className="absolute inset-0 bg-cyan-500/5" />
               <h4 className="relative text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-3 h-3" /> Expert Grooming Tips
               </h4>
               <ul className="relative space-y-4">
                  {analysis.tips.map((tip, idx) => (
                    <li key={idx} className="text-[11px] text-white/60 leading-relaxed flex gap-3 group">
                       <span className="text-cyan-500/40 font-mono pt-1 shrink-0">FF_0{idx + 1}</span>
                       <span className="group-hover:text-white transition-colors">{tip}</span>
                    </li>
                  ))}
               </ul>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="glass p-6 text-center space-y-4 border-white/5 bg-gradient-to-br from-cyan-500/5 to-transparent border-dashed">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                  <AlertCircle className="w-8 h-8 text-cyan-400/80" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/80">Hairline Check</h4>
                <p className="text-[10px] text-cyan-400/60 leading-relaxed font-mono uppercase tracking-wider">
                  Structure: {analysis.hairline}
                </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureBit = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
     <div className="flex items-center gap-2 mb-2 text-white/30 uppercase tracking-[0.2em] text-[8px] font-bold">
        {icon} {label}
     </div>
     <p className="text-[10px] text-white/80 leading-tight line-clamp-2">{value}</p>
  </div>
);
