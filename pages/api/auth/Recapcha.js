import axios from "axios";
const { jwtVerify, SignJWT} = require('jose');



export default async function handler(요청,응답) {
//   console.log(요청.body)
  const recaptchaValue  = 요청.body;
  const secretKey = '6LfmkOsmAAAAAAGYz7fPBVDyTgF-qxNcvoRByUuk';
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const { data } = await axios.post(verificationUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaValue,
      },
    });

    const { success } = data;

    if (success) {
      // reCAPTCHA 검증 성공
          const payload = {data}
          const secretkey = process.env.NEXTAUTH_SECRET;
          const key = Uint8Array.from(secretkey, c => c.charCodeAt(0));
          const Token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' }) // 서명 알고리즘 지정 (RSA-SHA256)
          .setIssuedAt() // 현재 시간을 발행 시간으로 설정 (선택 사항)
          .setExpirationTime(Math.floor(Date.now() / 1000) + 5 ) // 24시간 유효
          .sign(key); // 비밀 키를 사용하여 JWT에 서명

      응답.status(200).json({ success : Token });
    } else {
      // reCAPTCHA 검증 실패
      응답.status(400).json({ success: false });
    }
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    응답.status(500).json({ success: false });
  }

}