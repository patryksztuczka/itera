import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActivityChart } from '../components/activity-chart';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const MOCK_DATA = {
  cardsToReview: 468,
  newCards: 15,
  learningCards: 10,
  relearningCards: 5,
  streak: 12,
};

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="flex flex-col shadow-sm md:col-span-3 lg:col-span-1">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Daily Reviews</CardTitle>
              <CardDescription>Your spaced repetition queue</CardDescription>
            </div>
            <Badge variant="secondary">Today</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center py-6">
          <div className="text-primary mb-2 text-7xl font-bold tracking-tighter">
            {MOCK_DATA.cardsToReview}
          </div>
          <p className="text-muted-foreground mb-8 font-medium">Pending Cards</p>

          <div className="mb-2 w-full space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>New</span>
              </div>
              <span className="font-medium">{MOCK_DATA.newCards}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span>Learning</span>
              </div>
              <span className="font-medium">{MOCK_DATA.learningCards}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>To Review</span>
              </div>
              <span className="font-medium">{MOCK_DATA.relearningCards}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full" onClick={() => navigate('/study')}>
            Start Review Session <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-3 lg:col-span-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{MOCK_DATA.streak} Days</div>
            <p className="text-muted-foreground mt-1 text-xs">You're on fire! Keep it up.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Current Deck
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="truncate text-xl font-bold">Computer Science 101</div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">42 mastered</span>
                <span className="text-muted-foreground font-medium">158 to go</span>
              </div>
              <Progress value={(42 / 200) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm sm:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Interaction Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
