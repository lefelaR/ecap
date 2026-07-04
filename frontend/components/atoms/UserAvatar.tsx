'use client';

import { useState } from 'react';
import { getNameInitial } from '@/lib/avatar';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  className?: string;
}

export function UserAvatar({ name, imageUrl, size = 48, className = '' }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const initial = getNameInitial(name);

  return (
    <div
      className={`user-avatar${showImage ? '' : ' user-avatar--initial'} ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-label={name}
      role="img"
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt=""
          className="user-avatar__image"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="user-avatar__initial" aria-hidden="true">
          {initial}
        </span>
      )}
    </div>
  );
}
