//import postSaving from './postSave.js';
import { getDocuments } from './show.js';

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
      console.log('docId : ', docId);

      const pathname = window.location.pathname;
      console.log(pathname);
      const id = pathname.split('/').pop();
      console.log('path : ', id);

      postSaving(id);
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

  // 매개변수 id
  const postSaving = (id) => {
    const title = document.querySelector('.postingTitle');
    const content = document.querySelector('.postingContent');
    const XUSERNAME = 'b1jun4';

    const posting = [title, content];
    posting.forEach((v) => {
      v.addEventListener('keyup', async () => {
        const titleText = title.value;
        const titleContent = content.value;

        console.log('제목 : ', titleText);
        console.log('내용 : ', titleContent);

        // const pathname = window.location.pathname;
        // console.log(pathname);
        // const id = pathname.split('/').pop();
        // console.log('path : ', id);

        try {
          console.log(`${id}번으로 PUT 날라간당`);
          const API_PUT = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
          const response = await fetch(API_PUT, {
            method: 'PUT',
            headers: {
              'x-username': XUSERNAME,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: titleText,
              content: titleContent,
            }),
          });
          if (!response.ok) {
            throw new Error('Network response was not ok!');
          }
          const data = await response.json();
          console.log(`${id}번 수정 완료 : ${data}`);
          getDocuments();
        } catch (error) {
          console.error(error);
        }
      });
    });
  };

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

//export default fetchDocument;
