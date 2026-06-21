'use client';

import Link from 'next/link';
import { ADMIN_CONTROL_PATH, REPORT_DASHBOARD_PATH } from '@/lib/post-login-redirect';
import { useSession } from './SessionProvider';
import { ActionCard } from '../atoms/ActionCard';

export function HomeContent() {
  const { session, ready } = useSession();

  const isLoggedIn = ready && session !== null;
  const isAuthorityUser = isLoggedIn && session.authSource !== 'cognito';
  const isApplicationAdmin = isLoggedIn && session.type === 'Application Admin';

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
          {isLoggedIn ? (
            <Link href="/public" className="btn btn-primary btn-lg">
              Report an issue
            </Link>
          ) : (
            <button type="button" className="btn btn-secondary btn-lg" disabled>
              Report an issue
            </button>
          )}
        </div>
      </section>

      <div className="container pb-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <ActionCard
            title="Report an issue"
            description="Submit service delivery or crime reports with map pin, photos, contact details, and receive a reference number with email updates."
            href="/public"
            buttonLabel="Report an Issue"
            buttonClass={isLoggedIn ? 'btn btn-primary' : 'btn btn-secondary'}
            disabled={!isLoggedIn}
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
            href={REPORT_DASHBOARD_PATH}
            buttonLabel="Authority Login"
            disabled={!isAuthorityUser}
          />
          <ActionCard
            title="Admin control"
            description="Register authorities, assign area-limited rights, and preserve data integrity without deletion."
            href={ADMIN_CONTROL_PATH}
            buttonLabel="Admin Login"
            disabled={!isApplicationAdmin}
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
