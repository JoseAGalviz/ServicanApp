import { StyleSheet } from 'react-native';
import Theme from '../constants/Theme';

export default StyleSheet.create({
  safeArea:        { flex: 1, backgroundColor: Theme.colors.background },
  scroll:          { padding: 16, paddingBottom: 40 },

  headerCard:      { backgroundColor: Theme.colors.dark, borderRadius: 14, padding: 24, alignItems: 'center', marginBottom: 16, ...Theme.shadow.md },
  avatar:          { width: 60, height: 60, borderRadius: 30, backgroundColor: Theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  companyName:     { fontSize: 18, fontWeight: '800', color: '#fff', textAlign: 'center' },
  slogan:          { fontSize: 12, color: Theme.colors.light, marginTop: 4, textAlign: 'center' },

  card:            { backgroundColor: Theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, ...Theme.shadow.xs },
  cardLast:        { backgroundColor: Theme.colors.surface, borderRadius: 12, padding: 16, ...Theme.shadow.xs },

  cardHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle:    { fontSize: 12, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  sectionTitleEdit:{ fontSize: 13, fontWeight: '700', color: Theme.colors.primary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 16 },

  editButton:      { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Theme.colors.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  editButtonText:  { fontSize: 12, fontWeight: '700', color: Theme.colors.primary },

  infoRow:         { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  infoIcon:        { width: 26, marginTop: 1 },
  infoLabel:       { fontSize: 10, color: Theme.colors.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue:       { fontSize: 14, marginTop: 2 },
  infoValueEmpty:  { fontSize: 14, color: Theme.colors.light, marginTop: 2 },

  fieldGroup:      { marginBottom: 14 },
  fieldLabel:      { fontSize: 11, fontWeight: '700', color: Theme.colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 },
  input:           { backgroundColor: Theme.colors.surfaceAlt, borderWidth: 1, borderColor: Theme.colors.border, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 14, color: Theme.colors.text },
  inputMultiline:  { height: 70, textAlignVertical: 'top' },

  actionRow:       { flexDirection: 'row', gap: 10, marginTop: 6 },
  cancelBtn:       { flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.border, alignItems: 'center' },
  cancelBtnText:   { fontSize: 14, fontWeight: '600', color: Theme.colors.muted },
  saveBtn:         { flex: 1, paddingVertical: 13, borderRadius: 10, backgroundColor: Theme.colors.primary, alignItems: 'center', ...Theme.shadow.sm },
  saveBtnText:     { fontSize: 14, fontWeight: '700', color: '#fff' },
});
