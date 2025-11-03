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
import { Pencil, Award, Leaf, Droplets, Zap, TreePine, Wind, Recycle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    bio: "Passionate about sustainability and reducing my carbon footprint. Making the planet greener, one action at a time! 🌱",
    points: 0,
    level: "Eco Beginner",
  });

  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setProfile(prev => ({
        ...prev,
        name: user.name,
      }));
      setFormData(prev => ({
        ...prev,
        name: user.name,
      }));
    }
  }, []);

  const badges = [
    { name: "First Steps", icon: Leaf, color: "text-green-500", earned: false },
    { name: "Water Saver", icon: Droplets, color: "text-blue-500", earned: false },
    { name: "Energy Hero", icon: Zap, color: "text-yellow-500", earned: false },
    { name: "Tree Hugger", icon: TreePine, color: "text-emerald-600", earned: false },
    { name: "Clean Air", icon: Wind, color: "text-cyan-500", earned: false },
    { name: "Recycle Pro", icon: Recycle, color: "text-green-600", earned: false },
  ];

  const recentLogs = [
    // Empty for new user
  ];

  const achievements = [
    // Empty for new user
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, ...formData });
    setIsOpen(false);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/50">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24 bg-primary text-primary-foreground text-2xl">
                    <AvatarFallback>{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <p className="text-muted-foreground mt-2">{profile.bio}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                      <Badge className="text-sm">⚡ {profile.level}</Badge>
                      <Badge variant="secondary" className="text-sm">
                        {profile.points.toLocaleString()} eco points
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
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  My Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.name}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                          badge.earned
                            ? "bg-secondary/50 border-primary/30"
                            : "bg-muted/30 border-muted opacity-50"
                        }`}
                      >
                        <Icon className={`h-8 w-8 ${badge.earned ? badge.color : "text-muted-foreground"}`} />
                        <p className="text-xs font-medium mt-2 text-center">{badge.name}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLogs.map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium">{log.activity}</p>
                          <p className="text-xs text-muted-foreground">{log.date}</p>
                        </div>
                        <Badge className="bg-primary">+{log.points}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
