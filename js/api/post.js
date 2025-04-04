import { DEV_API, DEV_USERNAME } from './config.js';

// 문서를 생성함
export async function post(parentId) {
  try {
    const response = await fetch(DEV_API, {
      method: 'POST', // POST
      headers: {
        'Content-Type': 'application/json',
        'x-username': DEV_USERNAME,
      },
      body: JSON.stringify({
        title: '새 문서',
        parent: parentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok!');
    }
    const data = await response.json();
    console.log('post 성공: ', data);
    return data;
  } catch (error) {
    console.error('post 실패: ', error);
  }
}
