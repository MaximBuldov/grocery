import React from 'react';
import { Checkbox, Collapse, Empty, message, Spin } from "antd";
import { fetchProducts, updateProduct } from '../services';
import { IProduct } from 'models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Products = () => {
	const queryClient = useQueryClient();

	const { isFetching, data } = useQuery({
		queryKey: ['products', 'selected'],
		queryFn: () => fetchProducts({ selected: 1, per_page: 100 }),
		enabled: !!localStorage.getItem('token')
	});

	const mutation = useMutation({
		mutationFn: updateProduct,
		onSuccess: () => {
      queryClient.invalidateQueries({
				refetchType: 'none'
			})
    },
		onError: (_, data) => {
			message.error(`Error with ${data.title}`)
		} 
	});
	
	const groupByShop = (array: IProduct[]) => {
		const combine = array.reduce((acc, obj) => {
			obj.acf.shop.forEach((el) => {
				acc[el] = acc[el] || []
				acc[el].push(obj)
			})
			return acc;
		}, {} as { [key: string]: IProduct[] })
		return Object.entries(combine).map(([key, value]) => ({ shop: key, products: value }))
	}

	return (
		<Spin spinning={isFetching}>
				{data ? (
					<Collapse>
					{groupByShop(data).map((group) => (
						<Collapse.Panel 
							header={group.shop}
							key={group.shop}
							extra={`Products: ${group?.products?.length}`}
						>
							{group.products.map(el =>
								<div key={el.id}>
									<Checkbox
										onChange={(event) => mutation.mutate({
											id: event.target.value,
											bool: !event.target.checked,
											title: el.title.rendered
										})}
										value={el.id}
									>
										{el.title.rendered}
									</Checkbox></div>
							)}
						</Collapse.Panel>
					))}
				</Collapse>
				) : (
					<Empty />
				)}
		</Spin>
		
	);
};

export default Products;
