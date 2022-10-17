import React, {useState} from 'react';
import {Button, Col, Modal, Row} from "antd";
import {CloseOutlined, HomeOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import CreateProductForm from "./CreateProductForm";
import { Link } from 'react-router-dom';

const buttonOption = {
	size: "large",
	block: true,
	type: "primary",
}

const BottomMenu = ({createProduct, deleteAllProducts}) => {
	const [modal, setModal] = useState(false)
	const onCancel = () => {
		setModal(false)
	}
	const onReload = () => {
		window.location.reload()
		localStorage.clear()
	}

	return (
		<>
			<Row className="bottom-menu">
				<Col span={5}>
					<Link to="/">
						<Button {...buttonOption} icon={<HomeOutlined />} />
					</Link>
				</Col>
				<Col span={5}>
					<Link to="/search-products">
						<Button {...buttonOption} icon={<SearchOutlined />} />
					</Link>
				</Col>
				<Col span={5}>
					<Button onClick={() => setModal(true)} {...buttonOption} block icon={<PlusOutlined />} />
				</Col>
				<Col span={5}>
						<Button onClick={onReload} {...buttonOption} icon={<ReloadOutlined />} />
				</Col>
				<Col span={4}>
					<Button onClick={deleteAllProducts} {...buttonOption} icon={<CloseOutlined />} />
				</Col>
			</Row>
			<Modal destroyOnClose visible={modal} footer={null} onCancel={onCancel}>
				<CreateProductForm createProduct={createProduct} onCancel={onCancel}/>
			</Modal>
		</>
	);
};

export default BottomMenu;
