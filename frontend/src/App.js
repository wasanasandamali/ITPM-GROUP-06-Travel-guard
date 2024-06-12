import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import PostDashboardScreen from './screens/PostDashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import PostEditScreen from './screens/PostEditScreen';
import PostListScreen from './screens/PostListScreen';
import PostScreen from './screens/PostScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await axios.get(`/api/posts/types`);
        setTypes(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchTypes();
  }, []);

  return (
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundImage: 'url(banner.png)',
          backgroundSize: 'cover',
        }}
      >
        <LinkContainer to="/" style={{ paddingRight: '0px' }}>
          <img src="travel.png" alt="Travel Guard" height={60} />
        </LinkContainer>
        <div className="header" style={{ paddingRight: '180px' }}>
          <LinkContainer to="/">
            <Navbar.Brand>VISIT SRILANKA</Navbar.Brand>
          </LinkContainer>
        </div>
        <div className="header">
          <LinkContainer to="/">
            <Navbar.Brand>BOOKINGS</Navbar.Brand>
          </LinkContainer>
        </div>
        <div className="header">
          <LinkContainer to="/">
            <Navbar.Brand>TOURIST DIARIES</Navbar.Brand>
          </LinkContainer>
        </div>
        <div className="header">
          <LinkContainer to="/">
            <Navbar.Brand>HOTELS</Navbar.Brand>
          </LinkContainer>
        </div>
        <div className="header">
          <LinkContainer to="/">
            <Navbar.Brand>VEHICLES</Navbar.Brand>
          </LinkContainer>
        </div>
        <div className="header">
          <LinkContainer to="/">
            <Navbar.Brand>EMERGENCY</Navbar.Brand>
          </LinkContainer>
        </div>
      </div>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />

        <header>
          <Navbar bg="light" variant="" expand="lg">
            <Container>
              <Button
                variant="light"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <div style={{ paddingLeft: '8px' }}>
                {' '}
                <SearchBox />
              </div>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav
                  className="me-auto  w-100  justify-content-end"
                  style={{ height: '50px' }}
                >
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/userposts">
                        <NavDropdown.Item>User Posts</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/postDashboard">
                        <NavDropdown.Item>Post Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <br />

          <div
            className={
              sidebarIsOpen
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '30px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 1)',
            }}
          >
            <Nav
              className="flex-column text-white w-100 p-2"
              style={{ borderRadius: '30px' }}
            >
              <div class="sidebar-logo">
                <img src="logo.png" alt="Logo" />
                <h1>Travel Guard</h1>
              </div>

              <div className="side-home">
                <img src="home.png" alt="Home" />
                Home
              </div>
              <br />
              <div className="side-title">
                <img
                  src="service.png"
                  alt="Service"
                  style={{ paddingRight: '12px' }}
                />
                Services
              </div>

              <div style={{ paddingLeft: '25px' }}>
                <div className="side-home">
                  <img src="rides.png" alt="Rides" />
                  Rides
                </div>

                <div className="side-home">
                  <img src="hotels.png" alt="Hotels" />
                  Hotels
                </div>

                <div className="side-home">
                  <img src="alert.png" alt="Alert" />
                  Emergency Numbers
                </div>
              </div>
              {/* <Nav.Item>
                <div className="side-home">
                  <img src="service.png" alt="Service" />
                  Categories
                </div>
              </Nav.Item>
              {categories.map((category) => (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={{ pathname: '/search', search: `category=${category}` }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))} */}
              <br />
              <Nav.Item>
                <div className="side-title">
                  <img
                    src="service.png"
                    alt="Service"
                    style={{ paddingRight: '12px' }}
                  />
                  Travel Experience Types
                </div>
              </Nav.Item>
              {/* {types.map((type) => (
                <Nav.Item key={type}>
                  <LinkContainer
                    to={{ pathname: '/search', search: `category=${type}` }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{type}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))} */}
              <div style={{ paddingLeft: '25px' }}>
                {types.map((type) => (
                  <Nav.Item key={type}>
                    <LinkContainer
                      to={{ pathname: '/search', search: `category=${type}` }}
                      onClick={() => setSidebarIsOpen(false)}
                    >
                      <Nav.Link className="post-type">
                        {type === 'complain' ? (
                          <img
                            src="cancel.png"
                            alt="Complain"
                            style={{ marginRight: '8px' }}
                          />
                        ) : type === 'compliment' ? (
                          <img
                            src="accept.png"
                            alt="Compliment"
                            style={{ marginRight: '8px' }}
                          />
                        ) : (
                          <img
                            src="other.png"
                            width={17}
                            alt="Other"
                            style={{ marginRight: '8px' }}
                          />
                        )}
                        {type === 'complain'
                          ? 'Negative Incidents'
                          : type === 'compliment'
                          ? 'Positive Incidents'
                          : 'Other'}
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
              </div>
            </Nav>
          </div>
        </header>

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/post/:id" element={<PostScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userposts"
                element={
                  <ProtectedRoute>
                    <PostListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="userpost/:id"
                element={
                  <ProtectedRoute>
                    <PostEditScreen />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/postDashboard"
                element={
                  <AdminRoute>
                    <PostDashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
