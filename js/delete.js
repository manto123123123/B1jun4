document.addEventListener('DOMContentLoaded', () => {
  const postingTitle = document.querySelector('.postingTitle');
  const postingContent = document.querySelector('.postingContent');
  const deleteBtn = document.querySelector('.deleteBtn');
  const showAll = document.getElementById('showAll'); // 문서 목록 ul
  const USERNAME = 'b1jun4';

  let currentDocId = null; // 현재 선택된 문서 ID 저장

  //데이터 가져오는 함수
  async function fetchDocument(docId) {
    try {
      const response = await fetch(
        `https://kdt-api.fe.dev-cos.com/documents/${docId}`,
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

      postingTitle.value = data.title || '제목 없음';
      postingContent.textContent = data.content || '내용 없음';

      currentDocId = docId; // 현재 선택된 문서 ID 업데이트
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
    }
  }

  // 문서삭제 함수
  async function deleteDocument() {
    if (!currentDocId) {
      alert('삭제할 문서를 선택하세요.');
      return;
    }

    try {
      const response = await fetch(
        `https://kdt-api.fe.dev-cos.com/documents/${currentDocId}`,
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

      console.log('문서 삭제 성공:', currentDocId);
      alert('문서가 삭제되었습니다.');

      //  삭제된 문서를 화면에서 즉시 제거
      const deletedLi = document.querySelector(`li[data-id="${currentDocId}"]`);
      if (deletedLi) {
        showAll.removeChild(deletedLi); // 목록에서 제거
      }

      //  삭제한 문서가 현재 선택된 문서라면 UI 초기화
      postingTitle.value = '';
      postingContent.textContent = '';
      currentDocId = null; // 삭제 후 선택된 문서 ID 초기화
    } catch (error) {
      console.error('문서 삭제 실패:', error);
    }
  }

  // 문서 목록 클릭 이벤트 추가
  showAll.addEventListener('click', (event) => {
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
      const docId = clickedLi.getAttribute('data-id');
      if (docId) {
        fetchDocument(docId);
      }
    }
  });

  // 삭제 버튼 클릭 이벤트 추가
  deleteBtn.addEventListener('click', deleteDocument);
});
