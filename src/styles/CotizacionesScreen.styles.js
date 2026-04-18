import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  filterScroll: { maxHeight: 52 },
  filterRow: { flexDirection: 'row', paddingHorizontal: Theme.spacing.lg, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: Theme.radius.pill,
    backgroundColor: Theme.colors.surface, borderWidth: 1.5, borderColor: Theme.colors.border,
  },
  filterChipActive: { backgroundColor: Theme.colors.primary, borderColor: Theme.colors.primary },
  filterChipText: { fontSize: 12, fontWeight: '600', color: Theme.colors.muted },
  filterChipTextActive: { color: '#fff' },

  list: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 100 },

  card: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg, marginBottom: Theme.spacing.md,
    ...Theme.shadow.sm, borderLeftWidth: 4, borderLeftColor: Theme.colors.border,
  },
  cardAprobada:  { borderLeftColor: Theme.colors.success },
  cardEnviada:   { borderLeftColor: Theme.colors.info },
  cardRechazada: { borderLeftColor: Theme.colors.error },
  cardBorrador:  { borderLeftColor: Theme.colors.muted },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardNum: { fontSize: 15, fontWeight: '800', color: Theme.colors.text, letterSpacing: -0.2 },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: Theme.radius.pill },
  statusText: { fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.4 },

  cardCliente: { fontSize: 13, color: Theme.colors.muted, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: Theme.colors.border,
  },
  cardDate: { fontSize: 11, color: Theme.colors.light },
  cardTotal: { fontSize: 18, fontWeight: '800', color: Theme.colors.primary },
  cardMoneda: { fontSize: 10, color: Theme.colors.muted, marginBottom: 1 },

  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center',
    ...Theme.shadow.lg,
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Theme.colors.muted, marginTop: 12 },
  emptyText: { fontSize: 13, color: Theme.colors.light, marginTop: 4, textAlign: 'center' },
});
