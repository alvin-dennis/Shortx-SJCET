"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { LinkIcon, LogIn, LogOut, Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const setupAuthListener = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Auth error:", error);
        setLoading(false);
      }
    };

    setupAuthListener();
  }, [supabase, pathname]);

  const handleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh(); 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full border-b border-white/10 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-xl backdrop-saturate-150 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link
          href="/"
          className="flex items-center group transition-all duration-300 ease-in-out"
        >
          <LinkIcon className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-white group-hover:to-blue-400 transition-all duration-300">
            ShortX
          </span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          {!loading && user && (
            <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white animate-in fade-in slide-in-from-top-4 duration-700">
                Welcome, {user.user_metadata?.name || "User"}!
              </span>
            </div>
          )}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && user ? (
              <>
                <Link href="/shorten">
                  <Button
                    variant="ghost"
                    className="relative group px-4 py-2 overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300"
                  >
                    <span className="relative z-10 text-white/90 group-hover:text-white transition-colors cursor-pointer">
                      Shorten URL
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="relative group px-4 py-2 overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300"
                  >
                    <span className="relative z-10 text-white/90 group-hover:text-white transition-colors cursor-pointer">
                      Dashboard
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300" />
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : !loading ? (
              <Button
                onClick={handleSignIn}
                className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            ) : (
              <div className="h-10 w-24 bg-white/5 animate-pulse rounded-md"/>
            )}
          </div>

          <Button
            variant="ghost"
            className="md:hidden hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setMobileMenuOpen(false);
            }}
          />
          <div className="absolute top-16 left-0 right-0 z-20 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top duration-300">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {!loading && user ? (
                <>
                  <Link href="/shorten" className="block px-3 py-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shorten URL
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="block px-3 py-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <div className="px-3 py-2">
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="w-full justify-start hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : !loading ? (
                <div className="px-3 py-2">
                  <Button
                    onClick={() => {
                      handleSignIn();
                      setMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <div className="h-10 w-full bg-white/5 animate-pulse rounded-md"/>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
