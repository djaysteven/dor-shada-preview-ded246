(function () {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const form = document.getElementById("inquiryForm");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuScrim = document.getElementById("menuScrim");
  const menuClose = document.getElementById("menuClose");
  let menuClosingTimer = null;
  let menuScrollY = 0;

  function setMenu(open) {
    if (!mobileNav || !menuBtn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuClosingTimer) {
      clearTimeout(menuClosingTimer);
      menuClosingTimer = null;
    }
    const d = (typeof i18nDicts !== "undefined" && i18nDicts[currentLang]) || {};
    if (open) {
      mobileNav.hidden = false;
      if (menuScrim) menuScrim.hidden = false;
      menuScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add("menu-open");
      document.body.classList.add("menu-open");
      document.body.style.top = "-" + menuScrollY + "px";
      if (reduce) {
        mobileNav.classList.add("open");
        if (menuScrim) menuScrim.classList.add("open");
      } else {
        void mobileNav.offsetWidth;
        requestAnimationFrame(() => {
          mobileNav.classList.add("open");
          if (menuScrim) menuScrim.classList.add("open");
        });
      }
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", d["aria.menuClose"] || "Close menu");
      const focusEl = menuClose || mobileNav.querySelector("a, button");
      if (focusEl) setTimeout(() => focusEl.focus(), reduce ? 0 : 50);
    } else {
      mobileNav.classList.remove("open");
      if (menuScrim) menuScrim.classList.remove("open");
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      document.body.style.top = "";
      window.scrollTo(0, menuScrollY);
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", d["aria.menuOpen"] || "Open menu");
      const hide = () => {
        mobileNav.hidden = true;
        if (menuScrim) menuScrim.hidden = true;
        menuClosingTimer = null;
      };
      if (reduce) hide();
      else menuClosingTimer = setTimeout(hide, 340);
      menuBtn.focus();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(!mobileNav.classList.contains("open")));
  }
  if (menuClose) menuClose.addEventListener("click", () => setMenu(false));
  if (menuScrim) menuScrim.addEventListener("click", () => setMenu(false));
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
  }
  function menuFocusables() {
    if (!mobileNav) return [];
    return Array.from(
      mobileNav.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => {
      if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!mobileNav || !mobileNav.classList.contains("open")) return;
    if (e.key === "Escape") {
      setMenu(false);
      return;
    }
    if (e.key !== "Tab") return;
    const list = menuFocusables();
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });


  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      i18nAlert("form.alert", "Thanks! This is a front-end demo — inquiry submit is demo-only and will be connected after they invest. Please call, email, or call or email reservations for now.");
    });
  }

  const els = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }


  /* --- i18n: TH/EN flag selector (embedded dicts for file:// + JSON files kept) --- */
  const LANG_KEY = "pattaya-demo-lang";
  const i18nDicts = {
    en: {"meta.title": "Dor-Shada Resort by The Sea | Na Jomtien", "meta.description": "Dor-Shada Resort by The Sea — 5-star Thai-style resort in Na Jomtien with outdoor pool, spa, fitness, and beachfront dining. Sukhumvit Road, Chonburi.", "aria.home": "Dor-Shada Resort by The Sea home", "aria.primaryNav": "Primary", "aria.menuOpen": "Open menu", "aria.menuClose": "Close menu", "aria.langSwitch": "Language", "aria.gallery": "Resort photo gallery", "aria.menuDialog": "Menu", "nav.rooms": "Rooms", "nav.amenities": "Amenities", "nav.gallery": "Gallery", "nav.about": "About", "nav.location": "Location", "nav.book": "Book", "nav.contact": "Contact", "nav.compare": "Compare live vs upgrade", "nav.cta": "Book now", "hero.pill": "Na Jomtien · Sukhumvit Road · By the sea", "hero.title": "Dor-Shada <em>Resort by The Sea</em>", "hero.tagline": "Thai-style calm between garden, pool, and sea", "hero.lead": "Nestled in lush greenery in Na Jomtien, Dor-Shada Resort offers 5-star accommodations with modern Thai-style rooms, private balconies, an outdoor pool with poolside bar, full-service spa, fitness center, and beachfront dining with sweeping sea views.", "hero.ctaBook": "Send booking inquiry", "hero.ctaEmail": "Email reservations", "stat.roomsStrong": "10", "stat.roomsSpan": "room & suite types", "stat.poolStrong": "Pool", "stat.poolSpan": "& poolside bar", "stat.spaStrong": "Spa", "stat.spaSpan": "& fitness", "float.a.strong": "Pool & sea breeze", "float.a.span": "Outdoor pool with loungers in lush Na Jomtien greenery", "float.b.strong": "Private balconies", "float.b.span": "Garden, pool, or sea views across room types", "alt.hero": "Dor-Shada Resort outdoor pool with sea beyond the palms", "loc.band": "On <strong>Sukhumvit Road</strong>, Tambon Na Chom Thian, Chonburi 20250 — a green Na Jomtien retreat with pool, spa, and sea-facing dining.", "rooms.label": "Rooms & suites", "rooms.title": "Modern Thai-style stays", "rooms.lead": "Ten room and suite types from the live site — air-conditioned, soundproofed options with terraces or balconies overlooking garden, pool, or sea.", "rooms.typesTitle": "Room types from the live site", "feat.ac.h": "Air conditioning", "feat.ac.p": "Cool, quiet rooms with soundproof walls across the property.", "feat.tv.h": "Flat-screen cable TV", "feat.tv.p": "Cable flat-screen TVs in rooms and suites.", "feat.bath.h": "Private bathrooms", "feat.bath.p": "Walk-in showers, bathtubs or Jacuzzi in select suites, toiletries & hairdryer.", "feat.safe.h": "In-room safe", "feat.safe.p": "Safe and refrigerator in each room for a carefree stay.", "feat.balcony.h": "Private balconies", "feat.balcony.p": "Spacious seating areas with sofas and outdoor terraces or balconies.", "feat.wifi.h": "Complimentary WiFi", "feat.wifi.p": "Stay connected throughout the resort at no extra charge.", "room.family.h": "Deluxe family", "room.family.p": "Generously sized family room with air conditioning and soundproof walls, terrace with garden views, private bathroom with walk-in shower, 1 king bed and bunk bed.", "room.grand.h": "Deluxe Grand Suite", "room.grand.p": "Living room, two bedrooms, two bathrooms with walk-in showers and toiletries, kitchenette with refrigerator and microwave, tea & coffee, flat-screen cable TV, garden views, king bed plus a 4-foot bed.", "room.deluxe.h": "Deluxe room", "room.deluxe.p": "Spacious room with air conditioning and soundproof walls, terrace with garden views, private bathroom with walk-in shower, two beds or 1 king bed.", "room.dor.h": "Dor-Shada Suite 1 bedroom", "room.dor.p": "Wooden flooring, private balcony with sea views, and a bathroom featuring a Jacuzzi bathtub.", "room.elegant.h": "Elegant Suite 2 bedrooms", "room.elegant.p": "Spa bath, living room, two bedrooms, two bathrooms with walk-in showers, kitchenette with refrigerator and microwave, minibar, tea & coffee, flat-screen cable TV, stunning sea views, 2 king beds.", "room.new.h": "New Deluxe room", "room.new.p": "Spacious room with air conditioning and soundproof walls, terrace with garden views, private bathroom with walk-in shower, two beds or 1 king bed.", "room.poolAccess.h": "Pool Access room", "room.poolAccess.p": "First-floor room with a large private balcony and direct access to the pool from the balcony.", "room.poolFamily.h": "Pool Access room family", "room.poolFamily.p": "Family suite with air conditioning and soundproof walls, terrace with pool views, private bathroom with walk-in shower, 1 king bed and bunk bed.", "room.poolViewFamily.h": "Pool View room family", "room.poolViewFamily.p": "Family room with air conditioning and soundproof walls, terrace with sea and pool views, private bathroom with walk-in shower, 1 king bed and bunk bed.", "room.poolBalcony.h": "Pool View room with balcony", "room.poolBalcony.p": "Air conditioning and soundproof walls, terrace with sea and pool views, private bathroom with walk-in shower, 1 king bed or twin beds.", "room.chip.garden": "Garden terrace", "room.chip.family": "Family", "room.chip.suite": "Suite", "room.chip.kitchenette": "Kitchenette", "room.chip.sea": "Sea view", "room.chip.jacuzzi": "Jacuzzi", "room.chip.spaBath": "Spa bath", "room.chip.poolAccess": "Pool access", "room.chip.pool": "Pool view", "room.chip.seaPool": "Sea & pool", "room.chip.balcony": "Balcony", "alt.roomFamily": "Deluxe family room with king bed and bunk bed", "alt.roomGrand": "Deluxe Grand Suite living space", "alt.roomDeluxe": "Deluxe room with terrace", "alt.roomDor": "Dor-Shada Suite with sea-view balcony", "alt.roomElegant": "Elegant Suite with spa bath", "alt.roomNew": "New Deluxe room", "alt.roomPoolAccess": "Pool Access room balcony", "alt.roomPoolFamily": "Pool Access family room", "alt.roomPoolViewFamily": "Pool View family room", "alt.roomPoolBalcony": "Pool View room with balcony", "fac.label": "Amenities", "fac.title": "Resort facilities", "fac.lead": "From the resort’s published About Us — pool, spa, fitness, dining, and practical conveniences.", "fac.pool": "Outdoor pool & poolside bar", "fac.spa": "Full-service spa", "fac.fitness": "Fitness center", "fac.restaurant": "Beachfront restaurant · Thai & international", "fac.bbq": "Barbecue arrangements", "fac.roomService": "Room service", "fac.wifi": "Complimentary WiFi", "fac.parking": "Free on-site parking", "fac.tour": "Tour desk", "alt.poolLoungers": "Pool deck with loungers and umbrellas", "alt.spa": "Resort spa and wellness area", "alt.restaurant": "Beachfront dining with sea views", "gal.label": "Gallery", "gal.title": "Property & rooms", "gal.lead": "Real photos from dor-shadaresort.com — pool, grounds, and guest rooms.", "alt.gal1": "Pool at sunset", "alt.gal2": "Pool with Thai Naga statues", "alt.gal3": "Wide view of the outdoor pool", "alt.gal4": "Sea view near the resort", "alt.gal5": "Resort exterior architecture", "alt.gal6": "Pool corridor toward the horizon", "alt.gal7": "Dining area", "alt.gal8": "Guest room interior", "alt.gal9": "Private balcony", "alt.gal10": "Resort grounds", "alt.gal11": "Garden pathway", "alt.gal12": "Pool in the evening", "about.label": "About us", "about.title": "A green Na Jomtien retreat", "about.p1": "Nestled in lush greenery, Dor-Shada Resort offers 5-star accommodations with cable flat-screen TVs and complimentary WiFi. Located in Na Jomtien, with an outdoor pool with a poolside bar, and a full-service spa.", "about.p2": "The modern Thai-style rooms come with private balconies and spacious seating areas with sofas. Each room is equipped with a safe, refrigerator, and a private bathroom that includes a bathtub and hairdryer.", "about.p3": "Guests can stay active at the well-equipped fitness center. The resort also provides a tour desk and free on-site parking.", "about.p4": "Enjoy Thai and international cuisine with sweeping sea views at the beachfront restaurant, or arrange a barbecue party. Room service is also available for added convenience.", "alt.about": "Dor-Shada Resort pool nestled in tropical greenery", "inq.label": "Book", "inq.title": "Reservation inquiry", "inq.lead": "Tell us your dates — call or email reservations, or send the form below.", "form.name": "Full name", "form.namePh": "Your name", "form.email": "Email", "form.emailPh": "you@email.com", "form.phone": "Phone", "form.phonePh": "+66 …", "form.guests": "Guests", "form.g1": "1 guest", "form.g2": "2 guests", "form.g3": "3 guests", "form.g4": "4+ guests", "form.checkin": "Check-in", "form.checkout": "Check-out", "form.message": "Message / room preferences", "form.messagePh": "Room type preferences or questions…", "form.submit": "Send inquiry", "form.note": "Demo only — inquiry submit is not connected yet. Live booking is wired after they invest. Call or email reservations anytime.", "form.alert": "Thanks! This is a front-end demo — inquiry submit is demo-only and will be connected after they invest. Please call or email reservations for now.", "contact.label": "Contact", "contact.title": "Reservations & welcome", "contact.lead": "Reach the resort on Sukhumvit Road, Na Chom Thian.", "contact.address": "Address", "contact.map": "Open in Google Maps", "contact.phone": "Telephone", "contact.phoneNote": "As published on dor-shadaresort.com", "contact.emailSocial": "Email & social", "contact.call": "Call resort", "contact.emailUs": "Email reservations", "contact.bookCta": "Booking inquiry", "extras.launchTitle": "Launch checklist", "extras.launchIntro": "What’s included in the build package after they invest — not live changes yet.", "extras.li1Strong": "Google Business Profile cleanup", "extras.li1Rest": " — categories, photos, hours, and description polish as a post-invest / launch service (we do not claim their live GBP was already changed).", "extras.li2Strong": "Thai + English SEO basics", "extras.li2Rest": " — bilingual title & meta description, hreflang-ready markup, meaningful image alt text in EN + TH.", "extras.li3Strong": "Inquiry & booking CTAs", "extras.li3Rest": " — phone, email, and reservation form wired when back-end goes live.", "extras.seoStrong": "SEO note (EN / TH):", "extras.seoRest": " Page title and meta description update with the language toggle. Key image alt text is bilingual.", "extras.careTitle": "After go-live · Monthly site care", "extras.careLead": "A simple monthly care plan keeps the resort site fresh and reliable:", "extras.care1": "Content updates & small edits", "extras.care2": "Uptime checks", "extras.care3": "Backup of site files", "extras.care4": "Minor SEO / listing tweaks as needed", "extras.carePrice": "Priced & connected after they invest.", "extras.careCta": "Ask about monthly care", "footer.tagline": "<strong>Dor-Shada Resort by The Sea</strong> — Na Jomtien", "footer.compare": "Compare live vs upgrade →", "footer.demo": "Front-end demo — bookings/payments not connected yet; paid back-end after they invest. Photos & copy from dor-shadaresort.com.", "footer.vantage": "— demo redesign by Vantage. Brand wordmark above is Dor-Shada; Vantage is agency attribution only.", "sticky.call": "Call", "sticky.email": "Email", "menu.close": "Close", "theme.appearance": "Appearance", "theme.dark": "Dark", "theme.light": "Light", "theme.darkAnnounce": "Dark theme", "theme.lightAnnounce": "Light theme"},
    th: {"meta.title": "ดอร์ชาดา รีสอร์ท บาย เดอะ ซี | นาจอมเทียน", "meta.description": "ดอร์ชาดา รีสอร์ท บาย เดอะ ซี — ที่พักสไตล์ไทย 5 ดาวที่นาจอมเทียน สระว่ายน้ำกลางแจ้ง สปา ฟิตเนส และร้านอาหารริมทะเล ถนนสุขุมวิท ชลบุรี", "aria.home": "หน้าแรก ดอร์ชาดา รีสอร์ท บาย เดอะ ซี", "aria.primaryNav": "เมนูหลัก", "aria.menuOpen": "เปิดเมนู", "aria.menuClose": "ปิดเมนู", "aria.langSwitch": "ภาษา", "aria.gallery": "แกลเลอรีรูปภาพรีสอร์ท", "aria.menuDialog": "เมนู", "nav.rooms": "ห้องพัก", "nav.amenities": "สิ่งอำนวยความสะดวก", "nav.gallery": "แกลเลอรี", "nav.about": "เกี่ยวกับเรา", "nav.location": "ที่ตั้ง", "nav.book": "จองห้อง", "nav.contact": "ติดต่อ", "nav.compare": "เทียบเว็บจริงกับเวอร์ชันอัปเกรด", "nav.cta": "จองเลย", "hero.pill": "นาจอมเทียน · ถนนสุขุมวิท · ริมทะเล", "hero.title": "Dor-Shada <em>Resort by The Sea</em>", "hero.tagline": "ความสงบแบบไทย ระหว่างสวน สระ และทะเล", "hero.lead": "ท่ามกลางความเขียวขจีที่นาจอมเทียน ดอร์ชาดา รีสอร์ท มอบที่พักระดับ 5 ดาวพร้อมห้องสไตล์ไทยร่วมสมัย ระเบียงส่วนตัว สระว่ายน้ำกลางแจ้งพร้อมบาร์ริมสระ สปาครบวงจร ฟิตเนส และร้านอาหารริมทะเลวิวสวย", "hero.ctaBook": "ส่งคำถามจองห้อง", "hero.ctaEmail": "อีเมลจองห้อง", "stat.roomsStrong": "10", "stat.roomsSpan": "ประเภทห้องและสวีท", "stat.poolStrong": "สระว่ายน้ำ", "stat.poolSpan": "และบาร์ริมสระ", "stat.spaStrong": "สปา", "stat.spaSpan": "และฟิตเนส", "float.a.strong": "สระและลมทะเล", "float.a.span": "สระกลางแจ้งพร้อมเก้าอี้ร่ม ในบรรยากาศเขียวขจีนาจอมเทียน", "float.b.strong": "ระเบียงส่วนตัว", "float.b.span": "วิวสวน สระ หรือทะเล ตามประเภทห้อง", "alt.hero": "สระน้ำกลางแจ้งดอร์ชาดา รีสอร์ท พร้อมวิวทะเลไกลออกไป", "loc.band": "บน<strong>ถนนสุขุมวิท</strong> ตำบลนาจอมเทียน จังหวัดชลบุรี 20250 — ที่พักเขียวขจีนาจอมเทียน พร้อมสระ สปา และร้านอาหารหันทะเล", "rooms.label": "ห้องพักและสวีท", "rooms.title": "ที่พักสไตล์ไทยร่วมสมัย", "rooms.lead": "สิบประเภทห้องและสวีทจากเว็บจริง — แอร์ ผนังกันเสียง พร้อมระเบียงหรือเทอร์เรซวิวสวน สระ หรือทะเล", "rooms.typesTitle": "ประเภทห้องจากเว็บจริง", "feat.ac.h": "เครื่องปรับอากาศ", "feat.ac.p": "ห้องเย็นเงียบ พร้อมผนังกันเสียงทั่วทั้งรีสอร์ท", "feat.tv.h": "ทีวีจอแบนเคเบิล", "feat.tv.p": "ทีวีจอแบนเคเบิลในห้องพักและสวีท", "feat.bath.h": "ห้องน้ำส่วนตัว", "feat.bath.p": "ฝักบัววอล์กอิน อ่างอาบน้ำหรือจากุซซี่ในสวีทบางประเภท ของใช้และไดร์เป่าผม", "feat.safe.h": "ตู้เซฟในห้อง", "feat.safe.p": "ตู้เซฟและตู้เย็นในทุกห้อง เพื่อความสบายใจ", "feat.balcony.h": "ระเบียงส่วนตัว", "feat.balcony.p": "โซฟานั่งเล่นกว้าง และเทอร์เรซหรือระเบียงกลางแจ้ง", "feat.wifi.h": "WiFi ฟรี", "feat.wifi.p": "เชื่อมต่อได้ทั่วรีสอร์ทโดยไม่มีค่าใช้จ่ายเพิ่ม", "room.family.h": "ดีลักซ์แฟมิลี่", "room.family.p": "ห้องครอบครัวขนาดใหญ่ แอร์และผนังกันเสียง เทอร์เรซวิวสวน ห้องน้ำส่วนตัวฝักบัววอล์กอิน เตียงคิงไซส์ 1 เตียงและเตียงสองชั้น", "room.grand.h": "ดีลักซ์แกรนด์สวีท", "room.grand.p": "ห้องนั่งเล่น สองห้องนอน สองห้องน้ำฝักบัววอล์กอินและของใช้ ครัวเล็กพร้อมตู้เย็นและไมโครเวฟ ชา กาแฟ ทีวีเคเบิล วิวสวน เตียงคิงและเตียง 4 ฟุต", "room.deluxe.h": "ห้องดีลักซ์", "room.deluxe.p": "ห้องกว้าง แอร์และผนังกันเสียง เทอร์เรซวิวสวน ห้องน้ำฝักบัววอล์กอิน สองเตียงหรือเตียงคิง 1 เตียง", "room.dor.h": "ดอร์ชาดาสวีท 1 ห้องนอน", "room.dor.p": "พื้นไม้ ระเบียงส่วนตัววิวทะเล และห้องน้ำพร้อมอ่างจากุซซี่", "room.elegant.h": "เอลิแกนต์สวีท 2 ห้องนอน", "room.elegant.p": "อ่างสปา ห้องนั่งเล่น สองห้องนอน สองห้องน้ำฝักบัว ครัวเล็ก ตู้เย็น ไมโครเวฟ มินิบาร์ ชา กาแฟ ทีวีเคเบิล วิวทะเลสวย เตียงคิง 2 เตียง", "room.new.h": "ห้องดีลักซ์ใหม่", "room.new.p": "ห้องกว้าง แอร์และผนังกันเสียง เทอร์เรซวิวสวน ห้องน้ำฝักบัววอล์กอิน สองเตียงหรือเตียงคิง 1 เตียง", "room.poolAccess.h": "ห้องพูลแอคเซส", "room.poolAccess.p": "ชั้นหนึ่ง ระเบียงใหญ่ส่วนตัว และเข้าถึงสระได้โดยตรงจากระเบียง", "room.poolFamily.h": "ห้องพูลแอคเซสแฟมิลี่", "room.poolFamily.p": "สวีทครอบครัว แอร์และผนังกันเสียง เทอร์เรซวิวสระ ห้องน้ำฝักบัววอล์กอิน เตียงคิงและเตียงสองชั้น", "room.poolViewFamily.h": "ห้องพูลวิวแฟมิลี่", "room.poolViewFamily.p": "ห้องครอบครัว แอร์และผนังกันเสียง เทอร์เรซวิวทะเลและสระ ห้องน้ำฝักบัววอล์กอิน เตียงคิงและเตียงสองชั้น", "room.poolBalcony.h": "ห้องพูลวิวพร้อมระเบียง", "room.poolBalcony.p": "แอร์และผนังกันเสียง เทอร์เรซวิวทะเลและสระ ห้องน้ำฝักบัววอล์กอิน เตียงคิงหรือเตียงคู่", "room.chip.garden": "เทอร์เรซสวน", "room.chip.family": "ครอบครัว", "room.chip.suite": "สวีท", "room.chip.kitchenette": "ครัวเล็ก", "room.chip.sea": "วิวทะเล", "room.chip.jacuzzi": "จากุซซี่", "room.chip.spaBath": "อ่างสปา", "room.chip.poolAccess": "เข้าสระได้", "room.chip.pool": "วิวสระ", "room.chip.seaPool": "ทะเลและสระ", "room.chip.balcony": "ระเบียง", "alt.roomFamily": "ห้องดีลักซ์แฟมิลี่ เตียงคิงและเตียงสองชั้น", "alt.roomGrand": "พื้นที่นั่งเล่นดีลักซ์แกรนด์สวีท", "alt.roomDeluxe": "ห้องดีลักซ์พร้อมเทอร์เรซ", "alt.roomDor": "ดอร์ชาดาสวีท ระเบียงวิวทะเล", "alt.roomElegant": "เอลิแกนต์สวีทพร้อมอ่างสปา", "alt.roomNew": "ห้องดีลักซ์ใหม่", "alt.roomPoolAccess": "ระเบียงห้องพูลแอคเซส", "alt.roomPoolFamily": "ห้องพูลแอคเซสแฟมิลี่", "alt.roomPoolViewFamily": "ห้องพูลวิวแฟมิลี่", "alt.roomPoolBalcony": "ห้องพูลวิวพร้อมระเบียง", "fac.label": "สิ่งอำนวยความสะดวก", "fac.title": "สิ่งอำนวยความสะดวกของรีสอร์ท", "fac.lead": "จากหน้า About Us ของรีสอร์ท — สระ สปา ฟิตเนส อาหาร และการบริการที่จำเป็น", "fac.pool": "สระกลางแจ้งและบาร์ริมสระ", "fac.spa": "สปาครบวงจร", "fac.fitness": "ศูนย์ฟิตเนส", "fac.restaurant": "ร้านอาหารริมทะเล · ไทยและนานาชาติ", "fac.bbq": "จัดปาร์ตี้บาร์บีคิวได้", "fac.roomService": "รูมเซอร์วิส", "fac.wifi": "WiFi ฟรี", "fac.parking": "ที่จอดรถในที่พักฟรี", "fac.tour": "โต๊ะทัวร์", "alt.poolLoungers": "ดาดฟ้าสระพร้อมเก้าอี้และร่ม", "alt.spa": "พื้นที่สปาและสุขภาพของรีสอร์ท", "alt.restaurant": "ร้านอาหารริมทะเลวิวสวย", "gal.label": "แกลเลอรี", "gal.title": "บรรยากาศและห้องพัก", "gal.lead": "รูปจริงจาก dor-shadaresort.com — สระ พื้นที่รีสอร์ท และห้องพัก", "alt.gal1": "สระยามพระอาทิตย์ตก", "alt.gal2": "สระพร้อมรูปปั้นนาค", "alt.gal3": "สระกลางแจ้งมุมกว้าง", "alt.gal4": "วิวทะเลใกล้รีสอร์ท", "alt.gal5": "ภายนอกรีสอร์ท", "alt.gal6": "แนวสระสู่ขอบฟ้า", "alt.gal7": "พื้นที่รับประทานอาหาร", "alt.gal8": "ภายในห้องพัก", "alt.gal9": "ระเบียงส่วนตัว", "alt.gal10": "บริเวณรีสอร์ท", "alt.gal11": "ทางเดินในสวน", "alt.gal12": "สระยามเย็น", "about.label": "เกี่ยวกับเรา", "about.title": "ที่พักเขียวขจีนาจอมเทียน", "about.p1": "ท่ามกลางความเขียวขจี ดอร์ชาดา รีสอร์ท มอบที่พักระดับ 5 ดาว พร้อมทีวีจอแบนเคเบิลและ WiFi ฟรี ตั้งอยู่ที่นาจอมเทียน มีสระว่ายน้ำกลางแจ้งพร้อมบาร์ริมสระ และสปาครบวงจร", "about.p2": "ห้องพักสไตล์ไทยร่วมสมัยมีระเบียงส่วนตัวและโซฟานั่งเล่นกว้าง ทุกห้องมีตู้เซฟ ตู้เย็น และห้องน้ำส่วนตัวพร้อมอ่างอาบน้ำกับไดร์เป่าผม", "about.p3": "ออกกำลังกายได้ที่ศูนย์ฟิตเนสที่จัดเต็ม รีสอร์ทมีโต๊ะทัวร์และที่จอดรถในที่พักฟรี", "about.p4": "เพลิดเพลินอาหารไทยและนานาชาติพร้อมวิวทะเลที่ร้านอาหารริมหาด หรือจัดปาร์ตี้บาร์บีคิว มีรูมเซอร์วิสเพื่อความสะดวกเพิ่มเติม", "alt.about": "สระดอร์ชาดา รีสอร์ทท่ามกลางต้นไม้เขตร้อน", "inq.label": "จองห้อง", "inq.title": "สอบถามการจอง", "inq.lead": "บอกรายละเอียดวันเข้าพัก — โทรหรืออีเมลจองห้อง หรือส่งแบบฟอร์มด้านล่าง", "form.name": "ชื่อ-นามสกุล", "form.namePh": "ชื่อของท่าน", "form.email": "อีเมล", "form.emailPh": "you@email.com", "form.phone": "โทรศัพท์", "form.phonePh": "+66 …", "form.guests": "จำนวนผู้เข้าพัก", "form.g1": "1 ท่าน", "form.g2": "2 ท่าน", "form.g3": "3 ท่าน", "form.g4": "4 ท่านขึ้นไป", "form.checkin": "วันเช็คอิน", "form.checkout": "วันเช็คเอาท์", "form.message": "ข้อความ / ความต้องการห้องพัก", "form.messagePh": "ประเภทห้องที่ต้องการหรือคำถาม…", "form.submit": "ส่งคำถาม", "form.note": "เดโมเท่านั้น — การส่งแบบฟอร์มยังไม่เชื่อมระบบ การจองจริงจะเชื่อมหลังลงทุน โทรหรืออีเมลจองห้องได้ทุกเมื่อ", "form.alert": "ขอบคุณครับ/ค่ะ! นี่เป็นเดโมหน้าบ้าน — การส่งคำถามเป็นการสาธิต จะเชื่อมระบบหลังลงทุน กรุณาโทรหรืออีเมลจองห้องก่อนนะคะ", "contact.label": "ติดต่อ", "contact.title": "จองห้องและต้อนรับ", "contact.lead": "ติดต่อรีสอร์ทบนถนนสุขุมวิท นาจอมเทียน", "contact.address": "ที่อยู่", "contact.map": "เปิดใน Google Maps", "contact.phone": "โทรศัพท์", "contact.phoneNote": "ตามที่เผยแพร่บน dor-shadaresort.com", "contact.emailSocial": "อีเมลและโซเชียล", "contact.call": "โทรหารีสอร์ท", "contact.emailUs": "อีเมลจองห้อง", "contact.bookCta": "สอบถามการจอง", "extras.launchTitle": "เช็กลิสต์ก่อนเปิดตัว", "extras.launchIntro": "สิ่งที่รวมในแพ็กเกจหลังลงทุน — ยังไม่ได้ปรับของจริงบนเว็บ/GBP", "extras.li1Strong": "จัดระเบียบ Google Business Profile", "extras.li1Rest": " — หมวดหมู่ รูปภาพ เวลาทำการ และคำอธิบาย เป็นบริการหลังลงทุน/เปิดตัว (ไม่ได้เคลมว่าแก้ GBP จริงแล้ว)", "extras.li2Strong": "SEO พื้นฐานไทย+อังกฤษ", "extras.li2Rest": " — ชื่อหน้าและเมตาคำอธิบายสองภาษา มาร์กอัพร้อม hreflang และ alt รูปที่มีความหมาย", "extras.li3Strong": "ปุ่มสอบถามและจอง", "extras.li3Rest": " — โทร อีเมล และฟอร์มจองเมื่อระบบหลังบ้านพร้อม", "extras.seoStrong": "หมายเหตุ SEO (EN / TH):", "extras.seoRest": " ชื่อหน้าและเมตาคำอธิบายเปลี่ยนตามภาษาที่เลือก Alt ของรูปสำคัญเป็นสองภาษา", "extras.careTitle": "หลังเปิดตัว · ดูแลเว็บรายเดือน", "extras.careLead": "แพ็กดูแลรายเดือนช่วยให้เว็บรีสอร์ทสดใหม่และเสถียร:", "extras.care1": "อัปเดตเนื้อหาและแก้เล็กน้อย", "extras.care2": "ตรวจออนไลน์อยู่เสมอ", "extras.care3": "สำรองไฟล์เว็บไซต์", "extras.care4": "ปรับ SEO / รายชื่อธุรกิจเล็กน้อยตามต้องการ", "extras.carePrice": "คิดราคาและเชื่อมระบบหลังลงทุน", "extras.careCta": "สอบถามแพ็กดูแลรายเดือน", "footer.tagline": "<strong>Dor-Shada Resort by The Sea</strong> — นาจอมเทียน", "footer.compare": "เทียบเว็บจริงกับเวอร์ชันอัปเกรด →", "footer.demo": "เดโมหน้าบ้าน — ยังไม่เชื่อมจอง/ชำระเงิน ระบบหลังบ้านหลังลงทุน รูปและข้อความจาก dor-shadaresort.com", "footer.vantage": "— เดโมรีดีไซน์โดย Vantage เครื่องหมายด้านบนเป็นของดอร์ชาดา Vantage เป็นเครดิตเอเจนซีเท่านั้น", "sticky.call": "โทร", "sticky.email": "อีเมล", "menu.close": "ปิด", "theme.appearance": "ธีม", "theme.dark": "เข้ม", "theme.light": "สว่าง", "theme.darkAnnounce": "ธีมสีเข้ม", "theme.lightAnnounce": "ธีมสีสว่าง"}
  };
  let currentLang = "en";

  function detectDefaultLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "th" || saved === "en") return saved;
    } catch (_) {}
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.startsWith("th") ? "th" : "en";
  }

  function applyI18n(lang, dict) {
    if (!dict) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (dict[key] != null) el.setAttribute("alt", dict[key]);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key] != null) el.setAttribute("title", dict[key]);
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict["meta.description"]) metaDesc.setAttribute("content", dict["meta.description"]);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    if (menuBtn && mobileNav) {
      const open = mobileNav.classList.contains("open");
      menuBtn.setAttribute("aria-label", open ? (dict["aria.menuClose"] || "Close menu") : (dict["aria.menuOpen"] || "Open menu"));
    }
  }

  function i18nAlert(key, fallback) {
    const dict = i18nDicts[currentLang];
    alert((dict && dict[key]) || fallback);
  }

  function initI18n() {
    const lang = detectDefaultLang();
    applyI18n(lang, i18nDicts[lang] || i18nDicts.en);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-lang");
        if (next && i18nDicts[next]) applyI18n(next, i18nDicts[next]);
      });
    });
  }

  initI18n();


  /* --- Theme: dark default + light toggle (pattaya-demo-theme) --- */
  const THEME_KEY = "pattaya-demo-theme";
  const themeLive = document.getElementById("themeLive");

  function getTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "light" ? "light" : "dark";
  }

  function applyTheme(theme, announce) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-theme-set") === next));
    });
    if (announce && themeLive) {
      const d = (typeof i18nDicts !== "undefined" && i18nDicts[currentLang]) || {};
      const label = next === "light"
        ? (d["theme.lightAnnounce"] || d["theme.light"] || "Light theme")
        : (d["theme.darkAnnounce"] || d["theme.dark"] || "Dark theme");
      themeLive.textContent = label;
    }
  }

  function initTheme() {
    applyTheme(getTheme(), false);
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-theme-set");
        if (next) applyTheme(next, true);
      });
    });
  }
  initTheme();

})();
