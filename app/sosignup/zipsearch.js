'use client'
import React, { useEffect, useState } from 'react';
import DaumPostCode from 'react-daum-postcode';
import Modal from "react-modal";
import search_img from "@/public/search_img.png"
import Image from 'next/image';


export function DaumPost({address_data}) {
    const [modal, setModal]= useState(false); // 모달창
    const [isMobile, setIsMobile] = useState(false);
    const [FullAddress, setFullAddress] = useState([]);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
  
    useEffect(() => {
      // 화면 크기가 변경될 때마다 handleResize 함수를 호출하여 isMobile 상태를 업데이트합니다.
      window.addEventListener('resize', handleResize);
      handleResize(); // 컴포넌트가 처음 마운트될 때도 호출하여 초기값 설정
  
      return () => {
        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
        window.removeEventListener('resize', handleResize);
      };
    }, []);


    const modalStyle = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 15, 15, 0.79)',
      },
      content: {
        position: 'absolute',
        top: isMobile ? '70px' : '60px', // 화면 크기에 따라 top 값을 조정합니다.
        left: 0,
        right: 0,
        bottom: 0,
        margin: isMobile ? 0 : 'auto', // 화면 크기에 따라 가운데 정렬 여부를 결정합니다.
        width: isMobile ? '100%' : '35%', // 화면 크기에 따라 너비를 조정합니다.
        height: isMobile ? '60%' : '61%', // 화면 크기에 따라 높이를 조정합니다.
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '4px',
        outline: 'none',
        padding: '2px',
      },
    };


    address_data(FullAddress)


    const modalOff = () => {
        setModal(false);
    };

  const handleComplete = (data) => {
    let address = data.address;
    let extraAddress = '';

    const { addressType, bname, buildingName } = data;
    if (addressType === 'R') {
      if (bname !== '') {
        extraAddress += bname;
      }
      if (buildingName !== '') {
        extraAddress += `${extraAddress !== '' && ', '}${buildingName}`;
      }
      address += `${extraAddress !== '' ? ` ${extraAddress}` : ''}`;
    }
    
    setFullAddress(address);
    setModal(false)
  };




  return (
    <>
    <span  onClick={() => setModal(true)}><Image src={search_img} width={30} height={30}/></span>
      <div >
        <Modal 
            isOpen={modal}
            ariaHideApp={false}
            onRequestClose={modalOff}
            style={modalStyle}>
            <DaumPostCode  onComplete={handleComplete} className="post-code "  />
        </Modal>
      </div>
    </>
  );
};

export default DaumPost;
