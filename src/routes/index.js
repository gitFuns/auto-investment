import Home from 'bundle-loader?lazy!../views/home/index'
import OpenAutoInvest from 'bundle-loader?lazy!../views/openAutoInvest'
import AutoInvestExplain from 'bundle-loader?lazy!../views/autoInvestExplain'
import CustomerService from 'bundle-loader?lazy!../views/customerService'
import AutoInvestWithBalance from 'bundle-loader?lazy!../views/autoInvestWithBalance'
import AutoInvestWithRedPacket from 'bundle-loader?lazy!../views/autoInvestWithRedPacket'
import AutoInvestService from 'bundle-loader?lazy!../views/autoInvestService'
import AutoInvestList from 'bundle-loader?lazy!../views/autoInvestList'
import AutoInvestDetail from 'bundle-loader?lazy!../views/autoInvestDetail'

import { bundleComponent } from '../components/bundleComponent'


export const routes = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: bundleComponent(Home)
  },
  {
    key: 'index',
    path: '/index',
    exact: true,
    component: bundleComponent(Home)
  },
  {
    key: 'openAutoInvest',
    path: '/openAutoInvest',
    exact: true,
    component: bundleComponent(OpenAutoInvest)
  },
  {
    key: 'autoInvestExplain',
    path: '/autoInvestExplain',
    component: bundleComponent(AutoInvestExplain)
  },
  {
    key: 'customerService',
    path: '/customerService',
    component: bundleComponent(CustomerService)
  },
  {
    key: 'autoInvestWithBalance',
    path: '/autoInvestWithBalance',
    component: bundleComponent(AutoInvestWithBalance)
  },
  {
    key: 'autoInvestWithRedPacket',
    path: '/autoInvestWithRedPacket',
    component: bundleComponent(AutoInvestWithRedPacket)
  },
  {
    key: 'autoInvestService',
    path: '/autoInvestService',
    component: bundleComponent(AutoInvestService)
  },
  {
    key: 'autoInvestList',
    path: '/autoInvestList',
    component: bundleComponent(AutoInvestList)
  },
  {
    key: 'autoInvestDetail',
    path: '/autoInvestDetail/:id',
    component: bundleComponent(AutoInvestDetail)
  }
]
