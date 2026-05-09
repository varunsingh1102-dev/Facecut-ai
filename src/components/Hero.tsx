
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, Play } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="container px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-cyan-400">The Future of Grooming</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] uppercase">
            Frame your <br />
            <span className="text-brand-cyan">Profile.</span>
          </h1>

          <p className="text-lg text-white/40 max-w-md font-light leading-relaxed">
            FaceFrame AI uses cinematic-grade facial analysis and generative intelligence to curate your signature aesthetic.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-xl bg-brand-cyan text-black hover:bg-cyan-400 px-8 text-xs uppercase tracking-widest font-black group transition-all">
              Initialize Scan <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="ghost" className="rounded-xl text-white/60 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold glass">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                <Play className="w-3 h-3 fill-white" />
              </div>
              View Demos
            </Button>
          </div>

          <div className="pt-8 flex items-center gap-12">
             <div className="space-y-1">
                <p className="text-2xl font-bold text-brand-cyan">99.8%</p>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Detection Accuracy</p>
             </div>
             <div className="space-y-1">
                <p className="text-2xl font-bold text-brand-cyan">50k+</p>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Styles Analyzed</p>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="relative"
        >
          <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden border border-white/10 glass shadow-2xl group">
             <div className="absolute inset-0 face-mesh z-10" />
            <img 
              src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2070" 
              alt="Luxury Grooming" 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* HUD elements */}
            <div className="absolute inset-x-8 bottom-8 p-6 glass rounded-2xl space-y-4 translate-y-4 md:translate-y-0 z-20 border-cyan-500/30">
               <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-cyan-400">
                 <span>Facial Metrics</span>
                 <span>Tracking...</span>
               </div>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ delay: 1, duration: 2 }}
                  />
               </div>
               <div className="flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-cyan-500" />
                  <div className="w-1 h-1 rounded-full bg-cyan-500" />
                  <div className="w-1 h-1 rounded-full bg-cyan-500/20" />
               </div>
            </div>
            {/* Scanning Line */}
            <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-cyan-400/50 shadow-[0_0_15px_#22d3ee] z-10"
            />
          </div>
          
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 glass rounded-2xl border-cyan-400/40 backdrop-blur-2xl z-20 border-2"
          >
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
               </div>
               <div>
                  <p className="text-[8px] font-mono uppercase tracking-widest text-white/40">SYSTEM_STABLE</p>
                  <p className="text-sm font-bold tracking-tight">AI READY</p>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
