import { StyleSheet, Dimensions } from 'react-native';
import Theme from '../constants/Theme';

const CELL = (Dimensions.get('window').width - Theme.spacing.lg * 2 - Theme.spacing.md * 2) / 7;

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { padding: Theme.spacing.lg, paddingBottom: 100 },

  // Month navigation
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  navBtn: { padding: Theme.spacing.sm },
  monthTitle: {
    fontSize: 18, fontWeight: '700', color: Theme.colors.text, letterSpacing: -0.2,
  },

  // Calendar card
  calendarCard: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.lg,
    ...Theme.shadow.sm,
  },

  // Day header row
  weekRow: { flexDirection: 'row' },
  dayCell: {
    width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center',
  },
  dayHeader: {
    fontSize: 11, fontWeight: '700', color: Theme.colors.muted,
    textTransform: 'uppercase', letterSpacing: 0.3,
  },

  // Day cells
  dayCellSelected: {
    backgroundColor: Theme.colors.primary, borderRadius: CELL / 2,
  },
  dayCellToday: {
    backgroundColor: Theme.colors.primaryLight, borderRadius: CELL / 2,
  },
  dayText: { fontSize: 14, fontWeight: '500', color: Theme.colors.text },
  dayTextSelected: { color: '#fff', fontWeight: '700' },
  dayTextToday: { color: Theme.colors.primary, fontWeight: '700' },

  // Service dots
  dot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: Theme.colors.accent, position: 'absolute', bottom: 3,
  },
  dotSelected: { backgroundColor: Theme.colors.accentLight },

  // Service list section
  listSection: { flex: 1 },
  listTitle: {
    fontSize: 16, fontWeight: '700', color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },

  // Empty state
  emptyDay: { alignItems: 'center', paddingVertical: Theme.spacing.xxxl },
  emptyDayText: {
    marginTop: Theme.spacing.md, fontSize: 14, color: Theme.colors.light, textAlign: 'center',
  },

  // Servicio card
  servicioCard: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.md,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.sm,
    flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 3, borderLeftColor: Theme.colors.warning,
    ...Theme.shadow.xs,
  },
  servicioCardDone: {
    borderLeftColor: Theme.colors.success, opacity: 0.8,
  },
  checkBtn: { marginRight: Theme.spacing.md },
  servicioInfo: { flex: 1 },
  servicioTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  servicioHora: { fontSize: 13, fontWeight: '700', color: Theme.colors.primary },
  cotizRef: {
    fontSize: 10, fontWeight: '700', color: Theme.colors.accent,
    backgroundColor: Theme.colors.accentLight,
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: Theme.radius.sm,
  },
  servicioDesc: { fontSize: 14, fontWeight: '600', color: Theme.colors.text },
  servicioDescDone: {
    textDecorationLine: 'line-through', color: Theme.colors.muted,
  },
  servicioClientRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  servicioCliente: { fontSize: 12, color: Theme.colors.muted },
  editBtn: { padding: Theme.spacing.sm },
  deleteBtn: { padding: Theme.spacing.sm },

  // FAB
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Theme.shadow.lg,
  },
});
