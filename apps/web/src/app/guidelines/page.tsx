"use client";

import {
  LegalLayout,
  Section,
  Paragraph,
  BulletList,
} from "@/components/LegalLayout";

export default function CommunityGuidelines() {
  return (
    <LegalLayout title="Community Guidelines" lastUpdated="February 2026">
      <Paragraph>
        Bookendd is a community of readers. These guidelines help keep it
        welcoming and useful for everyone.
      </Paragraph>

      <Section title="Be Respectful">
        <Paragraph>
          Reading is personal. People have different tastes, and that&apos;s what
          makes book discussions interesting.
        </Paragraph>
        <BulletList
          items={[
            "Respect others' opinions and reading choices",
            "Disagree constructively — attack ideas, not people",
            "No harassment, threats, or personal attacks",
            "No hate speech or discrimination",
          ]}
        />
      </Section>

      <Section title="Keep It Authentic">
        <Paragraph>
          Bookendd works best when people share genuine reading experiences.
        </Paragraph>
        <BulletList
          items={[
            "Only log books you've actually read (or attempted)",
            "Your ratings and words should reflect your real opinion",
            "Don't create fake accounts or impersonate others",
            "Don't use bots or automation to inflate activity",
          ]}
        />
      </Section>

      <Section title="Content Standards">
        <Paragraph>
          Your single-word descriptors and profile content are visible to
          others. Please keep them appropriate.
        </Paragraph>
        <BulletList
          items={[
            "No slurs, obscenities, or explicit sexual content",
            "No promotion of violence or illegal activity",
            "No spam, advertising, or self-promotion",
            "No spoilers without warning (when applicable)",
          ]}
        />
      </Section>

      <Section title="Enforcement">
        <Paragraph>
          We review reported content and may take action including:
        </Paragraph>
        <BulletList
          items={[
            "Removing violating content",
            "Warning the account holder",
            "Temporarily suspending accounts",
            "Permanently banning repeat or severe violators",
          ]}
        />
        <Paragraph>
          If you see content that violates these guidelines, please report it
          through the app or contact us directly.
        </Paragraph>
      </Section>

      <Section title="Contact">
        <Paragraph>
          Questions or reports? Contact us at community@bookendd.com
        </Paragraph>
      </Section>
    </LegalLayout>
  );
}
