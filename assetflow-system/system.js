const workflowSteps = [
  'Intake',
  'Ownership / Authority',
  'Asset Validation / Appraisal',
  'Liens / Encumbrances',
  'Buyer KYC / Eligibility',
  'Pricing / Terms',
  'Contract / Docs',
  'Payment / Escrow',
  'Transfer / Recording',
  'Post-Close Archive',
];

const state = {
  currentStep: 5,
  completed: new Set([1, 2, 3, 4]),
  features: [
    ['Unified Intake', 'Capture asset details, parties, and requirements once.'],
    ['Ownership & Authority', 'Verify identity, ownership, and signing authority.'],
    ['KYC / Compliance', 'Run sanctions, PEP, and adverse media checks.'],
    ['Document Management', 'Store, organize, and version all transfer documents.'],
    ['Escrow & Closing', 'Manage approvals and closing tasks with safeguards.'],
    ['Audit Trail', 'Track every action with a tamper-proof record.'],
  ],
  assetClasses: [
    'Real Estate',
    'Vehicles',
    'Jewelry & Luxury',
    'Rights & Claims',
    'Business Interests',
    'Digital Assets',
  ],
};

function renderSteps(targetId, compact = false) {
  const container = document.getElementById(targetId);
  container.innerHTML = '';
  workflowSteps.forEach((name, idx) => {
    const stepNumber = idx + 1;
    const li = document.createElement('li');
    const classes = ['step'];
    if (state.completed.has(stepNumber)) classes.push('done');
    if (state.currentStep === stepNumber) classes.push('current');
    li.className = classes.join(' ');
    li.innerHTML = `<div class="num">${stepNumber}</div><div>${compact ? name.split(' / ')[0] : name}</div>`;
    container.append(li);
  });
}

function renderFeatures() {
  const grid = document.getElementById('featureGrid');
  grid.innerHTML = '';
  state.features.forEach(([title, desc]) => {
    const article = document.createElement('article');
    article.className = 'feature-item';
    article.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
    grid.append(article);
  });
}

function renderAssetClasses() {
  const list = document.getElementById('assetClassList');
  list.innerHTML = '';
  state.assetClasses.forEach((label) => {
    const span = document.createElement('span');
    span.className = 'pill';
    span.textContent = label;
    list.append(span);
  });
}

renderSteps('stepper');
renderSteps('timeline', true);
renderFeatures();
renderAssetClasses();
