// QR Generator
let qr;
const qrcodeContainer = document.getElementById('qrcode');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');

function clearQRCode(){ qrcodeContainer.innerHTML = ''; qr = null }

generateBtn.addEventListener('click', ()=>{
  const text = document.getElementById('qr-text').value.trim();
  const size = parseInt(document.getElementById('qr-size').value);
  const margin = parseInt(document.getElementById('qr-margin').value);

  clearQRCode();
  if(!text){ alert('Enter text or URL to generate QR'); return }

  qr = new QRCode(qrcodeContainer, {
    text: text,
    width: size,
    height: size,
    correctLevel: QRCode.CorrectLevel.H,
  });

  setTimeout(()=>{
    downloadBtn.disabled = false;
  }, 200);
});

downloadBtn.addEventListener('click', ()=>{
  if(!qrcodeContainer.firstChild) return;
  const el = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
  if(!el){ alert('No QR to download'); return }
  if(el.tagName.toLowerCase() === 'img'){
    const url = el.src;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }else{
    const url = el.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
});

// QR Scanner
const cameraSelect = document.getElementById('camera-select');
const startScanBtn = document.getElementById('start-scan');
const stopScanBtn = document.getElementById('stop-scan');
const resultInput = document.getElementById('scan-result');
const copyBtn = document.getElementById('copy-result');

let html5QrCode = null;
let currentCameraId = null;

function listCameras(){
  Html5Qrcode.getCameras().then(cameras => {
    cameraSelect.innerHTML = '';
    if(cameras && cameras.length){
      cameras.forEach(cam => {
        const opt = document.createElement('option');
        opt.value = cam.id;
        opt.text = cam.label || cam.id;
        cameraSelect.appendChild(opt);
      });
      currentCameraId = cameras[0].id;
    } else {
      const opt = document.createElement('option');
      opt.text = 'No cameras found';
      cameraSelect.appendChild(opt);
    }
  }).catch(err => {
    console.warn('getCameras error', err);
    cameraSelect.innerHTML = '<option>No camera access</option>';
  });
}

cameraSelect.addEventListener('change', ()=>{
  currentCameraId = cameraSelect.value;
});

startScanBtn.addEventListener('click', async ()=>{
  if(!currentCameraId){ alert('No camera selected'); return }
  if(html5QrCode){ alert('Scanner already running'); return }
  html5QrCode = new Html5Qrcode("reader");
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  try{
    await html5QrCode.start(
      { deviceId: { exact: currentCameraId } },
      config,
      (decodedText, decodedResult) => {
        resultInput.value = decodedText;
        copyBtn.disabled = false;
      }
    );
    startScanBtn.disabled = true;
    stopScanBtn.disabled = false;
  }catch(err){
    console.error('start failed', err);
    alert('Unable to start camera. Permission denied or camera busy.');
    html5QrCode = null;
  }
});

stopScanBtn.addEventListener('click', async ()=>{
  if(!html5QrCode) return;
  await html5QrCode.stop();
  html5QrCode.clear();
  html5QrCode = null;
  startScanBtn.disabled = false;
  stopScanBtn.disabled = true;
});

copyBtn.addEventListener('click', ()=>{
  const v = resultInput.value;
  if(!v) return;
  navigator.clipboard.writeText(v).then(()=>{
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent='Copy', 1200);
  });
});

listCameras();
document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) listCameras(); });