
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Download, 
  Share2, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecommendationSet } from '@/types';

interface StylePreviewProps {
  recommendations?: RecommendationSet | null;
  beforeImage?: string | null;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const StylePreview: React.FC<StylePreviewProps> = ({ 
  recommendations, 
  beforeImage, 
  activeIndex, 
  onIndexChange 
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  // Remove internal activeSample state
  const activeSample = activeIndex;

  const samples = recommendations?.bestStyles || [];
  
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  const currentBefore = beforeImage || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const currentAfter = samples[activeSample]?.imageUrl || "https://images.unsplash.com/photo-1583035139031-bb66627bad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto w-full" id="preview">
      <div className="text-center space-y-4 mb-20 group">
         <Badge variant="outline" className="px-4 py-1 border-cyan-500/20 text-[10px] uppercase tracking-widest bg-cyan-500/5 text-cyan-400 font-mono">
            Recommendation Engine — Visualized
         </Badge>
         <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Your New Profile</h2>
         <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
            Compare your current profile with our AI-curated recommendations. Slide to visualize the architectural shift.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card 
             className="glass relative aspect-[4/5] overflow-hidden cursor-ew-resize select-none border-cyan-500/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[3rem] group bg-black"
             onMouseMove={handleMouseMove}
             onTouchMove={handleMouseMove}
           >
              <div className="absolute inset-0 face-mesh opacity-10 pointer-events-none" />
              {/* After Image */}
              <div className="absolute inset-0">
                 <img 
                    src={currentAfter} 
                    alt="After" 
                    className="w-full h-full object-cover transition-all duration-1000"
                 />
              </div>
              
              {/* Before Image (Clipped) */}
              <div 
                className="absolute inset-0 z-10 border-r border-cyan-400 shadow-[2px_0_15px_#22d3ee]"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                 <img 
                    src={currentBefore} 
                    alt="Before" 
                    className="w-full h-full object-cover grayscale opacity-90"
                 />
              </div>

              {/* Slider Handle Node */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                 <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-cyan text-black flex items-center justify-center shadow-[0_0_20px_#22d3ee] border-2 border-white">
                    <History className="w-5 h-5" />
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 z-30 flex gap-4">
                 <div className="glass px-6 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black border-cyan-500/20 text-cyan-400">Current Self</div>
                 <div className="bg-brand-cyan px-6 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] font-black text-black">New Silhouetee</div>
              </div>
           </Card>

           <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-4">
                 <Button 
                   variant="outline" 
                   size="icon" 
                   className="rounded-xl border-white/10 hover:border-cyan-500/40 hover:bg-white/5"
                   onClick={() => onIndexChange((activeSample - 1 + (samples.length || 1)) % (samples.length || 1))}
                 >
                    <ChevronLeft className="w-4 h-4" />
                 </Button>
                 <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-cyan-400/40">Profile_{activeSample + 1}.0 // {samples.length || 0}</span>
                 <Button 
                   variant="outline" 
                   size="icon" 
                   className="rounded-xl border-white/10 hover:border-cyan-500/40 hover:bg-white/5"
                   onClick={() => onIndexChange((activeSample + 1) % (samples.length || 1))}
                 >
                    <ChevronRight className="w-4 h-4" />
                 </Button>
              </div>
              <div className="flex gap-2">
                 <Button variant="ghost" size="icon" className="rounded-xl text-white/40 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all">
                    <Share2 className="w-4 h-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="rounded-xl text-white/40 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all">
                    <Download className="w-4 h-4" />
                 </Button>
                 <Button variant="ghost" size="icon" className="rounded-xl text-white/40 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all">
                    <Maximize2 className="w-4 h-4" />
                 </Button>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <Card className="glass p-8 space-y-6 rounded-[2.5rem] border-cyan-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Sparkles className="w-24 h-24 text-cyan-400" />
              </div>
              <div className="flex items-center gap-3 relative">
                 <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Sparkles className="w-6 h-6 text-brand-cyan" />
                 </div>
                 <h3 className="text-xl font-bold uppercase tracking-tight">Transformation Lab</h3>
              </div>
              
              <div className="space-y-4 pt-4 relative">
                 <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.2em] font-mono">SELECTED_STYLE</p>
                 <h4 className="text-2xl font-bold uppercase tracking-tight leading-tight">{samples[activeSample]?.name || "Select a profile"}</h4>
                 <div className="flex flex-wrap gap-2">
                    {samples[activeSample]?.tags?.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] uppercase tracking-widest border-cyan-500/20 bg-cyan-500/5 text-cyan-400 font-mono">
                         {tag.toUpperCase()}
                      </Badge>
                    ))}
                 </div>
                 <p className="text-xs text-white/60 leading-relaxed italic border-l border-cyan-500/20 pl-4 py-2">
                    "{samples[activeSample]?.whyItWorks || "Processing rationale..."}"
                 </p>
              </div>

              <div className="space-y-3 pt-6 relative">
                 <Button className="w-full rounded-xl bg-brand-cyan text-black font-black h-14 hover:bg-cyan-400 text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20">
                    Process New Batch
                 </Button>
                 <Button variant="ghost" className="w-full rounded-xl text-white/40 text-[10px] uppercase tracking-[0.2em] h-14 border border-white/5 hover:bg-white/5 font-bold">
                    Refine Parameters
                 </Button>
              </div>
           </Card>

           <Card className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/[0.03] to-transparent border-dashed border-cyan-500/20">
              <h5 className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-black mb-6">Neural Stability</h5>
              <div className="space-y-5">
                 <StatRow label="Identity Match" value="98.4%" />
                 <StatRow label="Photorealism" value="99.1%" />
                 <StatRow label="Shadow Accuracy" value="97.8%" />
              </div>
           </Card>
        </div>
      </div>
    </section>
  );
};

const StatRow = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center mb-1">
       <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{label}</span>
       <span className="text-[10px] font-mono text-brand-cyan">{value}</span>
    </div>
    <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
       <motion.div 
         initial={{ width: 0 }}
         whileInView={{ width: value }}
         transition={{ duration: 1.5, delay: 0.5 }}
         className="h-full bg-brand-cyan/40" 
       />
    </div>
  </div>
);
