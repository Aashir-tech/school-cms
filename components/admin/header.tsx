"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  X,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Monitor,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import {
  setSearchQuery,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotifications,
} from "@/redux/slices/dashboardSlice";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

export function AdminHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { searchQuery, notifications } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, resolvedTheme,setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Mock notifications
    const initialNotifications = [
      {
        id: "1",
        title: "New Contact Message",
        message: "You have received a new contact form submission",
        type: "info" as const,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: "2",
        title: "Event Reminder",
        message: "Science Fair event is scheduled for tomorrow",
        type: "warning" as const,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
    ];
    dispatch(setNotifications(initialNotifications));
  }, [dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.replace("/admin/login");
  };

  const handleProfile = () => router.push("/admin/profile");
  const handleSettings = () => router.push("/admin/settings");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setSearchQuery(e.target.value));
  const handleNotificationClick = (notificationId: string) =>
    dispatch(markNotificationAsRead(notificationId));
  const handleMarkAllAsRead = () => dispatch(markAllNotificationsAsRead());

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "💡";
      default:
        return "📢";
    }
  };

  if (!mounted) {
    // Render a static placeholder to prevent layout shift during hydration
    return (
      <header className="h-[100px] bg-background border-b border-border"></header>
    );
  }

  return (
    <header className="relative overflow-hidden z-20">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-background/80 dark:bg-background/50 border-b border-border"></div>
      </div>

      <div className="relative z-10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 flex-1">
            <div className="hidden md:block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary/20">
                  <Sparkles className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Good{" "}
                    {currentTime.getHours() < 12
                      ? "Morning"
                      : currentTime.getHours() < 17
                      ? "Afternoon"
                      : "Evening"}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 flex-1 max-w-md">
              {showSearch ? (
                <div className="relative w-full group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm group-focus-within:blur-none transition-all duration-300"></div>
                  <div className="relative bg-secondary backdrop-blur-md rounded-2xl border border-border shadow-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-12 pr-12 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none h-12 rounded-2xl"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowSearch(false);
                        dispatch(setSearchQuery(""));
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(true)}
                  className="h-12 w-12 rounded-2xl bg-secondary text-secondary-foreground hover:bg-muted border border-border shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 bg-secondary backdrop-blur-md rounded-xl px-4 py-2 border border-border shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">
                System Online
              </span>
              <Zap className="h-3 w-3 text-yellow-400" />
            </div>

            <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="h-12 w-12 rounded-2xl bg-secondary text-secondary-foreground hover:bg-muted border border-border shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {mounted && (
        <>
          {theme === "system" ? (
            <Monitor className="h-5 w-5 transition-all" />
          ) : theme === "light" ? (
            <Sun className="h-5 w-5 transition-all" />
          ) : (
            <Moon className="h-5 w-5 transition-all" />
          )}
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-40 bg-popover text-popover-foreground border-border shadow-2xl rounded-2xl p-2 mt-2"
  >
    {[
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: Monitor },
    ].map(({ value, label, icon: Icon }) => (
      <DropdownMenuItem
        key={value}
        onClick={() => setTheme(value)}
        className={`px-4 py-3 rounded-xl hover:bg-accent focus:bg-accent cursor-pointer flex items-center justify-between ${
          theme === value ? "bg-muted font-medium" : ""
        }`}
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
        {theme === value && <Check className="h-4 w-4 text-primary" />}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-12 w-12 rounded-2xl bg-secondary text-secondary-foreground hover:bg-muted border border-border shadow-lg hover:shadow-xl group"
                >
                  <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-background animate-pulse">
                      <span className="text-xs font-bold text-white">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-96 bg-popover text-popover-foreground border-border shadow-2xl rounded-2xl p-0 mt-2"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground border-0">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex items-start p-4 hover:bg-accent focus:bg-accent cursor-pointer"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sm">
                              {getNotificationIcon(notification.type)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-foreground truncate">
                                {notification.title}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 hover:bg-muted px-4 py-3 rounded-2xl bg-secondary border-border shadow-lg h-auto"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-background">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-foreground">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role || "Administrator"}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-popover text-popover-foreground border-border shadow-2xl rounded-2xl p-2 mt-2"
              >
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email || "admin@school.com"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="px-4 py-3 rounded-xl hover:bg-accent focus:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span>Profile Settings</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettings}
                    className="px-4 py-3 rounded-xl hover:bg-accent focus:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                        <Settings className="h-4 w-4 text-white" />
                      </div>
                      <span>Account Settings</span>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-border" />
                <div className="py-2">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-xl hover:bg-destructive/20 focus:bg-destructive/20 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-white" />
                      </div>
                      <span>Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}
