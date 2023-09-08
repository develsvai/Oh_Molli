import { connectDB } from "@/util/database.js"
import {getServerSession} from 'next-auth'
import {authOptions} from '../auth/[...nextauth]'

export default async function handler (요청 , 응답 ) {
    if(요청.method == 'POST'){
        let session = await getServerSession(요청, 응답, authOptions)
        if(!session){응답.status(500).json("로그인후 이용부탁 드립니다.")}
        else{
            let dt = String(new Date())
            let result =JSON.parse(요청.body)
            result.time = dt
            if(result.title == null){
                return 응답.status(500).json("제목 쓰셈")
            }else{
                result.author = session.user.email
                const db = (await connectDB).db("forum")
                await db.collection('post').insertOne(result);
                return 응답.redirect(302, '/list')
            }
        }

    }
}



