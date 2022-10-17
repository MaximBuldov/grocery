import React, { memo } from 'react';
import { Checkbox, Collapse, Empty, Spin } from "antd";
import { useMutation, useQuery } from 'react-query';
import { fetchProducts, updateProduct } from '../services';

const Products = () => {
	const { isLoading, data, isSuccess } = useQuery(['products', 'selected'], () => fetchProducts({ selected: 1, per_page: 100 }), {
			enabled: !!localStorage.getItem('token')
	});
	const mutation = useMutation(updateProduct)
	
	const groupByShop = (array) => {
		const combine = array.reduce((acc, obj) => {
			obj.acf.shop.forEach(el => {
				acc[el] = acc[el] || []
				acc[el].push(obj)
			})
			return acc
		}, {})
		return Object.entries(combine).map(([key, value]) => ({ shop: key, products: value }))
	}

	const onCheckBox = (event) => {
		mutation.mutate({id: event, bool: false})
	}

	return (
		<Spin spinning={isLoading}>
				{renderProducts()}
		</Spin>
		
	);

	function renderProducts() {
		if(data?.data) {
			return (
				<Collapse>
				{groupByShop(data?.data).map(group => (
					<Collapse.Panel header={group.shop} key={group.shop} extra={`Products: ${group.products.length}`}>
						{group.products.map(el =>
							<div key={el.id}>
								<Checkbox
									onChange={(event) => onCheckBox(event.target.value)}
									value={el.id}
								>
									{el.title.rendered}
								</Checkbox></div>
						)}
					</Collapse.Panel>
				))}
				</Collapse>
				)
		} else {
			return <Empty />;
		}
	}
};

export default memo(Products);
