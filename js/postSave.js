document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.postingTitle');
  const content = document.querySelector('.postingContent');
  const pathname = window.location.pathname;
  const id = pathname.split('/')[2];

  const API_PUT = `https://kdt-api.fe.dev-cos.com/documents/${id}`;
  const USERNAME = 'b1jun4';

  // title이나 content에 키보드로 입력할 때마다 PUT 요청
  const posting = [title, content];
  posting.forEach((v) => {
    v.addEventListener('keyup', async () => {
      const titleText = title.value;
      const titleContent = content.value;

      try {
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
      } catch (error) {
        console.error(error);
      }
    });
  });
});
