import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  scroll: { padding: Theme.spacing.lg, paddingBottom: 60 },

  fieldGroup: { marginBottom: Theme.spacing.lg },
  label: {
    fontSize: 12, fontWeight: '700', color: Theme.colors.muted,
    textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: Theme.spacing.xs,
  },
  optional: { fontWeight: '400', textTransform: 'none', fontSize: 11 },
  hint: { fontSize: 11, color: Theme.colors.light, marginTop: 4 },

  input: {
    backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md, paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12, fontSize: 15, color: Theme.colors.text,
  },
  inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },

  pickerBtn: {
    backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md, paddingHorizontal: Theme.spacing.md,
    paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  pickerBtnDisabled: { opacity: 0.5 },
  pickerText: { fontSize: 15, color: Theme.colors.text, flex: 1 },
  pickerPlaceholder: { fontSize: 15, color: Theme.colors.light, flex: 1 },
  clearBtn: {
    fontSize: 12, color: Theme.colors.error, marginTop: 4,
    alignSelf: 'flex-start', paddingVertical: 2,
  },

  estadoRow: { flexDirection: 'row', gap: 10 },
  estadoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: Theme.radius.md,
    borderWidth: 1.5, borderColor: Theme.colors.warning,
  },
  estadoBtnActive: { backgroundColor: Theme.colors.warning, borderColor: Theme.colors.warning },
  estadoBtnSuccess: { borderColor: Theme.colors.success },
  estadoBtnSuccessActive: { backgroundColor: Theme.colors.success, borderColor: Theme.colors.success },
  estadoBtnText: { fontSize: 14, fontWeight: '600', color: Theme.colors.text },
  estadoBtnTextActive: { color: '#fff' },

  saveButton: {
    backgroundColor: Theme.colors.primary, borderRadius: Theme.radius.md,
    paddingVertical: 16, alignItems: 'center', marginBottom: Theme.spacing.md,
    ...Theme.shadow.md,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  deleteButton: {
    backgroundColor: Theme.colors.errorLight, borderRadius: Theme.radius.md,
    paddingVertical: 13, alignItems: 'center',
    borderWidth: 1, borderColor: Theme.colors.error,
    marginBottom: Theme.spacing.lg,
  },
  deleteButtonText: { color: Theme.colors.error, fontSize: 14, fontWeight: '600' },

  // Modals
  modalOverlay: {
    flex: 1, backgroundColor: Theme.colors.overlay, justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.surface, borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl, padding: Theme.spacing.xl,
    paddingBottom: 36, maxHeight: '75%',
  },
  modalTitle: {
    fontSize: 18, fontWeight: '700', color: Theme.colors.text,
    marginBottom: Theme.spacing.lg, textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Theme.colors.border,
  },
  modalOptionName: { fontSize: 15, fontWeight: '600', color: Theme.colors.text },
  modalOptionSub: { fontSize: 12, color: Theme.colors.muted, marginTop: 2 },
  emptyText: { textAlign: 'center', color: Theme.colors.muted, paddingVertical: 24, fontSize: 14 },
  modalCancelBtn: {
    marginTop: Theme.spacing.lg, paddingVertical: 13,
    borderRadius: Theme.radius.md, borderWidth: 1, borderColor: Theme.colors.border,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: Theme.colors.muted },
});
