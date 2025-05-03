import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
        Profile
      </h2>
    </div>
  );
}
