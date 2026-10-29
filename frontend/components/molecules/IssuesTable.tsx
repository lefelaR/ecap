import Link from 'next/link';
import type { Report } from '@/lib/types';
import { issueDetailsPath } from '@/lib/post-login-redirect';
import { CATEGORY_LABELS, STATUS_LABELS, formatDate } from '@/lib/labels';

interface IssuesTableProps {
  reports: Report[];
}

export function IssuesTable({ reports }: IssuesTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Reference</th>
            <th scope="col">Summary</th>
            <th scope="col">Ward</th>
            <th scope="col">Category</th>
            <th scope="col">Status</th>
            <th scope="col">Reported</th>
            <th scope="col" className="text-end">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const detailsHref = issueDetailsPath(report.id);

            return (
              <tr key={report.id}>
                <td>
                  <Link href={detailsHref} className="text-decoration-none fw-medium">
                    {report.referenceNumber}
                  </Link>
                </td>
                <td>
                  <Link href={detailsHref} className="text-decoration-none text-body">
                    {report.summary}
                  </Link>
                  {report.anonymous && (
                    <span className="text-muted small d-block">Anonymous</span>
                  )}
                </td>
                <td>{report.ward}</td>
                <td>{CATEGORY_LABELS[report.category]}</td>
                <td>
                  <span className="badge bg-secondary">{STATUS_LABELS[report.status]}</span>
                </td>
                <td className="text-nowrap">{formatDate(report.createdAt)}</td>
                <td className="text-end">
                  <Link href={detailsHref} className="btn btn-sm btn-outline-primary">
                    View details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
