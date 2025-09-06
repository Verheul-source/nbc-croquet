// src/components/Layout.js - COMPLETE MOBILE-FIRST REDESIGN
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  Home, Trophy, BookOpen, Crown, Mail, Users, Settings, Shield, 
  LogIn, LogOut, User, Menu, X, ChevronRight 
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
    
    // Close mobile menu on route change
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
      console.error('Authentication verification failed:', error);
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
        setMobileMenuOpen(false);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const navigationItems = [
    { name: "Home", url: "/", icon: Home, description: "Club homepage" },
    { name: "Tournaments", url: "/tournaments", icon: Trophy, description: "Competition events" },
    { name: "Championships", url: "/championships", icon: Shield, description: "Seasonal rankings" },
    { name: "Laws", url: "/rules", icon: BookOpen, description: "Game regulations" },
    { name: "Newsletter", url: "/newsletter", icon: Mail, description: "Club announcements" },
    { name: "Members", url: "/members", icon: Users, description: "Member directory" }
  ];

  const MobileNavigation = () => (
    <>
      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {/* Mobile Menu Header */}
        <div className="p-6 border-b border-emerald-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-300" />
              <div>
                <h2 className="font-display text-lg font-bold text-amber-100">NBdC</h2>
                <p className="font-body text-xs text-amber-300">Est. 1898</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="touch-target text-amber-100 hover:text-amber-300 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Items */}
        <div className="py-4">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.url}>
              <div className={`
                flex items-center gap-4 px-6 py-4 touch-target
                transition-all duration-200
                ${router.pathname === item.url 
                  ? 'bg-amber-400/20 border-r-4 border-amber-300 text-amber-200' 
                  : 'text-amber-100 hover:bg-emerald-700/50 hover:text-amber-200'
                }
              `}>
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-base truncate">
                    {item.name}
                  </p>
                  <p className="font-body text-xs opacity-80 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </div>
            </Link>
          ))}

          {/* Admin Link for Mobile */}
          {isAdmin && (
            <Link href="/administration">
              <div className={`
                flex items-center gap-4 px-6 py-4 touch-target
                transition-all duration-200
                ${router.pathname === '/administration' 
                  ? 'bg-amber-400/20 border-r-4 border-amber-300 text-amber-200' 
                  : 'text-amber-100 hover:bg-emerald-700/50 hover:text-amber-200'
                }
              `}>
                <Settings className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-base">
                    Administration
                  </p>
                  <p className="font-body text-xs opacity-80">
                    Club management
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </div>
            </Link>
          )}
        </div>

        {/* Mobile Authentication Section */}
        <div className="mt-auto p-6 border-t border-emerald-700">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-800/50">
                {isAdmin ? (
                  <Crown className="w-5 h-5 text-amber-400 flex-shrink-0" />
                ) : (
                  <User className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-amber-100 truncate">
                    {user.email}
                  </p>
                  <p className="font-body text-xs text-emerald-300 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                         bg-red-600/80 hover:bg-red-600 text-white transition-colors touch-target"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-body font-semibold">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full btn-edwardian rounded-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-body font-semibold">Member Login</span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  const DesktopNavigation = () => (
    <div className="hidden lg:grid lg:grid-cols-6 xl:grid-cols-6 gap-4 max-w-5xl mx-auto">
      {navigationItems.map((item) => (
        <Link key={item.name} href={item.url}>
          <div className={`
            group flex flex-col items-center justify-center p-4 rounded-xl 
            transition-all duration-300 cursor-pointer relative overflow-hidden touch-target
            ${router.pathname === item.url 
              ? 'bg-amber-400/20 border-2 border-amber-300 transform scale-105' 
              : 'bg-emerald-700/30 border-2 border-emerald-600 hover:bg-amber-400/10 hover:border-amber-400 hover:scale-105'
            }
          `}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full mb-2
              transition-all duration-300 relative z-10
              ${router.pathname === item.url 
                ? 'bg-amber-300 text-emerald-900 scale-110' 
                : 'bg-emerald-600/50 text-amber-100 group-hover:bg-amber-400/30 group-hover:text-amber-200 group-hover:scale-110'
              }
            `}>
              <item.icon className="w-6 h-6" />
            </div>
            
            <span className={`
              font-body text-sm font-semibold tracking-wide relative z-10
              transition-colors duration-300 text-center
              ${router.pathname === item.url 
                ? 'text-amber-200' 
                : 'text-amber-100 group-hover:text-amber-200'
              }
            `}>
              {item.name}
            </span>
          </div>
        </Link>
      ))}

      {isAdmin && (
        <Link href="/administration">
          <div className={`
            group flex flex-col items-center justify-center p-4 rounded-xl 
            transition-all duration-300 cursor-pointer relative overflow-hidden touch-target
            ${router.pathname === '/administration' 
              ? 'bg-amber-400/20 border-2 border-amber-300 transform scale-105' 
              : 'bg-emerald-700/30 border-2 border-emerald-600 hover:bg-amber-400/10 hover:border-amber-400 hover:scale-105'
            }
          `}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full mb-2
              transition-all duration-300 relative z-10
              ${router.pathname === '/administration' 
                ? 'bg-amber-300 text-emerald-900 scale-110' 
                : 'bg-emerald-600/50 text-amber-100 group-hover:bg-amber-400/30 group-hover:text-amber-200 group-hover:scale-110'
              }
            `}>
              <Settings className="w-6 h-6" />
            </div>
            
            <span className={`
              font-body text-sm font-semibold tracking-wide relative z-10
              transition-colors duration-300
              ${router.pathname === '/administration' 
                ? 'text-amber-200' 
                : 'text-amber-100 group-hover:text-amber-200'
              }
            `}>
              Admin
            </span>
          </div>
        </Link>
      )}
    </div>
  );

  const TabletNavigation = () => (
    <div className="hidden md:grid lg:hidden grid-cols-3 gap-3 max-w-2xl mx-auto">
      {navigationItems.map((item) => (
        <Link key={item.name} href={item.url}>
          <div className={`
            flex items-center gap-3 p-3 rounded-lg transition-all duration-300 touch-target
            ${router.pathname === item.url 
              ? 'bg-amber-400/20 border border-amber-300 text-amber-200' 
              : 'bg-emerald-700/30 border border-emerald-600 text-amber-100 hover:bg-amber-400/10'
            }
          `}>
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-body text-sm font-semibold truncate">
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #fefcf7 0%, #f0fdf4 50%, #ecfdf5 100%)'
    }}>
      {/* Mobile Navigation Component */}
      <MobileNavigation />

      {/* Mobile-First Header */}
      <header className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 shadow-2xl relative overflow-hidden">
        {/* Decorative Borders */}
        <div className="absolute top-0 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"></div>
        
        <div className="mobile-container py-4 md:py-8 relative">
          {/* Mobile Header Bar */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="touch-target text-amber-100 hover:text-amber-300 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Mobile Authentication */}
            {!loading && (
              <div>
                {user ? (
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <Crown className="w-5 h-5 text-amber-400" />
                    ) : (
                      <User className="w-5 h-5 text-emerald-300" />
                    )}
                    <span className="font-body text-sm text-amber-100 truncate max-w-[120px]">
                      {user.email.split('@')[0]}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-400/20 border border-amber-300 text-amber-100 text-sm touch-target"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-body font-semibold">Login</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Club Title - Mobile First */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex justify-center mb-2 md:mb-4">
              <Crown className="w-8 h-8 md:w-12 md:h-12 text-amber-300" />
            </div>
            
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-100 tracking-wider edwardian-text-shadow mb-2">
              Nederlandse Bond der Croquet
            </h1>
            
            <div className="flex items-center justify-center gap-2 md:gap-4 text-amber-200">
              <div className="h-px bg-amber-400 w-8 md:w-16"></div>
              <p className="font-body text-sm md:text-xl italic">Established MDCCCLXXXXVIII</p>
              <div className="h-px bg-amber-400 w-8 md:w-16"></div>
            </div>
            
            <p className="font-body text-amber-300 text-xs md:text-sm mt-2 tracking-widest">
              "HONOR • TRADITION • EXCELLENCE"
            </p>
          </div>
          
          {/* Desktop Authentication - Hidden on Mobile */}
          {!loading && (
            <div className="hidden md:block absolute top-6 right-6">
              {user ? (
                <div className="card-edwardian px-4 py-3 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <Crown className="w-5 h-5 text-amber-600" />
                    ) : (
                      <User className="w-5 h-5 text-emerald-600" />
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
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors border border-red-200 touch-target"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="btn-edwardian rounded-lg flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-body font-semibold">Member Login</span>
                </button>
              )}
            </div>
          )}
          
          {/* Responsive Navigation */}
          <nav className="relative">
            <DesktopNavigation />
            <TabletNavigation />
          </nav>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="mobile-container py-6 md:py-12 max-w-7xl mx-auto">
        <div className="card-edwardian overflow-hidden min-h-[400px] md:min-h-[600px]">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile-First Footer */}
      <footer className="mt-8 md:mt-16 bg-gradient-to-t from-emerald-900 via-emerald-800 to-emerald-900 text-amber-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"></div>
        
        <div className="mobile-container py-8 md:py-12 relative">
          <div className="text-center space-y-4 md:space-y-6">
            <div className="footer-divider max-w-xs md:max-w-md mx-auto"></div>
            
            <div className="space-y-2 md:space-y-4">
              <p className="font-display text-lg md:text-2xl font-bold text-amber-200 edwardian-text-shadow">
                "In the Noble Pursuit of Precision and Strategy"
              </p>
              <div className="flex items-center justify-center gap-2 md:gap-4 text-amber-300">
                <div className="h-px bg-amber-400 w-8 md:w-12"></div>
                <Crown className="w-4 h-4 md:w-6 md:h-6" />
                <div className="h-px bg-amber-400 w-8 md:w-12"></div>
              </div>
            </div>
            
            <div className="space-y-1 md:space-y-2 text-amber-300">
              <p className="font-body text-base md:text-lg">
                © {new Date().getFullYear()} Nederlandse Bond der Croquet
              </p>
              <p className="font-body text-xs md:text-sm">
                Preserving the Traditions of Sport • Upholding the Code of Honour
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400"></div>
      </footer>
    </div>
  );
}