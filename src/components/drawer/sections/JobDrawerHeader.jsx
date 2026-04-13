import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import {Box, Chip, IconButton, Typography} from '@mui/material';
import {
  headerRowSx,
  iconButtonsContainerSx,
  logoSx,
  statusChipSx,
  titleSx,
  titleWrapSx,
} from '../styles/jobDrawerHeaderStyles';
import {minWidthZeroSx, sectionSx} from '../styles/jobDrawerSharedStyles';
import {appShape} from '../helpers/propTypes';

export default function JobDrawerHeader({
  app,
  isEditMode,
  titleText,
  onToggleEditMode,
  onClose,
}) {
  return (
    <Box sx={sectionSx}>
      <Box sx={headerRowSx}>
        <Box sx={titleWrapSx}>
          <Box
            component="img"
            src={app?.companyLogo || '/src/assets/logo.svg'}
            alt={app?.company || app?.companyName || 'Company logo'}
            sx={logoSx}
          />
          <Box sx={minWidthZeroSx}>
            <Typography variant="subtitle1" sx={titleSx} noWrap>
              {titleText}
            </Typography>
            <Chip label={app?.status || 'Applied'} size="small" sx={statusChipSx} />
          </Box>
        </Box>
        <Box sx={iconButtonsContainerSx}>
          {!isEditMode && (
            <IconButton size="small" aria-label="Edit job" onClick={onToggleEditMode}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" aria-label="Close drawer" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

JobDrawerHeader.propTypes = {
  app: appShape,
  isEditMode: PropTypes.bool.isRequired,
  titleText: PropTypes.string.isRequired,
  onToggleEditMode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

