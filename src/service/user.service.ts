import { User } from '../entity/user.entity';
import { getRepository } from 'typeorm';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { PDFDocument, rgb } from 'pdf-lib';

export class UserService {
  private userRepository = getRepository(User);

  async createUser(userData: any) {
    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    return user;
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id: number, userData: any) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    this.userRepository.merge(user, userData);
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
  }

  async uploadImage(id: number, imagePath: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    const imageFileName = `${Date.now()}-${path.basename(imagePath)}`;
    const resizedImagePath = path.join(path.dirname(imagePath), imageFileName);
    await sharp(imagePath)
      .resize({ width: 200, height: 200, fit: 'cover' })
      .toFile(resizedImagePath);
    await fs.unlink(imagePath);
    user.image = imageFileName;
    await this.userRepository.save(user);
    return user;
  }

  async generatePdf(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.image) {
      throw new Error('User image not found');
    }
    const imagePath = path.join('uploads', user.image);
    const imageBytes = await fs.readFile(imagePath);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
    const image = await pdfDoc.embedPng(imageBytes);

    page.drawText(`${user.firstName} ${user.lastName}`, { x: 50, y: 320, font, size: 30 });
    page.drawImage(image, { x: 50, y: 120, width: 200, height: 200 });

    const pdfBytes = await pdfDoc.save();
    user.pdf = Buffer.from(pdfBytes);
    await this.userRepository.save(user);

    return { success: true };
  }
}
