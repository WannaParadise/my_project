import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import { createPDF } from '../utils/createPDF';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from 'express-fileupload';




export class UserController {
  static async getAllUsers(_: Request, res: Response) {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    res.status(200).json(users);
  }

  static async getUserById(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  }

  static async createUser(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const newUser = userRepository.create(req.body);
    await userRepository.save(newUser);
    res.status(201).json(newUser);
  }

  static async updateUser(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    userRepository.merge(user, req.body);
    await userRepository.save(user);
    res.status(200).json(user);
  }

  static async deleteUser(req: Request, res: Response) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await userRepository.remove(user);
    res.status(200).json({ message: 'User deleted.' });
  }

  static async uploadImage(req: Request, res: Response) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const uploadedFile = req.files.image as UploadedFile;
    const imageName = `${user.id}_${uploadedFile.name}`;

    const imageData = uploadedFile.data;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);

    try {
      fs.writeFileSync(imagePath, imageData);
      user.image = imagePath;
      const updatedUser = await userRepository.save(user);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while uploading the image.' });
    }
  }

  static async generatePdf(req: Request, res: Response) {
    try {
      const email = req.body.email;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const pdfBuffer = await createPDF(user);
      user.pdf = pdfBuffer;
      await userRepository.save(user);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while generating the PDF.' });
    }
  }
}
