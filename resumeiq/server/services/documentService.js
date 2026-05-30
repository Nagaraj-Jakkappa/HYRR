const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

const getCandidateName = (text, filename) => {
  const firstLine = text.split('\n')[0].trim();
  return firstLine.length > 2 && firstLine.length < 50 ? firstLine : filename.split('.')[0];
};

const parseParagraphs = (text) => {
  const paragraphs = [];
  let currentType = 'text';
  let currentLines = [];

  const pushCurrent = () => {
    if (currentLines.length > 0) {
      paragraphs.push({ type: currentType, content: currentLines.join(' ') });
      currentLines = [];
    }
  };

  const rawLines = text.split('\n');
  rawLines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      pushCurrent();
      currentType = 'text';
    } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
      pushCurrent();
      paragraphs.push({ type: 'header', content: trimmed });
      currentType = 'text';
    } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
      pushCurrent();
      currentType = 'bullet';
      currentLines.push(trimmed);
    } else {
      currentLines.push(trimmed);
    }
  });
  pushCurrent();
  
  return paragraphs;
};

exports.generateOptimizedPDF = (res, optimizedText, rawText, originalName, jobId) => {
  const candidateName = getCandidateName(rawText, originalName);
  const safeFileName = `${candidateName.replace(/\s+/g, '_')}_Optimized`;

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}.pdf"`);
  doc.pipe(res);

  doc.fillColor('#000000').fontSize(22).font('Helvetica-Bold').text(candidateName.toUpperCase(), { align: 'center' });
  doc.moveDown(1);

  const paragraphs = parseParagraphs(optimizedText);
  paragraphs.forEach(p => {
    if (p.type === 'header') {
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text(p.content);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
      doc.moveDown(0.5);
    } else if (p.type === 'bullet') {
      doc.fontSize(11).font('Helvetica').fillColor('#374151').text(p.content, { align: 'justify', lineGap: 2 });
    } else {
      doc.fontSize(11).font('Helvetica').fillColor('#374151').text(p.content, { align: 'justify', lineGap: 2 });
      doc.moveDown(0.5);
    }
  });

  doc.fontSize(9).fillColor('#9CA3AF').text(`Optimized for ${jobId.jobTitle} at ${jobId.companyName} by Hyrr`, 50, 750, { align: 'center' });
  doc.end();
};

exports.generateOptimizedDocx = async (res, optimizedText, rawText, originalName) => {
  const candidateName = getCandidateName(rawText, originalName);
  const safeFileName = `${candidateName.replace(/\s+/g, '_')}_Optimized`;

  const paragraphs = parseParagraphs(optimizedText);
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: candidateName, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        ...paragraphs.map(p => {
          if (p.type === 'header') {
            return new Paragraph({
              text: p.content,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 120 },
            });
          } else {
            return new Paragraph({
              text: p.content,
              spacing: { before: 120, after: 120 },
            });
          }
        }),
        new Paragraph({
          spacing: { before: 400 },
          children: [new TextRun({ text: `Optimized by Hyrr`, color: "9CA3AF", size: 18, italics: true })]
        })
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}.docx"`);
  res.send(buffer);
};
