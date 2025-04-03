document.addEventListener('DOMContentLoaded', () => {
  // 아이콘 요소와 이모지가 담긴 목록
  const icon = document.getElementById('emojiBtn');
  const picker = new EmojiButton({ theme: 'auto', position: 'bottom-start' });
  // 아이콘 요소 클릭시, 이모지 목록 펼침
  icon.addEventListener('click', () => {
    picker.togglePicker(icon);
  });
  // 이모지 목록에서 특정 값을 선택시, 이모지 확인됨
  picker.on('emoji', (emoji) => {
    emojiBtn.textContent = emoji;
  });
});
