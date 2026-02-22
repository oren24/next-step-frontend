import { GRADIENTS } from '../../layout/styles/sidebarStyles';

// Status-specific gradient backgrounds
export const STATUS_GRADIENTS = {
  Wishlist: 'linear-gradient(180deg, #EBE4FF 0%, #F4F2FA 100%)',
  Applied: 'linear-gradient(180deg, #FFD3D3 0%, #FAF6F2 100%)',
  Interviewing: 'linear-gradient(180deg, #FDF4E1 0%, #FAF6F2 100%)',
  Offer: 'linear-gradient(180deg, #D1FAE5 0%, #F4F2FA 100%)',
  Rejected: 'linear-gradient(180deg, #F3F4F6 0%, #F9FAFB 100%)',
};

export const CARD = {
  root: {
    width: 335,
    height: 196,
    mb: 1.5,
    borderRadius: '10px',
    position: 'relative',
    overflow: 'visible',
    transition: 'box-shadow 0.14s ease-in-out, transform 0.14s ease-in-out',
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    opacity: 1,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
    }
  },
  // Card with status-specific gradient background
  rootWithGradient: {
    width: 335,
    height: 196,
    mb: 1.5,
    borderRadius: '10px',
    position: 'relative',
    overflow: 'visible',
    transition: 'box-shadow 0.14s ease-in-out, transform 0.14s ease-in-out',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    opacity: 1,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
    }
  },
  header: { position: 'relative', px: 0, py: 0, height: '80px' },
  avatar: { 
    bgcolor: 'primary.main', 
    width: 32, 
    height: 32, 
    borderRadius: 2, 
    position: 'absolute',
    top: '22px',
    left: '12px',
    opacity: 1
  },
  titleContainer: {
    position: 'absolute',
    top: '19px',
    left: '53px',
    width: 186,
    height: 37,
    opacity: 1
  },
  title: { fontWeight: 700, fontSize: '15px', color: 'text.primary' },
  subheader: { color: 'text.secondary', fontSize: '13px', fontWeight: 500 },
  action: { display: 'flex', gap: 0.5, ml: 'auto', position: 'relative' },
  content: { pt: 0.5, px: 1.25, position: 'relative' },
  // Three dots menu button - dots always visible, background only on hover/click
  menuButton: {
    position: 'absolute',
    top: '6px',
    right: '8px',
    width: 26,
    height: 26,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    backgroundColor: 'transparent',
    borderRadius: '4px',
    padding: 0,
    zIndex: 10,
    '&:hover, &.active': {
      backgroundColor: '#D1D1D1',
    }
  },
  // Dropdown menu - positioned relative to card
  dropdownMenu: {
    position: 'absolute',
    top: '48px',
    right: '12px',
    width: 192,
    height: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1001,
    opacity: 1,
  },
  // Menu items
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'default',
    padding: '4px 0',
    opacity: 0.7,
  },
  menuItemText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#3A3A3A',
  },
  deletemenuItemText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#C83737',
  },
  chipRow: { 
    display: 'flex',
    flexWrap: 'wrap', 
    mb: 1,
    top: '50px', 
    rowGap: '4px',
    columnGap: '6px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  metaRow: { mt: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: {
    height: 21,
    opacity: 1,
    borderRadius: '100px',
    pt: '2px',
    pr: '2px',
    pb: '2px',
    pl: '2px',
    backgroundColor: '#FFFFFF',
    color: 'text.primary',
    fontSize: '12px',
    fontWeight: 500,
  },
  metaText: { color: 'text.secondary', fontSize: '12px' },
  locationText: { color: 'text.secondary', fontSize: '12px' }
};
