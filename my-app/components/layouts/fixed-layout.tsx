interface FixedLayoutProps {
  children: React.ReactNode;
}

/**
 * FixedLayout: A layout component for non-scrollable pages
 * 
 * CSS Classes Explained:
 * - fixed-layout: Custom utility class that:
 *   - Adds padding for device safe areas
 *   - Sets height to full viewport (100vh)
 *   - Uses flex layout for vertical content arrangement
 * 
 * - min-h-screen: Ensures minimum height is full viewport
 * - overflow-hidden: Prevents scrolling and bounce effects
 */
export function FixedLayout({ children }: FixedLayoutProps) {
  return (
    <div className="fixed-layout min-h-screen overflow-hidden">
      {children}
    </div>
  );
} 