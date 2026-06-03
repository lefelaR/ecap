'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';

export default function PublicPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [28.0473, -26.2041],
      zoom: 11,
    });

    new mapboxgl.Marker({ draggable: true })
      .setLngLat([28.0473, -26.2041])
      .addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-12">
          <div className="page-banner">
            <span className="badge rounded-pill bg-secondary text-white">Public User</span>
            <h1 className="display-6 fw-bold mt-3">Report a problem</h1>
            <p className="lead mb-0">Click the map or drag the pin to adjust the location.</p>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body p-0">
              <div className="map-panel p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-uppercase text-muted small mb-1">Location picker</p>
                    <h2 className="h5 mb-0">City of Johannesburg Ward 23</h2>
                  </div>
                  <span className="badge bg-primary">Ward 23</span>
                </div>
                <div className="mapbox-container mb-3" ref={mapContainer} />
                <p className="text-muted small mb-0">
                  Use the map to select the report location, or enter the address manually in the form.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="h5 mb-1">Report details</h2>
                  <p className="text-muted small mb-0">The information below will be routed to the correct department.</p>
                </div>
                <span className="badge bg-info text-dark">Linked department</span>
              </div>

              <form className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="category">Select a category</label>
                  <select id="category" className="form-select" defaultValue="road-engineer">
                    <option value="road-engineer">Road Engineer</option>
                    <option value="water-services">Water Services</option>
                    <option value="waste-management">Waste Management</option>
                    <option value="safety-and-security">Safety and Security</option>
                  </select>
                </div>

                <div className="col-12">
                  <div className="alert alert-secondary py-3" role="alert">
                    <strong>Public details</strong>
                    <div className="small text-muted mt-2">
                      These will be sent to the linked department and stored in accordance with our privacy policy.
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="summary">Summarise the problem</label>
                  <input id="summary" className="form-control" placeholder="e.g. '10 inch pothole on Example St, near post box'" />
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="details">Explain what’s wrong</label>
                  <textarea id="details" className="form-control" rows={5} placeholder="e.g. 'This pothole has been here for two months and...'" />
                </div>

                <div className="col-12">
                  <label className="form-label">Photos</label>
                  <div className="form-text mb-2">Upload photos (Max. 3)</div>
                  <input type="file" className="form-control" accept="image/*" multiple />
                </div>

                <div className="col-12 d-flex gap-2">
                  <button type="button" className="btn btn-primary flex-fill">
                    Submit report
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
