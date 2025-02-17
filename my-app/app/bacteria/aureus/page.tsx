import { Card } from "@/components/ui/card";

export default function AureusPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Staphylococcus aureus</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is S. aureus?</h2>
              <p className="text-muted-foreground">
                S. aureus is a complex member of the skin microbiome that requires careful monitoring. 
                While it can be found naturally on human skin, its presence needs to be strictly 
                regulated. Unlike many other skin bacteria, S. aureus is best kept at very low levels 
                to maintain skin health.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 0-1%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, S. aureus:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Remains in check by other beneficial bacteria</li>
                    <li>Coexists within a balanced microbiome</li>
                    <li>Doesn't interfere with skin health</li>
                    <li>Stays regulated by skin's natural defenses</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can significantly disrupt skin barrier function</li>
                  <li>May cause increased skin sensitivity and irritation</li>
                  <li>Could lead to various skin concerns</li>
                  <li>Often indicates an imbalanced microbiome</li>
                  <li>Might compete with beneficial bacteria</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Low</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  <li>This is actually good for your skin</li>
                  <li>Allows beneficial bacteria to thrive</li>
                  <li>Indicates a well-functioning skin barrier</li>
                  <li>Shows your skin's defense system is working</li>
                  <li>Supports overall skin health</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
