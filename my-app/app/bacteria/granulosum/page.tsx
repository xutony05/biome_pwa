import { Card } from "@/components/ui/card";

export default function GranulosumPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium granulosum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. granulosum?</h2>
              <p className="text-muted-foreground">
                C. granulosum is a beneficial skin bacteria that's part of your skin's natural 
                microbiome. It's particularly active in sebum-rich areas of your skin, where it 
                helps process skin oils and maintains a healthy balance with other bacteria. 
                While less common than C. acnes, it plays a unique role in skin health.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 1-10%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, C. granulosum:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Helps process natural skin oils</li>
                    <li>Supports balanced oil production</li>
                    <li>Contributes to overall skin health</li>
                    <li>Works with other bacteria to maintain skin balance</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May affect how your skin processes oils</li>
                  <li>Could lead to increased skin sensitivity</li>
                  <li>Might disrupt the balance with other bacteria</li>
                  <li>Can impact overall skin comfort</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Could affect how well your skin manages oils</li>
                  <li>May create gaps in your skin's bacterial community</li>
                  <li>Might impact your skin's natural processes</li>
                  <li>Can contribute to an unbalanced skin environment</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
