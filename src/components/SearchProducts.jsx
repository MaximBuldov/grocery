import React, { useEffect, useState } from 'react';
import { Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchProducts, updateProduct } from '../services';

const departmentColor = {
	bread: "magenta",
	cakes: "red",
	dairy: "volcano",
	meat: "orange",
	fish: "gold",
	vegetables: "lime",
	grocery: "green",
	drinks: "cyan",
	alcohol: "blue",
	sausage: "geekblue",
	pets: "purple",
	household: "#f50",
	sauces: "#2db7f5",
	snacks: "#87d068"
}

const columns = [
	{
		title: 'Product',
		dataIndex: ['title', 'rendered']
	},
	{
		title: 'Department',
		dataIndex: ['acf', 'department'],
		render: el => <Tag color={departmentColor[el.value]}>{el.label}</Tag>
	}
];

const pageSize = 50;

const SearchProducts = () => {
	const [page, setPage] = useState(1);
	const queryClient = useQueryClient();
	const { isLoading, data } = useQuery(['products', page], () => fetchProducts({ per_page: pageSize, page }), {
		enabled: !!localStorage.getItem('token')
	});
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	
	const mutation = useMutation(updateProduct, {
		onSuccess: (data, variables) => {
      queryClient.setQueryData(['products', { id: variables.id }], data)
    }
	});

	useEffect(() => {
		if(data?.data) {
			setSelectedRowKeys(data.data.filter(el => el.acf.selected)?.map(el => el.id));
		}
	}, [data]);

	const onRawSelect = (record, selected) => {
		setSelectedRowKeys(prev => {
			if(selected) {
				return [...prev, record.id]
			} else {
				return prev.filter(el => el !== record.id)
			}
		})
		mutation.mutate({id: record.id, bool: selected});
	}

	const rowSelection = {
		selectedRowKeys,
		onSelect: onRawSelect
	};

	return (
		<>
			<Table
				loading={isLoading}
				rowSelection={rowSelection}
				size="small"
				columns={columns}
				dataSource={data?.data}
				rowKey={record => record.id}
				scroll={{
					scrollToFirstRowOnChange: true
				}}
				pagination={{
					pageSize: pageSize,
					total: Number(data?.headers['x-wp-total']),
					onChange: (value) => setPage(value)
				}}
			/>
			{/* <Select
				onSelect={addProduct}
				onDeselect={deleteProduct}
				loading={data.length === 0}
				disabled={!isAuth}
				style={{width: '100%'}}
				allowClear
				placeholder="Search..."
				getPopupContainer={triggerNode => triggerNode.parentElement}
				options={options}
				optionFilterProp="label"
				filterOption={(input, option) =>
					option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
				}
			/> */}
		</>
	);
};

export default SearchProducts;
