import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: Theme.spacing.lg, paddingBottom: 32 },
  greeting: { fontSize: 22, fontWeight: '700', color: Theme.colors.text, marginBottom: 2 },
  subtitle: { fontSize: 13, color: Theme.colors.muted, marginBottom: Theme.spacing.xl },
  statsRow: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.xl },
  statCard: {
    flex: 1, backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg, alignItems: 'center', ...Theme.shadow.sm,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: Theme.colors.primary, marginTop: 6 },
  statLabel: { fontSize: 11, color: Theme.colors.muted, marginTop: 2, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Theme.spacing.md },
  actionButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md, padding: Theme.spacing.lg, marginBottom: Theme.spacing.md,
    ...Theme.shadow.xs, borderWidth: 1, borderColor: Theme.colors.border,
  },
  actionIconBox: {
    width: 40, height: 40, borderRadius: Theme.radius.md,
    alignItems: 'center', justifyContent: 'center', marginRight: Theme.spacing.md,
  },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Theme.colors.text },
  actionSub: { fontSize: 11, color: Theme.colors.muted, marginTop: 1 },
  recentItem: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.md,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.sm,
    ...Theme.shadow.xs, flexDirection: 'row', alignItems: 'center',
  },
  recentTitle: { fontSize: 14, fontWeight: '600', color: Theme.colors.text, flex: 1 },
  recentSub: { fontSize: 11, color: Theme.colors.muted, marginTop: 1 },
  emptyBox: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { color: Theme.colors.muted, fontSize: 13 },
});
