import { connectDB } from "@/util/database.js"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler (요청 , 응답 ) {
    let session = await getServerSession(요청, 응답 , authOptions)

    console.log(session.user.accessToken)
    let dt = String(new Date())

    let data = JSON.parse(요청.body)


    if (session) {data.author = session.user?.email}
    data.time = dt
    
    if(요청.method == "POST"){
        if(data.comment == null) {return 응답.status(500).json("공백 입력 불가")}
        else{
            const db = (await connectDB).db("forum")
            let result = await db.collection('comment').insertOne({comment : data.comment, parent_id : data.parent_id, author : data.author, time : data.time });
            응답.status(200).json("작성완료")
        }
    }
}

















