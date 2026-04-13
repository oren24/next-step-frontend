import jobApplicationsIcon from '../../assets/side bar icons/WorkOutlineOutlined.svg';
import resumesIcon from '../../assets/side bar icons/FileCopyOutlined.svg';
import subscriptionsIcon from '../../assets/side bar icons/ph_sparkle.svg';
import archiveIcon from '../../assets/side bar icons/material-symbols-light_archive-outline.svg';
import settingsIcon from '../../assets/side bar icons/solar_settings-linear.svg';

export const navigationItems = [
  { id: 'job-applications', label: 'Job Applications', path: '/', icon: jobApplicationsIcon },
  { id: 'resumes', label: 'Resumes', path: '/resumes', icon: resumesIcon },
  { id: 'subscriptions', label: 'Subscriptions', path: '/subscriptions', icon: subscriptionsIcon },
  { id: 'archive', label: 'Archive', path: '/archive', icon: archiveIcon },
];

export const bottomNavigationItems = [
  { id: 'settings', label: 'Settings', path: '/settings', icon: settingsIcon },
];

export const SECTION_LABEL = 'Jobs';
