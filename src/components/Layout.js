import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Trophy, BookOpen, Crown, Mail, Users, Settings, Shield, LogIn, LogOut, User } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAdmin(data.user.role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUser(null);
        setIsAdmin(false);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const navigationItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Tournaments", url: "/tournaments", icon: Trophy },
    { name: "Championships", url: "/championships", icon: Shield },
    { name: "Rules", url: "/rules", icon: BookOpen },
    { name: "Newsletter", url: "/newsletter", icon: Mail },
    { name: "Members", url: "/members", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      <style jsx global>{`
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Crimson Text', serif; }
        
        .ornate-divider {
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          height: 1px; margin: 2rem 0; position: relative;
        }
        .ornate-divider::after {
          content: '❦'; position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); background: #1e3a30;
          padding: 0 1rem; color: #d4af37; font-size: 1rem;
        }
        .footer-divider::after { background: linear-gradient(to bottom, #1e3a30, #162c24); }
      `}</style>

      {/* Authentication - Fixed Position in Top Right */}
      {!loading && (
        <div className="fixed top-4 right-4 z-50">
          {user ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <Crown className="w-4 h-4 text-amber-600" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600" />
                  )}
                  <div>
                    <p className="font-body text-sm font-semibold text-emerald-800">
                      {user.email}
                    </p>
                    <p className="font-body text-xs text-emerald-600 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-red-100 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 border border-emerald-200 flex items-center gap-2 hover:bg-emerald-50 transition-colors"
            >
              <LogIn className="w-4 h-4 text-emerald-600" />
              <span className="font-body text-sm font-semibold text-emerald-800">Login</span>
            </button>
          )}
        </div>
      )}

      {/* Header with Centered Navigation */}
      <header className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 shadow-2xl border-b-4 border-amber-400">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-amber-100 tracking-wider">
              Nederlandse Bond der Croquet
            </h1>
            <p className="font-body text-amber-200 text-lg italic mt-1">Est. 2024</p>
          </div>
          
          {/* Navigation - Perfectly Centered */}
          <nav className="flex justify-center items-center">
            <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-4">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.url}>
                  <div className="group flex flex-col items-center justify-center w-24 h-24 rounded-full text-amber-100 transition-all duration-300 hover:bg-emerald-700/50 cursor-pointer">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full mb-1
                      transition-all duration-300 transform
                      group-hover:scale-110 group-hover:bg-amber-400/20
                      ${router.pathname === item.url ? 'bg-amber-400/20 scale-110' : 'bg-emerald-700/50'}
                    `}>
                      <item.icon className="w-6 h-6 transition-colors duration-300 group-hover:text-amber-300" />
                    </div>
                    <span className={`font-body text-xs font-semibold tracking-wide transition-colors duration-300 group-hover:text-amber-200 ${router.pathname === item.url ? 'text-amber-200' : ''}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}

              {/* Admin Link - only show for admin users */}
              {isAdmin && (
                <Link href="/administration">
                  <div className="group flex flex-col items-center justify-center w-24 h-24 rounded-full text-amber-100 transition-all duration-300 hover:bg-emerald-700/50 cursor-pointer">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full mb-1
                      transition-all duration-300 transform
                      group-hover:scale-110 group-hover:bg-amber-400/20
                      ${router.pathname === '/administration' ? 'bg-amber-400/20 scale-110' : 'bg-emerald-700/50'}
                    `}>
                      <Settings className="w-6 h-6 transition-colors duration-300 group-hover:text-amber-300" />
                    </div>
                    <span className={`font-body text-xs font-semibold tracking-wide transition-colors duration-300 group-hover:text-amber-200 ${router.pathname === '/administration' ? 'text-amber-200' : ''}`}>
                      Admin
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden">
          <div className="p-8 md:p-12">
            {children}
          </div>
        </div>
      </main>

      <footer className="mt-16 bg-gradient-to-t from-emerald-900 to-emerald-800 text-amber-100 border-t-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="ornate-divider footer-divider"></div>
          <div className="text-center">
            <p className="font-body text-lg mb-4">
              "In the noble pursuit of precision and strategy"
            </p>
            <p className="font-body text-amber-300">
              © {new Date().getFullYear()} Nederlandse Bond der Croquet • All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}