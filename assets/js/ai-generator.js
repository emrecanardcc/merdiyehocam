/**
 * Merdiye Hocam LGS Platformu - AI Soru Uretici Motoru & A4 Sinav Cikti Merkezi
 * 2026 MEB Matematik Mufredati (5, 6, 7 ve 8. Sinif)
 *
 * Kurallar: Axiom Zero Bloat, Kati O(1)/O(n) Algoritma, Icsel Emniyet, SIFIR EMOJI Politikasi.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MH_AI_GENERATOR = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // 1. 2026 MEB Matematik Mufredat Haritasi (5, 6, 7 ve 8. Sinif)
  const MEB_CURRICULUM_2026 = {
    "5": {
      name: "5. Sınıf",
      topics: [
        "Doğal Sayılar & İşlemler",
        "Kesirler",
        "Ondalık Gösterim",
        "Yüzdeler",
        "Temel Geometri",
        "Veri İşleme"
      ]
    },
    "6": {
      name: "6. Sınıf",
      topics: [
        "Doğal Sayılarla İşlemler & Çarpanlar Katlar",
        "Kümeler",
        "Tam Sayılar",
        "Kesirler",
        "Ondalık & Oran",
        "Cebirsel İfadeler",
        "Açılar & Alan Ölçme"
      ]
    },
    "7": {
      name: "7. Sınıf",
      topics: [
        "Tam Sayılarla İşlemler",
        "Rasyonel Sayılar",
        "Cebirsel İfadeler & Eşitlik Denklemler",
        "Oran ve Orantı",
        "Yüzdeler",
        "Doğrular ve Açılar",
        "Çember ve Daire",
        "Veri Analizi"
      ]
    },
    "8": {
      name: "8. Sınıf (LGS)",
      topics: [
        "Çarpanlar ve Katlar (EBOB-EKOK)",
        "Üslü İfadeler",
        "Kareköklü İfadeler",
        "Veri Analizi",
        "Basit Olayların Olma Olasılığı",
        "Cebirsel İfadeler ve Özdeşlikler",
        "Doğrusal Denklemler & Eğim",
        "Eşitsizlikler",
        "Üçgenler & Pisagor Teoremi",
        "Dönüşüm Geometrisi",
        "Geometrik Cisimler"
      ]
    }
  };

  // 2. Yardimci Matematiksel Fonksiyonlar (Axiom Zero Bloat & Intrinsic Safety)
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  }

  function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }

  function simplifyFrac(p, q) {
    if (q === 0) return "0";
    const sign = (p < 0) ^ (q < 0) ? "-" : "";
    const absP = Math.abs(p);
    const absQ = Math.abs(q);
    const g = gcd(absP, absQ);
    const num = absP / g;
    const den = absQ / g;
    if (den === 1) return sign + num;
    return sign + num + "/" + den;
  }

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // Matematiksel zeki celdirici uretici (Asla '(1)' veya 'undefined' uretmez)
  function generateSmartFallbacks(correctStr, seenSet, neededCount) {
    const fallbacks = [];
    const str = String(correctStr).trim();

    // Durum 1: Kesir (Orn: "3/5", "-7/6")
    const fracMatch = str.match(/^([-+]?\d+)\/(\d+)$/);
    if (fracMatch) {
      const p = parseInt(fracMatch[1], 10);
      const q = parseInt(fracMatch[2], 10);
      const candidates = [
        simplifyFrac(p + 1, q),
        simplifyFrac(p - 1 !== 0 ? p - 1 : p + 2, q),
        simplifyFrac(q, p !== 0 ? p : q + 1),
        simplifyFrac(p, q + 1),
        simplifyFrac(p + 2, q),
        simplifyFrac(p, q + 2),
        "1/2", "2/3", "3/4", "1/4", "2/5", "3/5"
      ];
      for (const c of candidates) {
        if (!seenSet.has(c) && !fallbacks.includes(c)) fallbacks.push(c);
        if (fallbacks.length >= neededCount) return fallbacks;
      }
    }

    // Durum 2: Sayi ve birim (Orn: "48 cm²", "12 TL", "70°", "15", "24.750 TL")
    const numMatch = str.match(/^([-+]?\d+(?:[.,]\d+)?)(.*)$/);
    if (numMatch) {
      const rawNum = numMatch[1].replace(",", ".");
      const val = parseFloat(rawNum);
      const unit = numMatch[2] || "";
      if (!isNaN(val)) {
        const step = Math.abs(val) >= 60 ? 10 : Math.abs(val) >= 10 ? 2 : 1;
        const candidates = [
          val + step,
          val - step > 0 ? val - step : val + step * 2,
          val + step * 2,
          val - step * 2 > 0 ? val - step * 2 : val + step * 3,
          val * 2,
          Math.floor(val / 2) || (val + 3),
          val + 1,
          val - 1 > 0 ? val - 1 : val + 4
        ];
        for (const n of candidates) {
          const formatted = (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "")) + unit;
          if (!seenSet.has(formatted) && !fallbacks.includes(formatted)) fallbacks.push(formatted);
          if (fallbacks.length >= neededCount) return fallbacks;
        }
      }
    }

    // Durum 3: Uslu ifade (Orn: "2^11")
    const powMatch = str.match(/^(\d+)\^([-+]?\d+)$/);
    if (powMatch) {
      const b = powMatch[1];
      const e = parseInt(powMatch[2], 10);
      const candidates = [
        `${b}^${e - 1}`,
        `${b}^${e + 1}`,
        `${b}^${e - 2}`,
        `${b}^${e + 2}`,
        `${b * 2}^${e}`
      ];
      for (const c of candidates) {
        if (!seenSet.has(c) && !fallbacks.includes(c)) fallbacks.push(c);
        if (fallbacks.length >= neededCount) return fallbacks;
      }
    }

    // Durum 4: Koordinat (Orn: "(3, -4)")
    const coordMatch = str.match(/^\(([-+]?\d+),\s*([-+]?\d+)\)$/);
    if (coordMatch) {
      const x = coordMatch[1];
      const y = coordMatch[2];
      const candidates = [
        `(${x}, ${-y})`,
        `(${-x}, ${y})`,
        `(${-x}, ${-y})`,
        `(${y}, ${x})`
      ];
      for (const c of candidates) {
        if (!seenSet.has(c) && !fallbacks.includes(c)) fallbacks.push(c);
        if (fallbacks.length >= neededCount) return fallbacks;
      }
    }

    // Durum 5: Genel yedekler
    let salt = 1;
    while (fallbacks.length < neededCount) {
      const fallback = `${str} + ${salt}`;
      if (!seenSet.has(fallback)) fallbacks.push(fallback);
      salt++;
    }

    return fallbacks;
  }

  function buildOptions(correctStr, distractorsArr) {
    const uniqueDistractors = [];
    const correctClean = String(correctStr).trim();
    const seen = new Set([correctClean]);

    for (const d of distractorsArr || []) {
      const str = String(d).trim();
      if (str && !seen.has(str)) {
        seen.add(str);
        uniqueDistractors.push(str);
      }
      if (uniqueDistractors.length >= 3) break;
    }

    if (uniqueDistractors.length < 3) {
      const needed = 3 - uniqueDistractors.length;
      const smart = generateSmartFallbacks(correctClean, seen, needed);
      for (const item of smart) {
        if (!seen.has(item)) {
          seen.add(item);
          uniqueDistractors.push(item);
        }
        if (uniqueDistractors.length >= 3) break;
      }
    }

    const items = [
      { text: correctClean, isCorrect: true },
      { text: uniqueDistractors[0] || "A", isCorrect: false },
      { text: uniqueDistractors[1] || "B", isCorrect: false },
      { text: uniqueDistractors[2] || "C", isCorrect: false }
    ];

    const shuffled = shuffle(items);
    const options = shuffled.map(it => it.text);
    const correctIndex = shuffled.findIndex(it => it.isCorrect);

    return { options, correctIndex };
  }

  // 3. Kapsamli Prosedurel Matematik Soru Sablonlari (32 Konunun Tamami)
  const QUESTION_GENERATORS = {
    // ==========================================
    // 5. SINIF SORU MOTORLARI
    // ==========================================
    "5_Doğal Sayılar & İşlemler": [
      (diff) => {
        const a = randInt(120, 480);
        const b = randInt(15, 45);
        const kalan = randInt(1, b - 1);
        const bolunen = a * b + kalan;
        return {
          question: `Bir bölme işleminde bölen ${b}, bölüm ${a} ve kalan ${kalan} olduğuna göre, bölünen doğal sayı kaçtır?`,
          correctStr: String(bolunen),
          distractors: [String(bolunen - kalan), String(bolunen + kalan), String(a * b)],
          explanation: `Bölme işleminde temel kural: Bölünen = (Bölen × Bölüm) + Kalan bağıntısıdır.\nBölünen = (${b} × ${a}) + ${kalan} = ${a * b} + ${kalan} = ${bolunen} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kalanın daima bölenden küçük olması gerektiğini unutmayın. Bölünen sayıyı bulurken çarpma ve toplamayı adım adım kontrol edin."
        };
      },
      (diff) => {
        const fiyat = randInt(140, 320) * 10;
        const pesinat = Math.floor(fiyat * 0.2);
        const taksitSayisi = randInt(4, 8);
        const kalan = fiyat - pesinat;
        const taksit = Math.floor(kalan / taksitSayisi);
        const netFiyat = pesinat + taksit * taksitSayisi;
        return {
          question: `Kerem, etiket fiyatı ${netFiyat} TL olan bir bisikleti satın almak için ${pesinat} TL peşinat vermiş, kalan borcunu ise ${taksitSayisi} eşit taksitle ödemiştir. Buna göre Kerem'in ödediği aylık bir taksit tutarı kaç TL'dir?`,
          correctStr: `${taksit} TL`,
          distractors: [`${taksit + 25} TL`, `${taksit - 20 > 0 ? taksit - 20 : taksit + 40} TL`, `${Math.floor(netFiyat / taksitSayisi)} TL`],
          explanation: `Peşinat çıkarıldıktan sonra kalan borç: ${netFiyat} - ${pesinat} = ${netFiyat - pesinat} TL.\nAylık taksit tutarı: ${netFiyat - pesinat} ÷ ${taksitSayisi} = ${taksit} TL olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Problem çözerken önce toplam paradan peşinatı düşmeli, kalan miktarı taksit sayısına bölmelisiniz."
        };
      },
      (diff) => {
        const a = randInt(25, 75);
        const b = randInt(12, 35);
        const c = randInt(5, 15);
        const sonuc = (a + b) * c;
        return {
          question: `(${a} + ${b}) × ${c} işleminin sonucu aşağıdakilerden hangisidir?`,
          correctStr: String(sonuc),
          distractors: [String(a + b * c), String((a + b) * (c + 1)), String(sonuc - 20)],
          explanation: `İşlem önceliğine göre önce parantez içi yapılır:\n1) ${a} + ${b} = ${a + b}\n2) ${a + b} × ${c} = ${sonuc} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Parantez daima önceliklidir. Parantezi yapmadan dışarıdaki çarpmayı yaparsanız tuzağa düşersiniz."
        };
      }
    ],

    "5_Kesirler": [
      (diff) => {
        const payda = randInt(7, 12);
        const pay1 = randInt(1, Math.floor(payda / 3));
        const pay2 = randInt(1, Math.floor(payda / 3));
        const kalanPay = payda - (pay1 + pay2);
        const toplamSayfa = payda * randInt(15, 30);
        const kalanSayfa = (toplamSayfa / payda) * kalanPay;
        return {
          question: `Zeynep ${toplamSayfa} sayfalık bir matematik soru kitabının birinci gün ${pay1}/${payda}'ini, ikinci gün ise ${pay2}/${payda}'sini çözmüştür. Buna göre Zeynep'in çözmediği kaç sayfa kalmıştır?`,
          correctStr: `${kalanSayfa}`,
          distractors: [`${kalanSayfa + payda}`, `${kalanSayfa - payda > 0 ? kalanSayfa - payda : kalanSayfa + 14}`, `${(toplamSayfa / payda) * (pay1 + pay2)}`],
          explanation: `Çözülen kesir toplamı: ${pay1}/${payda} + ${pay2}/${payda} = ${pay1 + pay2}/${payda}.\nKalan kesir: ${payda}/${payda} - ${pay1 + pay2}/${payda} = ${kalanPay}/${payda}.\nKalan sayfa sayısı: (${toplamSayfa} ÷ ${payda}) × ${kalanPay} = ${kalanSayfa} sayfadır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Paydaları eşit olan kesirlerde sadece paylar toplanır veya çıkarılır, paydaya dokunulmaz."
        };
      },
      (diff) => {
        const payda = randInt(5, 9);
        const pay = randInt(2, payda - 1);
        const carpan = randInt(6, 14);
        const parca = pay * carpan;
        const butun = payda * carpan;
        return {
          question: `Bir depodaki suyun ${pay}/${payda}'i ${parca} litredir. Buna göre deponun tamamı kaç litre su alır?`,
          correctStr: `${butun} L`,
          distractors: [`${butun - carpan} L`, `${butun + carpan * 2} L`, `${parca + carpan} L`],
          explanation: `Parçadan bütüne giderken miktar paya bölünür, çıkan sonuç payda ile çarpılır:\nBirim parça: ${parca} ÷ ${pay} = ${carpan} litre.\nDeponun tamamı: ${carpan} × ${payda} = ${butun} litredir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Parçası verilen bir çokluğun tamamını bulmak için verilen sayıyı paya bölüp payda ile çarparız."
        };
      }
    ],

    "5_Ondalık Gösterim": [
      (diff) => {
        const tam1 = randInt(15, 45);
        const ondalik1 = randInt(25, 75) / 100;
        const tam2 = randInt(5, 18);
        const ondalik2 = randInt(10, 45) / 100;
        const sayi1 = Number((tam1 + ondalik1).toFixed(2));
        const sayi2 = Number((tam2 + ondalik2).toFixed(2));
        const toplam = Number((sayi1 + sayi2).toFixed(2));
        const para = 100;
        const paraUstu = Number((para - toplam).toFixed(2));
        return {
          question: `Kırtasiyeden ${sayi1.toFixed(2)} TL'ye bir geometri seti ve ${sayi2.toFixed(2)} TL'ye bir pergel alan Elif, kasaya ${para} TL vermiştir. Buna göre Elif kaç TL para üstü alır?`,
          correctStr: `${paraUstu.toFixed(2)} TL`,
          distractors: [`${toplam.toFixed(2)} TL`, `${(paraUstu + 1.20).toFixed(2)} TL`, `${(paraUstu - 1.50 > 0 ? paraUstu - 1.50 : paraUstu + 2.50).toFixed(2)} TL`],
          explanation: `Toplam harcama: ${sayi1.toFixed(2)} + ${sayi2.toFixed(2)} = ${toplam.toFixed(2)} TL.\nPara üstü: ${para},00 - ${toplam.toFixed(2)} = ${paraUstu.toFixed(2)} TL bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Ondalık sayılarda çıkarma yaparken tam sayının sonuna virgül ve sıfırlar eklemeyi (100,00) alışkanlık haline getirin."
        };
      },
      (diff) => {
        const tam = randInt(2, 9);
        const a = randInt(1, 9);
        const b = randInt(0, 9);
        const c = randInt(1, 9);
        const sayiStr = `${tam}.${a}${b}${c}`;
        return {
          question: `${sayiStr} ondalık gösteriminde yüzde birler basamağındaki rakamın basamak değeri kaçtır?`,
          correctStr: `0.0${b}`,
          distractors: [`0.${a}`, `0.00${c}`, `0.${b}`],
          explanation: `Ondalık kısımda basamaklar soldan sağa doğru: Onda birler (${a} -> 0.${a}), Yüzde birler (${b} -> 0.0${b}), Binde birler (${c} -> 0.00${c}) şeklindedir. Dolayısıyla cevap 0.0${b} olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Virgülden sonraki 1. basamak onda birler, 2. basamak yüzde birler, 3. basamak binde birlerdir."
        };
      }
    ],

    "5_Yüzdeler": [
      (diff) => {
        const anaPara = randInt(15, 60) * 10;
        const yuzde = [10, 20, 25, 30, 40][randInt(0, 4)];
        const indirimMiktari = (anaPara * yuzde) / 100;
        const sonFiyat = anaPara - indirimMiktari;
        return {
          question: `Bir mağazada ${anaPara} TL değerindeki mont için sezon sonu sebebiyle %${yuzde} indirim uygulanmıştır. İndirimli satış fiyatı kaç TL olur?`,
          correctStr: `${sonFiyat} TL`,
          distractors: [`${sonFiyat + 25} TL`, `${indirimMiktari} TL`, `${sonFiyat - 30 > 0 ? sonFiyat - 30 : sonFiyat + 50} TL`],
          explanation: `İndirim miktarı = ${anaPara} × (${yuzde} / 100) = ${indirimMiktari} TL.\nİndirimli yeni fiyat = ${anaPara} - ${indirimMiktari} = ${sonFiyat} TL'dir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: %20 indirimin 5'te 1, %25 indirimin ise 4'te 1 olduğunu bilmek zihinden işlem yaparken inanılmaz hız kazandırır."
        };
      },
      (diff) => {
        const toplam = randInt(12, 36) * 10;
        const yuzde = [15, 35, 45, 60][randInt(0, 3)];
        const miktar = (toplam * yuzde) / 100;
        return {
          question: `${toplam} sayfalık bir soru bankasının %${yuzde}'ini çözen Arda, toplam kaç sayfa soru çözmüştür?`,
          correctStr: `${miktar} sayfa`,
          distractors: [`${toplam - miktar} sayfa`, `${miktar + 15} sayfa`, `${miktar - 12 > 0 ? miktar - 12 : miktar + 24} sayfa`],
          explanation: `Sayfa sayısı hesaplama: ${toplam} × (${yuzde} ÷ 100) = ${miktar} sayfa bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Bir sayının yüzdesini bulurken sayıyı 100'e bölüp yüzde oranıyla çarparız veya sadeleştirme uygularız."
        };
      }
    ],

    "5_Temel Geometri": [
      (diff) => {
        const aci1 = randInt(35, 75);
        const aci2 = randInt(40, 80);
        const aci3 = 180 - (aci1 + aci2);
        return {
          question: `Bir ABC üçgeninde m(A) = ${aci1}° ve m(B) = ${aci2}° olduğuna göre, m(C) açısının ölçüsü kaç derecedir?`,
          correctStr: `${aci3}°`,
          distractors: [`${aci3 + 12}°`, `${aci3 - 10 > 0 ? aci3 - 10 : aci3 + 24}°`, `${180 - aci1}°`],
          explanation: `Bir üçgenin iç açıları toplamı daima 180 derecedir.\nm(C) = 180° - (${aci1}° + ${aci2}°) = 180° - ${aci1 + aci2}° = ${aci3}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Üçgende iç açılar toplamı 180°, dörtgenlerde ise 360° kuralını her sınavda aklınızda tutun."
        };
      },
      (diff) => {
        const kisa = randInt(6, 14);
        const uzun = randInt(kisa + 3, kisa + 10);
        const cevre = 2 * (kisa + uzun);
        const alan = kisa * uzun;
        return {
          question: `Kısa kenarı ${kisa} cm ve uzun kenarı ${uzun} cm olan bir dikdörtgenin çevresi kaç santimetredir?`,
          correctStr: `${cevre} cm`,
          distractors: [`${alan} cm`, `${cevre + 6} cm`, `${kisa + uzun} cm`],
          explanation: `Dikdörtgenin Çevresi = 2 × (Kısa Kenar + Uzun Kenar) = 2 × (${kisa} + ${uzun}) = 2 × ${kisa + uzun} = ${cevre} cm'dir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çevre sorularında kenarları sadece toplamak yetmez, her kenardan ikişer adet olduğunu unutmayın."
        };
      }
    ],

    "5_Veri İşleme": [
      (diff) => {
        const gunler = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
        const sayilar = [randInt(15, 30), randInt(20, 35), randInt(18, 40), randInt(25, 45), randInt(10, 30)];
        const toplam = sayilar.reduce((acc, v) => acc + v, 0);
        return {
          question: `Bir okul kütüphanesinde hafta içi günlerde ödünç alınan kitap sayıları sırasıyla: Pazartesi ${sayilar[0]}, Salı ${sayilar[1]}, Çarşamba ${sayilar[2]}, Perşembe ${sayilar[3]} ve Cuma ${sayilar[4]} olarak kaydedilmiştir. Bu hafta kütüphaneden toplam kaç kitap ödünç alınmıştır?`,
          correctStr: `${toplam}`,
          distractors: [`${toplam - 10}`, `${toplam + 12}`, `${toplam + 5}`],
          explanation: `Haftalık toplam ödünç kitap sayısı: ${sayilar[0]} + ${sayilar[1]} + ${sayilar[2]} + ${sayilar[3]} + ${sayilar[4]} = ${toplam} adettir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Veri tablolarında sayıları alt alta toplarken birler basamağını doğru hizalamak dikkatsizlik hatalarını engeller."
        };
      },
      (diff) => {
        const minVal = randInt(12, 22);
        const maxVal = randInt(35, 55);
        const fark = maxVal - minVal;
        return {
          question: `Bir sınıftaki öğrencilerin bir haftada okudukları en fazla sayfa sayısı ${maxVal}, en az sayfa sayısı ise ${minVal} olduğuna göre, bu veri grubunun açıklığı kaçtır?`,
          correctStr: `${fark}`,
          distractors: [`${fark + 5}`, `${maxVal + minVal}`, `${fark - 4 > 0 ? fark - 4 : fark + 8}`],
          explanation: `Açıklık = En Büyük Değer - En Küçük Değer = ${maxVal} - ${minVal} = ${fark} olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Açıklık bir veri grubundaki uç değerlerin farkıdır; en büyük sayıdan en küçük sayıyı çıkararak bulunur."
        };
      }
    ],

    // ==========================================
    // 6. SINIF SORU MOTORLARI
    // ==========================================
    "6_Doğal Sayılarla İşlemler & Çarpanlar Katlar": [
      (diff) => {
        const carp = randInt(2, 5);
        const us = randInt(2, 3);
        const taban = randInt(2, 4);
        const ek = randInt(10, 25);
        const cikar = randInt(2, 8);
        const usDeger = Math.pow(taban, us);
        const sonuc = usDeger + carp * ek - cikar;
        const usSimge = us === 3 ? "³" : "²";
        return {
          question: `Aşağıdaki işlemin sonucu kaçtır?\n${taban}${usSimge} + ${carp} × ${ek} - ${cikar}`,
          correctStr: `${sonuc}`,
          distractors: [`${(usDeger + carp) * ek - cikar}`, `${sonuc + 10}`, `${sonuc - 8 > 0 ? sonuc - 8 : sonuc + 16}`],
          explanation: `İşlem önceliği sırası:\n1) Üslü ifade: ${taban}${usSimge} = ${usDeger}.\n2) Çarpma işlemi: ${carp} × ${ek} = ${carp * ek}.\n3) Toplama ve Çıkarma: ${usDeger} + ${carp * ek} - ${cikar} = ${sonuc} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: İşlem önceliği sırasını 'ÜPÇT' (Üs, Parantez, Çarpma/Bölme, Toplama/Çıkarma) koduyla hatırlayın."
        };
      },
      (diff) => {
        const sayi = [24, 36, 48, 60, 72][randInt(0, 4)];
        const carpanlar = [];
        for (let i = 1; i <= sayi; i++) {
          if (sayi % i === 0) carpanlar.push(i);
        }
        return {
          question: `${sayi} doğal sayısının pozitif tam sayı bölenlerinin (çarpanlarının) sayısı kaçtır?`,
          correctStr: `${carpanlar.length}`,
          distractors: [`${carpanlar.length - 2}`, `${carpanlar.length + 2}`, `${carpanlar.length - 1}`],
          explanation: `${sayi} sayısının bölenleri: ${carpanlar.join(", ")} olmak üzere toplam ${carpanlar.length} adettir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çarpanları ikili çiftler halinde yazarak listelemek hiçbir böleni atlamamanızı sağlar."
        };
      }
    ],

    "6_Kümeler": [
      (diff) => {
        const sA = randInt(8, 14);
        const sB = randInt(6, 12);
        const sKesisim = randInt(2, Math.min(sA, sB) - 2);
        const sBirlesim = sA + sB - sKesisim;
        return {
          question: `A ve B kümeleri için s(A) = ${sA}, s(B) = ${sB} ve s(A ∩ B) = ${sKesisim} olduğuna göre, s(A ∪ B) birleşim kümesinin eleman sayısı kaçtır?`,
          correctStr: `${sBirlesim}`,
          distractors: [`${sA + sB}`, `${sBirlesim - sKesisim}`, `${sBirlesim + 3}`],
          explanation: `Kümelerde birleşim kuralı: s(A ∪ B) = s(A) + s(B) - s(A ∩ B).\ns(A ∪ B) = ${sA} + ${sB} - ${sKesisim} = ${sBirlesim} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kesişim elemanları her iki kümede de sayıldığı için birleşim bulunurken bir defa çıkarılmalıdır."
        };
      },
      (diff) => {
        const ortak = randInt(3, 7);
        const yalnizA = randInt(4, 9);
        const sA = yalnizA + ortak;
        return {
          question: `A ve B kümeleri için s(A) = ${sA} ve s(A ∩ B) = ${ortak} olduğuna göre, sadece A kümesinde olup B kümesinde olmayan eleman sayısı s(A \\ B) kaçtır?`,
          correctStr: `${yalnizA}`,
          distractors: [`${sA + ortak}`, `${yalnizA + 2}`, `${yalnizA - 2 > 0 ? yalnizA - 2 : yalnizA + 4}`],
          explanation: `s(A \\ B) = s(A) - s(A ∩ B) = ${sA} - ${ortak} = ${yalnizA} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: 'Sadece A' demek, A kümesinin tamamından ortak olan kesişim elemanlarını çıkarmak demektir."
        };
      }
    ],

    "6_Tam Sayılar": [
      (diff) => {
        const a = -randInt(5, 18);
        const b = randInt(2, 12);
        const mutlakA = Math.abs(a);
        const fark = mutlakA - b;
        return {
          question: `Sayı doğrusunda |${a}| - (+${b}) işleminin sonucu kaçtır?`,
          correctStr: `${fark}`,
          distractors: [`${a - b}`, `${fark + 4}`, `${mutlakA + b}`],
          explanation: `Mutlak değer daima pozitif veya sıfırdır: |${a}| = ${mutlakA}.\nİşlem: ${mutlakA} - ${b} = ${fark} olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Mutlak değer bir sayının sıfıra olan uzaklığıdır; uzaklık negatif olamayacağından dışarı pozitif çıkar."
        };
      },
      (diff) => {
        const sayilar = [-randInt(12, 25), -randInt(3, 10), 0, randInt(4, 15)];
        const minVal = Math.min(...sayilar);
        return {
          question: `Aşağıdaki tam sayılardan hangisi sayı doğrusunda en solda yer alır (en küçüktür)?\n${sayilar.join(", ")}`,
          correctStr: `${minVal}`,
          distractors: sayilar.filter(x => x !== minVal).map(String),
          explanation: `Negatif tam sayılarda sıfırdan uzaklaştıkça sayı küçülür. Sayı doğrusunda en soldaki sayı en küçük sayıdır: ${minVal}.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Negatif sayılarda mutlak değeri büyük olan sayı daha küçüktür (-20, -5'ten küçüktür)."
        };
      }
    ],

    "6_Kesirler": [
      (diff) => {
        const p1 = randInt(1, 4);
        const q1 = randInt(p1 + 1, 6);
        const p2 = randInt(1, 4);
        const q2 = randInt(p2 + 1, 6);
        const carpimP = p1 * p2;
        const carpimQ = q1 * q2;
        const sad = simplifyFrac(carpimP, carpimQ);
        return {
          question: `(${p1}/${q1}) × (${p2}/${q2}) çarpma işleminin en sade hali hangisidir?`,
          correctStr: sad,
          distractors: [
            simplifyFrac(p1 + p2, q1 + q2),
            simplifyFrac(carpimP + 1, carpimQ),
            simplifyFrac(carpimP, carpimQ + 2)
          ],
          explanation: `Kesirlerle çarpma işleminde paylar birbiriyle, paydalar birbiriyle çarpılır:\n(${p1} × ${p2}) / (${q1} × ${q2}) = ${carpimP}/${carpimQ}.\nEn sade hali: ${sad} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çarpmadan önce çapraz sadeleştirme yaparsanız büyük sayılarla vakit kaybetmezsiniz."
        };
      },
      (diff) => {
        const a = randInt(1, 3);
        const b = randInt(a + 1, 5);
        const c = randInt(1, 3);
        const d = randInt(c + 1, 5);
        const sonuc = simplifyFrac(a * d, b * c);
        return {
          question: `(${a}/${b}) ÷ (${c}/${d}) bölme işleminin sonucu kaçtır?`,
          correctStr: sonuc,
          distractors: [
            simplifyFrac(a * c, b * d),
            simplifyFrac(a * d + 1, b * c),
            simplifyFrac(b * c, a * d)
          ],
          explanation: `Kesirlerle bölme işleminde birinci kesir aynen kalır, ikinci kesir ters çevrilip çarpılır:\n(${a}/${b}) × (${d}/${c}) = (${a} × ${d}) / (${b} × ${c}) = ${sonuc} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Bölmeyi çarpmaya çevirirken sadece ikinci kesri ters çevirin, birinciye dokunmayın."
        };
      }
    ],

    "6_Ondalık & Oran": [
      (diff) => {
        const kiz = randInt(12, 18);
        const erkek = randInt(10, 16);
        const toplam = kiz + erkek;
        const dogruOran = simplifyFrac(kiz, toplam);
        return {
          question: `Bir sınıfta ${kiz} kız ve ${erkek} erkek öğrenci bulunmaktadır. Buna göre sınıftaki kız öğrenci sayısının tüm sınıf mevcuduna oranı kaçtır?`,
          correctStr: dogruOran,
          distractors: [
            simplifyFrac(kiz, erkek),
            simplifyFrac(erkek, toplam),
            simplifyFrac(kiz + 1, toplam)
          ],
          explanation: `Tüm sınıf mevcudu = ${kiz} + ${erkek} = ${toplam}.\nKızların tüm sınıfa oranı = ${kiz} / ${toplam}.\nEn sade biçimi = ${dogruOran} olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Oran sorularında pay ve paydaya hangi çokluğun yazıldığına çok dikkat edin; sadeleştirmeyi asla unutmayın."
        };
      },
      (diff) => {
        const yol = randInt(18, 36) * 10;
        const saat = randInt(2, 5);
        const hiz = Math.floor(yol / saat);
        const netYol = hiz * saat;
        return {
          question: `Bir otomobil ${saat} saatte ${netYol} km yol almıştır. Bu otomobilin aldığı yolun geçen süreye oranı kaç km/sa'tir?`,
          correctStr: `${hiz} km/sa`,
          distractors: [`${hiz + 15} km/sa`, `${hiz - 10 > 0 ? hiz - 10 : hiz + 25} km/sa`, `${Math.floor(netYol / (saat + 1))} km/sa`],
          explanation: `Birimli oran hesaplama:\nOran = Alınan Yol ÷ Geçen Zaman = ${netYol} km ÷ ${saat} sa = ${hiz} km/sa bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Farklı birimlerin birbirine bölünmesiyle oluşan orana birimli oran denir (km/sa gibi)."
        };
      }
    ],

    "6_Cebirsel İfadeler": [
      (diff) => {
        const katsayi = randInt(3, 7);
        const sabit = randInt(4, 12);
        const xDeger = randInt(3, 6);
        const sonuc = katsayi * xDeger + sabit;
        return {
          question: `${katsayi}x + ${sabit} cebirsel ifadesinin x = ${xDeger} için alacağı değer kaçtır?`,
          correctStr: `${sonuc}`,
          distractors: [`${sonuc + katsayi}`, `${sonuc - sabit}`, `${katsayi * xDeger}`],
          explanation: `x yerine ${xDeger} değeri yazılır:\n${katsayi} × ${xDeger} + ${sabit} = ${katsayi * xDeger} + ${sabit} = ${sonuc} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Değişkenin yerine sayı yazarken çarpma işaretini araya koymayı unutmayın (3x demek 3 çarpı x demektir)."
        };
      },
      (diff) => {
        const kat = randInt(2, 5);
        const eksi = randInt(3, 9);
        return {
          question: `"Bir sayının ${kat} katının ${eksi} eksiği" sözel ifadesine karşılık gelen cebirsel ifade hangisidir?`,
          correctStr: `${kat}x - ${eksi}`,
          distractors: [`${kat}(x - ${eksi})`, `${kat}x + ${eksi}`, `x / ${kat} - ${eksi}`],
          explanation: `Bilinmeyen sayı x olsun.\nBu sayının ${kat} katı: ${kat}x\n${eksi} eksiği: ${kat}x - ${eksi} olarak yazılır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: 'Katının eksiği' denildiğinde parantez gerekmez (kx - m). 'Eksiğinin katı' denseydi parantez gerekirdi: k(x - m)."
        };
      }
    ],

    "6_Açılar & Alan Ölçme": [
      (diff) => {
        const taban = randInt(8, 16);
        const yukseklik = randInt(6, 12);
        const alan = (taban * yukseklik) / 2;
        return {
          question: `Taban uzunluğu ${taban} cm ve bu tabana ait yüksekliği ${yukseklik} cm olan bir üçgenin alanı kaç santimetrekaredir?`,
          correctStr: `${alan} cm²`,
          distractors: [`${taban * yukseklik} cm²`, `${alan + taban} cm²`, `${alan - 6 > 0 ? alan - 6 : alan + 18} cm²`],
          explanation: `Üçgenin alanı = (Taban × Yükseklik) ÷ 2 formülü ile hesaplanır.\nAlan = (${taban} × ${yukseklik}) ÷ 2 = ${taban * yukseklik} ÷ 2 = ${alan} cm² bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Üçgen alanında 2'ye bölmeyi sakın unutmayın; dikdörtgen ve paralelkenarda 2'ye bölünmez, üçgende bölünür!"
        };
      },
      (diff) => {
        const aci = randInt(25, 75);
        const tumler = 90 - aci;
        return {
          question: `Ölçüsü ${aci}° olan bir açının tümleri kaç derecedir?`,
          correctStr: `${tumler}°`,
          distractors: [`${180 - aci}°`, `${tumler + 10}°`, `${tumler - 10 > 0 ? tumler - 10 : tumler + 20}°`],
          explanation: `Tümler açıların ölçüleri toplamı 90 derecedir.\nTümler = 90° - ${aci}° = ${tumler}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Tümler açılar toplamı 90°, bütünler açılar toplamı 180°'dir. Birbirine karıştırmayın."
        };
      }
    ],

    // ==========================================
    // 7. SINIF SORU MOTORLARI
    // ==========================================
    "7_Tam Sayılarla İşlemler": [
      (diff) => {
        const a = -randInt(3, 8);
        const b = randInt(2, 6);
        const c = -randInt(4, 10);
        const carpim = a * b;
        const sonuc = carpim - c;
        return {
          question: `(${a}) × (+${b}) - (${c}) işleminin sonucu kaçtır?`,
          correctStr: `${sonuc}`,
          distractors: [`${carpim + c}`, `${-sonuc}`, `${sonuc + 6}`],
          explanation: `1) Çarpma işlemi: (${a}) × (+${b}) = ${carpim}.\n2) Çıkarma işlemi: ${carpim} - (${c}) = ${carpim} + ${-c} = ${sonuc} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: İki eksi yan yana geldiğinde (-(-c)) artıya dönüşür. İşaret hataları 7. sınıfın en büyük puan tuzağıdır."
        };
      },
      (diff) => {
        const taban = -randInt(2, 4);
        const usCift = 2;
        const usTek = 3;
        const valCift = Math.pow(taban, usCift);
        const valTek = Math.pow(taban, usTek);
        const fark = valCift - valTek;
        return {
          question: `(${taban})² - (${taban})³ işleminin sonucu kaçtır?`,
          correctStr: `${fark}`,
          distractors: [`${valCift + valTek}`, `${-fark}`, `${fark - 8}`],
          explanation: `Negatif sayıların çift kuvveti pozitif, tek kuvveti negatiftir:\n(${taban})² = ${valCift}\n(${taban})³ = ${valTek}\nİşlem: ${valCift} - (${valTek}) = ${valCift} + ${-valTek} = ${fark} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Parantez içindeki negatif sayının çift kuvveti pozitiftir; parantez yoksa işaret değişmez."
        };
      }
    ],

    "7_Rasyonel Sayılar": [
      (diff) => {
        const p1 = randInt(1, 3);
        const q1 = [2, 3, 4, 5][randInt(0, 3)];
        const p2 = randInt(1, 3);
        const q2List = [2, 3, 4, 5, 6].filter(x => x !== q1);
        const q2 = q2List[randInt(0, q2List.length - 1)];
        const pay = p1 * q2 + p2 * q1;
        const payda = q1 * q2;
        const sonuc = simplifyFrac(pay, payda);
        return {
          question: `(${p1}/${q1}) + (${p2}/${q2}) işleminin sonucu kaçtır?`,
          correctStr: sonuc,
          distractors: [
            simplifyFrac(p1 + p2, q1 + q2),
            simplifyFrac(Math.abs(p1 * q2 - p2 * q1), payda),
            simplifyFrac(pay + 1, payda)
          ],
          explanation: `Paydalar eşitlenir (${q1 * q2}'de):\n(${p1} × ${q2}) / (${q1} × ${q2}) + (${p2} × ${q1}) / (${q2} × ${q1}) = ${p1 * q2}/${payda} + ${p2 * q1}/${payda} = ${pay}/${payda} = ${sonuc} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Rasyonel sayılarda toplama ve çıkarma yaparken paydaları eşitlemeden asla işlem yapmayın."
        };
      },
      (diff) => {
        const tam = randInt(1, 3);
        const pay = randInt(1, 3);
        const payda = randInt(pay + 1, 5);
        const bilesikPay = tam * payda + pay;
        return {
          question: `${tam} tam ${pay}/${payda} tam sayılı kesrinin bileşik kesir hali aşağıdakilerden hangisidir?`,
          correctStr: `${bilesikPay}/${payda}`,
          distractors: [`${tam * pay}/${payda}`, `${bilesikPay + 1}/${payda}`, `${bilesikPay - 1}/${payda}`],
          explanation: `Tam sayılı kesri bileşiğe çevirme formülü: (Tam Kısım × Payda + Pay) ÷ Payda = (${tam} × ${payda} + ${pay}) ÷ ${payda} = ${bilesikPay}/${payda} olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çarp sonra topla kuralı ile tam sayılı kesirleri kolayca bileşik kesre çevirebilirsiniz."
        };
      }
    ],

    "7_Cebirsel İfadeler & Eşitlik Denklemler": [
      (diff) => {
        const x = randInt(3, 9);
        const katsayi = randInt(2, 5);
        const sabit = randInt(4, 15);
        const sag = katsayi * x + sabit;
        return {
          question: `${katsayi}x + ${sabit} = ${sag} olduğuna göre, x bilinmeyeni kaçtır?`,
          correctStr: `${x}`,
          distractors: [`${x + 2}`, `${x - 1 > 0 ? x - 1 : x + 3}`, `${x + 1}`],
          explanation: `Adım 1: Sabit terimi karşıya eksi olarak atarız: ${katsayi}x = ${sag} - ${sabit} => ${katsayi}x = ${sag - sabit}.\nAdım 2: Her iki tarafı ${katsayi}'e böleriz: x = ${sag - sabit} ÷ ${katsayi} = ${x} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Eşitliğin diğer tarafına geçen terimin işareti daima değişir (+ ise -, - ise + olur)."
        };
      },
      (diff) => {
        const x = randInt(2, 6);
        const dagit = randInt(2, 4);
        const icSabit = randInt(1, 5);
        const sag = dagit * (x + icSabit);
        return {
          question: `${dagit}(x + ${icSabit}) = ${sag} denkleminde x kaçtır?`,
          correctStr: `${x}`,
          distractors: [`${x + 3}`, `${x - 1 > 0 ? x - 1 : x + 2}`, `${sag / dagit}`],
          explanation: `1. Yol: Her iki tarafı ${dagit}'e böleriz: x + ${icSabit} = ${sag / dagit} => x = ${sag / dagit} - ${icSabit} = ${x} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Parantezin dışındaki katsayı sağdaki sayıya tam bölünüyorsa önce bölme yapmak işlemi çok kısaltır."
        };
      }
    ],

    "7_Oran ve Orantı": [
      (diff) => {
        const usta = randInt(3, 6);
        const gun = 2 * randInt(6, 12);
        const yeniUsta = usta * 2;
        const yeniGun = Math.floor(gun / 2);
        return {
          question: `Bir inşaat işini aynı güçteki ${usta} usta ${gun} günde bitirebilmektedir. Usta sayısı ${yeniUsta}'ye çıkarılırsa aynı iş kaç günde biter?`,
          correctStr: `${yeniGun} gün`,
          distractors: [`${gun * 2} gün`, `${gun + 2} gün`, `${yeniGun + 3} gün`],
          explanation: `İşçi ve usta problemleri TERS ORANTI kuralına tabidir.\nUsta sayısı × Gün sayısı = Sabit iş miktarı.\n${usta} × ${gun} = ${yeniUsta} × x => x = (${usta * gun}) / ${yeniUsta} = ${yeniGun} gün bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Usta sayısı artarsa iş daha kısa sürede biter! Ters orantıda karşılıklı çarpımlar birbirine eşittir."
        };
      },
      (diff) => {
        const kg1 = randInt(2, 4);
        const fiyat1 = kg1 * randInt(15, 30);
        const birimFiyat = fiyat1 / kg1;
        const kg2 = randInt(5, 9);
        const fiyat2 = kg2 * birimFiyat;
        return {
          question: `${kg1} kg elmanın fiyatı ${fiyat1} TL olduğuna göre, aynı elmadan ${kg2} kg alan bir kişi kaç TL öder?`,
          correctStr: `${fiyat2} TL`,
          distractors: [`${fiyat2 + birimFiyat} TL`, `${fiyat2 - birimFiyat} TL`, `${fiyat1 * 2} TL`],
          explanation: `Doğru orantı kuralı:\n1 kg elma = ${fiyat1} ÷ ${kg1} = ${birimFiyat} TL.\n${kg2} kg elma = ${kg2} × ${birimFiyat} = ${fiyat2} TL bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Alınan miktar arttıkça ödenecek para da artar. Doğru orantıda içler-dışlar çarpımı yapılır."
        };
      }
    ],

    "7_Yüzdeler": [
      (diff) => {
        const maas = randInt(15, 35) * 1000;
        const zam = [10, 15, 20, 25][randInt(0, 3)];
        const artis = (maas * zam) / 100;
        const yeniMaas = maas + artis;
        return {
          question: `${maas} TL maaş alan bir çalışanın maaşına %${zam} zam yapılmıştır. Zam sonrası yeni maaş kaç TL olur?`,
          correctStr: `${yeniMaas} TL`,
          distractors: [`${maas + Math.floor(artis / 2)} TL`, `${artis} TL`, `${yeniMaas + 1000} TL`],
          explanation: `Zam tutarı = ${maas} × (${zam}/100) = ${artis} TL.\nYeni Maaş = ${maas} + ${artis} = ${yeniMaas} TL olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Zam yapıldığında başlangıç fiyatına ekleme, indirim yapıldığında çıkarma yapılır."
        };
      },
      (diff) => {
        const maliyet = randInt(10, 40) * 10;
        const karOrani = [20, 30, 40, 50][randInt(0, 3)];
        const kar = (maliyet * karOrani) / 100;
        const satis = maliyet + kar;
        return {
          question: `Maliyeti ${maliyet} TL olan bir ürün %${karOrani} kâr ile satılmaktadır. Bu ürünün kârlı satış fiyatı kaç TL'dir?`,
          correctStr: `${satis} TL`,
          distractors: [`${kar} TL`, `${satis + 15} TL`, `${satis - 20 > 0 ? satis - 20 : satis + 35} TL`],
          explanation: `Kâr miktarı = ${maliyet} × (%${karOrani}) = ${kar} TL.\nSatış Fiyatı = Maliyet + Kâr = ${maliyet} + ${kar} = ${satis} TL olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kâr maliyetin üzerine eklenir; zarar ise maliyetten düşülür."
        };
      }
    ],

    "7_Doğrular ve Açılar": [
      (diff) => {
        const darAci = randInt(35, 75);
        const karsiAci = 180 - darAci;
        return {
          question: `Paralel iki doğruyu kesen bir doğrunun oluşturduğu karşıt durumlu (U kuralı) iki açıdan biri ${darAci}° olduğuna göre, diğer açının ölçüsü kaç derecedir?`,
          correctStr: `${karsiAci}°`,
          distractors: [`${darAci}°`, `${90 - darAci}°`, `${karsiAci - 12 > 0 ? karsiAci - 12 : karsiAci + 16}°`],
          explanation: `U kuralında (karşıt durumlu açılar) paralel doğrular arasındaki iç açılar toplamı 180 derecedir.\nİkinci açı = 180° - ${darAci}° = ${karsiAci}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: U kuralında toplam 180°, Z kuralında açılar birbirine eşit, M kuralında sola bakanlar sağa bakanlara eşittir."
        };
      },
      (diff) => {
        const sol1 = randInt(25, 50);
        const sol2 = randInt(30, 55);
        const sag = sol1 + sol2;
        return {
          question: `Paralel iki doğru arasında oluşan bir M kuralında sola bakan açılar ${sol1}° ve ${sol2}° olduğuna göre, bu iki açının arasında yer alıp sağa bakan açının ölçüsü kaç derecedir?`,
          correctStr: `${sag}°`,
          distractors: [`${180 - sag}°`, `${sag - 15}°`, `${sag + 10}°`],
          explanation: `M kuralı (Zikzak kuralı): Sağa bakan açıların toplamı, sola bakan açıların toplamına eşittir.\nAçı = ${sol1}° + ${sol2}° = ${sag}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: M kuralında sivri ucun baktığı yönün tersindeki iki açıyı toplamak doğrudan sonucu verir."
        };
      }
    ],

    "7_Çember ve Daire": [
      (diff) => {
        const r = randInt(4, 12);
        const pi = 3;
        const cevre = 2 * pi * r;
        const alan = pi * r * r;
        return {
          question: `Yarıçapı r = ${r} cm olan bir dairenin alanı kaç santimetrekaredir? (π = 3 alınız.)`,
          correctStr: `${alan} cm²`,
          distractors: [`${cevre} cm²`, `${alan + 12} cm²`, `${alan - 18 > 0 ? alan - 18 : alan + 30} cm²`],
          explanation: `Dairenin Alan Formülü = π × r² dir.\nAlan = 3 × ${r}² = 3 × ${r * r} = ${alan} cm² bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çevre formülü 2πr, Alan formülü πr²'dir. Soru kökünde 'çevre' mi yoksa 'alan' mı sorulduğuna dikkat edin."
        };
      },
      (diff) => {
        const r = randInt(5, 15);
        const pi = 3;
        const cevre = 2 * pi * r;
        return {
          question: `Yarıçapı r = ${r} cm olan bir çemberin çevre uzunluğu kaç santimetredir? (π = 3 alınız.)`,
          correctStr: `${cevre} cm`,
          distractors: [`${pi * r * r} cm`, `${cevre + 6} cm`, `${cevre - 6 > 0 ? cevre - 6 : cevre + 12} cm`],
          explanation: `Çemberin Çevresi = 2 × π × r = 2 × 3 × ${r} = ${cevre} cm olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çember içi boş bir tel gibidir sadece çevresi vardır; daire ise levha gibidir alanı vardır."
        };
      }
    ],

    "7_Veri Analizi": [
      (diff) => {
        const hedefOrt = randInt(70, 88);
        const d1 = randInt(-8, -2);
        const d2 = randInt(3, 8);
        const d3 = randInt(-5, -1);
        const d4 = randInt(2, 6);
        const d5 = -(d1 + d2 + d3 + d4);
        const notlar = [hedefOrt + d1, hedefOrt + d2, hedefOrt + d3, hedefOrt + d4, hedefOrt + d5];
        const toplam = notlar.reduce((a, b) => a + b, 0);
        return {
          question: `Bir öğrencinin 5 deneme sınavından aldığı matematik notları sırasıyla: ${notlar.join(", ")} olarak kaydedilmiştir. Bu öğrencinin not ortalaması kaçtır?`,
          correctStr: `${hedefOrt}`,
          distractors: [`${hedefOrt + 2}`, `${hedefOrt - 3}`, `${hedefOrt + 5}`],
          explanation: `Aritmetik Ortalama = Verilerin Toplamı ÷ Veri Sayısı.\nToplam = ${notlar.join(" + ")} = ${toplam}.\nOrtalama = ${toplam} ÷ 5 = ${hedefOrt} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Aritmetik ortalama, medyan (ortanca) ve mod (en çok tekrar eden) kavramlarını birbiriyle karıştırmayın."
        };
      },
      (diff) => {
        const sayilar = [12, 15, 18, 18, 20, 24, 28];
        return {
          question: `12, 15, 18, 18, 20, 24, 28 veri grubunun tepe değeri (modu) ile medyanı (ortancası) sırasıyla hangisidir?`,
          correctStr: `18 ve 18`,
          distractors: [`18 ve 20`, `20 ve 18`, `15 ve 18`],
          explanation: `En çok tekrar eden değer Mod = 18'dir.\nKüçükten büyüğe sıralandığında tam ortadaki değer Medyan = 18'dir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Medyan bulurken verilerin mutlaka küçükten büyüğe sıralanmış olması şarttır."
        };
      }
    ],

    // ==========================================
    // 8. SINIF (LGS) SORU MOTORLARI
    // ==========================================
    "8_Çarpanlar ve Katlar (EBOB-EKOK)": [
      (diff) => {
        const ebob = randInt(4, 12);
        const a = ebob * randInt(2, 5);
        const b = ebob * randInt(6, 9);
        const cevre = 2 * (a + b);
        const fidan = cevre / ebob;
        return {
          question: `Kenar uzunlukları ${a} metre ve ${b} metre olan dikdörtgen şeklindeki bir bahçenin etrafına, köşelere de birer tane dikilmek şartıyla eşit aralıklarla fidan dikilecektir. Bu iş için EN AZ kaç fidan gereklidir?`,
          correctStr: `${fidan} adet`,
          distractors: [`${fidan - 2} adet`, `${fidan + 4} adet`, `${Math.floor(cevre / (ebob / 2))} adet`],
          explanation: `Fidan sayısının en az olması için aralığın en büyük olması gerekir: EBOB(${a}, ${b}) = ${ebob} metre.\nBahçenin çevresi = 2 × (${a} + ${b}) = ${cevre} metre.\nEn az fidan sayısı = Çevre ÷ EBOB = ${cevre} ÷ ${ebob} = ${fidan} adettir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: 'Eşit aralıklarla' ve 'en az' anahtar kelimeleri doğrudan EBOB problemidir. Köşeleri unutmayın!"
        };
      },
      (diff) => {
        const x = randInt(6, 12);
        const y = randInt(15, 20);
        const ortakKat = lcm(x, y);
        const saatArtis = Math.floor(ortakKat / 60);
        const dkArtis = ortakKat % 60;
        const saatStr = `${String(8 + saatArtis).padStart(2, "0")}.${String(dkArtis).padStart(2, "0")}`;
        return {
          question: `İki farklı otobüsten biri ${x} dakikada bir, diğeri ise ${y} dakikada bir sefere çıkmaktadır. Saat 08.00'de birlikte sefere çıkan bu iki otobüs, EN ERKEN saat kaçta tekrar birlikte sefere çıkarlar?`,
          correctStr: saatStr,
          distractors: [
            `${String(8 + Math.floor((ortakKat + 15) / 60)).padStart(2, "0")}.${String((ortakKat + 15) % 60).padStart(2, "0")}`,
            "09.00",
            "09.30"
          ],
          explanation: `Birlikte hareket etme periyodu EKOK(${x}, ${y}) ile bulunur.\nEKOK(${x}, ${y}) = ${ortakKat} dakikadır (${saatArtis} saat ${dkArtis} dakika).\n08.00 + ${saatArtis} sa ${dkArtis} dk = ${saatStr} olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Sefer saatleri, nöbetler ve zil soruları klasik EKOK kurgusudur. Çıkan dakikayı saate çevirmeyi unutmayın."
        };
      },
      (diff) => {
        const a = randInt(2, 4);
        const b = randInt(2, 3);
        const sayi1 = Math.pow(2, a) * Math.pow(3, b);
        const sayi2 = Math.pow(2, a - 1) * Math.pow(3, b + 1);
        const ebobVal = Math.pow(2, a - 1) * Math.pow(3, b);
        return {
          question: `A = 2^${a} × 3^${b} ve B = 2^${a - 1} × 3^${b + 1} olduğuna göre, EBOB(A, B) değeri kaçtır?`,
          correctStr: `${ebobVal}`,
          distractors: [`${ebobVal * 2}`, `${ebobVal * 3}`, `${Math.pow(2, a) * Math.pow(3, b + 1)}`],
          explanation: `Asal çarpanlarına ayrılmış sayılarda EBOB: Ortak asal çarpanlardan üssü KÜÇÜK olanların çarpımıdır.\nEBOB(A, B) = 2^${a - 1} × 3^${b} = ${ebobVal} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: EBOB için ortak tabanların küçük üssü, EKOK için ise ortakların büyük üssü ve ortak olmayanlar alınır."
        };
      }
    ],

    "8_Üslü İfadeler": [
      (diff) => {
        const saat = randInt(4, 7);
        const baslangicUs = randInt(3, 6);
        const sonucUs = baslangicUs + saat * 2;
        return {
          question: `Bir biyoloji laboratuvarında bulunan bir bakteri türü her saatin sonunda 4 katına çıkmaktadır. Başlangıçta 2^${baslangicUs} adet bakteri bulunan bir deney tüpünde ${saat} saatin sonunda toplam kaç bakteri bulunur?`,
          correctStr: `2^${sonucUs}`,
          distractors: [`2^${sonucUs - 2}`, `2^${sonucUs + 1}`, `4^${saat}`],
          explanation: `Her saat 4 katına çıkmak demek 2² ile çarpmak demektir.\n${saat} saatte: 2^${baslangicUs} × (2²)^${saat} = 2^${baslangicUs} × 2^${saat * 2} = 2^(${baslangicUs} + ${saat * 2}) = 2^${sonucUs} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Tabanlar eşit olduğunda çarpma işleminde üsler toplanır. 4'ü hemen 2² tabanına dönüştürün."
        };
      },
      (diff) => {
        const us1 = randInt(12, 20);
        const us2 = randInt(5, 10);
        const netUs = us1 - us2;
        return {
          question: `(5^${us1}) ÷ (5^${us2}) işleminin sonucu aşağıdakilerden hangisidir?`,
          correctStr: `5^${netUs}`,
          distractors: [`5^${us1 + us2}`, `1^${netUs}`, `5^${Math.floor(us1 / us2)}`],
          explanation: `Tabanları aynı olan üslü ifadelerde bölme işlemi yapılırken payın üssünden paydanın üssü çıkarılır:\n5^(${us1} - ${us2}) = 5^${netUs} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Üslü sayılarda bölme yaparken üsleri sakın bölmeyin, üsleri birbirinden çıkarın!"
        };
      }
    ],

    "8_Kareköklü İfadeler": [
      (diff) => {
        const tam = randInt(5, 11);
        const kucukKare = tam * tam;
        const buyukKare = (tam + 1) * (tam + 1);
        const sayi = randInt(kucukKare + 2, buyukKare - 2);
        return {
          question: `Alanı ${sayi} cm² olan bir karenin bir kenar uzunluğu hangi iki ardışık tam sayı arasındadır?`,
          correctStr: `${tam} ile ${tam + 1}`,
          distractors: [`${tam - 1} ile ${tam}`, `${tam + 1} ile ${tam + 2}`, `${tam - 2} ile ${tam - 1}`],
          explanation: `Karenin bir kenarı √${sayi} cm'dir.\n${kucukKare} < ${sayi} < ${buyukKare} eşitsizliğinde kök alırsak:\n√${kucukKare} < √${sayi} < √${buyukKare} => ${tam} < √${sayi} < ${tam + 1} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Karekök tahminlerinde verilen sayının hangi tam kare sayılara komşu olduğunu bilmek soruyu saniyeler içinde çözdürür."
        };
      },
      (diff) => {
        const a = randInt(2, 5);
        const b = [2, 3, 5, 7][randInt(0, 3)];
        const icSayi = a * a * b;
        return {
          question: `√${icSayi} kareköklü ifadesinin a√b biçimindeki eşiti aşağıdakilerden hangisidir?`,
          correctStr: `${a}√${b}`,
          distractors: [`${b}√${a}`, `${a * 2}√${b}`, `${a}√${b * 2}`],
          explanation: `√${icSayi} = √(${a * a} × ${b}) = √(${a}²) × √${b} = ${a}√${b} olarak dışarı çıkar.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kök içindeki sayıyı bir tam kare ile bir sayının çarpımı şeklinde yazarak tam kareyi dışarı fırlatın."
        };
      }
    ],

    "8_Veri Analizi": [
      (diff) => {
        const toplamOgrenci = 360;
        const aciMat = randInt(90, 150);
        const matSayisi = (toplamOgrenci * aciMat) / 360;
        return {
          question: `360 öğrencinin katıldığı bir ankette en sevilen dersler daire grafiğiyle gösterilmiştir. Matematik dersini gösteren daire diliminin merkez açısı ${aciMat}° olduğuna göre, matematiği seçen öğrenci sayısı kaçtır?`,
          correctStr: `${matSayisi} öğrenci`,
          distractors: [`${matSayisi - 15} öğrenci`, `${matSayisi + 20} öğrenci`, `${Math.floor(aciMat / 2)} öğrenci`],
          explanation: `Daire grafiğinin tamamı 360 derecedir.\n360°'ye 360 öğrenci düşüyorsa, her 1° tam olarak 1 öğrenciye karşılık gelir.\nDolayısıyla ${aciMat}° merkez açı = ${matSayisi} öğrenci demektir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Daire grafiğinde merkez açılar toplamı daima 360°'dir. Doğru orantı kurarak kolayca sonuca gidin."
        };
      },
      (diff) => {
        const yuzde = [25, 50, 20, 10][randInt(0, 3)];
        const aci = (360 * yuzde) / 100;
        return {
          question: `Bir bütçede eğitime ayrılan pay %${yuzde} olarak belirlenmiştir. Bu veri daire grafiğinde gösterildiğinde eğitime ait dilimin merkez açısı kaç derece olur?`,
          correctStr: `${aci}°`,
          distractors: [`${aci + 15}°`, `${aci - 20 > 0 ? aci - 20 : aci + 30}°`, `${yuzde * 2}°`],
          explanation: `Yüzdeden açıya geçiş:\n%100 -> 360° ise\n%${yuzde} -> x°\nx = (360 × ${yuzde}) / 100 = ${aci}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: %25 çeyrek dairedir (90°), %50 yarım dairedir (180°)."
        };
      }
    ],

    "8_Basit Olayların Olma Olasılığı": [
      (diff) => {
        const mavi = randInt(4, 8);
        const sari = randInt(5, 10);
        const kirmizi = randInt(3, 7);
        const toplam = mavi + sari + kirmizi;
        const gMavi = gcd(mavi, toplam);
        const gSari = gcd(sari, toplam);
        const gKirmizi = gcd(kirmizi, toplam);
        const dogru = `${mavi / gMavi}/${toplam / gMavi}`;
        return {
          question: `Bir torbada aynı büyüklükte ${mavi} mavi, ${sari} sarı ve ${kirmizi} kırmızı bilye bulunmaktadır. Torbadan rastgele çekilen bir bilyenin MAVİ olma olasılığı kaçtır?`,
          correctStr: dogru,
          distractors: [
            `${sari / gSari}/${toplam / gSari}`,
            `${kirmizi / gKirmizi}/${toplam / gKirmizi}`,
            simplifyFrac(mavi + 1, toplam)
          ],
          explanation: `İstenen durum sayısı (mavi bilyeler) = ${mavi}.\nTüm olası durumların sayısı = ${mavi} + ${sari} + ${kirmizi} = ${toplam}.\nOlasılık = ${mavi}/${toplam} = ${dogru} olarak sadeleşir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Olasılık = İstenen / Tüm Durumlar formülüdür. Bulduğunuz kesri en sade haline getirmeyi unutmayın."
        };
      },
      (diff) => {
        const zarIstenen = [1, 2, 3, 4, 5, 6].filter(x => x % 2 === 0);
        return {
          question: `Hilesiz bir zar havaya atıldığında üst yüze gelen sayının ÇİFT sayı olma olasılığı kaçtır?`,
          correctStr: "1/2",
          distractors: ["1/3", "1/6", "2/3"],
          explanation: `Tüm olası durumlar: {1, 2, 3, 4, 5, 6} -> 6 adet.\nİstenen çift sayılar: {2, 4, 6} -> 3 adet.\nOlasılık = 3/6 = 1/2'dir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Zar sorularında örnek uzay daima 6 elemanlıdır; asal sayılar {2, 3, 5}, tek sayılar {1, 3, 5}'tir."
        };
      }
    ],

    "8_Cebirsel İfadeler ve Özdeşlikler": [
      (diff) => {
        const a = randInt(2, 5);
        const b = randInt(3, 7);
        const ikiKati = 2 * a * b;
        return {
          question: `(${a}x + ${b})² tam kare ifadesinin özdeşi aşağıdakilerden hangisidir?`,
          correctStr: `${a * a}x² + ${ikiKati}x + ${b * b}`,
          distractors: [
            `${a * a}x² + ${b * b}`,
            `${a * a}x² + ${a * b}x + ${b * b}`,
            `${a * a}x² - ${ikiKati}x + ${b * b}`
          ],
          explanation: `Tam kare açılımı: (Birincinin karesi) + (2 × Birinci × İkinci) + (İkincinin karesi)\n= (${a}x)² + 2 × (${a}x) × (${b}) + (${b})²\n= ${a * a}x² + ${ikiKati}x + ${b * b} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Tam kare özdeşliğinde ortadaki 'çarpımlarının 2 katı' terimi en sık unutulan yerdir. Asla atlamayın!"
        };
      },
      (diff) => {
        const a = randInt(3, 7);
        return {
          question: `x² - ${a * a} ifadesinin çarpanlarına ayrılmış hali aşağıdakilerden hangisidir?`,
          correctStr: `(x - ${a})(x + ${a})`,
          distractors: [`(x - ${a})²`, `(x + ${a})²`, `(x - ${a * a})(x + 1)`],
          explanation: `İki kare farkı özdeşliği: a² - b² = (a - b)(a + b) dir.\nx² - ${a}² = (x - ${a})(x + ${a}) olarak çarpanlarına ayrılır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: İki kare farkı LGS'nin vazgeçilmezidir. Arada eksi varsa biri eksili biri artılı iki parantez yazılır."
        };
      }
    ],

    "8_Doğrusal Denklemler & Eğim": [
      (diff) => {
        const dikey = randInt(3, 9);
        const yatay = randInt(4, 12);
        const dogruEğim = simplifyFrac(dikey, yatay);
        return {
          question: `Dikey yüksekliği ${dikey} metre, yatay uzunluğu ${yatay} metre olan bir engelli rampasının eğimi kaçtır?`,
          correctStr: dogruEğim,
          distractors: [
            simplifyFrac(yatay, dikey),
            simplifyFrac(dikey + 2, yatay),
            simplifyFrac(dikey, yatay + 2)
          ],
          explanation: `Eğim (m) = Dikey Uzunluk ÷ Yatay Uzunluk formülüyle hesaplanır.\nEğim = ${dikey} / ${yatay} = ${dogruEğim} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Eğim daima dikey bölü yataydır (m = Δy / Δx). Sağa yatık doğruların eğimi pozitif, sola yatıkların negatiftir."
        };
      },
      (diff) => {
        const a = randInt(2, 4);
        const b = randInt(3, 6);
        return {
          question: `y = ${a}x + ${b} doğrusunun eğimi kaçtır?`,
          correctStr: `${a}`,
          distractors: [`${b}`, `${simplifyFrac(a, b)}`, `-${a}`],
          explanation: `y = mx + n biçiminde verilen doğrularda y yalnız bırakıldığında x'in katsayısı doğrudan eğimi (m) verir. Burada eğim = ${a}'dır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: y tek başına ise x'in katsayısı eğimdir; 2y = 6x + 4 ise önce her yeri 2'ye bölmelisiniz."
        };
      }
    ],

    "8_Eşitsizlikler": [
      (diff) => {
        const kat = randInt(2, 4);
        const eklenti = randInt(5, 15);
        const limit = randInt(30, 60);
        const raw = (limit - eklenti) / kat;
        const net = Math.floor(raw);
        const sonuc = (limit - eklenti) % kat === 0 ? net - 1 : net;
        return {
          question: `Hangi sayının ${kat} katının ${eklenti} fazlası ${limit} sayısından küçüktür ifadesini sağlayan en büyük tam sayı değeri kaçtır?`,
          correctStr: `${sonuc}`,
          distractors: [`${sonuc + 1}`, `${sonuc + 2}`, `${sonuc - 2}`],
          explanation: `Eşitsizlik kurulur: ${kat}x + ${eklenti} < ${limit}\n=> ${kat}x < ${limit - eklenti}\n=> x < ${(limit - eklenti) / kat}\nBu eşitsizliği sağlayan en büyük tam sayı ${sonuc}'dir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: 'Küçüktür' (<) denildiğinde eşitlik alınmaz, en büyük tam sayı soruluyorsa sınırdan bir önceki tam sayı seçilir."
        };
      },
      (diff) => {
        const a = randInt(3, 7);
        return {
          question: `-2x ≥ ${2 * a} eşitsizliğinin çözüm aralığı aşağıdakilerden hangisidir?`,
          correctStr: `x ≤ -${a}`,
          distractors: [`x ≥ -${a}`, `x ≤ ${a}`, `x ≥ ${a}`],
          explanation: `Eşitsizliğin her iki tarafı negatif bir sayıya (-2) bölündüğünde eşitsizlik işareti YÖN DEĞİŞTİRİR:\nx ≤ ${2 * a} ÷ (-2) => x ≤ -${a} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Eşitsizlikte eksi bir sayı ile çarpma veya bölme yapıldığında yön değiştirme (≥ ise ≤ olur) LGS'nin en popüler tuzaklarından biridir."
        };
      }
    ],

    "8_Üçgenler & Pisagor Teoremi": [
      (diff) => {
        const ozel = [
          { a: 3, b: 4, c: 5 },
          { a: 5, b: 12, c: 13 },
          { a: 8, b: 15, c: 17 }
        ][randInt(0, 2)];
        const k = randInt(1, 3);
        const dik1 = ozel.a * k;
        const dik2 = ozel.b * k;
        const hipo = ozel.c * k;
        return {
          question: `Bir dik üçgende dik kenarların uzunlukları ${dik1} cm ve ${dik2} cm olduğuna göre, hipotenüs uzunluğu kaç santimetredir?`,
          correctStr: `${hipo} cm`,
          distractors: [`${dik1 + dik2} cm`, `${hipo + 4} cm`, `${hipo - (k > 1 ? 2 : 1)} cm`],
          explanation: `Pisagor bağıntısı: a² + b² = c²\n${dik1}² + ${dik2}² = ${dik1 * dik1} + ${dik2 * dik2} = ${hipo * hipo} = ${hipo}² cm bulunur. (${ozel.a}-${ozel.b}-${ozel.c} özel üçgeninin ${k} katıdır).`,
          tactic: "Merdiye Hoca Sınav Taktiği: 3-4-5, 5-12-13, 8-15-17 özel üçgenlerinin katlarını ezbere bilmek sınavda en az 2 dakika kazandırır."
        };
      },
      (diff) => {
        const a = randInt(4, 8);
        const b = randInt(7, 12);
        const alt = Math.abs(a - b);
        const ust = a + b;
        const tamSayiAdedi = ust - alt - 1;
        return {
          question: `İki kenar uzunluğu ${a} cm ve ${b} cm olan bir üçgenin üçüncü kenarının alabileceği kaç farklı tam sayı değeri vardır?`,
          correctStr: `${tamSayiAdedi} adet`,
          distractors: [`${tamSayiAdedi + 2} adet`, `${tamSayiAdedi - 1} adet`, `${a + b} adet`],
          explanation: `Üçgen eşitsizliği kuralı: |${a} - ${b}| < x < ${a} + ${b}\n=> ${alt} < x < ${ust}\nBu aralıktaki tam sayı sayısı = ${ust} - ${alt} - 1 = ${tamSayiAdedi} adettir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Bir kenar uzunluğu diğer iki kenarın farkından büyük, toplamından küçük olmak zorundadır."
        };
      }
    ],

    "8_Dönüşüm Geometrisi": [
      (diff) => {
        const x = randInt(2, 8);
        const y = randInt(3, 9);
        return {
          question: `Koordinat sisteminde A(${x}, ${y}) noktasının x eksenine göre yansıması olan noktanın koordinatları aşağıdakilerden hangisidir?`,
          correctStr: `(${x}, ${-y})`,
          distractors: [`(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`],
          explanation: `x eksenine göre yansıma kuralında: x koordinatı değişmez, y koordinatı ise işaret değiştirir: (x, y) -> (x, -y). Dolayısıyla (${x}, ${-y}) olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Hangi eksene göre yansıma alınıyorsa o eksenin değeri sabit kalır, diğer koordinatın işareti tersine döner."
        };
      },
      (diff) => {
        const x = randInt(1, 5);
        const y = randInt(2, 6);
        const saga = randInt(2, 4);
        const yukari = randInt(2, 4);
        return {
          question: `Koordinat düzleminde K(${x}, ${y}) noktası ${saga} birim sağa ve ${yukari} birim yukarı ötelenirse oluşan yeni noktanın koordinatları ne olur?`,
          correctStr: `(${x + saga}, ${y + yukari})`,
          distractors: [
            `(${x - saga}, ${y + yukari})`,
            `(${x + saga}, ${y - yukari})`,
            `(${x + yukari}, ${y + saga})`
          ],
          explanation: `Öteleme kuralları:\nSağa öteleme: x değerine eklenir -> ${x} + ${saga} = ${x + saga}\nYukarı öteleme: y değerine eklenir -> ${y} + ${yukari} = ${y + yukari}\nYeni nokta: (${x + saga}, ${y + yukari}) olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Sağa ve yukarı + (artı), sola ve aşağı - (eksi) demektir."
        };
      }
    ],

    "8_Geometrik Cisimler": [
      (diff) => {
        const r = randInt(3, 6);
        const h = randInt(5, 12);
        const pi = 3;
        const hacim = pi * r * r * h;
        return {
          question: `Taban yarıçapı r = ${r} cm ve yüksekliği h = ${h} cm olan bir dik dairesel silindirin hacmi kaç santimetreküptür? (π = 3 alınız.)`,
          correctStr: `${hacim} cm³`,
          distractors: [`${Math.floor(hacim / 2)} cm³`, `${hacim + 36} cm³`, `${pi * r * h} cm³`],
          explanation: `Silindirin Hacmi = Taban Alanı × Yükseklik = (π × r²) × h formülü ile bulunur.\nHacim = 3 × ${r}² × ${h} = 3 × ${r * r} × ${h} = ${hacim} cm³'tür.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Prizma ve silindirlerin hacmi daima 'Taban Alanı × Yükseklik' mantığıyla hesaplanır."
        };
      },
      (diff) => {
        const r = randInt(3, 7);
        const h = randInt(4, 10);
        const pi = 3;
        const yanalAlan = 2 * pi * r * h;
        return {
          question: `Taban yarıçapı r = ${r} cm ve yüksekliği h = ${h} cm olan bir dik dairesel silindirin yanal alanı kaç santimetrekaredir? (π = 3 alınız.)`,
          correctStr: `${yanalAlan} cm²`,
          distractors: [`${pi * r * r * h} cm²`, `${yanalAlan + 24} cm²`, `${Math.floor(yanalAlan / 2)} cm²`],
          explanation: `Silindirin Yanal Alanı = Taban Çevresi × Yükseklik = (2 × π × r) × h.\nYanal Alan = 2 × 3 × ${r} × ${h} = ${yanalAlan} cm² bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Silindirin açınımında yanal alan bir dikdörtgendir; bu dikdörtgenin kenarları taban çevresi (2πr) ile yüksekliktir (h)."
        };
      }
    ]
  };

  // 4. Tekli veya Coklu Soru Uretim Fonksiyonu (Dahili Algoritmik Motor)
  function generateLocalQuestion(grade, topic, difficulty, seedIndex) {
    const key = `${grade}_${topic}`;
    const gens = QUESTION_GENERATORS[key] || QUESTION_GENERATORS["8_Çarpanlar ve Katlar (EBOB-EKOK)"];
    const idx = (typeof seedIndex === "number" && seedIndex >= 0) ? seedIndex : 0;
    const genFunc = gens[idx % gens.length] || gens[0];
    const raw = genFunc(difficulty || "yeni_nesil");

    const { options, correctIndex } = buildOptions(raw.correctStr, raw.distractors);

    const diffLabels = {
      temel: "Temel (Kazanım)",
      orta: "Orta (PISA / TIMSS)",
      yeni_nesil: "Yeni Nesil (LGS)",
      lgs_secici: "LGS Seçici (Derece / %1)",
      lgs_cikmis: "LGS Çıkmış Soru Klonu (MEB)"
    };

    return {
      id: "gen-" + Date.now() + "-" + (idx + 1) + "-" + Math.floor(Math.random() * 1000),
      grade: String(grade),
      gradeLabel: `${grade}. Sınıf`,
      topic: topic,
      difficulty: difficulty || "yeni_nesil",
      difficultyLabel: diffLabels[difficulty] || "Yeni Nesil (LGS)",
      question: raw.question,
      options: options,
      correctIndex: correctIndex,
      explanation: raw.explanation,
      tactic: raw.tactic,
      approved: false,
      saved: false
    };
  }

  function generateLocalQuestions(grade, topic, difficulty, count) {
    const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
    const results = [];
    for (let i = 0; i < safeCount; i++) {
      results.push(generateLocalQuestion(grade, topic, difficulty, i));
    }
    return results;
  }

  // 5. Gemini API Canli Baglantisi (Istege Bagli AI Entegrasyonu)
  // Dogrulanmis ve 200 OK donen aktif Gemini API anahtari (Project 995380356147)
  const DEFAULT_PRIMARY_KEY = atob("QVEuQWI4Uk42SkpJT0tZSVZXSlFuS0NCWHdtRG5paW5PQUc2Mm92bmtyV0pzWEdxQ2pSaVE=");
  // Kullanicinin yeni tanimladigi anahtar (Project 207538825061 - GCP uzerinde Generative Language API aktiflestirilince calisacaktir)
  const DEFAULT_FALLBACK_KEY = atob("QVEuQWI4Uk42SktiRENDckI1LWJKaFM4ZU50SFNRaFMzZWRmUVNXdWJSM0l5d2ZJM0NGNGc=");

  async function testGeminiConnection(apiKey) {
    const rawKeys = [];
    if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 10) {
      if (apiKey.trim() === DEFAULT_FALLBACK_KEY) {
        rawKeys.push(DEFAULT_PRIMARY_KEY);
        rawKeys.push(DEFAULT_FALLBACK_KEY);
      } else {
        rawKeys.push(apiKey.trim());
        rawKeys.push(DEFAULT_PRIMARY_KEY);
      }
    } else {
      rawKeys.push(DEFAULT_PRIMARY_KEY);
      rawKeys.push(DEFAULT_FALLBACK_KEY);
    }
    const keysToTest = rawKeys.filter((k, idx, arr) => arr.indexOf(k) === idx);

    const models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"];
    let lastErr = null;

    for (const key of keysToTest) {
      for (const m of models) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`;
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "ping" }] }],
              generationConfig: { maxOutputTokens: 5 }
            })
          });
          if (res.ok) {
            return { success: true, model: m, key: key };
          } else {
            const errBody = await res.text();
            lastErr = `Model ${m} (${res.status}): ${errBody.slice(0, 100)}`;
            if (res.status === 401 || res.status === 403) {
              break;
            }
          }
        } catch (netErr) {
          lastErr = netErr.message;
        }
      }
    }
    return { success: false, error: lastErr || "Baglanti saglanamadi" };
  }

  async function generateGeminiQuestions(apiKey, grade, topic, difficulty, count, pattern) {
    const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite"
    ];

    // Oncelik: Calisan dogrulanmis anahtar -> Kullanici anahtari
    const rawKeys = [];
    if (apiKey && typeof apiKey === "string" && apiKey.trim().length > 10) {
      if (apiKey.trim() === DEFAULT_FALLBACK_KEY) {
        rawKeys.push(DEFAULT_PRIMARY_KEY);
        rawKeys.push(DEFAULT_FALLBACK_KEY);
      } else {
        rawKeys.push(apiKey.trim());
        rawKeys.push(DEFAULT_PRIMARY_KEY);
      }
    } else {
      rawKeys.push(DEFAULT_PRIMARY_KEY);
      rawKeys.push(DEFAULT_FALLBACK_KEY);
    }
    const keysToTry = rawKeys.filter((k, idx, arr) => arr.indexOf(k) === idx);

    const diffDescriptions = {
      temel: "Temel duzeyde (MEB dogrudan kazanim odakli, temel kavramlari ve islem basamaklarini olcen kolay-orta seviye)",
      orta: "Orta duzeyde (PISA ve TIMSS tarzi, gunluk yasam senaryolu, tablo/mantik iceren kavramsal soru)",
      yeni_nesil: "Standart yeni nesil LGS duzeyinde (MEB beceri temelli, sekil/kurgu analizli, derin muhakeme gerektiren gercek LGS sinavi ayari)",
      lgs_secici: "Ileri duzey / Derece ve %1'lik dilim secici LGS duzeyinde (Ust duzey analiz ve sentez becerisi olcen, birden fazla kazanimin birlestirildigi cok adimli eleyici soru)",
      lgs_cikmis: "Son 3 Yil (2022, 2023, 2024) MEB LGS Matematik sinavlarinda cikmis gercek sorularin kurgusu, olcme mantigi ve soru uslubuyla %100 birebir ozdes sinav provasi sorusu"
    };

    const patternDescriptions = {
      otomatik: "Secilen konunun MEB son 3 yilda en cok sordugu cikmis soru sablonunu temel al.",
      ebob_ekok_raf: "2024 LGS EBOB-EKOK Kalibi: Iki farkli olcude koli/kutu/fayansin bir rafa veya duvara dizilmesi, aralarinda asallik kurali ve 'en az / en fazla' sinir degeri problemi kurgusu.",
      karekok_cetvel: "2024 LGS Karekok Kalibi: Sayi dogrusu veya kirik cetvel uzerine konan bir nesnenin uzunlugunun hangi iki tam sayi arasina denk geldigini (yaklasik karekok degeri) olcen kurgu.",
      cebir_kesme: "2024 LGS Cebirsel Ifadeler Kalibi: Kenari x olan kare/dikdortgen bir kartonun koselerinden es kareler kesilip cikarilmasi veya katlanmasi ile olusan yeni seklin alanini ozdesliklerle ((a-b)^2 veya a^2-b^2) ifade etme kurgusu.",
      uslu_katlama: "2023 LGS Uslu Sayilar Kalibi: Bir kagidin adim adim katlanarak alaninin 2'nin veya 3'un kuvvetleri seklinde degismesi, kenar uzunluklarinin uslu oranlari ve alan karsilastirmasi kurgusu.",
      veri_grafik: "2023 LGS Veri Analizi Kalibi: Daire grafigindeki merkez acilar (360 derece) ile sutun grafigindeki urun/kisi sayilari arasinda gecis yapma ve oran-oranti ile denklem cozme kurgusu.",
      olasilik_kart: "2023 LGS Olasilik Kalibi: Bir kutudan/torbadan cekilen kartlarin renklerine gore olasiliklarinin esitlenmesi icin eklenmesi/cikarilmasi gereken adetleri cebirsel bilinmeyenle buldurma kurgusu.",
      dogrusal_egim: "2022-2024 LGS Dogrusal Denklemler Kalibi: Sabit hizla su akitan bir muslukla bosalan/dolan su deposunun zaman-hacim grafigi (y = mx + n) veya dikey/yatay uzunluktan rampa/merdiven egimi hesabi kurgusu.",
      ucgen_pisagor: "2022-2024 LGS Ucgenler Kalibi: Bir ucgenin kenarinin katlama cizgisi boyunca katlanmasi, ucgen esitsizligi (|b-c| < a < b+c) ve dik ucgende Pisagor bagintisi (a^2 + b^2 = c^2) kurgusu.",
      benzerlik_kare: "2022-2024 LGS Benzerlik Kalibi: Benzer iki sekil/cerceve arasindaki benzerlik orani (k), cevreler orani (k) ve alanlar orani (k^2) iliskisini kullanan kurgu."
    };

    const diffPrompt = diffDescriptions[difficulty] || diffDescriptions.yeni_nesil;
    const patternPrompt = patternDescriptions[pattern] || patternDescriptions.otomatik;

    const promptText = `Sen Merdiye Hoca'sin (Turkiye'nin onde gelen LGS Matematik Ogretmeni).
2026 MEB Matematik Mufredatina tam uyumlu, pedagojik olarak kusursuz sorular uret.
Kesin kurallar:
- Sinif Seviyesi: ${grade}. Sinif
- Konu / Kazanim: ${topic}
- Zorluk Derecesi: ${diffPrompt}
- MEB LGS Soru Kalibi Sablonu: ${patternPrompt}
- Uretilecek Soru Sayisi: Tam olarak ${safeCount} adet soru
- Sifir emoji kurali: Cevabinda ASLA ve KESINLIKLE hicbir emoji, simge veya grafik piktogram kullanma!
- Her sorunun 4 sikki (A, B, C, D) olmali, sadece tek bir sik kesinlikle dogru olmali, diger 3 sik ogrencilerin dusebilecegi gercekci celdiriciler olmali.
- Her sorunun ayrintili adim adim cozumu ve Merdiye Hoca Sinav Taktigi bulunmali.

- Gorsel/Sekil Destegi (diagramSvg): Eger soru geometri, sayi dogrusu, alan, koordinat veya grafik iceriyorsa, sorunun metniyle tam uyumlu, temiz ve responsive <svg viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg">...</svg> kodu olustur. Gerekmiyorsa null veya bos string birak.

CIKTIYI SADECE VE SADECE ASAGIDAKI JSON FORMATINDA GECERLI BIR DIZI OLARAK DONDUR, BASKA HICBIR ACIKLAMA METNI VEYA MARKDOWN ETIKETI YAZMA:
[
  {
    "question": "Soru metni...",
    "options": ["Sik 1", "Sik 2", "Sik 3", "Sik 4"],
    "correctIndex": 0,
    "explanation": "Adim adim matematiksel cozum...",
    "tactic": "Merdiye Hoca Sinav Taktigi: Kisa ve vurucu sinav ipucu...",
    "diagramSvg": "<svg viewBox=\"0 0 400 130\" xmlns=\"http://www.w3.org/2000/svg\">...</svg>"
  }
]`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.35,
        responseMimeType: "application/json"
      }
    };

    let data = null;
    let lastError = null;

    // Anahtarlari ve modelleri sirasiyla dene (Akilli 401 Algilama & Hizli Gecis)
    keyLoop:
    for (const keyCandidate of keysToTry) {
      for (const modelName of candidateModels) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(keyCandidate)}`;
        try {
          const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
          const timeoutId = controller ? setTimeout(() => controller.abort(), 45000) : null;

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
            signal: controller ? controller.signal : undefined
          });

          if (timeoutId) clearTimeout(timeoutId);

          if (res.ok) {
            data = await res.json();
            break keyLoop;
          } else {
            const errText = await res.text();
            lastError = `Model ${modelName} (${res.status}): ${errText.slice(0, 120)}`;
            // 401/403 (Gecersiz API Anahtari): Diger modelleri bekleyip zaman kaybetme, derhal sonraki calisan anahtara gec!
            if (res.status === 401 || res.status === 403) {
              break;
            }
          }
        } catch (netErr) {
          lastError = netErr.message;
          // Zaman asimi veya iptal durumunda diger modele gec
        }
      }
    }

    if (!data) {
      throw new Error(`Gemini API cagrisi tamamlanamadi. Detay: ${lastError || "Bilinmeyen hata"}`);
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Gemini API'den bos yanit dondu.");

    const cleanedJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsedList = JSON.parse(cleanedJson);

    if (!Array.isArray(parsedList) || parsedList.length === 0) {
      throw new Error("Gemini API yaniti beklenen JSON formatinda degil.");
    }

    const diffLabels = {
      temel: "Temel (Kazanım)",
      orta: "Orta (PISA / TIMSS)",
      yeni_nesil: "Yeni Nesil (LGS)",
      lgs_secici: "LGS Seçici (Derece / %1)",
      lgs_cikmis: "LGS Çıkmış Soru Klonu (MEB)"
    };

    return parsedList.slice(0, safeCount).map((item, idx) => ({
      id: "ai_" + Date.now() + "_" + (idx + 1),
      grade: String(grade),
      gradeLabel: `${grade}. Sinif`,
      topic: topic,
      difficulty: difficulty,
      difficultyLabel: diffLabels[difficulty] || "Orta",
      question: String(item.question || "").trim(),
      options: Array.isArray(item.options) && item.options.length === 4
        ? item.options.map(o => String(o).trim())
        : ["A", "B", "C", "D"],
      correctIndex: typeof item.correctIndex === "number" && item.correctIndex >= 0 && item.correctIndex <= 3
        ? item.correctIndex
        : 0,
      explanation: String(item.explanation || "Detayli adim adim cozum.").trim(),
      tactic: String(item.tactic || "Merdiye Hoca Sinav Taktigi: Formulu hatirla, soruyu dikkatle oku.").trim(),
      diagramSvg: (typeof item.diagramSvg === "string" && item.diagramSvg.includes("<svg")) ? item.diagramSvg.trim() : createTopicSvgDiagram(topic, difficulty),
      tableHtml: typeof item.tableHtml === "string" ? item.tableHtml.trim() : null,
      approved: true,
      engine: "Google Gemini 2.5 Flash",
      createdAt: new Date().toISOString()
    }));
  }

  // 6. A4 Ogretmen Sinav & Calisma Kagidi HTML Cikti Olusturucu
  function buildPrintableExamHtml(questions, options) {
    const opts = options || {};
    const schoolName = opts.schoolName || "T.C. MILLI EGITIM BAKANLIGI";
    const subTitle = opts.examTitle || "2025 - 2026 EGITIM OGRETIM YILI MATEMATIK DEGERLENDIRME SINAVI";
    const gradeText = opts.gradeText || (questions[0] ? questions[0].gradeLabel : "8. Sınıf");
    const topicText = opts.topicText || (questions[0] ? questions[0].topic : "Matematik Kazanım Değerlendirme");
    const examDate = opts.examDate || new Date().toLocaleDateString("tr-TR");
    const includeAnswerKey = opts.includeAnswerKey !== false;
    const includeScratchArea = opts.includeScratchArea !== false;
    const isTwoColumn = opts.layout !== "single";

    let html = `
      <div class="exam-sheet-root">
        <!-- Sinav Basligi & Ogrenci Bilgi Formu -->
        <header class="exam-header-box">
          <div class="exam-header-top">
            <div class="exam-header-brand">
              <span class="exam-logo-text">MERDİYE HOCAM MATEMATİK AKADEMİSİ</span>
              <div class="exam-school-name">${escapeHtml(schoolName)}</div>
              <div class="exam-main-title">${escapeHtml(subTitle)}</div>
            </div>
          </div>

          <div class="exam-student-info-grid">
            <div class="exam-info-cell"><b>Öğrenci Adı Soyadı:</b> ................................................................</div>
            <div class="exam-info-cell"><b>Sınıfı / Şubesi:</b> ....................</div>
            <div class="exam-info-cell"><b>Okul Numarası:</b> ....................</div>
            <div class="exam-info-cell"><b>Ders / Konu:</b> ${escapeHtml(gradeText)} - ${escapeHtml(topicText)}</div>
            <div class="exam-info-cell"><b>Sınav Tarihi:</b> ${escapeHtml(examDate)}</div>
            <div class="exam-info-cell exam-grade-cell"><b>Aldığı Not:</b> [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / 100 ]</div>
          </div>

          <div class="exam-instructions-line">
            * Sınav süresi 40 dakikadır. Tüm sorular 4 seçeneklidir. Yanlış cevaplar doğruyu götürmez. Başarılar dilerim. &bull; Merdiye Hoca
          </div>
        </header>

        <!-- Soru Listesi -->
        <main class="exam-questions-container ${isTwoColumn ? 'two-column-layout' : 'single-column-layout'}">
    `;

    questions.forEach((q, index) => {
      const qNum = index + 1;
      const letters = ["A", "B", "C", "D"];
      html += `
        <article class="exam-question-item">
          <div class="exam-q-header">
            <span class="exam-q-number">${qNum}.</span>
            <span class="exam-q-badge">${escapeHtml(q.difficultyLabel || "LGS Ayarı")}</span>
          </div>
          <div class="exam-q-text">${escapeHtml(q.question).replace(/\n/g, "<br>")}</div>
          ${q.diagramSvg ? `<div class="exam-q-diagram" style="margin: 8px 0; text-align: center;">${q.diagramSvg}</div>` : ''}
          ${q.imageUrl ? `<div class="exam-q-diagram" style="margin: 8px 0; text-align: center;"><img src="${q.imageUrl}" style="max-height: 140px; max-width: 100%; object-fit: contain;"></div>` : ''}
          ${q.tableHtml ? `<div class="exam-q-table" style="margin: 8px 0;">${q.tableHtml}</div>` : ''}
          <div class="exam-options-grid">
      `;

      q.options.forEach((optText, optIdx) => {
        html += `
          <div class="exam-option-line">
            <span class="exam-opt-letter">${letters[optIdx]})</span>
            <span class="exam-opt-content">${escapeHtml(optText)}</span>
          </div>
        `;
      });

      html += `</div>`;

      if (includeScratchArea) {
        html += `
          <div class="exam-scratch-area">
            <span class="exam-scratch-tag">Çözüm ve İşlem Alanı</span>
          </div>
        `;
      }

      html += `</article>`;
    });

    html += `</main>`;

    // Ogretmen Nushasi: Cevap Anahtari ve Taktik Sayfasi
    if (includeAnswerKey) {
      const letters = ["A", "B", "C", "D"];
      html += `
        <div class="exam-page-break"></div>
        <section class="exam-teacher-key-sheet">
          <div class="exam-teacher-key-header">
            <h3>ÖĞRETMEN NÜSHASI: CEVAP ANAHTARI &amp; ÇÖZÜM REHBERİ</h3>
            <p>${escapeHtml(gradeText)} &bull; ${escapeHtml(topicText)} &bull; Toplam ${questions.length} Soru</p>
          </div>

          <!-- Hizli Cevap Matrisi -->
          <div class="exam-answer-matrix">
            <table class="exam-matrix-table">
              <thead>
                <tr>
      `;

      for (let i = 1; i <= questions.length; i++) {
        html += `<th>S.${i}</th>`;
      }

      html += `
                </tr>
              </thead>
              <tbody>
                <tr>
      `;

      questions.forEach((q) => {
        const letter = letters[q.correctIndex] || "A";
        html += `<td class="matrix-key-cell">${letter}</td>`;
      });

      html += `
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Ayrintili Cozum ve Merdiye Hoca Taktik Dokumu -->
          <div class="exam-teacher-solutions-list">
            <h4>Ayrıntılı Adım Adım Çözümler ve Sınav Taktikleri</h4>
      `;

      questions.forEach((q, idx) => {
        const qNum = idx + 1;
        const letter = letters[q.correctIndex] || "A";
        html += `
          <div class="teacher-sol-item">
            <div class="teacher-sol-title">
              <b>Soru ${qNum} (Doğru Cevap: ${letter})</b> - <small>${escapeHtml(q.difficultyLabel || "")}</small>
            </div>
            <div class="teacher-sol-explanation">${escapeHtml(q.explanation || "").replace(/\n/g, "<br>")}</div>
            ${q.tactic ? `<div class="teacher-sol-tactic"><b>Merdiye Hoca Sınav Taktiği:</b> ${escapeHtml(q.tactic)}</div>` : ""}
          </div>
        `;
      });

      html += `
          </div>
        </section>
      `;
    }

    html += `</div>`;
    return html;
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return {
    MEB_CURRICULUM_2026,
    generateLocalQuestion,
    generateLocalQuestions,
    generateGeminiQuestions,
    testGeminiConnection,
    buildPrintableExamHtml
  };
});
