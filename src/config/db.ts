import mongoose from 'mongoose';
import logger from '../api/utils/logger'
import { DATABASE_URL, DB_NAME } from '.';

mongoose.set('strictQuery', true);
const InitiateDB = async () => {
  try {
    // @ts-ignore
    mongoose.connect(DATABASE_URL, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME,
    }).then(() => {
    logger.log({
      level: 'info',
      message: 'Database connection successful',
    });
  })
  } catch (ex:any) {
    logger.log({
      level: 'error',
      message: 'MongoDB connection error. Please make sure MongoDB is running. ' + ex.message,
    });
    process.exit(1);
  }
};

export default InitiateDB;
