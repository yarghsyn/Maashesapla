function executeCoreEngine() {
    const currentSalary = parseFloat(document.getElementById('currentSalary').value);
    const raiseRate = parseFloat(document.getElementById('raiseRate').value) || 0;
    const overtimeHours = parseFloat(document.getElementById('overtimeHours').value) || 0;
    const overtimeRate = parseFloat(document.getElementById('overtimeRate').value) || 1.5;
    const workYears = parseFloat(document.getElementById('workYears').value) || 0;
    const workMonths = parseFloat(document.getElementById('workMonths').value) || 0;

    if (isNaN(currentSalary) || currentSalary <= 0) {
        alert("Hata: Geçerli bir maaş değeri girilmelidir.");
        return;
    }

    // 1. Brüt Maaş Tahmini & SGK Hesaplamaları
    const estimatedGross = currentSalary * 1.4025; 
    const sgkWorkerBonus = estimatedGross * 0.14; 
    const uiBonus = estimatedGross * 0.01;        

    // 2. Zam ve Mesai Motoru
    const raiseAmount = (currentSalary * raiseRate) / 100;
    const raisedSalary = currentSalary + raiseAmount;
    
    const standardHours = 225;
    const hourlyWage = currentSalary / standardHours;
    const overtimePay = overtimeHours * (hourlyWage * overtimeRate);
    const totalPayout = raisedSalary + overtimePay;

    // 3. Tazminat Hesaplama Algoritması
    const totalYears = workYears + (workMonths / 12);
    let severityPayout = estimatedGross * totalYears;
    severityPayout = severityPayout - (severityPayout * 0.00759); 

    let noticeWeeks = 2;
    if (totalYears >= 0.5 && totalYears < 1.5) noticeWeeks = 4;
    else if (totalYears >= 1.5 && totalYears < 3) noticeWeeks = 6;
    else if (totalYears >= 3) noticeWeeks = 8;

    const weeklyGross = estimatedGross / 4.33; 
    let noticePayout = weeklyGross * noticeWeeks;
    noticePayout = noticePayout - (noticePayout * 0.15) - (noticePayout * 0.00759);

    // 4. Verileri Arayüze Yazma Ekranı
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
    document.getElementById('outTotal').innerText = totalPayout.toFixed(2) + " TL";

    const reportPanel = document.getElementById('reportPanel');
    reportPanel.classList.add('active');
}
