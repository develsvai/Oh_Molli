import { connectDB } from "@/util/database.js"

export default  async function handler(req ,res) {
    
    const data = JSON.parse(req.body)
    const db = (await connectDB).db("Oh_Molli");


    const result = await db.collection('Product_list').insertOne({
        p_number : data.p_num,
        p_detail_image : data.url
     });

     if(result.error){ return res.status(500).json("실패")}
     else{ return res.status(200).json("성공")}

}