import type { Metadata } from "next";
import { company } from "@/content/en";
import { privacy } from "@/content/legal";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Rubics Realty collects, uses and protects personal information shared through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy." label="Legal" sections={privacy}>
      <p className="plaque mb-10 text-sm">
        Enquiry forms on this site collect your name, phone number and, optionally, your email, preferred configuration, preferred visit slot and
        message. We use them only to respond to your enquiry. To withdraw consent or ask for your details to be deleted, write to{" "}
        <a href={`mailto:${company.salesEmail}`} className="underline underline-offset-4">
          {company.salesEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
