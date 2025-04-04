import { DEV_API, DEV_USERNAME } from './config.js';

export async function get(docId) {
  try {
    const response = await fetch(`${DEV_API}/${docId}`, {
      method: 'GET',
      headers: {
        'x-username': DEV_USERNAME,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok!');
    }

    const data = await response.json();
    console.log('get 성공:', data); // 디버깅용 콘솔 출력
    return data;
  } catch (error) {
    console.error('get 실패:', error);
  }
}
