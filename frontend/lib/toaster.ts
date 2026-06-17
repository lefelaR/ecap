import toast from 'react-hot-toast';
import { ApiRequestError } from './api-error';
import { HttpService } from '../services/http';

const INFO_TOAST_STYLE = {
  background: '#ca8a04',
  color: '#ffffff',
};

export function success(message: string) {
  toast.success(message);
}

export function info(message: string) {
  toast(message, { style: INFO_TOAST_STYLE });
}

export function error(message: string) {
  toast.error(message);
}

export function fromStatus(status: number, message: string) {
  if (status >= 200 && status < 300) {
    success(message);
    return;
  }

  if (status >= 300 && status < 400) {
    info(message);
    return;
  }

  error(message);
}

export function fromError(err: unknown, fallback: string) {
  if (err instanceof ApiRequestError) {
    fromStatus(err.status, err.message);
    return;
  }

  const status = HttpService.getResponseStatus(err);
  if (status) {
    fromStatus(status, HttpService.getErrorMessage(err, fallback));
    return;
  }

  error(err instanceof Error ? err.message : fallback);
}
