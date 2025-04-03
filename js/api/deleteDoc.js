import { DEV_API, DEV_USERNAME } from './config.js';

export async function deleteDoc() {
  try {
    const response = await fetch(DEV_API, {
      method: 'DELETE', // POST
      headers: {
        'x-username': DEV_USERNAME,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok!');
    }

    console.log('delete 성공');
  } catch (error) {
    console.error('delete 실패 :', error);
  }
}
