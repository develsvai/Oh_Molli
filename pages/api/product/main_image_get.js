import { connectDB } from "@/util/database.js"

export default  async function handler(req ,res) {
    
    const db = (await connectDB).db("Oh_Molli");
    const result = await db.collection('Product_main_image').find().toArray();


     if(result.error){ return res.status(500).json("실패")}
     else{ return res.status(200).json(result)}

}