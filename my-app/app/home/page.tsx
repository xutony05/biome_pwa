import { ScrollableLayout } from "@/components/layouts/scrollable-layout";
import { BottomNav } from "@/components/navigation/bottom-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <ScrollableLayout bottomNav={<BottomNav />}>
      <div className="flex flex-col gap-4 pb-20">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, User!</CardTitle>
            <CardDescription>Here's your skin health overview</CardDescription>
          </CardHeader>
        </Card>

        {/* Test Kit Card */}
        <Card>
          <CardHeader>
            <CardTitle>Got your test kit?</CardTitle>
            <CardDescription>Start your skin analysis journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Activate your kit or start swabbing</p>
          </CardContent>
        </Card>

        {/* Skin Health Card */}
        <Card>
          <CardHeader>
            <CardTitle>Skin Health Index</CardTitle>
            <CardDescription>Your current skin metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Biological Age: 25</p>
              <p>Microbiome Balance: 85%</p>
            </div>
          </CardContent>
        </Card>

        {/* Reports Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>Recent skin analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No reports available yet</p>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>Products matched to your skin type</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View your custom product suggestions</p>
          </CardContent>
        </Card>

        {/* Education Card */}
        <Card>
          <CardHeader>
            <CardTitle>Skin Health Education</CardTitle>
            <CardDescription>Learn about your microbiome</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Discover how your skin ecosystem works</p>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment Progress</CardTitle>
            <CardDescription>Track your skin journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View your improvement over time</p>
          </CardContent>
        </Card>

        {/* Community Card */}
        <Card>
          <CardHeader>
            <CardTitle>Community Insights</CardTitle>
            <CardDescription>Learn from others like you</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Connect with the Biome community</p>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Skin Tips</CardTitle>
            <CardDescription>Optimize your routine</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Get personalized skincare advice</p>
          </CardContent>
        </Card>
      </div>
    </ScrollableLayout>
  );
}
