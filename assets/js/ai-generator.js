/**
 * Merdiye Hocam LGS Platformu - AI Soru Üretici Motoru & A4 Sınav Çıktı Merkezi
 * 2026 MEB Matematik Müfredatı (5, 6, 7, 8. Sınıf)
 *
 * Kurallar: Axiom Zero Bloat, Katı O(1)/O(n) Algoritma, İçsel Emniyet, SIFIR EMOJİ Politikası.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MH_AI_GENERATOR = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // 1. 2026 MEB Matematik Müfredat Haritası (5, 6, 7 ve 8. Sınıf)
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

  // Yardımcı Matematiksel Fonksiyonlar (Axiom Zero Bloat & Intrinsic Safety)
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

  function buildOptions(correctStr, distractorsArr) {
    const uniqueDistractors = [];
    const seen = new Set([correctStr]);
    for (const d of distractorsArr) {
      const str = String(d);
      if (!seen.has(str)) {
        seen.add(str);
        uniqueDistractors.push(str);
      }
      if (uniqueDistractors.length >= 3) break;
    }

    // Yetersiz çeldirici kalırsa emniyetli türetim
    let salt = 1;
    while (uniqueDistractors.length < 3) {
      const fallback = String(Number(correctStr) ? Number(correctStr) + salt : correctStr + " (" + salt + ")");
      if (!seen.has(fallback)) {
        seen.add(fallback);
        uniqueDistractors.push(fallback);
      }
      salt++;
    }

    const items = [
      { text: correctStr, isCorrect: true },
      { text: uniqueDistractors[0], isCorrect: false },
      { text: uniqueDistractors[1], isCorrect: false },
      { text: uniqueDistractors[2], isCorrect: false }
    ];

    const shuffled = shuffle(items);
    const options = shuffled.map(it => it.text);
    const correctIndex = shuffled.findIndex(it => it.isCorrect);

    return { options, correctIndex };
  }

  // 2. Kapsamlı Prosedürel Matematik Soru Şablonları (32 Konunun Tamamı)
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
          distractors: [bolunen - kalan, bolunen + kalan, a * b, bolunen - 10],
          explanation: `Bölme işleminde temel kural: Bölünen = (Bölen × Bölüm) + Kalan bağıntısıdır.\nBölünen = (${b} × ${a}) + ${kalan} = ${a * b} + ${kalan} = ${bolunen} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kalanın daima bölenden küçük olması gerektiğini unutmayın. Sağlama yaparken çarpma ve toplamayı adım adım kontrol edin."
        };
      },
      (diff) => {
        const fiyat = randInt(140, 320) * 10;
        const pesinat = Math.floor(fiyat * 0.2);
        const taksitSayisi = randInt(4, 8);
        const kalan = fiyat - pesinat;
        const taksit = Math.floor(kalan / taksitSayisi);
        const duzeltilmisKalan = taksit * taksitSayisi;
        const netFiyat = pesinat + duzeltilmisKalan;
        return {
          question: `Kerem, etiket fiyatı ${netFiyat} TL olan bir bisikleti satın almak için ${pesinat} TL peşinat vermiş, kalan borcunu ise ${taksitSayisi} eşit taksitle ödemiştir. Buna göre Kerem'in ödediği aylık bir taksit tutarı kaç TL'dir?`,
          correctStr: `${taksit} TL`,
          distractors: [`${taksit + 20} TL`, `${taksit - 20} TL`, `${Math.floor(netFiyat / taksitSayisi)} TL`],
          explanation: `Peşinat çıkarıldıktan sonra kalan borç: ${netFiyat} - ${pesinat} = ${duzeltilmisKalan} TL.\nAylık taksit tutarı: ${duzeltilmisKalan} ÷ ${taksitSayisi} = ${taksit} TL olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Problem çözerken önce toplam paradan peşinatı düşmeli, kalan miktarı taksit sayısına bölmelisiniz."
        };
      }
    ],

    "5_Kesirler": [
      (diff) => {
        const payda = randInt(6, 12);
        const pay1 = randInt(1, Math.floor(payda / 2));
        const pay2 = randInt(1, payda - pay1 - 1);
        const kalanPay = payda - (pay1 + pay2);
        const toplamSayfa = payda * randInt(15, 30);
        const kalanSayfa = (toplamSayfa / payda) * kalanPay;
        return {
          question: `Zeynep ${toplamSayfa} sayfalık bir matematik soru kitabının birinci gün ${pay1}/${payda}'ini, ikinci gün ise ${pay2}/${payda}'sini çözmüştür. Buna göre Zeynep'in çözmediği kaç sayfa kalmıştır?`,
          correctStr: `${kalanSayfa}`,
          distractors: [`${kalanSayfa + payda}`, `${kalanSayfa - payda > 0 ? kalanSayfa - payda : kalanSayfa + 12}`, `${(toplamSayfa / payda) * (pay1 + pay2)}`],
          explanation: `Çözülen kesir toplamı: ${pay1}/${payda} + ${pay2}/${payda} = ${pay1 + pay2}/${payda}.\nKalan kesir: ${payda}/${payda} - ${pay1 + pay2}/${payda} = ${kalanPay}/${payda}.\nKalan sayfa sayısı: (${toplamSayfa} ÷ ${payda}) × ${kalanPay} = ${kalanSayfa} sayfadır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Paydaları eşit olan kesirlerde sadece paylar toplanır veya çıkarılır, paydaya dokunulmaz."
        };
      }
    ],

    "5_Ondalık Gösterim": [
      (diff) => {
        const tam = randInt(12, 45);
        const ondalik1 = randInt(25, 75) / 100;
        const ondalik2 = randInt(10, 45) / 100;
        const sayi1 = Number((tam + ondalik1).toFixed(2));
        const sayi2 = Number((randInt(5, 15) + ondalik2).toFixed(2));
        const toplam = Number((sayi1 + sayi2).toFixed(2));
        return {
          question: `Kırtasiyeden ${sayi1} TL'ye bir geometri seti ve ${sayi2} TL'ye bir pergel alan Elif, kasaya 100 TL vermiştir. Buna göre Elif kaç TL para üstü alır?`,
          correctStr: `${(100 - toplam).toFixed(2)} TL`,
          distractors: [`${toplam.toFixed(2)} TL`, `${(100 - toplam + 1).toFixed(2)} TL`, `${(100 - toplam - 0.5).toFixed(2)} TL`],
          explanation: `Toplam harcama: ${sayi1} + ${sayi2} = ${toplam.toFixed(2)} TL.\nPara üstü: 100,00 - ${toplam.toFixed(2)} = ${(100 - toplam).toFixed(2)} TL bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Ondalık sayılarda çıkarma yaparken tam sayının sonuna virgül ve sıfırlar eklemeyi (100,00) alışkanlık haline getirin."
        };
      }
    ],

    "5_Yüzdeler": [
      (diff) => {
        const anaPara = randInt(15, 60) * 10;
        const yuzde = [10, 20, 25, 40, 50][randInt(0, 4)];
        const indirimMiktari = (anaPara * yuzde) / 100;
        const sonFiyat = anaPara - indirimMiktari;
        return {
          question: `Bir mağazada ${anaPara} TL değerindeki mont için sezon sonu sebebiyle %${yuzde} indirim uygulanmıştır. İndirimli fiyat kaç TL olur?`,
          correctStr: `${sonFiyat} TL`,
          distractors: [`${sonFiyat + indirimMiktari / 2} TL`, `${indirimMiktari} TL`, `${sonFiyat - 15} TL`],
          explanation: `İndirim miktarı = ${anaPara} × (${yuzde} / 100) = ${indirimMiktari} TL.\nİndirimli yeni fiyat = ${anaPara} - ${indirimMiktari} = ${sonFiyat} TL'dir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: %20 indirimin 5'te 1, %25 indirimin ise 4'te 1 olduğunu bilmek zihinden işlem yaparken inanılmaz hız kazandırır."
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
          distractors: [`${aci3 + 10}°`, `${aci3 - 10}°`, `${180 - aci1}°`],
          explanation: `Bir üçgenin iç açıları toplamı daima 180 derecedir.\nm(C) = 180° - (${aci1}° + ${aci2}°) = 180° - ${aci1 + aci2}° = ${aci3}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Üçgende iç açılar toplamı 180°, dörtgenlerde ise 360° kuralını her sınavda aklınızda tutun."
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
          distractors: [`${toplam - 10}`, `${toplam + 10}`, `${toplam + 5}`],
          explanation: `Haftalık toplam ödünç kitap sayısı: ${sayilar[0]} + ${sayilar[1]} + ${sayilar[2]} + ${sayilar[3]} + ${sayilar[4]} = ${toplam} adettir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Veri tablolarında sayıları alt alta toplarken birler basamağını doğru hizalamak dikkatsizlik hatalarını engeller."
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
        return {
          question: `Aşağıdaki işlemin sonucu kaçtır?\n${taban}³ + ${carp} × ${ek} - ${cikar}`,
          correctStr: `${sonuc}`,
          distractors: [`${(usDeger + carp) * ek - cikar}`, `${sonuc + 10}`, `${sonuc - 5}`],
          explanation: `İşlem önceliği sırası: 1) Üslü ifade: ${taban}³ = ${usDeger}.\n2) Çarpma işlemi: ${carp} × ${ek} = ${carp * ek}.\n3) Toplama ve Çıkarma: ${usDeger} + ${carp * ek} - ${cikar} = ${sonuc} elde edilir.`,
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
          tactic: "Merdiye Hoca Sınav Taktiği: Çarpanları ikili çiftler halinde (1×${sayi}, 2×...) yazarak listelemek hiçbir çarpanı atlamamanızı sağlar."
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
          distractors: [`${sA + sB}`, `${sBirlesim - sKesisim}`, `${sBirlesim + 2}`],
          explanation: `Kümelerde birleşim kuralı: s(A ∪ B) = s(A) + s(B) - s(A ∩ B).\ns(A ∪ B) = ${sA} + ${sB} - ${sKesisim} = ${sBirlesim} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kesişim elemanları her iki kümede de sayıldığı için birleşim bulunurken bir defa çıkarılmalıdır."
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
          distractors: [`${a - b}`, `${-fark}`, `${mutlakA + b}`],
          explanation: `Mutlak değer daima pozitif veya sıfırdır: |${a}| = ${mutlakA}.\nİşlem: ${mutlakA} - ${b} = ${fark} olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Mutlak değer bir sayının sıfıra olan uzaklığıdır; uzaklık negatif olamayacağından dışarı pozitif çıkar."
        };
      }
    ],

    "6_Kesirler": [
      (diff) => {
        const p1 = 2;
        const q1 = 3;
        const p2 = 3;
        const q2 = 4;
        const carpimP = p1 * p2;
        const carpimQ = q1 * q2;
        const sadG = gcd(carpimP, carpimQ);
        const netP = carpimP / sadG;
        const netQ = carpimQ / sadG;
        return {
          question: `(2/3) × (3/4) çarpma işleminin en sade hali hangisidir?`,
          correctStr: `${netP}/${netQ}`,
          distractors: [`${carpimP}/${carpimQ + 2}`, `1/3`, `2/5`],
          explanation: `Paylar kendi arasında, paydalar kendi arasında çarpılır: (2 × 3) / (3 × 4) = 6/12.\n6 ile sadeleştirildiğinde 1/2 elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Kesirlerle çarpmada işlem yapmadan önce çapraz sadeleştirme yaparsanız büyük sayılarla uğraşmazsınız."
        };
      }
    ],

    "6_Ondalık & Oran": [
      (diff) => {
        const kiz = randInt(12, 18);
        const erkek = randInt(10, 16);
        const g = gcd(kiz, kiz + erkek);
        const kP = kiz / g;
        const tP = (kiz + erkek) / g;
        return {
          question: `Bir sınıfta ${kiz} kız ve ${erkek} erkek öğrenci bulunmaktadır. Buna göre sınıftaki kız öğrenci sayısının tüm sınıf mevcuduna oranı kaçtır?`,
          correctStr: `${kP}/${tP}`,
          distractors: [`${kiz}/${erkek}`, `${erkek}/${kiz + erkek}`, `${kP + 1}/${tP}`],
          explanation: `Tüm sınıf mevcudu: ${kiz} + ${erkek} = ${kiz + erkek}.\nKızların tüm sınıfa oranı: ${kiz} / ${kiz + erkek}.\nHer iki sayı ${g} ile sadeleştirildiğinde ${kP}/${tP} oranı elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Oran sorularında pay ve paydaya hangi çokluğun yazıldığına çok dikkat edin; sadeleştirmeyi asla unutmayın."
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
          distractors: [`${taban * yukseklik} cm²`, `${alan + taban} cm²`, `${alan - 6} cm²`],
          explanation: `Üçgenin alanı = (Taban × Yükseklik) ÷ 2 formülü ile hesaplanır.\nAlan = (${taban} × ${yukseklik}) ÷ 2 = ${taban * yukseklik} ÷ 2 = ${alan} cm² bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Üçgen alanında 2'ye bölmeyi sakın unutmayın; dikdörtgen ve paralelkenarda 2'ye bölünmez, üçgende bölünür!"
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
          distractors: [`${carpim + c}`, `${-sonuc}`, `${sonuc + 4}`],
          explanation: `1) Çarpma işlemi: (${a}) × (+${b}) = ${carpim}.\n2) Çıkarma işlemi: ${carpim} - (${c}) = ${carpim} + ${-c} = ${sonuc} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: İki eksi yan yana geldiğinde (-(-c)) artıya dönüşür. İşaret hataları 7. sınıfın en büyük puan tuzağıdır."
        };
      }
    ],

    "7_Rasyonel Sayılar": [
      (diff) => {
        const a = 1;
        const b = 2;
        const c = 2;
        const d = 3;
        const pay = a * d + b * c;
        const payda = b * d;
        return {
          question: `(1/2) + (2/3) işleminin sonucu kaçtır?`,
          correctStr: `${pay}/${payda}`,
          distractors: [`3/5`, `7/12`, `5/6`],
          explanation: `Paydalar 6'da eşitlenir: (1×3)/(2×3) + (2×2)/(3×2) = 3/6 + 4/6 = 7/6 bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Rasyonel sayılarda toplama ve çıkarma yaparken paydaları eşitlemeden asla işlem yapmayın."
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
      }
    ],

    "7_Oran ve Orantı": [
      (diff) => {
        const usta = randInt(3, 6);
        const gun = randInt(10, 20);
        const yeniUsta = usta * 2;
        const yeniGun = gun / 2;
        return {
          question: `Bir inşaat işini aynı güçteki ${usta} usta ${gun} günde bitirebilmektedir. Usta sayısı ${yeniUsta}'ye çıkarılırsa aynı iş kaç günde biter?`,
          correctStr: `${yeniGun} gün`,
          distractors: [`${gun * 2} gün`, `${gun + 2} gün`, `${yeniGun + 3} gün`],
          explanation: `İşçi ve usta problemleri TERS ORANTI kuralına tabidir.\nUsta sayısı × Gün sayısı = Sabit iş miktarı.\n${usta} × ${gun} = ${yeniUsta} × x => x = (${usta * gun}) / ${yeniUsta} = ${yeniGun} gün bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Usta sayısı artarsa iş daha kısa sürede biter! Ters orantıda karşılıklı çarpımlar birbirine eşittir."
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
          question: `${maas.toLocaleString("tr-TR")} TL maaş alan bir çalışanın maaşına %${zam} zam yapılmıştır. Zam sonrası yeni maaş kaç TL olur?`,
          correctStr: `${yeniMaas.toLocaleString("tr-TR")} TL`,
          distractors: [`${(maas + artis / 2).toLocaleString("tr-TR")} TL`, `${artis.toLocaleString("tr-TR")} TL`, `${(yeniMaas + 1000).toLocaleString("tr-TR")} TL`],
          explanation: `Zam tutarı = ${maas} × (${zam}/100) = ${artis} TL.\nYeni Maaş = ${maas} + ${artis} = ${yeniMaas} TL olarak hesaplanır.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Zam yapıldığında başlangıç fiyatına ekleme, indirim yapıldığında çıkarma yapılır."
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
          distractors: [`${darAci}°`, `${90 - darAci}°`, `${karsiAci - 10}°`],
          explanation: `U kuralında (karşıt durumlu açılar) paralel doğrular arasındaki iç açılar toplamı 180 derecedir.\nİkinci açı = 180° - ${darAci}° = ${karsiAci}° bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: U kuralında toplam 180°, Z kuralında açılar birbirine eşit, M kuralında sola bakanlar sağa bakanlara eşittir."
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
          distractors: [`${cevre} cm²`, `${alan + 12} cm²`, `${alan - 18} cm²`],
          explanation: `Dairenin Alan Formülü = π × r² dir.\nAlan = 3 × ${r}² = 3 × ${r * r} = ${alan} cm² bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Çevre formülü 2πr, Alan formülü πr²'dir. Soru kökünde 'çevre' mi yoksa 'alan' mı sorulduğuna dikkat edin."
        };
      }
    ],

    "7_Veri Analizi": [
      (diff) => {
        const notlar = [70, 80, 90, 85, 75];
        const toplam = notlar.reduce((a, b) => a + b, 0);
        const ortalama = toplam / notlar.length;
        return {
          question: `Bir öğrencinin 5 deneme sınavından aldığı matematik notları: 70, 80, 90, 85 ve 75'tir. Bu öğrencinin not ortalaması kaçtır?`,
          correctStr: `${ortalama}`,
          distractors: [`${ortalama + 2}`, `${ortalama - 3}`, `82`],
          explanation: `Aritmetik Ortalama = Verilerin Toplamı ÷ Veri Sayısı.\nOrtalama = (${notlar.join(" + ")}) ÷ 5 = ${toplam} ÷ 5 = ${ortalama} bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Aritmetik ortalama, medyan (ortanca) ve mod (en çok tekrar eden) kavramlarını birbiriyle karıştırmayın."
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
        return {
          question: `İki farklı otobüsten biri ${x} dakikada bir, diğeri ise ${y} dakikada bir sefere çıkmaktadır. Saat 08.00'de birlikte sefere çıkan bu iki otobüs, EN ERKEN saat kaçta tekrar birlikte sefere çıkarlar?`,
          correctStr: `${String(8 + Math.floor(ortakKat / 60)).padStart(2, "0")}.${String(ortakKat % 60).padStart(2, "0")}`,
          distractors: [`${String(8 + Math.floor((ortakKat + 15) / 60)).padStart(2, "0")}.${String((ortakKat + 15) % 60).padStart(2, "0")}`, `09.00`, `09.30`],
          explanation: `Birlikte hareket etme periyodu EKOK(${x}, ${y}) ile bulunur.\nEKOK(${x}, ${y}) = ${ortakKat} dakikadır (${Math.floor(ortakKat / 60)} saat ${ortakKat % 60} dakika).\n08.00 + ${Math.floor(ortakKat / 60)} saat ${ortakKat % 60} dk = ${String(8 + Math.floor(ortakKat / 60)).padStart(2, "0")}.${String(ortakKat % 60).padStart(2, "0")} olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Sefer saatleri, nöbetler ve zil soruları klasik EKOK kurgusudur. Çıkan dakikayı saate çevirmeyi unutmayın."
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
          distractors: [`${matSayisi - 15} öğrenci`, `${matSayisi + 20} öğrenci`, `${aciMat / 2} öğrenci`],
          explanation: `Daire grafiğinin tamamı 360 derecedir.\n360°'ye 360 öğrenci düşüyorsa, her 1° tam olarak 1 öğrenciye karşılık gelir.\nDolayısıyla ${aciMat}° merkez açı = ${matSayisi} öğrenci demektir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Daire grafiğinde merkez açılar toplamı daima 360°'dir. Doğru orantı kurarak kolayca sonuca gidin."
        };
      }
    ],

    "8_Basit Olayların Olma Olasılığı": [
      (diff) => {
        const mavi = randInt(4, 8);
        const sari = randInt(5, 10);
        const kirmizi = randInt(3, 7);
        const toplam = mavi + sari + kirmizi;
        const g = gcd(mavi, toplam);
        return {
          question: `Bir torbada aynı büyüklükte ${mavi} mavi, ${sari} sarı ve ${kirmizi} kırmızı bilye bulunmaktadır. Torbadan rastgele çekilen bir bilyenin MAVİ olma olasılığı kaçtır?`,
          correctStr: `${mavi / g}/${toplam / g}`,
          distractors: [`${sari / g}/${toplam / g}`, `${mavi}/${sari + kirmizi}`, `1/3`],
          explanation: `İstenen durum sayısı (mavi bilyeler) = ${mavi}.\nTüm olası durumların sayısı = ${mavi} + ${sari} + ${kirmizi} = ${toplam}.\nOlasılık = ${mavi}/${toplam} = ${mavi / g}/${toplam / g} olarak sadeleşir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Olasılık = İstenen / Tüm Durumlar formülüdür. Bulduğunuz kesri en sade haline getirmeyi unutmayın."
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
      }
    ],

    "8_Doğrusal Denklemler & Eğim": [
      (diff) => {
        const dikey = randInt(3, 9);
        const yatay = randInt(4, 12);
        const g = gcd(dikey, yatay);
        return {
          question: `Dikey yüksekliği ${dikey} metre, yatay uzunluğu ${yatay} metre olan bir engelli rampasının eğimi kaçtır?`,
          correctStr: `${dikey / g}/${yatay / g}`,
          distractors: [`${yatay / g}/${dikey / g}`, `${(dikey + 1) / g}/${yatay / g}`, `1/2`],
          explanation: `Eğim (m) = Dikey Uzunluk ÷ Yatay Uzunluk formülüyle hesaplanır.\nEğim = ${dikey} / ${yatay} = ${dikey / g}/${yatay / g} elde edilir.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Eğim daima dikey bölü yataydır (m = Δy / Δx). Sağa yatık doğruların eğimi pozitif, sola yatıkların negatiftir."
        };
      }
    ],

    "8_Eşitsizlikler": [
      (diff) => {
        const kat = randInt(2, 4);
        const eklenti = randInt(5, 15);
        const limit = randInt(30, 60);
        const net = Math.floor((limit - eklenti) / kat);
        return {
          question: `Hangi sayının ${kat} katının ${eklenti} fazlası ${limit} sayısından küçüktür ifadesini sağlayan en büyük tam sayı değeri kaçtır?`,
          correctStr: `${(limit - eklenti) % kat === 0 ? net - 1 : net}`,
          distractors: [`${net + 1}`, `${net + 2}`, `${net - 2}`],
          explanation: `Eşitsizlik kurulur: ${kat}x + ${eklenti} < ${limit}\n=> ${kat}x < ${limit - eklenti}\n=> x < ${(limit - eklenti) / kat}\nBu eşitsizliği sağlayan en büyük tam sayı değeri bulunur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Eşitsizliğin her iki tarafı negatif bir sayı ile çarpılır veya bölünürse eşitsizlik yön değiştirir!"
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
          distractors: [`${hipo + 2} cm`, `${hipo - 1} cm`, `${dik1 + dik2} cm`],
          explanation: `Pisagor bağıntısı: a² + b² = c²\n${dik1}² + ${dik2}² = ${dik1 * dik1} + ${dik2 * dik2} = ${hipo * hipo} = ${hipo}² cm bulunur. (${ozel.a}-${ozel.b}-${ozel.c} özel üçgeninin ${k} katıdır).`,
          tactic: "Merdiye Hoca Sınav Taktiği: 3-4-5, 5-12-13, 8-15-17 özel üçgenlerinin katlarını ezbere bilmek sınavda en az 2 dakika kazandırır."
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
          explanation: `x eksenine göre yansıma kuralında: x koordinatı değişmez, y koordinatı ise işaret değiştirir. (x, y) -> (x, -y). Dolayısıyla (${x}, ${-y}) olur.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Hangi eksene göre yansıma alınıyorsa o eksenin değeri sabit kalır, diğer koordinatın işareti tersine döner."
        };
      }
    ],

    "8_Geometrik Cisimler": [
      (diff) => {
        const r = randInt(2, 6);
        const h = randInt(5, 12);
        const pi = 3;
        const hacim = pi * r * r * h;
        return {
          question: `Taban yarıçapı r = ${r} cm ve yüksekliği h = ${h} cm olan bir dik dairesel silindirin hacmi kaç santimetreküptür? (π = 3 alınız.)`,
          correctStr: `${hacim} cm³`,
          distractors: [`${hacim / 2} cm³`, `${hacim + 24} cm³`, `${2 * pi * r * h} cm³`],
          explanation: `Silindirin Hacmi = Taban Alanı × Yükseklik = (π × r²) × h formülü ile bulunur.\nHacim = 3 × ${r}² × ${h} = 3 × ${r * r} × ${h} = ${hacim} cm³'tür.`,
          tactic: "Merdiye Hoca Sınav Taktiği: Prizma ve silindirlerin hacmi daima 'Taban Alanı × Yükseklik' mantığıyla hesaplanır."
        };
      }
    ]
  };

  // 3. Tekli veya Çoklu Soru Üretim Fonksiyonu (Dahili Algoritmik Motor)
  function generateLocalQuestion(grade, topic, difficulty, seedIndex) {
    const key = `${grade}_${topic}`;
    const gens = QUESTION_GENERATORS[key] || QUESTION_GENERATORS["8_Çarpanlar ve Katlar (EBOB-EKOK)"];
    const genFunc = gens[seedIndex % gens.length] || gens[0];
    const raw = genFunc(difficulty);

    const { options, correctIndex } = buildOptions(raw.correctStr, raw.distractors);

    const diffLabels = {
      temel: "Temel (Kazanım)",
      orta: "Orta (PISA / TIMSS)",
      yeni_nesil: "Yeni Nesil (LGS / Beceri Temelli)"
    };

    return {
      id: "gen-" + Date.now() + "-" + (seedIndex + 1) + "-" + Math.floor(Math.random() * 1000),
      grade: String(grade),
      gradeLabel: `${grade}. Sınıf`,
      topic: topic,
      difficulty: difficulty,
      difficultyLabel: diffLabels[difficulty] || "Yeni Nesil",
      question: raw.question,
      options: options,
      correctIndex: correctIndex,
      explanation: raw.explanation,
      tactic: raw.tactic,
      approved: false, // Öğretmen onayı için başlangıçta false
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

  // 4. Gemini API Canlı Bağlantısı (İsteğe Bağlı AI Entegrasyonu)
  async function generateGeminiQuestions(apiKey, grade, topic, difficulty, count) {
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
      throw new Error("Geçerli bir Gemini API anahtarı sağlanmadı.");
    }

    const safeCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    const diffPrompt = difficulty === "temel" 
      ? "Temel düzeyde (MEB doğrudan kazanım odaklı, işlem basamaklarını ölçen)"
      : difficulty === "orta"
      ? "Orta düzeyde (PISA ve TIMSS tarzı, günlük yaşam senaryolu, tablo/mantık içeren)"
      : "Yeni nesil düzeyde (LGS beceri temelli, şekil/kurgu analizli, derin muhakeme gerektiren)";

    const promptText = `Sen Merdiye Hoca'sın (Türkiye'nin önde gelen LGS Matematik Öğretmeni).
2026 MEB Matematik Müfredatına tam uyumlu, pedagojik olarak kusursuz sorular üret.
Kesin kurallar:
- Sınıf Seviyesi: ${grade}. Sınıf
- Konu / Kazanım: ${topic}
- Zorluk Derecesi: ${diffPrompt}
- Üretilecek Soru Sayısı: Tam olarak ${safeCount} adet soru
- Sıfır emoji kuralı: Cevabında ASLA ve KESİNLİKLE hiçbir emoji, simge veya grafik piktogram kullanma!
- Her sorunun 4 şıkkı (A, B, C, D) olmalı, sadece tek bir şık kesinlikle doğru olmalı, diğer 3 şık öğrencilerin düşebileceği gerçekçi çeldiriciler olmalı.
- Her sorunun ayrıntılı adım adım çözümü ve Merdiye Hoca Sınav Taktiği bulunmalı.

ÇIKTIYI SADECE VE SADECE AŞAĞIDAKİ JSON FORMATINDA GEÇERLİ BİR DİZİ OLARAK DÖNDÜR, BAŞKA HİÇBİR AÇIKLAMA METNİ VEYA MARKDOWN ETİKETİ YAZMA:
[
  {
    "question": "Soru metni...",
    "options": ["Şık 1", "Şık 2", "Şık 3", "Şık 4"],
    "correctIndex": 0,
    "explanation": "Adım adım matematiksel çözüm...",
    "tactic": "Merdiye Hoca Sınav Taktiği: Kısa ve vurucu sınav ipucu..."
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

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API Hatası (${response.status}): ${errBody.slice(0, 150)}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Gemini API'den boş yanıt döndü.");

    // JSON temizleme (olası markdown backtick blokları için)
    const cleanedJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsedList = JSON.parse(cleanedJson);

    if (!Array.isArray(parsedList) || parsedList.length === 0) {
      throw new Error("Gemini API yanıtı beklenen JSON formatında değil.");
    }

    const diffLabels = {
      temel: "Temel (Kazanım)",
      orta: "Orta (PISA / TIMSS)",
      yeni_nesil: "Yeni Nesil (LGS / Beceri Temelli)"
    };

    return parsedList.slice(0, safeCount).map((item, idx) => ({
      id: "gemini-" + Date.now() + "-" + (idx + 1),
      grade: String(grade),
      gradeLabel: `${grade}. Sınıf`,
      topic: topic,
      difficulty: difficulty,
      difficultyLabel: diffLabels[difficulty] || "Yeni Nesil",
      question: String(item.question || ""),
      options: Array.isArray(item.options) && item.options.length === 4 
        ? item.options.map(String) 
        : ["A", "B", "C", "D"],
      correctIndex: typeof item.correctIndex === "number" && item.correctIndex >= 0 && item.correctIndex <= 3 
        ? item.correctIndex 
        : 0,
      explanation: String(item.explanation || ""),
      tactic: String(item.tactic || "Merdiye Hoca Sınav Taktiği: Verilenleri dikkatle inceleyin ve adımları atlamayın."),
      approved: false,
      saved: false
    }));
  }

  // 5. A4 Öğretmen Sınav & Çalışma Kağıdı HTML Çıktı Oluşturucu
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
        <!-- Sınav Başlığı & Öğrenci Bilgi Formu -->
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
          <div class="exam-q-text">${escapeHtml(q.question).replace(/\\n/g, "<br>")}</div>
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

    // Öğretmen Nüshası: Cevap Anahtarı ve Taktik Sayfası
    if (includeAnswerKey) {
      const letters = ["A", "B", "C", "D"];
      html += `
        <div class="exam-page-break"></div>
        <section class="exam-teacher-key-sheet">
          <div class="exam-teacher-key-header">
            <h3>ÖĞRETMEN NÜSHASI: CEVAP ANAHTARI &amp; ÇÖZÜM REHBERİ</h3>
            <p>${escapeHtml(gradeText)} &bull; ${escapeHtml(topicText)} &bull; Toplam ${questions.length} Soru</p>
          </div>

          <!-- Hızlı Cevap Matrisi -->
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

          <!-- Ayrıntılı Çözüm ve Merdiye Hoca Taktik Dökümü -->
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
            <div class="teacher-sol-explanation">${escapeHtml(q.explanation || "").replace(/\\n/g, "<br>")}</div>
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
    buildPrintableExamHtml
  };
});
