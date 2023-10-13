import React, {useState, useEffect} from 'react'
import { userLoggedIn } from '../features/auth.js'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import {
  CAvatar,
  CButton,
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilMenu } from '@coreui/icons'
import avatar8 from '../images/default.jpg'
import Loader from './Loader'

import { LogOut, reset } from '../features/auth'

const Header = () => {
  const menu_url = window.location.href.split("/").pop()
  const menu_url_without_params = menu_url.split("?")[0]
  const menuName = menu_url_without_params.charAt(0).toUpperCase() + menu_url_without_params.slice(1).toLowerCase();
  // const menuName = window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/'))
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const {isError, user} = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(userLoggedIn())
    }, [dispatch])

    useEffect(() => {
        if (isError) {
            navigate('/')
        }
    }, [isError, navigate])

  const Logout = async () => {
    dispatch(LogOut())
    dispatch(reset())
    window.location.replace('/')
    
    
    // e.preventDefault()
    // try {
    //     setLoading(true)
    //     await axios.delete('http://localhost:5000/logout')
    //     setLoading(false)
    //     window.location.replace('/')
    // } catch (error) {
    //     console.log(error)
    // }
  }
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)

  

  return (
    loading ? <Loader /> : <CHeader position="sticky" className="mb-4">
    <CContainer fluid>
      <CHeaderToggler
        className="ps-1"
        onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
      >
        <CIcon icon={cilMenu} size="lg" />
      </CHeaderToggler>
      {/* <CHeaderBrand className="mx-auto d-md-none" to="/">
        <CIcon icon={logo} height={48} alt="Logo" />
      </CHeaderBrand> */}
      <CHeaderNav className="d-md-flex me-auto">
        <CNavItem>
          {menuName}
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav className="ms-3">
        {/* <AppHeaderDropdown /> */}
        <CDropdown variant="nav-item">
          <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
              <CAvatar src={avatar8} size="md" />
          </CDropdownToggle>
          <CDropdownMenu className="pt-0" placement="bottom-end">
            <CDropdownItem onClick={Logout}>
              Logout
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      Welcome, {
        user ? user.name : ''
      }
    </CContainer>
  </CHeader>
  )
}

export default Header
