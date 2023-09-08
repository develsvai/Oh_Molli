'use client'

import 'bootstrap/dist/css/bootstrap.css';
import './globals.css'
import BasicExample from './component/top-banner';
import { ReduxProvider } from '@/redux/provider';
import Footer from './component/footer';



export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
        <body>

          <header className='haeder'>
            <BasicExample/>
          </header>
  

            <ReduxProvider>{children}</ReduxProvider>


            <Footer/>
        </body>

        
    </html>
  )
}
