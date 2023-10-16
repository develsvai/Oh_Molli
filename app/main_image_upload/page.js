'use client'


import { useRef, useState } from "react"
import { Button } from "react-bootstrap";
import upload_image from '@/public/img_upload.png'
import Image from "next/image";


export default function image_upload(){

    const [selectedDetailImages, setSelectedDetailImages] = useState([]);
    const [selectedMainImages, setSelectedMainImages] = useState([]);
    const [SortedImageNames,setSortedImageNames] = useState();
    const [upload_mian,set_upload_main] = useState([]);
    const [upload_detail,set_upload_detail] = useState([]);

    console.log(SortedImageNames)

    const insert_main_image = async (p_num, image) => {

                let file = image
                let filename = encodeURIComponent(file.name)
                let res = await fetch('/api/product/main_presigned_url?file=' + filename )
                res = await res.json()
                console.log (res)


                const formData = new FormData()
                Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
                    formData.append(key, value)
                })


                let 업로드결과 = await fetch(res.url  , {
                    method: 'POST',
                    body: formData,
                })
                console.log(업로드결과)

                if (업로드결과.ok) {

                    const response = await fetch( '/api/product/main_image_upload', {
                        method : 'POST',
                        body : JSON.stringify({
                            url : 업로드결과.url + '/main_page/' + filename,
                            p_num : p_num
                        }),
                    })

                    const status =  await response.status;

                    if( status === 200) {

                        return "success"
                    }
                    else{

                        return "failure"
                    }

                    
                } else {
                    console.log('실패')
                }

    }



    const aws_Detail_image = async (p_num, image) => {

                let file = image
                let filename = encodeURIComponent(file.name)
                let res = await fetch('/api/product/detail_presigned_url?file=' + filename, { 
                    method : "POST", 
                    body : JSON.stringify({ pnum : p_num }) 
                } )
                res = await res.json()
                console.log (res)


                const formData = new FormData()
                Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
                    formData.append(key, value)
                })


                let 업로드결과 = await fetch(res.url  , {
                    method: 'POST',
                    body: formData,
                })

                console.log(업로드결과)


                if (업로드결과.ok) {
                    return 업로드결과

                } else {
                    return "failure"
                }

    }

    const db_detail_image = async (p_num, url) => {

        const response = await fetch( '/api/product/detail_image_upload', {
            method : 'POST',
            body : JSON.stringify({
                url : url ,
                p_num : p_num,

            }),
        })

        const status =  await response.status;

        if( status === 200) {
            return "success"

        }else{
            return "failure"
        }

    }


    const image_upload=  async() => {

        if( upload_mian.length === 0 || upload_detail.length === 0 ){
            console.log("이미지가 없음")

        }else{
            const data = await fetch('/api/product/product_number_get')

            const p_num = await data.json()

            const result = await insert_main_image(p_num, upload_mian)
            
            const aws_image_url = [];

            if( result === "success") {
                console.log("메인 이미지 업로드 성공")

                for( let i =0; i< upload_detail.length; i++){

                    const aws_result =  await aws_Detail_image(p_num, upload_detail[i].File)
                    const ok = await aws_result.ok
                    if(ok) {

                        aws_image_url.push(aws_result.url + '/Product_Detail_image/'+ p_num + "/" + upload_detail[i].File.name)
                    }
                    else{console.log(p_num ,": 상품 상세 이미지 업로드 실패")}

                }
            
                const db_result = await db_detail_image( p_num, aws_image_url)
                if(db_result === "success"){ 
                    console.log("상품 상세 정보 db 업로드 성공")
                }
                else{console.log("상품 상세 정보 db 업로드 실패 ")}

            }else{ console.log("상품 메인 이미지 업로드 실패")}
        }
    }



    const extract_m = (imageName) => {
        const matches = imageName.match(/_m/);
        if (matches) {
          return true // 정수로 변환
        }
        return undefined; 
      };


    const main_image_Change = (event) => {
    try {
        const imageFile = event.target.files[0];

        const matches = extract_m(imageFile.name)
        if(matches === undefined) { window.alert("상품 메인이미지가 아닙니다. 메인 이미지 구분자는 '이름_m' 입니다.")}

        if (imageFile) {
          const reader = new FileReader();
          reader.onload = () => {
            set_upload_main(imageFile);
            setSelectedMainImages(reader.result);
          };
          reader.readAsDataURL(imageFile);
        }

    } catch (error) {
        console.log("이미지 업로드 취소")
    }
        
    }


    

    const extractImageNumber = (imageName) => {
        const matches = imageName.match(/_(\d+)\./);
        if (matches && matches.length > 1) {
          return parseInt(matches[1], 10); // 정수로 변환
        }
        return undefined; 
      };


    const Detail_image_Change = (event) => {
    try {
        
        const imageFiles = event.target.files;

        const imageUrls = [];
        const imagedata = [];
        let hasImagesWithoutNumber = false;

        for (let i = 0; i < imageFiles.length; i++) {

            const number = extractImageNumber(imageFiles[i].name);// 파일 이름에서 일련번호 추출

            if(number === undefined){hasImagesWithoutNumber = true}


            const reader = new FileReader();

            reader.onload = () => {
                const imageName = imageFiles[i].name;

                 imagedata.push({
                    File : imageFiles[i]
                    
                 })

                  imageUrls.push({
                    url: reader.result,
                    name: imageName,
                  });


                if (imageUrls.length === imageFiles.length) {

                    const sortedImagedata = imagedata.sort((a, b) => {
                        const numberA = extractImageNumber(imageFiles[i].name);
                        const numberB = extractImageNumber(imageFiles[i].name);
                        return numberA - numberB; // 일련번호를 기준으로 정렬
                      });

                    set_upload_detail(sortedImagedata)


                    const sortedImageurl = imageUrls.sort((a, b) => {
                        const numberA = extractImageNumber(a.name);
                        const numberB = extractImageNumber(b.name);
                        return numberA - numberB; // 일련번호를 기준으로 정렬
                      });
                      

                      setSelectedDetailImages(sortedImageurl.map(imageData => imageData.url));
                      setSortedImageNames(sortedImageurl.map(imageData => imageData.name));
                }
            };

            reader.readAsDataURL(imageFiles[i]);
        }

        if (hasImagesWithoutNumber) {
            // 일련번호 없는 이미지가 있을 경우 알림 표시
            hasImagesWithoutNumber = false
            window.alert('이미지 중에 일련번호가 없는 이미지가 존재합니다. 상품 상세 이미지 구분자 는 "이름_일련번호" 입니다.');
        }

    } catch (error) {console.log("이미지 업로드 취소")}
    }



    const main_ImageClick = () => {
        // Trigger click on the file input element
        if (mainInputRef.current) {
            mainInputRef.current.click();
        }
    }

    const Detail_ImageClick = () => {
        // Trigger click on the file input element
        if (DetailInputRef.current) {
            DetailInputRef.current.click();
        }
    }

    const mainInputRef = useRef(null);
    const DetailInputRef = useRef(null);
    return (
        <div>
            <div style={{ marginTop: "100px", marginLeft: "30px", display: "flex", justifyContent: "center" }}>
                <div>

                    <input type="file" accept="image/*" style={{ borderRadius: "5%", marginLeft: "300px", display: "none" }} ref={mainInputRef} onChange={(e) => { main_image_Change(e); }} />

                    <div onClick={main_ImageClick}>
                        {selectedMainImages[0] 
                        ? <img src={selectedMainImages} style={{ width: "500px", height: "500px", borderRadius: "5%"}} alt={"main"} /> 
                        : <Image src={upload_image} style={{ width: "500px", height: "500px", borderRadius: "5%"}} />}
                    </div>

                </div>

    
                <div style={{ marginLeft : "30px"}}>
                    <input type="text" placeholder="상품 명을 입력하세요" />
                    <br />
            
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p>소비자가 : </p>
                        <input style={{ border: "none" }} placeholder="소비자가를 입력하세요" />
                    </div>
            
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p>판매가 : </p>
                        <input style={{ border: "none" }} placeholder="판매가를 입력하세요" />
                    </div>
            
                    <p>배송방법 : 택배</p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p>배송비 :</p> <input style={{ border: "none" }} placeholder="배송비를 입력하세요" />
                    </div>
                    <Button>업로드</Button>
                    &nbsp;
                    <Button onClick={() => {image_upload()}}>임시저장</Button>
                </div>
            </div>
    
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop : '100px' }} >
                <input type="file" accept="image/*" multiple style={{ display: "none" }} ref={DetailInputRef} onChange={async (e) => { Detail_image_Change(e); }} />
        
                <div onClick={Detail_ImageClick}>
                    {selectedDetailImages.length > 0 
                    ? selectedDetailImages.map((imageUrl, index) => (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img  key={index} src={imageUrl} alt={`Preview Image ${index}`} style={{ justifyContent: "center", maxWidth: "100%" }} />
                        </div>
                    )) 
                    : <Image src={upload_image} />}
                </div>

            </div>

        </div>
    );
}