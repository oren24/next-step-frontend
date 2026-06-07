import PropTypes from 'prop-types';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { LIST } from '../../pages/styles/jobApplicationsStyles';
import {
  SORT_OPTIONS,
  STATUS_FILTERS,
} from './listView.constants';

export default function ListFilterControls({
  searchQuery,
  statusFilter,
  sortBy,
  sortDirection,
  onSearchChange,
  onStatusFilterChange,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <Box sx={LIST.controlsRow}>
      <TextField
        size="small"
        label="Search"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Company, role, platform, tag"
        sx={LIST.searchField}
      />

      <FormControl size="small" sx={LIST.filterControl}>
        <InputLabel>Status</InputLabel>
        <Select
          variant="outlined"
          value={statusFilter}
          label="Status"
          onChange={onStatusFilterChange}
        >
          {STATUS_FILTERS.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={LIST.filterControl}>
        <InputLabel>Sort By</InputLabel>
        <Select
          variant="outlined"
          value={sortBy}
          label="Sort By"
          onChange={onSortByChange}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={LIST.filterControl}>
        <InputLabel>Order</InputLabel>
        <Select
          variant="outlined"
          value={sortDirection}
          label="Order"
          onChange={onSortDirectionChange}
        >
          <MenuItem value="desc">Descending</MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

ListFilterControls.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  onSortByChange: PropTypes.func.isRequired,
  onSortDirectionChange: PropTypes.func.isRequired,
};

