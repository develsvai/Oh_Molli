import { connectDB } from "@/util/database.js"
import { json } from "react-router";

export default  async function handler(req ,res) {
    const data = JSON.parse(req.body)

    try {

        const db = (await connectDB).db("Oh_Molli");
        const result = await db.collection('Product_list').findOne({ p_number: parseInt(data.p_number)});
    
        console.log(result)


        return res.status(200).json(result)
        
    } catch (error) {

        return res.status(500).json("실패")
        
    }
}