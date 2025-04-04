// import { postDocument } from './posting.js';
import { getAll, post } from './api/index.js';

let showAll = document.getElementById('showAll');
const rootAdd = document.getElementById('rootAdd');

const openState = {};

document.addEventListener('DOMContentLoaded', () => {
  // posting.html에서 전체 보기 ul 태그의 id를 showAll로 설정

  // addDocument는 파일 추가 button 태그 id
  //   const addDocument = document.getElementById('addDocument')
  //   addDocument.addEventListener('click', postDocument)
  getDocuments();

  rootAdd.addEventListener('click', (event) => {
    event.preventDefault();
    postDocuments(null);
  });
});

export async function getDocuments() {
  try {
    const data = await getAll();
    let depth = 0;
    showAll.innerHTML = ''; // 💡 중복 제거용 초기화
    findDocuments(data, depth, showAll);
  } catch (error) {
    console.error('실패: ', error);
  }
}

async function postDocuments(parentId) {
  try {
    const data = await post(parentId);
    getDocuments();
  } catch (error) {
    console.error('실패: ', error);
  }
}

function findDocuments(arr, depth, parentEl) {
  for (let doc of arr) {
    // console.log(depth);
    const li = showDocuments(doc, depth);
    parentEl.appendChild(li);

    if (doc.documents.length !== 0) {
      const childUl = document.createElement('ul');
      childUl.classList.add('childList');
      if (!openState[doc.id]) {
        childUl.classList.add('hidden');
      }
      li.appendChild(childUl);

      findDocuments(doc.documents, depth + 1, childUl);
    }
  }
}

function showDocuments(doc, depth) {
  const totalTitle = doc.title;
  const emoji = totalTitle.match(/\p{Emoji}/gu)
    ? totalTitle.match(/\p{Emoji}/gu).join('')
    : '';
  const title = totalTitle.replace(/\p{Emoji}/gu, '').trim();
  // document 요소

  const documentList = document.createElement('li');
  documentList.setAttribute('data-id', doc.id);
  const liClassName = `depth${depth}`;
  documentList.classList.add(liClassName);

  // document로 이동시켜주는 a 태그
  const documentLink = document.createElement('a');
  documentLink.href = '#';

  const documentToggle = document.createElement('i');
  // documentToggle.classList.add('arrow', 'right'); // 닫힘 상태
  if (openState[doc.id]) {
    documentToggle.classList.add('arrow', 'down');
  } else {
    documentToggle.classList.add('arrow', 'right');
  }
  documentLink.appendChild(documentToggle);

  // document 아이콘 [수정]

  const iconImg = document.createElement('span');
  iconImg.classList.add('iconImg');
  iconImg.textContent = emoji || '📄'; // 이모지가 없을 경우 기본 아이콘
  documentLink.appendChild(iconImg);

  // document 제목
  const documentTitle = document.createTextNode(title);
  documentLink.appendChild(documentTitle);
  // documentLink.textContent = title

  // documentList 자식으로 documentLink 추가
  documentList.appendChild(documentLink);

  documentToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const childUl = documentList.querySelector('ul.childList');
    console.log('child 는', childUl);

    if (childUl) {
      childUl.classList.toggle('hidden');
      openState[doc.id] = !childUl.classList.contains('hidden');
    }

    if (openState[doc.id]) {
      documentToggle.classList.remove('right');
      documentToggle.classList.add('down');
    } else {
      documentToggle.classList.remove('down');
      documentToggle.classList.add('right');
    }
  });

  // documentList 자식으로 파일 추가 버튼 추가
  const addDocumentBtn = document.createElement('button');
  const colorDiv = document.createElement('div');
  addDocumentBtn.classList.add('addDocumentBtn');
  const fileAdd = document.createElement('span');
  fileAdd.textContent = 'add';
  fileAdd.classList.add('material-symbols-outlined');
  addDocumentBtn.appendChild(fileAdd);
  documentList.appendChild(addDocumentBtn);

  addDocumentBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    // postDocument(doc.id);
    // console.log(depth);
    if (depth >= 3) {
      alert('하위 문서는 3개까지만 추가 가능해요🥲');
      return;
    }

    await postDocuments(doc.id);
    openState[doc.id] = true;

    await getDocuments();
  });
  colorDiv.appendChild(documentLink);
  colorDiv.appendChild(addDocumentBtn);
  colorDiv.classList.add('colorDiv');

  documentList.appendChild(colorDiv);

  //console.log(documentList);

  return documentList;
}
