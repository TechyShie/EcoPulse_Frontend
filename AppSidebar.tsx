import { Zap, LayoutDashboard, Lightbulb, Trophy, User, LogOut, BookOpen, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "./components/ui/sidebar";
import { Separator } from "./components/ui/separator";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Logs", url: "/logs", icon: BookOpen },
  { title: "Insights", url: "/insights", icon: Lightbulb },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "AI Assistant", url: "/ai-assistant", icon: Sparkles },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-secondary/50">
        {/* Logo */}
        <div className="flex items-center gap-2 p-4">
          <img src="/assets/leaf.svg" alt="Leaf" className="w-6 h-6" />
          {!isCollapsed && (
            <span className="font-bold text-lg">EcoPulse</span>
          )}
        </div>

        <Separator className="mx-4" />

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Log Out at Bottom */}
        <div className="mt-auto p-4">
          <SidebarMenuButton asChild>
            <a
              href="/auth"
              className="hover:bg-muted text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Log out</span>}
            </a>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
