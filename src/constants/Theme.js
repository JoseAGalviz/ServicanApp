// ─── Servican Design System ───────────────────────────────────────────────────
// Security-grade corporate theme. Navy blue + amber accent.

const Theme = {
  colors: {
    // Brand
    primary:       '#1B3A6B',  // Deep navy – trust, security
    primaryDark:   '#0F2447',
    primaryLight:  '#E8EEF7',

    // Accent
    accent:        '#E5A623',  // Amber gold – alerts, CTAs
    accentLight:   '#FDF5E0',

    // Neutrals
    dark:          '#0D1F3C',
    text:          '#1A1F36',
    muted:         '#64748B',
    light:         '#94A3B8',

    // Semantic
    success:       '#10B981',
    successLight:  '#ECFDF5',
    successDark:   '#047857',
    warning:       '#F59E0B',
    warningLight:  '#FFFBEB',
    error:         '#EF4444',
    errorLight:    '#FEF2F2',
    info:          '#3B82F6',
    infoLight:     '#EFF6FF',

    // Surfaces
    background:    '#F0F4F8',
    surface:       '#FFFFFF',
    surfaceAlt:    '#F8FAFC',

    // Borders
    border:        '#E2E8F0',
    borderStrong:  '#CBD5E1',

    // Utility
    overlay:       'rgba(0,0,0,0.5)',
    white:         '#FFFFFF',
    black:         '#000000',

    // Status badges
    statusBorrador:  '#94A3B8',
    statusEnviada:   '#3B82F6',
    statusAprobada:  '#10B981',
    statusRechazada: '#EF4444',
  },

  typography: {
    display:    { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, lineHeight: 36 },
    title:      { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, lineHeight: 30 },
    heading:    { fontSize: 18, fontWeight: '600', lineHeight: 26 },
    subheading: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    body:       { fontSize: 14, fontWeight: '400', lineHeight: 22 },
    small:      { fontSize: 12, fontWeight: '400', lineHeight: 18 },
    tiny:       { fontSize: 10, fontWeight: '500', lineHeight: 16 },
    label:      { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  },

  spacing: {
    xs:   4,
    sm:   8,
    md:   12,
    lg:   16,
    xl:   20,
    xxl:  24,
    xxxl: 32,
  },

  radius: {
    sm:   6,
    md:   10,
    lg:   14,
    xl:   20,
    xxl:  24,
    pill: 100,
  },

  shadow: {
    xs: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6 },
  },
};

export default Theme;
