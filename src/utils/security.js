import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import models from '../database/models';

const { passwordManager } = models;

const SIGN_OPTION = {
  issuer: 'Authorization/Resource/OneKiosk Africa',
  subject: 'Authentication Bearer',
  expiresIn: '30d'
};

const secret = process.env.JWT_SECRET;

export default class Security {
  static async generateNewPassword(password) {
    try {
      const hash = await bcrypt.hash(password, 6);
      return hash;
    } catch (error) {
      return error;
    }
  }

  static async generateNewToken(payload) {
    try {
      const token = await jwt.sign({ payload }, secret, SIGN_OPTION);
      return token;
    } catch (error) {
      return error;
    }
  }

  static async comparePassword(password, id) {
    try {
      const user = await passwordManager.findOne({ where: { user_id: id } });
      const compare = await bcrypt.compare(password, user.current_password);
      if (compare) {
        return compare;
      }
      return await bcrypt.compare(password, user.old_password);
    } catch (error) {
      return error;
    }
  }
}
