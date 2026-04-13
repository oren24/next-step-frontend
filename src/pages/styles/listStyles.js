import { TYPOGRAPHY as TOP_TYPO } from '../../components/layout/styles/topBarStyles';

export const LIST = {
  container: {
    width: '100%',
    mt: 2,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  },
  title: {
    ...TOP_TYPO.title,
    fontSize: '20px',
    color: 'text.primary',
  },
  controlsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    mb: 2,
  },
  searchField: {
    minWidth: { xs: '100%', md: 260 },
    flex: { md: 1 },
  },
  filterControl: {
    minWidth: { xs: '48%', md: 150 },
  },
  sectionsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  sectionPaper: {
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 1.5,
    py: 1,
    borderBottom: '2px solid',
  },
  sectionHeaderButton: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    p: 0,
    cursor: 'pointer',
    textAlign: 'left',
  },
  sectionHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  sectionHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  sectionIcon: {
    width: 18,
    height: 18,
    opacity: 0.95,
  },
  sectionTitle: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    fontSize: '17px',
    lineHeight: '100%',
  },
  sectionCountBadge: {
    minWidth: 28,
    height: 24,
    px: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: 700,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  sectionCollapseIcon: {
    color: 'text.secondary',
    transition: 'transform 0.18s ease',
  },
  sectionCollapseIconCollapsed: {
    transform: 'rotate(-90deg)',
  },
  sectionBody: {
    p: 1.5,
    pt: 1,
  },
  sectionBodyDroppable: {
    transition: 'background-color 0.15s ease-in-out',
  },
  sectionBodyOver: {
    backgroundColor: 'rgba(27, 133, 233, 0.06)',
  },
  sectionEmpty: {
    px: 2,
    py: 1.5,
    color: 'text.secondary',
    fontStyle: 'italic',
  },
  sectionCollapsedBody: {
    px: 2,
    py: 1.25,
    color: 'text.secondary',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  // Shown at the bottom of each section while a drag is active
  listDropHint: {
    border: '2px dashed',
    borderColor: 'divider',
    borderRadius: 1.5,
    py: 1.25,
    mx: 1.5,
    mb: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.secondary',
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.15s ease',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  listDropHintActive: {
    borderColor: 'primary.main',
    color: 'primary.main',
    backgroundColor: 'rgba(27, 133, 233, 0.07)',
    opacity: 1,
  },
  // DragOverlay card shown in list view while dragging
  listDragOverlay: {
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1.5,
    px: 2,
    py: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    minWidth: 260,
    cursor: 'grabbing',
  },
  dragHandleButton: {
    cursor: 'grab',
    color: 'text.secondary',
    '&:active': {
      cursor: 'grabbing',
    },
  },
  draggingItem: {
    opacity: 0.65,
    transform: 'scale(0.995)',
  },
  draggableRow: {
    transition: 'transform 0.12s ease',
  },
  draggableCard: {
    transition: 'transform 0.12s ease',
  },
  tableContainer: {
    borderRadius: 0,
    border: 'none',
    boxShadow: 'none',
  },
  headCell: {
    fontWeight: 700,
    color: 'text.secondary',
    whiteSpace: 'nowrap',
  },
  bodyCell: {
    color: 'text.primary',
    verticalAlign: 'middle',
  },
  row: {
    '&:last-child td': {
      borderBottom: 0,
    },
  },
  statusSelect: {
    minWidth: 140,
    '& .MuiSelect-select': {
      py: 0.5,
      fontWeight: 600,
    },
  },
  tagsWrap: {
    flexWrap: 'wrap',
    maxWidth: 220,
  },
  tagChip: {
    borderRadius: '6px',
  },
  mobileCard: {
    p: 1.5,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
  },
  mobileCardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 1,
    mb: 1,
  },
  mobileCompany: {
    fontWeight: 700,
    color: 'text.primary',
    lineHeight: 1.2,
  },
  mobileRole: {
    color: 'text.secondary',
    fontSize: '0.9rem',
  },
  mobileActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  },
  mobileMetaRow: {
    flexWrap: 'wrap',
    mb: 0.5,
  },
  mobileMetaText: {
    fontSize: '0.8rem',
    color: 'text.secondary',
  },
  mobileStatusControl: {
    width: '100%',
    my: 1,
  },
  emptyState: {
    p: 3,
    borderRadius: 2,
    color: 'text.secondary',
    textAlign: 'center',
    border: '1px dashed',
    borderColor: 'divider',
    boxShadow: 'none',
  },
};

