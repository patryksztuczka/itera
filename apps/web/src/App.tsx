import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Brain,
  Database,
  Flame,
  Layers,
  Target,
  Activity,
} from 'lucide-react';

const MOCK_DATA = {
  cardsToReview: 468,
  newCards: 15,
  learningCards: 10,
  relearningCards: 5,
  streak: 12,
  totalDecks: 8,
  masteryRate: 85,
  nextReviewIn: '15m',
};

const MOCK_CARD = {
  front: 'What is the primary function of Virtual Memory?',
  back: 'It acts as an abstraction that maps virtual addresses to physical memory, giving each process the illusion of having its own contiguous address space.',
};

export default function App() {
  const [mode, setMode] = useState<'dashboard' | 'study'>('dashboard');
  const [isFlipped, setIsFlipped] = useState(false);

  if (mode === 'study') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-white font-sans text-black">
        <div className="box-border h-screen p-2 sm:p-4">
          <div className="flex h-full flex-col overflow-hidden border-[4px] border-black sm:border-[6px]">
            {/* Header */}
            <header className="flex shrink-0 items-center justify-between border-b-[4px] border-black bg-black px-3 py-2 text-white sm:border-b-[6px] sm:px-4 sm:py-3">
              <button
                onClick={() => {
                  setMode('dashboard');
                  setIsFlipped(false);
                }}
                className="flex cursor-pointer items-center gap-2 transition-colors hover:text-gray-300"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden text-xs font-bold tracking-widest uppercase sm:inline sm:text-sm">
                  ABORT_SEQ
                </span>
              </button>
              <span className="text-[10px] font-bold tracking-widest sm:text-xs">
                SEQ: 001 / {MOCK_DATA.cardsToReview}
              </span>
            </header>

            {/* Flashcard Area */}
            <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 p-4 sm:p-8">
              <div
                className="perspective-1000 h-80 w-full max-w-2xl cursor-pointer sm:h-96"
                onClick={() => !isFlipped && setIsFlipped(true)}
              >
                <div
                  className={`preserve-3d relative h-full w-full transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center border-[4px] border-black bg-white p-8 text-center shadow-[4px_4px_0_0_#000] backface-hidden sm:border-[6px] sm:shadow-[8px_8px_0_0_#000]">
                    <span className="absolute top-4 left-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                      FRONT
                    </span>
                    <h2 className="text-2xl font-black tracking-tighter uppercase sm:text-4xl">
                      {MOCK_CARD.front}
                    </h2>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center border-[4px] border-black bg-[#EAEAEA] p-8 text-center shadow-[4px_4px_0_0_#000] backface-hidden sm:border-[6px] sm:shadow-[8px_8px_0_0_#000]">
                    <span className="absolute top-4 left-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                      BACK
                    </span>
                    <p className="text-xl font-bold uppercase sm:text-2xl">{MOCK_CARD.back}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-8 h-20 w-full max-w-2xl sm:mt-12">
                {!isFlipped ? (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="h-full w-full cursor-pointer bg-black text-xl font-black tracking-widest text-white uppercase shadow-[4px_4px_0_0_#000] transition-all hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-none sm:text-2xl"
                  >
                    Reveal Data
                  </button>
                ) : (
                  <div className="grid h-full grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="cursor-pointer border-[3px] border-black bg-[#FF453A] font-black text-white uppercase shadow-[4px_4px_0_0_#000] transition-all hover:bg-red-600 active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="cursor-pointer border-[3px] border-black bg-[#FF9F0A] font-black text-black uppercase shadow-[4px_4px_0_0_#000] transition-all hover:bg-orange-500 active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="cursor-pointer border-[3px] border-black bg-[#32D74B] font-black text-black uppercase shadow-[4px_4px_0_0_#000] transition-all hover:bg-green-500 active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="cursor-pointer border-[3px] border-black bg-[#0A84FF] font-black text-white uppercase shadow-[4px_4px_0_0_#000] transition-all hover:bg-blue-600 active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      Easy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white font-sans text-black">
      <div className="box-border h-screen p-2 sm:p-4">
        <div className="flex h-full flex-col overflow-hidden border-[4px] border-black sm:border-[6px]">
          {/* Top Bar */}
          <header className="flex shrink-0 items-center justify-between bg-black px-3 py-2 text-white sm:px-4 sm:py-3">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs font-bold tracking-widest uppercase sm:text-sm">
                Itera_CMD_v2
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-widest sm:text-xs">
              U: DEMO | SYS: ONLINE
            </span>
          </header>

          {/* Main Grid Area */}
          <main className="grid flex-1 grid-cols-1 grid-rows-[auto_1fr] overflow-y-auto md:grid-cols-12 md:grid-rows-1">
            {/* Left Panel - Queue Info */}
            <div className="flex flex-col border-b-[4px] border-black bg-gray-100 md:col-span-4 md:border-r-[6px] md:border-b-0">
              <div className="flex flex-1 flex-col justify-center p-4 sm:p-6">
                <h2 className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Queue Status
                </h2>
                <div className="text-[clamp(4rem,10vw,8rem)] leading-none font-black tracking-tighter">
                  {MOCK_DATA.cardsToReview}
                </div>
                <p className="mt-1 text-sm font-bold uppercase sm:text-base">Pending Reviews</p>

                <div className="mt-8 space-y-2 border-l-4 border-black pl-3 text-xs font-bold tracking-widest sm:pl-4 sm:text-sm">
                  <div className="flex justify-between">
                    <span>NEW:</span> <span>{MOCK_DATA.newCards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LRN:</span> <span>{MOCK_DATA.learningCards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REL:</span> <span>{MOCK_DATA.relearningCards}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMode('study')}
                className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-3 bg-black py-4 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-gray-800 sm:py-6 sm:text-lg"
              >
                Execute Queue <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Right Panel - Grid Modules */}
            <div className="grid grid-cols-2 grid-rows-2 bg-white md:col-span-8">
              {/* Top Left - Streak */}
              <div className="group flex cursor-pointer flex-col justify-between border-r-[4px] border-b-[4px] border-black p-4 transition-colors hover:bg-gray-100 sm:border-r-[6px] sm:border-b-[6px] sm:p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase sm:text-xs">
                    Consistency
                  </span>
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <div className="text-4xl font-black sm:text-6xl">{MOCK_DATA.streak}</div>
                  <span className="text-xs font-bold tracking-widest uppercase sm:text-sm">
                    Day Streak
                  </span>
                </div>
              </div>

              {/* Top Right - Mastery */}
              <div className="group flex cursor-pointer flex-col justify-between border-b-[4px] border-black bg-black p-4 text-white transition-colors hover:bg-gray-100 hover:text-black sm:border-b-[6px] sm:p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase group-hover:text-gray-600 sm:text-xs">
                    Mastery Index
                  </span>
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <div className="text-4xl font-black sm:text-6xl">{MOCK_DATA.masteryRate}%</div>
                  <span className="text-xs font-bold tracking-widest uppercase sm:text-sm">
                    Global Rate
                  </span>
                </div>
              </div>

              {/* Bottom Left - Database */}
              <div className="group flex cursor-pointer flex-col justify-between border-r-[4px] border-black p-4 transition-colors hover:bg-gray-100 sm:border-r-[6px] sm:p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase sm:text-xs">
                    Directory
                  </span>
                  <Layers className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <div className="text-4xl font-black sm:text-6xl">{MOCK_DATA.totalDecks}</div>
                  <span className="text-xs font-bold tracking-widest uppercase sm:text-sm">
                    Active Decks
                  </span>
                </div>
              </div>

              {/* Bottom Right - Socratic */}
              <div className="group relative flex cursor-pointer flex-col justify-between overflow-hidden p-4 transition-colors hover:bg-gray-100 sm:p-6">
                <Brain className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 transition-opacity group-hover:opacity-20" />
                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase sm:text-xs">
                    Interrogation
                  </span>
                  <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="relative z-10">
                  <span className="block text-lg leading-tight font-bold tracking-widest uppercase sm:text-2xl">
                    Socratic
                    <br />
                    Mode
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
