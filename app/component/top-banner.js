'use client'
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import { parseCookies } from 'nookies';
import {  useEffect, useState } from 'react';


export function BasicExample() {
  const [name, setname ] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      const timeoutId = setTimeout(() => {
        setExpanded(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [expanded]);

    
  useEffect(() => {
    // 브라우저의 쿠키 읽기ㅌ
    // const cookies = parseCookies();
    // const statusValue = cookies.status;
    // const statusObj = statusValue ? JSON.parse(statusValue) : null
    // // username 값 가져오기
    // setname(statusObj?.name)

    const session_info = localStorage.getItem('session_info');
    if( session_info) {
      const parse= JSON.parse(session_info) 
      setname(decodeURIComponent(parse.name))
    }
    else{
      setname(null)
    }

  }, []);

  const handleLogout = () => {

    signOut({
      redirect: false,
    }).then(() => {
      // 쿠키를 삭제합니다.
      localStorage.removeItem('session_info');
      // 로그아웃 후 홈페이지로 리디렉션합니다.
      window.location.href = '/';
    });

  };


  return (

    <Navbar bg="white" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand href="/">Oh! Molli</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/review/review-list">review</Nav.Link>
            <Nav.Link href="../board">Board</Nav.Link>
            
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <div className='auth_btn'>
            {
                  name
                  ? <div> {name + "님" } &nbsp; <Link href={""} style={{ marginTop: '9px' , color : 'rgba(0,0,0,0.55)'}} onClick={() => { handleLogout() }}>Log out</Link> 
                    &nbsp;&nbsp;
                    <Link  href={"/mypage"} style={{ marginTop: '9px' , color : 'rgba(0,0,0,0.55)'}}> my page </Link></div>
                  : <div style={{display : 'flex'}}><Link  href={"/signin"}  style={{ marginTop: '0px' , color : 'rgba(0,0,0,0.55)'}}>로그인</Link></div>
            }
            </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

}


export default BasicExample;



