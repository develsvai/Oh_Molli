'use client'
import Carousel from 'react-bootstrap/Carousel';



function UncontrolledExample({slide}) {
  return (
    <Carousel interval={3000}>
      {Object.keys(slide).map((key, index) => (
        <Carousel.Item key={index}>
        <div style={{ margin: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
           <img 
              className="img-fluid"
              src={slide[key]} 
              alt={`Slide ${index + 1}`} 
          />
        </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
  
}

export default UncontrolledExample;




  {/* <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}