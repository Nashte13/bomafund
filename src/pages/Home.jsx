import React from 'react';

function Home() {
  return (
    <div className='home-container'>
      <header className='home-header'>
        <h1>Welcome to the BomaFund!</h1>
        <p>Manage group contributions effortlessly</p>
        <div>
            <a href='/login'>
                <button>Login</button>
            </a>
            <a href='/signup'>
                <button>Sign Up</button>
            </a>
        </div>
      </header>
    </div>
    
  );
}

export default Home;
