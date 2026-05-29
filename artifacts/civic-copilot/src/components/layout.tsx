import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useGetMe, getGetMeQueryKey, useAdminLogout } from "@workspace/api-client-react";
import { Building2, LayoutDashboard, FileText, Bookmark, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [, setLocation] = useLocation();
  const { data: user, isLoading, isError } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
    }
  });

  const logout = useAdminLogout();

  useEffect(() => {
    if (isError) {
      setLocation("/login");
    }
  }, [isError, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/login");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <Building2 className="mr-3 h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-bold tracking-tight text-white">Civic Co-Pilot</span>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/complaints" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
            <FileText className="h-4 w-4" />
            Complaints
          </Link>
          <Link href="/schemes" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
            <Bookmark className="h-4 w-4" />
            Schemes
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{user.username}</span>
              <span className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-sidebar-foreground bg-transparent border-sidebar-border hover:bg-sidebar-accent hover:text-white"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            {logout.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card px-8 flex items-center shadow-sm z-10 sticky top-0">
          <h1 className="text-xl font-semibold tracking-tight">Admin Portal</h1>
        </header>
        
        {/* Page Content */}
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
