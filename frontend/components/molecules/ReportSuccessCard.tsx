import Link from 'next/link';

interface ReportSuccessCardProps {
  referenceNumber: string;
  anonymous: boolean;
}

export function ReportSuccessCard({ referenceNumber, anonymous }: ReportSuccessCardProps) {
  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: 560 }}>
      <div className="card-body text-center p-5">
        <span className="badge bg-success mb-3">Report received</span>
        <h1 className="h3">Thank you for your report</h1>
        <p className="text-muted">Your reference number is:</p>
        <p className="display-6 fw-bold text-primary">{referenceNumber}</p>
        <p className="small text-muted">
          {anonymous
            ? 'Save this reference number to check status. No confirmation email was sent for anonymous reports.'
            : 'A confirmation email has been sent with your reference number and status updates.'}
        </p>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <Link href={`/status?reference=${referenceNumber}`} className="btn btn-primary">
            Check status
          </Link>
          <Link href="/" className="btn btn-outline-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
