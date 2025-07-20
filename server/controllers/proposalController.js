const PDFDocument = require('pdfkit');
const Proposal = require('../models/Proposal');
const path = require('path');
const fs = require('fs');

const createProposal = async (req, res) => {
  const { clientName, contact, description, items } = req.body;

  const totalValue = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const newProposal = new Proposal({
    clientName,
    contact,
    description,
    items,
    total: totalValue,
  });
  await newProposal.save();

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=proposal-${Date.now()}.pdf`);
  doc.pipe(res);

  // ======= Header =======
    // ======= Header =======
  const logoPath = path.join(__dirname, '../utils/logo.jpg');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 20, { width: 80 });
  }

  // Adjust vertical spacing after logo
  doc
     // ⬅️ Increased spacing
    .fontSize(20)
    .fillColor('#333')
    .text('MarsMeta Tech Pvt. Ltd.', 0, doc.y, { align: 'center' })
    .moveDown(2);

  // ======= Client Details =======
const clientInfoX = 40; // Shift to the right

doc
  .fontSize(14)
  .fillColor('#000')
  .text(`Client: ${clientName}`, clientInfoX)
  .text(`Contact: ${contact}`, clientInfoX)
  .moveDown()
  .fontSize(13)
  .text(description, clientInfoX)
  .moveDown(2);



  // ======= Table Header =======
  const tableTop = doc.y;
  doc
    .fontSize(12)
    .fillColor('#ffffff')
    .rect(40, tableTop, 520, 25)
    .fill('#3498db')
    .stroke()
    .fillColor('#ffffff')
    .text('S.No', 50, tableTop + 7)
    .text('Item Name', 90, tableTop + 7)
    .text('Qty', 270, tableTop + 7)
    .text('Unit Price', 320, tableTop + 7)
    .text('Total', 430, tableTop + 7);

  doc.moveDown();

  // ======= Table Rows =======
  items.forEach((item, index) => {
    const y = doc.y + 5;
    const lineTotal = item.qty * item.price;

    doc
      .fillColor('#000000')
      .fontSize(12)
      .text(index + 1, 50, y)
      .text(item.name, 90, y)
      .text(item.qty.toString(), 270, y)
      .text(`${item.price.toLocaleString()}`, 320, y)
      .text(`${lineTotal.toLocaleString()}`, 430, y);

    doc.moveDown(0.8);
  });

  // ======= Total Section =======
  doc
    .moveDown(2)
    .fontSize(14)
    .fillColor('#2ecc71')
    .text(`Total Amount: ${totalValue.toLocaleString()}`, { align: 'right' });

  // ======= Footer =======
  doc
    .moveDown(4)
    .fontSize(10)
    .fillColor('#666666')
    .text('Thank you for choosing MarsMeta Tech.', { align: 'center' })
    .text("Let's build the future together.", { align: 'center' });

  doc.end();
};

module.exports = { createProposal };
