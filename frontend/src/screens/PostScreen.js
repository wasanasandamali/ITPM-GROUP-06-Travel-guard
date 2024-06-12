import axios from 'axios';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import Sentiment from 'sentiment';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_POST':
      return { ...state, post: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, post: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function PostScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');

  const [isDescriptionVisible, setDescriptionVisible] = useState(true);
  const [isReviewsVisible, setReviewsVisible] = useState(false);

  // todo
  const [comment, setComment] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(true);

  const params = useParams();
  const { id } = params;

  const [{ loading, error, post, loadingCreateReview }, dispatch] = useReducer(
    reducer,
    {
      post: [],
      loading: true,
      error: '',
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        console.log(params);
        const result = await axios.get(`/api/posts/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id]);

  // todo........................

  function analyzeSentiment(comment) {
    console.log('analyzing sentiment:', comment);
    const sentiment = new Sentiment();
    const { score } = sentiment.analyze(comment);
    console.log('sentiment score:', score);
    return score;
  }

  // todo........................

  // function handleFilterComments(sentiment) {
  //   setShowAllComments(false);
  //   const filtered = post.reviews.filter((review) => {
  //     const score = analyzeSentiment(review.comment);
  //     return sentiment > 0 ? score > 0 : score < 0;
  //   });
  //   setFilteredComments(filtered);
  // }

  // function handleShowAllComment() {
  //   setShowAllComments(true);
  //   setFilteredComments([]);
  // }
  const [isAllCommentsSelected] = useState(false);
  const [isPositiveSelected] = useState(false);
  const [isNegativeSelected] = useState(false);

  function handleFilterComments(sentiment) {
    setShowAllComments(false);
    const filtered = post.reviews.filter((review) => {
      const score = analyzeSentiment(review.comment);
      return sentiment > 0 ? score > 0 : score < 0;
    });
    setFilteredComments(filtered);
  }

  function handleShowAllComment() {
    setShowAllComments(true);
    setFilteredComments([]);
  }

  const { state } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/posts/${post._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Review submitted successfully');
      post.reviews.unshift(data.review);
      post.numReviews = data.numReviews;
      post.rating = data.rating;
      dispatch({ type: 'REFRESH_POST', payload: post });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const handleDescClick = () => {
    setDescriptionVisible(true);
    setReviewsVisible(false);
  };

  const handleReviewsClick = () => {
    setDescriptionVisible(false);
    setReviewsVisible(true);
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={selectedImage || post.image}
            alt={post.caption}
            style={{ height: '600px' }}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h5 style={{ color: '#007BFF' }}>Title</h5>

              <Helmet>
                <title>{post.caption}</title>
              </Helmet>
              <h3 style={{ color: '#939393' }}>{post.caption}</h3>
            </ListGroup.Item>
            <br />
            <ListGroup.Item>
              <Rating
                rating={post.rating}
                numReviews={post.numReviews}
              ></Rating>
            </ListGroup.Item>
            <br />
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2">
                {[post.image, ...post.images].map((x) => (
                  <Col key={x}>
                    <Card>
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img
                          variant="top"
                          src={x}
                          alt="post"
                          style={{ width: '100px', height: '150px' }}
                        />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: '40px',
                }}
              >
                Description
              </h4>

              <p
                style={{
                  color: '#999999',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                }}
              >
                {post.description.split(' ').slice(0, 30).join(' ')}
                {post.description.split(' ').length > 30 ? '...' : ''}
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col style={{ color: '#007BFF' }}>location:</Col>
                    <Col>
                      <Badge bg="primary">{post.location} </Badge>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <div>
                      <Col>Type:</Col>
                      <br />
                    </div>

                    <br />

                    <div
                      style={{
                        width: '100%',
                        height: '50px',
                        backgroundColor: '#FFFFFF',
                        color: '#9D9D9D',
                        boxShadow:
                          post.type === 'complain'
                            ? '2px 2px 10px rgba(210, 5, 5, 0.45)'
                            : post.type === 'compliment'
                            ? '2px 2px 10px rgba(5, 210, 111, 0.45)'
                            : '2px 2px 10px rgba(0, 123, 255, 0.45)',
                        textAlign: 'center',
                        lineHeight: '50px',
                        fontWeight: '400',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '16px',
                        borderRadius: '10px',
                      }}
                    >
                      {post.type === 'complain'
                        ? 'Complain'
                        : post.type === 'compliment'
                        ? 'Compliment'
                        : 'Other'}
                    </div>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2
              onClick={handleDescClick}
              style={{
                marginRight: '16px',
                color: isDescriptionVisible ? '#007BFF' : 'inherit',
              }}
            >
              Description
            </h2>
            <h2
              onClick={handleReviewsClick}
              style={{ color: isReviewsVisible ? '#007BFF' : 'inherit' }}
            >
              Reviews
            </h2>
          </div>

          <div>
            <div
              className={`my-3 ${isDescriptionVisible ? 'd-block' : 'd-none'}`}
            >
              <p
                style={{
                  color: '#999999',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: '16px',
                }}
              >
                {post.description}
              </p>
            </div>
          </div>

          <div className="my-3">
            <div className={`my-3 ${isReviewsVisible ? 'd-block' : 'd-none'}`}>
              <div className="mb-3">
                {post.reviews.length === 0 && (
                  <MessageBox>There is no review</MessageBox>
                )}

                <div>
                  <Button
                    bg="white"
                    style={{
                      backgroundColor: isAllCommentsSelected ? '#007BFF' : '',
                      color: '#C0C0C0',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '16px',
                      fontWeight: '500',
                      textShadow: '0.5px 1px 1px #fff',
                      border: isNegativeSelected ? '1px solid #999' : 'none',
                      borderRadius: '5px',
                    }}
                    onClick={handleShowAllComment}
                  >
                    Show All Comments
                  </Button>
                  <Button
                    style={{
                      backgroundColor: isPositiveSelected ? '#007BFF' : '',
                      color: '#C0C0C0',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '500',
                      fontSize: '16px',
                      textShadow: '0.5px 1px 1px #fff',
                      border: isNegativeSelected ? '1px solid #999' : 'none',
                      borderRadius: '5px',
                    }}
                    onClick={() => handleFilterComments(1)}
                  >
                    Show Positive Comments
                  </Button>
                  <Button
                    style={{
                      backgroundColor: isNegativeSelected ? '#007BFF' : '',
                      color: '#C0C0C0',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: '500',
                      fontSize: '16px',
                      textShadow: '0.5px 1px 1px #fff',
                      border: isNegativeSelected ? '1px solid #999' : 'none',
                      borderRadius: '5px',
                    }}
                    onClick={() => handleFilterComments(-1)}
                  >
                    Show Negative Comments
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ width: '65%', paddingRight: 15 }}>
                  <ListGroup>
                    {showAllComments
                      ? post.reviews.map((review) => (
                          <ListGroup.Item
                            key={review._id}
                            style={{
                              borderBottom: '1px solid #909090',
                              paddingTop: '15px',
                              borderLeft: 'none',
                              borderRight: 'none',
                              borderTop: 'none',
                            }}
                          >
                            <Row>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ width: '100px' }}>
                                  <strong
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'bold',
                                      fontSize: '18px',
                                      color: '#706E84',
                                    }}
                                  >
                                    {review.name}
                                  </strong>
                                </div>
                                <Col>
                                  <p
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'bold',
                                      fontSize: '16px',
                                      color: '#82909A',
                                      // add some left margin
                                    }}
                                  >
                                    {review.createdAt.substring(0, 10)}
                                  </p>

                                  <p
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'semi bold',
                                      fontSize: '16px',
                                      color: '#B4B4B4',
                                    }}
                                  >
                                    {review.comment}
                                  </p>
                                  {/* <p>
                          Sentiment Score: {analyzeSentiment(review.comment)}
                        </p> */}
                                  <Rating
                                    rating={review.rating}
                                    caption="Rating"
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'bold',
                                      fontSize: '14px',
                                      color: '#BDBDBD',
                                    }}
                                  ></Rating>
                                </Col>
                              </div>
                            </Row>
                          </ListGroup.Item>
                        ))
                      : filteredComments.map((review) => (
                          <ListGroup.Item
                            key={review._id}
                            style={{
                              borderBottom: '1px solid #909090',
                              paddingTop: '15px',
                              borderLeft: 'none',
                              borderRight: 'none',
                              borderTop: 'none',
                            }}
                          >
                            <Row>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ width: '100px' }}>
                                  <strong
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'bold',
                                      fontSize: '18px',
                                      color: '#706E84',
                                    }}
                                  >
                                    {review.name}
                                  </strong>
                                </div>
                                <Col>
                                  <p
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'bold',
                                      fontSize: '16px',
                                      color: '#82909A',
                                      // add some left margin
                                    }}
                                  >
                                    {review.createdAt.substring(0, 10)}
                                  </p>

                                  <p
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'semi bold',
                                      fontSize: '16px',
                                      color: '#B4B4B4',
                                    }}
                                  >
                                    {review.comment}
                                  </p>
                                  {/* <p>
                          Sentiment Score: {analyzeSentiment(review.comment)}
                        </p> */}
                                  <Rating
                                    rating={review.rating}
                                    caption="Rating"
                                    style={{
                                      fontFamily: "'Inter', sans-serif",
                                      fontWeight: 'bold',
                                      fontSize: '14px',
                                      color: '#BDBDBD',
                                    }}
                                  ></Rating>
                                </Col>
                              </div>
                            </Row>
                          </ListGroup.Item>
                        ))}
                  </ListGroup>
                </div>
                <div style={{ width: '35%' }}>
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <h2
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 'bold',
                          fontSize: '20px',
                          color: '#324959',
                        }}
                      >
                        Write a customer review
                      </h2>
                      <Form.Group className="mb-3" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          aria-label="Rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1- Poor</option>
                          <option value="2">2- Fair</option>
                          <option value="3">3- Good</option>
                          <option value="4">4- Very good</option>
                          <option value="5">5- Excelent</option>
                        </Form.Select>
                      </Form.Group>
                      <FloatingLabel
                        controlId="floatingTextarea"
                        label="Write Your Comment..."
                        className="mb-3"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: '400',
                          fontSize: '14px',
                        }}
                      >
                        <Form.Control
                          as="textarea"
                          placeholder="Leave a comment here"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FloatingLabel>

                      <div className="mb-3">
                        <Button
                          disabled={loadingCreateReview}
                          type="submit"
                          style={{
                            width: '100%',
                            background:
                              'linear-gradient(to bottom, #6CA9EA, #007BFF)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '10px',
                            color: '#fff',
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: '400',
                            fontSize: '16px',
                            cursor: 'pointer',
                          }}
                        >
                          Submit
                        </Button>
                        {loadingCreateReview && <LoadingBox></LoadingBox>}
                      </div>
                    </form>
                  ) : (
                    <MessageBox>
                      Please{' '}
                      <Link to={`/signin?redirect=/post/${post.id}`}>
                        Sign In
                      </Link>{' '}
                      to write a review
                    </MessageBox>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
export default PostScreen;
