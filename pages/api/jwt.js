const { jwtVerify, SignJWT} = require('jose');
// import 'dotenv/config';

    const verifyJWT = async(token, secretKey) => {
      try {
        // 토큰 검증
  
        const key = Uint8Array.from(secretKey, c => c.charCodeAt(0));
  
        const {payload} = await jwtVerify(token, key,  { algorithms: ['HS256'] });
        
        // 토큰에 포함된 정보 추출
        console.log('JWT verification successful:', payload);
        return true, payload;
  
      } catch (error) {
        // 검증 실패 시 false 반환
        console.error('JWT verification failed:', error);
        return false;
      }  
    }


    const getjwT = async(userid,secret,exp) => {
      const key = Uint8Array.from(secret, c => c.charCodeAt(0));
      const payload = { userId: userid};
      const Token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' }) // 서명 알고리즘 지정 (RSA-SHA256)
      .setIssuedAt() // 현재 시간을 발행 시간으로 설정 (선택 사항)
      .setExpirationTime(exp)
      // .setExpirationTime(Math.floor(Date.now() / 1000) + 20) // 만료 시간 설정 20초동안 유효
      .sign(key); // 비밀 키를 사용하여 JWT에 서명

      return Token;
    }

export {verifyJWT , getjwT};