# VS Code İçinde Çalışan Çözüm

## Visual Studio Code'u KAPATMADAN

### 1. Yeni Terminal Aç

VS Code'da yeni terminal aç (eski terminali kapat)

### 2. Node Process'leri Öldür

```powershell
# Tüm node process'lerini öldür
taskkill /F /IM node.exe
```

### 3. npm Install

```powershell
cd C:\Users\Mercan Danışmanl\Desktop\Bantas\frontend
npm install
```

## Hepsi Bu Kadar

VS Code açık kalacak, sadece:
1. Yeni terminal aç
2. `taskkill /F /IM node.exe`
3. `npm install`

Bitti! 🚀
