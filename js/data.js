/**
 * 618 DONER - DATA FILE
 * =====================
 * To add/edit/remove products: edit the PRODUCTS array below.
 * To add/edit gallery images: edit the GALLERY array below.
 *
 * Product fields:
 *   id       - unique number
 *   name     - product name in Azerbaijani
 *   price    - price as number (e.g. 3.5)
 *   category - "fastfood" | "icecekler" | "setler"
 *   image    - path to image in assets/ folder
 *   desc     - short description shown in modal
 *   popular  - true/false (show on home page)
 */

const PRODUCTS = [
  // ── FAST FOOD ──
  {
    id: 1,
    name: "Dürüm",
    price: 3.5,
    category: "fastfood",
    image: "assets/susi.jpg",
    desc: "Keyfiyyətli dönər əti, təzə tərəvəzlər və xüsusi sous ilə hazırlanmış klassik dürüm. Hər loğmada əsl ləzzət!",
    popular: true
  },
  {
    id: 2,
    name: "Tələbə Dürüm",
    price: 3.0,
    category: "fastfood",
    image: "assets/susi.jpg",
    desc: "Büdcəyə uyğun, eyni keyfiyyətli dönər əti ilə hazırlanmış gənc dürümü. Dadlı və sərfəli!",
    popular: true
  },
  {
    id: 3,
    name: "Duble Dürüm",
    price: 4.5,
    category: "fastfood",
    image: "assets/susi.jpg",
    desc: "İkiqat dönər əti ilə hazırlanmış böyük dürüm. Daha çox ərzaq, daha çox ləzzət – iştahı böyük olanlar üçün ideal!",
    popular: true
  },
  {
    id: 4,
    name: "Mega Dürüm",
    price: 5.5,
    category: "fastfood",
    image: "assets/susi.jpg",
    desc: "Nəhəng porsiya dönər əti, bol tərəvəz və xüsusi sous ilə hazırlanmış mega dürüm. Əsl doyumlu seçim!",
    popular: false
  },
  {
    id: 5,
    name: "Suşi",
    price: 6.0,
    category: "fastfood",
    image: "assets/susi.jpg",
    desc: "Keyfiyyətli dönər əti ilə hazırlanmış xüsusi suşi. Unikal bir ləzzət təcrübəsi – siz də sınayın!",
    popular: true
  },

  // ── SƏRİN İÇKİLƏR ──
  {
    id: 6,
    name: "Fanta 0.5L",
    price: 1.5,
    category: "icecekler",
    image: "assets/fanta.jpg",
    desc: "Soyuq və seyreltici portağal Fanta. Yemək yanında mükəmməl seçim!",
    popular: false
  },
  {
    id: 7,
    name: "Coca-Cola 0.5L",
    price: 1.5,
    category: "icecekler",
    image: "assets/fanta.jpg",
    desc: "Klassik soyuq Coca-Cola. Hər yemək yanında yer alan ikonik içki!",
    popular: false
  },
  {
    id: 8,
    name: "Su 0.5L",
    price: 0.5,
    category: "icecekler",
    image: "assets/fanta.jpg",
    desc: "Soyuq mineral su. Seyrəltici və sağlam!",
    popular: false
  },

  // ── SETLƏR ──
  {
    id: 9,
    name: "Menu 1 (250 qr)",
    price: 7.5,
    category: "setler",
    image: "assets/susi.jpg",
    desc: "250 qramlıq keyfiyyətli dönər əti set menyusu. İçki daxildir. Sərfəli və doyumlu!",
    popular: false
  },
  {
    id: 10,
    name: "Menu 2 (500 qr)",
    price: 15.0,
    category: "setler",
    image: "assets/susi.jpg",
    desc: "500 qramlıq keyfiyyətli dönər əti set menyusu. İçki daxildir. Ailə üçün ideal seçim!",
    popular: true
  },
  {
    id: 11,
    name: "Menu 3 (750 qr)",
    price: 22.0,
    category: "setler",
    image: "assets/susi.jpg",
    desc: "750 qramlıq keyfiyyətli dönər əti set menyusu. İçki daxildir. Böyük şirkətlər üçün əla seçim!",
    popular: false
  },
  {
    id: 12,
    name: "Menu 4 (1000 qr)",
    price: 27.0,
    category: "setler",
    image: "assets/susi.jpg",
    desc: "1000 qramlıq nəhəng dönər əti set menyusu. İçki daxildir. Böyük ziyafət seçimi!",
    popular: false
  }
];

/**
 * GALLERY IMAGES
 * ==============
 * Add/remove image paths here.
 * Images should be in assets/ folder.
 */
const GALLERY_IMAGES = [
  { src: "assets/food1.jpg", alt: "Dönər" },
  { src: "assets/susi.jpg", alt: "Keyfiyyətli ət" },
  { src: "assets/food1.jpg", alt: "Dürüm" },
  { src: "assets/susi.jpg", alt: "Xüsusi ət" },
  { src: "assets/food1.jpg", alt: "Mega dürüm" },
  { src: "assets/susi.jpg", alt: "Ət xörəyi" },
  { src: "assets/fanta.jpg", alt: "Fanta içki" }
];

// Make available globally
window.PRODUCTS = PRODUCTS;
window.GALLERY_IMAGES = GALLERY_IMAGES;
