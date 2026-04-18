import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  header: {
    padding: Theme.spacing.xl, paddingTop: 48,
    backgroundColor: Theme.colors.dark, marginBottom: Theme.spacing.sm,
  },
  appName: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  appSlogan: { fontSize: 11, color: Theme.colors.light, marginTop: 2 },
  divider: { height: 1, backgroundColor: Theme.colors.border, marginVertical: 8 },
  userName: { fontSize: 14, fontWeight: '600', color: Theme.colors.text, marginTop: Theme.spacing.xl },
  userRole: { fontSize: 12, color: Theme.colors.muted },
  logoutButton: { marginTop: Theme.spacing.md, borderRadius: Theme.radius.md },
  logoutButtonText: { fontWeight: '700' },
});
