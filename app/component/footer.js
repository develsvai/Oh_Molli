import Container from 'react-bootstrap/Container';

function Footer() {
  return (
    <footer className="mt-auto">
      <Container fluid className="text-center py-1 bg-light">
        {/* <p style={{ fontSize: '10px' }}>&copy; {new Date().getFullYear()} My Awesome Website</p> */}
        <p style={{ fontSize: '10px' }}>COMPANY : Oh! Molli </p>
        <p style={{ fontSize: '10px' }}>운영진 :  CEO : 박아영 , 서비스 운영 관리 책임자 : 홍용재(developsvai5096@gmail.com) </p>
        <p style={{ fontSize: '10px' }}>COMPANY_REGNO : [5280701020] NETWORK_REGNO 제2018-서울구로-1307호 [사업자정보확인] </p>
        <p style={{ fontSize: '10px' }}>TEL: 010-1234-5676 ADD : 07ㅌ238 서울특별시 영등포구 국회대로76길 18 오성빌딩 3층 3호 </p>
        <p style={{ fontSize: '10px' }}>Contact for more information.</p>
        <p style={{ fontSize: '10px' }}>CS Center : 01034851245AM10:00 ~ PM18:00 ( WEEKEND/HOLIDAY OFF )</p>
        <p style={{ fontSize: '10px' }}>HOME AGREEMENT PRIVACY GUIDE</p>
      </Container>
    </footer>
  );
}
export default Footer;
