import React, {useRef, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CNavGroup, CNavItem, CAvatar, CRow } from '@coreui/react'
import avatar from '../images/default.jpg'
import CIcon from '@coreui/icons-react'
import {cilMoney} from '@coreui/icons'

// sidebar nav config
import axios from 'axios'

import { ThreeDots } from 'react-loader-spinner'

const Sidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.changeState.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const {user, isLoading} = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !isLoading) {
      getMenu()
      getClientName()
    }
  }, [user, isLoading])

  const ref = useRef(null)

  const [menus, setMenus] = useState([])
  const [clientName, setClientName] = useState('')
  // const [subMenus, setSubMenus] = useState([])
  
  const getMenu = async () => {
    const response = await axios.post(process.env.REACT_APP_API_URL+'/listMenuSidebar', {
      role_id: user.role_id
    })
    setMenus(response.data)
  }

  // const handleClick = async (event) => {
  //   const response = await axios.post(`http://localhost:5000/listChildMenuSidebar`, {
  //     role_id: user.role_id,
  //     parent_id: ref.current.id
  //   })
  //   const result = response.data
  //   setSubMenus(result)
  // }

  // const SubMenus = (parent_id) => {
  //   const response = axios.get(`http://localhost:5000/listMenuSidebar/${parent_id}`)
  //   const result = response.data
  //   return (
  //     result?.map(res => (
  //       <CNavItem href="#">{res.menu_name}</CNavItem>
  //     ))
  //   )
  //   setSubMenus(response.data)
  //   return (
  //     subMenus?.map(subMenu => (
  //       <CNavItem href="#">{subMenu.menu_name}</CNavItem>
  //     ))
  //   )
  // }

  const getClientName = async () => {
    try {
      if (user.client_id === 0) {
        setClientName('Master')
      } else {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/client/'+user.client_id)
        setClientName(response.data.client_name)
      }
  } catch (error) {
      console.log(error)
  }
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand style={{ padding: '20px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        <CAvatar src={avatar} size="lg" />
        <p className='mt-2' style={{ fontSize: 'smaller' }}>
          <strong>{user?.name}</strong>
        </p>
        <p style={{ fontSize: 'smaller', marginTop: '-20px' }}>{clientName?clientName:''}</p>
        <p style={{ fontSize: 'smaller', marginTop: '-20px', marginBottom: 0 }}>{user?.email}</p>
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
          {/* <AppSidebarNav items={Navigation} /> */}
          {
              isLoading?
              <ThreeDots 
              height="60" 
              width="60" 
              radius="9"
              color="#2C384AF2" 
              ariaLabel="three-dots-loading"
              wrapperStyle={{ margin: "0 auto", marginTop: "20px" }}
              visible={true}
              /> :
              menus?.map(menu => (
                menu.menu_parent_id === null ?
                // <CNavItem href={window.location.origin+'/'+menu.menu_url}>
                //   {menu.menu_name}
                // </CNavItem> :
                <li className='nav-item'>
                  <NavLink className='nav-link' to={window.location.origin+'/'+menu.menu_url}>{menu.menu_name}</NavLink>
                </li> :
                menu.menu_parent_id === 0 ?
                <CNavGroup ref={ref} id={menu.id} toggler={menu.menu_name}>
                  {
                    menu.submenu?.map((sm) => (
                    // <CNavItem href={window.location.origin+'/'+sm.menu_url}>
                    //     {sm.menu_name}
                    // </CNavItem>
                    <li className='nav-item'>
                      <NavLink className='nav-link' to={window.location.origin+'/'+sm.menu_url}>{sm.menu_name}</NavLink>
                    </li>
                    ))
                  }
                </CNavGroup> : ''
                // <CNavGroup ref={ref} id={menu.id} toggler={menu.menu_name} onClick={handleClick}>
                //   {
                //     subMenus?.map(result => (
                //       <CNavItem href={result.menu_url}>
                //         {result.menu_name}
                //       </CNavItem>
                //     ))
                //   }
                // </CNavGroup> : ''
              ))
            
          }
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(Sidebar)
