document.getElementById('currentYear').textContent = new Date().getFullYear();

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  showToast(successMsg || 'Copied to clipboard!');
}

const htmlEl = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  try { localStorage.setItem('naimul_theme', theme); } catch (e) {}
  if (theme === 'light') {
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  } else {
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>';
  }
}

applyTheme(localStorage.getItem('naimul_theme') || 'dark');
themeToggleBtn.addEventListener('click', () => {
  applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
function closeMobileMenu() { mobileMenu.classList.remove('open'); }
mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-menu-link').forEach((link) => link.addEventListener('click', closeMobileMenu));

const scrollProgressBar = document.getElementById('scrollProgressBar');
const backToTopBtn = document.getElementById('backToTopBtn');
const sections = ['home', 'about', 'skills', 'projects', 'education', 'research', 'certificates', 'contact'];

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  if (scrollTop > 400) backToTopBtn.classList.add('visible');
  else backToTopBtn.classList.remove('visible');

  const checkPos = scrollTop + 160;
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && checkPos >= el.offsetTop && checkPos < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll('.nav-link, .mobile-menu-link').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('data-section') === id);
      });
      break;
    }
  }
}, { passive: true });

backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const roles = [
  'Aspiring Software & AI Engineer',
  'Machine Learning Enthusiast',
  'Backend & Full-Stack Developer',
  'Competitive Programmer (C++)'
];
let roleIdx = 0;
let charIdx = roles[0].length;
let isDeleting = true;
const typewriterEl = document.getElementById('typewriterText');

function tickTypewriter() {
  const currentFull = roles[roleIdx];
  if (isDeleting) {
    charIdx--;
    typewriterEl.textContent = currentFull.substring(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(tickTypewriter, 350);
      return;
    }
    setTimeout(tickTypewriter, 35);
  } else {
    charIdx++;
    typewriterEl.textContent = currentFull.substring(0, charIdx);
    if (charIdx === currentFull.length) {
      isDeleting = true;
      setTimeout(tickTypewriter, 1600);
      return;
    }
    setTimeout(tickTypewriter, 70);
  }
}
setTimeout(tickTypewriter, 1600);

const portraitImg = document.getElementById('portraitImg');
const portraitFallbackSvg = document.getElementById('portraitFallbackSvg');
const photoFileInput = document.getElementById('photoFileInput');
const photoCandidates = ['photos/NaimulPhoto.jpg', 'NaimulPhoto.jpg'];
let candidateIndex = 0;

function showPortraitImage(src, isUserSelected) {
  portraitImg.onload = () => {
    portraitImg.style.display = 'block';
    portraitFallbackSvg.style.display = 'none';
  };
  portraitImg.onerror = () => {
    if (!isUserSelected && candidateIndex < photoCandidates.length - 1) {
      candidateIndex++;
      portraitImg.src = photoCandidates[candidateIndex];
    } else {
      portraitImg.style.display = 'none';
      portraitFallbackSvg.style.display = 'block';
    }
  };
  portraitImg.src = src;
}

const storedPhoto = localStorage.getItem('naimul_portfolio_photo');
if (storedPhoto) showPortraitImage(storedPhoto, true);
else showPortraitImage(photoCandidates[0], false);

photoFileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { localStorage.setItem('naimul_portfolio_photo', reader.result); } catch (err) {}
    showPortraitImage(reader.result, true);
    showToast('Profile photo updated!');
  };
  reader.readAsDataURL(file);
});

const filterButtons = document.querySelectorAll('#projectFilters .filter-btn');
const projectCards = document.querySelectorAll('#projectsGrid .project-card');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach((card) => {
      card.classList.toggle('hidden', !(filter === 'All' || card.getAttribute('data-category') === filter));
    });
  });
});

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function backdropClose(event, id) { if (event.target.id === id) closeModal(id); }

const PROJECT_DETAILS = {
  'ai-assistant': {
    category: 'AI & ML',
    title: 'AI Personal Assistant',
    desc: 'An AI-powered web assistant built with Flask and OpenAI API for intelligent question answering and automated email summarization.',
    highlights: [
      'Built an AI-powered assistant with Flask and OpenAI API for question answering and email summarization.',
      'Developed REST APIs and integrated JavaScript Fetch API for asynchronous frontend-backend communication.',
      'Implemented secure API configuration using environment variables and designed a responsive interface.'
    ],
    tech: ['Python', 'Flask', 'OpenAI API', 'REST API', 'JavaScript']
  },
  creditwise: {
    category: 'AI & ML',
    title: 'CreditWise Loan System',
    desc: 'An end-to-end machine learning pipeline for loan approval prediction comparing 5 supervised models, achieving 87% accuracy with Logistic Regression.',
    highlights: [
      'Developed an end-to-end ML pipeline using Logistic Regression, KNN, Gaussian Naive Bayes, Decision Tree, and SVM.',
      'Performed EDA, missing-value handling, categorical encoding, and feature scaling with StandardScaler.',
      'Evaluated Accuracy, Precision, Recall, F1-Score, and Confusion Matrix (87% best accuracy with Logistic Regression).'
    ],
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib']
  },
  cheflagbe: {
    category: 'Web App',
    title: 'ChefLagbe — Location-Based Chef Hiring Platform',
    desc: 'A full-stack web platform designed to connect users with verified cooking services based on location, complete with role-based access control.',
    highlights: [
      'Developed a responsive web application for hiring chefs based on user location.',
      'Implemented secure authentication system and role-based access control (RBAC).',
      'Designed relational MySQL database structure and end-to-end chef booking functionality.'
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Laravel', 'PHP', 'MySQL']
  },
  pathopredict: {
    category: 'AI & ML',
    title: 'PathoPredict BD',
    desc: 'A machine learning-based healthcare application for multi-disease prediction and treatment recommendation using clinical pathology data.',
    highlights: [
      'Trained supervised learning models on clinical pathology parameters and patient symptom profiles.',
      'Engineered automated feature preprocessing pipelines using Pandas and Scikit-learn.',
      'Connected model inference to a clean Flask web interface for treatment recommendations.'
    ],
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Flask']
  },
  smartcart: {
    category: 'Web App',
    title: 'SmartCart',
    desc: 'An intelligent e-commerce web application featuring dynamic product filtering, interactive shopping cart management, and order tracking.',
    highlights: [
      'Built interactive product catalog search and real-time shopping cart calculation in JavaScript.',
      'Designed relational MySQL database tables for products, inventory, and customer orders.',
      'Crafted a clean, mobile-friendly shopping experience.'
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'MySQL']
  },
  deshikarigor: {
    category: 'Web App',
    title: 'DeshiKarigor',
    desc: 'A digital marketplace built to showcase traditional Bangladeshi handcrafted goods and connect local artisans directly with customers.',
    highlights: [
      'Created dedicated artisan profiles to showcase authentic handcrafted products.',
      'Implemented PHP and MySQL backend workflows for product listings and customer orders.',
      'Designed an easy-to-use, accessible storefront interface.'
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL']
  }
};

function openProjectModal(key) {
  const p = PROJECT_DETAILS[key];
  if (!p) return;
  document.getElementById('projModalCat').textContent = p.category;
  document.getElementById('projModalTitle').textContent = p.title;
  document.getElementById('projModalDesc').textContent = p.desc;
  document.getElementById('projModalHighlights').innerHTML = p.highlights.map((h) => '<li>' + h + '</li>').join('');
  document.getElementById('projModalTech').innerHTML = p.tech.map((t) => '<span class="tech-tag">' + t + '</span>').join('');
  openModal('projectModal');
}

const CERT_DETAILS = {
  herwill: {
    issuerShort: 'AI4OPT • HerWILL',
    issuer: 'AI Institute for Advances in Optimization (AI4OPT) & HerWILL',
    title: "HerWILL's AI Workshop",
    id: 'HWAIWS2026-214',
    date: '2026',
    topics: [
      'Applied Artificial Intelligence & Optimization Concepts',
      'AI-Driven Problem Solving & Innovation',
      'Hands-on Workshop Participation & Practical AI Workflows'
    ],
    signatories: [
      { name: 'Farhana Hasan', role: 'Founder & CEO, HerWILL' },
      { name: 'Dr. Pascal Van Hentenryck', role: 'Executive Director, AI4OPT' }
    ]
  },
  excel: {
    issuerShort: '10 Minute School',
    issuer: '10 Minute School (www.10ms.com)',
    title: 'Microsoft Excel — Data Analysis & Automation',
    id: '6b03e1f500747',
    date: '23 Nov, 2026',
    topics: [
      'Basic to Advanced Formulas and Functions',
      'Data Formatting and Management',
      'Data Analysis Functions',
      'Pivot Tables and Charts',
      'Data Sorting and Automation'
    ],
    signatories: [
      { name: 'Ayman Sadiq', role: 'CEO, 10 Minute School' },
      { name: 'Abtahi Iptesam', role: 'Course Instructor' }
    ]
  },
  ppt: {
    issuerShort: '10 Minute School',
    issuer: '10 Minute School (www.10ms.com)',
    title: 'Microsoft PowerPoint — Visual Presentation Design',
    id: '6adb3e4e7edf1',
    date: '23 Oct, 2026',
    topics: [
      'Shape Tools, Text Formatting & Layout Techniques',
      'Visual Aids: SmartArt, Icons & Templates',
      'Animation, GIF, Bar & Charts Adding and Editing',
      'Photo Editing, Background Removal & Transparency Techniques',
      'Hyperlink, Slide Security & Precise Layout Design'
    ],
    signatories: [
      { name: 'Ayman Sadiq', role: 'CEO, 10 Minute School' },
      { name: 'Sadman Sadik', role: 'Course Instructor' }
    ]
  },
  word: {
    issuerShort: '10 Minute School',
    issuer: '10 Minute School (www.10ms.com)',
    title: 'Microsoft Word — Professional Documentation',
    id: '6ad4a0872cc22',
    date: '18 Oct, 2026',
    topics: [
      'Document Formatting Tools: Tables, SmartArt, Graphs, and Charts',
      'Basic to Advanced Formulas and Functions in Tables',
      'Document Security and Organization: Headers, Footers & Page Numbering',
      'Professional Documents Creation: CVs, Academic Reports & Book Drafts'
    ],
    signatories: [
      { name: 'Ayman Sadiq', role: 'CEO, 10 Minute School' },
      { name: 'Sadman Sadik', role: 'Course Instructor' }
    ]
  }
};

function openCertModal(key) {
  const c = CERT_DETAILS[key];
  if (!c) return;
  document.getElementById('certPaperIssuerShort').textContent = c.issuerShort;
  document.getElementById('certPaperId').textContent = 'Certificate ID: ' + c.id;
  document.getElementById('certPaperDesc').innerHTML =
    'has successfully completed <strong>' + c.title + '</strong> issued by <strong>' + c.issuer + '</strong>.';
  document.getElementById('certPaperTopicsList').innerHTML = c.topics.map((t) => '<li>' + t + '</li>').join('');
  document.getElementById('certPaperFooter').innerHTML =
    c.signatories
      .map((s) => '<div><div style="font-weight: 800; color: #0f172a;">' + s.name + '</div><div style="font-size: 0.72rem; color: #64748b;">' + s.role + '</div></div>')
      .join('') +
    '<div style="text-align: right;"><div style="font-weight: 700; color: #1e293b;">Date Issued: ' + c.date + '</div><div style="font-family: monospace; font-size: 0.72rem; color: #64748b;">ID: ' + c.id + '</div></div>';
  const copyBtn = document.getElementById('certModalCopyBtn');
  copyBtn.textContent = 'Copy ID (' + c.id + ')';
  copyBtn.onclick = () => copyToClipboard(c.id, 'Credential ID ' + c.id + ' copied!');
  openModal('certModal');
}

function downloadCvTxt() {
  const cvText = `MD. NAIMUL ISLAM
Aspiring Software & AI Engineer
Email: naimulislam1322@gmail.com | Phone: +8801797-753943
Location: Dhaka, Bangladesh
LinkedIn: https://linkedin.com/in/naimul1322 | GitHub: https://github.com/naimul1322

TECHNICAL SKILLS
- Programming Languages: C++ (Strong), Python, Java, C
- Web Technologies: HTML, CSS, JavaScript, PHP, Laravel, Flask, REST APIs
- Machine Learning: Scikit-learn, Data Preprocessing, Feature Engineering, Model Evaluation, Classification, Regression, Clustering
- AI & Generative AI: OpenAI API, Prompt Engineering, LLM Applications, AI API Integration
- Python Libraries: Pandas, NumPy, Matplotlib, Seaborn
- Database & Analytics: MySQL, PostgreSQL, Power BI, Microsoft Excel
- Tools & Core Concepts: Git & GitHub, VS Code, SDLC, Data Structures, Algorithms, Problem Solving, OOP

PROJECTS
1. AI Personal Assistant (Python, Flask, OpenAI API | 2026)
2. CreditWise Loan System (Python, Scikit-learn, Pandas - 87% Accuracy)
3. ChefLagbe - Location-Based Chef Hiring Platform (Laravel, MySQL)
4. PathoPredict BD, SmartCart, DeshiKarigor

COMPETITIVE PROGRAMMING
- Solved 300+ algorithmic problems on Codeforces (Max Rating: 1201, Pupil)
- Solved 50+ problems on LeetCode

RESEARCH & PUBLICATIONS
- Research Project: "From Symptoms to Solutions: Machine Learning-Based Disease Prediction and Treatment Recommendation"
- Conference Paper: "XCLBoost: Soft Voting Ensemble and Explainable AI for Modeling Student AI Adoption"

CERTIFICATIONS & WORKSHOPS
- HerWILL's AI Workshop (AI4OPT & HerWILL) | ID: HWAIWS2026-214 (2026)
- Microsoft Excel (10 Minute School) | ID: 6b03e1f500747 (23 Nov, 2026)
- Microsoft PowerPoint (10 Minute School) | ID: 6adb3e4e7edf1 (23 Oct, 2026)
- Microsoft Word (10 Minute School) | ID: 6ad4a0872cc22 (18 Oct, 2026)

EDUCATION
- BSc in Computer Science & Engineering | Daffodil International University (June 2022 - June 2026) | CGPA: 3.42 / 4.00
- HSC (Science) | Rajshahi Education Board Govt. Model School & College | GPA: 4.75 / 5.00
- SSC (Science) | Faridpur Union High School, Pabna | GPA: 4.64 / 5.00`;
  const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Resume_of_Md_Naimul_Islam.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Resume downloaded!');
}

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('senderSubject');
  const messageInput = document.getElementById('senderMessage');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();
  let valid = true;

  if (!name) { nameInput.classList.add('error'); document.getElementById('errName').classList.add('visible'); valid = false; }
  else { nameInput.classList.remove('error'); document.getElementById('errName').classList.remove('visible'); }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailInput.classList.add('error'); document.getElementById('errEmail').classList.add('visible'); valid = false; }
  else { emailInput.classList.remove('error'); document.getElementById('errEmail').classList.remove('visible'); }

  if (!subject) { subjectInput.classList.add('error'); document.getElementById('errSubject').classList.add('visible'); valid = false; }
  else { subjectInput.classList.remove('error'); document.getElementById('errSubject').classList.remove('visible'); }

  if (!message || message.length < 10) { messageInput.classList.add('error'); document.getElementById('errMessage').classList.add('visible'); valid = false; }
  else { messageInput.classList.remove('error'); document.getElementById('errMessage').classList.remove('visible'); }

  const successBox = document.getElementById('formSuccessBox');
  if (valid) {
    const mailtoHref = 'mailto:naimulislam1322@gmail.com?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
    document.getElementById('mailtoLinkBtn').setAttribute('href', mailtoHref);
    successBox.classList.add('visible');
  } else {
    successBox.classList.remove('visible');
  }
});