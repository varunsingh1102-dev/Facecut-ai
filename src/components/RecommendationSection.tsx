import React from 'react';
import { Hairstyle, RecommendationSet } from '@/types';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, CornerUpRight, Scissors, TrendingUp } from 'lucide-react';

interface RecommendationSectionProps {
  recommendations: RecommendationSet;
  onPreview: (index: number) => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({ recommendations, onPreview }) => {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-cyan-500/20 text-[10px] uppercase tracking-widest bg-cyan-500/5 text-cyan-400 font-mono">
            Analysis Results — Recommended Styles
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">Best Haircuts for You</h2>
          <p className="text-white/40 text-sm max-w-lg leading-relaxed">
            Based on your features, these styles are chosen to show off your best angles and balance your look.
          </p>
        </div>
        <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-fit">
           <TrendBadge icon={<TrendingUp className="w-3 h-3 text-cyan-400"/>} label="Luxury Tiers" />
           <TrendBadge icon={<TrendingUp className="w-3 h-3 text-cyan-400"/>} label="AI Personalized" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.bestStyles.map((style, idx) => (
          <HairstyleCard 
            key={style.id || idx} 
            style={style} 
            isPremium={idx === 0} 
            onPreview={() => onPreview(idx)}
          />
        ))}
      </div>


      {/* Avoid Section */}
      <div className="mt-24 p-12 glass rounded-[3rem] border-cyan-500/10 relative overflow-hidden bg-gradient-to-r from-transparent via-cyan-500/[0.02] to-transparent">
         <div className="absolute inset-0 face-mesh opacity-10 pointer-events-none" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
                <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 px-4 py-1 text-[10px] uppercase tracking-widest font-mono">
                  Style Conflict
                </Badge>
                <h3 className="text-3xl font-bold uppercase">What to avoid</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  These styles might not perfectly complement your unique features.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {recommendations.avoidStyles.map((style, idx) => (
                 <div key={idx} className="p-5 glass border border-white/5 rounded-2xl group hover:border-red-500/30 transition-colors">
                    <p className="text-xs font-mono uppercase tracking-widest text-red-400/60 mb-1">Warning</p>
                    <p className="text-sm font-bold mb-1 uppercase tracking-tight group-hover:text-red-400 transition-colors">{style.name}</p>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">{style.description}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Extra Advice */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdviceBox 
            title="Celebrity Icon" 
            content={recommendations.celebrityInspiration.join(', ')} 
            icon={<Sparkles className="w-4 h-4" />}
          />
          <AdviceBox 
            title="Grooming Pair" 
            content={recommendations.beardpairing || 'Not specified'} 
            icon={<Scissors className="w-4 h-4" />}
          />
          <AdviceBox 
            title="Fade Profile" 
            content={recommendations.fadeSuggestions || 'Standard profile'} 
            icon={<ArrowRight className="w-4 h-4" />}
          />
      </div>
    </section>
  );
};

const HairstyleCard: React.FC<{ style: Hairstyle, isPremium?: boolean, onPreview: () => void }> = ({ style, isPremium, onPreview }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="group h-full"
  >
    <Card className={`glass overflow-hidden border-white/5 h-full flex flex-col relative rounded-[2rem] transition-all duration-500 ${isPremium ? 'ring-2 ring-cyan-500/40' : ''}`}>
       <div className="aspect-[4/5] relative overflow-hidden">
          <img 
             src={style.imageUrl || `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`} 
             alt={style.name} 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {isPremium && (
            <Badge className="absolute top-4 right-4 bg-brand-cyan text-black font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              AI_SELECTION
            </Badge>
          )}

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
             <div className="flex gap-2 mb-2">
                {style.tags?.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[8px] font-mono uppercase tracking-[0.2em] text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
                     {tag}
                  </span>
                ))}
             </div>
             <h3 className="text-xl font-bold text-white uppercase tracking-tight">{style.name}</h3>
          </div>
       </div>
       <CardContent className="p-6 flex-1 flex flex-col justify-between relative">
          <div className="absolute inset-0 face-mesh opacity-5 pointer-events-none" />
          <div className="space-y-4 mb-6">
             <p className="relative text-[11px] text-white/70 leading-relaxed font-medium">
               {style.description}
             </p>
             {style.whyItWorks && (
               <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
                 <p className="text-[9px] uppercase font-bold text-cyan-400 mb-1">Stylist Rationale</p>
                 <p className="text-[10px] text-white/50 leading-tight italic">{style.whyItWorks}</p>
               </div>
             )}
          </div>
          <Button 
            variant="outline" 
            className="relative w-full rounded-xl border-white/10 hover:bg-brand-cyan hover:text-black hover:border-brand-cyan group-hover:border-cyan-500/30 transition-all font-black text-[10px] uppercase tracking-widest h-11 bg-white/5"
            onClick={onPreview}
          >
             Initialize Preview <CornerUpRight className="ml-2 w-3 h-3" />
          </Button>
       </CardContent>
    </Card>
  </motion.div>
);

const TrendBadge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
   <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">
      {icon} {label}
   </div>
);

const AdviceBox = ({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) => (
   <div className="glass p-6 rounded-2xl flex items-start gap-4 border-white/5 hover:border-cyan-500/30 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:scale-110 transition-transform">
         <div className="text-cyan-400">{icon}</div>
      </div>
      <div>
         <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">{title}</h4>
         <p className="text-sm font-bold text-white/80 line-clamp-1 uppercase tracking-tight decoration-cyan-500/30 decoration-2 underline-offset-4 hover:underline cursor-default transition-all">{content}</p>
      </div>
   </div>
);
