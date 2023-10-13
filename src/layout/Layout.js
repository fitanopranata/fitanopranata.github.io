import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const Layout = ({children}) => {
    return (
        <React.Fragment>
            <Sidebar/>
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <Header />
                <div className="body flex-grow-1 px-3">
                    <main>{children}</main>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    )
}

export default Layout