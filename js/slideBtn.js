document.addEventListener('DOMContentLoaded', () => {
  const toggleImg = document.querySelector('.toggleBtn img'); // 사이드바 토글 이미지 선택
  const sideBar = document.querySelector('.sideBar'); // 사이드바 선택
  const documentContainer = document.querySelector('.documentContainer');

  toggleImg.addEventListener('click', () => {
    sideBar.classList.toggle('hidden'); // 사이드바 숨기기/보이기 토글
    toggleImg.classList.toggle('flipped'); // 이미지 좌우 반전 토글

    if (documentContainer.style.display === 'none') {
      documentContainer.style.display = 'block'; // 다시 보이게 하기
      console.log('documentContainer가 다시 보입니다!');
    } else {
      documentContainer.style.display = 'none'; // 숨기기
      console.log('documentContainer가 숨겨졌습니다!');
    }

    console.log('사이드바 토글 버튼이 클릭되었습니다!');
  });
});
