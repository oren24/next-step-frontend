import { JOB_STATUSES } from '../../constants/jobStatuses.js';

export const STATUS_FILTERS = ['All', ...JOB_STATUSES];

export const STATUS_ICONS = {
  Wishlist: '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
  Applied: '/src/assets/main section icons/Vector.svg',
  Interviewing: '/src/assets/main section icons/Group.svg',
  Offer: '/src/assets/main section icons/material-symbols_trophy-outline.svg',
  Rejected: '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
};

export const STATUS_ICON_FILTERS = {
  Wishlist: 'brightness(0) saturate(100%) invert(20%) sepia(69%) saturate(3151%) hue-rotate(243deg) brightness(98%) contrast(97%)',
  Applied: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(6142%) hue-rotate(338deg) brightness(102%) contrast(96%)',
  Interviewing: 'brightness(0) saturate(100%) invert(66%) sepia(63%) saturate(1425%) hue-rotate(10deg) brightness(104%) contrast(98%)',
  Offer: 'brightness(0) saturate(100%) invert(58%) sepia(60%) saturate(402%) hue-rotate(78deg) brightness(119%) contrast(89%)',
  Rejected: 'brightness(0) saturate(100%) invert(67%) sepia(7%) saturate(928%) hue-rotate(169deg) brightness(96%) contrast(88%)',
};

export const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Updated' },
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'companyName', label: 'Company' },
  { value: 'jobTitle', label: 'Role' },
];

