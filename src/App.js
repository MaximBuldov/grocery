import React, {  } from 'react';
import { Spin } from "antd";
import Products from "./components/Products";
import SearchProducts from "./components/SearchProducts";
import BottomMenu from "./components/BottomMenu";
import { authorization } from "./services"
import { useQuery } from 'react-query';
import { Navigate, Route, Routes } from 'react-router-dom';

const App = () => {
    const auth = useQuery('auth', authorization, {enabled: !localStorage.getItem('token')});

    const addProduct = async (id) => {
        //await changeState(true, id)
    }
    const deleteProduct = async (id) => {
       // await changeState(false, id)
    }
    const createProduct = (product) => {
       // setData([...data, product])
    }
    const deleteAllProducts = () => {
        // selectedProducts.forEach(product => {
        //     changeState(false, product.id)
        // })
    }

    return (
        <Spin tip="Loading..." spinning={auth.isLoading}>
            <div className="container">
            <Routes>
                <Route path="/" key="home" element={<Products />} />
                <Route path="search-products" key="search" element={<SearchProducts />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <BottomMenu createProduct={createProduct} deleteAllProducts={deleteAllProducts} />
            </div>
        </Spin>
    );
}

export default App;
