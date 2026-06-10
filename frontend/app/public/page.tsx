'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { HttpService, http } from '../../services/http';

export default function PublicPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [reportType, setReportType] = useState<'service' | 'crime'>('service');
  const [anonymous, setAnonymous] = useState(false);
  const [coords, setCoords] = useState({ lat: -26.2041, lng: 28.0473 });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ referenceNumber: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coords.lng, coords.lat],
      zoom: 11,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLngLat();
      setCoords({ lat: pos.lat, lng: pos.lng });
    });

    markerRef.current = marker;
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markerRef.current = null;
    };
  }, []);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        mapInstance.current?.flyTo({ center: [lng, lat], zoom: 14 });
        markerRef.current?.setLngLat([lng, lat]);
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
    formData.set('location', `Ward 23, City of Johannesburg`);

    try {
      const { data } = await http.post<{ referenceNumber: string }>('/reports', formData);
      setResult({ referenceNumber: data.referenceNumber });
      form.reset();
    } catch (err) {
      setError(HttpService.getErrorMessage(err, 'Failed to submit report.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="container py-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: 560 }}>
          <div className="card-body text-center p-5">
            <span className="badge bg-success mb-3">Report received</span>
            <h1 className="h3">Thank you for your report</h1>
            <p className="text-muted">Your reference number is:</p>
            <p className="display-6 fw-bold text-primary">{result.referenceNumber}</p>
            <p className="small text-muted">
              {anonymous
                ? 'Save this reference number to check status. No confirmation email was sent for anonymous reports.'
                : 'A confirmation email has been sent with your reference number and status updates.'}
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link href={`/status?reference=${result.referenceNumber}`} className="btn btn-primary">
                Check status
              </Link>
              <Link href="/" className="btn btn-outline-secondary">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-12">
          <div className="page-banner">
            <span className="badge rounded-pill bg-secondary text-white">Public User</span>
            <h1 className="display-6 fw-bold mt-3">Report a problem</h1>
            <p className="lead mb-0">Enter your location, describe the issue, and receive a reference number with email updates.</p>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body p-0">
              <div className="map-panel p-4">
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                  <div>
                    <p className="text-uppercase text-muted small mb-1">Location picker</p>
                    <h2 className="h5 mb-0">City of Johannesburg Ward 23</h2>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={useCurrentLocation}>
                    Use current location
                  </button>
                </div>
                <div className="mapbox-container mb-3" ref={mapContainer} />
                <p className="text-muted small mb-0">Drag the pin on the map for accuracy, or use your current location.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Report details</h2>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                  <label className="form-label">Report type</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${reportType === 'service' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setReportType('service');
                        setAnonymous(false);
                      }}
                    >
                      Service delivery
                    </button>
                    <button
                      type="button"
                      className={`btn ${reportType === 'crime' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setReportType('crime')}
                    >
                      Crime / safety
                    </button>
                  </div>
                </div>

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

                <div className="col-12">
                  <label className="form-label" htmlFor="category">Select a category</label>
                  <select id="category" name="category" className="form-select" defaultValue="road-engineer">
                    <option value="road-engineer">Road Engineer</option>
                    <option value="water-services">Water Services</option>
                    <option value="waste-management">Waste Management</option>
                    <option value="safety-and-security">Safety and Security</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="address">Street name or area</label>
                  <input id="address" name="address" className="form-control" placeholder="e.g. Example St, Wynberg" required />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="summary">Summarise the problem</label>
                  <input id="summary" name="summary" className="form-control" placeholder="e.g. 10 inch pothole near post box" required />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="description">Describe the issue</label>
                  <textarea id="description" name="description" className="form-control" rows={4} required placeholder="Provide as much detail as possible." />
                </div>

                <div className="col-12">
                  <label className="form-label">Photos (optional, max 3)</label>
                  <input type="file" name="photos" className="form-control" accept="image/*" multiple />
                </div>

                {!anonymous && (
                  <>
                    <div className="col-12">
                      <label className="form-label" htmlFor="contactName">Your name</label>
                      <input id="contactName" name="contactName" className="form-control" required={!anonymous} />
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="contactEmail">Email (for reference number and updates)</label>
                      <input id="contactEmail" name="contactEmail" type="email" className="form-control" required={!anonymous} />
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="contactPhone">Phone (optional)</label>
                      <input id="contactPhone" name="contactPhone" type="tel" className="form-control" />
                    </div>
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
