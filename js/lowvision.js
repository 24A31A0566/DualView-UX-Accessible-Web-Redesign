/* ============================================================
   LOWVISION.JS — DualView UX / The Daily Post
   Article rendering, category tabs, and accessibility hooks.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.DV.load();

  /* ---- Set current date in masthead ---- */
  var dateEl = document.querySelector(".masthead-meta time");
  if (dateEl) {
    var now = new Date();
    dateEl.textContent = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    dateEl.setAttribute("datetime", now.toISOString().split("T")[0]);
  }

  /* ---- Article content per category (Andhra Pradesh topics) ---- */
  var articles = {
    local: {
      kicker: "Local News",
      headline: "Vijayawada Corporation Begins ₹340 Crore Road Widening Project Across 18 Key Junctions",
      byline: "By Staff Reporter | Vijayawada Bureau | 26 April 2025",
      imgSrc: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
      imgAltBad:  "image",
      imgAltGood: "Excavators and road construction equipment at a busy urban junction in Vijayawada, with workers in yellow helmets visible in the foreground",
      imgCaption: "Road widening work under way at Benz Circle, Vijayawada. (Photo: Staff)",
      readLinkTitle: "Vijayawada Corporation Begins ₹340 Crore Road Widening Project",
      body: [
        "The Greater Vijayawada Municipal Corporation (GVMC) has officially commenced a ₹340 crore infrastructure project aimed at widening and reconstructing 18 key traffic junctions across the city, with work beginning simultaneously at Benz Circle, Patamata, and Moghalrajpuram.",
        "The project, sanctioned under the Andhra Pradesh Urban Infrastructure Development Fund, is expected to reduce peak-hour congestion by an estimated 35 percent and improve pedestrian safety through dedicated crossing zones and tactile paving for visually impaired pedestrians.",
        "GVMC Commissioner T. Srikanth told reporters that the project would be completed in three phases over 18 months. \"Phase one covers the six most congested junctions and must be completed before the northeast monsoon arrives in June,\" he said. Residents near Eluru Road have already noted improved signal timing following preparatory work last week.",
        "The Corporation has deployed 220 contractual workers across all sites and is operating extended shifts to meet the pre-monsoon deadline. Traffic diversions are in effect at each construction zone, and the GVMC has published diversion maps on its official website and WhatsApp helpline.",
        "Opposition leaders from the YSRCP have raised concerns about the timeline, pointing to delays in two previous infrastructure tenders. Corporation officials dismissed these concerns, saying that this project involves direct procurement rather than open tender, which they expect to significantly reduce administrative delays.",
        "Local shopkeepers near Bandar Road have submitted a petition requesting temporary compensation for reduced foot traffic during construction. The GVMC has agreed to review the petition within 15 working days. The Commissioner added that digital payment kiosks would be installed at completed junctions as part of a broader smart-city initiative."
      ]
    },
    politics: {
      kicker: "Politics",
      headline: "Andhra Pradesh Government Tables Revised Panchayati Raj Amendment Bill, Promises Greater Village-Level Autonomy",
      byline: "By Political Correspondent | Amaravati | 26 April 2025",
      imgSrc: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80",
      imgAltBad:  "image",
      imgAltGood: "The Andhra Pradesh Legislative Assembly chamber in Amaravati, with rows of seats and the speaker's dais visible under bright overhead lighting",
      imgCaption: "The Andhra Pradesh Legislative Assembly, Amaravati. (Photo: Assembly Secretariat)",
      readLinkTitle: "AP Government Tables Revised Panchayati Raj Amendment Bill",
      body: [
        "The Andhra Pradesh government introduced the Panchayati Raj (Amendment) Bill 2025 in the Legislative Assembly on Saturday, proposing to devolve greater financial and administrative authority to gram panchayats, particularly in the areas of primary healthcare, minor irrigation, and village roads.",
        "The bill, if passed, would allow panchayats with populations above 5,000 to directly approve and disburse development works valued up to ₹25 lakh without district-level sanction — a significant increase from the existing ceiling of ₹5 lakh. The government estimates this will reduce project approval time from an average of 11 weeks to under two weeks.",
        "Minister for Panchayati Raj, speaking during the bill's introduction, cited the successful pilot in 18 gram panchayats across Guntur and Prakasam districts, where the relaxed approval process resulted in 43 village roads being completed before the 2024 monsoon season.",
        "The opposition moved an amendment to include mandatory social audits before any panchayat project exceeds ₹10 lakh, arguing that without oversight, the devolution of funds would create opportunities for local-level corruption. The amendment was sent to a select committee for review.",
        "Civil society organisations in Srikakulam and Vizianagaram districts have welcomed the bill but called for accompanying legislation to strengthen gram sabha participation requirements. Currently, quorum rules for gram sabha meetings are frequently unmet, reducing meaningful public oversight.",
        "The bill is expected to go to a vote in the next legislative session, which resumes on 5 May. The Chief Minister's office has indicated that all allied parties have been briefed and the government is confident of securing the required majority."
      ]
    },
    education: {
      kicker: "Education",
      headline: "AP's Jagananna Vidya Deevena Scheme Releases ₹980 Crore to 14.5 Lakh Students Ahead of Academic Year",
      byline: "By Education Correspondent | Vijayawada | 26 April 2025",
      imgSrc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
      imgAltBad:  "image",
      imgAltGood: "Two schoolgirls in blue and white uniforms reading from textbooks inside a bright government school classroom in rural Andhra Pradesh",
      imgCaption: "Students at a government school in Guntur district during the previous academic year. (Photo: Education Dept.)",
      readLinkTitle: "AP's Jagananna Vidya Deevena Scheme Releases ₹980 Crore to 14.5 Lakh Students",
      body: [
        "The Andhra Pradesh government's Jagananna Vidya Deevena scheme has credited ₹980 crore directly to the bank accounts of 14.5 lakh college students across the state, covering full fee reimbursement for the 2025–26 academic year. The transfer was completed in a single day through the Direct Benefit Transfer mechanism.",
        "The scheme, which covers tuition, examination, and laboratory fees for students from households with annual incomes below ₹2.5 lakh, has been credited with enabling a 17 percent increase in college enrolment among students from scheduled caste and scheduled tribe communities since 2020.",
        "State Education Secretary P. Lakshmi Prasad confirmed that this year's disbursement was the largest single-day transfer under the scheme. \"We processed payments for 14,52,437 students before the start of the new academic semester, ensuring no student faces a delay in enrolment due to fee-related reasons,\" she said.",
        "Beneficiaries can use the funds at any recognised university or college affiliated to Andhra Pradesh's state board system. Polytechnic students are included for the first time this year under a revised eligibility notification issued in February.",
        "Some polytechnic principals have raised concerns about the verification timeline, noting that new enrolments may not be reflected in state databases before the transfer deadline. The education department has established a dedicated grievance portal where institutions can flag missing student records.",
        "In Visakhapatnam district, 87,000 students have received the payment, the highest among all districts. District education officers have been directed to conduct awareness camps in rural mandals where bank account linkage rates remain below 80 percent."
      ]
    },
    health: {
      kicker: "Health",
      headline: "Three New Government Medical Colleges to Open in Andhra Pradesh by August, Adding 450 MBBS Seats",
      byline: "By Health Correspondent | Amaravati | 26 April 2025",
      imgSrc: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80",
      imgAltBad:  "image",
      imgAltGood: "A doctor in a white coat reviewing patient data on a tablet in a modern hospital corridor in Andhra Pradesh",
      imgCaption: "Medical staff at a government hospital in Kurnool. New colleges aim to improve rural doctor supply. (Photo: NTR Health University)",
      readLinkTitle: "Three New Government Medical Colleges to Open in AP by August",
      body: [
        "The Andhra Pradesh government announced on Saturday that three new government medical colleges — located in Nandyal, Eluru, and Rajam — will admit their first batch of MBBS students in August 2025, adding 450 seats to the state's public medical education system.",
        "The colleges, built under the National Health Mission's Medical Colleges Attached to District Hospitals scheme, have been constructed adjacent to the existing district hospitals in each location. This allows students to complete clinical rotations without the need for separate hospital affiliations.",
        "Health Minister Satya Kumar stated that the addition of these colleges addresses a longstanding shortage of government doctors in the state's 13 districts classified as medically underserved. Currently, Andhra Pradesh has a doctor-to-population ratio of 0.62 per 1,000 — below the national average and significantly below the WHO benchmark of 1 per 1,000.",
        "Each college will admit 150 MBBS students per year. The NTR University of Health Sciences has completed the academic recognition process, and the National Medical Commission confirmed that inspection teams completed infrastructure assessments in March.",
        "Faculty recruitment has been completed for 68 percent of sanctioned posts. The government has granted a one-year relaxation in age limits for specialist faculty appointments to fill remaining positions, a measure that has been used successfully in three earlier colleges established under the same scheme.",
        "The Doctors Association of Andhra Pradesh has welcomed the expansion but urged the government to simultaneously improve postgraduate training capacity, arguing that without more MD and MS seats, the MBBS graduates will seek opportunities in other states within five years of graduation."
      ]
    },
    technology: {
      kicker: "Technology",
      headline: "AP's FiberGrid Project Crosses One Million Rural Broadband Connections, Targets Full Coverage by December",
      byline: "By Technology Correspondent | Vijayawada | 26 April 2025",
      imgSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
      imgAltBad:  "image",
      imgAltGood: "A technician installing fibre optic cable connections on a utility pole in a rural village in Andhra Pradesh, with agricultural fields visible in the background",
      imgCaption: "A field technician completing fibre connections in Prakasam district. (Photo: AP FiberNet)",
      readLinkTitle: "AP's FiberGrid Project Crosses One Million Rural Broadband Connections",
      body: [
        "Andhra Pradesh's FiberGrid initiative, a state-owned optical fibre broadband network targeting villages with populations above 500, has crossed the milestone of one million active rural connections as of Friday — six months ahead of the revised schedule set in October 2024.",
        "The project, operated through AP FiberNet, provides broadband connections at speeds between 20 Mbps and 100 Mbps at a fixed monthly charge of ₹149, making it among the most affordable rural broadband services in the country. The network currently covers 12,850 gram panchayats across the state's 26 districts.",
        "IT and Electronics Secretary T. Vijay Kumar attributed the acceleration to a revised contractor model introduced last year, under which private last-mile contractors are paid on a per-active-connection basis rather than per kilometre of cable laid. \"The incentive structure now rewards connectivity, not just infrastructure,\" he said.",
        "Rural usage patterns show that agricultural price information, government portal access, and video calling are the three dominant uses in newly connected villages. In Kadapa district, the district administration has integrated FiberGrid connections into the village secretariat system, allowing residents to access government services from local offices without travelling to mandal headquarters.",
        "The project faces remaining challenges in hilly terrain in Alluri Sitharama Raju and Visakhapatnam's agency areas, where underground cable laying costs are three times higher than in plains districts. The government is evaluating a hybrid model using fixed wireless access towers in the most difficult-to-reach habitations.",
        "The state government has set a target of 1.8 million rural connections by 31 December 2025, which would cover all inhabited villages above 200 people. Independent analysts at the Centre for Digital Infrastructure Research consider the target ambitious but achievable given the current pace of network expansion."
      ]
    },
    culture: {
      kicker: "Culture",
      headline: "Kuchipudi Dance Festival Returns to Amaravati After Four-Year Hiatus, Drawing Artists from 11 Countries",
      byline: "By Culture Reporter | Amaravati | 26 April 2025",
      imgSrc: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
      imgAltBad:  "image",
      imgAltGood: "A classical Kuchipudi dancer in full traditional costume and jewellery, mid-performance on an outdoor stage in Amaravati, with an audience visible in the background",
      imgCaption: "Opening night performance at the Amaravati Kuchipudi Mahotsavam 2025. (Photo: Dept. of Culture, AP)",
      readLinkTitle: "Kuchipudi Dance Festival Returns to Amaravati After Four-Year Hiatus",
      body: [
        "The Amaravati Kuchipudi Mahotsavam, the state's largest classical dance festival, opened on Friday evening with performances by 340 artists from 11 countries, marking its return after a four-year break caused by the COVID-19 pandemic and subsequent venue infrastructure work at the main amphitheatre.",
        "The festival, which runs until 1 May, features solo and group performances across three outdoor stages, a documentary film series on the evolution of Kuchipudi over the past century, and a five-day masterclass programme open to registered students from across Andhra Pradesh.",
        "This year's edition includes an unprecedented international contingent, with troupes travelling from the United States, United Kingdom, Malaysia, Singapore, and the Netherlands — reflecting the global reach of the Telugu diaspora's cultural preservation efforts.",
        "The opening performance was delivered by 82-year-old Padma Bhushan recipient Vempati Ravi Shankar, whose interpretation of the Bhama Kalapam — one of Kuchipudi's oldest and most technically demanding narrative forms — received a standing ovation from a crowd estimated at 9,000.",
        "The Andhra Pradesh government has designated Kuchipudi as a cultural heritage priority under the state's 2024 Heritage Conservation Policy, which provides direct grants to training institutions, performance groups, and oral documentation projects focused on classical arts with roots in the state.",
        "Festival director Nalini Raju said that discussions are under way with the Ministry of Culture to seek UNESCO Intangible Cultural Heritage status for Kuchipudi as a distinct classical form. A formal nomination dossier is expected to be submitted before the December 2025 deadline for the next assessment cycle."
      ]
    }
  };

  var currentCat = "local";

  /* ---- Render article into #article-panel ---- */
  function renderArticle(cat) {
    var data  = articles[cat];
    var panel = document.getElementById("article-panel");
    if (!panel || !data) return;

    /* Update byline date to today */
    var today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    var byline = data.byline.replace(/\d{1,2} \w+ \d{4}$/, today);

    var isAccessible = cfg.accessible;
    var altVal   = isAccessible ? data.imgAltGood : data.imgAltBad;
    var linkText = isAccessible ? ("Read: " + data.readLinkTitle) : "Read full article";
    var ariaLabel = isAccessible ? ("Read: " + data.readLinkTitle) : "Read full article";

    var paragraphs = data.body.map(function (p) { return "<p>" + p + "</p>"; }).join("");

    panel.innerHTML =
      '<span class="article-kicker">' + data.kicker + '</span>' +
      '<h2 class="article-headline">' + data.headline + '</h2>' +
      '<p class="article-byline">' + byline + '</p>' +
      '<div class="article-hero-wrap">' +
        '<img class="article-hero-img"' +
          ' src="' + data.imgSrc + '"' +
          ' alt="' + altVal + '"' +
          ' data-alt-bad="' + data.imgAltBad + '"' +
          ' data-alt-good="' + data.imgAltGood + '"' +
          ' width="900" height="360" />' +
        '<div class="alt-overlay visible" id="article-overlay">' +
          'Screen reader: ' + altVal +
        '</div>' +
      '</div>' +
      '<p class="article-img-caption">' + data.imgCaption + '</p>' +
      '<div class="article-body">' + paragraphs + '</div>' +
      '<p style="margin-top:1.25rem;">' +
        '<a href="#" class="article-read-link" aria-label="' + ariaLabel + '">' +
          linkText +
        '</a>' +
      '</p>';
  }

  /* ---- Update sidebar ad overlay ---- */
  function updateAdOverlay() {
    var adImg     = document.querySelector(".sidebar-ad-img");
    var adOverlay = document.querySelector(".ad-overlay");
    if (!adImg || !adOverlay) return;

    var altVal = cfg.accessible ? adImg.dataset.altGood : adImg.dataset.altBad;
    adImg.setAttribute("alt", altVal);
    adOverlay.classList.add("visible");
    adOverlay.textContent = "Screen reader: " + altVal;
  }

  /* ---- Hook: runs after every DV.apply() ---- */
  window.DV.onApply = function () {
    renderArticle(currentCat);
    updateAdOverlay();
  };

  window.DV.initToolbar(cfg);
  window.DV.apply(cfg);

  /* ---- Category tabs ---- */
  document.querySelectorAll(".cat-tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".cat-tab-btn").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      this.classList.add("active");
      this.setAttribute("aria-selected", "true");
      currentCat = this.getAttribute("data-cat");
      renderArticle(currentCat);
    });
  });
});
