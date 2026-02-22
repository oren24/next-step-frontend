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
    overflow: 'hidden',
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
    overflow: 'hidden',
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
  header: { px: 1.25, py: 0.75, display: 'flex', alignItems: 'center', gap: 1 },
  avatar: { bgcolor: 'primary.main', width: 44, height: 44, borderRadius: 2, flexShrink: 0 },
  title: { fontWeight: 700, fontSize: '15px', color: 'text.primary' },
  subheader: { color: 'text.secondary', fontSize: '13px', fontWeight: 500 },
  action: { display: 'flex', gap: 0.5, ml: 'auto' },
  content: { pt: 0.5, px: 1.25 },
  chipRow: { 
    display: 'flex',
    flexWrap: 'wrap', 
    mb: 1, 
    gap: '6px',
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
