import { getCurrentSubscriptionAction } from "@/actions/account/subscriptions/get-current-subscription";
import { PricingCards } from "./_components/pricing-cards";
import { Invoices } from "./_components/invoices";
import { CurrentSubscriptionStatus } from "./_components/current-subscription-status";
import { getInvoicesAction } from "@/actions/account/subscriptions/get-invoices";

const BillingPage = async () => {
  const sub = await getCurrentSubscriptionAction();
  const invoices = await getInvoicesAction();

  return (
    <div className="max-w-7xl mx-auto w-full">
      <CurrentSubscriptionStatus subscription={sub} />
      <PricingCards subscription={sub} />
      <Invoices initialPage={invoices} />
    </div>
  );
};

export default BillingPage;
