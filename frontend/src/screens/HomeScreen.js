import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Post from '../components/Post';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import axios from 'axios';
import '../index.css';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/posts');
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    fetchProducts();
  }, []);

  return (
    <div>
      <Helmet>
        <title>travel Guard</title>
      </Helmet>

      <h1>Featured Posts</h1>
      <div className="posts">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            {console.log(posts)}
            {posts.map((post) => (
              <div
                key={post._id}
                // className="mb-5"
                className={`mb-5 ${
                  posts.indexOf(post) % 2 === 0 ? 'post-even' : 'post-odd'
                }`}
                style={{ paddingLeft: '40px' }}
                // style={{ paddingLeft: '40px' }}
              >
                <Post
                  post={post}
                  colClass={
                    posts.indexOf(post) % 2 === 0 ? 'post-col' : 'post-col-alt'
                  }
                  titleClass={
                    posts.indexOf(post) % 2 === 0
                      ? 'post-title'
                      : 'post-title-alt'
                  }
                  descriptionClass={
                    posts.indexOf(post) % 2 === 0
                      ? 'post-description'
                      : 'post-description-alt'
                  }
                  readmClass={
                    posts.indexOf(post) % 2 === 0
                      ? 'post-readm'
                      : 'post-readm-alt'
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <h1>Featured Products</h1>

      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            {console.log(products)}
            {products.map((product) => (
              <div
                key={product.slug}
                className={`mb-5 ${
                  products.indexOf(product) % 2 === 0 ? 'product-even' : 'product-odd'
                }`}
                style={{ paddingLeft: '40px' }}
                // style={{ paddingLeft: '40px' }}
              >
                <Product
                  product={product}
                  productcolClass={
                    products.indexOf(product) % 2 === 0
                      ? 'product-col'
                      : 'product-col-alt'
                  }
                  producttitleClass={
                    products.indexOf(product) % 2 === 0
                      ? 'product-title'
                      : 'product-title-alt'
                  }
                  productdescriptionClass={
                    products.indexOf(product) % 2 === 0
                      ? 'product-description'
                      : 'product-description-alt'
                  }
                  productreadmClass={
                    products.indexOf(product) % 2 === 0
                      ? 'product-readm'
                      : 'product-readm-alt'
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
