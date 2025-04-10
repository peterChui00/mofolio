import { AppStoreProvider } from '@/components/providers/app-store-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import UserAuthProvider from '@/components/providers/user-auth-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppStoreProvider>
        {children}
        <UserAuthProvider />
      </AppStoreProvider>
    </ThemeProvider>
  );
}
