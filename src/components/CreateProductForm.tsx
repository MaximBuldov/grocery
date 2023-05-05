import React from 'react';
import {Button, Form, Input, message, Select, Switch} from "antd";
import { createProduct } from '../services';
import { useMutation } from '@tanstack/react-query';

const {Item, useForm} = Form
const shops = ['Costco', 'Walmart', 'Ralphs', 'Bevmo', 'Hmart', 'Fish delight', 'Trader Joe', 'North Produce', 'Petco',	'CVS', 'Butcher', 'FishMarket'];
const departments = [
	{ value: "bread", label: "Хлебный" },
	{ value: "dairy", label: "Молочный" },
	{ value: "meat", label: "Мясной" },
	{ value: "fish", label: "Рыбный" },
	{ value: "vegetables", label: "Овощи-фрукты" },
	{ value: "grocery", label: "Бакалея" },
	{ value: "drinks", label: "Напитки" },
	{ value: "alcohol", label: "Алкоголь" },
	{ value: "sausage", label: "Колбасный" },
	{ value: "pets", label: "Боня" },
	{ value: "household", label: "Бытовой" },
	{ value: "sauces", label: "Соусы" },
	{ value: "snacks", label: "Снэки" }
];

interface CreateProductFormProps {
	onCancel: () => void
}


const CreateProductForm = ({onCancel}: CreateProductFormProps) => {
	const [form] = useForm();

	const mutation = useMutation(createProduct, {
		onSuccess: () => {
			message.success('Product added');
			onCancel();
			window.location.reload();
    }
	});

	const onFinish = (values: any) => {
		mutation.mutate(values);
	} 
	return (
		<Form
			form={form}
			onFinish={onFinish}
			size="large"
			initialValues={{
				status: 'publish',
				fields: {selected: true}
		}}
		>
			<Item label="Product name" name="title" rules={[{required: true}]}>
				<Input />
			</Item>
			<Item label="Shops" name={['fields', 'shop']} rules={[{required: true}]}>
				<Select mode="multiple" showSearch={false} options={shops.map(el => ({ label: el, value: el }) )}/>
			</Item>
			<Item label="Department" name={['fields', 'department']} rules={[{required: true}]}>
				<Select options={departments}/>
			</Item>
			<Item hidden name="status"><Input /></Item>
			<Item hidden name={['fields', 'selected']}><Switch /></Item>
			<Item>
				<Button loading={mutation.isLoading} type="primary" block htmlType="submit">Create product</Button>
			</Item>
		</Form>
	);
};

export default CreateProductForm;
