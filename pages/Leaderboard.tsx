import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award, User } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  initials: string;
  points: number;
  level: string;
  badge: string;
}

const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: "Sarah Chen", initials: "SC", points: 2450, level: "Planet Pro", badge: "🌟" },
  { rank: 2, name: "Mike Johnson", initials: "MJ", points: 2180, level: "Green Hero", badge: "🦸" },
  { rank: 3, name: "Emma Davis", initials: "ED", points: 1920, level: "Green Hero", badge: "🌿" },
  { rank: 4, name: "Alex Rivera", initials: "AR", points: 1750, level: "Eco Warrior", badge: "⚡" },
  { rank: 5, name: "Jordan Lee", initials: "JL", points: 1580, level: "Eco Warrior", badge: "🌱" },
  { rank: 6, name: "Taylor Swift", initials: "TS", points: 1420, level: "Eco Champion", badge: "🏆" },
  { rank: 7, name: "Chris Park", initials: "CP", points: 1290, level: "Eco Champion", badge: "💚" },
  { rank: 8, name: "Sam Wilson", initials: "SW", points: 1150, level: "Eco Newbie", badge: "🌸" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-slate-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground font-semibold">#{rank}</span>;
  }
};

const Leaderboard = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-muted-foreground">Top eco-warriors this month</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
              {leaderboardData.slice(0, 3).map((user) => (
                <Card
                  key={user.rank}
                  className={`relative overflow-hidden ${
                    user.rank === 1
                      ? "bg-gradient-to-br from-yellow-500/10 to-primary/10 border-yellow-500/30"
                      : user.rank === 2
                      ? "bg-gradient-to-br from-slate-400/10 to-primary/10 border-slate-400/30"
                      : "bg-gradient-to-br from-amber-600/10 to-primary/10 border-amber-600/30"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        {user.rank === 1 && (
                          <div className="absolute -top-2 -right-2 animate-pulse">
                            <Crown className="h-6 w-6 text-yellow-500" />
                          </div>
                        )}
                        <Avatar className="h-20 w-20 bg-primary text-primary-foreground text-xl">
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="font-bold text-lg">{user.name}</p>
                        <Badge variant="secondary" className="mt-1">
                          {user.badge} {user.level}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {user.points.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">eco points</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leaderboardData.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 flex items-center justify-center">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {user.badge} {user.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">
                            {user.points.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Leaderboard;
