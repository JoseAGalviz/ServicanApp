import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { padding: Theme.spacing.lg, paddingBottom: 40 },
  headerCard: {
    backgroundColor: Theme.colors.dark, borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl, marginBottom: Theme.spacing.lg,
  },
  docNum: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  docDate: { fontSize: 13, color: Theme.colors.light, marginTop: 4 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: Theme.radius.pill, marginTop: 12 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.md,
    padding: Theme.spacing.lg, marginBottom: Theme.spacing.md, ...Theme.shadow.xs,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Theme.spacing.md },
  clienteName: { fontSize: 16, fontWeight: '700', color: Theme.colors.text },
  clienteInfo: { fontSize: 13, color: Theme.colors.muted, marginTop: 2, lineHeight: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.radius.sm, padding: 8, marginBottom: 4 },
  tableHeaderText: { fontSize: 11, fontWeight: '700', color: Theme.colors.primary },
  itemRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  itemDesc: { fontSize: 13, color: Theme.colors.text },
  itemQty: { fontSize: 13, color: Theme.colors.muted, textAlign: 'center' },
  itemPrice: { fontSize: 13, color: Theme.colors.muted, textAlign: 'right' },
  itemTotal: { fontSize: 13, fontWeight: '700', color: Theme.colors.text, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  totalLabel: { fontSize: 13, color: Theme.colors.muted },
  totalValue: { fontSize: 13, fontWeight: '600', color: Theme.colors.text },
  totalFinalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1.5, borderTopColor: Theme.colors.primary, marginTop: 6 },
  totalFinalLabel: { fontSize: 16, fontWeight: '700', color: Theme.colors.text },
  totalFinalValue: { fontSize: 20, fontWeight: '800', color: Theme.colors.primary },
  notesText: { fontSize: 13, color: Theme.colors.muted, lineHeight: 20 },
  pdfButton: {
    backgroundColor: Theme.colors.accent, borderRadius: Theme.radius.md,
    paddingVertical: 15, alignItems: 'center', flexDirection: 'row',
    justifyContent: 'center', gap: 8, ...Theme.shadow.md, marginBottom: Theme.spacing.md,
  },
  pdfButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  statusBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Theme.radius.pill, borderWidth: 1.5 },
  statusBtnText: { fontSize: 12, fontWeight: '700' },
  deleteButton: {
    backgroundColor: Theme.colors.errorLight, borderRadius: Theme.radius.md,
    paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: Theme.colors.error,
  },
  deleteButtonText: { color: Theme.colors.error, fontSize: 14, fontWeight: '600' },

  // Modal pago
  modalOverlay: {
    flex: 1, backgroundColor: Theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Theme.colors.surface, borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl, padding: Theme.spacing.xl,
    paddingBottom: 36, maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18, fontWeight: '700', color: Theme.colors.text,
    marginBottom: Theme.spacing.lg, textAlign: 'center',
  },
  modalLabel: {
    fontSize: 12, fontWeight: '700', color: Theme.colors.muted,
    textTransform: 'uppercase', letterSpacing: 0.4,
    marginBottom: Theme.spacing.xs, marginTop: Theme.spacing.md,
  },
  modalInput: {
    backgroundColor: Theme.colors.surfaceAlt, borderWidth: 1,
    borderColor: Theme.colors.border, borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md, paddingVertical: 10,
    fontSize: 14, color: Theme.colors.text,
  },
  modalTextarea: { height: 72, textAlignVertical: 'top', paddingTop: 10 },
  monedaRow: { flexDirection: 'row', gap: 8 },
  monedaBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Theme.radius.md,
    borderWidth: 1.5, borderColor: Theme.colors.border, alignItems: 'center',
  },
  monedaBtnActive: { borderColor: Theme.colors.primary, backgroundColor: Theme.colors.primaryLight },
  monedaBtnText: { fontSize: 13, fontWeight: '700', color: Theme.colors.muted },
  monedaBtnTextActive: { color: Theme.colors.primary },
  modalActions: {
    flexDirection: 'row', gap: 10, marginTop: Theme.spacing.xl,
  },
  modalCancelBtn: {
    flex: 1, paddingVertical: 13, borderRadius: Theme.radius.md,
    borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: Theme.colors.muted },
  modalConfirmBtn: {
    flex: 2, paddingVertical: 13, borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.successDark, alignItems: 'center',
  },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
