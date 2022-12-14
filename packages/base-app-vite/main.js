const loadButton = document.getElementById('load');
import { md4 } from 'hash-wasm';
const SCOPE = 'plugin_app';
const REMOTE_HOST = "http://localhost:3001"
const MANIFEST_URL = `${REMOTE_HOST}/asset-manifest.json`;

loadButton.addEventListener('click', async() => {
  const manifest = await fetch(MANIFEST_URL).then(res => res.json());

  const containerPath = manifest.files['plugin_app.js'];
  const code = await (await fetch(`${REMOTE_HOST}/${containerPath}`)).text();
  const checksum = await (await fetch(`${REMOTE_HOST}/CHECKSUM`)).text();
  const codeHash = await md4(code);
  if (codeHash !== checksum) {
    alert('Checksum failed, stop load plugin');
    return;
  }

  import('plugin_app/App')
});