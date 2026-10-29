import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { uploadsDir } from '@/services/store';

const MAX_PROFILE_PHOTO_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function profilePhotoPublicPath(filename: string): string {
  return `/api/uploads/profiles/${filename}`;
}

export async function saveProfilePhoto(userId: string, file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Profile photo must be a JPEG, PNG, WebP, or GIF image.');
  }

  if (file.size > MAX_PROFILE_PHOTO_BYTES) {
    throw new Error('Profile photo must be 2 MB or smaller.');
  }

  const extension = EXTENSION_BY_TYPE[file.type] ?? 'jpg';
  const filename = `${userId}-${randomUUID()}.${extension}`;
  const directory = path.join(uploadsDir(), 'profiles');

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

  return profilePhotoPublicPath(filename);
}
