import { JOB_STATUSES } from '../../../constants/jobStatuses.js';

export const STATUS_ORDER = JOB_STATUSES;
export const INTERVIEWING_STATUS = 'Interviewing';
export const NOOP = () => {};

export const STATUS_ICONS = {
  Wishlist: '/assets/main section icons/material-symbols_bookmark-outline.svg',
  Applied: '/assets/main section icons/Vector.svg',
  Interviewing: '/assets/main section icons/Group.svg',
  Offer: '/assets/main section icons/material-symbols_trophy-outline.svg',
  Rejected: '/assets/main section icons/material-symbols_bookmark-outline.svg',
};

export const EMPTY_STATE_MESSAGES = {
  Wishlist: 'Wishlist Item',
  Applied: 'Applied Job',
  Interviewing: 'Interview',
  Rejected: 'Rejected Job',
};
