import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, Filter, Plus, Edit, Trash2, Calendar } from "lucide-react";
import AddLogDialog from "@/components/AddLogDialog";
import { api, auth } from "@/utils/api";

interface Log {
  id: number;
  activity_type: string;
  description: string;
  emissions_saved: number;
  points_earned: number;
  activity_date: string;
  created_at: string;
}

const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

    fetchLogs();
  }, [navigate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const logsData = await api.logs.get();
      console.log("Logs data:", logsData);

      if (Array.isArray(logsData)) {
        setLogs(logsData);
        setFilteredLogs(logsData);
      } else {
        console.error("Logs data is not an array:", logsData);
        setLogs([]);
        setFilteredLogs([]);
      }

    } catch (err: any) {
      console.error("Error fetching logs:", err);
      setError("Failed to load logs");
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search term, category, or date filter changes
  useEffect(() => {
    let filtered = logs;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(log => log.activity_type === categoryFilter);
    }

    // Apply date filter (simplified - you can enhance this)
    if (dateFilter !== "all") {
      const now = new Date();
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      filtered = filtered.filter(log => {
        const logDate = new Date(log.activity_date);
        switch (dateFilter) {
          case "week":
            return logDate >= sevenDaysAgo;
          case "month":
            return logDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [logs, searchTerm, categoryFilter, dateFilter]);

  const handleAddLog = (newLog: Log) => {
    setLogs(prev => [newLog, ...prev]);
    // Filters will be automatically applied due to useEffect
  };

  const handleEditLog = async (logId: number) => {
    // For now, we'll just refresh the data
    // You can implement a proper edit dialog later
    await fetchLogs();
  };

  const handleDeleteLog = async (logId: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      await api.logs.delete(logId);
      // Remove the log from local state
      setLogs(prev => prev.filter(log => log.id !== logId));
    } catch (err: any) {
      console.error("Error deleting log:", err);
      alert("Failed to delete activity");
    }
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(logs.map(log => log.activity_type)));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      transportation: "bg-blue-100 text-blue-800",
      energy: "bg-green-100 text-green-800",
      waste: "bg-orange-100 text-orange-800",
      food: "bg-purple-100 text-purple-800",
      shopping: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

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
                <p className="mt-4 text-muted-foreground">Loading activities...</p>
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
                <h1 className="text-3xl font-bold">Activity Logs</h1>
                <p className="text-muted-foreground">
                  Track and manage all your eco-friendly activities
                </p>
              </div>
              <AddLogDialog onAddLog={handleAddLog} />
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchLogs}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Category Filter */}
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date Filter */}
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {logs.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {logs.reduce((sum, log) => sum + log.emissions_saved, 0).toFixed(1)} kg
                  </div>
                  <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {logs.reduce((sum, log) => sum + log.points_earned, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Points Earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Activities ({filteredLogs.length})
                  {filteredLogs.length !== logs.length && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (Filtered from {logs.length})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">
                      {logs.length === 0 ? "No activities yet" : "No activities match your filters"}
                    </div>
                    {logs.length === 0 && (
                      <AddLogDialog onAddLog={handleAddLog} />
                    )}
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">CO₂ Saved</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {formatDate(log.activity_date)}
                            </TableCell>
                            <TableCell className="max-w-[300px]">
                              <div className="truncate" title={log.description}>
                                {log.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={getCategoryColor(log.activity_type)}
                              >
                                {log.activity_type.charAt(0).toUpperCase() + log.activity_type.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              +{log.emissions_saved.toFixed(1)} kg
                            </TableCell>
                            <TableCell className="text-right font-medium text-blue-600">
                              +{log.points_earned}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditLog(log.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteLog(log.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filteredLogs.length > itemsPerPage && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} activities
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Logs;