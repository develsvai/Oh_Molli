import { connectDB } from "@/util/database.js"

export default  async function handler(req ,res) {
    
    const db = (await connectDB).db("Oh_Molli");

    const p_result= await db.collection('Product_main_image').find().toArray();

    if(p_result.error){ return res.status(500).json("실패")}


    let maxField = '';
    let maxValue = -1;

    p_result.forEach(item => {
        
    for (const key in item) {
        if (key.match(/^(100\d|10\d{2})$/)) {
        const value = parseInt(key);
        if (value > maxValue) {
            maxField = key;
            maxValue = value;
        }
        }
    }
    });

    const p_num = parseInt(maxField) + 1

    return res.status(200).json(p_num)

}