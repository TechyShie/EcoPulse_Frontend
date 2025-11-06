import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Award, Leaf, Droplets, Zap, TreePine, Wind, Recycle, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, auth } from "@/utils/api";

interface ProfileData {
  id: number;
  email: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar?: string;  // Fixed: changed from avatar_url to avatar
  eco_score: number;
  total_emissions_saved: number;
  created_at: string;
  updated_at: string;
}

interface BadgeData {
  name: string;
  description: string;
  icon: string;
  earned_at: string | null;
  earned: boolean;
}

interface AchievementData {
  title: string;
  value: string | number;
}

const Profile = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    avatar: "",
  });

  // Helper functions
  const getLevelFromScore = (score: number): string => {
    if (score >= 1000) return "Eco Master";
    if (score >= 500) return "Green Hero";
    if (score >= 100) return "Eco Warrior";
    return "Eco Newbie";
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        console.log("🔄 Fetching profile data...");
        
        // Fetch main profile data
        const profileResponse = await api.profile.get();
        console.log('📊 Profile response:', profileResponse);
        
        if (profileResponse) {
          setProfile(profileResponse);
          setFormData({
            full_name: profileResponse.full_name || "",
            bio: profileResponse.bio || "",
            avatar: profileResponse.avatar || "",
          });
        }

        // Fetch badges
        try {
          console.log("🔄 Fetching badges...");
          const badgesResponse = await api.profile.badges();
          console.log('🏅 Badges response:', badgesResponse);
          
          if (badgesResponse && badgesResponse.badges) {
            setBadges(badgesResponse.badges);
          } else {
            console.warn('No badges data found in response');
            setBadges([]);
          }
        } catch (badgeError) {
          console.error('Failed to fetch badges:', badgeError);
          setBadges([]);
        }

        // Fetch achievements
        try {
          console.log("🔄 Fetching achievements...");
          const achievementsResponse = await api.profile.achievements();
          console.log('📈 Achievements response:', achievementsResponse);
          
          if (achievementsResponse && achievementsResponse.achievements) {
            setAchievements(achievementsResponse.achievements);
          } else {
            console.warn('No achievements data found in response');
            setAchievements([]);
          }
        } catch (achievementError) {
          console.error('Failed to fetch achievements:', achievementError);
          setAchievements([]);
        }

      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📝 Updating profile with data:", formData);
      const response = await api.profile.update({
        full_name: formData.full_name,
        bio: formData.bio,
        avatar: formData.avatar,
      });
      
      console.log("✅ Profile update response:", response);
      
      setProfile(prev => prev ? { ...prev, ...response } : response);
      setIsOpen(false);
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get badge icon component
  const getBadgeIcon = (icon: string) => {
    // Return the emoji directly since backend provides emoji icons
    return (
      <span className="text-2xl" role="img" aria-label="Badge icon">
        {icon}
      </span>
    );
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <SidebarTrigger />
                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                  <AvatarFallback>...</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading profile...</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!profile) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-6">
                <SidebarTrigger />
                <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                  <AvatarFallback>!</AvatarFallback>
                </Avatar>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <p>Failed to load profile data</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Try Again
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const userInitials = profile.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/50 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24 bg-primary text-primary-foreground text-2xl">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.full_name} />
                    ) : (
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
                    {profile.email && (
                      <p className="text-muted-foreground">{profile.email}</p>
                    )}
                    <p className="text-muted-foreground">@{profile.username}</p>
                    <p className="text-muted-foreground mt-2">
                      {profile.bio || "Passionate about sustainability and reducing carbon footprint."}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                      <Badge className="text-sm">
                        ⚡ {getLevelFromScore(profile.eco_score)}
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        {profile.eco_score.toLocaleString()} eco points
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {profile.total_emissions_saved.toFixed(1)} kg CO₂ saved
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Member since {formatDate(profile.created_at)}
                    </p>
                  </div>
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about your sustainability journey..."
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="avatar">Avatar URL</Label>
                          <Input
                            id="avatar"
                            value={formData.avatar}
                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Save Changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Eco Score</p>
                      <p className="text-2xl font-bold">{profile.eco_score}</p>
                    </div>
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">CO₂ Saved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {profile.total_emissions_saved.toFixed(1)} kg
                      </p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-lg font-bold">
                        {formatDate(profile.created_at)}
                      </p>
                    </div>
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  My Badges ({badges.filter(b => b.earned).length}/{badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                          badge.earned
                            ? "bg-secondary/50 border-primary/30"
                            : "bg-muted/30 border-muted opacity-50"
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {getBadgeIcon(badge.icon)}
                        </div>
                        <p className="text-xs font-medium text-center">{badge.name}</p>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          {badge.description}
                        </p>
                        {badge.earned && badge.earned_at && (
                          <p className="text-xs text-primary mt-2">
                            Earned {formatDate(badge.earned_at)}
                          </p>
                        )}
                        {!badge.earned && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Not earned yet
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No badges available</p>
                    <p className="text-sm">Complete activities to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{achievement.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;