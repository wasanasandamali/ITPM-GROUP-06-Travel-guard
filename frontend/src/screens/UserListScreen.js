
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function UserListScreen() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableHeaders = [
      { label: 'ID', key: '_id' },
      { label: 'NAME', key: 'name' },
      { label: 'EMAIL', key: 'email' },
      { label: 'IS ADMIN', key: 'isAdmin' },
    ];

    doc.setFontSize(12);
    doc.text('User Report', 15, 15);
    doc.autoTable({
      head: [tableHeaders.map((header) => header.label)],
      body: users.map((user) => tableHeaders.map((header) => user[header.key])),
      startY: 20,
    });

    doc.save('user_report.pdf');
  };

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table" id="pdfdiv">
          <thead>
            <tr
              style={{
                backgroundColor: '#2A3042',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '17px',
                fontWeight: '600',
                color: '#FEFEFE',
              }}
            >
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '15px',
              fontWeight: '400 ',
              color: '#575757',
            }}
          >
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    style={{
                      borderRadius: '35px',
                      backgroundColor: '#007BFF',
                      color: '#FFFFFF',
                      width: '100px',
                    }}
                    onClick={() => navigate(`/admin/user/${user._id}`)}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    style={{
                      borderRadius: '35px',
                      backgroundColor: '#007BFF',
                      color: '#FFFFFF',
                      width: '100px',
                    }}
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Button
        type="button"
        variant="light"
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
        onClick={generateReport}
      >
        Generate Report
      </Button>
         
    </div>
  );
}
