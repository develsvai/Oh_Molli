import { connectDB } from "@/util/database.js"

export default async function handler(요청,응답 ){
    // console.log(요청.query)
    const db = (await connectDB).db("forum")
    let comment_list = await db.collection('comment').find({parent_id : 요청.query.par_id}).toArray()
    return 응답.status(200).json(comment_list)

}