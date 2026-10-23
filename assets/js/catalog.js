/*
  Bata Shop — catalog and store settings.
  Everything the pages show comes from here: edit products, prices and copy in this file only.
  Photos are taken from @bata_shop1 on Instagram; swap them for studio shots when available.
*/
window.BATA = {
  store: {
    name: "Bata Shop",
    nameAr: "بطة شوب",
    tagline: "The first brand made for hijabi women, from Jordan.",
    taglineAr: "أول براند مختص بملابس المحجبات",
    founder: "By Saja Yaser",
    instagram: "https://www.instagram.com/bata_shop1/",
    whatsapp: "https://wa.me/962700000000",
    phone: "+962 7 0000 0000",
    currency: "JOD",
    freeDeliveryFrom: 60,
    maxQty: 5,
    branches: [
      { name: "Zarqa", detail: "Branch 1 · Street 30" },
      { name: "Amman", detail: "Branch 2 · Jabal Al-Hussein" }
    ]
  },

  categories: [
    { id: "all", label: "All" },
    { id: "sets", label: "Sets" },
    { id: "dresses", label: "Abayas & Dresses" },
    { id: "outerwear", label: "Coats & Jackets" }
  ],

  shades: [
    { id: "beige", label: "Beige" },
    { id: "plum", label: "Plum" },
    { id: "navy", label: "Navy" },
    { id: "brown", label: "Brown" },
    { id: "black", label: "Black" },
    { id: "taupe", label: "Taupe" }
  ],

  sizes: ["S", "M", "L", "XL", "XXL"],

  sortOptions: [
    { id: "featured", label: "Featured" },
    { id: "new", label: "Newest" },
    { id: "price-asc", label: "Price: low to high" },
    { id: "price-desc", label: "Price: high to low" }
  ],

  products: [
    {
      id: "camel-trench-coat",
      name: "Camel Trench Coat",
      nameAr: "ترنش كوت جملي",
      category: "outerwear",
      shade: "beige",
      price: 48,
      badge: "New",
      added: 12,
      image: "assets/img/products/look-10.jpg",
      description: "A long, loose trench in soft camel with a wide collar and striped cuffs. Cut to fall past the knee and close cleanly over a set or an abaya.",
      details: ["Loose, full-length fit", "Wide notch collar", "Striped contrast cuffs", "Mid-weight gabardine"]
    },
    {
      id: "aubergine-suit-set",
      name: "Aubergine Suit Set",
      nameAr: "طقم بدلة باذنجاني",
      category: "sets",
      shade: "plum",
      price: 49,
      badge: "Bestseller",
      added: 9,
      image: "assets/img/products/look-04.jpg",
      description: "A long-line blazer with matching wide-leg trousers in deep aubergine. The blazer reaches mid-thigh, so the set stays modest without layering.",
      details: ["Two pieces: blazer + trousers", "Long-line, single button", "Wide-leg trousers, elastic back", "Crepe suiting"]
    },
    {
      id: "noir-striped-cuff-coat",
      name: "Noir Striped-Cuff Coat",
      nameAr: "كوت أسود بأساور مقلمة",
      category: "outerwear",
      shade: "black",
      price: 52,
      badge: "New",
      added: 11,
      image: "assets/img/products/look-09.jpg",
      description: "A structured black coat with a stand collar, a single row of buttons and blue-striped cuffs. Worn open over trousers or closed as a dress.",
      details: ["Stand collar", "Front button placket", "Striped poplin cuffs", "Ankle length"]
    },
    {
      id: "ivory-flare-abaya",
      name: "Ivory Flare Abaya",
      nameAr: "عباية عاجية واسعة",
      category: "dresses",
      shade: "beige",
      price: 38,
      added: 6,
      image: "assets/img/products/look-02.jpg",
      description: "A clean ivory abaya with flared bell sleeves and a soft front slit. Simple enough for every day, with a shape that moves.",
      details: ["Bell sleeves", "Front walking slit", "Unlined, breathable", "Fits up to size XXL"]
    },
    {
      id: "plum-tatreez-set",
      name: "Plum Tatreez Set",
      nameAr: "طقم تطريز خمري",
      category: "sets",
      shade: "plum",
      price: 55,
      badge: "Limited",
      added: 10,
      image: "assets/img/products/look-03.jpg",
      description: "A plum cape blouse over a skirt woven with traditional tatreez patterns. Made for Eid, weddings and the nights you want to stand out.",
      details: ["Two pieces: cape blouse + skirt", "Tatreez-pattern skirt", "Flowing cape sleeves", "Limited run"]
    },
    {
      id: "indigo-denim-set",
      name: "Indigo Denim Set",
      nameAr: "طقم جينز نيلي",
      category: "sets",
      shade: "navy",
      price: 45,
      added: 8,
      image: "assets/img/products/look-08.jpg",
      description: "A fitted denim jacket with a long A-line skirt in deep indigo. Soft-wash denim that keeps its colour.",
      details: ["Two pieces: jacket + maxi skirt", "Soft-wash denim", "Gold-tone buttons", "Skirt with elastic back"]
    },
    {
      id: "midnight-denim-dress",
      name: "Midnight Denim Dress",
      nameAr: "فستان جينز كحلي",
      category: "dresses",
      shade: "navy",
      price: 34,
      added: 5,
      image: "assets/img/products/look-05.jpg",
      description: "A long, straight denim dress in midnight blue. Easy to wear on its own or under a coat as the weather turns.",
      details: ["Maxi length", "Long sleeves", "Hidden side pockets", "Washed cotton denim"]
    },
    {
      id: "taupe-cord-coord",
      name: "Taupe Cord Co-ord",
      nameAr: "طقم مخمل كوردروي",
      category: "sets",
      shade: "taupe",
      price: 40,
      added: 7,
      image: "assets/img/products/look-12.jpg",
      description: "A relaxed corduroy shirt-jacket with matching wide trousers. Warm, soft and made for winter weekends.",
      details: ["Two pieces: overshirt + trousers", "Fine-wale corduroy", "Patch pockets", "Relaxed fit"]
    },
    {
      id: "chocolate-button-jacket",
      name: "Chocolate Button Jacket",
      nameAr: "جاكيت بني بأزرار",
      category: "outerwear",
      shade: "brown",
      price: 36,
      added: 4,
      image: "assets/img/products/look-11.jpg",
      description: "A short, structured jacket in rich chocolate brown with tonal buttons. Pairs with every skirt and trouser in the shop.",
      details: ["Hip length", "Tonal buttons", "Fully lined", "Brushed twill"]
    },
    {
      id: "navy-cord-jacket",
      name: "Navy Cord Jacket",
      nameAr: "جاكيت كوردروي كحلي",
      category: "outerwear",
      shade: "navy",
      price: 32,
      added: 3,
      image: "assets/img/products/look-06.jpg",
      description: "A soft navy corduroy jacket with a small embroidered motif. The everyday layer of the winter collection.",
      details: ["Relaxed fit", "Embroidered chest motif", "Fine-wale corduroy", "Two front pockets"]
    }
  ],

  reviews: [
    { name: "Raghad", city: "Amman", text: "The trench is exactly like the video. Long enough, and the fabric is heavier than I expected. Delivered the next day." },
    { name: "Hala", city: "Zarqa", text: "I bought the tatreez set for Eid and everyone asked where it was from. The sizing guide was spot on." },
    { name: "Lina", city: "Irbid", text: "Finally sets that are modest without me having to layer three pieces. Ordering again this winter." }
  ],

  cities: [
    { id: "amman", label: "Amman", fee: 2, areas: ["Jabal Al-Hussein", "Abdoun", "Khalda", "Tla' Al-Ali", "Sweileh", "Marka"] },
    { id: "zarqa", label: "Zarqa", fee: 2, areas: ["New Zarqa", "Street 30", "Al-Rusaifa", "Hashemite"] },
    { id: "irbid", label: "Irbid", fee: 3, areas: ["University Street", "Al-Husn", "Downtown"] },
    { id: "salt", label: "Salt", fee: 3, areas: ["Downtown", "Al-Balqa"] },
    { id: "madaba", label: "Madaba", fee: 3, areas: ["Downtown", "Hanina"] },
    { id: "aqaba", label: "Aqaba", fee: 4, areas: ["Downtown", "Al-Rawdah"] },
    { id: "jerash", label: "Jerash", fee: 3, areas: ["Downtown"] },
    { id: "mafraq", label: "Mafraq", fee: 3, areas: ["Downtown"] },
    { id: "karak", label: "Karak", fee: 4, areas: ["Downtown"] }
  ]
};
