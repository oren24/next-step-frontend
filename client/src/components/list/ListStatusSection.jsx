import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LIST, STATUS_COLORS } from '../../pages/styles/jobApplicationsStyles';
import { JOB_STATUSES } from '../../constants/jobStatuses.js';
import {
  STATUS_ICONS,
  STATUS_ICON_FILTERS,
} from './listView.constants';
import ListStatusSectionContent from './ListStatusSectionContent.jsx';
import { APP_SHAPE } from './ListStatusRows.jsx';


function ListStatusSection({
  status,
  items,
  isCollapsed,
  isDragging,
  isMobile,
  onToggleSection,
  onAutoExpandSection,
  onOpenEdit,
  onOpenDelete,
  onStatusChange,
}) {
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.Wishlist;

  return (
    <Paper sx={LIST.sectionPaper}>
      <Box
        component="button"
        type="button"
        onClick={() => onToggleSection(status)}
        aria-expanded={!isCollapsed}
        sx={{
          ...LIST.sectionHeader,
          ...LIST.sectionHeaderButton,
          borderColor: statusColor.header,
          backgroundColor: statusColor.headerBg,
        }}
      >
        <Box sx={LIST.sectionHeaderLeft}>
          <Box
            component="img"
            src={STATUS_ICONS[status]}
            alt={status}
            sx={{ ...LIST.sectionIcon, filter: STATUS_ICON_FILTERS[status] }}
          />
          <Typography sx={{ ...LIST.sectionTitle, color: statusColor.header }}>{status}</Typography>
        </Box>
        <Box sx={LIST.sectionHeaderRight}>
          <Box sx={{ ...LIST.sectionCountBadge, color: statusColor.header, borderColor: statusColor.header }}>
            {items.length}
          </Box>
          <ExpandMoreIcon
            sx={{
              ...LIST.sectionCollapseIcon,
              ...(isCollapsed ? LIST.sectionCollapseIconCollapsed : {}),
            }}
          />
        </Box>
      </Box>

      <ListStatusSectionContent
        status={status}
        items={items}
        isCollapsed={isCollapsed}
        isDragging={isDragging}
        isMobile={isMobile}
        statusColor={statusColor}
        onAutoExpandSection={onAutoExpandSection}
        onOpenEdit={onOpenEdit}
        onOpenDelete={onOpenDelete}
        onStatusChange={onStatusChange}
      />
    </Paper>
  );
}

ListStatusSection.propTypes = {
  status: PropTypes.oneOf(JOB_STATUSES).isRequired,
  items: PropTypes.arrayOf(APP_SHAPE).isRequired,
  isCollapsed: PropTypes.bool,
  isDragging: PropTypes.bool,
  isMobile: PropTypes.bool,
  onToggleSection: PropTypes.func.isRequired,
  onAutoExpandSection: PropTypes.func.isRequired,
  onOpenEdit: PropTypes.func.isRequired,
  onOpenDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default memo(ListStatusSection);
