/**
 * Formats an ISO date string or timestamp into a human-readable time-ago format.
 * E.g., "Posted just now", "Posted 2 hours ago", "Posted 3 days ago".
 */
export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Posted recently';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (isNaN(diffMs) || diffMs < 0) {
    return 'Posted recently';
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) {
    return 'Posted just now';
  }
  if (diffMins === 1) {
    return 'Posted 1 minute ago';
  }
  if (diffMins < 60) {
    return `Posted ${diffMins} minutes ago`;
  }
  if (diffHours === 1) {
    return 'Posted 1 hour ago';
  }
  if (diffHours < 24) {
    return `Posted ${diffHours} hours ago`;
  }
  if (diffDays === 1) {
    return 'Posted 1 day ago';
  }
  if (diffDays < 7) {
    return `Posted ${diffDays} days ago`;
  }
  if (diffWeeks === 1) {
    return 'Posted 1 week ago';
  }
  if (diffWeeks < 4) {
    return `Posted ${diffWeeks} weeks ago`;
  }
  if (diffMonths === 1) {
    return 'Posted 1 month ago';
  }
  return `Posted ${diffMonths} months ago`;
}
