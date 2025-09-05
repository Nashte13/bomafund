import React, {useState} from 'react';
import axios from 'axios';
import './signup.css';



function Signup() {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [errors, setErrors] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //validate form
        const validationErrors = {};
        if (!fullName) validationErrors.fullName = 'Full name is required';
        if (!email) validationErrors.email = 'Email is required';
        if (!phoneNumber) validationErrors.phoneNumber = 'Phone number is required';
        if (!password) validationErrors.password = 'Password is required';
        if (password !== confirmedPassword) validationErrors.confirmedPassword = 'Passwords do not match';
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5000/api/signup', {
                fullName,
                email,
                phoneNumber,
                password, 
            });
            console.log('Sending signup request:', fullName, email, phoneNumber, password);


            //show success message
            setSuccessMessage('Account created succesfully! Redirecting to login... ');

            //redirecting to login
            setTimeout(() => {
                window.location.href = './login';
            }, 2000);

            console.log('Signup successful:', response.data);
            //redirect to the login page or dashboard
        } catch (error) {
            setErrors ({signup: error.response?.data?.message || 'Signup failed'});
        }

    };

    return(
        <div className='signup-container'>
            <div className='signup-form'>
            <h1>Create Your BomaFund Account</h1>
            {successMessage && <p className='success'>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type='text'
                        placeholder='Full Name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && <p className='error'>{errors.fullName}</p>}
                    <input 
                        type='email' 
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className='error'>{errors.email}</p>}

                    <input 
                        type='text' 
                        placeholder='Phone Number'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {errors.phoneNumber && <p className='error'>{errors.phoneNumber}</p>}
                    <input 
                        type='password' 
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className='error'>{errors.password}</p>}
                    <input 
                        type='password' 
                        placeholder='Confrim Password'
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                    {errors.confirmedPassword && <p className='error'>{errors.confirmedPassword}</p>}
                    <button type='submit'>Sign Up</button>
                </form>
                <p>
                    Already have an account? <a href='./login'>Login</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;