(async function () {
  // 读取 content.json
  const res = await fetch('content.json', {cache: 'no-store'});
  const data = await res.json();

  // 简单绑定：元素的 data-bind 属性对应 JSON 路径
  document.querySelectorAll('[data-bind]').forEach(el => {
    const path = el.getAttribute('data-bind');
    el.textContent = deepGet(data, path) ?? el.textContent;
    if (el.id === 'emailLink') {
      el.href = `mailto:${deepGet(data, path)}`;
    }
  });

  // 列表绑定：ul[data-list="path"] 读取数组
  document.querySelectorAll('[data-list]').forEach(ul => {
    const arr = deepGet(data, ul.getAttribute('data-list')) || [];
    ul.innerHTML = '';
    arr.forEach(txt => {
      const li = document.createElement('li');
      li.textContent = txt;
      ul.appendChild(li);
    });
  });

  // 链接、图片、占位
  const learnLink = document.getElementById('learnLink');
  if (learnLink && data?.services?.learning?.link) learnLink.href = data.services.learning.link;

  const qrcode = document.getElementById('qrcode');
  if (qrcode && data?.services?.contact?.qrcode) qrcode.src = data.services.contact.qrcode;

  const avatar = document.getElementById('avatar');
  if (avatar && data?.hero?.avatar) avatar.src = data.hero.avatar;

  const timelineImg = document.getElementById('timelineImg');
  if (timelineImg && data?.timeline?.image) timelineImg.src = data.timeline.image;

  // 工具函数：读取对象的深层路径 a.b.c
  function deepGet(obj, path) {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
  }
})();
