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
    CToaster,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem
} from '@coreui/react'
import Layout from '../layout/Layout.js'
import axios from 'axios'
import spinner from '../images/spinner.svg'
import Moment from 'react-moment'
import Loader from '../components/Loader.js';
import CIcon from '@coreui/icons-react';
import { cilCheckAlt } from '@coreui/icons';
import { useSelector } from 'react-redux'

const Account = () => {
    const [account, setAccount] = useState([])
    const [client, setClient] = useState([])
    const [role, setRole] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [deleteAccountModal, setDeleteAccountModal] = useState(false)
    const [editAccountModal, setEditAccountModal] = useState(false)
    // add account
    const [accountModal, setAccountModal] = useState(false)
    const [accountName, setAccountName] = useState('')
    const [accountEmail, setAccountEmail] = useState('')
    const [clientId, setClientId] = useState(null)
    const [roleId, setRoleId] = useState('')
    const [isActive, setIsActive] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    // end add account
    // edit account
    const [loadingEditAccountModal, setLoadingEditAccountModal] = useState(false)
    const [accountId, setAccountId] = useState('')
    const [editAccountName, setEditAccountName] = useState('')
    const [editClientId, setEditClientId] = useState('')
    const [editAccountEmail, setEditAccountEmail] = useState('')
    const [editRoleId, setEditRoleId] = useState('')
    const [editIsActive, setEditIsActive] = useState('')
    // end edit account
    const [message, setMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    // change password
    const [changePasswordModal, setChangePasswordModal] = useState(false)
    const [editPassword, setEditPassword] = useState('')
    const [editConfirmPassword, setEditConfirmPassword] = useState('')
    const [errorChangePassword, setErrorChangePassword] = useState('')
    const [userPassword, setUserPassword] = useState('')
    // end change password

    const {user, isLoading} = useSelector((state) => state.auth)

    useEffect(() => {
        if (user && !isLoading) {
            getAccount()
            getClient()
            getRole()
        }
    }, [user, isLoading])

    const getAccount = async () => {
        try {
            setLoadingPage(true)
            const response = await axios.post(process.env.REACT_APP_API_URL+'/getUsers', {
                role_id: user.role_id,
                client_id: user.client_id
            })
            setAccount(response.data)
            setLoadingPage(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getClient = async () => {
        try {
            setLoadingPage(true)
            const response = await axios.get(process.env.REACT_APP_API_URL+'/client')
            setClient(response.data)
            setLoadingPage(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getRole = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+'/userRole', {
                role_id: user.role_id
            })
            setRole(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const SubmitNewAccount = () => {
        if (accountName !== '') {
            if (accountEmail !== '') {
                if (roleId !== '') {
                    if (password !== '') {
                        if (isActive !== '') {
                            if (confirmPassword !== '') {
                                if (loading) {
                                    return <CButton disabled color="primary" className="px-4" > <img src={spinner} width="16" /></CButton>
                                } else {
                                    return <CButton color="primary" onClick={submitNewAccount}>Submit</CButton>
                                }
                            } else {
                                return <CButton color="primary" disabled>Submit</CButton> 
                            }
                        } else {
                            return <CButton color="primary" disabled>Submit</CButton> 
                        }
                    } else {
                        return <CButton color="primary" disabled>Submit</CButton>
                    }
                } else {
                    return <CButton color="primary" disabled>Submit</CButton>
                }
            } else {
                return <CButton color="primary" disabled>Submit</CButton>
            }
        } else {
           return <CButton color="primary" disabled>Submit</CButton>
        }
    }

    const submitNewAccount = async (e) => {
        setMessage('')
        setErrorMessage('')
        setLoading(true)
        e.preventDefault()
        try {
            const post = await axios.post(process.env.REACT_APP_API_URL+'/users', {
                    name: accountName,
                    email: accountEmail,
                    password: password,
                    confirmPassword: confirmPassword,
                    client_id: clientId,
                    role_id: roleId,
                    is_active: isActive,
                    createdBy: user.name
                })
                if (post.data.status === true) {
                    setMessage(post.data.message)
                    setTimeout(() => {
                        setMessage('')
                    }, 5000)
                    setLoading(false)
                    setAccountModal(false)
                    setAccountName('')
                    setAccountEmail('')
                    setPassword('')
                    setConfirmPassword('')
                    setClientId(null)
                    setRoleId('')
                    setIsActive('')
                    getAccount()
                } else {
                    setErrorMessage(post.data.message)
                    setTimeout(() => {
                        setErrorMessage('')
                    }, 5000)
                    setLoading(false)
                    setAccountModal(false)
                    setAccountName('')
                    setAccountEmail('')
                    setPassword('')
                    setConfirmPassword('')
                    setClientId(null)
                    setRoleId('')
                    setIsActive('')
                    getAccount()
                }
        } catch (error) {
            if (error.post) {
                setErrorMessage(error.post.data.message)
                setTimeout(() => {
                    setErrorMessage('')
                }, 2000)
                setLoading(false)
                setAccountModal(false)
                setAccountName('')
                setAccountEmail('')
                setPassword('')
                setConfirmPassword('')
                setClientId(null)
                setRoleId('')
                setIsActive('')
                getAccount()
            }
        }
    }

    const deleteAccount = async (value) => {
        setDeleteAccountModal(!deleteAccountModal)
        setAccountId(value)
    }

    
    const submitDeleteAccount = async () => {
        setLoading(true)
        const response = await axios.delete(process.env.REACT_APP_API_URL+`/deleteUsers/${accountId}`)
        if (response.data.status === true) {
            setLoading(false)
            setDeleteAccountModal(false)
            setMessage(response.data.message)
            setTimeout(() => {
                setMessage('')
            }, 5000)
        } else {
            setLoading(false)
            setDeleteAccountModal(false)
            setErrorMessage(response.data.message)
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        }
        getAccount()
    }
    
    const editAccount = async (value) => {
        setLoadingEditAccountModal(true)
        setEditAccountModal(!editAccountModal)
        const getAccount = await axios.post(process.env.REACT_APP_API_URL+`/getUsersById`, {
            id: value,
            role_id: user.role_id,
            client_id: user.client_id
        })
        setAccountId(getAccount.data.id)
        setEditAccountName(getAccount.data.name)
        setEditAccountEmail(getAccount.data.email)
        setEditRoleId(getAccount.data.role.id)
        setEditIsActive(getAccount.data.is_active)
        setLoadingEditAccountModal(false)
        if (getAccount.data.client !== null) {
            setEditClientId(getAccount.data.client.id)
        } else {
            setEditClientId('0')
        }
    }

    const SubmitEditAccount = () => {
        if (editAccountName !== '') {
            if (editAccountEmail !== '') {
                if (editRoleId !== '') {
                    if (editIsActive !== '') {
                        if (loading) {
                            return <CButton disabled color="primary" className="px-4" > <img src={spinner} width="16" /></CButton>
                        } else {
                            return <CButton color="primary" onClick={submitEditAccount}>Submit</CButton>
                        }
                    } else {
                        return <CButton color="primary" disabled>Submit</CButton> 
                    }
                } else {
                    return <CButton color="primary" disabled>Submit</CButton>
                }
            } else {
                return <CButton color="primary" disabled>Submit</CButton>
            }
        } else {
           return <CButton color="primary" disabled>Submit</CButton>
        }
    }

    const submitEditAccount = async (e) => {
        setMessage('')
        setErrorMessage('')
        setLoading(true)
        e.preventDefault()
        try {
            const post = await axios.patch(process.env.REACT_APP_API_URL+`/editUsers/${accountId}`, {
                    name: editAccountName,
                    email: editAccountEmail,
                    client_id: editClientId,
                    role_id: editRoleId,
                    is_active: editIsActive,
                    updatedBy: user.name
                })
                if (post.data.status === true) {
                    setMessage(post.data.message)
                    setTimeout(() => {
                        setMessage('')
                    }, 5000)
                    setLoading(false)
                    setAccountId('')
                    setEditAccountModal(false)
                    setEditAccountName('')
                    setEditAccountEmail('')
                    setEditClientId(null)
                    setEditRoleId('')
                    setEditIsActive('')
                    getAccount()
                } else {
                    setErrorMessage(post.data.message)
                    setTimeout(() => {
                        setErrorMessage('')
                    }, 5000)
                    setLoading(false)
                    setAccountId('')
                    setEditAccountModal(false)
                    setEditAccountName('')
                    setEditAccountEmail('')
                    setEditClientId(null)
                    setEditRoleId('')
                    setEditIsActive('')
                    getAccount()
                }
        } catch (error) {
            if (error.post) {
                setErrorMessage(error.post.data.message)
                setTimeout(() => {
                    setErrorMessage('')
                }, 2000)
                setLoading(false)
                setAccountId('')
                setEditAccountModal(false)
                setEditAccountName('')
                setEditAccountEmail('')
                setEditClientId(null)
                setEditRoleId('')
                setEditIsActive('')
                getAccount()
            }
        }
    }

    const changePassword = (value) => {
        setChangePasswordModal(!changePasswordModal)
        setAccountId(value)
    }

    const SubmitChangePassword = () => {
        if (editPassword !== '') {
            if (editConfirmPassword !== '') {
                if (userPassword !== '') {
                    if (loading) {
                        return <CButton disabled color="primary" className="px-4" > <img src={spinner} width="16" /></CButton>
                    } else {
                        return <CButton color="primary" onClick={submitChangePassword}>Submit</CButton>
                    }
                } else {
                    return <CButton color="primary" disabled>Submit</CButton>
                }
            } else {
                return <CButton color="primary" disabled>Submit</CButton>
            }
        } else {
           return <CButton color="primary" disabled>Submit</CButton>
        }
    }

    const submitChangePassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorChangePassword('')
        if (editPassword === editConfirmPassword) {
            try {
                const userChangerId = user.id
                const response = await axios.patch(process.env.REACT_APP_API_URL+`/changeAccountPassword/${userChangerId}`, {
                    userChangerPassword: userPassword,
                    accountId: accountId,
                    accountPassword: editPassword
                })
                if (response.data.status === 'wrongUserPassword') {
                    setErrorChangePassword(response.data.message)
                    setLoading(false)
                } else {
                    setMessage(response.data.message)
                    setTimeout(() => {
                        setMessage('')
                    }, 5000)
                    setLoading(false)
                    setEditPassword('')
                    setUserPassword('')
                    setEditConfirmPassword('')
                    setAccountId('')
                    setChangePasswordModal(false)
                    getAccount()
                }
            } catch (error) {
                setErrorMessage(error.message)
                setLoading(false)
                setEditPassword('')
                setUserPassword('')
                setEditConfirmPassword('')
                setAccountId('')
                setChangePasswordModal(false)
                getAccount()
            }
        } else {
            setErrorChangePassword(`Password doesn't match!`)
        }
        setLoading(false)
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
                    {/* add account */}
                    <CButton className="mb-3 me-2" onClick={() => setAccountModal(!accountModal)}>Add Account</CButton>
                    <CModal backdrop="static" alignment="center" visible={accountModal} onClose={() => setAccountModal(false)}>
                        <CModalHeader onClose={() => setAccountModal(false)}>
                            <CModalTitle>Add Account</CModalTitle>
                        </CModalHeader>
                        {
                            loadingEditAccountModal ?
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
                                label="Account Name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)} 
                                />
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                <CFormInput
                                label="Account Email"
                                value={accountEmail}
                                onChange={(e) => setAccountEmail(e.target.value)} 
                                />
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                <CFormInput
                                type="password"
                                label="Account Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                />
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                <CFormInput
                                type="password"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                    <CFormSelect 
                                        label="For Client"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        >
                                            <option value="">-- Choose Client --</option>
                                            {
                                                user?.client_id === 0 ?
                                                <option value="0">Master</option> :
                                                ""
                                            }
                                            {
                                                client?.map(res => (
                                                    <option key={res.id} value={res.id}>{res.client_name}</option>
                                                    ))
                                                }
                                    </CFormSelect>
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                    <CFormSelect 
                                        label="Role"
                                        value={roleId}
                                        onChange={(e) => setRoleId(e.target.value)}
                                        >
                                            <option value="">-- Choose Role --</option>
                                            {
                                                role?.map(res => (
                                                    <option key={res.id} value={res.id}>{res.role_name}</option>
                                                    ))
                                                }
                                    </CFormSelect>
                            </CCol>
                            <CCol sm={12} className="mb-3">
                            <CFormSelect 
                                        label="Is Active?"
                                        value={isActive}
                                        onChange={(e) => setIsActive(e.target.value)}
                                        >
                                            <option value="">-- Choose --</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                    </CFormSelect>
                                {/* <CFormCheck id="flexCheckChecked" label="Is active?" value={isActive} defaultChecked onChange={handleCheck} /> */}
                            </CCol>
                        </CModalBody>
                        }
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setAccountModal(false)}>
                            Close
                            </CButton>
                            <SubmitNewAccount />
                        </CModalFooter>
                    </CModal>
                    {/* end add account */}
                    {/* modal delete */}
                    <CModal backdrop="static" alignment="center" visible={deleteAccountModal} onClose={() => setDeleteAccountModal(false)}>
                        <CModalHeader onClose={() => setDeleteAccountModal(false)}>
                            <CModalTitle>Delete</CModalTitle>
                        </CModalHeader>
                            <CModalBody>
                                Are you sure want to delete data?
                            </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setDeleteAccountModal(false)}>
                            Close
                            </CButton>
                            {
                                loading ? <CButton disabled color="danger" className="px-4" > <img src={spinner} width="16" /></CButton> : <CButton color="danger" onClick={submitDeleteAccount}>Delete</CButton>
                            }
                        </CModalFooter>
                    </CModal>
                    {/* end modal delete */}
                    {/* modal edit */}
                    <CModal backdrop="static" alignment="center" visible={editAccountModal} onClose={() => setEditAccountModal(false)}>
                        <CModalHeader onClose={() => setEditAccountModal(false)}>
                            <CModalTitle>Edit Account</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CCol sm={12} className="mb-3">
                                <CFormInput
                                label="Account Name"
                                value={editAccountName}
                                onChange={(e) => setEditAccountName(e.target.value)} 
                                />
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                <CFormInput
                                label="Account Email"
                                value={editAccountEmail}
                                onChange={(e) => setEditAccountEmail(e.target.value)} 
                                />
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                    <CFormSelect 
                                        label="For Client"
                                        value={editClientId}
                                        onChange={(e) => setEditClientId(e.target.value)}
                                        >
                                            <option value="">-- Choose Client --</option>
                                            {
                                                user?.client_id === 0 ?
                                                <option value="0">Master</option> :
                                                ""
                                            }
                                            {
                                                client?.map(res => (
                                                    <option key={res.id} value={res.id}>{res.client_name}</option>
                                                    ))
                                                }
                                    </CFormSelect>
                            </CCol>
                            <CCol sm={12} className="mb-3">
                                    <CFormSelect 
                                        label="Role"
                                        value={editRoleId}
                                        onChange={(e) => setEditRoleId(e.target.value)}
                                        >
                                            <option value="">-- Choose Role --</option>
                                            {
                                                role?.map(res => (
                                                    <option key={res.id} value={res.id}>{res.role_name}</option>
                                                    ))
                                                }
                                    </CFormSelect>
                            </CCol>
                            <CCol sm={12} className="mb-3">
                            <CFormSelect 
                                        label="Is Active?"
                                        value={editIsActive}
                                        onChange={(e) => setEditIsActive(e.target.value)}
                                        >
                                            <option value="">-- Choose --</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                    </CFormSelect>
                                {/* <CFormCheck id="flexCheckChecked" label="Is active?" value={isActive} defaultChecked onChange={handleCheck} /> */}
                            </CCol>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setEditAccountModal(false)}>
                            Close
                            </CButton>
                            <SubmitEditAccount />
                        </CModalFooter>
                    </CModal>
                    {/* end modal edit */}
                    {/* modal change password */}
                    <CModal backdrop="static" alignment="center" visible={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
                        <CModalHeader onClose={() => setChangePasswordModal(false)}>
                            <CModalTitle>Change Password</CModalTitle>
                        </CModalHeader>
                            <CModalBody>
                                {
                                    errorChangePassword ? <CAlert color="danger" dismissible>{errorChangePassword}</CAlert> : ''
                                }
                                <CCol sm={12} className="mb-3">
                                    <CFormInput
                                    type="password"
                                    label="Account Password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)} 
                                    />
                                </CCol>
                                <CCol sm={12} className="mb-3">
                                    <CFormInput
                                    type="password"
                                    label="Confirm Password"
                                    value={editConfirmPassword}
                                    onChange={(e) => setEditConfirmPassword(e.target.value)} 
                                    />
                                </CCol>
                                <CCol sm={12} className="mb-3">
                                    <CFormInput
                                    type="password"
                                    label="Your Password"
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)} 
                                    />
                                </CCol>
                            </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setChangePasswordModal(false)}>
                            Close
                            </CButton>
                            <SubmitChangePassword />
                        </CModalFooter>
                    </CModal>
                    {/* end modal change password */}
                    <CTable align='middle' className='text-center mt-2' striped hover bordered>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Account Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Account Email</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Account Role</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Client Name</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Account Status</CTableHeaderCell>
                                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {
                                account?.map((account, i) => (
                                    <CTableRow key={account.id}>
                                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                                        <CTableDataCell>{account.name}</CTableDataCell>
                                        <CTableDataCell>{account.email}</CTableDataCell>
                                        <CTableDataCell>{account.role.role_name}</CTableDataCell>
                                        <CTableDataCell>
                                            {
                                                account.client ?
                                                account.client.client_name :
                                                "-"
                                            }
                                        </CTableDataCell>
                                        {
                                            account.is_active === 1 ?
                                            <CTableDataCell>
                                                <CBadge color="success">Active</CBadge>
                                            </CTableDataCell> :
                                            <CTableDataCell>
                                                <CBadge color="danger">Inactive</CBadge>
                                            </CTableDataCell>
                                        }
                                        <CTableDataCell>
                                            <CDropdown>
                                                <CDropdownToggle style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'black' }}>Action</CDropdownToggle>
                                                    <CDropdownMenu>
                                                        <CDropdownItem component="button" data-id={account.id} onClick={() => editAccount(account.id)}>Edit</CDropdownItem>
                                                        <CDropdownItem component="button" data-id={account.id} onClick={() => deleteAccount(account.id)}>Delete</CDropdownItem>
                                                        <CDropdownItem component="button" data-id={account.id} onClick={() => changePassword(account.id)}>Change Password</CDropdownItem>
                                                    </CDropdownMenu>
                                            </CDropdown>
                                            {/* <CBadge className="me-1 button" data-id={account.id} onClick={() => editAccount(account.id)} color="warning">Edit</CBadge>
                                            <CBadge className="button" data-id={account.id} onClick={() => deleteAccount(account.id)} color="danger">Delete</CBadge> */}
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

export default Account