import { GRADIENTS } from '../../components/layout/styles/sidebarStyles';
import { TYPOGRAPHY as TOP_TYPO } from '../../components/layout/styles/topBarStyles';

// Status color scheme matching Figma (adjusted for dark mode)
export const STATUS_COLORS = {
  Wishlist: { header: '#818CF8', headerBg: 'rgba(129,143,248,0.12)', cardBg: 'rgba(129,143,248,0.08)', border: '#818CF8' },
  Applied: { header: '#F87171', headerBg: 'rgba(248,113,113,0.12)', cardBg: 'rgba(248,113,113,0.08)', border: '#F87171' },
  Interviewing: { header: '#FBBF24', headerBg: 'rgba(251,191,36,0.12)', cardBg: 'rgba(251,191,36,0.08)', border: '#FBBF24' },
  Offer: { header: '#34D399', headerBg: 'rgba(52,211,153,0.12)', cardBg: 'rgba(52,211,153,0.08)', border: '#34D399' },
  Rejected: { header: '#9CA3AF', headerBg: 'rgba(156,163,175,0.12)', cardBg: 'rgba(156,163,175,0.08)', border: '#9CA3AF' },
};

export const BOARD = {
  container: {
    width: '100%',
    p: { xs: 2, sm: 3 },
    maxWidth: '100%',
    overflow: 'hidden',
    bgcolor: 'background.default',
  },
  // columns wrapper is column on mobile (stacked), row with horizontal scroll on md+
  columnsWrapper: {
    display: 'flex',
    gap: 3,
    alignItems: 'flex-start',
    overflowX: 'auto',
    pb: 2,
    width: '100%',
    flexDirection: { xs: 'column', md: 'row' },
    // subtle padding so columns don't touch the edge
    px: { xs: 1, md: 2 },
    // smooth scrolling feel
    WebkitOverflowScrolling: 'touch',
  },
  columnPaper: {
    // On mobile columns should be full-width and stacked; on desktop use fixed column width
    width: { xs: '100%', md: 340 },
    minWidth: { md: 280 },
    maxWidth: { md: 360 },
    p: 2,
    flex: { xs: '0 0 auto', md: '0 0 340px' },
    bgcolor: 'background.paper',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 6px 18px rgba(17,24,39,0.06)',
    // gentle lift on hover (desktop)
    '&:hover': {
      boxShadow: '0 8px 24px rgba(2,6,23,0.24)',
      transform: 'none',
    },
    transition: 'box-shadow 0.18s ease, transform 0.18s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  // header area for column
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 1.25,
    py: 0.75,
    borderRadius: 1.5,
    // Color applied via inline style from Column component using STATUS_COLORS
    backgroundColor: 'var(--header-bg, transparent)',
    borderBottom: '2px solid',
    borderColor: 'var(--header-color, transparent)',
    mb: 1,
  },
  columnTitle: {
    ...TOP_TYPO.title,
    fontSize: '15px',
    fontWeight: 700,
    mb: 0,
    color: 'var(--header-color, text.primary)',
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
  },
  columnCount: {
    ...TOP_TYPO.title,
    fontSize: '13px',
    color: 'text.secondary',
    fontWeight: 600,
  },
  columnHeaderAccent: {
    background: GRADIENTS.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  emptyState: { color: 'text.secondary', fontStyle: 'italic' },
  // stack that contains draggable items
  columnStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minHeight: 48,
    p: 1,
    transition: 'background-color 0.12s ease-in-out',
  },
  // visual style when a draggable is over the column
  columnStackOver: {
    backgroundColor: 'var(--card-bg, #f2f7ff)',
    borderRadius: 2,
    p: 1,
    border: '2px dashed',
    borderColor: 'var(--header-color, #d6e3ff)',
  },
};
