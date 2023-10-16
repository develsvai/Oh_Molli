import { connectDB } from "@/util/database";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
const { jwtVerify, SignJWT} = require('jose');



export const authOptions = {
  providers: [

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }), 

    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    CredentialsProvider({

        //1. 로그인페이지 폼 자동생성해주는 코드 
        name: "credentials",
          credentials: {
            email: { label: "email", type: "text" },
            password: { label: "password", type: "password" },
        },

          //2. 로그인요청시 실행되는코드
        //직접 DB에서 아이디,비번 비교하고 
        //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
        async authorize(credentials) {
          let db = (await connectDB).db('forum');
          let user = await db.collection('user_cred').findOne({email : credentials.email})
          if (!user) {
            console.log('nextAuth  : 해당 이메일은 없음');
            return null
          }
          const pwcheck = await bcrypt.compare(credentials.password, user.password);
          if (!pwcheck) {
            console.log('nextAuth : 비밀번호 일치하지 않음');
            return null
          }
          return user
        }
    })
  ],

    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, //30일
    },

  
    callbacks: {
      //4. jwt 만들 때 실행되는 코드 
      //user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.

      async jwt({ token, user ,account}) {
        
        
        if (user) {
          
          const payload = { userId: user.email };
          const secretkey = process.env.NEXTAUTH_SECRET;
          const key = Uint8Array.from(secretkey, c => c.charCodeAt(0));
          const Token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' }) // 서명 알고리즘 지정 (RSA-SHA256)
          .setIssuedAt() // 현재 시간을 발행 시간으로 설정 (선택 사항)
          .setExpirationTime(Math.floor(Date.now() / 1000) + (24 * 60 * 60)) // 24시간 유효
          .sign(key); // 비밀 키를 사용하여 JWT에 서명

          

          let hash = await bcrypt.hash("your session is deactivate", 10)
        
          // setCookie(null, 'accessToken', Token, {
          //   maxAge: 60 * 60 * 24 * 7, // 7일 (예시로 7일 설정)
          //   path: '/',
          // });
          
          token = {
            accessToken: Token,
            provider : account.provider,
            session_info : {deactivate : hash}
          }
      
          token.user = {
            name: user.name,
            email: user.email,
          };
        }
        return token;
      },

      session: async ({ session, token }) => {
        session.user = token.user;  
        return session;
      },

    },

    secret: process.env.NEXTAUTH_SECRET
};





export default NextAuth(authOptions);




