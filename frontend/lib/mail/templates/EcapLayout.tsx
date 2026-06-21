import type { ReactNode } from 'react';
import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'react-email';
import { statusPageUrl } from '../config';

interface EcapLayoutProps {
  preview: string;
  title: string;
  children: ReactNode;
}

export function EcapLayout({ preview, title, children }: EcapLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>ECAP</Heading>
            <Text style={tagline}>Electronic Councillor Action Platform</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={titleStyle}>
              {title}
            </Heading>
            {children}
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Check your report status at{' '}
            <Link href={statusPageUrl()} style={link}>
              {statusPageUrl()}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#f4f6f8',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '0',
  padding: '24px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
};

const header = {
  marginBottom: '24px',
};

const brand = {
  color: '#0d6efd',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.2',
  margin: '0 0 4px',
};

const tagline = {
  color: '#64748b',
  fontSize: '13px',
  margin: '0',
};

const content = {
  margin: '0',
};

const titleStyle = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 16px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
};

const link = {
  color: '#0d6efd',
};
