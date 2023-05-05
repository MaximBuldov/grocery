import React, {useState} from 'react';
import {Menu, MenuProps, Modal} from "antd";
import { HomeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import CreateProductForm from "./CreateProductForm";
import { Link } from 'react-router-dom';

const BottomMenu = () => {
	const [modal, setModal] = useState(false)
	const onCancel = () => {
		setModal(false)
	}
	
	const menuConfig: MenuProps['items'] = [
		{
			key: 'stores',
			icon: <Link to="/"><HomeOutlined /></Link>
		},
		{
			key: 'products',
			icon: <Link to="/search-products"><SearchOutlined /></Link>
		},
		{
			key: 'add-product',
			icon: <PlusOutlined onClick={() => setModal(true)} />
		},
		{
			key: 'reload',
			icon: <ReloadOutlined onClick={() => {
				window.location.reload();
				localStorage.clear();
			}} />
		}
	]

	return (
		<>
			<Menu 
				mode="horizontal"
				items={menuConfig} 
				className="bottom-menu"
			/>
			<Modal destroyOnClose open={modal} footer={null} onCancel={onCancel}>
				<CreateProductForm onCancel={onCancel}/>
			</Modal>
		</>
	);
};

export default BottomMenu;
