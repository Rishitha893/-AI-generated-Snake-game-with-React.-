import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 120;
const SPEED_INCREMENT = 3;
const MIN_SPEED = 40;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    // eslint-disable-next-line
    isOccupied = snake.some(s => s.x === newFood.x && s.y === newFood.y);
  }
  return newFood!;
};

const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const currentDirectionRef = useRef(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    currentDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  useEffect(() => { setFood(generateFood(INITIAL_SNAKE)); }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      if (isGameOver && e.key === 'Enter') return resetGame();
      if (e.key === ' ' || e.key === 'Escape') return setIsPaused(p => !p);
      if (isPaused || isGameOver) return;

      const { x, y } = currentDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': if (y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': if (x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prev => {
      const head = prev[0];
      currentDirectionRef.current = direction;
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE || 
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.some(s => s.x === newHead.x && s.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prev;
      }

      const newSnake = [newHead, ...prev];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-stretch w-full max-w-2xl mx-auto">
      
      <div className="flex justify-between border-b-4 border-cyan-400 mb-4 px-2 pb-2">
        <div>
          <div className="text-cyan-400 font-bold mb-1 text-xl">SCORE_VAL</div>
          <div className="text-white text-5xl glitch-text leading-none">{score.toString().padStart(4, '0')}</div>
        </div>
        <div className="text-right">
          <div className="text-fuchsia-500 font-bold mb-1 text-xl">HIGH_RECORD</div>
          <div className="text-white text-5xl leading-none">{highScore.toString().padStart(4, '0')}</div>
        </div>
      </div>

      <div className={`relative bg-black border-4 ${isGameOver ? 'border-fuchsia-500 crt-flicker' : 'border-cyan-400'} aspect-square font-mono overflow-hidden`}>
        
        <div 
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className={`border-[1px] ${isGameOver ? 'border-fuchsia-900/40' : 'border-cyan-900/40'}`} />
          ))}
        </div>

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className={`absolute border border-black ${isHead ? 'bg-white z-10' : 'bg-cyan-400'}`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
              }}
            />
          );
        })}

        <div
          className={`absolute ${isGameOver ? 'bg-white' : 'bg-fuchsia-500'} glitch-text border-2 border-black`}
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%`,
          }}
        />

        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
            {isGameOver ? (
              <div className="border-4 border-fuchsia-500 p-6 bg-black text-center w-full max-w-sm">
                <h2 className="text-5xl text-fuchsia-500 glitch-text mb-4 uppercase">FATAL_ERR</h2>
                <p className="text-white mb-6 text-xl uppercase">SNAKE_MEM_LEAK</p>
                <button 
                  onClick={resetGame}
                  className="w-full bg-fuchsia-500 text-black font-bold text-2xl py-3 hover:bg-white hover:text-black border-4 border-black hover:border-fuchsia-500 transition-none cursor-pointer uppercase"
                >
                  REBOOT_DB
                </button>
              </div>
            ) : (
              <div className="border-4 border-cyan-400 p-6 bg-black text-center w-full max-w-sm">
                <h2 className="text-4xl text-cyan-400 glitch-text mb-4 uppercase">EXEC_PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="w-full bg-cyan-400 text-black font-bold text-2xl py-3 hover:bg-white hover:text-black border-4 border-black hover:border-cyan-400 transition-none cursor-pointer uppercase"
                >
                  RESUME_OP
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between text-cyan-400 font-bold border-t-4 border-cyan-400 pt-3 text-lg md:text-xl">
        <span>KEYBOARD_REQ: [W,A,S,D] OR [ARROWS]</span>
        <span className="text-fuchsia-500">HALT: [SPACE]</span>
      </div>
    </div>
  );
}
