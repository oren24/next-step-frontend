import { GRADIENTS } from '../../layout/styles/sidebarStyles';

export const CARD = {
  root: {
    mb: 1.5,
    borderRadius: 2,
    overflow: 'hidden',
    transition: 'box-shadow 0.14s ease-in-out, transform 0.14s ease-in-out',
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
  chipRow: { flexWrap: 'wrap', mb: 1, gap: 0.5 },
  metaRow: { mt: 1.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: {
    mr: 0.25,
    mb: 0.25,
    bgcolor: 'rgba(0,0,0,0.06)',
    color: 'text.primary',
    borderRadius: 1.5,
    px: 0.75,
    py: 0.35,
    fontSize: '12px',
    fontWeight: 500,
  },
  metaText: { color: 'text.secondary', fontSize: '12px' },
  locationText: { color: 'text.secondary', fontSize: '12px' }
};
