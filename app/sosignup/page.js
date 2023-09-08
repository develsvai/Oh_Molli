'use client'

import DaumPost from "@/app/component/zipsearch";
import { useEffect, useState } from "react";
import PhoneForm from "../component/phoneForm";
import ReCAPTCHA from 'react-google-recaptcha';
import check_img from "@/public/43604.png"
import Image from 'next/image';




export default  function Signup() {
  const [name , setname] = useState("");
  const [password , setpassword] = useState("");
  const [password2 , setpassword2] = useState("");
  const [email, setemail] = useState("");
  const [Provider, setProvider] = useState("");
  const [dpost, setdpost] = useState('none');
  const [address, setaddress] = useState('none');
  const [number, setnumber] = useState('none');
  const [isRecaptchachange, setRecaptchachange] = useState(false);

  useEffect(() => {

      const social_info =  sessionStorage.getItem('social_info')
      const info = JSON.parse(social_info)

      setemail(info.email)
      setProvider(info.provider)
  },[])
    
  const name_change = (e) => {
    setname(e.target.value);
  };

  const password_change = (e) => {
    setpassword(e.target.value);
  };

  const password2_change = (e) => {
    setpassword2(e.target.value);
  };

  const dpostChange = (event) => {
    setdpost(event.target.value);
  };


  const address_data = (add_data) => {
    setaddress(add_data);
  }

  const numberChange = (add_data) => {
    setnumber(add_data);
  }

  const handleRecaptchaChange = (e) => {
    console.log(e)
    setRecaptchachange(e)
};


  const signuphandler = async(e) => {
    e?.preventDefault();

    const capchavale = await fetch("/api/auth/Recapcha", {method : "POST", body : isRecaptchachange })
    const capcha_key = await capchavale.json()



    if (capchavale.status === 200){

        const response = await fetch("/api/auth/signup", {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({ 
            name : name,
            password : password,
            password2 : password2,
            email : email,
            provider : Provider,
            address : address,
            daddress : dpost,
            number : number ,
            capcha_key : capcha_key
          })
        })
          const status =  await response.status;
          const sdata = await response.json();
          
            if (status === 200) {
              window.alert('회원가입을 환영합니다! 최선을 다하겠습니다!');
              window.location.href = '/signin';
            } 
  
            else if (status === 400) {
              window.alert('이름 은 한글로 5 자리 이내 여야 합니다.');
            } 
            
            else if (status === 300) {
              window.alert('해당 이메일은 이미 '+ sdata.provider + '로 가입 이력이 존재합니다.');
            } 
            
            else if (status === 400) {
              window.alert('이메일 도메인이 중복되었습니다. 다시 입력해주세요.');
            } 
            
            else if (status === 600) {
              window.alert('필수 입력란을 확인해주세요!!');
            }
            
            else if (status === 700) {
              window.alert('패스워드가 일치 하지 않습니다. 확인 해주세요');
            }
            
            else if (status === 800) {
              window.alert('패스워드 조건이 일치하지 않습니다');
            }

            else if (status === 900) {
              window.alert('보안을 위해 1분후 만료되면 다시 진행해 주세요 감사합니다.');
            }
            
            else{
              window.alert('데이터 서버 오류입니다. 잠시 후 다시 시도해주세요.');
            }


    }else(window.alert("보안을 위해 1분후 만료되면 다시 진행해 주세요 감사합니다."))

  }
  

    return ( 
      <div>
          <form onSubmit={signuphandler} className="signup header_margin"> <div> <p style={{fontSize : '30px'}}> Sign up </p> <p> *은 필수입력</p></div>
            <input  type="text" onChange={name_change} placeholder="*성함* 닉네임 아닙니다." />

              <input  type="text" value = {email} placeholder="*이메일 *" /> 


              <div style={{ display: 'flex',  width : '350px', marginLeft : '50px'}}>
              <input  onChange={password_change} type="password" placeholder="*패스워드 *" />
                {password !== "" && /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password) && (
                  <Image src={check_img} width={30} height={30} />
                )}
             </div>

              {password !== "" && !/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password) && (<p>소문자,숫자,특수문자, 포함 8자리 이상 입니다.</p>)}


            <div style={ {display :'flex',  display: 'flex',  width : '350px', marginLeft : '50px'  }}>
              <input  onChange={password2_change} type="password" placeholder="*패스워드 확인 *" />
              {password != "" && password2 != "" && password == password2 ? <Image  src = {check_img} width={30} height={30}/> : ""}  
            </div>

            {password != password2 && password != "" && password2 != ""? <p> 비밀번호가 일치하지 않습니다</p>  : "" }


            <div style={ {display : 'flex', width : '330px' , marginLeft :'30px'}}>
              <input type="text" placeholder="주소를 검색하세요" value={address} /> <DaumPost address_data = {address_data}/>
            </div>

            <div>
              <input type="text" placeholder="상세주소" onChange={dpostChange} />
              <PhoneForm phonenum={numberChange}/>

              <ReCAPTCHA sitekey= '6LfmkOsmAAAAAEr4o4Z8uvjh3kiuVi-WNLtcGG9W' onChange = {handleRecaptchaChange} />

              {  ! /^[가-힣]{1,5}$/.test(name) || password != password2 && password != "" && password2 != "" || email == "" || password2 == "" || isRecaptchachange === false ? (
              <button className="signup_btn"  disabled>회원가입</button>
            ) : (
              <button className="signup_btn" onClick={signuphandler}>회원가입</button>
            )}


            </div>

          </form>
      </div>
    )
  

}