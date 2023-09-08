import { connectDB } from "@/util/database.js"
import bcrypt from 'bcrypt'
import {getjwT, verifyJWT } from '@/pages/api/jwt';




const dataverify = async(요청 , 응답, db ) => { 

    // 패스워드 , 비밀번호, 전화번호 ,이름

    
    요청.body.provider == "credentials"  ? 요청.body.email = 요청.body.email + 요청.body.domain : ""

    const result = await db.collection('user_cred').findOne({email : 요청.body.email})

    const secret = process.env.NEXTAUTH_SECRET
    const capcha_key = await verifyJWT(요청.body.capcha_key.success, secret )
    

    if(! /^[가-힣]{1,5}$/.test(요청.body.name) ){
        return {vstatus : 400 }
    }

    else if( result ){
        // return 응답.status(300).json('이미 존재하는 이메일')
        return {vstatus : 300, provider : result.provider}
    }

    else if( 요청.body.name == '' || 요청.body.email == '' || 요청.body.password == '' || 요청.body.password2 == '' ){
        // return 응답.status(600).json("정보 공백")
        return {vstatus : 600}
    }

    else if(!/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(요청.body.password)){
        // return 응답.status(800).json('패스워드 정규식이 일치하지 않습니다.')
        return {vstatus : 800}
    }

    else if(요청.body.password != 요청.body.password2){
        // return 응답.status(700).json('패스워드 불일치')
        return {vstatus : 700}
    }

    else if(!capcha_key){ 
        return {vstatus : 900}
    }

    else{ return {vstatus : 200} }

}

const insertdb = async(요청 , 응답 , db ) => {

    let dt = String(new Date())
    let hash = await bcrypt.hash(요청.body.password, 10)

    let fulladdress
    요청.body.address != false ? fulladdress = 요청.body.address + " " + 요청.body.daddress : fulladdress = 'none'
    요청.body.number == "" ? 요청.body.number = "none" : ""

    const result = await db.collection('user_cred').insertOne({
        name :  요청.body.name, 
        email : 요청.body.email,
        password :  hash,
        provider : 요청.body.provider,
        address :  fulladdress,
        phonenumber :  요청.body.number,
        role : "user",
        signupDate : dt,
        
    })
    if(result.error) {return { status : 500 }}

    else{return { status : 200 }}
    
}


export default async function handler(요청, 응답) {

    if (요청.body.provider != 'credentials') {

        const db = (await connectDB).db("forum")


        const result = await dataverify(요청,응답,db )
        // console.log(result)

            if(result.vstatus === 200){
                const res = await insertdb(요청,응답, db)

                console.log(res)

                return 응답.status(res.status).json("")

            }
            
            else{ return 응답.status(result.vstatus).json("")}
        

    }else { 

        if ( 요청.body.email.indexOf('@') !== -1){return 응답.status(500).json('도메인중복')}


        else {
            const db = (await connectDB).db("forum")


            const result = await dataverify(요청 , 응답, db )
            console.log(result)

                if(result.vstatus === 200){
                    const res = await insertdb(요청,응답, db)

                    console.log(res)

                    return 응답.status(res.status).json("")

                }

                else{ return 응답.status(result.vstatus).json(result)}
        }

    }
 }