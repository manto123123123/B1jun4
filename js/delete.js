import { getDocuments } from './show.js';
import { get, deleteDoc, put } from './api/index.js';

document.addEventListener('DOMContentLoaded', () => {
  const postingTitle = document.querySelector('.postingTitle');
  const postingContent = document.querySelector('.postingContent');
  const icon = document.querySelector('.icon'); //  아이콘
  const deleteBtn = document.querySelector('.deleteBtn');
  const showAll = document.getElementById('showAll'); // 문서 목록 ul

  // 아이콘 요소와 이모지가 담긴 목록
  const emojiBtn = document.getElementById('emojiBtn');
  const picker = new EmojiButton({ theme: 'auto', position: 'bottom-start' });
  // 아이콘 요소 클릭시, 이모지 목록 펼침
  emojiBtn.addEventListener('click', async () => {
    picker.togglePicker(emojiBtn);
  });
  // 이모지 목록에서 특정 값을 선택시, 이모지 확인됨
  picker.on('emoji', async (emoji) => {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-symbols-outlined icon';
    iconSpan.id = 'icon';
    iconSpan.textContent = emoji;
    emojiBtn.innerHTML = ''; // 기존 이모지 초기화
    emojiBtn.appendChild(iconSpan);

    if (!currentDocId) {
      console.log('현재 문서 ID를 찾을 수 없습니다.');
      return;
    }
    const titleWithEmoji = `${postingTitle.value}} ${emoji}`;
    try {
      await put(currentDocId, 'title', titleWithEmoji);
      getDocuments();
    } catch (error) {
      console.error('이모지 변경 저장 실패:', error);
    }
  });

  let currentDocId = null; // 현재 선택된 문서 ID 저장
  let isSaving = false;

  const isEmoji = (text) => /^\p{Emoji}+$/u.test(text);
  // title이나 content에 키보드로 입력할 때마다 PUT 요청
  function saveEvent(type) {
    return async () => {
      const emoji = isEmoji(icon.textContent.trim())
        ? icon.textContent.trim()
        : '';
      const titleText = `${postingTitle.value} ${emoji}`;
      const titleContent = postingContent.value;

      const pathname = window.location.pathname;
      const id = pathname.split('/').pop();

      function obj() {
        // 이모지 변경 저장
        const observer = new MutationObserver(async () => {
          const emoji = isEmoji(icon.textContent.trim())
            ? icon.textContent.trim()
            : '';
          const newTitle = `${postingTitle.value}} ${emoji}`;
          try {
            console.log(`${id}번 이모지 변경`);
            await put(id, 'title', newTitle);
          } catch (error) {
            console.error(error);
          }
        });
        observer.observe(icon, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
      obj();

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
      const totalTitle = data.title;
      const title = totalTitle.replace(/\p{Emoji}/gu, '').trim();
      const emoji = totalTitle.match(/\p{Emoji}/gu)
        ? totalTitle.match(/\p{Emoji}/gu).join('')
        : '';

      icon.textContent = emoji || 'add_reaction';
      postingTitle.value = title || '제목 없음';
      postingContent.textContent = data.content || '내용 없음';

      emojiBtn.innerHTML = ''; // 기존 이모지 초기화
      emojiBtn.appendChild(icon);
      console.log('확인 : ', icon, icon.textContent);

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
      await deleteDoc();
      console.log('문서 삭제 성공:', currentDocId);
      alert('문서가 삭제되었습니다.');

      //  삭제된 문서를 화면에서 즉시 제거
      const deletedLi = document.querySelector(`li[data-id="${currentDocId}"]`);
      if (deletedLi) {
        showAll.removeChild(deletedLi); // 목록에서 제거
      }

      //  삭제한 문서가 현재 선택된 문서라면 UI 초기화
      icon.textContent = 'add_reaction';
      postingTitle.value = '';
      postingContent.textContent = '';
      currentDocId = null; // 삭제 후 선택된 문서 ID 초기화

      window.history.pushState({}, '', '/html/posting.html'); // ID 없는 상태로 변경

      // path에 id 값이 없다면 글 작성 부분 초기화
      const emptyIcon = document.querySelector('.icon'); //  아이콘
      const titleInput = document.querySelector('.postingTitle');
      const contentTextarea = document.querySelector('.postingContent');

      emptyIcon.textContent = 'add_reaction';
      titleInput.value = '';
      contentTextarea.value = '';
    } catch (error) {
      console.error('문서 삭제 실패:', error);
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
