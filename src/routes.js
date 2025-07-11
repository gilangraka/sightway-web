import React from 'react'

const AppHistory = React.lazy(() => import('./views/ManageAppHistory'))
const Dashboard = React.lazy(() => import('./views/Dashboard'))
const ManageCategory = React.lazy(() => import('./views/ManageCategory'))
const ManageTag = React.lazy(() => import('./views/ManageTag'))
const ManageAdmin = React.lazy(() => import('./views/ManageAdmin'))
const ManagePemantau = React.lazy(() => import('./views/ManagePemantau'))
const ManagePenyandang = React.lazy(() => import('./views/ManagePenyandang'))
const ManageBlindstick = React.lazy(() => import('./views/ManageBlindstick'))
const Profile = React.lazy(() => import('./views/Profile'))
const ManagePost = React.lazy(() => import('./views/ManagePost'))
const ManagePostAdd = React.lazy(() => import('./views/ManagePostAdd'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/app-history', name: 'App History', element: AppHistory, roles: ['superadmin'] },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manage-category', name: 'Manage Category', element: ManageCategory },
  { path: '/manage-tag', name: 'Manage Tag', element: ManageTag },
  { path: '/manage-post', name: 'Manage Post', element: ManagePost },
  { path: '/manage-post/add', name: 'Manage Post', element: ManagePostAdd },
  { path: '/manage-admin', name: 'Manage Admin', element: ManageAdmin, roles: ['superadmin'] },
  { path: '/manage-pemantau', name: 'Manage Pemantau', element: ManagePemantau },
  { path: '/manage-penyandang', name: 'Manage Penyandang', element: ManagePenyandang },
  { path: '/manage-blindstick', name: 'Manage Blindstick', element: ManageBlindstick },
  { path: '/profile', name: 'Profile', element: Profile },
]

export default routes
