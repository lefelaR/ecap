'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FormEvent, useState } from 'react';
import type { ReportCategory, ReportType } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_SERVICE_PROVIDERS } from '@/lib/labels';
import { createReport, getReportErrorMessage } from '@/services/reports';
import { AlertMessage } from '../atoms/AlertMessage';
import { FormField } from '../atoms/FormField';
import { PageBanner } from '../atoms/PageBanner';
import { ReportTypeToggle } from '../atoms/ReportTypeToggle';
import { ReportSuccessCard } from '../molecules/ReportSuccessCard';

const LocationPicker = dynamic(
  () => import('../molecules/LocationPicker').then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="card shadow-sm h-100">
        <div className="card-body map-panel">
          <p className="text-muted mb-0">Loading map…</p>
          <div className="mapbox-container mt-3 bg-light" />
        </div>
      </div>
    ),
  },
);

export function PublicReportFlow() {
  const [reportType, setReportType] = useState<ReportType>('service');
  const [category, setCategory] = useState<ReportCategory>('road-engineer');
  const [anonymous, setAnonymous] = useState(false);
  const [coords, setCoords] = useState({ lat: -26.2041, lng: 28.0473 });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ referenceNumber: string } | null>(null);
  const [error, setError] = useState('');

  const serviceProvider = CATEGORY_SERVICE_PROVIDERS[category];

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setError('');
      },
      () => setError('Unable to retrieve your location. Enter the address manually.'),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('type', reportType);
    formData.set('anonymous', String(anonymous));
    formData.set('lat', String(coords.lat));
    formData.set('lng', String(coords.lng));
    formData.set('ward', 'Ward 23');
    formData.set('municipality', 'City of Johannesburg');
    formData.set('location', 'Ward 23, City of Johannesburg');

    try {
      const report = await createReport(formData);
      setResult({ referenceNumber: report.referenceNumber });
      form.reset();
    } catch (err) {
      setError(getReportErrorMessage(err, 'Failed to submit report.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="container py-5">
        <ReportSuccessCard referenceNumber={result.referenceNumber} anonymous={anonymous} />
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-12">
          <PageBanner
            badge="Public User"
            title="Report a problem"
            lead="Enter your location, describe the issue, and receive a reference number with email updates."
          />
        </div>

        <div className="col-12 col-xl-7">
          <LocationPicker coords={coords} onCoordsChange={setCoords} onUseCurrentLocation={useCurrentLocation} />
        </div>

        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Report details</h2>
              {error && <AlertMessage message={error} />}

              <form className="row g-3" onSubmit={handleSubmit}>
                <FormField label="Report type">
                  <ReportTypeToggle
                    value={reportType}
                    onChange={(type) => {
                      setReportType(type);
                      if (type === 'service') setAnonymous(false);
                    }}
                  />
                </FormField>

                {reportType === 'crime' && (
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        id="anonymous"
                        name="anonymous"
                        className="form-check-input"
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="anonymous">
                        Report anonymously (identity hidden from the public; SAPS/JMPD can investigate)
                      </label>
                    </div>
                  </div>
                )}

                {reportType === 'service' && (
                  <FormField label="Service provider" htmlFor="serviceProvider">
                    <input
                      id="serviceProvider"
                      className="form-control"
                      value={serviceProvider}
                      disabled
                      readOnly
                      aria-live="polite"
                    />
                  </FormField>
                )}

                <FormField label="Select a category" htmlFor="category">
                  <select
                    id="category"
                    name="category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReportCategory)}
                  >
                    {(Object.entries(CATEGORY_LABELS) as [ReportCategory, string][]).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Street name or area" htmlFor="address">
                  <input id="address" name="address" className="form-control" placeholder="e.g. Example St, Wynberg" required />
                </FormField>

                <FormField label="Summarise the problem" htmlFor="summary">
                  <input id="summary" name="summary" className="form-control" placeholder="e.g. 10 inch pothole near post box" required />
                </FormField>

                <FormField label="Describe the issue" htmlFor="description">
                  <textarea id="description" name="description" className="form-control" rows={4} required placeholder="Provide as much detail as possible." />
                </FormField>

                <FormField label="Photos (optional, max 3)">
                  <input type="file" name="photos" className="form-control" accept="image/*" multiple />
                </FormField>

                {!anonymous && (
                  <>
                    <FormField label="Your name" htmlFor="contactName">
                      <input id="contactName" name="contactName" className="form-control" required />
                    </FormField>
                    <FormField label="Email (for reference number and updates)" htmlFor="contactEmail">
                      <input id="contactEmail" name="contactEmail" type="email" className="form-control" required />
                    </FormField>
                    <FormField label="Phone (optional)" htmlFor="contactPhone">
                      <input id="contactPhone" name="contactPhone" type="tel" className="form-control" />
                    </FormField>
                  </>
                )}

                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-fill" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit report'}
                  </button>
                  <Link href="/" className="btn btn-outline-secondary flex-fill">
                    Back to home
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
