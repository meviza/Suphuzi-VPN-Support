# BTCPay Server Kurulum Rehberi

## 📋 Giriş

BTCPay Server, Bitcoin ve diğer kripto para ödemelerini almak için kullanılan açık kaynaklı, kendi kendine barındırılan bir ödeme işlemcisidir. Suphuzi VPN olarak müşterilerimize kripto para ödeme seçeneği sunmak için BTCPay Server kullanacağız.

## 🎯 BTCPay Server Avantajları

- ✅ **%0 Komisyon:** Üçüncü taraf ödeme işlemcilerine ödeme yapmazsınız
- ✅ **Tam Kontrol:** Kendi sunucunuzda barındırın, verileriniz sizdedir
- ✅ **Gizlilik:** Müşteri bilgileri BTCPay Server'da kalır, dışarı paylaşılmaz
- ✅ **Çoklu Kripto Para:** Bitcoin, Lightning Network, Ethereum ve daha fazlasını destekler
- ✅ **Faturalandırma:** Otomatik fatura oluşturma ve takip
- ✅ **Entegrasyon:** Çok sayıda e-ticaret platformu ile entegrasyon

## 🛠️ Kurulum Seçenekleri

### 1. En Kolay: BTCPay Server Hosted (Önerilen Başlangıç)

**Kimler için uygun:** Küçük işletmeler, başlangıç seviyesi
**Maliyet:** Aylık ~$20-50
**Zaman:** 15 dakika

```bash
# 1. BTCPay Server hosted sitesine gidin
# https://mainnet.demo.btcpayserver.org/
# 2. "Create Store" butonuna tıklayın
# 3. Mağaza bilgilerinizi girin
# 4. Ödeme alımına başlayın
```

### 2. Docker ile Kurulum (Orta Seviye)

**Kimler için uygun:** Teknik bilgiye sahip kullanıcılar
**Maliyet:** Sunucu maliyeti (~$10-30/ay)
**Zaman:** 1-2 saat

#### Gereksinimler:
- Ubuntu 20.04+ veya CentOS 8+
- Minimum 2GB RAM, 2 CPU core
- 20GB+ disk alanı
- Docker ve Docker Compose

#### Kurulum Adımları:

```bash
# 1. Sunucuyu güncelleyin
sudo apt update && sudo apt upgrade -y

# 2. Docker kurun
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Docker Compose kurun
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. BTCPay Server kurun
curl -sL https://btcpayserver.org/setup.sh -o setup.sh
sudo bash setup.sh

# 5. Kurulum sihirbazını takip edin
# - Lightning Network kurulumu
# - Cüzdan seçimi
# - SSL sertifikası
```

### 3. Luna Node ile Kurulum (Kolay Bulut)

**Kimler için uygun:** Bulut tabanlı çözüm isteyenler
**Maliyet:** Aylık ~$30-60
**Zaman:** 30 dakika

```bash
# 1. Luna Node hesabı oluşturun
# https://lunanode.com/
# 2. BTCPay Server seçin
# 3. Sunucu konfigürasyonunu yapın
# 4. Otomatik kurulumu bekleyin
```

### 4. Raspberry Pi ile Kurulum (Hobi)

**Kimler için uygun:** Test amaçlı, küçük ölçekli
**Maliyet:** Tek seferlik ~$150
**Zaman:** 2-3 saat

```bash
# Raspberry Pi 4 (4GB RAM) önerilir
# Raspberry Pi OS kurun
# Yukarıdaki Docker adımlarını izleyin
```

## 🔧 Konfigürasyon

### Temel Ayarlar

1. **Mağaza Oluşturma:**
   - Mağaza adı: "Suphuzi VPN"
   - Web sitesi: "https://suphuzi-vpn.com"
   - Fiziksel adres: Gerekirse ekleyin

2. **Cüzdan Kurulumu:**
   ```bash
   # Bitcoin cüzdanı oluştur
   # Lightning Network node'u başlat
   # Yedekleme kelimelerini güvenli sakla
   ```

3. **SSL Sertifikası:**
   ```bash
   # Let's Encrypt ile ücretsiz SSL
   # Otomatik yenileme ayarı
   ```

### Ödeme Ayarları

```json
{
  "payment_methods": {
    "BTC": {
      "enabled": true,
      "lightning": true,
      "onchain": true
    },
    "LTC": {
      "enabled": true,
      "lightning": false,
      "onchain": true
    }
  },
  "network_fees": {
    "btc_lightning_fee": 0.001,
    "btc_onchain_fee": "dynamic"
  },
  "invoice_settings": {
    "expiration": 15,
    "monitoring": 60
  }
}
```

## 🌐 Suphuzi VPN Entegrasyonu

### 1. Web Sitesi Entegrasyonu

```javascript
// BTCPay Server entegrasyon kodu
const createInvoice = async (amount, currency = 'USD') => {
  const response = await fetch('https://your-btcpay-server.com/api/v1/stores/your-store-id/invoices', {
    method: 'POST',
    headers: {
      'Authorization': 'token YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      metadata: {
        orderId: 'vpn-subscription-' + Date.now(),
        itemDesc: 'Suphuzi VPN Premium Subscription'
      }
    })
  });
  
  const invoice = await response.json();
  return invoice;
};

// Ödeme butonu
document.getElementById('btc-pay-button').addEventListener('click', async () => {
  const invoice = await createInvoice(4.99);
  window.location.href = invoice.checkoutLink;
});
```

### 2. Mobil Uygulama Entegrasyonu

```swift
// iOS Swift entegrasyonu
import Foundation

class BTCPayService {
    static let shared = BTCPayService()
    private let baseURL = "https://your-btcpay-server.com"
    private let apiKey = "YOUR_API_KEY"
    
    func createInvoice(amount: Double, completion: @escaping (Result<String, Error>) -> Void) {
        let url = URL(string: "\(baseURL)/api/v1/stores/your-store-id/invoices")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("token \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = [
            "amount": amount,
            "currency": "USD",
            "metadata": [
                "orderId": "vpn-subscription-\(Date().timeIntervalSince1970)",
                "itemDesc": "Suphuzi VPN Premium Subscription"
            ]
        ] as [String : Any]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(NSError(domain: "BTCPayError", code: 0, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }
            
            do {
                let invoice = try JSONDecoder().decode(BTCPayInvoice.self, from: data)
                completion(.success(invoice.checkoutLink))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}
```

### 3. Backend Entegrasyonu (Node.js)

```javascript
// Express.js backend entegrasyonu
const express = require('express');
const axios = require('axios');

const app = express();
const BTCPAY_URL = 'https://your-btcpay-server.com';
const STORE_ID = 'your-store-id';
const API_KEY = 'YOUR_API_KEY';

app.post('/api/create-btc-invoice', async (req, res) => {
  try {
    const { amount, plan, userId } = req.body;
    
    const invoiceData = {
      amount: amount,
      currency: 'USD',
      metadata: {
        orderId: `vpn-${plan}-${userId}-${Date.now()}`,
        itemDesc: `Suphuzi VPN ${plan} Subscription`,
        buyerEmail: req.body.email
      }
    };

    const response = await axios.post(
      `${BTCPAY_URL}/api/v1/stores/${STORE_ID}/invoices`,
      invoiceData,
      {
        headers: {
          'Authorization': `token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      invoiceId: response.data.id,
      checkoutUrl: response.data.checkoutLink,
      amount: response.data.amount
    });

  } catch (error) {
    console.error('BTCPay invoice creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create invoice'
    });
  }
});

// Webhook handler for payment confirmation
app.post('/api/btcpay-webhook', (req, res) => {
  const invoice = req.body;
  
  if (invoice.status === 'Paid' || invoice.status === 'Confirmed') {
    // Activate VPN subscription
    const orderId = invoice.metadata.orderId;
    const [plan, userId] = orderId.split('-').slice(1, 3);
    
    // Update user subscription in database
    updateUserSubscription(userId, plan);
    
    console.log(`Payment confirmed for user ${userId}, plan ${plan}`);
  }
  
  res.status(200).send('OK');
});

function updateUserSubscription(userId, plan) {
  // Database logic to update user subscription
  // Send confirmation email
  // Activate VPN access
}

app.listen(3000, () => {
  console.log('BTCPay integration server running on port 3000');
});
```

## 🔒 Güvenlik Ayarları

### 1. API Anahtarı Yönetimi

```bash
# Güçlü API anahtarı oluştur
openssl rand -hex 32

# BTCPay Server'da API anahtarını yapılandır
# Settings > API Keys > Create New Key
# Sadece gerekli izinleri ver (invoice creation)
```

### 2. Firewall Ayarları

```bash
# Sadece gerekli portları aç
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 9735  # Lightning Network (varsa)
sudo ufw enable
```

### 3. Yedekleme Stratejisi

```bash
# Otomatik yedekleme script'i
#!/bin/bash
# backup-btcpay.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/btcpay"
BTCPAY_DIR="/var/lib/docker/volumes/btcpayserver_datadir"

# Docker volumes yedekle
docker run --rm -v $BTCPAY_DIR:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/btcpay-backup-$DATE.tar.gz -C /data .

# 7 günden eski yedekleri sil
find $BACKUP_DIR -name "btcpay-backup-*.tar.gz" -mtime +7 -delete

echo "BTCPay Server backup completed: $DATE"
```

## 📊 İzleme ve Bakım

### 1. Sistem Durumu Kontrolü

```bash
# BTCPay Server durumu
docker ps | grep btcpayserver

# Log kontrolü
docker logs btcpayserver

# Bitcoin node durumu
docker exec btcpayserver_bitcoind bitcoin-cli getblockchaininfo
```

### 2. Performans İzleme

```yaml
# docker-compose.yml monitoring ekle
version: '3'
services:
  btcpayserver:
    # ... mevcut ayarlar
    
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### 3. Otomatik Güncelleme

```bash
# Güncelleme script'i
#!/bin/bash
# update-btcpay.sh

echo "Updating BTCPay Server..."
cd /root/btcpayserver-docker
git pull
docker-compose pull
docker-compose up -d

echo "BTCPay Server updated successfully!"
```

## 🚀 Suphuzi VPN için Özel Ayarlar

### 1. Abonelik Planları

```json
{
  "subscription_plans": {
    "basic": {
      "amount": 4.99,
      "duration_days": 30,
      "features": ["5 devices", "standard speed", "50+ countries"]
    },
    "pro": {
      "amount": 8.99,
      "duration_days": 30,
      "features": ["10 devices", "high speed", "100+ countries", "priority support"]
    },
    "enterprise": {
      "amount": 19.99,
      "duration_days": 30,
      "features": ["unlimited devices", "maximum speed", "all countries", "dedicated support"]
    }
  }
}
```

### 2. Otomatik Abonelik Yönetimi

```javascript
// Abonelik yönetimi
class SubscriptionManager {
  async handlePayment(invoiceId) {
    const invoice = await this.getInvoice(invoiceId);
    
    if (invoice.status === 'Paid') {
      const plan = this.extractPlanFromMetadata(invoice.metadata);
      const userId = this.extractUserIdFromMetadata(invoice.metadata);
      
      // Aboneliği aktifleştir
      await this.activateSubscription(userId, plan);
      
      // Kullanıcıya bildirim gönder
      await this.sendActivationEmail(userId, plan);
      
      // BTCPay faturalandırma sistemine bildir
      await this.markInvoiceAsProcessed(invoiceId);
    }
  }
  
  async activateSubscription(userId, plan) {
    const subscription = {
      userId: userId,
      plan: plan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün
      status: 'active',
      paymentMethod: 'bitcoin'
    };
    
    // Veritabanına kaydet
    await this.database.subscriptions.create(subscription);
    
    // VPN erişimini aktifleştir
    await this.vpnService.activateUserAccess(userId);
  }
}
```

## 📞 Destek ve Sorun Giderme

### Yaygın Sorunlar

1. **Fatura Ödenmedi ama Bildirim Gelmedi:**
   ```bash
   # Webhook URL'sini kontrol et
   # BTCPay Server > Settings > Webhooks
   # Test webhook gönder
   ```

2. **Lightning Network Çalışmıyor:**
   ```bash
   # Lightning node durumunu kontrol et
   docker exec btcpayserver_bitcoind lightning-cli getinfo
   
   # Kanalları kontrol et
   docker exec btcpayserver_bitcoind lightning-cli listchannels
   ```

3. **SSL Sertifikası Hatası:**
   ```bash
   # Let's Encrypt yenile
   docker exec btcpayserver certbot renew
   ```

### Destek Kaynakları

- **BTCPay Server Docs:** https://docs.btcpayserver.org/
- **Community Chat:** https://chat.btcpayserver.org/
- **GitHub Issues:** https://github.com/btcpayserver/btcpayserver/issues
- **Suphuzi VPN Destek:** kerem.newton571@gmail.com

## 🎯 Sonraki Adımlar

1. **Test Ortamı Kurulumu:** BTCPay Server demo ortamında test edin
2. **Production Kurulumu:** Yukarıdaki seçeneklerden biriyle production kurulumu yapın
3. **Entegrasyon Testi:** Suphuzi VPN web sitesi ile entegrasyonu test edin
4. **Güvenlik Denetimi:** Güvenlik ayarlarını gözden geçirin
5. **Yedekleme Stratejisi:** Otomatik yedekleme sistemi kurun
6. **İzleme:** Performans ve uptime izleme sistemi kurun

## ⚠️ Önemli Notlar

- BTCPay Server kurulumu teknik bilgi gerektirir
- Bitcoin fiyat dalgalanmaları nedeniyle ödeme tutarlarını düzenli olarak kontrol edin
- Lightning Network için yeterli likidite sağlayın
- Yasal düzenlemeleri ülkenize göre kontrol edin
- Müşteri verilerinin gizliliğini sağlayın

---

**Bu rehber Suphuzi VPN için BTCPay Server kurulumunu kapsamaktadır. Kurulum sırasında sorun yaşarsanız, destek ekibimizle iletişime geçebilirsiniz.**

📧 **Destek:** kerem.newton571@gmail.com  
🌐 **Web Sitesi:** https://suphuzi-vpn.com  
💬 **Community:** https://community.suphuzi-vpn.com
