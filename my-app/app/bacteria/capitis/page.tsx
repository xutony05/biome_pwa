import { Card } from "@/components/ui/card";

export default function CapitisPage() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Staphylococcus capitis</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is S. capitis?</h2>
              <p className="text-muted-foreground">
                S. capitis is a friendly bacteria commonly found on human skin, especially on the scalp 
                and face. It's one of the good bacteria that helps keep your skin healthy by working 
                with other beneficial bacteria to maintain a balanced skin environment.
              </p>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: 5-15%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, S. capitis:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Helps protect your skin from harmful bacteria</li>
                    <li>Supports your skin's natural defense system</li>
                    <li>Helps maintain a healthy skin environment</li>
                  </ul>
                </p>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May take up too much space from other good bacteria</li>
                  <li>Could cause skin to become more sensitive</li>
                  <li>Might lead to an unbalanced skin environment</li>
                  <li>Can affect how your skin feels and looks</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin might become more vulnerable to unwanted bacteria</li>
                  <li>Could reduce your skin's natural protection</li>
                  <li>May affect how well your skin maintains itself</li>
                  <li>Might impact overall skin health</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
