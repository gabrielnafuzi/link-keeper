const ul = document.querySelector('ul');
const input = document.querySelector('input');
const form = document.querySelector('form');

async function load() {
  const res = await fetch('http://localhost:3333/').then(data => data.json());
  res.urls.map(({ name, url }) => addElement({ name, url }));
}

load();

async function save(name, url) {
  await fetch(`http://localhost:3333/?name=${name}&url=${url}`).then(data =>
    data.json()
  );
}

async function remove(name, url) {
  await fetch(
    `http://localhost:3333/?name=${name}&url=${url}&del=1`
  ).then(data => data.json());
}

function addElement({ name, url }) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  const trash = document.createElement('span');

  a.href = url;
  a.innerHTML = name;
  a.target = '_blank';

  trash.innerHTML = 'x';
  trash.onclick = () => removeElement(trash);

  li.append(a);
  li.append(trash);
  ul.append(li);
}

function removeElement(el) {
  if (confirm('Are you sure you want to delete?')) {
    el.parentNode.remove();

    const { text, origin } = el.parentNode.firstChild;

    remove(text, origin);
  }
}

function removeSomeUrlsChars(url) {
  url = url.replace(/^\s+|\s+$/gm, '');

  while (url.charAt(url.length - 1) === '/') {
    url = url.substr(0, url.length - 1);
  }

  return url;
}

form.addEventListener('submit', event => {
  event.preventDefault();

  let { value } = input;

  if (!value) return alert('Fill out the field');

  let [name, tmpUrl] = value.split(',');

  url = removeSomeUrlsChars(tmpUrl);

  if (!url) return alert('Format the text correctly');

  if (!/^http/.test(url)) return alert('Enter the URL correctly');

  addElement({ name, url });

  save(name, url);

  input.value = '';
});
