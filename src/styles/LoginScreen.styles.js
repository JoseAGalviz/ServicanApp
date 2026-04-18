import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', backgroundColor: Theme.colors.dark },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
  card: {
    width: '100%', maxWidth: 360,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.xl,
    paddingVertical: Theme.spacing.xxxl,
    paddingHorizontal: Theme.spacing.xxl,
    alignItems: 'center',
    ...Theme.shadow.lg,
  },
  logoContainer: { marginBottom: Theme.spacing.xl, alignItems: 'center' },
  appName: { fontSize: 28, fontWeight: '800', color: Theme.colors.primary, letterSpacing: -0.5 },
  appSlogan: { fontSize: 11, color: Theme.colors.muted, marginTop: 2, letterSpacing: 0.3 },
  title: { fontSize: 18, fontWeight: '700', color: Theme.colors.text, marginBottom: Theme.spacing.xxl },
  input: {
    width: '100%', paddingVertical: Theme.spacing.md, paddingHorizontal: Theme.spacing.lg,
    borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md,
    marginBottom: Theme.spacing.lg, backgroundColor: Theme.colors.surfaceAlt,
    fontSize: 15, color: Theme.colors.text,
  },
  passwordContainer: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.lg, position: 'relative' },
  passwordInputBase: { flex: 1, marginBottom: 0 },
  showPasswordButton: { position: 'absolute', right: Theme.spacing.lg, padding: 6 },
  showPasswordText: { fontSize: 18, color: Theme.colors.muted },
  loginButton: {
    width: '100%', backgroundColor: Theme.colors.primary, borderRadius: Theme.radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: Theme.spacing.sm, ...Theme.shadow.sm,
  },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  versionText: { fontSize: 11, color: Theme.colors.muted, marginTop: Theme.spacing.xl },
});
