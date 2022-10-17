import axios from "axios";

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
       console.log(e)
   }
}

export const fetchProducts = async (params) => {
    try {
        const res = await axios.get(URL, {
            params: { _fields: 'id,title,acf', per_page: 50, ...params }
        })
        return res;
    } catch (e) {
        console.log(e)
    }
}

export const updateProduct = async ({bool, id}) => {
    try {
        const res = await axios({
            method: 'PUT',
            url: URL + id,
            data: {fields: {selected: bool}},
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return res.data
    } catch (e) {
        console.log(e)
    }

}