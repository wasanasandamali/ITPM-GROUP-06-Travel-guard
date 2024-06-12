import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { Col, Row } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

function Post(props) {
  const { post } = props;

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
          <Link to={`/post/${post._id}`}>
            <img
              src={post.image}
              className=""
              alt={post.caption}
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
        className={props.colClass}
        style={{
          // backgroundColor: '#FFFFFF',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px',
        }}
      >
        <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title className={props.titleClass}>{post.caption}</Card.Title>
        </Link>

        <Card.Text className={props.descriptionClass}>
          {post.description.split(' ').slice(0, 47).join(' ')}...
        </Card.Text>
        <Row style={{}}>
          <Col className=" col-10 text-left">
            {' '}
            <Rating rating={post.rating} numReviews={post.numReviews} />
          </Col>
          <Col className=" px-3">
            <div
              style={{
                marginBottom: '10px',
                width: '100%',
                height: '50px',
                backgroundColor:
                  post.type === 'complain'
                    ? 'rgba(214, 21, 53, 0.5)'
                    : post.type === 'compliment'
                    ? 'rgba(5, 210, 111, 0.5)'
                    : 'rgba(45, 104, 254, 0.5)',
                color: '#FFFFFF',
                boxShadow:
                  post.type === 'complain'
                    ? '2px 2px 10px rgba(214, 21, 53, 0.45)'
                    : post.type === 'compliment'
                    ? '2px 2px 10px rgba(5, 210, 111, 0.45)'
                    : '2px 2px 10px rgba(0, 123, 255, 0.45)',
                textAlign: 'center',
                lineHeight: '50px',
                fontWeight: '400',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '16px',
                borderRadius: '100px',
              }}
            >
              {post.type === 'complain'
                ? 'Complain'
                : post.type === 'compliment'
                ? 'Compliment'
                : 'Other'}
            </div>
            <Link
              to={`/post/${post._id}`}
              style={{
                textDecoration: 'none',
              }}
            >
              <h4
                className={props.readmClass}
                style={{
paddingTop: '10px',
                }}
              >
                Read More >>
              </h4>
            </Link>
          </Col>
        </Row>

        <Badge bg="primary">{post.location}</Badge>
      </Col>
    </Row>
  );
}
export default Post;
