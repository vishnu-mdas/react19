import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Form, Button,Image,Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';


const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const dispatch = useDispatch();

  const navigate=useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        if (image && !image.type.startsWith('image/')) {
          // Check if the uploaded file is an image
          toast.error('Please upload a valid image file');
          return;
        }
     
        const formData = new FormData();
        formData.append('_id', userInfo._id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('file', image);
          // const res = await updateProfile({
          //   _id:userInfo._id,
          //   name,
          //   email,
          //   password,
          //   formdata: image ? new FormData().append('file', image) : undefined,
          // }).unwrap();
      
          const res = await updateProfile(formData).unwrap();
          console.log(res);
  
          dispatch(setCredentials(res));
          toast.success("Profile updated successfully");
          navigate("/")
        } 
   catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  
  return (
    <FormContainer className="profile-container">
     
              <h1 className="profile-header">USER PROFILE</h1>
    
   
      <Col xs={6} md={4}>
      <Image style={{width:"100px",marginRight:"20px",}} src={`http://localhost:8000/Images/${userInfo.image}`} roundedCircle />
      </Col>
      <Form.Group className="my-2" controlId="image">
      
          <Form.Label style={{fontWeight:'bolder'}}> Edit profile </Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            
            
           
          hidden></Form.Control >
           
        </Form.Group>
      <Form  onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
          className="form-input"
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

     

        <Button   type='submit' variant='primary' className='mt-3'>
          Update
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;


