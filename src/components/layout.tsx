// src/components/Layout.tsx - App Router Compatible Layout with Better Error Handling
'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Trophy, BookOpen, Crown, Mail, Users, Settings, Shield, 
  LogIn, LogOut, User, Menu, X, ChevronRight 
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  
  // Automatically determine current page name
  const getCurrentPageName = () => {
    switch (pathname) {
      case '/': return 'Welcome'
      case '/rules': return 'Rules'
      case '/tournaments': return 'Tournaments'
      case '/championships': return 'Championships'
      case '/newsletter': return 'Newsletter'
      case '/members': return 'Members'
      case '/administration': return 'Administration Dashboard'
      default: return 'Nederlandse Bond der Clubs'
    }
  }

  const currentPageName = getCurrentPageName()
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

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
        // API exists but user not authenticated
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      // API doesn't exist or network error - fail gracefully
      console.log('Authentication API not available:', error);
      setUser(null);
      setIsAdmin(false);
      // Don't throw the error - just continue without authentication
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
        window.location.href = '/login';
      }
    } catch (error) {
      // If logout API fails, just clear local state
      console.log('Logout API not available:', error);
      setUser(null);
      setIsAdmin(false);
      setMobileMenuOpen(false);
      window.location.href = '/login';
    }
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    window.location.href = '/login';
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
                ${pathname === item.url 
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
                ${pathname === '/administration' 
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
                  <Shield className="w-8 h-8 text-amber-300" />
                ) : (
                  <User className="w-8 h-8 text-amber-300" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-amber-100 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="font-body text-xs text-amber-300">
                    {isAdmin ? 'Administrator' : 'Member'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-amber-100 rounded-lg transition-colors touch-target"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-body font-semibold">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-500 text-emerald-900 rounded-lg transition-colors touch-target"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-body font-semibold">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </>
  );

  const DesktopNavigation = () => (
    <div className="hidden lg:flex lg:items-center lg:gap-8">
      {navigationItems.map((item) => (
        <Link key={item.name} href={item.url}>
          <div className={`
            group flex flex-col items-center justify-center p-4 rounded-xl 
            transition-all duration-300 cursor-pointer relative overflow-hidden touch-target
            ${pathname === item.url 
              ? 'bg-amber-400/20 border-2 border-amber-300 transform scale-105' 
              : 'bg-emerald-700/30 border-2 border-emerald-600 hover:bg-amber-400/10 hover:border-amber-400 hover:scale-105'
            }
          `}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full mb-2
              transition-all duration-300 relative z-10
              ${pathname === item.url 
                ? 'bg-amber-300 text-emerald-900 scale-110' 
                : 'bg-emerald-600/50 text-amber-100 group-hover:bg-amber-400/30 group-hover:text-amber-200 group-hover:scale-110'
              }
            `}>
              <item.icon className="w-6 h-6" />
            </div>
            
            <span className={`
              font-body text-sm font-semibold tracking-wide relative z-10
              transition-colors duration-300 text-center
              ${pathname === item.url 
                ? 'text-amber-200' 
                : 'text-amber-100 group-hover:text-amber-200'
              }
            `}>
              {item.name}
            </span>
          </div>
        </Link>
      ))}

      {/* DESKTOP ADMIN PANEL */}
      {isAdmin && (
        <Link href="/administration">
          <div className={`
            group flex flex-col items-center justify-center p-4 rounded-xl 
            transition-all duration-300 cursor-pointer relative overflow-hidden touch-target
            ${pathname === '/administration' 
              ? 'bg-amber-400/20 border-2 border-amber-300 transform scale-105' 
              : 'bg-emerald-700/30 border-2 border-emerald-600 hover:bg-amber-400/10 hover:border-amber-400 hover:scale-105'
            }
          `}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-full mb-2
              transition-all duration-300 relative z-10
              ${pathname === '/administration' 
                ? 'bg-amber-300 text-emerald-900 scale-110' 
                : 'bg-emerald-600/50 text-amber-100 group-hover:bg-amber-400/30 group-hover:text-amber-200 group-hover:scale-110'
              }
            `}>
              <Settings className="w-6 h-6" />
            </div>
            
            <span className={`
              font-body text-sm font-semibold tracking-wide relative z-10
              transition-colors duration-300
              ${pathname === '/administration' 
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
            ${pathname === item.url 
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
                      <Shield className="w-5 h-5 text-amber-300" />
                    ) : (
                      <User className="w-5 h-5 text-amber-300" />
                    )}
                    <span className="font-body text-sm text-amber-100 truncate max-w-24">
                      {user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-amber-100 hover:text-amber-300 transition-colors touch-target"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-1 text-amber-100 hover:text-amber-300 transition-colors touch-target"
                    aria-label="Sign in"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-body text-sm">Sign In</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main Header Content */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-amber-300" />
              <div className="text-left">
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-amber-100 leading-tight">
                  Nederlandse Bond der Clubs
                </h1>
                <p className="font-body text-sm md:text-lg text-amber-300 mt-2">
                  Croquet Nederland • Established 1898
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Authentication - Top Right */}
          <div className="hidden md:block absolute top-6 right-8">
            {!loading && (
              <div>
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-emerald-700/50 rounded-lg px-3 py-2">
                      {isAdmin ? (
                        <Shield className="w-5 h-5 text-amber-300" />
                      ) : (
                        <User className="w-5 h-5 text-amber-300" />
                      )}
                      <div className="text-right">
                        <p className="font-body text-sm text-amber-100 font-semibold">
                          {user.name || user.email}
                        </p>
                        <p className="font-body text-xs text-amber-300">
                          {isAdmin ? 'Administrator' : 'Member'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-amber-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-body text-sm font-semibold">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-900 px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-body text-sm font-semibold">Sign In</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Page Title */}
          {currentPageName && (
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-amber-200">
                {currentPageName}
              </h2>
            </div>
          )}

          {/* Navigation - Responsive */}
          <nav className="mt-8">
            <DesktopNavigation />
            <TabletNavigation />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-container py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-amber-100 py-8 md:py-12">
        <div className="mobile-container text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-amber-300" />
            <div>
              <h3 className="font-display text-lg font-bold">Nederlandse Bond der Clubs</h3>
              <p className="font-body text-sm text-amber-300">Est. 1898</p>
            </div>
          </div>
          <p className="font-body text-sm text-amber-300">
            Preserving the traditions of croquet in the Netherlands
          </p>
        </div>
      </footer>

      {/* Mobile Navigation Styles */}
      <style jsx global>{`
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-nav-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-nav-menu {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 320px;
          max-width: 90vw;
          background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .mobile-nav-menu.active {
          transform: translateX(0);
        }

        .mobile-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        @media (min-width: 768px) {
          .mobile-container {
            padding: 0 2rem;
          }
        }

        .touch-target {
          min-height: 44px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
  }