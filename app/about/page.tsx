"use client"; 

import React from 'react';
import { useUser } from '@clerk/nextjs';

const AboutPage = () => { 
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Sign in to view the about page</div>;
    }

    return <div>Hello {user.firstName}, welcome to the about page!</div>;
};

export default AboutPage; 
