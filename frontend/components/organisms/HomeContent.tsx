import Link from 'next/link';
import { ActionCard } from '../atoms/ActionCard';

export function HomeContent() {
  return (
    <>
      <section className="home-hero">
        <div className="container text-center">
          <h1 className="display-5 fw-bold">
            We manage municipal reporting on behalf of communities.
            <br />
            Our goal is to make service delivery safe, clean and connected.
          </h1>
          <p className="lead mx-auto mt-3 mb-4" style={{ maxWidth: 720 }}>
            ECAP is serving you by taking care of your issues. Log it, and we&apos;ll fix it!
          </p>
          <Link href="/public" className="btn btn-primary btn-lg">
            Report an issue
          </Link>
        </div>
      </section>

      <div className="container pb-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <ActionCard
            title="Report an issue"
            description="Submit service delivery or crime reports with map pin, photos, contact details, and receive a reference number with email updates."
            href="/public"
            buttonLabel="Report an Issue"
            buttonClass="btn btn-primary"
          />
          <ActionCard
            title="Check status"
            description="Look up your reference number to see resolution progress, time taken, and expenditure."
            href="/status"
            buttonLabel="Check Status"
          />
          <ActionCard
            title="Public statistics"
            description="View trends, hotspot wards, and transparent reporting on service delivery across the municipality."
            href="/statistics"
            buttonLabel="View Statistics"
          />
          <ActionCard
            title="Authority dashboard"
            description="Manage ward reports, resolve issues, mark duplicates, and track expenditure."
            href="/login?redirect=/authority"
            buttonLabel="Authority Login"
          />
          <ActionCard
            title="Admin control"
            description="Register authorities, assign area-limited rights, and preserve data integrity without deletion."
            href="/login?redirect=/admin"
            buttonLabel="Admin Login"
          />
        </div>

        <section className="card shadow-sm mt-5">
          <div className="card-body">
            <h2>Why ECAP?</h2>
            <ul>
              <li>Anonymous crime reporting for the public while preserving investigation access for SAPS/JMPD.</li>
              <li>Service delivery reports routed to the correct ward and responsible entity.</li>
              <li>Reference numbers, email confirmations, and public status tracking.</li>
              <li>Authority filtering, duplicate marking, and cancellation without data deletion.</li>
              <li>Public statistics, trend analysis, and hotspot monitoring.</li>
              <li>Designed for every South African municipality, from urban centers to rural wards.</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
