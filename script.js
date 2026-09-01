const body = document.body;
const menuToggles = document.querySelectorAll('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const sideMenu = document.querySelector('.side-menu');
const menuCloses = document.querySelectorAll('.menu-close');
const menuLinks = document.querySelectorAll('.menu-list a');
const caseDetail = document.querySelector('.case-detail');
const caseClose = document.querySelector('.case-back');
const casePriceEl = document.querySelector('.case-detail__open');
const caseSellEl = document.querySelector('.case-detail__sell');
const caseIconEl = document.querySelector('.case-detail__icon');
const brandItems = document.querySelectorAll('.brand');
const menuLoginBtn = document.querySelector('.menu-login');
const authModal = document.querySelector('.auth-modal');
const authCloseBtn = document.querySelector('.auth-modal__close');
const authBackdrop = document.querySelector('[data-close-auth]');
const authCheckboxes = document.querySelectorAll('.auth-modal__checkbox');
const authSubmit = document.querySelector('.auth-modal__submit');
const loginModal = document.querySelector('.login-modal');
const loginCloseBtn = document.querySelector('.login-modal__close');
const loginBackdrop = document.querySelector('[data-close-login]');
const loginForm = document.querySelector('.login-modal__form');
const loginUsernameInput = document.querySelector('.login-modal__field input');
const loginError = document.querySelector('.login-modal__error');
const registerModal = document.querySelector('.register-modal');
const registerCloseBtn = document.querySelector('.register-modal__close');
const registerBackdrop = document.querySelector('[data-close-register]');
const registerForm = document.querySelector('.register-modal__form');
const registerError = document.querySelector('.register-modal__error');
const authRegisterBtn = document.querySelector('.auth-modal__register');
const menuProfile = document.querySelector('.menu-profile');
const menuProfileName = document.querySelector('.menu-profile__name');
const menuProfileBalance = document.querySelector('.menu-profile__balance');
const menuProfileAvatar = document.querySelector('.menu-profile__avatar');
const profileScreen = document.querySelector('.profile-screen');
const profileSettingsBtn = document.querySelector('.profile-screen__tool');
const settingsModal = document.querySelector('.settings-modal');
const settingsCloseBtn = document.querySelector('.settings-modal__close');
const settingsBackdrop = document.querySelector('[data-close-settings]');
const settingsSubmit = document.querySelector('.settings-modal__submit');
const profileInventory = document.querySelector('#profile-inventory');
const profileScreenName = document.querySelector('.profile-screen__name');
const profileScreenId = document.querySelector('.profile-screen__id');
const profileScreenAvatar = document.querySelector('.profile-screen__avatar');
const profileScreenBalance = document.querySelector('.profile-screen__balance-value');
const profileScreenLogout = document.querySelector('.profile-screen__logout');
const upgradeScreen = document.querySelector('.upgrade-screen');
const upgradeCloseBtn = document.querySelector('.upgrade-screen__close');
const liveFeedEl = document.querySelector('.live-cards');
const STORAGE_KEY = 'cb_users';
const ACTIVE_USER_KEY = 'cb_active_user';
const LIVE_FEED_KEY = 'cb_live_feed';
const CASE_SECTIONS_KEY = 'cb_case_sections';

const DEFAULT_CASE_SECTIONS = [
  {
    id: 'rainbow-collection',
    name: 'Радужная Коллекция',
    cases: [
      { id: 'blue-case', name: 'Синий Кейс', price: 2490, image: 'img/blue.png' },
      { id: 'green-case', name: 'Зеленый Кейс', price: 2990, image: 'img/green.png' },
      { id: 'red-case', name: 'Красный Кейс', price: 3490, image: 'img/red.png' },
      { id: 'pink-case', name: 'Розовый Кейс', price: 4290, image: 'img/purple.png' },
      { id: 'rainbow-case', name: 'Радужный Кейс', price: 6990, image: 'img/rgb.png' }
    ]
  }
];

function ensureDefaultCaseSections() {
  try {
    const raw = localStorage.getItem(CASE_SECTIONS_KEY);
    if (!raw) {
      localStorage.setItem(CASE_SECTIONS_KEY, JSON.stringify(DEFAULT_CASE_SECTIONS));
    }
  } catch (error) {
    // ignore localStorage issues in restricted browsers
  }
}

function getCaseSections() {
  try {
    const raw = localStorage.getItem(CASE_SECTIONS_KEY);
    if (!raw) {
      localStorage.setItem(CASE_SECTIONS_KEY, JSON.stringify(DEFAULT_CASE_SECTIONS));
      return DEFAULT_CASE_SECTIONS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) {
      localStorage.setItem(CASE_SECTIONS_KEY, JSON.stringify(DEFAULT_CASE_SECTIONS));
      return DEFAULT_CASE_SECTIONS;
    }

    return parsed;
  } catch (error) {
    return DEFAULT_CASE_SECTIONS;
  }
}

function renderHomeCaseSections() {
  const titleEl = document.querySelector('.section-title h2');
  const casesRow = document.querySelector('.cases-row');
  if (!casesRow) {
    return;
  }

  const sections = getCaseSections();
  const activeSection = sections[0] || DEFAULT_CASE_SECTIONS[0];
  const cases = activeSection.cases || [];

  if (titleEl && activeSection.name) {
    titleEl.textContent = activeSection.name;
  }

  casesRow.innerHTML = cases.map((item) => `
    <article class="case-card ${item.rarity ? `case-card--${item.rarity}` : ''}">
      <div class="case-card__image-wrap">
        <img src="${item.image || 'img/blue.png'}" alt="${item.name}" />
      </div>
      <div class="case-card__name">${item.name}</div>
      <button type="button" data-case-name="${item.name}" data-case-price="${formatPrice(Number(item.price || 0))}" data-case-image="${item.image || 'img/blue.png'}">${formatPrice(Number(item.price || 0))}</button>
    </article>
  `).join('');

  bindCaseCardEvents();
}

ensureDefaultCaseSections();
renderHomeCaseSections();

/* =========================================
   CASE ROLL — чистая анимация
   Фон полностью прозрачный
========================================= */

const CASE_CONFIG = {
  duration: 4000,
  winnerIndex: 70,
  itemWidth: 150,
  gap: 10
};

const CASE_SKINS = [
  {
    name: 'AK-47',
    image: 'img/blue.png',
    rarity: 'blue'
  },
  {
    name: 'AWP',
    image: 'img/green.png',
    rarity: 'green'
  },
  {
    name: 'M4A1-S',
    image: 'img/red.png',
    rarity: 'red'
  },
  {
    name: 'USP-S',
    image: 'img/purple.png',
    rarity: 'purple'
  },
  {
    name: 'Glock-18',
    image: 'img/rgb.png',
    rarity: 'pink'
  },
  {
    name: 'Desert Eagle',
    image: 'img/logo.png',
    rarity: 'gold'
  }
];

const reel = document.getElementById('caseReel');
const container = document.getElementById('caseRoll');

let items = [];
let currentPosition = 0;
let isRolling = false;
let focusFrameId = null;
let activeCasePrice = '1 337.90 ₽';
let lastDroppedItem = null;

function createReel() {
  if (!reel) {
    return;
  }

  reel.innerHTML = '';
  items = [];

  for (let i = 0; i < 100; i += 1) {
    const skin = CASE_SKINS[Math.floor(Math.random() * CASE_SKINS.length)];
    const element = document.createElement('div');
    element.className = `case-roll__item ${skin.rarity}`;
    element.innerHTML = `
      <img
        src="${skin.image}"
        draggable="false"
        alt="${skin.name}"
      >
    `;

    reel.appendChild(element);
    items.push({ element, skin });
  }
}

function updateFocus() {
  if (!container || !items.length) {
    return;
  }

  const isCasePreview = caseDetail &&
    !caseDetail.classList.contains('case-opening') &&
    !caseDetail.classList.contains('case-result') &&
    body.classList.contains('case-modal-open');

  if (isCasePreview) {
    items.forEach((item) => {
      item.element.style.opacity = '0.45';
      item.element.style.transform = 'scale(1)';
      item.element.style.filter = 'brightness(0.45) saturate(0.55) blur(2.8px)';
    });
    focusFrameId = requestAnimationFrame(updateFocus);
    return;
  }

  const shouldStayClear = isRolling ||
    (caseDetail && caseDetail.classList.contains('case-opening'));

  if (shouldStayClear) {
    items.forEach((item) => {
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1)';
      item.element.style.filter = 'brightness(1) saturate(1) blur(0px)';
    });
    focusFrameId = requestAnimationFrame(updateFocus);
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const center = containerRect.left + containerRect.width / 2;
  const radius = 140;

  items.forEach((item) => {
    const isWinner = item.element.classList.contains('is-winner');

    if (isWinner) {
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1.08)';
      item.element.style.filter = 'brightness(1.08) saturate(1.08) blur(0px)';
      return;
    }

    const rect = item.element.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(itemCenter - center);

    if (distance <= radius) {
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1)';
      item.element.style.filter = 'brightness(1) saturate(1) blur(0px)';
      return;
    }

    const fade = Math.min(1, (distance - radius) / 220);
    const opacity = 1 - fade * 0.55;
    const brightness = 1 - fade * 0.55;
    const saturation = 1 - fade * 0.45;
    const blur = 0.3 + fade * 2.5;

    item.element.style.opacity = String(Math.max(0.4, opacity));
    item.element.style.transform = 'scale(1)';
    item.element.style.filter = `brightness(${brightness}) saturate(${saturation}) blur(${blur}px)`;
  });

  focusFrameId = requestAnimationFrame(updateFocus);
}

function rollCase() {
  if (isRolling || !reel || !container) {
    return;
  }

  if (focusFrameId) {
    cancelAnimationFrame(focusFrameId);
    focusFrameId = null;
  }

  isRolling = true;

  items.forEach((item) => item.element.classList.remove('is-winner'));

  const winnerIndex = Math.floor(Math.random() * items.length);
  const winner = items[winnerIndex];
  const containerWidth = container.clientWidth;
  const center = containerWidth / 2;
  const randomOffset = Math.random() * 20 - 10;
  const itemStep = CASE_CONFIG.itemWidth + CASE_CONFIG.gap;
  let targetPosition =
    winnerIndex * itemStep +
    CASE_CONFIG.itemWidth / 2 -
    center +
    randomOffset;

  if (Math.abs(targetPosition - currentPosition) < 30) {
    targetPosition += (Math.random() > 0.5 ? 1 : -1) * (itemStep * 3);
  }

  reel.style.transition = 'none';
  reel.style.transform = `translate3d(${-currentPosition}px, -50%, 0)`;
  void reel.offsetWidth;

  reel.style.transition = `transform ${CASE_CONFIG.duration}ms cubic-bezier(0.08, 0.72, 0.12, 1)`;
  reel.style.transform = `translate3d(${-targetPosition}px, -50%, 0)`;
  currentPosition = targetPosition;

  reel.addEventListener('transitionend', () => {
    if (focusFrameId) {
      cancelAnimationFrame(focusFrameId);
      focusFrameId = null;
    }

    winner.element.classList.add('is-winner');
    winner.element.style.transform = 'scale(1.08)';
    winner.element.style.filter = 'brightness(1.08) saturate(1.08) blur(0px)';
    isRolling = false;
    caseDetail.classList.remove('case-opening');
    caseDetail.classList.add('case-result');
    setResultState(true, activeCasePrice || '1 337 ₽');
    casePriceEl.disabled = false;

    lastDroppedItem = {
      name: winner.skin.name,
      price: getItemPriceByRarity(winner.skin.rarity),
      rarity: winner.skin.rarity
    };
    pushLiveFeedItem(lastDroppedItem);
    addDroppedItemToInventory(lastDroppedItem);
    updateFocus();
  }, { once: true });
}

createReel();
renderLiveFeed();
updateFocus();

function parsePriceToNumber(value) {
  const normalized = String(value || '')
    .replace(/\s+/g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');

  if (!normalized) {
    return 0;
  }

  return Number(normalized) || 0;
}

function setResultState(isResult, priceLabel = '1 337 ₽') {
  if (!caseDetail) {
    return;
  }

  caseDetail.classList.toggle('case-result', isResult);

  if (caseIconEl) {
    caseIconEl.hidden = true;
    caseIconEl.style.opacity = '0';
    caseIconEl.style.visibility = 'hidden';
    caseIconEl.style.display = 'none';
  }

  if (caseSellEl) {
    caseSellEl.hidden = !isResult;
    if (isResult) {
      const sellValue = Math.max(1200, Math.round(parsePriceToNumber(priceLabel) * 0.72));
      caseSellEl.textContent = `Продать за ${formatPrice(sellValue)}`;
    }
  }

  if (casePriceEl) {
    casePriceEl.disabled = false;
    casePriceEl.textContent = isResult ? 'Открыть ещё раз' : `Открыть за ${priceLabel}`;
  }
}

function resetCaseToStartState() {
  if (!caseDetail) {
    return;
  }

  body.classList.add('case-modal-open');
  caseDetail.classList.remove('case-opening');
  caseDetail.classList.remove('case-result');
  caseDetail.classList.remove('case-opened');
  caseDetail.setAttribute('aria-hidden', 'false');

  if (caseSellEl) {
    caseSellEl.hidden = true;
  }

  if (caseIconEl) {
    caseIconEl.hidden = false;
    caseIconEl.style.opacity = '1';
    caseIconEl.style.visibility = 'visible';
    caseIconEl.style.display = 'block';
  }

  if (casePriceEl) {
    casePriceEl.hidden = false;
    casePriceEl.disabled = false;
    casePriceEl.textContent = `Открыть за ${activeCasePrice}`;
  }
}

function triggerCaseOpenAction() {
  if (!casePriceEl || !caseDetail) {
    return;
  }

  const user = getActiveUser();
  const caseCost = parsePriceToNumber(activeCasePrice || '0');

  if (user && caseCost > 0) {
    const nextBalance = Number(user.balance || 0) - caseCost;
    user.balance = nextBalance;
    saveActiveUser(user);
    renderProfileBalance();
    updateProfileUI();
  }

  createReel();
  currentPosition = 0;
  reel.style.transition = 'none';
  reel.style.transform = 'translate3d(0, -50%, 0)';

  caseDetail.classList.remove('case-result');
  caseDetail.classList.remove('case-opening');
  void caseDetail.offsetWidth;
  caseDetail.classList.add('case-opening');
  caseDetail.classList.add('case-opened');

  if (caseIconEl) {
    caseIconEl.hidden = true;
    caseIconEl.style.opacity = '0';
    caseIconEl.style.visibility = 'hidden';
    caseIconEl.style.display = 'none';
  }

  items.forEach((item) => {
    item.element.style.opacity = '1';
    item.element.style.transform = 'scale(1)';
    item.element.style.filter = 'brightness(1) saturate(1) blur(0px)';
  });

  if (caseSellEl) {
    caseSellEl.hidden = true;
  }

  casePriceEl.disabled = true;
  casePriceEl.textContent = 'Открытие...';
  casePriceEl.hidden = false;

  window.setTimeout(() => {
    rollCase();
  }, 120);
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    ...user,
    balance: Number(user.balance || 0),
    openedCases: Number(user.openedCases || 0),
    upgrades: Number(user.upgrades || 0),
    contracts: Number(user.contracts || 0),
    inventory: Array.isArray(user.inventory) ? user.inventory : [],
    bestDrop: user.bestDrop || null
  };
}

function getActiveUser() {
  try {
    return normalizeUser(JSON.parse(localStorage.getItem(ACTIVE_USER_KEY) || 'null'));
  } catch (error) {
    return null;
  }
}

function saveActiveUser(user) {
  const normalized = normalizeUser(user);

  if (!normalized) {
    localStorage.removeItem(ACTIVE_USER_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(normalized));
}

function formatAccountBalance(value) {
  return `${Number(value || 0).toFixed(2)} ₽`;
}

function formatPrice(value) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}

function getItemPriceByRarity(rarity) {
  const prices = {
    blue: 2500,
    green: 5200,
    red: 9800,
    purple: 18000,
    pink: 35000,
    gold: 60000
  };

  return prices[rarity] || 5000;
}

function getInventoryByUser(user) {
  return Array.isArray(user?.inventory) ? user.inventory : [];
}

function getBestDropFromInventory(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return items.reduce((best, item) => {
    if (!best || Number(item?.price || 0) > Number(best?.price || 0)) {
      return item;
    }
    return best;
  }, null);
}

function getSkinImageByRarity(rarity) {
  const map = {
    blue: 'img/blue.png',
    green: 'img/green.png',
    red: 'img/red.png',
    purple: 'img/purple.png',
    pink: 'img/rgb.png',
    gold: 'img/logo.png'
  };

  return map[rarity] || 'img/blue.png';
}

function renderProfileStats() {
  const user = getActiveUser();
  const statValues = document.querySelectorAll('.profile-screen__stat-value');

  if (!statValues.length) {
    return;
  }

  const openedCases = Number(user?.openedCases || 0);
  const upgrades = Number(user?.upgrades || 0);
  const contracts = Number(user?.contracts || 0);

  const values = [openedCases, upgrades, contracts];
  statValues.forEach((node, index) => {
    node.textContent = values[index] ?? 0;
  });
}

function renderProfileBalance() {
  const user = getActiveUser();
  const balanceValue = Number(user?.balance || 0).toFixed(2);

  if (menuProfileBalance) {
    menuProfileBalance.textContent = `На счете: ${formatAccountBalance(user?.balance || 0)}`;
  }

  if (profileScreenBalance) {
    profileScreenBalance.textContent = balanceValue;
  }
}

function renderProfileInventory() {
  const user = getActiveUser();
  const inventory = getInventoryByUser(user);
  const inventoryList = document.querySelector('.profile-screen__inventory');
  const bestDropNode = document.querySelector('.profile-screen__drop-card');

  if (bestDropNode) {
    const bestDrop = user?.bestDrop || getBestDropFromInventory(inventory);
    if (bestDrop && Number(bestDrop.price || 0) > 0) {
      bestDropNode.innerHTML = `
        <div class="profile-screen__drop-title">Лучший дроп</div>
        <div class="profile-screen__drop-name">${bestDrop.name}</div>
        <div class="profile-screen__drop-icon">
          <img src="${getSkinImageByRarity(bestDrop.rarity || 'blue')}" alt="${bestDrop.name}" />
        </div>
      `;
    } else {
      bestDropNode.innerHTML = `
        <div class="profile-screen__drop-title">Лучший дроп</div>
        <div class="profile-screen__drop-name profile-screen__drop-name--empty">Отобразится</div>
        <div class="profile-screen__drop-icon profile-screen__drop-icon--empty">
          <div class="profile-screen__drop-icon-placeholder"></div>
        </div>
      `;
    }
  }

  if (!inventoryList) {
    return;
  }

  if (!inventory.length) {
    inventoryList.innerHTML = '<div class="profile-screen__inventory-empty">Нет предметов</div>';
    return;
  }

  inventoryList.innerHTML = inventory.map((item, index) => {
    const itemPending = Boolean(item.pendingWithdraw);
    const actionMarkup = itemPending
      ? ''
      : `
        <div class="profile-screen__inventory-actions">
          <button type="button" class="profile-screen__action profile-screen__action--sell" data-index="${index}" data-action="sell">Продать</button>
          <button type="button" class="profile-screen__action profile-screen__action--withdraw" data-index="${index}" data-action="withdraw" ${user?.tradeUrl ? '' : 'disabled'}>Вывести</button>
        </div>
      `;

    return `
      <div class="profile-screen__inventory-item ${itemPending ? 'is-pending' : ''}" data-index="${index}">
        <div class="profile-screen__inventory-art ${item.rarity || 'purple'} ${itemPending ? 'profile-screen__inventory-art--pending' : ''}">
          ${itemPending ? `
            <div class="profile-screen__inventory-pending">
              <div class="profile-screen__inventory-status-icon">⏱</div>
              <div class="profile-screen__inventory-status-text">В течение 10 мин. поступит обмен.</div>
            </div>
          ` : ''}
          <div class="profile-screen__inventory-tag">${item.name}</div>
          <img src="${getSkinImageByRarity(item.rarity || 'blue')}" alt="${item.name}" draggable="false" />
          <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
        </div>
        ${actionMarkup}
      </div>
    `;
  }).join('');

  inventoryList.querySelectorAll('.profile-screen__inventory-item').forEach((itemNode) => {
    itemNode.addEventListener('click', (event) => {
      if (event.target.closest('.profile-screen__action')) {
        return;
      }

      inventoryList.querySelectorAll('.profile-screen__inventory-item').forEach((node) => node.classList.remove('is-active'));
      itemNode.classList.add('is-active');
    });
  });

  inventoryList.querySelectorAll('.profile-screen__action').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const itemIndex = Number(button.dataset.index);
      const selectedUser = getActiveUser();

      if (!selectedUser) {
        return;
      }

      const itemList = getInventoryByUser(selectedUser);
      const item = itemList[itemIndex];
      if (!item) {
        return;
      }

      if (action === 'sell') {
        selectedUser.balance = Number(selectedUser.balance || 0) + Number(item.price || 0);
        itemList.splice(itemIndex, 1);
        selectedUser.inventory = itemList;
        selectedUser.bestDrop = getBestDropFromInventory(itemList) || null;
        saveActiveUser(selectedUser);
        renderProfileBalance();
        renderProfileStats();
        renderProfileInventory();
        updateProfileUI();
        return;
      }

      if (action === 'withdraw') {
        if (!selectedUser.tradeUrl) {
          return;
        }

        item.pendingWithdraw = true;
        selectedUser.inventory = itemList;
        saveActiveUser(selectedUser);
        renderProfileInventory();
        updateProfileUI();
      }
    });
  });
}

function sellAllItems() {
  const user = getActiveUser();
  if (!user) {
    return;
  }

  user.inventory = [];
  user.bestDrop = user.bestDrop || null;
  saveActiveUser(user);
  renderProfileStats();
  renderProfileInventory();
}

function getLiveFeedItems() {
  try {
    const items = JSON.parse(localStorage.getItem(LIVE_FEED_KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch (error) {
    return [];
  }
}

function saveLiveFeedItems(items) {
  localStorage.setItem(LIVE_FEED_KEY, JSON.stringify(items));
}

function pushLiveFeedItem(item) {
  if (!item || !item.name) {
    return;
  }

  const record = {
    name: item.name,
    rarity: item.rarity || 'blue',
    price: Number(item.price || getItemPriceByRarity(item.rarity || 'blue')),
    image: getSkinImageByRarity(item.rarity || 'blue')
  };

  const feed = [record, ...getLiveFeedItems()].slice(0, 8);
  saveLiveFeedItems(feed);
  renderLiveFeed();
}

function renderLiveFeed() {
  if (!liveFeedEl) {
    return;
  }

  const feed = getLiveFeedItems();
  const items = feed.length ? feed : [
    { name: 'AK-47', rarity: 'blue', price: 2500, image: getSkinImageByRarity('blue') },
    { name: 'M4A1-S', rarity: 'red', price: 9800, image: getSkinImageByRarity('red') },
    { name: 'USP-S', rarity: 'purple', price: 18000, image: getSkinImageByRarity('purple') },
    { name: 'AWP', rarity: 'green', price: 5200, image: getSkinImageByRarity('green') }
  ];

  liveFeedEl.innerHTML = items.map((item) => {
    const rarityClass = `card-image--${item.rarity || 'blue'}`;
    const title = item.name || 'Предмет';
    const subtitle = item.name || 'Скин';
    return `
      <article class="live-card">
        <div class="card-image ${rarityClass}">
          <img src="${item.image || getSkinImageByRarity(item.rarity || 'blue')}" alt="${title}" />
        </div>
        <div class="card-meta">
          <strong>${title.split(' ')[0] || title}</strong>
          <span>${subtitle}</span>
        </div>
      </article>
    `;
  }).join('');
}

function addDroppedItemToInventory(item) {
  if (!item) {
    return;
  }

  const user = getActiveUser();
  if (!user) {
    return;
  }

  const inventory = getInventoryByUser(user);
  const nextItem = {
    name: item.name,
    price: Number(item.price || getItemPriceByRarity(item.rarity)),
    rarity: item.rarity || 'blue'
  };

  user.inventory = [...inventory, nextItem];
  user.openedCases = Number(user.openedCases || 0) + 1;
  user.bestDrop = getBestDropFromInventory(user.inventory) || user.bestDrop;

  saveActiveUser(user);
  renderProfileStats();
  renderProfileInventory();
}

function sellLatestItem() {
  const user = getActiveUser();
  if (!user) {
    return;
  }

  const inventory = [...getInventoryByUser(user)];
  if (!inventory.length) {
    return;
  }

  const lastItem = inventory[inventory.length - 1];
  const sellValue = Math.max(1200, Math.round(Number(lastItem?.price || 0) * 0.72));

  user.balance = Number(user.balance || 0) + sellValue;
  inventory.pop();
  user.inventory = inventory;
  user.bestDrop = getBestDropFromInventory(inventory) || user.bestDrop || null;
  saveActiveUser(user);
  renderProfileBalance();
  renderProfileStats();
  renderProfileInventory();
  updateProfileUI();
}

function updateProfileUI() {
  const user = getActiveUser();
  const loginBtn = document.querySelector('.menu-login');

  if (user && menuProfile) {
    const avatarText = user.username ? user.username.charAt(0).toUpperCase() : 'П';
    const balanceText = `На счете: ${formatAccountBalance(user.balance || 0)}`;

    if (menuProfileAvatar) {
      menuProfileAvatar.textContent = avatarText;
    }

    if (menuProfileName) {
      menuProfileName.textContent = user.username;
    }

    if (menuProfileBalance) {
      menuProfileBalance.textContent = balanceText;
    }

    menuProfile.hidden = false;
    menuProfile.style.display = 'flex';
    if (loginBtn) {
      loginBtn.style.display = 'none';
      loginBtn.hidden = true;
    }

    renderProfileBalance();
    renderProfileStats();
    renderProfileInventory();
    return;
  }

  if (menuProfile) {
    menuProfile.hidden = true;
    menuProfile.style.display = 'none';
  }

  if (loginBtn) {
    loginBtn.style.display = 'inline-flex';
    loginBtn.hidden = false;
  }
}

function openProfileScreen() {
  const user = getActiveUser();

  if (!user) {
    openAuthModal();
    return;
  }

  if (profileScreenName) {
    profileScreenName.textContent = user.username;
  }

  if (profileScreenId) {
    profileScreenId.textContent = `ID: ${Math.floor(Math.random() * 90000) + 10000}`;
  }

  if (profileScreenAvatar) {
    profileScreenAvatar.textContent = user.username.charAt(0).toUpperCase();
  }

  renderProfileBalance();
  renderProfileStats();
  renderProfileInventory();

  body.classList.add('profile-screen-open');
  if (profileScreen) {
    profileScreen.classList.add('is-open');
    profileScreen.setAttribute('aria-hidden', 'false');
  }

  setMenuState(false);
}

function closeProfileScreen() {
  body.classList.remove('profile-screen-open');
  if (profileScreen) {
    profileScreen.classList.remove('is-open');
    profileScreen.setAttribute('aria-hidden', 'true');
  }
}

function openSettingsModal() {
  if (!settingsModal) {
    return;
  }

  const user = getActiveUser();
  const nickInput = settingsModal.querySelector('.settings-modal__field input');
  const tradeInput = settingsModal.querySelector('.settings-modal__trade-wrap input');

  if (nickInput && user && user.username) {
    nickInput.value = user.username;
  }

  if (tradeInput && user && user.tradeUrl) {
    tradeInput.value = user.tradeUrl;
  }

  settingsModal.classList.add('is-open');
  settingsModal.setAttribute('aria-hidden', 'false');
}

function saveSettingsForm() {
  const user = getActiveUser();
  if (!user) {
    return;
  }

  const nickInput = settingsModal?.querySelector('.settings-modal__field input');
  const tradeInput = settingsModal?.querySelector('.settings-modal__trade-wrap input');

  const nextUsername = (nickInput?.value || '').trim();
  const nextTradeUrl = (tradeInput?.value || '').trim();

  if (nextUsername) {
    user.username = nextUsername;
  }

  if (nextTradeUrl) {
    user.tradeUrl = nextTradeUrl;
  }

  saveActiveUser(user);
  const users = getUsers();
  const userIndex = users.findIndex((item) => item.username === user.username || item.username === (nickInput?.dataset.previousUsername || user.username));

  if (userIndex >= 0) {
    users[userIndex] = {
      ...users[userIndex],
      ...user,
      username: user.username
    };
    saveUsers(users);
  }

  updateProfileUI();
  if (profileScreenName) {
    profileScreenName.textContent = user.username;
  }
  if (profileScreenAvatar) {
    profileScreenAvatar.textContent = user.username.charAt(0).toUpperCase();
  }
}

function closeSettingsModal() {
  if (!settingsModal) {
    return;
  }

  settingsModal.classList.remove('is-open');
  settingsModal.setAttribute('aria-hidden', 'true');
}

function setMenuState(isOpen) {
  body.classList.toggle('menu-open', isOpen);

  if (menuOverlay) {
    menuOverlay.classList.toggle('is-open', isOpen);
    menuOverlay.style.display = isOpen ? 'block' : 'none';
    menuOverlay.style.visibility = isOpen ? 'visible' : 'hidden';
    menuOverlay.style.opacity = isOpen ? '1' : '0';
  }

  if (sideMenu) {
    sideMenu.classList.toggle('is-open', isOpen);
    sideMenu.style.display = isOpen ? 'flex' : 'none';
    sideMenu.style.visibility = isOpen ? 'visible' : 'hidden';
    sideMenu.style.opacity = isOpen ? '1' : '0';
    sideMenu.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
  }

  menuToggles.forEach((toggle) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function openAuthModal() {
  if (!authModal) {
    return;
  }

  authModal.classList.add('is-open');
  authModal.setAttribute('aria-hidden', 'false');
  body.classList.add('menu-open');
  setMenuState(false);
}

function closeAuthModal() {
  if (!authModal) {
    return;
  }

  authModal.classList.remove('is-open');
  authModal.setAttribute('aria-hidden', 'true');
  body.classList.remove('menu-open');
}

function openLoginModal() {
  if (!loginModal) {
    return;
  }

  closeAuthModal();
  if (registerModal) {
    registerModal.classList.remove('is-open');
    registerModal.setAttribute('aria-hidden', 'true');
  }
  loginModal.classList.add('is-open');
  loginModal.setAttribute('aria-hidden', 'false');
}

function closeLoginModal() {
  if (!loginModal) {
    return;
  }

  loginModal.classList.remove('is-open');
  loginModal.setAttribute('aria-hidden', 'true');
}

function openRegisterModal() {
  if (!registerModal) {
    return;
  }

  closeAuthModal();
  if (loginModal) {
    loginModal.classList.remove('is-open');
    loginModal.setAttribute('aria-hidden', 'true');
  }
  registerModal.classList.add('is-open');
  registerModal.setAttribute('aria-hidden', 'false');
}

function closeRegisterModal() {
  if (!registerModal) {
    return;
  }

  registerModal.classList.remove('is-open');
  registerModal.setAttribute('aria-hidden', 'true');
}

function goToHomeFromCase() {
  closeCaseDetail();
  setMenuState(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSiteTop() {
  closeProfileScreen();
  closeCaseDetail();
  closeUpgradeScreen();
  setMenuState(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

menuToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const isOpen = !body.classList.contains('menu-open');
    setMenuState(isOpen);
  });
});

if (menuOverlay) {
  menuOverlay.addEventListener('click', () => setMenuState(false));
}

menuCloses.forEach((closeButton) => {
  closeButton.addEventListener('click', () => setMenuState(false));
});

menuLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') || '';
    const section = href.replace('#', '');

    setMenuState(false);

    if (section === 'profile-inventory' || section === 'inventory') {
      event.preventDefault();
      openProfileScreen();
      setTimeout(() => {
        if (profileScreen && profileInventory) {
          profileScreen.scrollTo({
            top: Math.max(profileInventory.offsetTop - 24, 0),
            behavior: 'smooth'
          });
        }
      }, 60);
      return;
    }

    if (section === 'site-top' || section === 'cases' || section === 'home') {
      event.preventDefault();
      closeProfileScreen();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'profile') {
      event.preventDefault();
      openProfileScreen();
      return;
    }

    if (section === 'upgrade-screen') {
      event.preventDefault();
      openUpgradeScreen();
      return;
    }
  });
});

function openCaseDetail(name, price, imageSrc) {
  body.classList.add('case-modal-open');
  activeCasePrice = price && price.trim() ? price.trim() : '1 337.90 ₽';

  if (caseDetail) {
    caseDetail.setAttribute('aria-hidden', 'false');
    caseDetail.classList.remove('case-opening');
    caseDetail.classList.remove('case-result');
    caseDetail.classList.remove('case-opened');
  }

  if (caseIconEl) {
    caseIconEl.hidden = false;
    caseIconEl.style.opacity = '1';
    caseIconEl.style.visibility = 'visible';
    caseIconEl.style.display = 'block';
  }

  items.forEach((item) => {
    item.element.style.opacity = '';
    item.element.style.transform = '';
    item.element.style.filter = '';
  });

  if (caseSellEl) {
    caseSellEl.hidden = true;
  }

  if (casePriceEl) {
    casePriceEl.hidden = false;
    casePriceEl.textContent = `Открыть за ${activeCasePrice}`;
    casePriceEl.disabled = false;
  }

  if (caseIconEl && imageSrc) {
    caseIconEl.src = imageSrc;
    caseIconEl.alt = name ? `${name} иконка` : 'Иконка кейса';
    caseIconEl.hidden = false;
    caseIconEl.style.opacity = '1';
    caseIconEl.style.visibility = 'visible';
    caseIconEl.style.display = 'block';
  }
}

function closeCaseDetail() {
  body.classList.remove('case-modal-open');
  if (caseDetail) {
    caseDetail.setAttribute('aria-hidden', 'true');
    caseDetail.classList.remove('case-opening');
    caseDetail.classList.remove('case-result');
  }
  if (caseIconEl) {
    caseIconEl.hidden = true;
    caseIconEl.style.opacity = '0';
    caseIconEl.style.visibility = 'hidden';
    caseIconEl.style.display = 'none';
  }
}

brandItems.forEach((brand) => {
  brand.addEventListener('click', () => {
    goToSiteTop();
  });
});

function bindCaseCardEvents() {
  const buttons = document.querySelectorAll('.case-card button');
  const openTargets = document.querySelectorAll('.case-card__image-wrap, .case-card__name');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.caseName || 'Кейс';
      const price = button.dataset.casePrice || '1 337.90 ₽';
      const image = button.dataset.caseImage || 'img/blue.png';
      openCaseDetail(name, price, image);
    });
  });

  openTargets.forEach((target) => {
    target.addEventListener('click', () => {
      const article = target.closest('.case-card');
      const button = article ? article.querySelector('button') : null;
      if (button) {
        const name = button.dataset.caseName || 'Кейс';
        const price = button.dataset.casePrice || '1 337.90 ₽';
        const image = button.dataset.caseImage || 'img/blue.png';
        openCaseDetail(name, price, image);
      }
    });
  });
}

bindCaseCardEvents();

if (menuLoginBtn) {
  menuLoginBtn.addEventListener('click', () => {
    openAuthModal();
  });
}

if (menuProfile) {
  menuProfile.addEventListener('click', () => {
    openProfileScreen();
  });
}

const profileSellAllBtn = document.querySelector('.profile-screen__sell-all');
if (profileSellAllBtn) {
  profileSellAllBtn.addEventListener('click', () => {
    sellAllItems();
  });
}

if (profileSettingsBtn) {
  profileSettingsBtn.addEventListener('click', () => {
    openSettingsModal();
  });
}

if (profileScreenLogout) {
  profileScreenLogout.addEventListener('click', () => {
    saveActiveUser(null);
    closeProfileScreen();
    updateProfileUI();
  });
}

function openUpgradeScreen() {
  closeProfileScreen();
  closeCaseDetail();
  setMenuState(false);
  body.classList.add('upgrade-screen-open');
  upgradeScreenCurrentRotation = 0;
  upgradeScreenSpinning = false;
  upgradeScreenStopAngle = 0;
  selectedUpgradeChance = Number(upgradeScreenConfig.chance) || 40;
  resetUpgradeChanceButtonsState();
  setUpgradeControlsLocked(false);
  if (upgradeScreen) {
    upgradeScreen.hidden = false;
    upgradeScreen.setAttribute('aria-hidden', 'false');
  }
}

function closeUpgradeScreen() {
  body.classList.remove('upgrade-screen-open');
  upgradeScreenCurrentRotation = 0;
  upgradeScreenSpinning = false;
  upgradeScreenStopAngle = 0;
  selectedUpgradeChance = Number(upgradeScreenConfig.chance) || 40;
  resetUpgradeChanceButtonsState();
  setUpgradeControlsLocked(false);
  if (upgradeScreen) {
    upgradeScreen.setAttribute('aria-hidden', 'true');
    upgradeScreen.hidden = true;
  }
}

window.openUpgradeScreen = openUpgradeScreen;
window.closeUpgradeScreen = closeUpgradeScreen;

if (upgradeCloseBtn) {
  upgradeCloseBtn.addEventListener('click', closeUpgradeScreen);
}

const upgradeScreenConfig = {
  chance: 40,
  duration: 4000,
  minRounds: 8,
  maxRounds: 12
};

const upgradeScreenEls = {
  arrowOrbit: document.querySelector('.upgrade-screen #arrowOrbit'),
  button: document.querySelector('.upgrade-screen #upgradeButton'),
  status: document.querySelector('.upgrade-screen #status'),
  result: document.querySelector('.upgrade-screen #result'),
  resultTitle: document.querySelector('.upgrade-screen #resultTitle'),
  resultValue: document.querySelector('.upgrade-screen #resultValue'),
  upgrader: document.querySelector('.upgrade-screen #upgrader'),
  chanceElement: document.querySelector('.upgrade-screen #chance'),
  winArcs: document.querySelectorAll('.upgrade-screen .win-arc, .upgrade-screen .win-arc-inner'),
  selectedItemSlot: document.querySelector('#upgradeSelectedItemSlot'),
  rewardItemSlot: document.querySelector('#upgradeRewardItemSlot'),
  inventoryPicker: document.querySelector('#upgradeInventoryPicker')
};

let upgradeScreenCurrentRotation = 0;
let upgradeScreenSpinning = false;
let selectedUpgradeItemIndex = -1;
let upgradeScreenStopAngle = 0;
let selectedUpgradeChance = 40;

function getCanonicalUpgradeChance(value = selectedUpgradeChance) {
  const nextValue = Number(value ?? upgradeScreenConfig.chance ?? 40);
  return Math.max(5, Math.min(95, Number.isFinite(nextValue) ? nextValue : 40));
}

function setUpgradeControlsLocked(isLocked) {
  const hasSelection = Boolean(getSelectedUpgradeItem());

  if (upgradeScreenEls.button) {
    upgradeScreenEls.button.disabled = isLocked || !hasSelection;
  }

  document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier').forEach((button) => {
    const lockedForSpin = isLocked || upgradeScreenSpinning;
    button.disabled = lockedForSpin || !hasSelection;
  });

  document.querySelectorAll('.upgrade-screen .upgrade-panel__slot').forEach((slot) => {
    slot.style.pointerEvents = isLocked ? 'none' : '';
    slot.setAttribute('aria-disabled', String(isLocked));
  });

  if (upgradeScreenEls.selectedItemSlot) {
    upgradeScreenEls.selectedItemSlot.style.pointerEvents = isLocked ? 'none' : '';
    upgradeScreenEls.selectedItemSlot.setAttribute('aria-disabled', String(isLocked));
  }

  if (upgradeScreenEls.inventoryPicker) {
    upgradeScreenEls.inventoryPicker.style.pointerEvents = isLocked ? 'none' : '';
  }
}

function resetUpgradeChanceButtonsState(preferredButton = null) {
  const buttons = Array.from(document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier'));
  const preferredChance = preferredButton && buttons.includes(preferredButton)
    ? Number(preferredButton.dataset.chance || selectedUpgradeChance || upgradeScreenConfig.chance || 40)
    : selectedUpgradeChance;

  selectedUpgradeChance = getCanonicalUpgradeChance(preferredChance ?? upgradeScreenConfig.chance ?? 40);
  upgradeScreenConfig.chance = selectedUpgradeChance;

  if (upgradeScreenEls.chanceElement) {
    upgradeScreenEls.chanceElement.textContent = `${selectedUpgradeChance}%`;
  }

  const hasSelection = Boolean(getSelectedUpgradeItem());
  buttons.forEach((button) => {
    const isActive = Number(button.dataset.chance || 0) === selectedUpgradeChance;
    button.classList.toggle('active', isActive);
    button.disabled = upgradeScreenSpinning || !hasSelection;
  });
}

function resetUpgradeState() {
  upgradeScreenSpinning = false;
  resetUpgradeChanceButtonsState();
  setUpgradeControlsLocked(false);
  syncUpgradeButtonState();
  renderUpgradeRewardItem();
}

function getUpgradeInventoryItems() {
  const user = getActiveUser();
  return Array.isArray(user?.inventory) ? user.inventory : [];
}

function ensureUpgradeSelectionState() {
  const items = getUpgradeInventoryItems();

  if (!items.length) {
    selectedUpgradeItemIndex = -1;
    return null;
  }

  if (selectedUpgradeItemIndex < 0 || selectedUpgradeItemIndex >= items.length) {
    selectedUpgradeItemIndex = 0;
  }

  return items[selectedUpgradeItemIndex];
}

function getSelectedUpgradeItem() {
  const items = getUpgradeInventoryItems();
  if (!items.length) {
    selectedUpgradeItemIndex = -1;
    return null;
  }

  if (selectedUpgradeItemIndex < 0 || selectedUpgradeItemIndex >= items.length) {
    ensureUpgradeSelectionState();
    return items[selectedUpgradeItemIndex] ?? null;
  }

  return items[selectedUpgradeItemIndex];
}

function syncUpgradeButtonState() {
  const selectedItem = getSelectedUpgradeItem();
  const hasSelection = Boolean(selectedItem);

  if (upgradeScreenEls.button) {
    upgradeScreenEls.button.disabled = !hasSelection || upgradeScreenSpinning;
  }

  document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier').forEach((button) => {
    button.disabled = upgradeScreenSpinning || !hasSelection;
  });
}

function clampUpgradeSelectionIndex(items = getUpgradeInventoryItems()) {
  if (!Array.isArray(items) || !items.length) {
    selectedUpgradeItemIndex = -1;
    return -1;
  }

  const maxIndex = items.length - 1;
  if (selectedUpgradeItemIndex < 0) {
    selectedUpgradeItemIndex = 0;
  }
  if (selectedUpgradeItemIndex > maxIndex) {
    selectedUpgradeItemIndex = maxIndex;
  }

  return selectedUpgradeItemIndex;
}

function refreshUpgradeUiAfterChanceChange() {
  resetUpgradeChanceButtonsState();
  syncUpgradeButtonState();
  renderUpgradeRewardItem();
}

function getUpgradeRewardPreview(selectedItem) {
  if (!selectedItem) {
    return null;
  }

  const chance = Math.max(5, Math.min(95, Number(upgradeScreenConfig.chance) || 50));
  const payoutMultiplier = 100 / chance;
  const rewardPrice = Math.round(Number(selectedItem.price || 0) * payoutMultiplier);

  return {
    ...selectedItem,
    name: selectedItem.name,
    rarity: selectedItem.rarity || 'blue',
    price: rewardPrice,
    isRewardPreview: true
  };
}

function renderUpgradeRewardItem() {
  const slot = upgradeScreenEls.rewardItemSlot;
  if (!slot) {
    return;
  }

  const items = getUpgradeInventoryItems();
  const hasActualSelection = selectedUpgradeItemIndex >= 0 && selectedUpgradeItemIndex < items.length;
  if (!hasActualSelection) {
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
    return;
  }

  const selectedItem = items[selectedUpgradeItemIndex];
  const rewardItem = getUpgradeRewardPreview(selectedItem);

  if (!rewardItem) {
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
    return;
  }

  const image = getSkinImageByRarity(rewardItem.rarity || 'blue');
  slot.innerHTML = `
    <div class="upgrade-panel__slot-preview upgrade-panel__slot-preview--selected">
      <img src="${image}" alt="${rewardItem.name}" />
      <span class="upgrade-panel__slot-price">${formatPrice(rewardItem.price)}</span>
    </div>
  `;
}

function renderUpgradeSelectedItem() {
  const slot = upgradeScreenEls.selectedItemSlot;
  const picker = upgradeScreenEls.inventoryPicker;
  const items = getUpgradeInventoryItems();

  if (!slot) {
    return;
  }

  if (!items.length) {
    selectedUpgradeItemIndex = -1;
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
    renderUpgradeRewardItem();
    if (picker) {
      picker.hidden = true;
      picker.innerHTML = '';
    }
    syncUpgradeButtonState();
    return;
  }

  clampUpgradeSelectionIndex(items);

  const selectedItem = items[selectedUpgradeItemIndex];
  const image = getSkinImageByRarity(selectedItem.rarity || 'blue');
  slot.innerHTML = `
    <div class="upgrade-panel__slot-preview upgrade-panel__slot-preview--selected">
      <img src="${image}" alt="${selectedItem.name}" />
      <span class="upgrade-panel__slot-price">${formatPrice(selectedItem.price)}</span>
    </div>
  `;

  renderUpgradeRewardItem();

  if (picker) {
    picker.hidden = true;
    picker.innerHTML = items.map((item, index) => {
      const itemRarity = item.rarity || 'blue';
      const isActive = index === selectedUpgradeItemIndex;
      return `
        <button type="button" class="upgrade-panel__slot-option ${isActive ? 'is-active' : ''}" data-index="${index}">
          <div class="profile-screen__inventory-item ${isActive ? 'is-active' : ''}">
            <div class="profile-screen__inventory-art ${itemRarity}" style="border-bottom-color: var(--rarity-${itemRarity})">
              <div class="profile-screen__inventory-tag">${item.name}</div>
              <img src="${getSkinImageByRarity(itemRarity)}" alt="${item.name}" draggable="false" />
              <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
            </div>
          </div>
        </button>
      `;
    }).join('');

    picker.querySelectorAll('.upgrade-panel__slot-option').forEach((option) => {
      option.addEventListener('click', () => {
        selectedUpgradeItemIndex = Number(option.dataset.index);
        renderUpgradeSelectedItem();
        syncUpgradeButtonState();
        if (picker) {
          picker.hidden = true;
        }
      });
    });
  }

  syncUpgradeButtonState();
}

function syncUpgradeChanceButtons() {
  const buttons = document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier');

  buttons.forEach((button) => {
    const isActive = Number(button.dataset.chance || 0) === selectedUpgradeChance;
    button.classList.toggle('active', isActive);
  });
}

function setUpgradeChance(chance) {
  const safeChance = getCanonicalUpgradeChance(chance);
  upgradeScreenConfig.chance = safeChance;
  selectedUpgradeChance = safeChance;

  if (upgradeScreenEls.chanceElement) {
    upgradeScreenEls.chanceElement.textContent = `${safeChance}%`;
  }

  upgradeScreenEls.winArcs.forEach((arc) => {
    arc.setAttribute('stroke-dasharray', `${safeChance} ${100 - safeChance}`);
  });

  resetUpgradeChanceButtonsState();
  syncUpgradeChanceButtons();
  renderUpgradeRewardItem();
  syncUpgradeButtonState();
}

function normalizeUpgradeAngle(angle) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function isInsideUpgradeWinZone(rotation) {
  const angle = normalizeUpgradeAngle(rotation);
  return angle >= 0 && angle <= upgradeScreenConfig.chance * 3.6;
}

function getUpgradeStopAngle() {
  const winSize = upgradeScreenConfig.chance * 3.6;
  const shouldWin = Math.random() * 100 < upgradeScreenConfig.chance;

  if (shouldWin) {
    return normalizeUpgradeAngle(Math.random() * winSize);
  }

  const minLoseAngle = winSize + 18;
  const maxLoseAngle = 360 - 18;
  return normalizeUpgradeAngle(minLoseAngle + Math.random() * (maxLoseAngle - minLoseAngle));
}

function runUpgradeAnimation() {
  if (!upgradeScreenEls.arrowOrbit || !upgradeScreenEls.button || !upgradeScreenEls.result) {
    return;
  }

  const items = getUpgradeInventoryItems();
  if (!items.length) {
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = 'Выберите предмет из инвентаря';
    }
    return;
  }

  const selectedItem = getSelectedUpgradeItem();
  if (!selectedItem) {
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = 'Выберите предмет из инвентаря';
    }
    syncUpgradeButtonState();
    return;
  }

  if (upgradeScreenSpinning) {
    return;
  }

  upgradeScreenSpinning = false;
  resetUpgradeChanceButtonsState();
  upgradeScreenSpinning = true;
  upgradeScreenStopAngle = getUpgradeStopAngle();
  setUpgradeControlsLocked(true);
  upgradeScreenEls.result.classList.remove('show');
  upgradeScreenEls.upgrader?.classList.remove('win');
  if (upgradeScreenEls.status) {
    upgradeScreenEls.status.textContent = `Улучшение: ${selectedItem.name}`;
  }

  const rounds = Math.floor(upgradeScreenConfig.minRounds + Math.random() * (upgradeScreenConfig.maxRounds - upgradeScreenConfig.minRounds + 1));
  const currentNormalized = normalizeUpgradeAngle(upgradeScreenCurrentRotation);
  const delta = normalizeUpgradeAngle(upgradeScreenStopAngle - currentNormalized);
  const targetRotation = upgradeScreenCurrentRotation + delta + rounds * 360;

  upgradeScreenConfig.chance = getCanonicalUpgradeChance(selectedUpgradeChance);
  selectedUpgradeChance = getCanonicalUpgradeChance(selectedUpgradeChance);

  upgradeScreenEls.arrowOrbit.style.transition = `transform ${upgradeScreenConfig.duration}ms cubic-bezier(.07,.72,.04,1)`;
  upgradeScreenEls.arrowOrbit.style.transform = `rotate(${targetRotation}deg)`;
  upgradeScreenCurrentRotation = targetRotation;

  setTimeout(() => {
    const win = isInsideUpgradeWinZone(upgradeScreenStopAngle);
    const user = getActiveUser();

    upgradeScreenSpinning = false;
    setUpgradeControlsLocked(false);

    if (win) {
      const selectedItem = getSelectedUpgradeItem();
      const rewardPreview = getUpgradeRewardPreview(selectedItem);

      if (user && Array.isArray(user.inventory) && selectedUpgradeItemIndex >= 0 && rewardPreview) {
        user.inventory.splice(selectedUpgradeItemIndex, 1);
        user.inventory.push({
          ...rewardPreview,
          isRewardPreview: false,
          upgraded: true,
          price: Number(rewardPreview.price || 0)
        });
        selectedUpgradeItemIndex = clampUpgradeSelectionIndex(user.inventory);
        saveActiveUser(user);
        renderProfileInventory();
      }

      upgradeScreenEls.upgrader?.classList.add('win');
      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = 'Улучшение применено';
      }
    } else {
      if (user && Array.isArray(user.inventory) && selectedUpgradeItemIndex >= 0 && selectedUpgradeItemIndex < user.inventory.length) {
        user.inventory.splice(selectedUpgradeItemIndex, 1);
        selectedUpgradeItemIndex = clampUpgradeSelectionIndex(user.inventory);
        saveActiveUser(user);
        renderProfileInventory();
      }

      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = 'Попробуйте ещё раз';
      }
    }

    renderUpgradeSelectedItem();
    upgradeScreenSpinning = false;
    resetUpgradeChanceButtonsState();
    syncUpgradeButtonState();
    setUpgradeControlsLocked(false);
    upgradeScreenEls.result.classList.remove('show');
  }, upgradeScreenConfig.duration);
}

setUpgradeChance(upgradeScreenConfig.chance);
selectedUpgradeItemIndex = -1;
renderUpgradeSelectedItem();
syncUpgradeButtonState();

if (upgradeScreenEls.selectedItemSlot) {
  upgradeScreenEls.selectedItemSlot.addEventListener('click', () => {
    if (!upgradeScreenEls.inventoryPicker) {
      return;
    }

    const items = getUpgradeInventoryItems();
    if (!items.length) {
      upgradeScreenEls.inventoryPicker.hidden = true;
      return;
    }

    upgradeScreenEls.inventoryPicker.innerHTML = items.map((item, index) => {
      const itemRarity = item.rarity || 'blue';
      const isActive = index === selectedUpgradeItemIndex;
      return `
        <button type="button" class="upgrade-panel__slot-option ${isActive ? 'is-active' : ''}" data-index="${index}">
          <div class="profile-screen__inventory-item ${isActive ? 'is-active' : ''}">
            <div class="profile-screen__inventory-art ${itemRarity}" style="border-bottom-color: var(--rarity-${itemRarity})">
              <div class="profile-screen__inventory-tag">${item.name}</div>
              <img src="${getSkinImageByRarity(itemRarity)}" alt="${item.name}" draggable="false" />
              <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
            </div>
          </div>
        </button>
      `;
    }).join('');

    upgradeScreenEls.inventoryPicker.querySelectorAll('.upgrade-panel__slot-option').forEach((option) => {
      option.addEventListener('click', () => {
        selectedUpgradeItemIndex = Number(option.dataset.index);
        renderUpgradeSelectedItem();
        upgradeScreenEls.inventoryPicker.hidden = true;
      });
    });

    upgradeScreenEls.inventoryPicker.hidden = !upgradeScreenEls.inventoryPicker.hidden;
  });

  upgradeScreenEls.selectedItemSlot.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      upgradeScreenEls.selectedItemSlot.click();
    }
  });
}

const upgradeChanceButtons = document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier');
upgradeChanceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (upgradeScreenSpinning) {
      return;
    }

    const chance = Number(button.dataset.chance || upgradeScreenConfig.chance || 40);
    if (Number.isFinite(chance)) {
      upgradeScreenSpinning = false;
      setUpgradeControlsLocked(false);
      setUpgradeChance(chance);
      refreshUpgradeUiAfterChanceChange();
    }
  });
});

if (upgradeScreenEls.button) {
  upgradeScreenEls.button.addEventListener('click', () => {
    const selectedItem = getSelectedUpgradeItem();
    if (!selectedItem) {
      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = 'Выберите предмет из инвентаря';
      }
      syncUpgradeButtonState();
      return;
    }

    runUpgradeAnimation();
  });
}

if (upgradeScreenEls.result) {
  upgradeScreenEls.result.addEventListener('click', () => {
    upgradeScreenEls.result.classList.remove('show');
  });
}

if (settingsCloseBtn) {
  settingsCloseBtn.addEventListener('click', closeSettingsModal);
}

if (settingsBackdrop) {
  settingsBackdrop.addEventListener('click', closeSettingsModal);
}

if (settingsSubmit) {
  settingsSubmit.addEventListener('click', () => {
    saveSettingsForm();
    closeSettingsModal();
  });
}

if (authCloseBtn) {
  authCloseBtn.addEventListener('click', closeAuthModal);
}

if (authBackdrop) {
  authBackdrop.addEventListener('click', closeAuthModal);
}

if (authSubmit) {
  authSubmit.addEventListener('click', () => {
    if (!authSubmit.disabled) {
      openLoginModal();
    }
  });
}

if (authRegisterBtn) {
  authRegisterBtn.addEventListener('click', () => {
    openRegisterModal();
  });
}

if (loginCloseBtn) {
  loginCloseBtn.addEventListener('click', () => {
    closeLoginModal();
    if (loginError) {
      loginError.textContent = '';
    }
  });
}

if (loginBackdrop) {
  loginBackdrop.addEventListener('click', () => {
    closeLoginModal();
    if (loginError) {
      loginError.textContent = '';
    }
  });
}

if (registerCloseBtn) {
  registerCloseBtn.addEventListener('click', () => {
    closeRegisterModal();
    if (registerError) {
      registerError.textContent = '';
    }
  });
}

if (registerBackdrop) {
  registerBackdrop.addEventListener('click', () => {
    closeRegisterModal();
    if (registerError) {
      registerError.textContent = '';
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = loginForm.querySelector('input[type="text"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const username = (usernameInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();

    if (!username || !password) {
      if (loginError) {
        loginError.textContent = 'Введите имя пользователя и пароль.';
      }
      return;
    }

    const users = getUsers();
    const user = users.find((item) => item.username === username && item.password === password);

    if (!user) {
      if (loginError) {
        loginError.textContent = 'Пользователь не найден. Проверьте данные.';
      }
      return;
    }

    saveActiveUser(user);
    closeLoginModal();
    updateProfileUI();
    if (loginError) {
      loginError.textContent = '';
    }
    if (loginUsernameInput) {
      loginUsernameInput.value = '';
    }
    if (passwordInput) {
      passwordInput.value = '';
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = registerForm.querySelectorAll('input');
    const [usernameInput, passwordInput, repeatPasswordInput] = fields;
    const username = (usernameInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const repeatPassword = (repeatPasswordInput?.value || '').trim();

    if (!username || !password || !repeatPassword) {
      if (registerError) {
        registerError.textContent = 'Заполните все поля.';
      }
      return;
    }

    if (password !== repeatPassword) {
      if (registerError) {
        registerError.textContent = 'Пароли не совпадают.';
      }
      return;
    }

    const users = getUsers();
    const existingUser = users.find((item) => item.username === username);

    if (existingUser) {
      if (registerError) {
        registerError.textContent = 'Такой пользователь уже существует.';
      }
      return;
    }

    const newUser = {
      username,
      password,
      balance: 200.00
    };

    users.push(newUser);
    saveUsers(users);
    saveActiveUser(newUser);
    closeRegisterModal();
    updateProfileUI();
    if (registerError) {
      registerError.textContent = '';
    }
    fields.forEach((field) => {
      field.value = '';
    });
  });
}

if (authCheckboxes.length) {
  authCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      const nextValue = checkbox.getAttribute('aria-checked') === 'true' ? 'false' : 'true';
      checkbox.setAttribute('aria-checked', nextValue);

      const hasAllChecked = Array.from(authCheckboxes).every((item) => item.getAttribute('aria-checked') === 'true');
      if (authSubmit) {
        authSubmit.disabled = !hasAllChecked;
      }
    });
  });
}

if (casePriceEl) {
  casePriceEl.addEventListener('click', () => {
    if (caseDetail && caseDetail.classList.contains('case-result')) {
      triggerCaseOpenAction();
      return;
    }

    triggerCaseOpenAction();
  });
}

if (caseSellEl) {
  caseSellEl.addEventListener('click', () => {
    sellLatestItem();
    resetCaseToStartState();
  });
}

if (caseClose) {
  caseClose.addEventListener('click', closeCaseDetail);
}

if (caseDetail) {
  caseDetail.addEventListener('click', (event) => {
    if (event.target === caseDetail) {
      closeCaseDetail();
    }
  });
}

updateProfileUI();
