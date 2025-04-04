// import { put } from '../js/api/index.js';
// import { fetchDocument } from '../js/delete.js';
// document.addEventListener('DOMContentLoaded', () => {
//   const showAll = document.getElementById('showAll'); // 문서 목록 ul
//   // 아이콘 요소와 이모지가 담긴 목록
//   const icon = document.getElementById('emojiBtn');
//   const picker = new EmojiButton({ theme: 'auto', position: 'bottom-start' });

//   // 아이콘 요소 클릭시, 이모지 목록 펼침
//   icon.addEventListener('click', async () => {
//     picker.togglePicker(icon);
//   });

//   let currentDocId = null; // 현재 선택된 문서 ID 저장
//   // 이모지 목록에서 특정 값을 선택시, 이모지 확인됨
//   picker.on('emoji', async (emoji) => {
//     const iconSpan = document.createElement('span');
//     iconSpan.className = 'material-symbols-outlined icon';
//     iconSpan.id = 'icon';
//     iconSpan.textContent = emoji;
//     icon.innerHTML = ''; // 기존 이모지 초기화
//     icon.appendChild(iconSpan);

//     if (!currentDocId) {
//       console.log('현재 문서 ID를 찾을 수 없습니다.');
//       return;
//     }

//     try {
//       await put(currentDocId, 'title', titleWithEmoji);
//       getDocuments(); // 목록 새로고침
//     } catch (error) {
//       console.error('이모지 변경 저장 실패:', error);
//     }
//   });
//   // 문서 목록 클릭 이벤트 추가
//   showAll.addEventListener('click', (event) => {
//     const clickedLi = event.target.closest('li');
//     if (clickedLi) {
//       const docId = clickedLi.getAttribute('data-id');
//       if (docId) {
//         fetchDocument(docId);
//       }
//     }
//   });
// });
