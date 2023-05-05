import React, {  } from 'react';
import Products from "./components/Products";
import SearchProducts from "./components/SearchProducts";
import BottomMenu from "./components/BottomMenu";
import { authorization } from "./services";
import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import imgUrl from './images/logo.png';

const App = () => {
    const token = localStorage.getItem('token')
    useQuery({
        queryKey: ['auth'],
        queryFn: authorization,
        enabled: !token
    });

    return (
        <>
            {token ? (
                <div className="container">
                    <Routes>
                        <Route path="/" key="home" element={<Products />} />
                        <Route path="search-products" key="search" element={<SearchProducts />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <BottomMenu />
                </div>
            ) : (
                <img src={imgUrl} className="loading-logo" alt="logo" />
            )}
        </>
    );
}

export default App;
