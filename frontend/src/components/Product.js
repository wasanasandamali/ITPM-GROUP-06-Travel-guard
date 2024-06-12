import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { Col, Row } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Row
      style={{
        borderRadius: '20px',
        boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.45)',
      }}
    >
      <Col className="align-self-center col-2 px-0">
        <div
          style={{
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
          }}
        >
          {' '}
          <Link to={`/product/${product.slug}`}>
            <img
              src={product.image}
              className=""
              alt={product.name}
              style={{
                height: '250px',
                width: '100%',
                objectFit: 'cover',
                overflow: 'hidden',
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
              }}
            />
          </Link>
        </div>
      </Col>
      <Col
        className={props.productcolClass}
        style={{
          // backgroundColor: '#FFFFFF',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px',
        }}
      >
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title className={props.producttitleClass}>
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text className={props.productdescriptionClass}>
          {product.description.split(' ').slice(0, 47).join(' ')}...
        </Card.Text>
        <Row style={{}}>
          <Col className=" col-10 text-left">
            {' '}
            <Rating rating={product.rating} numReviews={product.numReviews} />
          </Col>
          <Col className=" px-3">
            {product.countInStock === 0 ? (
              <Button variant="danger" disabled>
                Out of stock
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: ' #3AD784',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: '16px',
                  height: '32px',
                  width: '140px',
                  textAlign: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => addToCartHandler(product)}
              >
                Book Now
              </Button>
            )}
          </Col>
        </Row>

        <Badge bg="success">Rs : {product.price}</Badge>
      </Col>
    </Row>
  );
}
export default Product;
