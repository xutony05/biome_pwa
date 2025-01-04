import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FixedLayout } from "@/components/layouts/fixed-layout";

export default function Page() {
  return (
    <FixedLayout>
      <main className="flex flex-col items-center justify-center h-full bg-background">
        <Link href="/login">
          <Button size="lg">Go to Login</Button>
        </Link>
        <Link href="/home">
          <Button size="lg" variant="outline">Go to Home</Button>
        </Link>
      </main>
    </FixedLayout>
  );
}
