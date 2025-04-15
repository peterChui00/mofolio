import { AppStoreProvider } from '@/components/providers/app-store-provider';
import QueryProvider from '@/components/providers/query-provider';
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
        <QueryProvider>{children}</QueryProvider>
        <UserAuthProvider />
      </AppStoreProvider>
    </ThemeProvider>
  );
}
