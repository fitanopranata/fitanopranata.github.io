import React from "react";

const Dashboard = React.lazy(() => import('./views/Dashboard.js'))

const routes = [
    { path: '/dashboard', exact: true, name: "Dashboard", element: Dashboard }
]

export default routes