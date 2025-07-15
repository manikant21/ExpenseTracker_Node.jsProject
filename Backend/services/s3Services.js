import AWS from "aws-sdk";
import dotenv from 'dotenv';

dotenv.config();

let s3 = new AWS.S3({
  accessKeyId:process.env.IM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.AWS_REGION
})

export async function uploadToS3 (data, filename) {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,                    
    Body: data,
    ACL: 'public-read',               
  };
   try {
    const s3response = await s3.upload(params).promise();  
    return s3response.Location; 
  } catch (error) {
    console.error("Upload to S3 failed:", error);
    return null;
  }
}