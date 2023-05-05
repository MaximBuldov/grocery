import React, {  } from 'react';
import { Spin } from "antd";
import Products from "./components/Products";
import SearchProducts from "./components/SearchProducts";
import BottomMenu from "./components/BottomMenu";
import { authorization } from "./services";
import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const App = () => {
    const token = localStorage.getItem('token')
    const auth = useQuery({
        queryKey: ['auth'],
        queryFn: authorization,
        enabled: !token
    });

    return (
        <Spin tip="Loading..." spinning={auth.isFetching}>
            {token && (
                <div className="container">
                    <Routes>
                        <Route path="/" key="home" element={<Products />} />
                        <Route path="search-products" key="search" element={<SearchProducts />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <BottomMenu />
                </div>
            )}
        </Spin>
    );
}

export default App;
