import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CRUD = () => {
  const [formData, setFormData] = useState({
    userId: '',
    id: '',
    title: '',
    body: '',
  });

  const [editID, setEditID] = useState(null);

  const [data, setData] = useState([]);

  const { userId, id, title, body } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId && id && title && body) {
      axios
        .post('https://jsonplaceholder.typicode.com/posts', formData)
        .then((res) => {
          setData([...data, res.data]);
          setFormData({ userId: '', id: '', title: '', body: '' });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUpdate = () => {
    if (userId && id && title && body) {
      axios
        .put(`https://jsonplaceholder.typicode.com/posts/${editID}`, formData)
        .then((res) => {
          const updatedData = data.map((item) => {
            if (item.id === editID) {
              return res.data;
            }
            return item;
          });

          setData(updatedData);
          setFormData({ userId: '', id: '', title: '', body: '' });
          setEditID(null);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (deleteID) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/posts/${deleteID}`)
      .then(() => {
        const updatedData = data.filter((item) => item.id !== deleteID);
        setData(updatedData);
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (editIDNotState) => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${editIDNotState}`)
      .then((res) => {
        setFormData(res.data);
        setEditID(editIDNotState);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">API Data</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="User Id"
          variant="standard"
          fullWidth
          name="userId"
          value={userId}
          onChange={handleChange}
          required
        />
        <TextField
          label="Id"
          variant="standard"
          fullWidth
          name="id"
          value={id}
          onChange={handleChange}
          required
        />
        <TextField
          label="Title"
          variant="standard"
          fullWidth
          name="title"
          value={title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Body"
          variant="standard"
          fullWidth
          multiline
          rows={3}
          name="body"
          value={body}
          onChange={handleChange}
          required
        />
        <br/>
        <br/>
        <Button variant="contained" color="success" type="submit">
          Submit
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Id</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.userId}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.body}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleEdit(item.id);
                      setEditID(item.id);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CRUD;
