"use client"
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
// import nookies from 'nookies';
// import { useDispatch } from 'react-redux';
// import { setAuthstate, setAuthupdate ,Authclear} from '../../redux/reducers';


export default  function join_check( ) {
  
  const [showModal, setShowModal] = useState(false);
  // const dispatch = useDispatch();


  useEffect(()=> {
    // dispatch(Authclear({ browserId : "browser1"}));
    // dispatch(setAuthstate({ browserId : "browser1", userData: {status : { deactivate : "undefined"}, userId: "undefined" } }));
    // dispatch(setUser({ userId: sdata.useremail, userData: sdata.status }));
    fetchData(); 
  },[])
  


  const handleLogout = async(url,massage) => {
  try{
      await signOut({
        redirect: false,
      })
        localStorage.removeItem('session_info')
        if(massage){window.alert(massage);}
        // 로그아웃 후 홈페이지로 리디렉션합니다.
        window.location.href = url;

    }catch (error) {
      window.alert("서버 오류 입니다. 고객센터로 연락 주시면 신속히 처리 해드겠습니다.")
      window.location.href = "/"
    }
};


  const fetchData = async() => {
    try {

      const response = await fetch('/api/auth/usersession',{method: "POST",});
      
      const status =  await response.status;
      const sdata = await response.json();


      if (status === 300) {
          sessionStorage.setItem('social_info', JSON.stringify({email : sdata.email, provider : sdata.provider}))

          setShowModal(true);
      }

      if (status === 600) {
          handleLogout("/signin", '해당 이메일은  '+  sdata.provider + ' 로 가입된 이력이 있습니다.');
      } 
          
      if (status === 400) {
          handleLogout("/",'유저 검증에 실패하였습니다. 올바른 방법으로 로그인 해주세요.');
      }

      if (status === 500) {
          handleLogout("/",'올바르지 않은 접근입니다. 3회 시도시 1동안 로그인 차단 됩니다.');
      }
    
      if (status === 200) {

          // dispatch(setAuthupdate({ browserId : "browser1" , userData: { session_info : sdata.session_info}}));

          localStorage.setItem('session_info',  JSON.stringify(sdata.session_info) )

          console.log("사용자 정보 확인 완료");
          
          window.location.href = "/";
      }

      if(status === 404) {
          handleLogout("/", "서버 오류 입니다. 고객센터로 연락 주시면 신속히 처리 해드겠습니다.");
      }

    } catch (error) {
      console.log("서버 오류 입니다. 고객센터로 연락 주시면 신속히 처리 해드겠습니다.")
      
    }
  };


  const confirm =() =>{
     handleLogout(`/sosignup`);
  };

  const unconfirm =() =>{
    handleLogout("/");
  };

  return (
    <>
    {showModal && (
      <div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          가입 정보를 찾을수 없습니다! 30초 회원 가입을 진행 해보세요!
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirm} > 회원가입 </Button>
          <Button onClick={unconfirm}> 좀더 둘러 볼래요</Button>
        </Modal.Footer>
      </Modal>
      </div>
      )}
    </>
  );
}

