import { useMemo } from 'react';

const WEEKS = 30;
const DAYS = 7;

function generateActivityData() {
  return Array.from({ length: DAYS }, () =>
    Array.from({ length: WEEKS }, () =>
      Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0,
    ),
  );
}

function getColor(level: number) {
  switch (level) {
    case 1:
      return 'bg-emerald-900/50 dark:bg-[#0e4429]';
    case 2:
      return 'bg-emerald-700/60 dark:bg-[#006d32]';
    case 3:
      return 'bg-emerald-500/80 dark:bg-[#26a641]';
    case 4:
      return 'bg-emerald-400 dark:bg-[#39d353]';
    default:
      return 'bg-muted dark:bg-[#161b22]';
  }
}

export function ActivityChart() {
  const data = useMemo(() => generateActivityData(), []);

  return (
    <div className="scrollbar-hide w-full overflow-x-auto pb-2">
      <div className="flex min-w-max gap-1 text-xs">
        <div className="text-muted-foreground/70 flex flex-col gap-1 pr-2">
          {data.map((_, dayIndex) => (
            <div key={dayIndex} className="flex h-3 w-6 items-center justify-end leading-3">
              {dayIndex === 1 ? 'Mon' : dayIndex === 3 ? 'Wed' : dayIndex === 5 ? 'Fri' : ''}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {data[0]?.map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {data.map((row, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`hover:ring-ring h-3 w-3 rounded-[2px] transition-colors hover:ring-1 hover:ring-offset-1 ${getColor(
                    row[weekIndex],
                  )}`}
                  title={`Interactions: ${row[weekIndex] * 15}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-muted-foreground mt-4 flex items-center justify-end gap-1.5 text-xs">
        <span>Less</span>
        <div className={`h-3 w-3 rounded-[2px] ${getColor(0)}`} />
        <div className={`h-3 w-3 rounded-[2px] ${getColor(1)}`} />
        <div className={`h-3 w-3 rounded-[2px] ${getColor(2)}`} />
        <div className={`h-3 w-3 rounded-[2px] ${getColor(3)}`} />
        <div className={`h-3 w-3 rounded-[2px] ${getColor(4)}`} />
        <span>More</span>
      </div>
    </div>
  );
}
