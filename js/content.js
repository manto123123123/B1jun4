document.addEventListener('DOMContentLoaded', () => {
  const postingTitle = document.querySelector('.postingTitle');
  const postingContent = document.querySelector('.postingContent');
  const USERNAME = 'b1jun4';

  async function fetchDocument() {
    try {
      const response = await fetch(
        'https://kdt-api.fe.dev-cos.com/documents/149720', // 실제 문서 ID 사용
        {
          method: 'GET',
          headers: {
            'x-username': USERNAME,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok!');
      }

      const data = await response.json();
      console.log('받아온 데이터:', data); // 디버깅용 콘솔 출력

      // 받아온 데이터에서 title과 content를 가져와서 화면에 표시
      postingTitle.value = data.title || '제목 없음';
      postingContent.textContent = data.content || '내용 없음';
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  }

  // 페이지 로드 시 자동으로 데이터 가져오기
  fetchDocument();
});
