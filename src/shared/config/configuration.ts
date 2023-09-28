export default () => ({
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: parseInt(process.env.PORT),
  SECRET_KEY: process.env.SECRET_KEY,
  LOYALTY_API: process.env.LOYALTY_API,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_FOLDER_PATH: process.env.AWS_S3_FOLDER_PATH,
});
