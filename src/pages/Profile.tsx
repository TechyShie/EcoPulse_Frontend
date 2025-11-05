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
  full_name: string;
  bio?: string;
  avatar_url?: string;
  eco_score: number;
  total_emissions_saved: number;
  is_active: boolean;
  created_at: string;
}

interface BadgeData {
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

interface AchievementData {
  title: string;
  description: string;
  date: string;
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
  });

  // Helper functions
  const getLevelFromScore = (score: number): string => {
    if (score >= 1000) return "Eco Master";
    if (score >= 500) return "Green Hero";
    if (score >= 100) return "Eco Warrior";
    return "Eco Newbie";
  };

  const getIconFromBadge = (badgeName: string): string => {
    const iconMap: { [key: string]: string } = {
      'First Steps': 'leaf',
      'Water Saver': 'droplets',
      'Energy Hero': 'zap',
      'Tree Hugger': 'tree-pine',
      'Clean Air': 'wind',
      'Recycle Pro': 'recycle',
      'Eco Master': 'award',
      'Climate Hero': 'sparkles',
      'Green Starter': 'user',
    };
    return iconMap[badgeName] || 'award';
  };

  const getBadgeColor = (badgeName: string): string => {
    const colorMap: { [key: string]: string } = {
      'First Steps': 'text-green-500',
      'Water Saver': 'text-blue-500',
      'Energy Hero': 'text-yellow-500',
      'Tree Hugger': 'text-emerald-600',
      'Clean Air': 'text-cyan-500',
      'Recycle Pro': 'text-green-600',
      'Eco Master': 'text-purple-500',
      'Climate Hero': 'text-orange-500',
      'Green Starter': 'text-gray-500',
    };
    return colorMap[badgeName] || 'text-primary';
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch main profile data
        const profileResponse = await api.profile.get();
        console.log('Profile response:', profileResponse);
        
        if (profileResponse) {
          setProfile(profileResponse);
          setFormData({
            full_name: profileResponse.full_name || "",
            bio: profileResponse.bio || "",
          });
        }

        // Fetch badges
        try {
          const badgesResponse = await api.profile.badges();
          console.log('Badges response:', badgesResponse);
          
          if (badgesResponse && badgesResponse.badges) {
            const formattedBadges = badgesResponse.badges.map((badge: any) => ({
              name: badge.name || badge.badge?.name || "Unknown Badge",
              icon: getIconFromBadge(badge.name || badge.badge?.name),
              color: getBadgeColor(badge.name || badge.badge?.name),
              earned: true,
            }));
            setBadges(formattedBadges);
          } else {
            // Fallback badges
            setBadges([
              { name: "First Steps", icon: "leaf", color: "text-green-500", earned: true },
              { name: "Recycle Pro", icon: "recycle", color: "text-green-600", earned: true },
            ]);
          }
        } catch (badgeError) {
          console.warn('Failed to fetch badges:', badgeError);
          setBadges([
            { name: "First Steps", icon: "leaf", color: "text-green-500", earned: true },
            { name: "Recycle Pro", icon: "recycle", color: "text-green-600", earned: true },
          ]);
        }

        // Fetch achievements
        try {
          const achievementsResponse = await api.profile.achievements();
          console.log('Achievements response:', achievementsResponse);
          
          if (achievementsResponse && achievementsResponse.achievements) {
            const formattedAchievements = achievementsResponse.achievements.map((achievement: string, index: number) => ({
              title: achievement,
              description: getAchievementDescription(achievement),
              date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            }));
            setAchievements(formattedAchievements);
          } else {
            // Fallback achievements based on profile data
            const fallbackAchievements = [];
            if (profileResponse?.eco_score >= 100) {
              fallbackAchievements.push({
                title: "Green Starter",
                description: "Reached 100 eco points",
                date: "Current"
              });
            }
            if (profileResponse?.eco_score >= 500) {
              fallbackAchievements.push({
                title: "Eco Warrior",
                description: "Reached 500 eco points",
                date: "Current"
              });
            }
            setAchievements(fallbackAchievements);
          }
        } catch (achievementError) {
          console.warn('Failed to fetch achievements:', achievementError);
          setAchievements([
            { title: "Green Starter", description: "Started your eco journey", date: "Current" },
          ]);
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
      const response = await api.profile.update({
        full_name: formData.full_name,
        bio: formData.bio,
      });
      
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

  // Icon mapping for badges
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      leaf: Leaf,
      droplets: Droplets,
      zap: Zap,
      'tree-pine': TreePine,
      wind: Wind,
      recycle: Recycle,
      award: Award,
      sparkles: Sparkles,
      user: User,
    };
    return iconMap[iconName] || Award;
  };

  const getAchievementDescription = (achievement: string): string => {
    const descriptionMap: { [key: string]: string } = {
      'Eco Master': 'Reached the highest eco score level',
      'Climate Hero': 'Saved significant carbon emissions',
      'Green Starter': 'Started your eco journey',
      'Eco Warrior': 'Making consistent eco-friendly choices',
      'Week Warrior': 'Logged activities for 7 consecutive days',
      'Century Club': 'Earned 100+ eco points',
    };
    return descriptionMap[achievement] || 'Great achievement in your sustainability journey';
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
              <div className="text-center">Loading profile...</div>
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
    : 'U';

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
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile.full_name || "User"}</h1>
                    {profile.email && (
                      <p className="text-muted-foreground">{profile.email}</p>
                    )}
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
                        {Math.round(profile.total_emissions_saved / 1000)} kg CO₂ saved
                      </Badge>
                    </div>
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
                            required
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
                        <Button type="submit" className="w-full">
                          Save Changes
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  My Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map((badge, index) => {
                      const IconComponent = getIconComponent(badge.icon);
                      return (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                            badge.earned
                              ? "bg-secondary/50 border-primary/30"
                              : "bg-muted/30 border-muted opacity-50"
                          }`}
                        >
                          <IconComponent className={`h-8 w-8 ${badge.color}`} />
                          <p className="text-xs font-medium mt-2 text-center">{badge.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No badges earned yet</p>
                    <p className="text-sm">Complete activities to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                        <Award className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-primary mt-1">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No achievements yet</p>
                    <p className="text-sm">Keep going to unlock achievements!</p>
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