import { DEV_API, DEV_USERNAME } from './config.js';

export async function put(docId, key, value) {
  try {
    let BODY;
    if (key === 'title') {
      BODY = JSON.stringify({
        title: value,
      });
    } else if (key === 'content') {
      BODY = JSON.stringify({
        content: value,
      });
    }
    const response = await fetch(`${DEV_API}/${docId}`, {
      method: 'PUT',
      headers: {
        'x-username': DEV_USERNAME,
        'Content-Type': 'application/json',
      },
      body: BODY,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok!');
    }

    const data = await response.json();
    console.log(`${docId}번 수정 완료 : ${data}`);
  } catch (error) {
    console.error('데이터 수정하기 실패:', error);
  }
}
