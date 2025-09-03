'use client';

import { Button } from "./button";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { logout } from "@/app/lib/auth";
import { ArrowLeft, LogOut, Home, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showUserActions?: boolean;
  customActions?: React.ReactNode;
  className?: string;
}

export function Header({ 
  title, 
  showBackButton = false, 
  showLogo = true,
  showUserActions = true,
  customActions,
  className = ""
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleHomeClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/');
    }
  };

  const isHomePage = pathname === '/' || pathname === '/profile';

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 ${className}`}>
      {/* Safe area padding for mobile */}
      <div className="h-safe-area-inset-top bg-white" />
      
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {showBackButton && !isHomePage && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBack}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {showLogo && (
            <Link href={user ? '/profile' : '/'} className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/orb.png"
                  alt="PurelyBiome"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">PurelyBiome</span>
            </Link>
          )}
          
          {title && !showLogo && (
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {customActions}
          
          {showUserActions && user && (
            <>
              {!isHomePage && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleHomeClick}
                  className="h-10 w-10"
                >
                  <Home className="h-5 w-5" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
          
          {showUserActions && !user && pathname !== '/login' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Specialized header variants for common use cases
export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <Header 
      title={title}
      showBackButton={true}
      showLogo={false}
      customActions={children}
    />
  );
}

export function AuthHeader() {
  return (
    <Header 
      showLogo={true}
      showUserActions={false}
    />
  );
}

export function MainHeader() {
  return (
    <Header 
      showLogo={true}
      showUserActions={true}
    />
  );
}
