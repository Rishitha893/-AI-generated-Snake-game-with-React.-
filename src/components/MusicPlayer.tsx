import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_ALPHA", artist: "AI_CORE_1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: 2, title: "NULL_POINTER_VOID", artist: "AI_CORE_2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id: 3, title: "SEGFAULT_SYMPHONY", artist: "AI_CORE_3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  return (
    <div className="border-4 border-fuchsia-500 bg-black p-4 relative">
      <div className="absolute -top-3 -right-3 px-2 py-1 bg-fuchsia-500 text-black font-bold border-2 border-black">
        AUDIO_CTRL
      </div>

      <div className="mt-4 mb-6 pt-2 border-t-2 border-dashed border-fuchsia-500/50">
          <div className="text-cyan-400 mb-1 text-lg">STRM_TGT:</div>
          <div className="text-3xl glitch-text text-white leading-none mb-2">{currentTrack.title}</div>
          <div className="text-fuchsia-500 leading-none text-lg">SRC: {currentTrack.artist}</div>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          className="flex-1 bg-black text-white border-2 border-white hover:bg-white hover:text-black py-2 cursor-pointer font-bold text-xl" 
          onClick={() => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); }}
        >
          [ &lt;&lt; ]
        </button>
        <button 
          className={`flex-[2] ${isPlaying ? 'bg-fuchsia-500 text-black border-fuchsia-500 hover:bg-black hover:text-fuchsia-500' : 'bg-cyan-400 text-black border-cyan-400 hover:bg-black hover:text-cyan-400'} border-2 py-2 cursor-pointer font-bold tracking-widest text-xl`} 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'SUSPEND' : 'EXECUTE'}
        </button>
        <button 
          className="flex-1 bg-black text-white border-2 border-white hover:bg-white hover:text-black py-2 cursor-pointer font-bold text-xl" 
          onClick={() => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); }}
        >
          [ &gt;&gt; ]
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
          <div className="flex justify-between text-fuchsia-400 font-bold text-xl">
            <span>AMP_LEVEL</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full mt-2"
          />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onEnded={() => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); }}
      />
    </div>
  );
}
