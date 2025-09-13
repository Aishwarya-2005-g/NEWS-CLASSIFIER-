
export enum Page {
  Home = 'HOME',
  Article = 'ARTICLE',
  UploaderPortal = 'UPLOADER_PORTAL',
  Verification = 'VERIFICATION',
  Login = 'LOGIN',
}

export interface User {
  username: string;
  email: string;
}

export interface Uploader {
  id: string;
  name: string;
  age: number;
  qualification: string;
  qualificationProof: string; // base64 string
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string; // base64 string
  topics: string[];
  publishDate: string; // ISO string
  uploaderId: string;
  uploaderName: string;
}

export interface VerificationData {
  content: string;
  thumbnail: string; // base64 string
  topics: string[];
}
