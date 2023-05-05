import axios from "axios";
import { IProduct } from "models";

const URL = 'https://admin.buldov.com/wp-json/wp/v2/grocery/';

export const authorization = async () => {
   try {
       const res = await axios.post('https://admin.buldov.com/wp-json/jwt-auth/v1/token', {
           password: 'NTGI iCss 4M4E uFWn jW0t ghi3',
           username: 'buldov'
       })
       localStorage.setItem('token', res.data.token)

       return res;
   } catch (e) {
        throw new Error('Fetch Error')
   }
}

export async function fetchProducts(params: any) {
    try {
        const res = await axios.get(URL, {
            params: { _fields: 'id,title,acf', per_page: 50, ...params }
        })
        return res.data as IProduct[];
    } catch (e) {
        throw new Error('Fetch Error')
    }
}

export async function updateProduct({bool, id, title}: {bool: boolean, id: number, title?: string}) {
    try {
        const res = await axios({
            method: 'PUT',
            url: URL + id,
            data: {fields: {selected: bool}},
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        return res.data as IProduct;
    } catch (e) {
        throw new Error('Fetch Error')
    }

}

export async function createProduct(data: any) {
    try {
        const res = await axios({
            url: URL,
            method: 'POST',
            data: data,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return res.data as IProduct;
    } catch (e) {
        throw new Error('Fetch Error')
    }
}

export async function deleteProduct(id: number) {
    try {
        const res = await axios({
            url: URL + id,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return res.data as IProduct;
    } catch (e) {
        throw new Error('Fetch Error')
    }
}