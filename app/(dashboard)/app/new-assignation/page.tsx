import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { NewAssignationStepper } from "./_components/new-assignation-stepper";

const NewAssignationPage: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="New assignation"
        description={
          "Build a checklist and send a secure upload link to your clients."
        }
      />
      <NewAssignationStepper />
    </div>
  );
};

export default NewAssignationPage;
