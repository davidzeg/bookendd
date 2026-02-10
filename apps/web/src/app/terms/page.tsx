"use client";

import {
  LegalLayout,
  Section,
  Paragraph,
  BulletList,
} from "@/components/LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="February 2026">
      <Paragraph>
        Welcome to Bookendd. By using our app or website, you agree to these
        terms. Please read them carefully.
      </Paragraph>

      <Section title="Using Bookendd">
        <Paragraph>
          Bookendd is a platform for tracking and sharing your reading journey.
          You may use it for personal, non-commercial purposes.
        </Paragraph>
        <Paragraph>To use Bookendd, you must:</Paragraph>
        <BulletList
          items={[
            "Be at least 13 years old",
            "Provide accurate account information",
            "Keep your login credentials secure",
            "Follow our Community Guidelines",
          ]}
        />
      </Section>

      <Section title="Your Content">
        <Paragraph>
          You retain ownership of content you create on Bookendd, including
          ratings, reviews, and word descriptors. By posting content, you grant
          us a license to display it as part of the service (for example, on
          your public profile).
        </Paragraph>
        <Paragraph>You agree not to post content that:</Paragraph>
        <BulletList
          items={[
            "Violates any law or infringes others' rights",
            "Is abusive, harassing, or hateful",
            "Contains spam or deceptive material",
            "Attempts to exploit or harm minors",
          ]}
        />
      </Section>

      <Section title="Account Termination">
        <Paragraph>
          You may delete your account at any time. We may suspend or terminate
          accounts that violate these terms or our Community Guidelines, with or
          without notice depending on severity.
        </Paragraph>
      </Section>

      <Section title="The Service">
        <Paragraph>
          We strive to keep Bookendd available and functional, but we provide
          the service &quot;as is&quot; without warranties. We may modify, suspend, or
          discontinue features at any time.
        </Paragraph>
        <Paragraph>
          Book metadata and covers are provided by OpenLibrary and other
          sources. We don&apos;t guarantee the accuracy or availability of this
          information.
        </Paragraph>
      </Section>

      <Section title="Limitation of Liability">
        <Paragraph>
          To the extent permitted by law, Bookendd and its operators are not
          liable for indirect, incidental, or consequential damages arising from
          your use of the service.
        </Paragraph>
      </Section>

      <Section title="Changes to Terms">
        <Paragraph>
          We may update these terms occasionally. Continued use of Bookendd
          after changes constitutes acceptance. We&apos;ll notify users of
          significant changes through the app or email.
        </Paragraph>
      </Section>

      <Section title="Contact">
        <Paragraph>
          Questions about these terms? Contact us at legal@bookendd.com
        </Paragraph>
      </Section>
    </LegalLayout>
  );
}
