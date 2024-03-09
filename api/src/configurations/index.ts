export default () => ({
    port: process.env.PORT,
    connection_string: process.env.CONNECTION_STRING,
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_region: process.env.AWS_REGION,
    aws_bucket_name: process.env.AWS_BUCKET_NAME
});
