# Beatbox Analyzer

瀏覽器內即時 beatbox 聲音視覺分析 prototype。

目前公開版本：**Beatbox Analyzer 1.0**

支持專案：[Buy Me a Coffee](https://buymeacoffee.com/leodafloat) · [PayPal](https://paypal.me/leodafloat)

## 執行

麥克風 API 需要安全來源，請勿直接雙擊 `index.html`。在此資料夾執行：

```bash
python3 -m http.server 4173
```

再開啟 <http://localhost:4173>，按下 **Start Input** 並允許麥克風。

## 功能

- Profile 與 Manual 兩種互斥 noise-gate 模式；Profile 只在使用者按下按鈕後取樣 5 秒 room tone 並鎖定，Manual 則以 −100 至 −30 dB 絕對門檻操作
- 以獨立 2,048-point 快速分析器產生單一連續振幅包絡，從中心到外層依序堆疊 high → mid → low 的瞬時能量比例；提供 Cyberpunk、Modern Dark、Neon Glow 三組預設與三頻帶獨立自訂色票，low profile margin 較寬鬆以保留 kick 與 bass
- 20 Hz–20 kHz、−110 至 0 dBFS 的平滑 16,384-point FFT 對數頻譜；可選藍、紫、黃、橘、綠五種底色，強峰與 5–10 組 formant/resonance ranges 一律漸變為白色
- autocorrelation 即時音高與 note 名稱
- 合併相近 spectral peak candidates，並以穩定的寬頻區域呈現，避免將非母音聲音誤判為正式 formants
- low / mid / high 能量、頻帶傾向與 Full / Moderate / Limited 指標
- 30／45／60／90 秒的 Routine Analysis：每 200 ms 只在瀏覽器記錄 low／mid／high 是否跨過目前閾值，完成後提供時間覆蓋圖與規則式補強方向
- Sound Wave 模式與 20 秒至 10 毫秒的訊號歷史縮放；深度縮放會顯示逐點連線與個別 sample dots
- Signal History 的高度使用僅限視覺呈現的 soft limiter；它不會修改原始音訊，也不會改變頻譜、gate 或段子分析數值
- 瀏覽器本機錄音、試聽與下載；錄音格式會依 Safari／Chrome 實際支援能力自動選擇
- 本機音檔播放分析：播放時會驅動既有的 Signal History、Spectrum、Note Detect 與 Routine Analysis，檔案不會上傳伺服器；目前限制最長 3 分鐘、50 MB
- 音檔播放會沿用已完成的底噪 profile，讓現場輸入與回放使用相同 gate 基準；若尚未建立 profile，才會退回手動閾值

「Spectral Fullness」是描述性頻率覆蓋指標，不是音質優劣判定。它以嚴格的即時 one-shot 門檻分別檢查 low、mid、high；三段都越過各自的聲音門檻才會顯示 Full。

節拍器是獨立的練習工具，不參與 Fullness 判定；提供 BPM、可自訂的 Beats／Division，以及 Digital、Wood、Soft 三種程式合成 click 音色。BPM 以四分音符為計時基準，Division 會換算實際拍值，因此 4／8 的每拍間隔會是同 BPM 之 4／4 的一半。

Routine Analysis 是透明的 rule-based feedback，不是 AI、技巧評分或編排標準。不同麥克風的頻率響應、輸入 Gain 與錄音環境可能造成結果差異，分析應視為參考。聲音與匯入檔案只在執行時存在瀏覽器記憶體中，不會上傳或寫入永久儲存空間；錄音只有在使用者按下下載時才會儲存至裝置。

## Anonymous Usage Analytics

專案已預留可移除的 [Umami](https://umami.is/) 匿名使用統計整合，但預設為停用狀態，不會發出 analytics 網路請求。若要啟用：

1. 在 Umami Cloud 或自架 Umami 建立 Beatbox Analyzer 網站。
2. 從網站的 Tracking code 取得 Website ID。
3. 將 ID 填入 `analytics.js` 的 `CONFIG.websiteId`。若為自架服務，同時修改 `CONFIG.scriptUrl`。

追蹤只會在 `leodafloat-ctrl.github.io` 正式網域啟用，`localhost` 不會送出測試事件。Umami 自動記錄匿名 page view、referrer 與 UTM；`analytics.js` 另以白名單限制少量產品事件與分類欄位。程式不呼叫 `identify()`，也不傳送音訊、錄音、檔名、音高、頻譜、波形、頻段分析值、回饋結果或使用者輸入。事件設定與白名單集中在 `analytics.js`，移除該檔及 `index.html` 中對它的引用即可完整移除統計。

YouTube 分享連結可使用：

```text
https://leodafloat-ctrl.github.io/beatboxanalyzer/?utm_source=youtube&utm_medium=video&utm_campaign=beatbox_analyzer_launch
```

## 授權與素材

程式碼與文件以 [MIT License](LICENSE) 發布，署名 Leo Dafloat。介面、分析邏輯與 click 音色皆為本專案獨立實作；程式不下載或內嵌第三方影音、字型或圖片。`Sounds Test/` 內的錄音只供本機測試，網頁不會載入它們，且不包含在 MIT 授權或公開發行內容中。
