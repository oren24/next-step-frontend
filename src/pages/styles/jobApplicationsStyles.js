import { GRADIENTS } from '../../components/layout/styles/sidebarStyles';
import { TYPOGRAPHY as TOP_TYPO } from '../../components/layout/styles/topBarStyles';

// Status color scheme matching Figma (adjusted for dark mode)
export const STATUS_COLORS = {
  Wishlist: { header: '#7950F2', headerBg: 'rgba(129,143,248,0.12)', cardBg: 'transparent', border: '#818CF8' },
  Applied: { header: '#FA5252', headerBg: 'rgba(248,113,113,0.12)', cardBg: 'transparent', border: '#F87171' },
  Interviewing: { header: '#FAB005', headerBg: 'rgba(251,191,36,0.12)', cardBg: 'transparent', border: '#FBBF24' },
  Offer: { header: '#22E656', headerBg: 'rgba(52,211,153,0.12)', cardBg: 'transparent', border: '#34D399' },
  Rejected: { header: '#9CA3AF', headerBg: 'rgba(156,163,175,0.12)', cardBg: 'transparent', border: '#9CA3AF' },
};

export const BOARD = {
  container: {
    width: '100%',
    p: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    bgcolor: 'background.paper',
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
    px: 0,
    // smooth scrolling feel
    WebkitOverflowScrolling: 'touch',
  },
  columnPaper: {
    // On mobile columns should be full-width and stacked; on desktop use fixed column width
    width: { xs: '100%', md: 367 },
    minWidth: { md: 320 },
    maxWidth: { md: 400 },
    p: 2,
    flex: { xs: '0 0 auto', md: '0 0 367px' },
    bgcolor: 'background.paper',
    borderRadius: 2,
    border: 'none',
    boxShadow: 'none',
    // gentle lift on hover (desktop)
    '&:hover': {
      boxShadow: 'none',
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
    p: 0,
    mt: 2,
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
  // Generic status header styles
  statusHeader: {
    width: 335,
    height: 44,
    opacity: 1,
    borderRadius: '8px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderBottom: 'none',
    backgroundColor: 'transparent',
    margin: '0 auto', // Center the header
  },
  // Base styles for all status icons
  baseStatusIcon: {
    position: 'absolute',
    opacity: 1,
    filter: 'brightness(0) saturate(100%)',
  },
  // Base styles for all plus icons
  basePlusIcon: {
    position: 'absolute',
    top: '10px',
    left: '296px',
    width: 18,
    height: 18,
    opacity: 1,
    filter: 'brightness(0) saturate(100%)',
  },
  // Individual icon unique properties only
  wishlistIcon: {
    top: '25%',
    left: '5.6%',
    width: 23,
    height: 23,
    filter: 'brightness(0) saturate(100%) invert(20%) sepia(69%) saturate(3151%) hue-rotate(243deg) brightness(98%) contrast(97%)',
  },
  appliedIcon: {
    top: '26%',
    left: '5.6%',
    width: 20,
    height: 22,
    filter: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(6142%) hue-rotate(338deg) brightness(102%) contrast(96%)',
  },
  interviewingIcon: {
    top: '28%',
    left: '5.6%',
    width: 22,
    height: 20,
    filter: 'brightness(0) saturate(100%) invert(66%) sepia(63%) saturate(1425%) hue-rotate(10deg) brightness(104%) contrast(98%)',
  },
  offerIcon: {
    top: '22%',
    left: '5.6%',
    width: 25,
    height: 25,
    filter: 'brightness(0) saturate(100%) invert(58%) sepia(60%) saturate(402%) hue-rotate(78deg) brightness(119%) contrast(89%)',
  },
  rejectedIcon: {
    top: '28%',
    left: '3.6%',
    width: 20,
    height: 20,
    filter: 'brightness(0) saturate(100%) invert(67%) sepia(7%) saturate(928%) hue-rotate(169deg) brightness(96%) contrast(88%)',
  },
  statusTitle: {
    position: 'absolute',
    top: '4px',
    left: '59px',
    width: 117,
    height: 37,
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: '0%',
    ml: 0,
  },
  statusActionIcon: {
    position: 'absolute',
    top: '10px',
    left: '296px',
    width: 24,
    height: 24,
    opacity: 1,
  },
  // Plus icon unique properties only (colors)
  wishlistPlusIcon: {
    filter: 'brightness(0) saturate(100%) invert(20%) sepia(69%) saturate(3151%) hue-rotate(243deg) brightness(98%) contrast(97%)',
  },
  appliedPlusIcon: {
    filter: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(6142%) hue-rotate(338deg) brightness(102%) contrast(96%)',
  },
  interviewingPlusIcon: {
    filter: 'brightness(0) saturate(100%) invert(66%) sepia(63%) saturate(1425%) hue-rotate(10deg) brightness(104%) contrast(98%)',
  },
  offerPlusIcon: {
    filter: 'brightness(0) saturate(100%) invert(58%) sepia(60%) saturate(402%) hue-rotate(78deg) brightness(119%) contrast(89%)',
  },
  rejectedPlusIcon: {
    filter: 'brightness(0) saturate(100%) invert(67%) sepia(7%) saturate(928%) hue-rotate(169deg) brightness(96%) contrast(88%)',
  },
};
