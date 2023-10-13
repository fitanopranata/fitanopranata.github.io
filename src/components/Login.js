import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import spinner from '../images/spinner.svg'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser, reset } from '../features/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [message, setMessage] = useState('')
  const [required, setRequired] = useState('')
  // const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user, isError, isSuccess, isLoading, message} = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (user || isSuccess) {
      navigate('/dashboard')
      // window.location.replace('/dashboard')
    }
    dispatch(reset())
  }, [user, isSuccess, dispatch, navigate])

  const Auth = async () => {
    // e.preventDefault()
    // setMessage('')
    setRequired('')
    // setLoading(true)
    if (email !== '') {
      if (password !== '') {
        dispatch(LoginUser({email, password}))
        // try {
        //   await axios.post('http://localhost:5000/login', {
        //     email: email,
        //     password: password
        //   })
        //   setLoading(false)
        //   navigate("/dashboard")
        // } catch (error) {
        //   if (error.response) {
        //     setMessage(error.response.data.message)
        //   }
        //   setLoading(false)
        // }
      } else {
        setRequired('Email & Password must be filled in')
        // setLoading(false)
      }
    } else {
      setRequired('Email & Password must be filled in')
      // setLoading(false)
    }
  }

  const handleLogin = (e) => {
    if (e.key === 'Enter') {
      Auth()
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {
                    required ?
                    <CAlert color="danger" closeButton>
                      {required}
                    </CAlert> : ''
                  }
                  {
                    isError && 
                    <CAlert color="danger" closeButton>
                      {message}
                    </CAlert>
                    // message ? 
                    // <CAlert color="danger" closeButton>
                    //   {message}
                    // </CAlert> : ''
                  }
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleLogin} required/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleLogin}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        {
                          isLoading ?
                          <CButton disabled color="primary" className="px-4" >
                            <img src={spinner} width="16" />
                          </CButton> :
                          <CButton color="primary" className="px-4" onClick={Auth}>
                            Login
                          </CButton>
                        }
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
