import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Crown, 
  Trophy, 
  Medal, 
  Star, 
  Search, 
  Filter,
  Award,
  TrendingUp,
  Users,
  Target
} from "lucide-react";
import { api, auth } from "@/utils/api";

interface LeaderboardUser {
  rank: number;
  user_id: number;
  full_name: string;
  avatar_url: string | null;
  eco_score: number;
  total_emissions_saved: number;
  is_current_user: boolean;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  current_user_rank: number | null;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  
  // Leaderboard data
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>({
    leaderboard: [],
    current_user_rank: null
  });
  const [filteredUsers, setFilteredUsers] = useState<LeaderboardUser[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated()) {
      navigate("/auth");
      return;
    }

    // Get user data
    const user = auth.getUser();
    if (user) {
      setUserName(user.full_name || user.email || "User");
    }

    fetchLeaderboard();
  }, [navigate]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.leaderboard.get();
      console.log("Leaderboard data:", data);

      setLeaderboardData(data);
      setFilteredUsers(data.leaderboard);

    } catch (err: any) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard");
      
      // Set empty data as fallback
      setLeaderboardData({
        leaderboard: [],
        current_user_rank: null
      });
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = leaderboardData.leaderboard;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply rank filter
    if (rankFilter !== "all") {
      switch (rankFilter) {
        case "top10":
          filtered = filtered.filter(user => user.rank <= 10);
          break;
        case "top50":
          filtered = filtered.filter(user => user.rank <= 50);
          break;
        case "nearby":
          if (leaderboardData.current_user_rank) {
            const currentRank = leaderboardData.current_user_rank;
            filtered = filtered.filter(user => 
              user.rank >= Math.max(1, currentRank - 5) && 
              user.rank <= currentRank + 5
            );
          }
          break;
      }
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [leaderboardData, searchTerm, rankFilter]);

  // Get rank badge color and icon
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return {
        bgColor: "bg-yellow-100 border-yellow-200",
        textColor: "text-yellow-800",
        icon: <Crown className="h-4 w-4" />,
        label: "Gold"
      };
    } else if (rank === 2) {
      return {
        bgColor: "bg-gray-100 border-gray-200",
        textColor: "text-gray-800",
        icon: <Medal className="h-4 w-4" />,
        label: "Silver"
      };
    } else if (rank === 3) {
      return {
        bgColor: "bg-orange-100 border-orange-200",
        textColor: "text-orange-800",
        icon: <Medal className="h-4 w-4" />,
        label: "Bronze"
      };
    } else if (rank <= 10) {
      return {
        bgColor: "bg-blue-100 border-blue-200",
        textColor: "text-blue-800",
        icon: <Star className="h-4 w-4" />,
        label: `Top 10`
      };
    } else if (rank <= 50) {
      return {
        bgColor: "bg-green-100 border-green-200",
        textColor: "text-green-800",
        icon: <TrendingUp className="h-4 w-4" />,
        label: `Top 50`
      };
    } else {
      return {
        bgColor: "bg-gray-100 border-gray-200",
        textColor: "text-gray-600",
        icon: null,
        label: `Rank ${rank}`
      };
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <SidebarTrigger />
                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top Header with Trigger */}
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Global Leaderboard</h1>
                <p className="text-muted-foreground">
                  Compete with eco-warriors worldwide and climb the ranks!
                </p>
              </div>
              <Button 
                onClick={fetchLeaderboard} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchLeaderboard}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Crown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {leaderboardData.leaderboard[0]?.eco_score || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Top Score</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {leaderboardData.leaderboard.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Players</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {leaderboardData.current_user_rank || "-"}
                    </div>
                    <p className="text-sm text-muted-foreground">Your Rank</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {leaderboardData.leaderboard.reduce((total, user) => total + user.total_emissions_saved, 0).toLocaleString()} kg
                    </div>
                    <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Rank Filter */}
                  <Select value={rankFilter} onValueChange={setRankFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranks</SelectItem>
                      <SelectItem value="top10">Top 10</SelectItem>
                      <SelectItem value="top50">Top 50</SelectItem>
                      <SelectItem value="nearby">Around Me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Eco Warriors Ranking ({filteredUsers.length})
                  {filteredUsers.length !== leaderboardData.leaderboard.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Filtered from {leaderboardData.leaderboard.length})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Ranked by eco score - higher scores mean more environmental impact!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {leaderboardData.leaderboard.length === 0 
                        ? "No users on the leaderboard yet" 
                        : "No users match your filters"
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead className="text-right">Eco Score</TableHead>
                          <TableHead className="text-right">CO₂ Saved</TableHead>
                          <TableHead className="text-right">Impact Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentUsers.map((user) => {
                          const rankBadge = getRankBadge(user.rank);
                          return (
                            <TableRow 
                              key={user.user_id} 
                              className={user.is_current_user ? "bg-primary/5 border-l-4 border-l-primary" : ""}
                            >
                              <TableCell className="font-medium">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${rankBadge.bgColor} ${rankBadge.textColor}`}>
                                  {rankBadge.icon}
                                  <span className="font-bold">#{user.rank}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar_url || ""} />
                                    <AvatarFallback className="text-xs">
                                      {getUserInitials(user.full_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium flex items-center gap-2">
                                      {user.full_name}
                                      {user.is_current_user && (
                                        <Badge variant="secondary" className="text-xs">
                                          You
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {rankBadge.label}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold text-lg">{user.eco_score}</div>
                                <div className="text-sm text-muted-foreground">points</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold text-green-600">
                                  {user.total_emissions_saved.toLocaleString()} kg
                                </div>
                                <div className="text-sm text-muted-foreground">CO₂ saved</div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end">
                                  {user.eco_score >= 1000 ? (
                                    <Badge className="bg-purple-100 text-purple-800">Eco Master</Badge>
                                  ) : user.eco_score >= 500 ? (
                                    <Badge className="bg-blue-100 text-blue-800">Eco Champion</Badge>
                                  ) : user.eco_score >= 100 ? (
                                    <Badge className="bg-green-100 text-green-800">Eco Warrior</Badge>
                                  ) : (
                                    <Badge variant="outline">Eco Beginner</Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredUsers.length > itemsPerPage && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Your Ranking Highlight */}
            {leaderboardData.current_user_rank && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Your Current Rank</h3>
                        <p className="text-muted-foreground">
                          You're ranked #{leaderboardData.current_user_rank} out of {leaderboardData.leaderboard.length} players
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-2xl font-bold text-primary">
                        #{leaderboardData.current_user_rank}
                      </div>
                      <div className="text-sm text-muted-foreground">Global Rank</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Leaderboard;