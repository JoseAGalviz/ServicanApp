import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.md,
    margin: Theme.spacing.lg, paddingHorizontal: Theme.spacing.md,
    borderWidth: 1, borderColor: Theme.colors.border, ...Theme.shadow.xs,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: Theme.colors.text, marginLeft: 8 },
  list: { paddingHorizontal: Theme.spacing.lg, paddingBottom: 100 },
  card: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.md,
    padding: Theme.spacing.lg, marginBottom: Theme.spacing.md,
    flexDirection: 'row', alignItems: 'center', ...Theme.shadow.sm,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: Theme.spacing.md,
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: Theme.colors.primary },
  cardContent: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: Theme.colors.text },
  cardEmpresa: { fontSize: 12, color: Theme.colors.muted, marginTop: 1 },
  cardTel: { fontSize: 12, color: Theme.colors.muted, marginTop: 1 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center',
    ...Theme.shadow.lg,
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Theme.colors.muted, marginTop: 12 },
  emptyText: { fontSize: 13, color: Theme.colors.light, marginTop: 4, textAlign: 'center' },
});
