import { connectDB } from "@/util/database.js"

export default async function handler(요청, 응답) {
     if(요청.method == "GET"){
        const db = (await connectDB).db("forum")
        let review_list = await db.collection('post').find().toArray()
        if(review_list != null){ return 응답.status(200).json(review_list)}
        else{ return 응답.status(500).json("데이터를 받아올 수 없음")}
    }
}


