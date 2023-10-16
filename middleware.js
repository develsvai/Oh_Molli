import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";
import {getjwT, verifyJWT } from './pages/api/jwt';
import { parse } from 'cookie';
import { decode } from 'next-auth/jwt';

const bcrypt = require('bcryptjs');



export async function middleware(request , response) {

    // if (request.nextUrl.pathname.startsWith('/review/review-list')) {
    //     const session = await getToken({req : request})
    //     // console.log(session)
    //     if (session == null) {
    //       return  NextResponse.redirect(new URL('/signin?message=로그인후 이용해주세요', request.url));
    //     }
    //     else { return NextResponse.next() }
    //   }

  // console.log(request)

    if(request.url.startsWith('/api/auth/usersession')) {
      try{
        const cookies = parse(request.headers.cookie || '');
        const sessionToken = cookies['next-auth.session-token'];
        let cookie_session;

        try{
           cookie_session = await decode({
            token: sessionToken,
            secret: process.env.NEXTAUTH_SECRET,
          });

        }catch (error) {
          cookie_session = false
        }
        
        const server_session = await getToken({req : request})

        const hash = cookie_session?.session_info?.deactivate ? await bcrypt.compare("your session is deactivate", cookie_session.session_info.deactivate.split('$').slice(0).join('$')) : false;

                    if(cookie_session) {
                      if(cookie_session.accessToken === server_session.accessToken && cookie_session.user.email === server_session.user.email){
                          if(hash){
                              const Token = cookie_session?.accessToken
                              const secret = process.env.NEXTAUTH_SECRET
                              const isvaild = await verifyJWT(Token, secret);
                                  if(isvaild){
                                    // const cookieOptions = {
                                    //   path: '/',
                                    //   expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
                                    //   Domain : 'http://localhost:4000',
                                    //   // 다른 옵션들도 설정 가능
                                    // };
                              
                                    // response.setHeader('Set-Cookie',`accessToken=${Token  }; Path=${cookieOptions.path}; Expires=${cookieOptions.expires.toUTCString()}`);
                                    // console.log( '검증 성공')
                                    
                                    response.session = cookie_session
                                    response.stat = "200"
                                    console.log("middleware : 검증성공");
                                    return response;
                                  }
                                  else{
                                    console.log("middleware : 검증실패");
                                    response.stat = "400"
                                    return response
                                  } 

                          }else{
                            response.stat = "500"
                            console.log("middleware err : session is activate ")
                            return response
                          }
                      } else { 
                        response.stat = "500"
                        console.log("middleware err : !!세션 토큰 변조!!")
                        return response
                      }
                    }else{
                      response.stat = "500"
                      console.log("middleware err : session is undefined")
                      return response
                    }
    }catch(error){
      console.log("middleware err : middleware 접근 에러", error)
      response.stat = "500"
      return response
    }
  }
}


