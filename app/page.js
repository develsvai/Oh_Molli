'use client'
import Link from "next/link";
import UncontrolledExample from "./component/banner-slide"
import { useEffect, useState } from "react";


function home() {  
  const [data, setdata ] = useState([null]);
  const [slide, setslide ] = useState([]);



  useEffect(() => {
    const main_url = sessionStorage.getItem('main_image_url');
    const slide_url =  sessionStorage.getItem('slide_image_url');
    const main_urldata = JSON.parse(main_url);
    const slide_urldata = JSON.parse(slide_url)

    if(main_url && slide_url ){
      setdata(main_urldata)
      setslide(slide_urldata)
    }

    else{
      fetchData();
    }

  },[])

  const fetchData = async() => {

      const response = await fetch('/api/product/main_image_get');
      const data = await response.json();
      const url = JSON.stringify(data)

      const urldata = JSON.parse(url);



      const result = urldata.reduce((acc, item) => {
        const { _id, slide_banner_1, slide_banner_2, slide_banner_3, ...rest } = item;

        if (Object.keys(rest).length > 0) {
          // Check if the rest object has fields other than _id and slide banners
          const key = Object.keys(rest)[0];
          return { ...acc, [key]: rest[key] };
        }
      
        return acc;
        
      }, {});

      console.log(result)

      setdata(result)
      

      const slide = urldata.reduce((acc, item) => {
        const extractedFields = {};
        for (const key in item) {
          if (key.startsWith("slide_banner")) {
            extractedFields[key] = item[key];
          }
        }
        return { ...acc, ...extractedFields };
      }, {});

      setslide(slide)

      sessionStorage.setItem("main_image_url", JSON.stringify(result))
      sessionStorage.setItem("slide_image_url", JSON.stringify(slide))
  }


    return (
      <div className="header_margin">
        <UncontrolledExample slide = {slide} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.keys(data).map((key) => (
            <div style={{ margin: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link href={'/Detail/' + key}>
                  <img src={data[key]} style={{ width: '300px', height: '300px', borderRadius: '5%' }} />
                </Link>
             </div>
          ))}
        </div>
      </div>
    )
}


export default home