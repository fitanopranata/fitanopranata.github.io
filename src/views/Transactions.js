import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCol, CCollapse, CContainer, CFormInput, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToast, CToastBody, CToastClose, CToaster } from '@coreui/react'
import { cilBarcode, cilCheckAlt, cilChevronCircleDownAlt, cilChevronCircleUpAlt, cilSearch } from '@coreui/icons';
import React, { useEffect } from 'react'
import Layout from '../layout/Layout.js'
import CurrencyFormat from 'react-currency-format';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import QrScanner from 'qr-scanner';
// import {QrReader} from 'react-qr-reader'
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import Html5QrcodePlugin from '../components/Scanner.js';

const Transactions = () => {

    const {user} = useSelector((state) => state.auth)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const [customerDetailVisibility, setCustomerDetailVisibility] = useState(false)
    const [getProduct, setGetProduct] = useState([])
    const [searchProduct, setSearchProduct] = useState('')
    const [selectedItem, setSelectedItem] = useState(-1)
    const [productToCheckOut, setProductToCheckOut] = useState([])
    const [inputProductCode, setInputProductCode] = useState('')
    const [qty, setQty] = useState(1)

    const [scanModal, setScanModal] = useState(false)
    const [scanResult, setScanResult] = useState('')
    const [qrScanner, setQrScanner] = useState()
    const [isScanned, setIsScanned] = useState(false)
    const [isScannerShowed, setIsScannerShowed] = useState(false)

    const videoRef = useRef(null)

    useEffect(() => {
        if (user) {
            if (searchProduct !== '') {
                getProductByName()
                getProductByCodeScan()
            } else {
                setGetProduct([])
            }
            getCheckoutTemp()
        }

        if (isScanned) {
            stopScan()
            setIsScannerShowed(false)
            setScanModal(false)
            setIsScanned(false)
        }

        if (isScannerShowed) {
            startScan()
        }

        // const scanner = new Html5QrcodeScanner(reader, {
        //     qrbox: {
        //         width: 250,
        //         height: 250
        //     },
        //     fps: 5
        // })
    
        // scanner.render(success, error)
    
        // function success (result) {
        //     scanner.clear()
        //     setScanModal(false)
        //     setScanResult(result)
        // }
    
        // function error (err) {
        //     console.warn(err)
        // }
        
    }, [user, searchProduct, isScanned, isScannerShowed])

    const showScanModal = () => {
        // setScanModal(!scanModal)
        setIsScannerShowed(true)
    }

    const startScan = async () => {
        const qrScanner = new QrScanner(videoRef.current, (result) => handleScan(result), {
            highlightScanRegion: true,
            returnDetailedScanResult: true,
            maxScansPerSecond: 1
          });
          qrScanner.start();
        //   qrScanner.setCamera('environment')
          setQrScanner(qrScanner);
    }

    function stopScan(){
        if (qrScanner) {
            qrScanner.stop()
            qrScanner.destroy()
            setQrScanner(undefined)
        }
        // qrScanner?.stop();
        // qrScanner?.destroy();
        // setQrScanner(undefined);
    }

    function handleScan(result) {
        if (!isScanned) {
            setIsScanned(true)
            // setInputProductCode(result.data)
            getProductByCode(result.data)
        }
        // if (result.data) {
        //     getProductByCode(result.data, function() {
        //         stopScan()
        //     })
        //     // setScanResult(result.data)
        //     // getProductByCodeScan()
        //     // qrScanner?.destroy();
        //     // setScanModal(false)
        // }
      }

    const getProductByName = async () => {
        try {
            const result = await axios.post(process.env.REACT_APP_API_URL+'/getProductByName', {
                name: searchProduct
            })
            setGetProduct(result.data)
            // console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const inputCode = async (e) => {
        if (e.key === "Enter") {
            getProductByCode(inputProductCode)
        }
    }

    const getProductByCodeScan = async () => {
        setMessage('')
        setLoading(true)
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+'/getProductByCode', {
                code: inputProductCode,
                client_id: user.client_id,
                createdBy: user.name
            })
            if (response.data.status === true) {
                setMessage(response.data.message)
                setTimeout(() => {
                    setMessage('')
                }, 5000)
                setInputProductCode('')
                setSearchProduct('')
                getCheckoutTemp()
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProductByCode = async (code) => {
        setMessage('')
        setLoading(true)
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+'/getProductByCode', {
                code: code,
                client_id: user.client_id,
                createdBy: user.name
            })
            if (response.data.status === true) {
                setMessage(response.data.message)
                setTimeout(() => {
                    setMessage('')
                }, 5000)
                setInputProductCode('')
                setSearchProduct('')
                getCheckoutTemp()
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleArrow = (e) => {
        if (e.key === "ArrowUp" && selectedItem > 0) {
            setSelectedItem(prev => prev - 1)
        } else if (e.key === "ArrowDown" && selectedItem < getProduct.length - 1) {
            setSelectedItem(prev => prev + 1)
        } else if (e.key === "Enter" && selectedItem >= 0) {
            alert(getProduct[selectedItem].product_name)
        }
    }

    const getCheckoutTemp = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+'/getCheckoutTemp', {
                client_id: user.client_id
            })
            setProductToCheckOut(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    

    // const onNewScanResult = (decodedText, decodedResult) => {
    //     setScanModal(false)
    //     getProductByCode(decodedText)
    // }

    return (
        <>
        {
            isScannerShowed ?
            <video ref={videoRef} style={{ height: '100%', width: '100%' }}></video> :
        
        <Layout>
            <CButton className="scanContainer" onClick={showScanModal}>
                    <CIcon width={25} icon={cilBarcode}/>
            </CButton>
            <CModal backdrop="static" alignment="center" visible={scanModal} onClose={() => setScanModal(false)}>
                <CModalHeader onClose={() => setScanModal(false)}>
                    <CModalTitle>Scan QR</CModalTitle>
                </CModalHeader>
                    <CModalBody>
                        
                    </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setScanModal(false)}>
                            Close
                    </CButton>
                    <CButton color='primary' onClick={startScan}>Scan</CButton>
                    <CButton color='danger' onClick={stopScan}>Stop</CButton>
                </CModalFooter>
            </CModal>
            <CContainer>
                {
                        message ?
                        <CToaster placement='top-end'>
                            <CToast animation={true} autohide={true} visible={true} color="success" className="text-white align-items-center" delay={5000}>
                                <div className="d-flex">
                                    <CToastBody><CIcon className='me-1' icon={cilCheckAlt}/>{message}</CToastBody>
                                    <CToastClose className="me-2 m-auto" white />
                                </div>
                            </CToast>
                        </CToaster> : ''
                }
                <CRow>
                    <CCol md={12}>
                        <CInputGroup className="mb-3">
                            <CFormInput placeholder="Search product ..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} onKeyDown={handleArrow} />
                            <CButton type="button" color="primary"><CIcon className='me-1' icon={cilSearch}/></CButton>
                        </CInputGroup>
                    </CCol>
                    {
                        getProduct.length > 1 ?
                        <CRow>
                            <CCol xs={1}></CCol>
                            <CCol className="productSuggestionCol" xs={10} style={{ position: 'fixed', zIndex: 999, paddingRight: '80px', paddingLeft: '30px', marginTop: '-5px'}}>
                                <dl className="productSuggestionContainer" style={{ marginTop: '-5px', paddingTop: '5px', paddingBottom: '5px', paddingBottom: 0 }}>
                                    {
                                        getProduct?.map((product, i) => {
                                            return <dd key={i} className={selectedItem === i ? "productSuggestionList active" : "productSuggestionList"} onClick={() => getProductByCode(product.product_code)}>
                                                <CRow>
                                                    <CCol xs={6}>
                                                        {product.product_name}
                                                    </CCol>
                                                    <CCol xs={6} style={{ textAlign: 'right' }}>
                                                        <CurrencyFormat value={product.product_sale_amount} displayType={"text"} thousandSeparator={true} prefix={"IDR"} />
                                                    </CCol>
                                                </CRow>
                                            </dd>
                                        })
                                    }
                                </dl>
                            </CCol>
                            <CCol xs={1}></CCol>
                        </CRow> : ''
                    }
                </CRow>
                <CRow>
                    <CCol md={4} className="mb-3 mb-md-0">
                        <CCard>
                            <CCardBody>
                                <CRow>
                                    <CCol xs={8}>
                                        <h5>Customer Details</h5>
                                    </CCol>
                                    <CCol xs={4} style={{ textAlign: 'right' }}>
                                        <button style={{ borderStyle: 'none', background: 'none', margin: 0 }} onClick={() => setCustomerDetailVisibility(!customerDetailVisibility)}><CIcon width={20} icon={customerDetailVisibility?cilChevronCircleUpAlt:cilChevronCircleDownAlt}/></button>
                                    </CCol>
                                </CRow>
                                <hr className="divider" style={{ marginTop: '9px' }} />
                                <CCollapse visible={customerDetailVisibility}>
                                    <CRow>
                                        <CCol md={12}>
                                            <CInputGroup className="mb-3">
                                                <CFormInput placeholder="Search by phone number ..." />
                                                <CButton type="button" color="primary"><CIcon className='me-1' icon={cilSearch}/></CButton>
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={6}>Name</CCol>
                                        <CCol xs={6}>: Customer Name</CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={6}>Phone Number</CCol>
                                        <CCol xs={6}>: Customer Phone</CCol>
                                    </CRow>
                                </CCollapse>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md={8}>
                        <CCard>
                            <CCardBody>
                                <h5>Check-out</h5>
                                <hr className="divider" />
                                <CRow>
                                    <CCol md={12}>
                                        <CInputGroup className="mb-3">
                                            <CFormInput placeholder="Input product code ..." onKeyDown={inputCode} value={inputProductCode} onChange={(e) => setInputProductCode(e.target.value)} />
                                            <CButton type="button" color="primary"><CIcon className='me-1' icon={cilSearch}/></CButton>
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                                <CTable align='middle' className='text-center mt-2' responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>No.</CTableHeaderCell>
                                            <CTableHeaderCell>Product Name</CTableHeaderCell>
                                            <CTableHeaderCell>Qty</CTableHeaderCell>
                                            <CTableHeaderCell>Amount</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {
                                            productToCheckOut?.map((data, i) => (
                                                <CTableRow key={data.id}>
                                                    <CTableDataCell>{i+1}</CTableDataCell>
                                                    <CTableDataCell>{data.product.product_name}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <input value={data.qty} size="1" style={{ borderColor: '#b1b7c1', borderRadius: '8px', boxShadow: 0, textAlign: 'center' }} />
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CurrencyFormat value={data.product.total_sale_amount} displayType={"text"} thousandSeparator={true} prefix={"IDR"} />
                                                    </CTableDataCell>
                                                </CTableRow>
                                                
                                            ))
                                        }
                                        <CTableRow>
                                            <CTableDataCell colSpan={2}>Total</CTableDataCell>
                                            <CTableDataCell>{productToCheckOut.reduce((a,v) => a = a + v.qty, 0)}</CTableDataCell>
                                            <CTableDataCell>
                                                <CurrencyFormat value={productToCheckOut.reduce((a,v) => a + (v.product.product_sale_amount*v.qty), 0)} displayType={"text"} thousandSeparator={true} prefix={"IDR"} />
                                            </CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </Layout>
        }
        </>
    )
}

export default Transactions