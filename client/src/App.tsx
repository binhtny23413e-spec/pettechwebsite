import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InteractionRouter from './components/InteractionRouter';
import ThemeToggle from './components/ThemeToggle';
import FloatingCart from './components/FloatingCart';
import Home from './pages/Home';
import { ArticleDetail, Knowledge } from './pages/PublicPages';
import { Membership, Pricing, ServiceDetail, Services } from './pages/CommercePages';
import AboutPage from './pages/AboutPage';
import { Booking, Login } from './pages/AuthBooking';
import { AdminDashboard, CustomerDashboard, CustomerFeature, StaffDashboard } from './pages/Dashboards';
import { CustomerSettings, PetDetail, PetForm } from './pages/CustomerPetPages';
import { AdminAnalytics, AdminEntities, AdminExpenses, AdminFinance, AdminSettings } from './pages/AdminPages';
import AdminOrders from './pages/LiveAdminOrders';
import CartPage from './pages/CartPage';
export default function App(){return <><InteractionRouter/><ThemeToggle/><FloatingCart/><Routes>
  <Route element={<Layout/>}><Route path="/" element={<Home/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceDetail/>}/><Route path="/pricing" element={<Pricing/>}/><Route path="/membership" element={<Membership/>}/><Route path="/knowledge" element={<Knowledge/>}/><Route path="/knowledge/:slug" element={<ArticleDetail/>}/></Route>
  <Route path="/cart" element={<CartPage/>}/><Route path="/booking" element={<Booking/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Login register/>}/>
  <Route path="/customer" element={<CustomerDashboard/>}/><Route path="/customer/pets" element={<CustomerFeature page="pets"/>}/><Route path="/customer/pets/new" element={<PetForm isNew/>}/><Route path="/customer/pets/:name" element={<PetDetail/>}/><Route path="/customer/pets/:name/edit" element={<PetForm/>}/><Route path="/customer/health" element={<CustomerFeature page="health"/>}/><Route path="/customer/journal" element={<CustomerFeature page="journal"/>}/><Route path="/customer/hotel" element={<CustomerFeature page="hotel"/>}/><Route path="/customer/camera" element={<CustomerFeature page="camera"/>}/><Route path="/customer/payments" element={<CustomerFeature page="payments"/>}/><Route path="/customer/settings" element={<CustomerSettings/>}/>
  <Route path="/staff" element={<StaffDashboard/>}/>
  <Route path="/admin" element={<AdminDashboard/>}/><Route path="/admin/orders" element={<AdminOrders/>}/><Route path="/admin/finance" element={<AdminFinance/>}/><Route path="/admin/expenses" element={<AdminExpenses/>}/><Route path="/admin/customers" element={<AdminEntities type="customers"/>}/><Route path="/admin/pets" element={<AdminEntities type="pets"/>}/><Route path="/admin/memberships" element={<AdminEntities type="memberships"/>}/><Route path="/admin/analytics" element={<AdminAnalytics/>}/><Route path="/admin/settings" element={<AdminSettings/>}/>
 </Routes></>}
