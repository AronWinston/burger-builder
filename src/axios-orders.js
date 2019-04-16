import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-my-burger-5a9e1.firebaseio.com/'
})

export default instance;