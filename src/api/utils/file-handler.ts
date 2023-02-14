/* eslint-disable no-multiple-empty-lines */
import multer, { MulterError } from 'multer';
import express, { response } from 'express'
import { UPLOAD_DIR } from '../../config';
import logger from './logger';
/**
 * @param request - express request
 * @param response - express response **optional
 * @param conf - an object configuration for multer ** required
 * @param conf.multiple - Boolean: wether to process multiple or not
 * @param conf.fieldName - the field name of where the file is expected
 * @param conf.fileId - a string to be used as the name of the file instead of automatic generation
 * @param conf.maxSize - maximum allowable size ( in MB) of the file
 * @param conf.encType - allowed file types
 * @returns resolve void or reject error 
 */

let fileStatusCodes = {
  tooLarge: {message: 'file too large', status: 413},
  invalidFileType: {message: 'invalid file type', status: 415},
  noFile: {message: 'no file provided', status: 400},
  noFieldName: {message: 'no field name provided', status: 400},

}

let error = {}

export default class handleFile {
  constructor(
    request: express.Request,
    response:any,
    conf:any = {
      multiple: false,
      fieldName: undefined,
      fileId: undefined,
      maxSize:5,
    }) {
    if (!conf.fieldName) {
      logger.log(
        {
          level: "error",
          message: 'NO fieldName provided for this request in route' + request.originalUrl
        }
      );

      throw {
      message: 'internal server error',
      errorCode: 500,
      stack: 'NO fieldName provided for this request in route' + request.originalUrl
    }
    }
    this.multiple = conf.multiple
    this.fieldName = conf.fieldName
    this.fileId = conf.fileId
    this.maxSize = conf.maxSize*1024*1024
    this.request = request
    this.encType = conf.encType
  }
  multiple;
  fieldName;
  fileId: any;
  request: express.Request;
  maxSize;
  encType;

  // process the file upload using the handleFile function
  public async uploadFile(request: any): Promise<any> {
    await this.handleFile(request);
    // file will be in request.randomFileIsHere, it is a buffer
    return {};
  }
  private handleFile(request: express.Request): Promise<any> {
    const handle = multer(
      {
        dest: UPLOAD_DIR,
        limits: {
          fileSize:this.maxSize
        },
        fileFilter: (req: express.Request, file: any, cb: any) => {
         return fileFilter(req, file, this.encType, cb)
        }
      }
    )
      const multerHandler = this.multiple? 
        handle.array(this.fieldName) :
        handle.single(this.fieldName)
      return new Promise((resolve, reject) => {
      // @ts-ignore
      multerHandler(request, undefined, (err: any) => {
        if (err) {
          // create a multer error and attach it to the request
          // @ts-ignore
          request.multerError = error;
          reject(err);
        }
        resolve({})
      });
    }
    );
  }

}

// github command for setting remote


const fileFilter = (req: express.Request, file: any, encType: any, cb: any) => {
  if (!encType) {
    cb(null, true)
  }
  if (file.mimetype.includes(encType)) {
    cb(null, true)
  } else {
    //cb(null, false)
    error = fileStatusCodes.invalidFileType
    cb(new Error('file type not allowed'))
  }
}