"use client";

import {
  LegalLayout,
  Section,
  Paragraph,
  BulletList,
} from "@/components/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="February 2026">
      <Paragraph>
        Bookendd (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
        This policy explains how we collect, use, and safeguard your information
        when you use our mobile app and website.
      </Paragraph>

      <Section title="Information We Collect">
        <Paragraph>We collect information you provide directly:</Paragraph>
        <BulletList
          items={[
            "Account information: email address, username, display name, and profile photo",
            "Reading logs: books you've read, ratings, and single-word descriptors",
            "Profile content: bio and favorite books you choose to display",
          ]}
        />
        <Paragraph>We automatically collect:</Paragraph>
        <BulletList
          items={[
            "Usage data: app interactions, features used, and navigation patterns",
            "Device information: device type, operating system, and app version",
            "Error reports: crash logs and performance data to improve the app",
          ]}
        />
      </Section>

      <Section title="How We Use Your Information">
        <BulletList
          items={[
            "Provide and maintain the Bookendd service",
            "Display your public profile and reading activity",
            "Analyze usage patterns to improve the app",
            "Send important service updates (not marketing)",
            "Detect and prevent abuse or violations of our terms",
          ]}
        />
      </Section>

      <Section title="Third-Party Services">
        <Paragraph>
          We use trusted third-party services to operate Bookendd:
        </Paragraph>
        <BulletList
          items={[
            "Clerk: Authentication and account management",
            "PostHog: Privacy-friendly analytics",
            "Cloudinary: Profile image storage and delivery",
            "Sentry: Error tracking and performance monitoring",
            "OpenLibrary: Book metadata and cover images",
          ]}
        />
        <Paragraph>
          These services have their own privacy policies and may collect data as
          described in their respective policies.
        </Paragraph>
      </Section>

      <Section title="Data Sharing">
        <Paragraph>
          We do not sell your personal information. We share data only:
        </Paragraph>
        <BulletList
          items={[
            "When you make your profile public (username, books, ratings, words)",
            "With service providers who help operate Bookendd",
            "If required by law or to protect rights and safety",
          ]}
        />
      </Section>

      <Section title="Your Rights">
        <Paragraph>You can:</Paragraph>
        <BulletList
          items={[
            "Access and update your profile information anytime",
            "Delete your account and associated data",
            "Export your reading history",
            "Contact us with privacy questions or concerns",
          ]}
        />
      </Section>

      <Section title="Data Retention">
        <Paragraph>
          We retain your data while your account is active. If you delete your
          account, we remove your personal information within 30 days, except
          where retention is required by law.
        </Paragraph>
      </Section>

      <Section title="Contact">
        <Paragraph>
          Questions about this policy? Contact us at privacy@bookendd.com
        </Paragraph>
      </Section>
    </LegalLayout>
  );
}
