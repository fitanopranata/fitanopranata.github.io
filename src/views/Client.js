import React, {useEffect, useState} from 'react'
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CContainer,
    CButton,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CModalTitle,
    CCol,
    CFormInput,
    CBadge,
    CFormSelect,
    CAlert,
    CToast,
    CToastBody,
    CToastClose,
    CToaster
} from '@coreui/react'
import Layout from '../layout/Layout.js'
import axios from 'axios'
import spinner from '../images/spinner.svg'
import Moment from 'react-moment'
import CIcon from '@coreui/icons-react';
import Loader from '../components/Loader.js';
import { cilCheckAlt } from '@coreui/icons';
import { useSelector } from 'react-redux'

const Client = () => {
    const [client, setClient] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [clientModal, setClientModal] = useState(false)
    const [clientId, setClientId] = useState('')
    const [deleteClientModal, setDeleteClientModal] = useState(false)
    const [editClientModal, setEditClientModal] = useState(false)
    const [clientName, setClientName] = useState('')
    const [editClientName, setEditClientName] = useState('')
    const [editClientId, setEditClientId] = useState('')
    const [loadingEditModal, setLoadingEditModal] = useState(false)
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const {user, isLoading} = useSelector((state) => state.auth)

    useEffect(() => {
        if (user && !isLoading) {
            getClient()
        }
    }, [user, isLoading])

    const getClient = async () => {
        try {
            setLoadingPage(true)
            const response = await axios.post(process.env.REACT_APP_API_URL+'/client', {
                client_id: user.client_id
            })
            setClient(response.data)
            setLoadingPage(false)
        } catch (error) {
            console.log(error)
        }
    }

    const SubmitNewClient = () => {
        if (clientName !== '') {
            if (loading) {
                return <CButton disabled color="primary" className="px-4" > <img src={spinner} width="16" /></CButton>
            } else {
                return <CButton color="primary" onClick={submitNewClient}>Submit</CButton>
            }
        } else {
           return <CButton color="primary" onClick={submitNewClient} disabled>Submit</CButton>
        }
    }

    const submitNewClient = async (e) => {
        setMessage('')
        setErrorMessage('')
        setLoading(true)
        e.preventDefault()
        try {
            const post = await axios.post(process.env.REACT_APP_API_URL+'/addClient', {
                    client_name: clientName,
                    createdBy: user.name
                })
                if (post.data.status === true) {
                    setMessage(post.data.message)
                    setTimeout(() => {
                        setMessage('')
                    }, 5000)
                    setLoading(false)
                    setClientModal(false)
                    setClientName('')
                    setClientId('')
                    getClient()
                } else {
                    setErrorMessage(post.data.message)
                    setTimeout(() => {
                        setErrorMessage('')
                    }, 5000)
                    setLoading(false)
                    setClientModal(false)
                    setClientName('')
                    setClientId('')
                    getClient()
                }
        } catch (error) {
            if (error.post) {
                setErrorMessage(error.post.data.message)
                setTimeout(() => {
                    setErrorMessage('')
                }, 2000)
                setLoading(false)
                setClientModal(false)
                setClientName('')
                setClientId('')
                getClient()
            }
        }
    }

    const editClient = async (value) => {
        setLoadingEditModal(true)
        setEditClientModal(!editClientModal)
        const getClientById = await axios.get(process.env.REACT_APP_API_URL+`/client/${value}`)
        setEditClientName(getClientById.data.client_name)
        setEditClientId(getClientById.data.id)
        setLoadingEditModal(false)
    }

    const SubmitEditClient = () => {
        if (editClientName !== '') {
            if (loading) {
                return <CButton disabled color="primary" className="px-4" > <img src={spinner} width="16" /></CButton>
            } else {
                return <CButton color="primary" onClick={submitEditClient}>Submit</CButton>
            }
        } else {
           return <CButton color="primary" onClick={submitEditClient} disabled>Submit</CButton>
        }
    }

    const submitEditClient = async (e) => {
        setMessage('')
        setErrorMessage('')
        setLoading(true)
        e.preventDefault()
        try {
            const patch = await axios.patch(process.env.REACT_APP_API_URL+`/editClient/${editClientId}`, {
                client_name: editClientName,
                updatedBy: user.name
            })
            if (patch.data.status === true) {
                setMessage(patch.data.message)
                setTimeout(() => {
                    setMessage('')
                }, 5000)
                setLoading(false)
                setEditClientModal(false)
                setEditClientId('')
                setEditClientName('')
                getClient()
            } else {
                setErrorMessage(patch.data.message)
                setTimeout(() => {
                    setErrorMessage('')
                }, 5000)
                setLoading(false)
                setEditClientModal(false)
                setEditClientId('')
                setEditClientName('')
            }
        } catch (error) {
            if (error.patch) {
                setErrorMessage(error.patch.data.message)
                setTimeout(() => {
                    setErrorMessage('')
                }, 5000)
                setLoading(false)
                setEditClientModal(false)
                setEditClientId('')
                setEditClientName('')
            }
        }
        getClient()
    }

    const deleteClient = async (value) => {
        setDeleteClientModal(!deleteClientModal)
        setClientId(value)
    }

    const submitDeleteClient = async () => {
        setLoading(true)
        const response = await axios.delete(process.env.REACT_APP_API_URL+`/deleteClient/${clientId}`)
        if (response.data.status === true) {
            setLoading(false)
            setDeleteClientModal(false)
            setMessage(response.data.message)
            setTimeout(() => {
                setMessage('')
            }, 5000)
        } else {
            setLoading(false)
            setDeleteClientModal(false)
            setErrorMessage(response.data.message)
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        }
        getClient()
    }


    return (
        <Layout>
            {
                isLoading || loadingPage ? 
                <Loader height={'60vh'} /> :
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
                    {
                        errorMessage ? <CAlert color="danger" dismissible>{errorMessage}</CAlert> : ''
                    }
                    {/* add client */}
                    <CButton className="mb-3 me-2" onClick={() => setClientModal(!clientModal)}>Add Client</CButton>
                    <CModal backdrop="static" alignment="center" visible={clientModal} onClose={() => setClientModal(false)}>
                        <CModalHeader onClose={() => setClientModal(false)}>
                            <CModalTitle>Add Client</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CCol sm={12} className="mb-3">
                                <CFormInput
                                label="Client Name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)} 
                                />
                            </CCol>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setClientModal(false)}>
                            Close
                            </CButton>
                            <SubmitNewClient />
                        </CModalFooter>
                    </CModal>
                    {/* end add client */}
                    {/* edit client */}
                    <CModal backdrop="static" alignment="center" visible={editClientModal} onClose={() => setEditClientModal(false)}>
                        <CModalHeader onClose={() => setEditClientModal(false)}>
                            <CModalTitle>Edit Client</CModalTitle>
                        </CModalHeader>
                        {
                            loadingEditModal ?
                            <div className="layout">
                                <div className="background" style={{ background: 'rgba(0,0,0, 0)' }}>
                                    <img src={spinner} className="image" alt="logo" />
                                    <p style={{ color: '#2C384AF2' }}>
                                    Please wait . . .
                                    </p>
                                </div>
                            </div> :
                            <CModalBody>
                                <CCol sm={12} className="mb-3">
                                    <CFormInput
                                    label="Client Name"
                                    value={editClientName}
                                    onChange={(e) => setEditClientName(e.target.value)} 
                                    />
                                </CCol>
                            </CModalBody>
                        }
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setEditClientModal(false)}>
                            Close
                            </CButton>
                            <SubmitEditClient />
                        </CModalFooter>
                    </CModal>
                    {/* end edit client */}
                    {/* modal delete */}
                    <CModal backdrop="static" alignment="center" visible={deleteClientModal} onClose={() => setDeleteClientModal(false)}>
                        <CModalHeader onClose={() => setDeleteClientModal(false)}>
                            <CModalTitle>Delete</CModalTitle>
                        </CModalHeader>
                            <CModalBody>
                                Are you sure want to delete data?
                            </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setDeleteClientModal(false)}>
                            Close
                            </CButton>
                            {
                                loading ? <CButton disabled color="danger" className="px-4" > <img src={spinner} width="16" /></CButton> : <CButton color="danger" onClick={submitDeleteClient}>Delete</CButton>
                            }
                        </CModalFooter>
                    </CModal>
                    {/* end modal delete */}
                    <CTable align='middle' className='text-center mt-2' responsive striped hover bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Client Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Created</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Updated</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                client?.map((client, i) => (
                                    <CTableRow key={client.id}>
                                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                                        <CTableDataCell>{client.client_name}</CTableDataCell>
                                        <CTableDataCell>
                                            {client.createdBy} <br />
                                            <Moment format="YYYY-MM-DD HH:mm:ss" date={client.createdAt}/>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                client.updatedAt ?
                                                <>{client.createdBy} <br />
                                                <Moment format="YYYY-MM-DD HH:mm:ss" date={client.updatedAt}/></>  : ''
                                            }
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CBadge className="me-1 button" data-id={client.id} onClick={() => editClient(client.id)} color="warning">Edit</CBadge>
                                            <CBadge className="button" data-id={client.id} onClick={() => deleteClient(client.id)} color="danger">Delete</CBadge>
                                            {/* <CBadge className="me-1 button" data-id={actual.id} color="warning" onClick={() => editActual(actual.id)}>Edit</CBadge>
                                            <CBadge color="danger" onClick={() => deleteActual(actual.id)}>Delete</CBadge> */}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))
                            }
                        </CTableBody>
                    </CTable>
                </CContainer>
            }
        </Layout>
    )
}

export default Client