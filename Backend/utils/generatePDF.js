export const generatePDF = (friend, expenses) => {
  return `pdf_${friend._id}_${Date.now()}.pdf`;
};
