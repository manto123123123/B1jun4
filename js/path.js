window.addEventListener('DOMContentLoaded', () => {
  // DOM 실행 즉시 li를 가져오면 API 호출 후의 결과를 받아오지 못하므로 동적으로 감지 후 받아오기
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'LI') {
            // 새로 추가된 노드가 li일 경우만 실행
            clickLi(node); // 개별 li에 이벤트 추가

            // li 내부의 addDocumentBtn도 추가되었는지 확인
            const addButton = node.querySelector('button');
            if (addButton) {
              clickAddBtn(addButton);
            }
          }
        });

        // 삭제된 노드 감지하여 path 변경
        mutation.removedNodes.forEach((node) => {
          if (node.nodeName === 'LI') {
            const deletedId = node.dataset.id; // 삭제된 li의 id 가져오기
            const currentPath = window.location.pathname;
            const pathId = currentPath.split('/').pop(); // 현재 path의 id 추출

            // 삭제된 ID가 현재 URL의 ID와 같다면 path에서 ID 제거
            if (deletedId === pathId) {
              window.history.pushState({}, '', '/html/posting.html'); // ID 없는 상태로 변경
            }
          }
        });
      }
    });
  });

  // 감시할 대상 (ul 태그 안의 li가 변경될 때 감지)
  const targetNode = document.querySelector('#showAll');
  const observerConfig = { childList: true, subtree: true };

  if (targetNode) {
    observer.observe(targetNode, observerConfig);
  }

  const clickLi = (li) => {
    //const files = document.querySelectorAll('#showAll > li');
    //console.log(files);
    //Array.from(files).forEach((li) => {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      const li = e.currentTarget;
      const id = li.dataset.id;
      router(id);
    });
    //});
  };
  //clickLi();

  const clickAddBtn = (btn) => {
    //const files = document.querySelectorAll('#showAll > li');
    //console.log(files);
    //Array.from(files).forEach((li) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const li = e.currentTarget.parentElement;
      const id = li.dataset.id;
      router(id);
    });
    //});
  };
});

function router(id) {
  // 웹 브라우저의 주소가 li태그의 data-id로 변경됨
  const pathname = window.location.pathname;
  if (pathname.includes('posting.html/')) {
    window.history.pushState({}, '', id);
  } else {
    window.history.pushState({}, '', `posting.html/${id}`);
  }
  handleLocation();
}

// 현재 URL의 path 경로를 출력
async function handleLocation() {
  const pathname = window.location.pathname;
  const id = pathname.split('/').pop();

  if (id !== 'posting.html') {
    updateInputFields(id); // 데이터 업데이트
  } else {
    // path에 id 값이 없다면 글 작성 부분 초기화
    const titleInput = document.querySelector('.postingTitle');
    const contentTextarea = document.querySelector('.postingContent');

    titleInput.value = '';
    contentTextarea.value = '';
  }
}

async function updateInputFields(id) {
  try {
    // 서버에서 id에 해당하는 데이터 가져오기
    const API_PUT = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
    const response = await fetch(API_PUT, {
      method: 'GET',
      headers: {
        'x-username': 'b1jun4',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('불러온 데이터:', data); // 디버깅용

    // input과 textarea 값 업데이트
    const titleInput = document.querySelector('.postingTitle');
    const contentTextarea = document.querySelector('.postingContent');

    if (titleInput) titleInput.value = data.title || ''; // 값이 없으면 빈 문자열
    if (contentTextarea) contentTextarea.value = data.content || '';
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
}

window.addEventListener('popstate', handleLocation);
