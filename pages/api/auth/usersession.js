import { connectDB } from "@/util/database.js"
import { middleware } from "@/middleware";
import bcrypt from 'bcrypt';
import { encode } from "next-auth/jwt";


const cookieOptions = {
  path: '/',
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,
  sameSite: 'lax', 
  // domain: 'https://mollymarket.net/', // 도메인을 실제 도메인으로 변경
// 다른 옵션들도 설정 가능
};



const sessionupdate = async(response ,midreapones , name) => {
  let hash = await bcrypt.hash("your session is activate", 10)
                  
  const name2  = encodeURIComponent(name);
  const session_info = {activate : hash, name : name2 }

  midreapones.session.user = {}
  midreapones.session.session_info = session_info

  const session = await encode({
    token: midreapones.session,
    secret: process.env.NEXTAUTH_SECRET,
  });
                          
  const Tokencookie = `next-auth.session-token=${session}; Path=${cookieOptions.path}; Expires=${cookieOptions.expires.toUTCString()}`;

  response.setHeader('Set-Cookie',[Tokencookie]);
                      
  return { session_info : session_info }

}




export default async function handler(request, response) {
  try {


    const clientIP = request.connection.remoteAddress;
    const midreapones =  await middleware(request, response);


        if(midreapones && midreapones.stat === '200' && request.method === "POST"){


          const provider = midreapones.session.provider
          const useremail = midreapones.session.user.email

                  if(provider != "credentials"){

                    const db = (await connectDB).db("forum");
                    const result = await db.collection('user_cred').findOne({ email: useremail});

                      if (!result) {
            
                          // const sosignupurl = `social_info=${JSON.stringify({email: useremail, provider : provider})}; Path=${cookieOptions.path}; Expires=${cookieOptions.expires.toUTCString()}`;
                          // response.setHeader('Set-Cookie',[sosignupurl]);

                          return response.status(300).json({email: useremail, provider : provider});

                      } 
                      
                      else {

                        if( provider != result?.provider){ return response.status(600).json({ provider : result?.provider}) }

                        else{

                          const res  = await sessionupdate(response, midreapones, result.name) 
                          
                          console.log('usersession : social 접근성공')
                          return response.status(200).json({session_info : res.session_info});
                        }
                        
                      }

                  }else{

                    const res  = await sessionupdate(response, midreapones, midreapones.session.user.name)
                    
                    console.log('usersession : credential 접근성공')
                    return response.status(200).json( { session_info : res.session_info });

                  }

        }else if(midreapones.stat === "400"){return response.status(400).json({error : "usersession : 유저 검증 실패 "})

        }else{ return response.status(500).json({error : "usersession : 미들웨어 접근 에러 또는 올바르지 않은접근"}) }

  } catch (error) {
    console.log('usersession' , error)
    return response.status(404).json({ error: " usersession : 서버 오류" });
  }
}
