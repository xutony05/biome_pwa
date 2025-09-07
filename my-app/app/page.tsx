"use client";

import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to profile
        router.push("/profile");
      } else {
        // User is not logged in, redirect to login
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">PurelyBiome</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // This should not render as we redirect immediately
  return null;
}
