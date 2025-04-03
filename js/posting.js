// document.addEventListener('DOMContentLoaded', () => {

// addDocument는 파일 추가 button 태그 id
//   const addDocument = document.getElementById('addDocument')
//   addDocument.addEventListener('click', postDocument)

export async function postDocument(parentId) {
  const API = 'https://kdt-api.fe.dev-cos.com/documents';
  const USERNAME = 'b1jun4';

  try {
    const response = await fetch(API, {
      method: 'POST', // POST
      headers: {
        'Content-Type': 'application/json',
        'x-username': USERNAME,
      },
      body: JSON.stringify({
        title: '새 파일',
        parent: parentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok!');
    }
    const data = await response.json();
    console.log('성공: ', data);
  } catch (error) {
    console.error('실패: ', error);
  }
}
// ;
