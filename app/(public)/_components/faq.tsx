import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "./primitives";

const faqs = [
  {
    q: "Do clients need an account?",
    a: "No. They open the link and start. There is no signup, no password and no app to install. The link is unique to that client and can be expired at any time.",
  },
  {
    q: "Where are my files stored?",
    a: "In your own Google Drive. DocFetch receives the upload, files it into the folder you chose for that template, and keeps a reference. You can disconnect at any time and the files stay where they are.",
  },
  {
    q: "Can I customize templates?",
    a: "Every template is fully editable. Rename items, change field types, mark items required or optional, reorder them, add instructions per item, and save the result as your own template.",
  },
  {
    q: "Can I request images?",
    a: "Yes. Image uploads accept photos straight from a phone camera roll, and you can set minimum dimensions or accepted formats per item.",
  },
  {
    q: "Can I request written answers, not just files?",
    a: "Yes. Short text, long text, dates, links, multiple choice and yes/no questions sit in the same checklist as file uploads, so you are not running a form and a folder in parallel.",
  },
  {
    q: "How does the Google Drive connection work?",
    a: "Connect your Google account once, pick a base folder, and set a naming pattern such as /Clients/{client}/Intake. DocFetch creates subfolders per client as requests come in. Nothing is copied out of your Drive.",
  },
  {
    q: "What happens when a client finishes?",
    a: "Reminders stop, you get a single notification, the request is marked complete on your dashboard, and the files are already filed. Nothing is left for you to sort.",
  },
  {
    q: "Does it work for accounting and tax work?",
    a: "Yes — tax preparation, bookkeeping setup and year-end document collection are among the most used templates. Items can be marked required so a return is never started with a missing form.",
  },
  {
    q: "Does it work for agencies?",
    a: "Yes. Agencies typically run one template per service, assign requests to account managers, and track everything outstanding on a shared dashboard.",
  },
];

export function Faq() {
  return (
    <Section id="faq" className="border-y border-border bg-surface">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions people ask before their first request"
          description="Still unsure whether it fits your workflow? Start a trial and send one real request — that answers it faster than we can."
        />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="border-border"
            >
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
