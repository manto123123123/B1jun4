import { DEV_API, DEV_USERNAME } from './config.js';

// 모든 document 불러옴
export async function getAll() {
  try {
    const response = await fetch(DEV_API, {
      headers: {
        'Content-Type': 'application/json',
        'x-username': DEV_USERNAME,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok!');
    }
    const data = await response.json();
    console.log('getAll 성공: ', data);
    return data;
  } catch (error) {
    console.error('getAll 실패: ', error);
  }
}
