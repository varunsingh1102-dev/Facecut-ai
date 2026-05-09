import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, ImageIcon, X, Sparkles, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UploadSectionProps {
  onUpload: (imageBase64: string) => void;
  isLoading: boolean;
}

export const UploadSection = ({ onUpload, isLoading }: UploadSectionProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    multiple: false,
    disabled: isLoading
  } as any);

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto w-full" id="upload">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="glass p-8 md:p-12 relative overflow-hidden border-cyan-500/10 rounded-[3rem]">
          <div className="absolute inset-0 face-mesh opacity-5 pointer-events-none" />
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-10 flex flex-col items-center justify-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="absolute inset-0 blur-xl bg-cyan-400 opacity-20" />
                <Scan className="w-16 h-16 text-cyan-400 relative" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-cyan-400 font-black tracking-[0.3em] uppercase text-[10px] font-mono">Neural_Parsing_Initialized</p>
                <p className="text-white/40 text-[10px] font-mono">ENCODING FACIAL VECTORS...</p>
              </div>
              <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-brand-cyan shadow-[0_0_15px_#22d3ee]"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
              </div>
            </div>
          )}

          <div {...getRootProps()} className={`
            border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer relative z-0
            ${isDragActive ? 'border-cyan-400 bg-cyan-500/5' : 'border-white/5 hover:border-cyan-500/20 bg-white/[0.02]'}
            ${preview ? 'border-transparent p-0' : ''}
          `}>
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold uppercase tracking-tight mb-2">Initialize Scan</h3>
                    <p className="text-white/40 text-xs uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                      Drop your portrait here or select manual input for deep-layer facial parsing.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <Button variant="outline" className="rounded-xl border-white/10 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all text-[10px] font-black uppercase tracking-widest px-8 h-12 bg-white/5">
                      Select Path
                    </Button>
                    <span className="text-cyan-400/20 text-[10px] font-mono uppercase tracking-widest font-black">OR</span>
                    <Button variant="ghost" className="rounded-xl hover:bg-cyan-500/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest h-12 border border-transparent hover:border-cyan-500/20">
                       <Camera className="w-4 h-4 text-cyan-400" /> Web_Cam
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-[3/4] max-h-[600px] mx-auto rounded-[2rem] overflow-hidden group border border-cyan-500/20 shadow-2xl"
                >
                  <img src={preview} alt="Preview" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-cyan-500/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="rounded-xl shadow-2xl bg-red-500/80 backdrop-blur-xl border border-red-400/20"
                        onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  {/* Landmark scan effect overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                     <motion.div 
                        className="absolute h-[1px] w-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-20"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     />
                  </div>
                  <div className="absolute inset-0 face-mesh opacity-20 pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};
