import React, { useState } from 'react';
import Auth from './Auth';
import styles from './Homepage.module.css';


function HomePage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [LoginOrRegister, setLoginOrRegister] = useState(true);

    const handleAuthClick = (isLogin) => {
        setLoginOrRegister(isLogin);
        setIsButtonVisible(false);
        setIsAuthModalOpen(true);
    };

    const handleAuthBack = () => {
        setIsButtonVisible(true);
        setIsAuthModalOpen(false);
    };


    return (
        <div className='text-center'>
            {isButtonVisible && (
                <>
                    <h1 className=" text-5xl sm:text-7xl font-thin mb-6">Tic Tac Talk</h1>
                    <div className="justify-center gap-5 w-full grid grid-cols-1 sm:grid-cols-2 sm:gap-20">
                        <button
                            className={styles.loginButton}
                            onClick={() => handleAuthClick(true)}
                        >
                            Login
                        </button>
                        {/* <button
                            className={`h-14 w-4/5 
                                bg-blue-500 hover:bg-blue-400 
                                text-white font-thin py-2 px-4 border-b-4 
                                border-blue-700 hover:border-blue-500 rounded
                                text-2xl focus:outline-none`}
                            onClick={() => handleAuthClick(false)}
                        >
                            Register
                        </button> */}
                        <button
                            className={styles.registerButton}
                            onClick={() => handleAuthClick(false)}
                        ><span>
                            Register
                        </span>
                            
                        </button>
                    </div>

                </>
            )}
            {isAuthModalOpen && (
                <>
                    <div className='text-2xl absolute top-2 left-2' onClick={handleAuthBack}>
                        Back
                    </div>
                    <Auth LoginSet={LoginOrRegister} />
                </>
            )}
        </div>
    );
}

export default HomePage;
