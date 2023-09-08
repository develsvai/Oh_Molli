'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';






function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async (e) => {
    e?.preventDefault();

    if(email === ""){  window.alert('이메일란이 공백입니다. 확인해주세요 ');}
    else if(password === ""){  window.alert('패스워드 란이 공백입니다. 확인해주세요 ');}
    else {
       // 로그인 요청 처리
         const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result.error) {
          window.alert("이메일 및 팩스워드 가 일치하지 않습니다.");
        }else{
          console.log("로그인 성공")
          window.location.href = "/join_check"
        }

    }
  }


  const handleSocialLogin = async(e, provider ) => { 
    e?.preventDefault();

    let result = await signIn(provider, {
        redirect: false,
        callbackUrl: `${window.location.origin}/join_check`,
        })
      
  }



  return (

  <div className='header_margin'  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <h1 style={{marginBottom : '30px'}}>Log In</h1> 
      <form onSubmit={handleLogin} >
           <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"  />
            <Button variant="secondary" size="lg" type="submit" style={{marginLeft : '0px' , width : '300px'}}>로그인</Button>
      </form>

      <div style={ { display : 'flex'}}>
        <span  onClick = {() => { window.location.href = '/'}} style={ { marginTop : '20px'}}> 아이디 찾기 | </span>
        &nbsp;&nbsp;
        <span style={ { marginTop : '20px'}}> 비밀번호 찾기 | </span>
        &nbsp;&nbsp;
        <span  onClick = {() => { window.location.href = '/signup'}} style={ { marginTop : '20px'}}> 일반 회원가입</span>
      </div>

      {/* <Button variant="secondary" size="lg" onClick={()=> { window.location.href = "/signup"}} style={{marginLeft : '0px' , width : '300px'}}>일반 회원가입</Button> */}

        {/* <div><button onClick={() => handleGitHubLogin()}>github</button></div> */}
        <div>
            <button onClick={(e) => handleSocialLogin(e,'kakao')}  style={{ width : '300px', height : '45px', background : '#FEE500', border : 'none', marginBottom : '10px', borderRadius: '8px', marginTop : '30px'}} >Kakao 로그인</button>
            {/* 다른 소셜 로그인 버튼들 추가 */}
        </div>

        <div>
            <button onClick={(e) =>  handleSocialLogin(e,'naver') } style={{ width : '300px', height : '45px', background : '#2DB400', border : 'none', marginBottom : '10px',  borderRadius: '8px'}}>Naver 로그인</button>
            {/* 다른 소셜 로그인 버튼들 추가 */}
        </div>

        <div>
            <button onClick={(e) => handleSocialLogin(e,'google')} style={{ width : '300px', height : '45px', background : '138,141,146', border : 'none',  marginBottom : '10px',  borderRadius: '8px'}}>Google 로그인</button>
            {/* 다른 소셜 로그인 버튼들 추가 */}
        </div>
    </div>
  );
}

export default LoginPage;