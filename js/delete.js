const deleteBtn = document.querySelector('.deleteBtn');

document.addEventListener('DOMContentLoaded', () => {
  async function deleteDocuments() {
    try {
      const response = await fetch(
        'https://kdt-api.fe.dev-cos.com/documents/1500223', // 추후 id document에서 가져와야함
        {
          method: 'DELETE',
          headers: {
            'x-username': USERNAME,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok!');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  // 버튼 클릭 이벤트 리스너 추가
  deleteBtn.addEventListener('click', deleteDocuments);
});
