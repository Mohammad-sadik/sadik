import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Terminal, User, Briefcase, FileCode, Mail, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <Command 
        className="w-[90%] max-w-[640px] bg-[#1a1a24] rounded-xl border border-[#2a2a35] shadow-2xl overflow-hidden text-[#e5e7eb] font-sans"
        loop
      >
        <Command.Input 
          className="w-full bg-transparent p-5 text-lg outline-none border-b border-[#2a2a35] placeholder:text-[#6b7280]"
          placeholder="Type a command or search..." 
          autoFocus 
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-500">
          <Command.Empty className="p-4 text-center text-[#6b7280]">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="text-xs font-semibold text-[#6b7280] p-2">
            <Command.Item 
              onSelect={() => runCommand(() => window.location.hash = '#home')}
              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#2a2a35] hover:text-white transition-colors aria-selected:bg-[#2a2a35] aria-selected:text-white"
            >
              <Terminal size={16} className="text-purple-500" /> Home
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => window.location.hash = '#about')}
              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#2a2a35] hover:text-white transition-colors aria-selected:bg-[#2a2a35] aria-selected:text-white"
            >
              <User size={16} className="text-purple-500" /> About Me
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => window.location.hash = '#work')}
              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#2a2a35] hover:text-white transition-colors aria-selected:bg-[#2a2a35] aria-selected:text-white"
            >
              <Briefcase size={16} className="text-purple-500" /> Experience & Projects
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/learning'))}
              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#2a2a35] hover:text-white transition-colors aria-selected:bg-[#2a2a35] aria-selected:text-white"
            >
              <FileCode size={16} className="text-purple-500" /> Knowledge Hub
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-[#2a2a35] my-2" />

          <Command.Group heading="Actions" className="text-xs font-semibold text-[#6b7280] p-2">
            <Command.Item 
              onSelect={() => runCommand(() => toggleTheme())}
              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#2a2a35] hover:text-white transition-colors aria-selected:bg-[#2a2a35] aria-selected:text-white"
            >
              {theme === 'dark' ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-blue-400" />}
              Toggle Theme
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => window.location.hash = '#contact')}
              className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[#2a2a35] hover:text-white transition-colors aria-selected:bg-[#2a2a35] aria-selected:text-white"
            >
              <Mail size={16} className="text-green-500" /> Contact Me
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};

export default CommandPalette;
