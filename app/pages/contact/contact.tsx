import { WebLayout } from "@/components/layouts/web-layout";
import { PageLayout } from "@/components/page-layout";
import { ContactForm } from "@/components/contact-form";
import { ContactInfo } from "@/components/contact-info";

export function Contacts() {
  return (
    <WebLayout>
      <PageLayout title="Get in Touch">
        <div className="flex justify-center">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 p-4 md:p-6">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </PageLayout>
    </WebLayout>
  );
}
