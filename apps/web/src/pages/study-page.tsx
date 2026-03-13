import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, HelpCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const MOCK_DATA = {
  cardsToReview: 468,
};

const MOCK_CARD = {
  front: 'What is the primary function of Virtual Memory?',
  back: 'It acts as an abstraction that maps virtual addresses to physical memory, giving each process the illusion of having its own contiguous address space.',
};

export function StudyPage() {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex w-full max-w-3xl items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => {
            setIsFlipped(false);
            navigate('/');
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">Card 1 of {MOCK_DATA.cardsToReview}</span>
          <Progress value={2} className="w-32" />
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <Card className="relative flex min-h-[400px] flex-col justify-center overflow-hidden transition-all duration-300">
          <CardHeader className="absolute top-0 flex w-full flex-row items-center justify-between opacity-50">
            <Badge variant={isFlipped ? 'secondary' : 'default'}>
              {isFlipped ? 'Answer' : 'Question'}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center p-8 text-center md:p-12">
            {!isFlipped ? (
              <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                {MOCK_CARD.front}
              </h2>
            ) : (
              <div className="animate-in fade-in duration-500">
                <p className="text-muted-foreground mb-6 text-xl md:text-2xl">{MOCK_CARD.front}</p>
                <div className="bg-primary/20 mx-auto my-6 h-1 w-16 rounded-full" />
                <p className="text-2xl leading-relaxed font-medium md:text-3xl">{MOCK_CARD.back}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          {!isFlipped ? (
            <Button size="lg" className="w-full max-w-sm" onClick={() => setIsFlipped(true)}>
              Reveal Answer
            </Button>
          ) : (
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex h-16 flex-col gap-1"
                onClick={() => setIsFlipped(false)}
              >
                <XCircle className="h-5 w-5" />
                <span>Again</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-16 flex-col gap-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={() => setIsFlipped(false)}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Hard</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-16 flex-col gap-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => setIsFlipped(false)}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Good</span>
              </Button>
              <Button
                variant="outline"
                className="flex h-16 flex-col gap-1 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => setIsFlipped(false)}
              >
                <Clock className="h-5 w-5" />
                <span>Easy</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
