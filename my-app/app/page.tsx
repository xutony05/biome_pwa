"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const routes = [
    { name: "Login", path: "/login" },
    { name: "Survey", path: "/survey" },
    { name: "Instructions", path: "/instructions" },
    { name: "Activation", path: "/activation" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <main className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Biome Test App</h1>
      
      <div className="w-full max-w-md space-y-4">
        {routes.map((route) => (
          <Button
            key={route.path}
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={() => router.push(route.path)}
          >
            {route.name}
          </Button>
        ))}
      </div>
    </main>
  );
}
