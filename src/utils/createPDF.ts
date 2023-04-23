import { User } from '../entity/user.entity';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const createPDF = async (user: User): Promise<Buffer> => {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(16).text(`${user.firstName} ${user.lastName}`, 50, 50);

  if (user.image) {
    const imgPath = user.image;
    const img = fs.readFileSync(imgPath);
    doc.image(img, 50, 100, { fit: [250, 250] });
  }

  doc.end();
  return Buffer.concat(buffers);
};
