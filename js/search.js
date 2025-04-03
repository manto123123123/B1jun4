document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.search'); // 검색 폼
  const input = form.querySelector('input'); // 검색 입력 필드
  const listContainer = document.querySelector('#showAll'); // 리스트 컨테이너

  // ✅ MutationObserver 설정 (동적으로 추가된 li 감지)
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'LI') {
            clickLi(node); // 새로 추가된 li에 클릭 이벤트 추가
            addSearchFunctionality(); // 검색 기능 업데이트
          }
        });
      }
    });
  });

  // 리스트 컨테이너가 존재하면 감지 시작
  if (listContainer) {
    observer.observe(listContainer, { childList: true, subtree: true });
  }

  // ✅ 검색 기능
  function addSearchFunctionality() {
    const listItems = document.querySelectorAll('#showAll li');

    form.addEventListener('submit', (event) => {
      event.preventDefault(); // 기본 제출 동작 방지
      filterList();
    });

    input.addEventListener('input', () => {
      filterList();
    });

    function filterList() {
      const query = input.value.trim().toLowerCase(); // 입력값을 소문자로 변환

      let matchCount = 0;

      listItems.forEach((item) => {
        const text = item.textContent.toLowerCase(); // 리스트 항목의 텍스트
        if (query === '') {
          // ✅ 검색어가 없으면 전체 항목 표시
          item.style.display = 'list-item';
          matchCount++;
        } else if (text.includes(query)) {
          // ✅ 검색어가 포함된 항목만 보이기
          item.style.display = 'list-item';

          matchCount++;
        } else {
          // ✅ 일치하지 않는 항목 숨기기
          item.style.display = 'none';
        }
      });
    }
  }

  // ✅ 기존 문서 로드 후 검색 기능 반영
  addSearchFunctionality();

  // ✅ li 클릭 시 라우팅
  function clickLi(li) {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      const id = li.dataset.id; // 클릭한 li의 data-id 가져오기
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
    const id = pathname.split('/').pop(); // URL에서 ID 추출

    if (id !== 'posting.html') {
      updateInputFields(id); // ID가 있으면 데이터 불러오기
    } else {
      // ID가 없으면 입력 필드 초기화
      document.querySelector('.postingTitle').value = '';
      document.querySelector('.postingContent').value = '';
    }
  }

  // ✅ API에서 문서 데이터 가져와서 입력 필드 업데이트
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

  // ✅ 뒤로가기(←) 또는 앞으로가기(→)를 눌렀을 때 `handleLocation()` 실행
  window.addEventListener('popstate', handleLocation);
});
