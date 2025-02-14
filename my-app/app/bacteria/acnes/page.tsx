import { Card } from "@/components/ui/card";

export default function AcnesPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium acnes</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. acnes?</h2>
              <p className="text-muted-foreground">
                C. acnes (formerly known as P. acnes) is one of the most common bacteria found on human skin. 
                It lives deep in your pores and helps maintain skin health by breaking down skin oils. 
                While it's a natural part of your skin's ecosystem, its balance is crucial for clear, healthy skin.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 35-55%</p>
                <p className="text-green-700 text-sm">
                  In this range, C. acnes helps maintain healthy skin by:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Breaking down excess oils</li>
                    <li>Supporting your skin's natural barrier</li>
                    <li>Protecting against harmful bacteria</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can trigger inflammation leading to acne breakouts</li>
                  <li>May cause excessive oil production in your skin</li>
                  <li>Could lead to clogged pores and blackheads</li>
                  <li>Might make skin more sensitive and reactive</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin might become more vulnerable to harmful bacteria</li>
                  <li>Could lead to an imbalanced skin microbiome</li>
                  <li>May affect your skin's natural oil regulation</li>
                  <li>Might result in dry or dehydrated skin</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
