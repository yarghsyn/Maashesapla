// 2026 Yasal Kıdem Tazminatı Tavanı
const YARGI_KIDEM_TAVANI = 41728.55;

function executeCoreEngine() {
    const currentSalary = parseFloat(document.getElementById('currentSalary').value);
    const raiseRate = parseFloat(document.getElementById('raiseRate').value) || 0;
    const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
    const overtimeRate = parseFloat(document.getElementById('overtimeRate').value) || 1.5;
    
    // Tarih, Yıllık İzin ve İhbar Modülleri
    const startDateVal = document.getElementById('startDate').value;
    const endDateVal = document.getElementById('endDate').value;
    const unusedLeave = parseInt(document.getElementById('unusedLeave').value) || 0;
    const includeNotice = document.getElementById('includeNotice').checked;

    if (isNaN(currentSalary) || currentSalary <= 0) {
        alert("Hata: Geçerli bir maaş değeri girilmelidir.");
        return;
    }

    // 1. Brüt Maaş Tahmini & SGK Hesaplamaları
    const estimatedGross = currentSalary * 1.4025; 
    const sgkWorkerBonus = estimatedGross * 0.14; 
    const uiBonus = estimatedGross * 0.01;        

    // 2. Zam ve Mesai Motoru (Girilen en son verilere göre)
    const raiseAmount = (currentSalary * raiseRate) / 100;
    const raisedSalary = currentSalary + raiseAmount;
    
    const standardHours = 225;
    const hourlyWage = currentSalary / standardHours;
    const overtimePay = overtimeHours * (hourlyWage * overtimeRate);

    // 3. Tarih Tabanlı Tazminat Hesaplama Katmanı
    let severityPayout = 0;
    let noticePayout = 0;
    let leavePayoutNet = 0;
    let durationText = "0 Yıl, 0 Ay, 0 Gün";
    let totalDays = 0;
    let totalYears = 0;

    if (startDateVal && endDateVal) {
        const start = new Date(startDateVal);
        const end = new Date(endDateVal);

        if (end < start) {
            alert("Hata: İşten çıkış tarihi, işe giriş tarihinden önce olamaz.");
            return;
        }

        // Gün bazlı kesin süre çıkarma
        const diffTime = Math.abs(end - start);
        totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const years = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        const months = Math.floor(remainingDays / 30);
        const days = remainingDays % 30;
        
        durationText = `${years} Yıl, ${months} Ay, ${days} Gün`;
        totalYears = totalDays / 365;

        // Kıdem Tazminatı (Yasal Tavan ve Damga Kesintisi)
        if (totalYears >= 1) {
            let severityGrossBasis = estimatedGross;
            if (severityGrossBasis > YARGI_KIDEM_TAVANI) {
                severityGrossBasis = YARGI_KIDEM_TAVANI;
            }
            let totalSeverityGross = (severityGrossBasis / 365) * totalDays;
            severityPayout = totalSeverityGross * (1 - 0.00759);
        }

        // İhbar Tazminatı (Aktifse Kademeli Hesaplama ve Vergi Kesintileri)
        if (includeNotice) {
            let noticeWeeks = 2;
            if (totalYears >= 0.5 && totalYears < 1.5) noticeWeeks = 4;
            else if (totalYears >= 1.5 && totalYears < 3) noticeWeeks = 6;
            else if (totalYears >= 3) noticeWeeks = 8;

            const weeklyGross = estimatedGross / 4.33; 
            let totalNoticeGross = weeklyGross * noticeWeeks;
            noticePayout = totalNoticeGross * (1 - (0.15 + 0.00759)); // Gelir + Damga Vergisi
        }
    }

    // Kalan İzin Ücreti Hesaplaması (En son zamlı net maaşın günlük karşılığı üzerinden)
    const dailyNetWage = raisedSalary / 30;
    leavePayoutNet = unusedLeave * dailyNetWage;

    // 4. Toplam Net Havuz (Maaş + Mesai + Kıdem + İhbar + İzin)
    const totalPayout = raisedSalary + overtimePay + severityPayout + noticePayout + leavePayoutNet;

    // 5. Arayüz Çıktılarını Basma Alanı
    document.getElementById('outDuration').innerText = durationText;
    document.getElementById('outGross').innerText = estimatedGross.toFixed(2) + " TL";
    document.getElementById('outSgk').innerText = "-" + sgkWorkerBonus.toFixed(2) + " TL";
    document.getElementById('outUi').innerText = "-" + uiBonus.toFixed(2) + " TL";
    document.getElementById('outPure').innerText = currentSalary.toFixed(2) + " TL";
    document.getElementById('outRaise').innerText = "+" + raiseAmount.toFixed(2) + " TL";
    document.getElementById('outRaisedSalary').innerText = raisedSalary.toFixed(2) + " TL";
    document.getElementById('outHourly').innerText = hourlyWage.toFixed(2) + " TL";
    document.getElementById('outOvertime').innerText = overtimePay.toFixed(2) + " TL";
    document.getElementById('outSeverity').innerText = severityPayout.toFixed(2) + " TL";
    document.getElementById('outNotice').innerText = noticePayout.toFixed(2) + " TL";
    document.getElementById('outLeavePay').innerText = leavePayoutNet.toFixed(2) + " TL";
    document.getElementById('outTotal').innerText = totalPayout.toFixed(2) + " TL";

    // Sağ Rapor Panelini Aktif Et / Göster
    const reportPanel = document.getElementById('reportPanel');
    reportPanel.classList.add('active');
}
