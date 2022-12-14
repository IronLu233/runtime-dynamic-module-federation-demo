import { md4 } from 'hash-wasm';
const SCOPE = 'plugin_app';
const REMOTE_HOST = "http://localhost:3001"
const MANIFEST_URL = `${REMOTE_HOST}/asset-manifest.json`;

const button = document.createElement("button");
button.addEventListener("click", loadPluginApp);
button.innerText = 'Load dynamic button';

document.body.appendChild(button);

async function loadPluginApp() {
  const manifest = await fetch(MANIFEST_URL).then(res => res.json());

  const containerPath = manifest.files['plugin_app.js'];
  const code = await (await fetch(`${REMOTE_HOST}/${containerPath}`)).text();
  const checksum = await (await fetch(`${REMOTE_HOST}/CHECKSUM`)).text();
  const codeHash = await md4(code);
  if (codeHash !== checksum) {
    alert('Checksum failed, stop load plugin');
    return;
  }
  const script = document.createElement('script');
  script.innerText = code;
  script.src = `${REMOTE_HOST}/${containerPath}`;

  await new Promise(resolve => {
    script.addEventListener('load', resolve);
    document.body.appendChild(script);
  })
  await __webpack_init_sharing__('default');

  const container = window[SCOPE]; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const AppFactory = await container.get('./App');
  
  AppFactory().default();
}
