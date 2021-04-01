import axios from 'axios';
import { showAlert } from './alert.js';

export async function login(email, password) {
  try {
    const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', {
      email,
      password,
      credentials: 'include',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
}

export async function logout() {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if ((res.status = 'success')) {
      location.reload(true);
      showAlert('sucess', 'Logged out success');
    }
  } catch (error) {
    showAlert('error', 'Logging out error. Try again');
  }
}
