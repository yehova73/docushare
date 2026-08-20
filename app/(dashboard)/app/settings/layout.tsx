import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { SettingsTabs } from "./_components/settings-tabs";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Manage your account and preferences"
      />
      <SettingsTabs />
      {children}
    </div>
  );
};

export default Layout;
