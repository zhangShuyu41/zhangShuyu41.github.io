(function () {
    'use strict';

    /* =============================================
       Toast
       ============================================= */
    function showToast(message, type) {
        type = type || 'success';
        var existing = document.querySelector('.portfolio-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'portfolio-toast';
        toast.textContent = message;

        if (type === 'warning') {
            toast.style.background = '#FFF3E0';
            toast.style.color = '#E65100';
        } else if (type === 'error') {
            toast.style.background = '#FFE7E7';
            toast.style.color = '#D14444';
        }

        document.body.appendChild(toast);
        setTimeout(function () {
            if (toast.parentNode) toast.remove();
        }, 2200);
    }

    /* =============================================
       Smooth Scroll for Nav Links
       ============================================= */
    var navLinks = document.querySelectorAll('.portfolio-nav a[href^="#"]');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href').slice(1);
            var target = document.getElementById(targetId);
            if (target) {
                var headerHeight = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // Also handle hero buttons
    var heroLinks = document.querySelectorAll('.hero-actions a[href^="#"]');
    heroLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href').slice(1);
            var target = document.getElementById(targetId);
            if (target) {
                var headerHeight = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* =============================================
       Active Nav Highlight on Scroll
       ============================================= */
    var sectionIds = [];
    var allSections = document.querySelectorAll('section[id], .portfolio-section[id]');
    allSections.forEach(function (s) { sectionIds.push(s.id); });

    var navAnchors = {};
    navLinks.forEach(function (a) {
        var href = a.getAttribute('href').slice(1);
        navAnchors[href] = a;
    });

    function updateActiveNav() {
        var scrollY = window.pageYOffset + 120;

        var current = null;
        for (var i = 0; i < sectionIds.length; i++) {
            var section = document.getElementById(sectionIds[i]);
            if (section && section.offsetTop <= scrollY) {
                current = sectionIds[i];
            }
        }

        navLinks.forEach(function (a) { a.style.color = ''; a.style.background = ''; });

        if (current && navAnchors[current]) {
            navAnchors[current].style.color = 'var(--primary-dark)';
            navAnchors[current].style.background = 'var(--primary-bg)';
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* =============================================
       Competitor Tabs
       ============================================= */
    var compTabs = document.querySelectorAll('.comp-tab');
    var compViews = document.querySelectorAll('.comp-view');

    compTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var dim = this.dataset.dim;

            compTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');

            compViews.forEach(function (view) {
                view.classList.toggle('active', view.dataset.dim === dim);
            });
        });
    });

    /* =============================================
       Matching Algorithm Demo
       ============================================= */
    var algoDest = document.getElementById('algo-dest');
    var algoTime = document.getElementById('algo-time');
    var algoTag = document.getElementById('algo-tag');
    var algoOther = document.getElementById('algo-other');
    var algoResetBtn = document.getElementById('algo-reset-btn');

    // Base match qualities (how well the candidate matches on each dimension, 0-100)
    var baseQualities = { dest: 90, time: 80, tag: 70, other: 60 };

    function updateAlgoDisplay() {
        var wDest = parseInt(algoDest.value);
        var wTime = parseInt(algoTime.value);
        var wTag = parseInt(algoTag.value);
        var wOther = parseInt(algoOther.value);
        var totalWeight = wDest + wTime + wTag + wOther || 1;

        // Per-dimension scores (weight * quality / total)
        var scoreDest = Math.round((wDest * baseQualities.dest) / totalWeight);
        var scoreTime = Math.round((wTime * baseQualities.time) / totalWeight);
        var scoreTag = Math.round((wTag * baseQualities.tag) / totalWeight);
        var scoreOther = Math.round((wOther * baseQualities.other) / totalWeight);
        var totalScore = scoreDest + scoreTime + scoreTag + scoreOther;

        // Update labels
        document.getElementById('algo-val-dest').textContent = wDest + '%';
        document.getElementById('algo-val-time').textContent = wTime + '%';
        document.getElementById('algo-val-tag').textContent = wTag + '%';
        document.getElementById('algo-val-other').textContent = wOther + '%';

        // Update breakdown
        document.getElementById('algo-score-dest').textContent = scoreDest;
        document.getElementById('algo-score-time').textContent = scoreTime;
        document.getElementById('algo-score-tag').textContent = scoreTag;
        document.getElementById('algo-score-other').textContent = scoreOther;

        document.getElementById('algo-break-dest').style.width = scoreDest + '%';
        document.getElementById('algo-break-time').style.width = scoreTime + '%';
        document.getElementById('algo-break-tag').style.width = scoreTag + '%';
        document.getElementById('algo-break-other').style.width = scoreOther + '%';

        // Total score
        document.getElementById('algo-total-score').textContent = totalScore + '%';
        document.getElementById('algo-bar-fill').style.width = totalScore + '%';

        // Verdict
        var verdictIcon = document.getElementById('verdict-icon');
        var verdictText = document.getElementById('verdict-text');
        if (totalScore >= 75) {
            verdictIcon.textContent = '馃幆';
            verdictText.textContent = '鍖归厤璐ㄩ噺锛氫紭绉€鎺ㄨ崘';
        } else if (totalScore >= 55) {
            verdictIcon.textContent = '馃憤';
            verdictText.textContent = '鍖归厤璐ㄩ噺锛氳壇濂芥帹鑽?;
        } else if (totalScore >= 35) {
            verdictIcon.textContent = '馃';
            verdictText.textContent = '鍖归厤璐ㄩ噺锛氫竴鑸紝鍙皾璇?;
        } else {
            verdictIcon.textContent = '馃憥';
            verdictText.textContent = '鍖归厤璐ㄩ噺锛氫笉寤鸿鎺ㄨ崘';
        }
    }

    if (algoDest && algoTime && algoTag && algoOther) {
        algoDest.addEventListener('input', updateAlgoDisplay);
        algoTime.addEventListener('input', updateAlgoDisplay);
        algoTag.addEventListener('input', updateAlgoDisplay);
        algoOther.addEventListener('input', updateAlgoDisplay);

        if (algoResetBtn) {
            algoResetBtn.addEventListener('click', function () {
                algoDest.value = 30;
                algoTime.value = 30;
                algoTag.value = 25;
                algoOther.value = 15;
                updateAlgoDisplay();
                showToast('鏉冮噸宸叉仮澶嶄负 V1.1 榛樿鍊?, 'success');
            });
        }

        // Initial display
        updateAlgoDisplay();
    }

    /* =============================================
       Phone Mockup - Interactive Demo
       ============================================= */
    var mockupContainer = document.getElementById('phone-mockup');
    if (!mockupContainer) return;

    // App state
    var currentScreen = 'home';
    var mockupPosts = [
        { id: 1, icon: '馃嵅', title: '鍛ㄥ洓鏅?4 浜虹伀閿?, category: '鎷奸', location: '涓滃煄鍖?, time: '21:00', distance: '3.2km', subtitle: '杞荤ぞ浜ょ伀閿咃紝娆㈣繋瀛︾敓鍏?, budget: '80-120 鍏?, vibe: '杞绘澗鑱婂ぉ' },
        { id: 2, icon: '馃弮', title: '鍛ㄤ簲鏅?5km 澶滆窇', category: '杩愬姩', location: '瑗垮煄鍖?, time: '19:30', distance: '1.8km', subtitle: '鎱㈣窇鑺傚锛岀儹鐖辫繍鍔ㄧ殑浣?, intensity: '涓害', exp: '鏂版墜鍙嬪ソ' },
        { id: 3, icon: '馃幀', title: '鍛ㄥ叚涓嬪崍 鐢靛奖绾︾湅', category: '瑙傚奖', location: '鏈濋槼鍖?, time: '16:00', distance: '2.1km', subtitle: '鏂扮墖鍥㈣亰锛岀湅瀹屼竴璧疯瘎浠?, price: '50-80 鍏?, genre: '鍠滃墽/鍓ф儏' },
        { id: 4, icon: '鈽?, title: '鍛ㄤ簲鏅?鍜栧暋鎺㈠簵', category: '鎺㈠簵', location: '娴锋穩鍖?, time: '20:00', distance: '4.0km', subtitle: '灏忎紬鐜锛岄€傚悎杞绘澗鑱婂ぉ', budget: '60-100 鍏?, type: '鍜栧暋鍘? }
    ];

    var categories = ['鎷奸', '杩愬姩', '瑙傚奖', '鎺㈠簵', '瀛︿範', '娓告垙'];
    var selectedMockupCategory = null;
    var selectedMockupPost = null;

    // Demo path step tracking
    var demoTab = 'home'; // home | chat | profile
    var appliedPostId = null;
    var conversationStarted = false;

    function renderPhoneScreen() {
        var screen = document.createElement('div');
        screen.className = 'phone-screen';

        // Status bar
        var statusBar = document.createElement('div');
        statusBar.className = 'phone-status-bar';
        statusBar.innerHTML = '<span>9:41</span><span>馃摱 馃攱</span>';
        screen.appendChild(statusBar);

        // Render based on current screen
        if (currentScreen === 'detail' && selectedMockupPost) {
            renderDetailScreen(screen);
        } else if (currentScreen === 'chat') {
            renderChatScreen(screen);
        } else {
            renderHomeScreen(screen);
        }

        // Bottom nav
        var bottomNav = document.createElement('div');
        bottomNav.className = 'phone-bottom-nav';

        var navItems = [
            { tab: 'home', icon: '馃彔', label: '棣栭〉' },
            { tab: 'chat', icon: '馃挰', label: '娑堟伅' },
            { tab: 'profile', icon: '馃懁', label: '鎴戠殑' }
        ];

        navItems.forEach(function (item) {
            var btn = document.createElement('button');
            btn.className = 'phone-nav-item' + (demoTab === item.tab ? ' active' : '');
            btn.innerHTML = '<span class="phone-nav-icon">' + item.icon + '</span>' + item.label;

            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                demoTab = item.tab;
                if (item.tab === 'home' || item.tab === 'profile') {
                    currentScreen = 'home';
                } else if (item.tab === 'chat') {
                    currentScreen = 'chat';
                }
                selectedMockupPost = null;
                appliedPostId = null;
                conversationStarted = false;
                refreshMockup();

                if (item.tab === 'chat') {
                    setTimeout(function () {
                        showToast('馃挰 鍗虫椂閫氳鍔熻兘婕旂ず', 'success');
                    }, 400);
                }
            });

            bottomNav.appendChild(btn);
        });

        screen.appendChild(bottomNav);
        return screen;
    }

    function renderHomeScreen(screen) {
        // Header
        var header = document.createElement('div');
        header.className = 'phone-header';
        header.innerHTML = '<h3>馃彔 鎼瓙鎴愯</h3><span class="phone-header-icon">馃攳</span>';
        screen.appendChild(header);

        // Welcome banner
        if (!selectedMockupCategory) {
            var banner = document.createElement('div');
            banner.style.cssText = 'padding:6px 18px 2px;font-size:12px;color:#999;';
            banner.textContent = '馃憢 鐐瑰嚮涓嬫柟鍒嗙被寮€濮嬫帰绱?;
            screen.appendChild(banner);
        }

        // Category pills
        var catRow = document.createElement('div');
        catRow.className = 'phone-categories';
        categories.forEach(function (cat) {
            var pill = document.createElement('button');
            pill.className = 'phone-cat-pill' + (selectedMockupCategory === cat ? ' active' : '');
            pill.textContent = cat;
            pill.addEventListener('click', function (e) {
                e.stopPropagation();
                selectedMockupCategory = (selectedMockupCategory === cat) ? null : cat;
                refreshMockup();
                if (selectedMockupCategory) {
                    showToast('宸茬瓫閫夛細' + selectedMockupCategory, 'success');
                }
            });
            catRow.appendChild(pill);
        });
        screen.appendChild(catRow);

        // Post list
        var displayPosts = selectedMockupCategory
            ? mockupPosts.filter(function (p) { return p.category === selectedMockupCategory; })
            : mockupPosts;

        if (displayPosts.length === 0) {
            var empty = document.createElement('div');
            empty.style.cssText = 'padding:40px 18px;text-align:center;font-size:13px;color:#ccc;';
            empty.textContent = '璇ュ垎绫绘殏鏃犲尮閰?;
            screen.appendChild(empty);
        }

        displayPosts.forEach(function (post) {
            var card = document.createElement('div');
            card.className = 'phone-list-card';
            card.innerHTML =
                '<span class="phone-card-badge">' + post.category + '</span>' +
                '<h4>' + post.icon + ' ' + post.title + '</h4>' +
                '<p class="phone-card-meta">' + post.location + ' | ' + post.distance + ' | ' + post.time + '</p>';

            card.addEventListener('click', function (e) {
                e.stopPropagation();
                selectedMockupPost = post;
                currentScreen = 'detail';
                refreshMockup();
            });

            screen.appendChild(card);
        });
    }

    function renderDetailScreen(screen) {
        var post = selectedMockupPost;

        // Back button
        var header = document.createElement('div');
        header.className = 'phone-header';
        header.innerHTML = '<span class="phone-header-icon" style="cursor:pointer;">鈫?杩斿洖</span><span style="font-size:12px;color:#999;">璇︽儏</span><span></span>';
        header.querySelector('.phone-header-icon').addEventListener('click', function (e) {
            e.stopPropagation();
            currentScreen = 'home';
            selectedMockupPost = null;
            refreshMockup();
        });
        screen.appendChild(header);

        var detail = document.createElement('div');
        detail.className = 'phone-detail';

        detail.innerHTML =
            '<span class="phone-detail-tag">' + post.category + '</span>' +
            '<h3>' + post.icon + ' ' + post.title + '</h3>' +
            '<p class="phone-detail-desc">鍦扮偣锛? + post.location + ' | 鏃堕棿锛? + post.time + ' | 2/4 浜?/p>';

        // Info rows
        var infoGrid = document.createElement('div');
        infoGrid.className = 'phone-info-row';

        var infoItems = [];
        if (post.category === '鎷奸') {
            infoItems = [
                '<strong>棰勭畻</strong><span>' + post.budget + '</span>',
                '<strong>姘涘洿</strong><span>' + post.vibe + '</span>'
            ];
        } else if (post.category === '杩愬姩') {
            infoItems = [
                '<strong>寮哄害</strong><span>' + post.intensity + '</span>',
                '<strong>缁忛獙</strong><span>' + post.exp + '</span>'
            ];
        } else if (post.category === '瑙傚奖') {
            infoItems = [
                '<strong>绁ㄤ环</strong><span>' + post.price + '</span>',
                '<strong>绫诲瀷</strong><span>' + post.genre + '</span>'
            ];
        } else {
            infoItems = [
                '<strong>棰勭畻</strong><span>' + (post.budget || '50-100鍏?) + '</span>',
                '<strong>绫诲瀷</strong><span>' + (post.type || '鎺㈠簵') + '</span>'
            ];
        }

        infoItems.forEach(function (item) {
            var div = document.createElement('div');
            div.className = 'phone-info-item';
            div.innerHTML = item;
            infoGrid.appendChild(div);
        });

        detail.appendChild(infoGrid);

        // Note
        var note = document.createElement('div');
        note.className = 'phone-detail-note';
        note.textContent = post.subtitle + '銆傛湡寰呭叴瓒ｇ浉鎶曠殑浣犲姞鍏ワ紒';
        detail.appendChild(note);

        // Action buttons
        var actionRow = document.createElement('div');
        actionRow.className = 'phone-action-row';

        var joinBtn = document.createElement('button');
        joinBtn.className = 'phone-btn phone-btn-primary';
        joinBtn.textContent = appliedPostId === post.id ? '宸茬敵璇?鉁? : '鎴戣鍙傚姞';

        joinBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (appliedPostId === post.id) return;
            appliedPostId = post.id;
            joinBtn.textContent = '宸茬敵璇?鉁?;
            joinBtn.disabled = true;
            joinBtn.style.opacity = '0.7';
            showToast('鎶ュ悕鎴愬姛锛佺瓑寰呭鏂圭‘璁?, 'success');

            // Auto-navigate to chat after short delay to complete the demo flow
            setTimeout(function () {
                conversationStarted = true;
            }, 800);
        });

        var chatBtn = document.createElement('button');
        chatBtn.className = 'phone-btn phone-btn-outline';
        chatBtn.textContent = '绉佽亰TA';

        chatBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!appliedPostId || appliedPostId !== post.id) {
                showToast('璇峰厛鎶ュ悕鍐嶇鑱?, 'warning');
                return;
            }
            currentScreen = 'chat';
            refreshMockup();
            demoTab = 'chat';
        });

        actionRow.appendChild(joinBtn);
        actionRow.appendChild(chatBtn);
        detail.appendChild(actionRow);

        screen.appendChild(detail);
    }

    function renderChatScreen(screen) {
        // Header
        var header = document.createElement('div');
        header.className = 'phone-header';
        header.innerHTML = '<span class="phone-header-icon" style="cursor:pointer;">鈫?杩斿洖</span><h3 style="font-size:15px;">灏忚悓</h3><span class="phone-header-icon">馃摓</span>';
        header.querySelector('.phone-header-icon').addEventListener('click', function (e) {
            e.stopPropagation();
            currentScreen = 'home';
            refreshMockup();
        });
        screen.appendChild(header);

        var chat = document.createElement('div');
        chat.className = 'phone-chat';

        chat.innerHTML =
            '<div class="phone-chat-time">浠婂ぉ 18:24</div>' +
            '<div class="phone-chat-bubble theirs">浣犲ソ锛佺湅鍒颁綘鐨勭伀閿呴個绾︼紝鎴戜篃鎯冲姞鍏 馃嵅</div>' +
            '<div class="phone-chat-bubble mine">娆㈣繋锛佹垜浠懆鍥涙櫄 9 鐐瑰湪鍥借锤纰伴潰锛岀洰鍓嶅凡缁忔湁 2 涓汉浜?/div>' +
            '<div class="phone-chat-bubble theirs">澶ソ浜嗭紒鏈変粈涔堝繉鍙ｅ悧锛熸垜姣旇緝鑳藉悆杈?馃尪锔?/div>' +
            '<div class="phone-chat-bubble mine">娌￠棶棰橈紒鎴戜篃鏄棤杈ｄ笉娆€傚埌鏃跺€欒锛?/div>' +
            '<div class="phone-chat-time">瀵规柟宸茬‘璁ゅ弬鍔?/div>';

        if (!conversationStarted) {
            chat.innerHTML =
                '<div style="text-align:center;padding:60px 20px;color:#ccc;font-size:13px;">' +
                '鏆傛棤鑱婂ぉ璁板綍<br><span style="font-size:11px;">鎶ュ悕鍚庡嵆鍙笌鎼瓙娌熼€?/span>' +
                '</div>';
        }

        screen.appendChild(chat);
    }

    function refreshMockup() {
        mockupContainer.innerHTML = '';
        mockupContainer.appendChild(renderPhoneScreen());
    }

    // Initial render
    refreshMockup();

    /* =============================================
       Research Finding Bar Animation
       ============================================= */
    var findingBars = document.querySelectorAll('.finding-bar-fill');
    var barsAnimated = false;

    function animateFindingBars() {
        if (barsAnimated) return;
        var researchSection = document.getElementById('research');
        if (!researchSection) return;
        var rect = researchSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            barsAnimated = true;
            findingBars.forEach(function (bar) {
                var fill = bar.style.getPropertyValue('--fill');
                bar.style.width = '0';
                setTimeout(function () {
                    bar.style.width = fill;
                }, 100);
            });
        }
    }

    window.addEventListener('scroll', animateFindingBars, { passive: true });
    animateFindingBars(); // Check on load

    /* =============================================
       Init
       ============================================= */
    updateActiveNav();

})();
