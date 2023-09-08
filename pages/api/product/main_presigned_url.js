import aws from 'aws-sdk'

export default async function handler(요청, 응답){
  if(요청.body.method === "POST" && 요청)
    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: 'ap-northeast-2',
      signatureVersion: 'v4',
    })

    const s3 = new aws.S3();
    const url = await s3.createPresignedPost({
      Bucket: process.env.BUCKET_NAME,
      Fields: { key : 'main_page/' + 요청.query.file },
      Expires: 60, // seconds
      Conditions: [
        ['content-length-range', 0, 3048576], //파일용량 1MB 까지 제한
      ],
    })

    응답.status(200).json(url)
}  