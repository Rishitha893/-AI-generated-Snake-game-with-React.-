import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono scanlines relative overflow-x-hidden p-4 md:p-8">
      <div className="bg-noise" />
      
      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10 tear">
        
        <header className="border-b-4 border-fuchsia-500 pb-2 mb-4 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 className="text-5xl md:text-7xl glitch-text text-white m-0">
              NEON_SNAKE.EXE
            </h1>
            <p className="text-fuchsia-500 tracking-[0.3em] font-bold mt-2">
              SYS_VERSION_0.9.4 // ROOT_ACCESS_GRANTED
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right font-bold text-lg">
            <p className="text-cyan-400">CPU_LOAD: 42% RAM: 16MB</p>
            <p className="text-fuchsia-500 glitch-text">STATUS: ERRORING</p>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="col-span-1 md:col-span-8 border-4 border-cyan-400 p-4 relative bg-black/90">
            <div className="absolute -top-3 -right-3 px-2 py-1 bg-cyan-400 text-black font-bold border-2 border-black">
              DISPLAY_MODULE
            </div>
            <SnakeGame />
          </div>

          <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
            <MusicPlayer />
            
            <div className="border-4 border-fuchsia-500 p-4 bg-fuchsia-900/20 relative">
              <div className="absolute -top-3 -left-3 px-2 py-1 bg-fuchsia-500 text-black font-bold border-2 border-black">
                SYS_LOGS
              </div>
              <ul className="space-y-3 mt-4 text-xl">
                <li className="text-white">&gt; OP_PORT_OPEN... [OK]</li>
                <li className="text-white">&gt; AUDIO_STRM_SYNC... [OK]</li>
                <li className="text-cyan-400">&gt; AWAITING_CMD...</li>
                <li className="text-fuchsia-500 animate-pulse">&gt; SYS_INTEGRITY_COMPROMISED</li>
              </ul>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
