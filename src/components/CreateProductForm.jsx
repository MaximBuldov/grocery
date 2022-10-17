import React, {useState} from 'react';
import {Button, Checkbox, Form, Input, message, Select, Switch} from "antd";
import axios from "axios";

const URL = 'https://admin.buldov.com/wp-json/wp/v2/grocery/'
const {Item, useForm} = Form
const shops = ['Costco', 'Walmart', 'Ralphs', 'Bevmo', 'Hmart', 'Fish delight', 'Trader Joe', 'North Produce', 'Petco',	'CVS']

const CreateProductForm = ({createProduct, onCancel}) => {
	const [form] = useForm()
	const [loading, setLoading] = useState(false);
	const onFinish = async (values) => {
		setLoading(true)
		try {
			const res = await axios({
				url: URL,
				method: 'POST',
				data: values,
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
			})
			message.success('Product added')
			createProduct(res.data)
			onCancel()
		} catch (e) {
			message.error('Error')
			console.log(e)
		} finally {
			setLoading(false)
		}
	}
	return (
		<Form
			form={form}
			onFinish={onFinish}
			size="large"
			initialValues={{
				status: 'publish',
				fields: {selected: false}
		}}
		>
			<Item label="Product name" name="title">
				<Input />
			</Item>
			<Item label="Shops" name={['fields', 'shop']}>
				<Checkbox.Group options={shops}/>
			</Item>
			<Item hidden name="status"><Input /></Item>
			<Item hidden name={['fields', 'selected']}><Switch /></Item>
			<Item>
				<Button loading={loading} type="primary" block htmlType="submit">Create product</Button>
			</Item>
		</Form>
	);
};

export default CreateProductForm;
