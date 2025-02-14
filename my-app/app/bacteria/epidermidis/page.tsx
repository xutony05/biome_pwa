import { Card } from "@/components/ui/card";

export default function EpidermidisPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Staphylococcus epidermidis</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is S. epidermidis?</h2>
              <p className="text-muted-foreground">
                S. epidermidis is one of the most important beneficial bacteria on your skin. 
                It's like a protective shield that lives naturally on your skin's surface and 
                helps maintain skin health. This bacteria is crucial for keeping your skin's 
                natural defense system strong.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 15-30%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, S. epidermidis:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Creates a protective barrier on your skin</li>
                    <li>Helps fight off harmful bacteria</li>
                    <li>Supports your skin's moisture balance</li>
                    <li>Keeps your skin ecosystem healthy</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May overwhelm other beneficial bacteria</li>
                  <li>Could lead to skin barrier disruption</li>
                  <li>Might cause skin sensitivity</li>
                  <li>Can create an imbalanced skin environment</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin loses its main protective bacteria</li>
                  <li>Makes it easier for harmful bacteria to grow</li>
                  <li>Can lead to dry or dehydrated skin</li>
                  <li>Might weaken your skin's natural defenses</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
