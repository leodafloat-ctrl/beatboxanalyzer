# Beatbox Analyzer

瀏覽器內即時 beatbox 聲音視覺分析 prototype。

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

「Spectral Fullness」是描述性頻率覆蓋指標，不是音質優劣判定。它以嚴格的即時 one-shot 門檻分別檢查 low、mid、high；三段都越過各自的聲音門檻才會顯示 Full。

節拍器是獨立的練習工具，不參與 Fullness 判定；提供 BPM、可自訂的 Beats／Division，以及 Digital、Wood、Soft 三種程式合成 click 音色。

## 授權與素材

程式碼與文件以 [MIT License](LICENSE) 發布，署名 Leo Dafloat。介面、分析邏輯與 click 音色皆為本專案獨立實作；程式不下載或內嵌第三方影音、字型或圖片。`Sounds Test/` 內的錄音只供本機測試，網頁不會載入它們，且不包含在 MIT 授權或公開發行內容中。
