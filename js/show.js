const API = 'https://kdt-api.fe.dev-cos.com/documents';
const USERNAME = 'b1jun4';
// posting.html에서 전체 보기 ul 태그의 id를 showAll로 설정
const showAll = document.getElementById('showAll');

document.addEventListener('DOMContentLoaded', () => {
  // addDocument는 파일 추가 button 태그 id
  //   const addDocument = document.getElementById('addDocument')
  //   addDocument.addEventListener('click', postDocument)

  async function getDocuments() {
    try {
      const response = await fetch(API, {
        headers: {
          'Content-Type': 'application/json', // title null로 들어가는 것 해결
          'x-username': USERNAME,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok!');
      }
      const data = await response.json();
      console.log('성공: ', data);

      let depth = 0;

      findDocuments(data, depth);
    } catch (error) {
      console.error('실패: ', error);
    }
  }

  getDocuments();
});

function findDocuments(arr, depth) {
  for (let doc of arr) {
    // console.log(depth);
    showDocuments(doc, depth);
    if (doc.documents.length !== 0) {
      findDocuments(doc.documents, depth + 1);
    }
  }
}

function showDocuments(doc, depth) {
  const title = doc.title;
  // document 요소
  const documentList = document.createElement('li');
  documentList.setAttribute('data-id', doc.id);
  const liClassName = `depth${depth}`;
  documentList.classList.add(liClassName);

  // document로 이동시켜주는 a 태그
  const documentLink = document.createElement('a');
  documentLink.href = '#';

  // document 열림, 닫힘 보여주는 화살표
  /*
sideBar.css 에 스타일 추가
.arrow {
border: solid #c1c1c1;
border-width: 0 3px 3px 0;
display: inline-block;
padding: 3px;
}

.right {
transform: rotate(-45deg);
-webkit-transform: rotate(-45deg);
}

.down {
transform: rotate(45deg);
-webkit-transform: rotate(45deg);
}
  */
  const documentToggle = document.createElement('i');
  documentToggle.classList.add('arrow', 'right'); // 닫힘 상태
  documentLink.appendChild(documentToggle);

  // document 아이콘
  const documentIcon = document.createElement('img');
  documentLink.appendChild(documentIcon);

  // document 제목
  const documentTitle = document.createTextNode(title);
  documentLink.appendChild(documentTitle);
  // documentLink.textContent = title

  // documentList 자식으로 documentLink 추가
  documentList.appendChild(documentLink);

  // documentList 자식으로 파일 추가 버튼 추가
  const addDocumentBtn = document.createElement('button');
  const fileAdd = document.createElement('span');
  fileAdd.textContent = 'add';
  /*
posting.html에 
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=add"/>
추가,

sideBar.css에
.material-symbols-outlined {
font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24;
color: #c1c1c1;
}
추가
  */
  fileAdd.classList.add('material-symbols-outlined');
  addDocumentBtn.appendChild(fileAdd);
  documentList.appendChild(addDocumentBtn);

  console.log(documentList);

  // ul 태그 자식으로 documentList 추가
  showAll.appendChild(documentList);
}
