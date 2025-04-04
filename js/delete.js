import { getDocuments } from './show.js';
import { get, deleteDoc, put } from './api/index.js';

document.addEventListener('DOMContentLoaded', () => {
  const postingTitle = document.querySelector('.postingTitle');
  const postingContent = document.querySelector('.postingContent');
  const deleteBtn = document.querySelector('.deleteBtn');
  const showAll = document.getElementById('showAll'); // 문서 목록 ul

  let currentDocId = null; // 현재 선택된 문서 ID 저장
  let isSaving = false;

  // title이나 content에 키보드로 입력할 때마다 PUT 요청
  function saveEvent(type) {
    return async () => {
      const titleText = postingTitle.value;
      const titleContent = postingContent.value;

      const pathname = window.location.pathname;
      const id = pathname.split('/').pop();

      try {
        if (type === 'title') {
          console.log(`${id}번 제목 변경`);
          await put(id, 'title', titleText);
          getDocuments(); // 제목 변경 시만 사이드바 갱신
        } else if (type === 'content') {
          console.log(`${id}번 내용 변경`);
          await put(id, 'content', titleContent);
        }
        isSaving = false;
      } catch (error) {
        console.error(error);
      }
    };
  }

  const titleHandler = saveEvent('title');
  const contentHandler = saveEvent('content');

  //데이터 가져오는 함수
  async function fetchDocument(docId) {
    try {
      const data = await get(docId);
      console.log('받아온 데이터:', data); // 디버깅용 콘솔 출력

      postingTitle.value = data.title || '제목 없음';
      postingContent.textContent = data.content || '내용 없음';

      currentDocId = docId; // 현재 선택된 문서 ID 업데이트
      console.log('docId : ', docId);

      postSaving();
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
      await deleteDoc(currentDocId);
      console.log('문서 삭제 성공:', currentDocId);
      alert('문서가 삭제되었습니다.');

      // 수정: 삭제된 문서를 화면에서 즉시 제거 및 자식 문서 재배치
      const deletedLi = document.querySelector(`li[data-id="${currentDocId}"]`);
      if (deletedLi) {
        // 수정: 만약 삭제된 LI 안에 자식 UL이 있다면, 그 UL의 모든 LI를 최상위 UL(#showAll)로 이동
        const childUl = deletedLi.querySelector('ul.childList');
        if (childUl) {
          while (childUl.firstElementChild) {
            const childLi = childUl.firstElementChild;
            // 수정: 이동 전에 depth 클래스를 새롭게 갱신 (최상위 UL 밑이므로 depth 0부터 시작)
            updateDepths(childLi, 0); // 새로 작성한 재귀 함수
            showAll.appendChild(childLi);
          }
        }
        // 수정: 삭제된 LI를 부모에서 제거
        deletedLi.parentElement.removeChild(deletedLi);
      }

      // 삭제한 문서가 현재 선택된 문서라면 UI 초기화
      postingTitle.value = '';
      postingContent.textContent = '';
      currentDocId = null; // 삭제 후 선택된 문서 ID 초기화

      window.history.pushState({}, '', '/html/posting.html'); // ID 없는 상태로 변경

      // path에 id 값이 없다면 글 작성 부분 초기화
      const titleInput = document.querySelector('.postingTitle');
      const contentTextarea = document.querySelector('.postingContent');

      titleInput.value = '';
      contentTextarea.value = '';
    } catch (error) {
      console.error('문서 삭제 실패:', error);
    }
  }

  // 재귀 함수: li 요소와 그 자식들의 depth 클래스를 재설정 (newDepth는 해당 li의 새 depth)
  function updateDepths(li, newDepth) {
    // 수정: 기존 depth 클래스 제거
    const classesToRemove = [];
    li.classList.forEach((cls) => {
      if (/^depth\d+$/.test(cls)) {
        classesToRemove.push(cls);
      }
    });
    classesToRemove.forEach((cls) => li.classList.remove(cls));
    // 새 depth 클래스 추가
    li.classList.add(`depth${newDepth}`);

    // 자식 li들에 대해서 재귀적으로 처리 (바로 아래 ul.childList 안의 li)
    const childUl = li.querySelector(':scope > ul.childList');
    if (childUl) {
      Array.from(childUl.children).forEach((childLi) => {
        updateDepths(childLi, newDepth + 1);
      });
    }
  }

  // 매개변수 id
  const postSaving = () => {
    if (isSaving) return;
    isSaving = true;
    const title = document.querySelector('.postingTitle');
    const content = document.querySelector('.postingContent');

    title.removeEventListener('keyup', titleHandler);
    content.removeEventListener('keyup', contentHandler);

    title.addEventListener('keyup', titleHandler);
    content.addEventListener('keyup', contentHandler);
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
