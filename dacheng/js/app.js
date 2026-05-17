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
            verdictIcon.textContent = '🎯';
            verdictText.textContent = '匹配质量：优秀推荐';
        } else if (totalScore >= 55) {
            verdictIcon.textContent = '👍';
            verdictText.textContent = '匹配质量：良好推荐';
        } else if (totalScore >= 35) {
            verdictIcon.textContent = '🤔';
            verdictText.textContent = '匹配质量：一般，可尝试';
        } else {
            verdictIcon.textContent = '👎';
            verdictText.textContent = '匹配质量：不建议推荐';
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
                showToast('权重已恢复为 V1.1 默认值', 'success');
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
        { id: 1, icon: '🍲', title: '周四晚 4 人火锅', category: '拼餐', location: '东城区', time: '21:00', distance: '3.2km', subtitle: '轻社交火锅，欢迎学生党', budget: '80-120 元', vibe: '轻松聊天' },
        { id: 2, icon: '🏃', title: '周五晚 5km 夜跑', category: '运动', location: '西城区', time: '19:30', distance: '1.8km', subtitle: '慢跑节奏，热爱运动的你', intensity: '中度', exp: '新手友好' },
        { id: 3, icon: '🎬', title: '周六下午 电影约看', category: '观影', location: '朝阳区', time: '16:00', distance: '2.1km', subtitle: '新片团聊，看完一起评价', price: '50-80 元', genre: '喜剧/剧情' },
        { id: 4, icon: '☕', title: '周五晚 咖啡探店', category: '探店', location: '海淀区', time: '20:00', distance: '4.0km', subtitle: '小众环境，适合轻松聊天', budget: '60-100 元', type: '咖啡厅' }
    ];

    var categories = ['拼餐', '运动', '观影', '探店', '学习', '游戏'];
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
        statusBar.innerHTML = '<span>9:41</span><span>📶 🔋</span>';
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
            { tab: 'home', icon: '🏠', label: '首页' },
            { tab: 'chat', icon: '💬', label: '消息' },
            { tab: 'profile', icon: '👤', label: '我的' }
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
                        showToast('💬 即时通讯功能演示', 'success');
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
        header.innerHTML = '<h3>🏠 搭子成行</h3><span class="phone-header-icon">🔍</span>';
        screen.appendChild(header);

        // Welcome banner
        if (!selectedMockupCategory) {
            var banner = document.createElement('div');
            banner.style.cssText = 'padding:6px 18px 2px;font-size:12px;color:#999;';
            banner.textContent = '👋 点击下方分类开始探索';
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
                    showToast('已筛选：' + selectedMockupCategory, 'success');
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
            empty.textContent = '该分类暂无匹配';
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
        header.innerHTML = '<span class="phone-header-icon" style="cursor:pointer;">← 返回</span><span style="font-size:12px;color:#999;">详情</span><span></span>';
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
            '<p class="phone-detail-desc">地点：' + post.location + ' | 时间：' + post.time + ' | 2/4 人</p>';

        // Info rows
        var infoGrid = document.createElement('div');
        infoGrid.className = 'phone-info-row';

        var infoItems = [];
        if (post.category === '拼餐') {
            infoItems = [
                '<strong>预算</strong><span>' + post.budget + '</span>',
                '<strong>氛围</strong><span>' + post.vibe + '</span>'
            ];
        } else if (post.category === '运动') {
            infoItems = [
                '<strong>强度</strong><span>' + post.intensity + '</span>',
                '<strong>经验</strong><span>' + post.exp + '</span>'
            ];
        } else if (post.category === '观影') {
            infoItems = [
                '<strong>票价</strong><span>' + post.price + '</span>',
                '<strong>类型</strong><span>' + post.genre + '</span>'
            ];
        } else {
            infoItems = [
                '<strong>预算</strong><span>' + (post.budget || '50-100元') + '</span>',
                '<strong>类型</strong><span>' + (post.type || '探店') + '</span>'
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
        note.textContent = post.subtitle + '。期待兴趣相投的你加入！';
        detail.appendChild(note);

        // Action buttons
        var actionRow = document.createElement('div');
        actionRow.className = 'phone-action-row';

        var joinBtn = document.createElement('button');
        joinBtn.className = 'phone-btn phone-btn-primary';
        joinBtn.textContent = appliedPostId === post.id ? '已申请 ✓' : '我要参加';

        joinBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (appliedPostId === post.id) return;
            appliedPostId = post.id;
            joinBtn.textContent = '已申请 ✓';
            joinBtn.disabled = true;
            joinBtn.style.opacity = '0.7';
            showToast('报名成功！等待对方确认', 'success');

            // Auto-navigate to chat after short delay to complete the demo flow
            setTimeout(function () {
                conversationStarted = true;
            }, 800);
        });

        var chatBtn = document.createElement('button');
        chatBtn.className = 'phone-btn phone-btn-outline';
        chatBtn.textContent = '私聊TA';

        chatBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!appliedPostId || appliedPostId !== post.id) {
                showToast('请先报名再私聊', 'warning');
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
        header.innerHTML = '<span class="phone-header-icon" style="cursor:pointer;">← 返回</span><h3 style="font-size:15px;">小萌</h3><span class="phone-header-icon">📞</span>';
        header.querySelector('.phone-header-icon').addEventListener('click', function (e) {
            e.stopPropagation();
            currentScreen = 'home';
            refreshMockup();
        });
        screen.appendChild(header);

        var chat = document.createElement('div');
        chat.className = 'phone-chat';

        chat.innerHTML =
            '<div class="phone-chat-time">今天 18:24</div>' +
            '<div class="phone-chat-bubble theirs">你好！看到你的火锅邀约，我也想加入~ 🍲</div>' +
            '<div class="phone-chat-bubble mine">欢迎！我们周四晚 9 点在国贸碰面，目前已经有 2 个人了</div>' +
            '<div class="phone-chat-bubble theirs">太好了！有什么忌口吗？我比较能吃辣 🌶️</div>' +
            '<div class="phone-chat-bubble mine">没问题！我也是无辣不欢。到时候见！</div>' +
            '<div class="phone-chat-time">对方已确认参加</div>';

        if (!conversationStarted) {
            chat.innerHTML =
                '<div style="text-align:center;padding:60px 20px;color:#ccc;font-size:13px;">' +
                '暂无聊天记录<br><span style="font-size:11px;">报名后即可与搭子沟通</span>' +
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
