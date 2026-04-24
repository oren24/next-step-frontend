import PropTypes from 'prop-types';

const dateLikeType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.instanceOf(Date),
]);

export const statusHistoryEntryShape = PropTypes.shape({
  status: PropTypes.string,
  timestamp: dateLikeType,
});

export const appShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  position: PropTypes.string,
  jobTitle: PropTypes.string,
  company: PropTypes.string,
  companyName: PropTypes.string,
  companyLogo: PropTypes.string,
  location: PropTypes.string,
  workType: PropTypes.string,
  jobUrl: PropTypes.string,
  url: PropTypes.string,
  link: PropTypes.string,
  platform: PropTypes.string,
  status: PropTypes.string,
  note: PropTypes.string,
  notes: PropTypes.string,
  tags: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  skills: PropTypes.arrayOf(PropTypes.string),
  appliedAt: dateLikeType,
  createdAt: dateLikeType,
  updatedAt: dateLikeType,
  statusHistory: PropTypes.arrayOf(statusHistoryEntryShape),
});

export const editFormDataShape = PropTypes.shape({
  position: PropTypes.string,
  company: PropTypes.string,
  location: PropTypes.string,
  workType: PropTypes.string,
  jobUrl: PropTypes.string,
  platform: PropTypes.string,
  tags: PropTypes.string,
});

