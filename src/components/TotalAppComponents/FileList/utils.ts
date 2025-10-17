/**
 * Formatează data upload-ului într-un format citibil
 */
export function formatUploadDate(dateString?: string): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Dacă e de azi, arată timpul
    if (diffDays === 0) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Astăzi, ${hours}:${minutes}`;
    }

    // Dacă e de ieri
    if (diffDays === 1) {
      return 'Ieri';
    }

    // Dacă e în ultimele 7 zile
    if (diffDays < 7) {
      return `Acum ${diffDays} zile`;
    }

    // Altfel, arată data completă
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return null;
  }
}

/**
 * Returnează iconița corespunzătoare tipului de fișier
 */
export function getFileIcon(contentType: string): string | null {
  if (contentType.startsWith('image/')) {
    return '🖼️';
  } else if (contentType.includes('pdf')) {
    return '📄';
  } else if (contentType.includes('word') || contentType.includes('document')) {
    return '📝';
  } else if (contentType.includes('sheet') || contentType.includes('excel')) {
    return '📊';
  } else if (contentType.includes('zip') || contentType.includes('archive')) {
    return '📦';
  }
  return null;
}
