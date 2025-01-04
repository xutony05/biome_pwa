import localFont from 'next/font/local'

export const montreal = localFont({
  src: [
    {
    path: './fonts/PPNeueMontreal-Thin.woff2',
    weight: '200',
    style: 'normal',
    },
    {
      path: './fonts/PPNeueMontreal-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/PPNeueMontreal-BookItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/PPNeueMontreal-Regular.woff2',
      weight: '450',
      style: 'normal',
    },
    {
      path: './fonts/PPNeueMontreal-Italic.woff2',
      weight: '450',
      style: 'italic',
    },
    {
      path: './fonts/PPNeueMontreal-Medium.woff2',
      weight: '530',
      style: 'normal',
    },
    {
      path: './fonts/PPNeueMontreal-MediumItalic.woff2',
      weight: '530',
      style: 'italic',
    },
    {
      path: './fonts/PPNeueMontreal-SemiBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/PPNeueMontreal-SemiBolditalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/PPNeueMontreal-Bold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/PPNeueMontreal-BoldItalic.woff2',
      weight: '800',
      style: 'italic',
    },
  ],
  variable: '--font-montreal',
  display: 'swap',
  preload: true,
})

export const fontClass = montreal.className
export const fontVariable = montreal.variable 