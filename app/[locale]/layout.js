import './globals.css';
import { Inter } from 'next/font/google';
import i18nConfig from '@/i18nConfig';
import { dir } from 'i18next';
import theme from '@/theme';
import { ThemeProvider } from '@mui/material/styles';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale} dir={dir(locale)}>

      <ThemeProvider theme={theme}>
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}