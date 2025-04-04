// import { getDocuments } from './show.js';

// document.addEventListener('DOMContentLoaded', () => {
//   // DOM 실행 즉시 li를 가져오면 API 호출 후의 결과를 받아오지 못하므로 동적으로 감지 후 받아오기
//   // const observer = new MutationObserver((mutationsList) => {
//   //   mutationsList.forEach((mutation) => {
//   //     if (mutation.type === 'childList') {
//   //       mutation.addedNodes.forEach((node) => {
//   //         if (node.nodeName === 'LI') {
//   //           // 새로 추가된 노드가 li일 경우만 실행
//   //           clickLi(node); // 개별 li에 이벤트 추가

//   //           // li 내부의 addDocumentBtn도 추가되었는지 확인
//   //           const addButton = node.querySelector('button');
//   //           if (addButton) {
//   //             clickAddBtn(addButton);
//   //           }
//   //         }
//   //       });

//   //       // 삭제된 노드 감지하여 path 변경
//   //       // mutation.removedNodes.forEach((node) => {
//   //       //   if (node.nodeName === 'LI') {
//   //       //     const deletedId = node.dataset.id; // 삭제된 li의 id 가져오기
//   //       //     const currentPath = window.location.pathname;
//   //       //     const pathId = currentPath.split('/').pop(); // 현재 path의 id 추출

//   //       //     // 삭제된 ID가 현재 URL의 ID와 같다면 path에서 ID 제거
//   //       //     if (deletedId === pathId) {
//   //       //       window.history.pushState({}, '', '/html/posting.html'); // ID 없는 상태로 변경
//   //       //     }
//   //       //   }
//   //       // });
//   //     }
//   //   });
//   // });

//   // 감시할 대상 (ul 태그 안의 li가 변경될 때 감지)
//   // const targetNode = document.querySelector('#showAll');
//   // const observerConfig = { childList: true, subtree: true };

//   // if (targetNode) {
//   //   observer.observe(targetNode, observerConfig);
//   // }

//   // const clickLi = (li) => {
//   //   //const files = document.querySelectorAll('#showAll > li');
//   //   //console.log(files);
//   //   //Array.from(files).forEach((li) => {
//   //   li.addEventListener('click', (e) => {
//   //     e.preventDefault();
//   //     const pathname = window.location.pathname;
//   //     console.log(pathname);
//   //     const id = pathname.split('/').pop();
//   //     console.log('path : ', id);
//   //     if (id) {
//   //       postSaving(id);
//   //     }
//   //   });
//   //   //});
//   // };
//   //clickLi();

//   // const clickAddBtn = (btn) => {
//   //   //const files = document.querySelectorAll('#showAll > li');
//   //   //console.log(files);
//   //   //Array.from(files).forEach((li) => {
//   //   btn.addEventListener('click', (e) => {
//   //     e.preventDefault();
//   //     const li = e.currentTarget.parentElement;
//   //     const id = li.dataset.id;
//   //     router(id);
//   //   });
//   //   //});
//   // };
//   //});

//   const title = document.querySelector('.postingTitle');
//   const content = document.querySelector('.postingContent');
//   // const pathname = window.location.pathname;
//   // console.log(pathname);
//   // const id = pathname.split('/').pop();
//   // console.log('path : ', id);
//   //let id;
//   const XUSERNAME = 'b1jun4';

//   // const showAll = document.getElementById('showAll');
//   // showAll.addEventListener('click', (event) => {
//   //   event.preventDefault();
//   //   const clickedLi = event.target.closest('li');
//   //   if (clickedLi) {
//   //     const docId = clickedLi.getAttribute('data-id');
//   //     id = docId;
//   //     if (id) {
//   //       postSaving(id);
//   //     }
//   //   }
//   // });

//   // const showAll = document.getElementById('showAll');
//   // showAll.addEventListener('click', (event) => {
//   //   event.preventDefault();
//   //   const clickedLi = event.target.closest('li');
//   //   if (clickedLi) {
//   //     const pathname = window.location.pathname;
//   //     console.log(pathname);
//   //     const id = pathname.split('/').pop();
//   //     console.log('path : ', id);
//   //     if (id) {
//   //       postSaving(id);
//   //     }
//   //   }
//   // });

//   // const showAll = document.querySelector('#showAll');
//   // const li = showAll.querySelectorAll('li');
//   // console.log('Array.from(showAll) : ', showAll.querySelectorAll('li'));
//   // Array.from(showAll).forEach((li) => {
//   //   li.addEventListener('click', (event) => {
//   //     event.preventDefault();
//   //     const clickedLi = event.target.closest('li');
//   //     if (clickedLi) {
//   //       const docId = clickedLi.getAttribute('data-id');
//   //       id = docId;
//   //       console.log(id);
//   //       if (id) {
//   //         postSaving(id);
//   //       }
//   //     }
//   //   });
//   // });

//   // const addDocumentBtn = document.querySelectorAll(
//   //   '.material-symbols-outlined'
//   // );
//   // Array.from(addDocumentBtn).forEach((add) => {
//   //   add.addEventListener('click', (e) => {
//   //     e.preventDefault();
//   //     const li = e.currentTarget.parentElement;
//   //     if (li) {
//   //       const docId = li.getAttribute('data-id');
//   //       id = docId;
//   //       if (id) {
//   //         postSaving(id);
//   //       }
//   //     }
//   //   });
//   // });

//   // title이나 content에 키보드로 입력할 때마다 PUT 요청
//   const postSaving = (id) => {
//     const posting = [title, content];
//     posting.forEach((v) => {
//       v.addEventListener('keyup', async () => {
//         const titleText = title.value;
//         const titleContent = content.value;

//         console.log('제목 : ', titleText);
//         console.log('내용 : ', titleContent);

//         try {
//           console.log(`${id}번으로 PUT 날라간당`);
//           const API_PUT = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
//           const response = await fetch(API_PUT, {
//             method: 'PUT',
//             headers: {
//               'x-username': XUSERNAME,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               title: titleText,
//               content: titleContent,
//             }),
//           });
//           if (!response.ok) {
//             throw new Error('Network response was not ok!');
//           }
//           const data = await response.json();
//           console.log(`${id}번 수정 완료 : ${data}`);
//           getDocuments();
//         } catch (error) {
//           console.error(error);
//         }
//       });
//     });
//   };

//   // if (id) {
//   //   postSaving(id);
//   // }
// });
// export default postSaving;
