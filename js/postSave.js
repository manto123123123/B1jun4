import { getDocuments } from './show.js';

document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.postingTitle');
  const content = document.querySelector('.postingContent');
  //const pathname = window.location.pathname;
  //const id = pathname.split('/')[3];
  let id;
  const USERNAME = 'b1jun4';

  const showAll = document.getElementById('showAll');
  showAll.addEventListener('click', (event) => {
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
      const docId = clickedLi.getAttribute('data-id');
      id = docId;
      if (id) {
        postSaving(id);
      }
    }
  });

  const addDocumentBtn = document.querySelectorAll(
    '.material-symbols-outlined'
  );
  Array.from(addDocumentBtn).forEach((add) => {
    add.addEventListener('click', (e) => {
      const li = e.currentTarget.parentElement;
      if (li) {
        const docId = li.getAttribute('data-id');
        id = docId;
        if (id) {
          postSaving(id);
        }
      }
    });
  });

  // title이나 content에 키보드로 입력할 때마다 PUT 요청
  const postSaving = (id) => {
    const posting = [title, content];
    posting.forEach((v) => {
      v.addEventListener('keyup', async () => {
        const titleText = title.value;
        const titleContent = content.value;

        console.log(titleText);
        console.log(titleContent);

        try {
          const API_PUT = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
          const response = await fetch(API_PUT, {
            method: 'PUT',
            headers: {
              'x-username': USERNAME,
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
          const data = response.json();
          console.log(data);
          getDocuments();
        } catch (error) {
          console.error(error);
        }
      });
    });
  };

  // if (id) {
  //   postSaving(id);
  // }
});
