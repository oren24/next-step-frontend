import { JOB_STATUSES } from '../../../constants/jobStatuses.js';

export const STATUS_ORDER = JOB_STATUSES;
export const INTERVIEWING_STATUS = 'Interviewing';
export const NOOP = () => {};

export const STATUS_ICONS = {
  Wishlist: '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
  Applied: '/src/assets/main section icons/Vector.svg',
  Interviewing: '/src/assets/main section icons/Group.svg',
  Offer: '/src/assets/main section icons/material-symbols_trophy-outline.svg',
  Rejected: '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
};

export const EMPTY_STATE_MESSAGES = {
  Wishlist: 'Wishlist Item',
  Applied: 'Applied Job',
  Interviewing: 'Interview',
  Rejected: 'Rejected Job',
};
