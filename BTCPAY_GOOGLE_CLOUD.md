# BTCPay Server Google Cloud Platform Kurulumu

## 🎯 En Kolay Google Cloud Entegrasyonu

### Seçim: Google Cloud VM + Docker BTCPay Server

**Neden bu seçenek?**
- ✅ Google altyapısı ile tam uyumlu
- ✅ Kubernetes entegrasyonu mümkün
- ✅ Google ödeme sistemleri ile kolay entegrasyon
- ✅ Otomatik yedekleme ve güvenlik
- ✅ Sadece hesap açma + kripto çekme

---

## 🚀 5 Dakikada Kurulum

### 1. Google Cloud Hesabı Açın (2 dakika)

```bash
# 1. Google Cloud hesabı açın
# https://console.cloud.google.com/

# 2. Yeni proje oluşturun
# Proje adı: "suphuzi-vpn-btcpay"

# 3. $300 krediyi aktifleştirin (yeni hesaplar için)
```

### 2. VM Oluşturun (1 dakika)

```bash
# Google Cloud Console'da:
# Compute Engine > VM instances > Create Instance

# Ayarlar:
# - Region: europe-west1 (Belçika - düşük vergili)
# - Machine type: e2-medium (2 vCPU, 4GB RAM)
# - Boot disk: 30GB SSD
# - Firewall: HTTP (80), HTTPS (443), SSH (22)
# - Cost: ~$25/ay
```

### 3. BTCPay Server Kurulumu (2 dakika)

SSH ile sunucuya bağlanın:

```bash
# 1. Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 2. BTCPay Server kurulumu
curl -sL https://btcpayserver.org/setup.sh -o setup.sh
sudo bash setup.sh

# 3. Otomatik kurulum sihirbazı
# - "Deploy BTCPay Server" seçin
# - "Docker" seçin
# - "Google Cloud" seçin
# - SSL sertifikası için "Let's Encrypt" seçin
```

---

## 💰 Maliyet ve Özellikler

### Google Cloud Maliyeti
- **VM:** $25/ay (e2-medium)
- **Ağ:** ~$5/ay
- **Depolama:** ~$5/ay (30GB SSD)
- **Toplam:** ~$35/ay

### BTCPay Server Özellikleri
- ✅ **%0 komisyon** (sadece Google Cloud ücreti)
- ✅ **Otomatik SSL** (Let's Encrypt)
- ✅ **Bitcoin + Lightning** desteği
- ✅ **Google Cloud yedekleme**
- ✅ **7/24 Google desteği**

---

## 📧 Kripto Çekme Ayarları

### 1. Cüzdan Oluşturma

```bash
# BTCPay Server admin paneline gidin
# https://your-vm-ip:23000

# Cüzdan oluştur:
# - Bitcoin cüzdanı
# - Lightning Network cüzdanı
# - Yedekleme kelimelerini güvenli sakla!
```

### 2. Google Cloud ile Kripto Çekme

**Seçenek 1: Google Pay Entegrasyonu (En Kolay)**

```javascript
// Google Pay Button entegrasyonu
const googlePayButton = {
  environment: 'TEST', // Production için 'PRODUCTION'
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [{
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
    },
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'btcpayserver',
        gatewayMerchantId: 'your-btcpay-merchant-id'
      }
    }
  }]
};

// Google Pay ile ödeme al
function requestGooglePayment() {
  const paymentsClient = new google.payments.api.PaymentsClient({
    environment: 'TEST'
  });
  
  paymentsClient.loadPaymentData(googlePayButton)
    .then(paymentData => {
      // BTCPay Server'a gönder
      sendToBTCPay(paymentData);
    });
}
```

**Seçenek 2: Direkt Kripto Çekme**

```javascript
// BTCPay Server entegrasyonu
const BTCPAY_URL = 'https://your-btcpay-server.com';
const STORE_ID = 'your-store-id';

async function createInvoice(amount) {
  const response = await fetch(`${BTCPAY_URL}/api/v1/stores/${STORE_ID}/invoices`, {
    method: 'POST',
    headers: {
      'Authorization': 'token YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      currency: 'USD',
      metadata: {
        orderId: 'vpn-' + Date.now(),
        itemDesc: 'Suphuzi VPN Subscription'
      }
    })
  });
  
  return response.json();
}

// Ödeme butonu
document.getElementById('btc-pay').onclick = async () => {
  const invoice = await createInvoice(4.99);
  window.location.href = invoice.checkoutLink;
};
```

---

## 🔧 Google Cloud Özel Ayarları

### 1. Otomatik Yedekleme

```bash
# Google Cloud Storage ile yedekleme
gsutil mb gs://suphuzi-btcpay-backups

# Otomatik yedekleme script'i
#!/bin/bash
# backup-to-google.sh

DATE=$(date +%Y%m%d)
docker run --rm -v btcpayserver_datadir:/data \
  -v /tmp:/backup alpine tar czf /backup/btcpay-$DATE.tar.gz -C /data .

gsutil cp /tmp/btcpay-$DATE.tar.gz gs://suphuzi-btcpay-backups/
```

### 2. Google Cloud Monitoring

```yaml
# monitoring.yml
apiVersion: monitoring.googleapis.com/v1
kind: Service
metadata:
  name: btcpay-monitoring
spec:
  type: LoadBalancer
  ports:
  - port: 23000
    targetPort: 23000
  selector:
    app: btcpayserver
```

### 3. Kubernetes Entegrasyonu (İleri Seviye)

```yaml
# k8s-btcpay.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: btcpayserver
spec:
  replicas: 1
  selector:
    matchLabels:
      app: btcpayserver
  template:
    metadata:
      labels:
        app: btcpayserver
    spec:
      containers:
      - name: btcpayserver
        image: btcpayserver/btcpayserver:latest
        ports:
        - containerPort: 23000
        env:
        - name: BTCPAY_HOST
          value: "btcpay.your-domain.com"
```

---

## 🌐 Web Sitesi Entegrasyonu

### Suphuzi VPN Web Sitesi

```html
<!-- BTCPay entegrasyon butonu -->
<div id="btcpay-container">
  <button onclick="payWithBitcoin()" class="btc-pay-btn">
    <i class="fab fa-bitcoin"></i>
    Pay with Bitcoin
  </button>
  <button onclick="payWithGoogle()" class="google-pay-btn">
    <i class="fab fa-google-pay"></i>
    Google Pay
  </button>
</div>

<script>
async function payWithBitcoin() {
  const response = await fetch('/api/create-btc-invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 4.99, plan: 'premium' })
  });
  
  const invoice = await response.json();
  window.location.href = invoice.checkoutUrl;
}

async function payWithGoogle() {
  // Google Pay entegrasyonu
  requestGooglePayment();
}
</script>
```

---

## 📱 Mobil Uygulama Entegrasyonu

### React Native (iOS/Android)

```javascript
// BTCPay React Native entegrasyonu
import { WebView } from 'react-native-webview';

const BTCPayPayment = ({ amount, onSuccess }) => {
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  
  const handlePayment = async () => {
    const response = await fetch('/api/create-btc-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, plan: 'premium' })
    });
    
    const invoice = await response.json();
    setCheckoutUrl(invoice.checkoutUrl);
  };
  
  return (
    <View>
      <Button title="Pay with Bitcoin" onPress={handlePayment} />
      {checkoutUrl && (
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('/invoice/')) {
              // Ödeme başarılı
              onSuccess();
            }
          }}
        />
      )}
    </View>
  );
};
```

---

## 🔒 Güvenlik Ayarları

### Google Cloud Güvenliği

```bash
# Google Cloud Firewall kuralları
gcloud compute firewall-rules create btcpay-allow-http \
  --allow tcp:80,tcp:443,tcp:23000 \
  --source-ranges 0.0.0.0/0 \
  --target-tags btcpay-server

# SSL sertifikası otomatik yenileme
gcloud compute ssl-certificates create btcpay-cert \
  --domains btcpay.your-domain.com
```

### BTCPay Server Güvenliği

```bash
# Güçlü şifreler
openssl rand -hex 32

# API anahtarları
# Settings > API Keys > Create New Key
# Sadece gerekli izinler: invoice creation, store management
```

---

## 💸 Maliyet Optimizasyonu

### Google Cloud Maliyetlerini Düşürme

```bash
# 1. Preemptible VM kullanın (%60 tasarruf)
gcloud compute instances create btcpay-vm \
  --machine-type e2-medium \
  --preemptible

# 2. Otomatik kapatma (gece kullanım yoksa)
gcloud compute instances add-tags btcpay-vm --tags=auto-shutdown

# 3. Daha küçük VM (test için)
gcloud compute instances create btcpay-vm \
  --machine-type e2-small \
  --custom-memory 2GB
```

---

## 🚀 Hızlı Başlangıç Script'i

```bash
#!/bin/bash
# quick-setup.sh

echo "🚀 Suphuzi VPN BTCPay Server Quick Setup"

# 1. Google Cloud proje kontrolü
if ! gcloud projects list | grep suphuzi-vpn-btcpay; then
  echo "❌ Proje bulunamadı. Önce Google Cloud projesi oluşturun."
  exit 1
fi

# 2. VM oluşturma
echo "📦 VM oluşturuluyor..."
gcloud compute instances create btcpay-server \
  --machine-type e2-medium \
  --image-family ubuntu-2004-lts \
  --image-project ubuntu-os-cloud \
  --boot-disk-size 30GB \
  --tags btcpay-server

# 3. BTCPay kurulumu
echo "🛡️ BTCPay Server kuruluyor..."
gcloud compute ssh btcpay-server --command "
  curl -sL https://btcpayserver.org/setup.sh | sudo bash
"

echo "✅ Kurulum tamamlandı!"
echo "🌐 BTCPay Server: http://$(gcloud compute instances describe btcpay-server --format='get(networkInterfaces[0].accessConfigs[0].natIP)'):23000"
```

---

## 📞 Destek

### Google Cloud Destek
- **24/7 Google Cloud Support:** Gold+ planlar için
- **Community Forum:** https://cloud.google.com/community
- **Documentation:** https://cloud.google.com/docs

### BTCPay Server Destek
- **Community Chat:** https://chat.btcpayserver.org/
- **GitHub Issues:** https://github.com/btcpayserver/btcpayserver
- **Suphuzi VPN:** kerem.newton571@gmail.com

---

## 🎯 Özet

**En kolay Google Cloud entegrasyonu:**

1. ✅ **Google Cloud hesabı aç** (2 dakika)
2. ✅ **VM oluştur** (1 dakika) 
3. ✅ **BTCPay kur** (2 dakika)
4. ✅ **Kripto çek** (hazır)

**Toplam maliyet:** ~$35/ay  
**Kurulum süresi:** 5 dakika  
**Bakım:** Otomatik (Google Cloud)

---

**Bu rehber Suphuzi VPN için Google Cloud + BTCPay Server entegrasyonunu kapsamaktadır. Kurulum sırasında sorun yaşarsanız, destek ekibimizle iletişime geçebilirsiniz.**

📧 **Destek:** kerem.newton571@gmail.com  
🌐 **Web Sitesi:** https://suphuzi-vpn.com  
☁️ **Google Cloud:** https://console.cloud.google.com
