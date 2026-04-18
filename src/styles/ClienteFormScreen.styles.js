import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { padding: Theme.spacing.lg, paddingBottom: 40 },
  fieldGroup: { marginBottom: Theme.spacing.lg },
  label: { fontSize: 12, fontWeight: '600', color: Theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  input: {
    backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md, paddingVertical: 12, paddingHorizontal: Theme.spacing.lg,
    fontSize: 15, color: Theme.colors.text,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: Theme.colors.primary, borderRadius: Theme.radius.md,
    paddingVertical: 15, alignItems: 'center', marginTop: Theme.spacing.md, ...Theme.shadow.md,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteButton: {
    backgroundColor: Theme.colors.error, borderRadius: Theme.radius.md,
    paddingVertical: 13, alignItems: 'center', marginTop: Theme.spacing.md,
  },
  deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
