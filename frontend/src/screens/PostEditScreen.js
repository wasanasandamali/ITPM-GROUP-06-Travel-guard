/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Button, ButtonGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};

export default function PostEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /post/:id
  const { id: postId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  // const [email, setEmail] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log(userInfo);
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/posts/${postId}`);
        setCaption(data.caption);
        setImage(data.image);
        setImages(data.images);
        setDescription(data.description);
        setType(data.type);
        setLocation(data.location);
        // setEmail(data.email);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [postId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/posts/${postId}`,
        {
          _id: postId,
          caption,
          image,
          images,
          description,
          type,
          location,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Post updated successfully');

      //   todo.................................................................................................................
      navigate('/userposts');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  // const uploadFileHandler = async (e, forImages) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);
  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post('/api/upload', bodyFormData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     dispatch({ type: 'UPLOAD_SUCCESS' });

  //     if (forImages) {
  //       setImages([...images, data.secure_url]);
  //     } else {
  //       setImage(data.secure_url);
  //     }
  //     toast.success('Image uploaded successfully. click Update to apply it');
  //   } catch (err) {
  //     toast.error(getError(err));
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //   }
  // };

  const [imageUploaded, setImageUploaded] = useState(false);
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      // Create a FileReader object
      const reader = new FileReader();
      // Set the image source when the reader loads the image
      reader.onload = function (e) {
        const imgPreview = document.getElementById('img-preview');
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block';

        setImageUploaded(true);
      };

      // Read the image data as a URL
      reader.readAsDataURL(file);

      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };
  return (
    <Card
      style={{
        borderRadius: '25px',
        boxShadow: '0px 0px 50px rgba(0, 0, 0, 0.35)',
      }}
    >
      <Helmet>
        <title>Edit Post ${postId}</title>
      </Helmet>

      <h1
        style={{
          borderTopRightRadius: '25px',
          borderTopLeftRadius: '25px',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 'semi bold',
          fontSize: '17px',
          color: '#FEFEFE',
          backgroundColor: '#2A3042',
          padding: '15px',
        }}
      >
        Create new post
      </h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Container>
          <Row>
            <Col className="align-self-center">
              <Form.Group className="mb-3" controlId="imageFile">
                <div
                  className="upload-image"
                  style={{
                    display: imageUploaded ? 'none' : 'flex',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src="/images/upload.png"
                        alt="Upload icon"
                        style={{ width: '30%' }}
                      />
                    </div>

                    <Row>
                      <Form.Label
                        style={{
                          fontFamily: 'Public Sans,sans-serif',
                          fontWeight: 'semibold',
                          fontSize: '16px',
                          color: '#007BFF',
                        }}
                      >
                        Upload Image
                      </Form.Label>
                    </Row>

                    <Form.Control
                      type="file"
                      onChange={(e) => uploadFileHandler(e, false)}
                      style={{
                        border: '1px solid #56678926',
                        fontFamily: 'Public Sans,sans-serif',
                        fontWeight: 'Medium',
                        fontSize: '16px',
                        color: '#575757',
                        position: 'relative',
                      }}
                    />
                  </div>
                </div>

                <img
                  id="img-preview"
                  alt="Image preview"
                  style={{
                    display: 'none',
                    width: '100%',
                    height: '700',

                    position: 'relative',
                  }}
                ></img>

                {loadingUpload && <LoadingBox></LoadingBox>}
              </Form.Group>
            </Col>
            <Col>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label
                    style={{
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'Semibold',
                      fontSize: '16px',
                      color: '#007BFF',
                    }}
                  >
                    Add a Caption
                  </Form.Label>

                  <Form.Control
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                    style={{
                      border: '1px solid #56678926',
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'Medium',
                      fontSize: '16px',
                      color: '#575757',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="image">
                  <Form.Label
                    style={{
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'semibold',
                      fontSize: '16px',
                      color: '#007BFF',
                    }}
                  >
                    Image File
                  </Form.Label>
                  <Form.Control
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    style={{
                      border: '1px solid #56678926',
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'Medium',
                      fontSize: '16px',
                      color: '#575757',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="additionalImage">
                  <Form.Label
                    style={{
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'semibold',
                      fontSize: '16px',
                      color: '#007BFF',
                    }}
                  >
                    Additional Images
                  </Form.Label>
                  {images.length === 0 && <MessageBox>No image</MessageBox>}
                  <ListGroup variant="flush">
                    {images.map((x) => (
                      <ListGroup.Item key={x}>
                        {x}
                        <Button
                          variant="light"
                          onClick={() => deleteFileHandler(x)}
                        >
                          <i className="fa fa-times-circle"></i>
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="additionalImageFile">
                  <Form.Label
                    style={{
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'semibold',
                      fontSize: '16px',
                      color: '#007BFF',
                    }}
                  >
                    Upload Aditional Image
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => uploadFileHandler(e, true)}
                    style={{
                      border: '1px solid #56678926',
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'Medium',
                      fontSize: '16px',
                      color: '#575757',
                      position: 'relative',
                    }}
                  />
                  {loadingUpload && <LoadingBox></LoadingBox>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label
                    style={{
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'semibold',
                      fontSize: '16px',
                      color: '#007BFF',
                    }}
                  >
                    Description
                  </Form.Label>
                  <Form.Control
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{
                      border: '1px solid #56678926',
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'Medium',
                      fontSize: '16px',
                      color: '#575757',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  />
                </Form.Group>

                <Col>
                  <Form.Group className="mb-3" controlId="type">
                    <Row>
                      <Form.Label
                        style={{
                          fontFamily: 'Public Sans,sans-serif',
                          fontWeight: 'semibold',
                          fontSize: '16px',
                          color: '#007BFF',
                          paddingBottom: '10px',
                        }}
                      >
                        Type :
                        <Form.Control
                          value={type}
                          onChange={(e) => setType(type)}
                          required
                          style={{
                            border: '1px solid #56678926',
                            fontFamily: 'Public Sans,sans-serif',
                            fontWeight: 'Medium',
                            fontSize: '16px',
                            color: '#575757',
                            paddingLeft: '20px',
                            position: 'relative',
                            paddingTop: '10px',
                            marginTop: '10px',
                          }}
                        ></Form.Control>
                      </Form.Label>
                    </Row>
                    <Row>
                      <ButtonGroup>
                        <Button
                          variant={type === 'compliment' ? 'primary' : ''}
                          onClick={() => setType('compliment')}
                          style={{
                            marginRight: '10px',
                            height: '59px',
                            width: '33%',
                            borderRadius: '10px',
                            backgroundColor: '#24C87D',
                            fontFamily: 'Poppins,sans-serif',
                            fontWeight: 'Medium',
                            fontSize: '21px',
                            color: '#FFFFFF',
                            transition: 'background-color 0.3s ease-in-out',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFFFFF';
                            e.target.style.color = '#000000';
                            e.target.style.boxShadow =
                              '0px 0px 20px 2px rgba(5, 210, 111, 0.45)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#24C87D';
                            e.target.style.color = '#FFFFFF';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          Compliment{' '}
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            style={{ marginLeft: '15px' }}
                          />
                        </Button>

                        <Button
                          variant={type === 'complain' ? 'primary' : ''}
                          onClick={() => setType('complain')}
                          style={{
                            marginRight: '10px',
                            height: '59px',
                            width: '33%',
                            borderRadius: '10px',
                            backgroundColor: '#D61535',
                            fontFamily: 'Poppins,sans-serif',
                            fontWeight: 'Medium',
                            fontSize: '21px',
                            color: '#FFFFFF',
                            transition: 'background-color 0.3s ease-in-out',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFFFFF';
                            e.target.style.color = '#000000';
                            e.target.style.boxShadow =
                              '0px 0px 20px 2px rgba(214,21,53,0.45)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#D61535';
                            e.target.style.color = '#FFFFFF';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          Complain
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            style={{ marginLeft: '15px' }}
                          />
                        </Button>

                        <Button
                          variant={type === 'other' ? 'primary' : ''}
                          onClick={() => setType('other')}
                          style={{
                            marginRight: '10px',
                            height: '59px',
                            width: '33%',
                            borderRadius: '10px',
                            backgroundColor: '#007BFF',
                            fontFamily: 'Poppins,sans-serif',
                            fontWeight: 'Medium',
                            fontSize: '21px',
                            color: '#FFFFFF',
                            transition: 'background-color 0.3s ease-in-out',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FFFFFF';
                            e.target.style.color = '#000000';
                            e.target.style.boxShadow =
                              '0px 0px 20px 2px rgba(0,123,255,0.45)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#007BFF';
                            e.target.style.color = '#FFFFFF';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          Other
                        </Button>
                      </ButtonGroup>
                    </Row>
                  </Form.Group>
                </Col>

                <Form.Group className="mb-3" controlId="location">
                  <Form.Label
                    style={{
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'semibold',
                      fontSize: '16px',
                      color: '#007BFF',
                    }}
                  >
                    Location
                  </Form.Label>
                  <Form.Control
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    style={{
                      border: '1px solid #56678926',
                      fontFamily: 'Public Sans,sans-serif',
                      fontWeight: 'Medium',
                      fontSize: '16px',
                      color: '#575757',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  />
                </Form.Group>

                <div className="mb-3">
                  <Button
                    disabled={loadingUpdate}
                    type="submit"
                    style={{
                      width: '100%',
                      borderRadius: '50px',
                      fontFamily: 'Work Sans,sans-serif',
                      fontWeight: 'Semibold',
                      fontSize: '14px',
                      color: 'white',
                      backgroundColor: '#007BFF',
                    }}
                  >
                    Share
                  </Button>
                  {loadingUpdate && <LoadingBox></LoadingBox>}
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </Card>
  );
}
