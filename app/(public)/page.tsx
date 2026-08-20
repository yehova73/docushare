import type { Metadata } from "next";
import { MobileStickyCta } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { SocialProof } from "./_components/social-proof";
import { ProblemSection } from "./_components/problem";
import { HowItWorks } from "./_components/how-it-works";
import { Features } from "./_components/features";
import { Walkthrough } from "./_components/walkthrough";
import { Templates } from "./_components/templates";
import { ClientExperience } from "./_components/client-experience";
import { Comparison } from "./_components/comparison";
import { DriveIntegration } from "./_components/drive-integration";
import { Faq } from "./_components/faq";
import { Pricing } from "./_components/pricing";
import { FinalCta } from "./_components/final-cta";

export const metadata: Metadata = {
  title: "DocFetch. Collect client files with one checklist link",
  description:
    "Send one secure link, let clients upload files, images, text and links with no account, get automatic reminders, and have everything organized in your Google Drive.",
};

export default function Home() {
  return (
    <>
      <Hero />
      {/* <SocialProof /> */}
      <ProblemSection />

      <HowItWorks />
      <Features />
      <Walkthrough />
      <Templates />
      <ClientExperience />
      <DriveIntegration />
      <Comparison />
      {/* <Testimonials /> */}
      <Faq />
      <Pricing />
      <FinalCta />

      <MobileStickyCta />
    </>
  );
}
