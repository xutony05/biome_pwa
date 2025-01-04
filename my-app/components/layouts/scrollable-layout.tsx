interface ScrollableLayoutProps {
  children: React.ReactNode;
  topNav?: React.ReactNode;  // Optional top navigation
  bottomNav?: React.ReactNode;  // Optional bottom navigation
}

/**
 * ScrollableLayout: A layout component for scrollable pages with fixed elements
 * 
 * CSS Classes Explained:
 * - scrollable-layout: 
 *   - h-screen: Full viewport height
 *   - overflow-hidden: Contains scrollable content
 *   - relative: Creates stacking context for fixed elements
 * 
 * - scrollable-content:
 *   - h-full: Takes full height of parent
 *   - overflow-y-auto: Enables vertical scrolling
 *   - Custom utility that:
 *     - Adds padding for safe areas
 *     - Enables smooth scrolling on iOS
 *     - Hides scrollbars
 * 
 * - fixed-nav-top (when topNav is provided):
 *   - fixed: Positions nav fixed on screen
 *   - top-0, left-0, right-0: Anchors to top edge
 *   - Custom utility that adds top safe area padding
 *   - z-10: Ensures nav stays above content
 * 
 * - fixed-nav-bottom (when bottomNav is provided):
 *   - fixed: Positions nav fixed on screen
 *   - bottom-0, left-0, right-0: Anchors to bottom edge
 *   - Custom utility that adds bottom safe area padding
 *   - z-10: Ensures nav stays above content
 */
export function ScrollableLayout({ 
  children, 
  topNav, 
  bottomNav 
}: ScrollableLayoutProps) {
  return (
    <div className="scrollable-layout h-screen overflow-hidden relative">
      {topNav && (
        <nav className="fixed-nav-top fixed top-0 left-0 right-0 z-10 bg-background">
          {topNav}
        </nav>
      )}
      
      <main className={`
        scrollable-content 
        h-full 
        overflow-y-auto
        ${topNav ? 'pt-[var(--header-height)]' : ''}
        ${bottomNav ? 'pb-[var(--footer-height)]' : ''}
      `}>
        {children}
      </main>

      {bottomNav && (
        <nav className="fixed-nav-bottom fixed bottom-0 left-0 right-0 z-10 bg-background">
          {bottomNav}
        </nav>
      )}
    </div>
  );
} 