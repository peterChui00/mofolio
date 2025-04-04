import Link from 'next/link';

import { loginWithGoogle } from '@/lib/supabase/action';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Icons.logo />
              </div>
              <span className="sr-only">Mofolio</span>
            </Link>
            <h1 className="text-2xl font-bold">Login to Mofolio</h1>
          </div>

          <Button variant="outline" className="w-full" disabled>
            <Icons.apple className="mr-1" />
            Continue with Apple
          </Button>
          <Button
            variant="outline"
            className="w-full"
            type="submit"
            formAction={loginWithGoogle}
          >
            <Icons.google className="mr-1" />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full" disabled>
            <Icons.microsoft className="mr-1" />
            Continue with Microsoft
          </Button>
        </div>
      </form>

      <div className="text-muted-foreground [&_a]:hover:text-primary mt-auto text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By continuing, you agree to our <Link href="#">Terms of Service</Link>{' '}
        and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
