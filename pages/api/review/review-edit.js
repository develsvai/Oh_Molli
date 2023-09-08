import { connectDB } from "@/util/database.js"
import { ObjectId } from "mongodb";

export default async function handler(요청, 응답){
    const db = (await connectDB).db("forum")
    // console.log(요청.body)
    let result = await db.collection('post').updateOne(
        {_id : new ObjectId(요청.body._id)},
        { $set : { title : 요청.body.title,
                   content : 요청.body.content 
                }}
    );
    return 응답.redirect(302, '/list')
}







