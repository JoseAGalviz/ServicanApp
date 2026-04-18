import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const printAndSharePdf = async (html, fileName = 'documento') => {
  const { uri } = await Print.printToFileAsync({ html });
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Compartir ${fileName}`,
      UTI: 'com.adobe.pdf',
    });
  }
};
