import React, { useMemo, useState } from 'react';
import { Divider, Input, message, Table } from "antd";
import { deleteProduct, fetchProducts, updateProduct } from '../services';
import { useDebounce } from 'use-debounce';
import { DeleteTwoTone } from '@ant-design/icons';
import { IDepartment, IProduct } from 'models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TableRowSelection } from 'antd/es/table/interface';

const departments = [
	{ value: "bread", text: "Хлебный" },
	{ value: "dairy", text: "Молочный" },
	{ value: "meat", text: "Мясной" },
	{ value: "fish", text: "Рыбный" },
	{ value: "vegetabls", text: "Овощи-фрукты" },
	{ value: "grocery", text: "Бакалея" },
	{ value: "drinks", text: "Напитки" },
	{ value: "alcohol", text: "Алкоголь" },
	{ value: "sausage", text: "Колбасный" },
	{ value: "pets", text: "Боня" },
	{ value: "household", text: "Бытовой" },
	{ value: "sauces", text: "Соусы" },
	{ value: "snacks", text: "Снэки" }
];

const pageSize = 100;

const SearchProducts = () => {
	const [page, setPage] = useState(1);
	const [title, setTitle] = useState<null | string>(null);
	const [debounceTitle] = useDebounce(title, 1000);
	const [category, setCategory] = useState<null | string>(null);
	const queryClient = useQueryClient();
	const keys = useMemo(() => {
		return {page, debounceTitle, category}
	}, [category, debounceTitle, page]);

	function updateCache(record: any, selected?: boolean) {
		queryClient.setQueryData<IProduct[]>(
			['products', keys],
			(arr) => arr?.map(el => el.id === record.id 
				? { ...el, acf: { ...el.acf, selected }} as IProduct 
				: el
			)
		); 
	}

	const { isLoading, data } = useQuery(['products', keys], () => fetchProducts({
		per_page: pageSize,
		page,
		title: debounceTitle, 
		department: category
	}), {
		enabled: !!localStorage.getItem('token')
	});

	const selectedRowKeys = useMemo(() => {
		return data ? data.filter(el => el.acf.selected)?.map(el => el.id) : [];
	}, [data]);
	
	const mutation = useMutation({
		mutationFn: updateProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({
				refetchType: 'none'
			})
		},
		onError: (_, record) => {
			message.error(`Error with ${record.title} `)
			updateCache(record, !record.bool);
		}
	});

	
	const deleteMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: (data) => {
      queryClient.setQueryData<IProduct[]>(
				['products', keys],
				(arr) => arr?.filter(el => el.id !== data.id)
			);
    }
	});

	function onRawSelect(record: IProduct, selected: boolean) { 
		updateCache(record, selected);
		mutation.mutate({id: record.id, bool: selected, title: record.title.rendered});
	}

	const rowSelection: TableRowSelection<IProduct> = {
		selectedRowKeys,
		onSelect: onRawSelect
	};

	const columns = [
		{
			title: 'Product',
			dataIndex: ['title', 'rendered']
		},
		{
			dataIndex: ['acf', 'department'],
			render: (el: IDepartment) => <div style={{textAlign: "center"}}>{el.label}</div>
		},
		{
			dataIndex: 'actions',
			render: (_: any, record: IProduct) => (
					<div style={{textAlign: "center"}}>
						<DeleteTwoTone onClick={() => deleteMutation.mutate(record.id)} twoToneColor="#d00e0e" />
					</div>
				)
		}
	];

	return (
		<>
			<Input.Search 
				loading={isLoading}
				enterButton
				addonBefore="Name"
				placeholder="Enter product name"
				onSearch={setTitle}
				onChange={(event) => setTitle(event.target.value)} 
			/>
			<select 
				className="select-department"
				onChange={(event) => setCategory(event.target.value === 'Filter by department' ? null : event.target.value)
			}>
				<option key="choose">Filter by department</option>
				{departments.map(el => (
					<option key={el.value} value={el.value}>{el.text}</option>
				))}
			</select>
			<Divider />
			<Table
				loading={isLoading || deleteMutation.isLoading}
				rowSelection={rowSelection}
				size="small"
				columns={columns}
				dataSource={data}
				rowKey={record => record.id}
				scroll={{
					scrollToFirstRowOnChange: true
				}}
				pagination={{
					pageSize: pageSize,
					total: 200,
					onChange: (value) => setPage(value)
				}}
			/>
		</>
	);
};

export default SearchProducts;
