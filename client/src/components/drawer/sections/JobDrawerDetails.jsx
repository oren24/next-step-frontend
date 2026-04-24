import PropTypes from 'prop-types';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import {Box, Chip, Stack, Typography} from '@mui/material';
import {
  historyEntrySx,
  historyStatusSx,
  historyTimeSx,
  iconContentBoxSx,
  iconMetaSx,
  labelSx,
  linkSx,
  metaTextSx,
  sectionTitleSx,
  tagChipSx,
  valueSx,
} from '../styles/jobDrawerDetailsStyles';
import {minWidthZeroSx, scrollSectionSx} from '../styles/jobDrawerSharedStyles';
import {getAppliedDate, getCreatedDate} from '../helpers/jobDrawerMappers';
import {appShape} from '../helpers/propTypes';

const formatHistoryTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '-';
  const day = date.toLocaleDateString();
  const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  return `${day} at ${time}`;
};

const JobLink = ({jobLink}) => {
  const showLink = Boolean(jobLink);
  return (
    <Typography
      component={showLink ? 'a' : 'span'}
      href={showLink ? jobLink : undefined}
      target={showLink ? '_blank' : undefined}
      rel={showLink ? 'noreferrer' : undefined}
      sx={linkSx}
    >
      {jobLink || 'https://example.com/careers/developer'}
    </Typography>
  );
};

JobLink.propTypes = {
  jobLink: PropTypes.string,
};

const TagsList = ({tags}) => {
  const displayTags = tags.length ? tags : ['Rest API', 'React', 'Node.js'];

  return (
    <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
      {displayTags.map((tag) => (
        <Chip key={tag} label={tag} size="small" sx={tagChipSx} />
      ))}
    </Stack>
  );
};

TagsList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function JobDrawerDetails({app, tags, jobLink}) {
  return (
    <Box sx={scrollSectionSx}>
      <Stack spacing={1.6}>
        <Box sx={iconContentBoxSx}>
          <LocationOnOutlinedIcon sx={iconMetaSx} />
          <Box>
            <Typography sx={labelSx}>Location</Typography>
            <Typography sx={valueSx}>{app?.location || 'Tlv, IL'}</Typography>
          </Box>
        </Box>

        <Box sx={iconContentBoxSx}>
          <WorkOutlineOutlinedIcon sx={iconMetaSx} />
          <Box>
            <Typography sx={labelSx}>Work Type</Typography>
            <Typography sx={valueSx}>{app?.workType || 'Hybrid'}</Typography>
          </Box>
        </Box>

        <Box sx={iconContentBoxSx}>
          <LinkOutlinedIcon sx={iconMetaSx} />
          <Box sx={minWidthZeroSx}>
            <Typography sx={labelSx}>Job URL</Typography>
            <JobLink jobLink={jobLink} />
          </Box>
        </Box>
      </Stack>

      <Typography sx={sectionTitleSx}>Tags</Typography>
      <TagsList tags={tags} />

      <Typography sx={sectionTitleSx}>Extra Details</Typography>
      <Stack spacing={0.6}>
        <Typography sx={metaTextSx}>Created At: {getCreatedDate(app)}</Typography>
        <Typography sx={metaTextSx}>Applied At: {getAppliedDate(app)}</Typography>
        <Typography sx={metaTextSx}>Platform: {app?.platform || 'LinkedIn'}</Typography>
      </Stack>

      {app?.statusHistory && app.statusHistory.length > 0 && (
        <>
          <Typography sx={sectionTitleSx}>Status History</Typography>
          <Stack spacing={1}>
            {app.statusHistory.map((entry, index) => (
              <Box key={`${entry.timestamp}-${index}`} sx={historyEntrySx}>
                <Typography sx={historyStatusSx}>{entry.status}</Typography>
                <Typography sx={historyTimeSx}>{formatHistoryTimestamp(entry.timestamp)}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}

JobDrawerDetails.propTypes = {
  app: appShape,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  jobLink: PropTypes.string,
};

