import axios from 'axios';
import { showAlert } from './alert';

export async function updateSettings(data, type) {
  const url =
    type === 'password'
      ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
      : 'http://127.0.0.1:3000/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (error) {
    showAlert('error', `${error.message}. Try again`);
  }
}
