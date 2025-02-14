import { Card } from "@/components/ui/card";

export default function StriatumPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Corynebacterium striatum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. striatum?</h2>
              <p className="text-muted-foreground">
                C. striatum is a naturally occurring bacteria found on human skin. It plays a key role 
                in maintaining skin health by working with other bacteria to create a balanced environment. 
                Think of it as part of your skin's protective team that helps keep your skin healthy.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 1-10%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, C. striatum:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Helps protect your skin's natural barrier</li>
                    <li>Works with other good bacteria to keep skin balanced</li>
                    <li>Supports overall skin health</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can crowd out other helpful bacteria your skin needs</li>
                  <li>May lead to dry or irritated skin</li>
                  <li>Could make your skin more sensitive</li>
                  <li>Might disrupt your skin's natural balance</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin might lose some of its natural protection</li>
                  <li>Could allow unwanted bacteria to grow more easily</li>
                  <li>May affect how well your skin maintains its health</li>
                  <li>Might make your skin more easily irritated</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
