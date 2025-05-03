import { Metadata } from 'next';

import SettingsSidebar from '@/components/layout/settings-sidebar';
import ProfilePage from '@/app/(main-app)/settings/profile/page';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  return (
    <>
      <div className="display-eq-sm">
        <SettingsSidebar className="w-full" />
      </div>
      <div className="display-gt-sm">
        <ProfilePage />
      </div>
    </>
  );
}
