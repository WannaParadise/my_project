import { Router } from 'express';
import { UserController } from '../controller/user.controller';

export const UserRoutes = Router()
  .get('/', UserController.getAllUsers)
  .get('/:id', UserController.getUserById)
  .post('/', UserController.createUser)
  .put('/:id', UserController.updateUser)
  .delete('/:id', UserController.deleteUser)
  .post('/upload-image/:id', UserController.uploadImage)
  .post('/generate-pdf', UserController.generatePdf);