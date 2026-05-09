
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Sparkles, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar = ({ user, onLogin, onLogout }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'glass rounded-full px-8 py-3 max-w-2xl mt-4 shadow-2xl' : ''}`}>
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
             <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">Face<span className="text-brand-cyan">Frame</span> AI</span>
        </div>

        <div className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">
          <a href="#vision" className="hover:text-brand-cyan transition-colors">Vision</a>
          <a href="#upload" className="hover:text-brand-cyan transition-colors">Analyze</a>
          <a href="#preview" className="hover:text-brand-cyan transition-colors">Preview</a>
        </div>

        <div className="flex items-center gap-4">
           {user ? (
             <div className="flex items-center gap-3">
                <span className="hidden lg:block text-[10px] uppercase tracking-widest text-brand-cyan font-bold">Premium Plan</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full border border-white/20">
                        <Avatar className="w-8 h-8">
                           <AvatarImage src={user.photoURL} />
                           <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass border-white/10 mt-2 min-w-48">
                      <DropdownMenuItem className="text-xs focus:bg-white/10 cursor-pointer text-white/60">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs focus:bg-white/10 cursor-pointer" onClick={onLogout}>
                        <LogOut className="w-3 h-3 mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
             </div>
           ) : (
             <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-white/60 hover:text-white transition-colors"
                onClick={onLogin}
             >
                <User className="w-5 h-5" />
             </Button>
           )}
           
           <Button className="hidden sm:flex rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest font-bold px-6">
              {user ? 'Premium' : 'Enterprise'}
           </Button>
        </div>
      </div>
    </nav>
  );
};
