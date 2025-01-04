# Layout System Documentation

## Overview
The application uses a two-tier layout system to handle different page requirements:
- Fixed Layout: For non-scrollable pages (login, modals)
- Scrollable Layout: For content-heavy pages with fixed elements (home, feed)

## Layout Structure

## Usage Guidelines
1. Fixed Layout:
   - Use for authentication pages
   - Use for modal-like pages
   - Content is centered and non-scrollable
   - Handles safe area padding
   - Example implementation:
     ```tsx
     <FixedLayout>
       <main className="flex items-center justify-center h-full">
         {/* Your content here */}
       </main>
     </FixedLayout>
     ```

2. Scrollable Layout:
   - Use for content-heavy pages
   - Supports both top and bottom fixed elements
   - Handles native-like scrolling
   - Example implementation:
     ```tsx
     <ScrollableLayout 
       topNav={<TopNav />}
       bottomNav={<BottomNav />}
     >
       <div className="flex flex-col gap-4">
         {/* Your scrollable content here */}
       </div>
     </ScrollableLayout>
     ```

## CSS Structure

1. Safe Area Variables:
   ```css
   :root {
     --sat: env(safe-area-inset-top);
     --sab: env(safe-area-inset-bottom);
     --sal: env(safe-area-inset-left);
     --sar: env(safe-area-inset-right);
   }
   ```

2. Layout Utilities:
   ```css
   .fixed-layout {
     padding: var(--sat) var(--sar) var(--sab) var(--sal);
     height: 100vh;
     display: flex;
     flex-direction: column;
   }

   .scrollable-content {
     -webkit-overflow-scrolling: touch;
     scrollbar-width: none;
     padding: var(--sat) var(--sar) var(--sab) var(--sal);
   }
   ```

## Best Practices

1. Height Management:
   - Use `h-full` instead of `min-h-screen` in child elements
   - Let the layout components handle viewport heights
   - Maintain proper height inheritance

2. Safe Areas:
   - Never hard-code padding for device edges
   - Always use safe area variables
   - Consider different devices and orientations

3. Scrolling:
   - Use ScrollableLayout for any content that might overflow
   - Add proper bottom padding for fixed navigation
   - Hide scrollbars while maintaining functionality

4. Fixed Elements:
   - Use topNav/bottomNav props for fixed navigation
   - Consider content padding based on fixed elements
   - Use CSS variables for consistent nav heights
   - Maintain proper z-index layering
   - Add background colors to fixed elements for content overlap
