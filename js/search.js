document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.search');
  const input = form.querySelector('input');
  const listContainer = document.querySelector('#showAll');

  // ✅ MutationObserver 설정 (동적으로 추가된 li 감지)
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'LI') {
            clickLi(node); // 새로 추가된 li에 이벤트 추가
            addSearchFunctionality(); // 검색 기능도 동적으로 반영
          }
        });
      }
    });
  });

  if (listContainer) {
    observer.observe(listContainer, { childList: true, subtree: true });
  }

  // ✅ 검색 기능
  function addSearchFunctionality() {
    const listItems = document.querySelectorAll('#showAll li');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = input.value.trim().toLowerCase();
      console.log(`🔍 검색어 입력: "${query}"`);

      let matchCount = 0;

      listItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'list-item';
          console.log(`✅ 일치하는 항목: "${item.textContent}"`);
          matchCount++;
        } else {
          item.style.display = 'none';
          console.log(`❌ 숨겨진 항목: "${item.textContent}"`);
        }
      });

      console.log(`🔹 총 ${matchCount}개의 항목이 검색됨.`);
    });
  }

  // ✅ 기존 문서 로드 후 검색 기능 반영
  addSearchFunctionality();

  // ✅ li 클릭 시 라우팅
  function clickLi(li) {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      const id = li.dataset.id;
      router(id);
    });
  }

  // ✅ 주소 변경 및 데이터 로드
  function router(id) {
    const pathname = window.location.pathname;
    if (pathname.includes('posting.html/')) {
      window.history.pushState({}, '', id);
    } else {
      window.history.pushState({}, '', `posting.html/${id}`);
    }
    handleLocation();
  }

  // ✅ URL에 따라 데이터 불러오기
  async function handleLocation() {
    const pathname = window.location.pathname;
    const id = pathname.split('/').pop();

    if (id !== 'posting.html') {
      updateInputFields(id);
    } else {
      document.querySelector('.postingTitle').value = '';
      document.querySelector('.postingContent').value = '';
    }
  }

  async function updateInputFields(id) {
    try {
      const API_PUT = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
      const response = await fetch(API_PUT, {
        method: 'GET',
        headers: { 'x-username': 'b1jun4' },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('불러온 데이터:', data);

      document.querySelector('.postingTitle').value = data.title || '';
      document.querySelector('.postingContent').value = data.content || '';
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  }

  window.addEventListener('popstate', handleLocation);
});
