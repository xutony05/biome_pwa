import { Card } from "@/components/ui/card";

export default function AvidumPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium avidum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. avidum?</h2>
              <p className="text-muted-foreground">
                C. avidum is a naturally occurring skin bacteria that's commonly found in areas 
                with many sweat glands. While less abundant than some other skin bacteria, it 
                plays a specific role in maintaining the balance of your skin's microbiome, 
                especially in moist areas of your skin.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 1-5%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, C. avidum:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Helps manage skin moisture levels</li>
                    <li>Contributes to skin's natural balance</li>
                    <li>Works with other bacteria to maintain healthy skin</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May cause skin to become too oily</li>
                  <li>Could lead to skin irritation</li>
                  <li>Might disrupt the balance of other bacteria</li>
                  <li>Can affect skin's moisture regulation</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Might affect how your skin handles moisture</li>
                  <li>Could create gaps in your skin's bacterial community</li>
                  <li>May impact local immune responses</li>
                  <li>Can lead to an imbalanced skin environment</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
