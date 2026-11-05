-- ==============================================================================
-- MERDİYE HOCAM LGS MATEMATİK PLATFORMU - SUPABASE VERİTABANI ŞEMASI (DDL)
-- ==============================================================================
-- Bu dosya Supabase Dashboard > SQL Editor alanına yapıştırılıp "Run" butonuna
-- basılarak saniyeler içinde tüm tabloları, RLS kurallarını ve başlangıç föylerini kurar.
-- ==============================================================================

-- 1. Eklentiler (Extensions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLO 1: mh_pdfs (LGS Föy ve Deneme Kütüphanesi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mh_pdfs (
    id VARCHAR(64) PRIMARY KEY,
    unit VARCHAR(100) NOT NULL,
    term VARCHAR(100) NOT NULL DEFAULT 'Genel',
    category VARCHAR(50) NOT NULL DEFAULT 'term1', -- term1, term2, summary, trial
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    difficulty VARCHAR(100) DEFAULT 'LGS Ayarı',
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(50) DEFAULT '105 KB',
    pages VARCHAR(50) DEFAULT '1 Sayfa',
    badge VARCHAR(100) DEFAULT 'MEB Kazanım Uyumlu',
    popular BOOLEAN DEFAULT false,
    topics JSONB DEFAULT '[]'::jsonb,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TABLO 2: mh_leads (Özel Ders & Koçluk Başvuruları)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mh_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'Öğrenci',
    city VARCHAR(100),
    current_net VARCHAR(50),
    target_school VARCHAR(150),
    notes TEXT,
    admin_notes TEXT,
    status VARCHAR(50) DEFAULT 'Yeni' -- 'Yeni', 'Görüşüldü', 'Kayıt Yapıldı', 'İptal'
);

-- ==============================================================================
-- TABLO 3: mh_analytics (Ziyaretçi & İndirme Logları)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mh_analytics (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'pdf_download', 'simulator_calc', 'quiz_complete'
    page VARCHAR(255),
    pdf_id VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- TABLO 4: mh_quiz_questions (Günün Sorusu & Mini Deneme Soruları)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mh_quiz_questions (
    id SERIAL PRIMARY KEY,
    unit VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
    explanation TEXT,
    difficulty VARCHAR(50) DEFAULT 'LGS Ayarı',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- TABLO 5: mh_posts (YouTube & Instagram Yayınlama Geçmişi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mh_posts (
    id VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    platforms JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    privacy VARCHAR(50) DEFAULT 'public',
    results JSONB DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- RLS (ROW LEVEL SECURITY) POLİTİKALARI
-- ==============================================================================
ALTER TABLE public.mh_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mh_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mh_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mh_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mh_posts ENABLE ROW LEVEL SECURITY;

-- Güvenli Temizlik (Önceki politikalar varsa kaldır)
DROP POLICY IF EXISTS "Public Read Pdfs" ON public.mh_pdfs;
DROP POLICY IF EXISTS "Public Read Quiz" ON public.mh_quiz_questions;
DROP POLICY IF EXISTS "Public Read Posts" ON public.mh_posts;
DROP POLICY IF EXISTS "Public Insert Leads" ON public.mh_leads;
DROP POLICY IF EXISTS "Public Insert Analytics" ON public.mh_analytics;
DROP POLICY IF EXISTS "Service Role & Anon Full Access Pdfs" ON public.mh_pdfs;
DROP POLICY IF EXISTS "Service Role & Anon Full Access Leads" ON public.mh_leads;
DROP POLICY IF EXISTS "Service Role & Anon Full Access Analytics" ON public.mh_analytics;
DROP POLICY IF EXISTS "Service Role & Anon Full Access Quiz" ON public.mh_quiz_questions;
DROP POLICY IF EXISTS "Service Role & Anon Full Access Posts" ON public.mh_posts;

-- 1. Herkes Föyleri Okuyabilir (Public Read)
CREATE POLICY "Public Read Pdfs" ON public.mh_pdfs FOR SELECT USING (true);

-- 2. Herkes Quiz Sorularını Okuyabilir (Public Read)
CREATE POLICY "Public Read Quiz" ON public.mh_quiz_questions FOR SELECT USING (true);

-- 3. Herkes Yayınlanan Gönderileri Okuyabilir (Public Read)
CREATE POLICY "Public Read Posts" ON public.mh_posts FOR SELECT USING (true);

-- 4. Herkes Özel Ders Başvurusu Gönderebilir (Public Insert)
CREATE POLICY "Public Insert Leads" ON public.mh_leads FOR INSERT WITH CHECK (true);

-- 5. Herkes Analitik Ziyaret Logu Ekleyebilir (Public Insert)
CREATE POLICY "Public Insert Analytics" ON public.mh_analytics FOR INSERT WITH CHECK (true);

-- 6. Yönetim & CRUD İzinleri (Admin ve API İstemcisi)
CREATE POLICY "Anon & Auth Full Access Pdfs" ON public.mh_pdfs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon & Auth Full Access Leads" ON public.mh_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon & Auth Full Access Analytics" ON public.mh_analytics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon & Auth Full Access Quiz" ON public.mh_quiz_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon & Auth Full Access Posts" ON public.mh_posts FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- YARDIMCI RPC FONKSİYONU: Föy İndirme Sayacını Artırma (Atomic Counter)
-- ==============================================================================
CREATE OR REPLACE FUNCTION increment_pdf_downloads(target_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.mh_pdfs
    SET downloads_count = downloads_count + 1
    WHERE id = target_id;
END;
$$;

-- ==============================================================================
-- BAŞLANGIÇ VERİLERİ (SEED DATA) - 14 LGS MATEMATİK FÖYÜ
-- ==============================================================================
INSERT INTO public.mh_pdfs (id, unit, term, category, title, subtitle, difficulty, filename, file_url, file_size, pages, badge, popular, topics)
VALUES
(
    'pdf-01', '1. Ünite', '1. Dönem', 'term1',
    'Çarpanlar ve Katlar & EBOB - EKOK',
    'Asal Çarpanlara Ayırma, Aralarında Asallık ve Yeni Nesil Problemler',
    'Temel - Orta - Yeni Nesil',
    '01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf',
    'assets/pdf/01_Carpanlar_ve_Katlar_EBOB_EKOK.pdf',
    '105 KB', '1 Sayfa (Özet & Soru)', 'MEB Kazanım Uyumlu', true,
    '["Asal Çarpanlar", "EBOB", "EKOK", "Aralarında Asal", "Bölünebilme"]'::jsonb
),
(
    'pdf-02', '1. Ünite', '1. Dönem', 'term1',
    'Üslü İfadeler ve Bilimsel Gösterim',
    'Negatif Üs, Üslü Sayılarda Çarpma/Bölme, Çözümleme ve Bilimsel Gösterim',
    'Yeni Nesil Mantık & Muhakeme',
    '02_Uslu_Ifadeler_Hap_Bilgiler_ve_Sorular.pdf',
    'assets/pdf/02_Uslu_Ifadeler_Hap_Bilgiler_ve_Sorular.pdf',
    '105 KB', '1 Sayfa (Özet & Soru)', 'Çok Çıkan Konu', true,
    '["Negatif Üs", "Üssün Üssü", "Çözümleme", "Bilimsel Gösterim", "Basamak Sayısı"]'::jsonb
),
(
    'pdf-03', '2. Ünite', '1. Dönem', 'term1',
    'Kareköklü İfadeler & Yaklaşık Değer',
    'Tam Kareler, a√b Yazımı, Köklü Sayılarda 4 İşlem ve Gerçek Sayılar',
    'LGS Standart & Üst Seviye',
    '03_Karekoklu_Ifadeler_Yeni_Nesil.pdf',
    'assets/pdf/03_Karekoklu_Ifadeler_Yeni_Nesil.pdf',
    '105 KB', '1 Sayfa (Özet & Soru)', 'LGS Banko 3 Soru', true,
    '["Tam Kare Sayılar", "Yaklaşık Değer", "a√b Yazımı", "Kökten Kurtarma", "Gerçek Sayılar"]'::jsonb
),
(
    'pdf-04', '2. Ünite', '1. Dönem', 'term1',
    'Veri Analizi & Grafik Dönüşümleri',
    'Çizgi, Sütun ve Daire Grafikleri Arası Dönüşüm & Merkez Açı Orantısı',
    'Grafik Okuma & Yorumlama',
    '04_Veri_Analizi_Grafik_Yorumlama.pdf',
    'assets/pdf/04_Veri_Analizi_Grafik_Yorumlama.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'Kolay Net Fırsatı', false,
    '["Daire Grafiği", "Sütun Grafiği", "Çizgi Grafiği", "Merkez Açı", "Oran-Orantı"]'::jsonb
),
(
    'pdf-05', '3. Ünite', '1. Dönem', 'term1',
    'Basit Olayların Olma Olasılığı',
    'Olası Durumlar, İstenen Olay, Kesin & İmkansız Olay ve Olasılık Hesabı',
    'Yeni Nesil Kurgulu Sorular',
    '05_Basit_Olaylarin_Olma_Olasiligi.pdf',
    'assets/pdf/05_Basit_Olaylarin_Olma_Olasiligi.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'MEB Soru Formatı', false,
    '["Olası Durumlar", "İstenen Olay", "Kesin Olay", "İmkansız Olay", "Eş Olasılık"]'::jsonb
),
(
    'pdf-06', '3. Ünite', '1. Dönem', 'term1',
    'Cebirsel İfadeler ve Özdeşlikler',
    'İki Kare Farkı, Tam Kare Özdeşlikleri ve Geometrik Alan Modelleme',
    'LGS Banko 2 Soru',
    '06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf',
    'assets/pdf/06_Cebirsel_Ifadeler_ve_Ozdeslikler.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'Altın Konu', true,
    '["(a+b)²", "(a-b)²", "a²-b²", "Ortak Çarpan", "Geometrik Modelleme"]'::jsonb
),
(
    'pdf-07', '4. Ünite', '2. Dönem', 'term2',
    'Doğrusal Denklemler & Eğim',
    'Birinci Dereceden Denklemler, Koordinat Sistemi, Doğru Grafiği ve Eğim',
    'Analitik Düşünme & Sınav Ayarı',
    '07_Dogrusal_Denklemler_ve_Egim.pdf',
    'assets/pdf/07_Dogrusal_Denklemler_ve_Egim.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'LGS 2. Dönem', false,
    '["Doğrusal İlişki", "Koordinat Sistemi", "Eğim (m)", "Doğru Grafiği", "Denklem Çözümü"]'::jsonb
),
(
    'pdf-08', '4. Ünite', '2. Dönem', 'term2',
    'Eşitsizlikler ve Sayı Doğrusu',
    'Birinci Dereceden Bir Bilinmeyenli Eşitsizlikler ve Sayı Doğrusunda Gösterim',
    'Dikkat Gerektiren Soru Tipleri',
    '08_Esitsizlikler_Soru_Foyu.pdf',
    'assets/pdf/08_Esitsizlikler_Soru_Foyu.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'Tuzak Sorular', false,
    '["Eşitsizlik Sembolleri", "Sayı Doğrusu", "Negatifle Çarpma/Bölme", "Gerçek Hayat Durumları"]'::jsonb
),
(
    'pdf-09', '5. Ünite', '2. Dönem', 'term2',
    'Üçgenler ve Yardımcı Elemanlar',
    'Kenarortay, Açıortay, Yükseklik, Üçgen Eşitsizliği ve Açı-Kenar Bağıntıları',
    'Geometri Temeli & Çizim',
    '09_Ucgenler_ve_Bagintilar.pdf',
    'assets/pdf/09_Ucgenler_ve_Bagintilar.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'Geometri Temeli', false,
    '["Kenarortay", "Açıortay", "Yükseklik", "Üçgen Eşitsizliği", "Açı-Kenar İlişkisi"]'::jsonb
),
(
    'pdf-10', '5. Ünite', '2. Dönem', 'term2',
    'Pisagor Bağıntısı ve Özel Üçgenler',
    'Dik Üçgende Pisagor Teoremi, 3-4-5, 5-12-13, 8-15-17 Özel Üçgenleri',
    'En Çok Soru Çıkan Geometri Konusu',
    '10_Pisagor_Bagintisi_ve_Ozel_Ucgenler.pdf',
    'assets/pdf/10_Pisagor_Bagintisi_ve_Ozel_Ucgenler.pdf',
    '105 KB', '1 Sayfa (Özet & Soru)', 'En Çok Soru Çıkan', true,
    '["a²+b²=c²", "3-4-5 Üçgeni", "5-12-13 Üçgeni", "8-15-17 Üçgeni", "Hipotenüs"]'::jsonb
),
(
    'pdf-11', '5. Ünite', '2. Dönem', 'term2',
    'Eşlik ve Benzerlik Kuralları',
    'Eş Çokgenler, Benzer Çokgenler, Benzerlik Oranı ve Alan/Çevre İlişkisi',
    'Görsel Algı & Oran-Orantı',
    '11_Eslik_ve_Benzerlik.pdf',
    'assets/pdf/11_Eslik_ve_Benzerlik.pdf',
    '104 KB', '1 Sayfa (Özet & Soru)', 'Şekil Yorumlama', false,
    '["Eşlik Sembolü", "Benzerlik Oranı k", "Çevre Oranı", "Alan Oranı k²", "Ölçek"]'::jsonb
),
(
    'pdf-12', '6. Ünite', '2. Dönem', 'term2',
    'Geometrik Cisimler (Prizma, Silindir, Koni)',
    'Dik Prizmalar, Silindirin Açınımı, Alan & Hacim, Dik Piramit ve Koni Bağıntısı',
    '3 Boyutlu Düşünme & Sınav Soruları',
    '12_Geometrik_Cisimler.pdf',
    'assets/pdf/12_Geometrik_Cisimler.pdf',
    '105 KB', '1 Sayfa (Özet & Soru)', 'LGS Son Ünite', false,
    '["Prizmalar", "Silindir Açınımı", "Yanal Alan 2πrh", "Hacim πr²h", "Koni r/l=α/360"]'::jsonb
),
(
    'pdf-13', 'Tüm Konular', 'Genel Tekrar', 'summary',
    'LGS Matematik Altın Formüller & Sınav Taktikleri',
    '8. Sınıf Müfredatının Eksiksiz Formül Özeti, Hızlı Çözüm İpuçları ve Zaman Yönetimi',
    'Tüm Öğrenciler İçin Başvuru',
    '13_LGS_Matematik_Altin_Formuller_Kitapcigi.pdf',
    'assets/pdf/13_LGS_Matematik_Altin_Formuller_Kitapcigi.pdf',
    '106 KB', 'Tüm Formüller Tek Sayfada', '⭐ EN ÇOK İNDİRİLEN', true,
    '["Tüm Formüller", "Hızlı Taktikler", "Süre Yönetimi", "Turlama Tekniği", "Hap Notlar"]'::jsonb
),
(
    'pdf-14', 'Genel Deneme', 'Deneme Sınavı', 'trial',
    'LGS Matematik Yeni Nesil Pro Deneme - 1',
    'MEB Sınav Formatına %100 Uyumlu, Beceri Temelli 20 Soru & Ayrıntılı Cevap Anahtarı',
    'LGS Gerçek Sınav Provası',
    '14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf',
    'assets/pdf/14_LGS_Matematik_Yeni_Nesil_Pro_Deneme_1.pdf',
    '104 KB', '20 Soru + Cevap Anahtarı', '🔥 2025/2026 PROVA', true,
    '["20 Yeni Nesil Soru", "Cevap Anahtarı", "Optik Form Rehberi", "Net Skalası", "MEB Uyum"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    unit = EXCLUDED.unit,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    file_size = EXCLUDED.file_size,
    badge = EXCLUDED.badge,
    popular = EXCLUDED.popular,
    topics = EXCLUDED.topics,
    updated_at = timezone('utc'::text, now());

-- ==============================================================================
-- BAŞLANGIÇ VERİLERİ (SEED DATA) - 5 LGS MİNİ DENEME SORUSU
-- ==============================================================================
INSERT INTO public.mh_quiz_questions (unit, question_text, options, correct_index, explanation, difficulty)
VALUES
(
    '1. Ünite - Çarpanlar ve Katlar',
    'Kenar uzunlukları 48 metre ve 60 metre olan dikdörtgen biçimindeki bir bahçenin etrafına, köşelere de gelmek şartıyla eşit aralıklarla fidan dikilecektir. Bu iş için en az kaç fidan gereklidir?',
    '["16", "18", "20", "24"]'::jsonb,
    1,
    'EBOB(48, 60) = 12 metredir. Dikdörtgenin çevresi = 2 × (48 + 60) = 216 metredir. Fidan sayısı = Çevre / EBOB = 216 / 12 = 18 fidandır.',
    'LGS Standart'
),
(
    '1. Ünite - Üslü İfadeler',
    'Bir laboratuvardaki bakteri sayısı her saat başında 4 katına çıkmaktadır. Başlangıçta 8³ adet bakteri bulunan bu kaba 5 saat sonra kaç adet bakteri bulunur?',
    '["2¹⁷", "2¹⁸", "2¹⁹", "2²⁰"]'::jsonb,
    2,
    'Başlangıç = 8³ = (2³)³ = 2⁹ bakteri. 5 saatte 5 kez 4 katına (2² katına) çıkar: 2⁹ × (2²)⁵ = 2⁹ × 2¹⁰ = 2¹⁹ bakteridir.',
    'LGS Orta'
),
(
    '2. Ünite - Kareköklü İfadeler',
    'Alanı 108 cm² olan bir karenin bir kenar uzunluğu hangi iki ardışık tam sayı arasındadır?',
    '["10 ile 11", "9 ile 10", "11 ile 12", "8 ile 9"]'::jsonb,
    0,
    'Karenin kenarı = √108 cm''dir. 100 < 108 < 121 olduğundan √100 < √108 < √121 yani 10 < √108 < 11 bulunur.',
    'LGS Temel'
),
(
    '3. Ünite - Cebirsel İfadeler',
    'Bir kenarı x cm olan kare şeklindeki kartonun dört köşesinden kenar uzunluğu y cm olan 4 adet kare kesilip atılıyor. Kalan bölgenin alanını veren cebirsel ifade hangisidir?',
    '["(x - 2y)²", "(x - y) · (x + y)", "x² - 2y²", "(x - 2y) · (x + 2y)"]'::jsonb,
    3,
    'Başlangıç alanı = x². Kesilen 4 karenin toplam alanı = 4y². Kalan alan = x² - 4y² = x² - (2y)² = (x - 2y)(x + 2y) iki kare farkıdır.',
    'LGS Sınav Ayarı'
),
(
    '5. Ünite - Pisagor Bağıntısı',
    'Bir dik üçgende dik kenar uzunlukları 9 cm ve 12 cm olduğuna göre, bu dik üçgenin hipotenüs uzunluğu kaç santimetredir?',
    '["13 cm", "14 cm", "15 cm", "17 cm"]'::jsonb,
    2,
    '3-4-5 özel üçgeninin 3 katı: 3×3=9, 4×3=12, 5×3=15 cm''dir. Pisagor: 9² + 12² = 81 + 144 = 225 = 15².',
    'LGS Temel'
)
ON CONFLICT DO NOTHING;
