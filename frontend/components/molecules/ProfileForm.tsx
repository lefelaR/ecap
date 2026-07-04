'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import type { SessionUser } from '@/lib/types';
import { FormField } from '@/components/atoms/FormField';
import { UserAvatar } from '@/components/atoms/UserAvatar';

interface ProfileFormProps {
  session: SessionUser;
  saving: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ProfileForm({ session, saving, onSubmit }: ProfileFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  }

  return (
    <form className="card shadow-sm" onSubmit={handleSubmit}>
      <div className="card-body">
        <div className="d-flex flex-column align-items-center mb-4">
          <UserAvatar
            name={session.name}
            imageUrl={previewUrl ?? session.imageUrl}
            size={96}
            className="mb-3"
          />
          <FormField label="Profile photo" htmlFor="profile-photo" className="col-12 col-md-8">
            <input
              id="profile-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="form-control"
              onChange={handlePhotoChange}
            />
            <div className="form-text">JPEG, PNG, WebP, or GIF. Max 2 MB.</div>
          </FormField>
        </div>

        <FormField label="Display name" htmlFor="profile-name" className="col-12 col-md-8">
          <input
            id="profile-name"
            name="name"
            type="text"
            className="form-control"
            defaultValue={session.name}
            required
            minLength={1}
            maxLength={120}
          />
        </FormField>

        <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}
