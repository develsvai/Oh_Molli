'use client'
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { json } from "react-router";



export default function detail(Pro_ID) {
    const key = Pro_ID.params.Pro_ID

    const [main2,setmain] = useState([]);
    const [detail,setdetail] = useState([]);




    useEffect(() => {

        const main = sessionStorage.getItem('main_image_url')
        const product_list = sessionStorage.getItem(key) 
        const data3 =JSON.parse(main)
        setmain(data3[key])

        if(product_list){
            const data = JSON.parse(product_list)
            setdetail(data.p_detail_image)
        }else{
            fetchData();
        }

    },[]);


    const fetchData = async() => {

            const response = await fetch('/api/product/product_data_get', {method : 'POST', body : JSON.stringify({ p_number : key })});
        
            const data = await response.json()

            setdetail(data?.p_detail_image)
            sessionStorage.setItem(key, JSON.stringify(data))

    }

    console.log(detail)
     return (

    <div>
        <div className="header_margin" style={{ display : 'flex' ,marginTop : '100px'}}>
            {/* <h4> detail page</h4> */}

            <img src={main2} style={{ width: '500px', height: '500px', borderRadius: '5%', marginLeft : '300px' }} />

            <div style={{ marginLeft : '30px'}}>
                <h4>[7/31 발송] 오들이 궁뎅이 그립톡</h4>
                <br/>

                <div style={{ display : 'flex', justifyContent: 'space-between'}}>
                    <p>소비자가</p> 
                    <p>14000원</p>
                </div>
                <p>판매가           14,000원</p>
                <p>배송방법   	     택배</p>
                <p>배송비  	        3,000원 (50,000원 이상 구매 시 무료) </p>


                <p  style={{marginTop : '50px'}}>수량을 선택해주세요 </p>
                <div style={{ borderTop : 'double', width : '400px', display : 'flex'}}> 
                <p>[7/31 발송] 오들이 궁뎅이 그립톡 </p> <p style={{ marginLeft : '110px'}}> 14000원</p>
                </div>

                <div style={{ display : 'flex', marginTop : '40px'}}>
                    <h6>TOTAL : </h6> &nbsp;&nbsp;&nbsp;<h6>14000원</h6>
                </div>
                <button style={{ width : '400px', height : '40px', background : 'black',  color : 'white', border : 'none'}}> BUY IT NOW</button>

                <div style={{ display : 'flex', marginTop : '20px'}}>
                <button style={{ width : '200px', height : '40px', background : 'white',  color : 'black', border : 'double'}}> ADD TO CART </button>
                <button style={{ width : '200px', height : '40px', background : 'white',  color : 'black', border : 'double'}}> WISH LIST</button>
                </div>
            </div>

        </div>

        <div  style={{marginTop : '100px' }}>
        
            {Array.isArray(detail) && detail.length > 0 ? (
                detail.map((detail, index) => (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img key={index} src={detail} alt={`Preview Image ${index}`}  style={{width :'550px', height : '750px'}} />
                    </div>
                ))
            ) : (
                <p>No images to display</p>
            )}

        </div>

    </div>

     )

}