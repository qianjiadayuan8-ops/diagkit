// ═══════════════════════════════════════════
// 詳細カスタム指示テンプレート（会員限定）
// ═══════════════════════════════════════════
const DETAIL_TEMPLATES = {
  AAAA:[
    { badge:'業務効率', color:'var(--accent)', title:'タスク分解テンプレート',
      body:'タスク: [ここに入力]\n\n以下の形式で返してください：\n1. 今すぐやること（5分以内）\n2. 今日中にやること\n3. 誰かに任せられること\n4. やらなくていいこと' },
    { badge:'意思決定', color:'var(--teal)', title:'即断サポートテンプレート',
      body:'判断に迷っていること: [ここに入力]\n\n以下だけ答えてください：\n・おすすめ: A or B\n・理由: 1行\n・リスク: 1行\n余計な説明は不要です。' },
  ],
  BBBB:[
    { badge:'思考整理', color:'var(--accent)', title:'壁打ち深掘りテンプレート',
      body:'テーマ: [ここに入力]\n\n以下の順で一緒に考えてください：\n1. 私の考えに足りていない視点を3つ挙げてください\n2. 最も重要な問いを一つ立ててください\n3. その問いに対して私はどう答えるべきか、一緒に考えてください' },
    { badge:'批判的思考', color:'var(--coral)', title:'反論・検証テンプレート',
      body:'私の主張: [ここに入力]\n\nこの主張に対して：\n1. 最も強い反論を3つ挙げてください\n2. 私が見落としている前提を指摘してください\n3. この主張が崩れる条件を教えてください' },
  ],
  ABBB:[
    { badge:'思考整理', color:'var(--accent)', title:'文脈共有テンプレート',
      body:'今取り組んでいること: [ここに入力]\n背景: [ここに入力]\n\n以下をお願いします：\n1. 私の状況を整理して要約してください\n2. 見落としている観点を指摘してください\n3. 次に考えるべき問いを提示してください' },
  ],
};

const COMMON_TEMPLATES = [
  { badge:'プロンプト改善', color:'var(--teal)', title:'プロンプト最適化テンプレート',
    body:'私が送ろうとしているプロンプト:\n[ここに入力]\n\n以下を教えてください：\n1. このプロンプトで起きる問題点\n2. 改善した版（そのまま使える形で）\n3. さらに良くするための1つの工夫' },
  { badge:'汎用', color:'var(--amber)', title:'思考整理テンプレート',
    body:'整理したいこと: [ここに入力]\n\n以下の構造で整理してください：\n・現状（事実）\n・問題（何が困っているか）\n・原因（なぜそうなっているか）\n・選択肢（取れるアクション）' },
];

function getDetailTemplates(key) {
  return [...(DETAIL_TEMPLATES[key] || []), ...COMMON_TEMPLATES];
}

// ═══════════════════════════════════════════
// Auth 状態管理
// ═══════════════════════════════════════════
let currentUser = null;

window.addEventListener('load', () => {
  const waitFb = setInterval(() => {
    if (!window._fb) return;
    clearInterval(waitFb);
    window._fb.onAuthStateChanged(window._fb.auth, user => {
      currentUser = user;
      renderNav();
    });
  }, 50);
});

function renderNav() {
  const nav = document.getElementById('top-nav');
  if (!nav) return;
  if (currentUser) {
    nav.innerHTML = `
      <span class="nav-user">${currentUser.email || currentUser.displayName || 'ユーザー'}</span>
      <button class="btn-nav" onclick="logout()">ログアウト</button>
    `;
  } else {
    nav.innerHTML = `
      <button class="btn-nav" onclick="openAuthModal('login')">ログイン</button>
      <button class="btn-nav primary" onclick="openAuthModal('register')">無料登録</button>
    `;
  }
}

function openAuthModal(mode) {
  document.getElementById('auth-modal').classList.add('open');
  renderModalInner(mode);
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('open');
}

document.addEventListener('keydown', e => { if(e.key==='Escape') closeAuthModal(); });

function renderModalInner(mode) {
  const isLogin = mode === 'login';
  document.getElementById('modal-inner').innerHTML = `
    <h2 class="modal-title">${isLogin ? 'ログイン' : '無料会員登録'}</h2>
    <p class="modal-sub">${isLogin
      ? '登録済みのアカウントでログインしてください'
      : '登録すると詳細カスタム指示・設定手順を閲覧できます'}</p>
    <div class="form-group">
      <label class="form-label">メールアドレス</label>
      <input class="form-input" type="email" id="auth-email" placeholder="you@example.com" autocomplete="email">
    </div>
    <div class="form-group">
      <label class="form-label">パスワード${isLogin ? '' : '（6文字以上）'}</label>
      <input class="form-input" type="password" id="auth-password" placeholder="••••••••"
        autocomplete="${isLogin ? 'current-password' : 'new-password'}"
        onkeydown="if(event.key==='Enter') submitAuth('${mode}')">
    </div>
    <p class="form-error" id="auth-error"></p>
    <button class="btn-form" id="auth-submit" onclick="submitAuth('${mode}')">
      ${isLogin ? 'ログイン' : '登録する'}
    </button>
    <div class="divider">または</div>
    <button class="btn-google" onclick="loginGoogle()">
      <svg width="16" height="16" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z"/>
      </svg>
      Googleで${isLogin ? 'ログイン' : '登録'}
    </button>
    <p class="modal-switch">
      ${isLogin
        ? 'アカウントをお持ちでない方は <a onclick="renderModalInner(\'register\')">新規登録</a>'
        : 'すでにアカウントをお持ちの方は <a onclick="renderModalInner(\'login\')">ログイン</a>'}
    </p>
  `;
}

async function submitAuth(mode) {
  if (!window._fb) return;
  const { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = window._fb;
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl    = document.getElementById('auth-error');
  const btn      = document.getElementById('auth-submit');
  errEl.classList.remove('show');
  btn.disabled = true;
  btn.textContent = '処理中…';
  try {
    if (mode === 'login') {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
    closeAuthModal();
    if (document.getElementById('screen-result').classList.contains('active')) {
      showMemberDetail();
    }
  } catch(e) {
    errEl.textContent = authErrorMsg(e.code);
    errEl.classList.add('show');
    btn.disabled = false;
    btn.textContent = mode === 'login' ? 'ログイン' : '登録する';
  }
}

async function loginGoogle() {
  if (!window._fb) return;
  const { auth, signInWithPopup, provider } = window._fb;
  try {
    await signInWithPopup(auth, provider);
    closeAuthModal();
    if (document.getElementById('screen-result').classList.contains('active')) {
      showMemberDetail();
    }
  } catch(e) {
    const errEl = document.getElementById('auth-error');
    if (errEl) { errEl.textContent = authErrorMsg(e.code); errEl.classList.add('show'); }
  }
}

async function logout() {
  if (!window._fb) return;
  await window._fb.signOut(window._fb.auth);
  showScreen('screen-top');
}

function authErrorMsg(code) {
  const map = {
    'auth/user-not-found':       'メールアドレスが見つかりません',
    'auth/wrong-password':       'パスワードが正しくありません',
    'auth/invalid-credential':   'メールアドレスまたはパスワードが正しくありません',
    'auth/email-already-in-use': 'このメールアドレスはすでに登録されています',
    'auth/weak-password':        'パスワードは6文字以上にしてください',
    'auth/invalid-email':        'メールアドレスの形式が正しくありません',
    'auth/popup-closed-by-user': 'ポップアップが閉じられました',
  };
  return map[code] || 'エラーが発生しました。もう一度お試しください';
}

// ═══════════════════════════════════════════
// Firestore 保存・取得
// ═══════════════════════════════════════════
async function saveResult(uid, typeKey, typeName) {
  if (!window._fb) return;
  const { db, doc, setDoc } = window._fb;
  const id = Date.now().toString();
  await setDoc(doc(db, 'results', `${uid}_${id}`), {
    uid,
    typeKey,
    typeName,
    createdAt: new Date().toISOString(),
  });
}

async function loadHistory(uid) {
  if (!window._fb) return [];
  const { db, collection, query, where, orderBy, getDocs } = window._fb;
  const q = query(
    collection(db, 'results'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

// ═══════════════════════════════════════════
// 会員向け詳細画面
// ═══════════════════════════════════════════
let _lastTypeKey = null;

async function showMemberDetail() {
  if (!currentUser) { openAuthModal('register'); return; }
  const key  = _lastTypeKey;
  const type = TYPES[key] || TYPES['BBBB'];
  const templates = getDetailTemplates(key);

  const templateCards = templates.map((t, i) => `
    <div class="template-card">
      <span class="template-badge" style="background:${t.color}22;color:${t.color}">${t.badge}</span>
      <div class="template-title">${t.title}</div>
      <div class="template-body" id="tmpl-body-${i}">${t.body}</div>
      <button class="copy-btn" onclick="copyTemplate(${i})">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span id="tmpl-copy-${i}">コピーする</span>
      </button>
    </div>
  `).join('');

  document.getElementById('member-content').innerHTML = `
    <div class="member-hero">
      <p class="member-eyebrow">会員限定 詳細レポート</p>
      <h2 class="member-type-name">${type.name}</h2>
      <p class="member-tagline">${type.tagline.replace(/\n/g,'<br>')}</p>
    </div>

    <div class="member-section">
      <div class="member-section-title">シーン別カスタム指示テンプレート</div>
      <div class="template-grid">${templateCards}</div>
    </div>

    <div class="member-section">
      <div class="member-section-title">ChatGPTへの設定手順</div>
      <div class="setup-steps">
        <div class="setup-step">
          <div class="step-num">1</div>
          <div class="step-body">
            <div class="step-title">ChatGPTを開き、右上のアイコンをクリック</div>
            <div class="step-desc">ログイン済みの状態で、画面右上のアカウントアイコンをクリックします。</div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-num">2</div>
          <div class="step-body">
            <div class="step-title">「設定」→「パーソナライズ」→「カスタム指示」を開く</div>
            <div class="step-desc">メニューから「設定（Settings）」を選び、左サイドバーの「パーソナライズ」をクリック。下部の「カスタム指示」欄を探してください。</div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-num">3</div>
          <div class="step-body">
            <div class="step-title">「ChatGPTへの指示」欄に貼り付ける</div>
            <div class="step-desc">下の欄（「ChatGPTにどのように応答してほしいですか？」）にカスタム指示をコピー&ペーストします。</div>
          </div>
        </div>
        <div class="setup-step">
          <div class="step-num">4</div>
          <div class="step-body">
            <div class="step-title">「保存」して新しいチャットで試す</div>
            <div class="step-desc">保存後は必ず新しいチャットを開いて動作を確認してください。既存の会話には反映されません。</div>
          </div>
        </div>
      </div>
    </div>

    <div class="member-section">
      <div class="member-section-title">過去の診断履歴</div>
      <div id="history-list"><p style="font-size:13px;color:var(--text3)">読み込み中…</p></div>
    </div>

    <div style="text-align:center;margin-top:8px;">
      <button class="btn-retry" onclick="startQuiz()">もう一度診断する</button>
    </div>
  `;

  showScreen('screen-member');

  // 履歴を非同期ロード
  try {
    const history = await loadHistory(currentUser.uid);
    const histEl = document.getElementById('history-list');
    if (!histEl) return;
    if (!history.length) {
      histEl.innerHTML = '<p style="font-size:13px;color:var(--text3)">診断履歴はまだありません</p>';
    } else {
      histEl.innerHTML = `<div class="history-list">${history.map(h => `
        <div class="history-item">
          <div class="history-type">${h.typeName}</div>
          <div class="history-key">${h.typeKey}</div>
          <div class="history-date">${h.createdAt ? h.createdAt.slice(0,10) : ''}</div>
        </div>`).join('')}</div>`;
    }
  } catch(e) {
    const histEl = document.getElementById('history-list');
    if (histEl) histEl.innerHTML = '<p style="font-size:13px;color:var(--text3)">履歴の読み込みに失敗しました</p>';
  }
}

function copyTemplate(i) {
  const text = document.getElementById(`tmpl-body-${i}`).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const label = document.getElementById(`tmpl-copy-${i}`);
    label.textContent = 'コピーしました！';
    setTimeout(() => { label.textContent = 'コピーする'; }, 2000);
  });
}

const QUESTIONS = [
  { axis:1, axisName:'出力への期待', q:'仕事でわからないことが出てきました。まず何をしますか？',
    a:'「答えを教えて」と検索やAIにすぐ聞く', b:'「なぜそうなる？」と背景から自分で調べ始める' },
  { axis:1, axisName:'出力への期待', q:'ChatGPTに企画のアドバイスを求めるとき、理想の返答は？',
    a:'「結論：〇〇がおすすめ」と断言してほしい', b:'「視点A・B・Cがある」と選択肢を広げてほしい' },
  { axis:1, axisName:'出力への期待', q:'友人に悩み相談するとき、何を求めていますか？',
    a:'「どうすればいいか」具体的なアドバイスがほしい', b:'「なぜそう感じるのか」一緒に整理したい' },
  { axis:1, axisName:'出力への期待', q:'AIが長文で丁寧に解説してくれました。あなたの反応は？',
    a:'「長い、要点だけ教えて」と感じる', b:'「なるほど、こういう背景があったのか」と満足する' },
  { axis:1, axisName:'出力への期待', q:'本を選ぶとき、どちらのレビューが刺さりますか？',
    a:'「この本を読むと〇〇が解決する」', b:'「この本は視野を広げてくれる、気づきが多い」' },

  { axis:2, axisName:'対話スタイル', q:'ChatGPTに頼み事をするとき、プロンプトはどう書きますか？',
    a:'「〇〇してください」とシンプルに1回で送る', b:'背景・条件・例を書いて、返答を見てから追加する' },
  { axis:2, axisName:'対話スタイル', q:'AIの返答がイマイチだったとき、どうしますか？',
    a:'別の聞き方で新しく送り直す', b:'「ここが違う、こういう意図だった」と同じ会話で修正する' },
  { axis:2, axisName:'対話スタイル', q:'料理のレシピを調べるとき、どちらが好みですか？',
    a:'材料と手順がパッとわかるレシピサイト', b:'「なぜこの火加減？」「代替は？」と聞き返せる対話' },
  { axis:2, axisName:'対話スタイル', q:'仕事で上司に報告するとき、スタイルはどちらに近い？',
    a:'「結論：〇〇です。以上」簡潔に終わらせたい', b:'「どう思いますか？」と意見をもらいながら進めたい' },
  { axis:2, axisName:'対話スタイル', q:'新しいツールを使い始めるとき、どうしますか？',
    a:'とりあえず触ってみて、困ったら調べる', b:'使い方を一通り確認してから、疑問を整理して質問する' },

  { axis:3, axisName:'回答への姿勢', q:'自分のアイデアをAIに見せたとき、どんな返しが嬉しい？',
    a:'「この点は弱い、なぜなら…」と鋭く突っ込んでほしい', b:'「いいですね！次のステップは…」と前に進めてほしい' },
  { axis:3, axisName:'回答への姿勢', q:'誰かに「それ違うと思う」と言われたとき、最初に感じるのは？',
    a:'「なぜ？理由を聞かせて」と興味が湧く', b:'「じゃあどうすれば？」と次の手が知りたくなる' },
  { axis:3, axisName:'回答への姿勢', q:'AIが「それは難しいです」と答えたとき、どう感じますか？',
    a:'「なぜ難しい？本当に無理？」と疑う', b:'「じゃあ似たことで何ができる？」と代替を探す' },
  { axis:3, axisName:'回答への姿勢', q:'プレゼン前に誰かにチェックしてもらうなら、何を頼む？',
    a:'「突っ込みどころや矛盾を教えて」', b:'「もっとよくなるポイントを教えて」' },
  { axis:3, axisName:'回答への姿勢', q:'仕事の判断に迷ったとき、AIにどう聞きますか？',
    a:'「この選択肢のリスクと問題点を教えて」', b:'「どちらがおすすめか、理由も教えて」' },

  { axis:4, axisName:'主体性', q:'メールの返信をAIに頼むとしたら、どう頼む？',
    a:'「この内容でメールを書いて」完成品がほしい', b:'「こういう意図なんだけどどう書く？」一緒に考えたい' },
  { axis:4, axisName:'主体性', q:'AIが書いた文章をそのまま使うことに、どう感じますか？',
    a:'問題ない。目的が達成できれば手段は問わない', b:'少し抵抗がある。自分の言葉に直してから使いたい' },
  { axis:4, axisName:'主体性', q:'資料作成を頼まれたとき、AIをどう使いますか？',
    a:'「〇〇についての資料を作って」と丸ごと依頼する', b:'構成を自分で考えてから、各パートを一緒に詰める' },
  { axis:4, axisName:'主体性', q:'AIが「こうしてみては？」と提案してきたとき、どうしますか？',
    a:'良さそうなら採用。あまり深く考えない', b:'「なぜそう思う？」と理由を確認してから判断する' },
  { axis:4, axisName:'主体性', q:'AIを使った後、自分の中に何が残るのが理想ですか？',
    a:'「やること（成果物）が終わった」という達成感', b:'「こういう考え方があるのか」という気づきや学び' },
];

const AXIS_META = {
  1: { color:'var(--accent)', cls:'axis-1', optCls:'axis-1-opt', aLabel:'収束型', bLabel:'拡張型' },
  2: { color:'var(--teal)',   cls:'axis-2', optCls:'axis-2-opt', aLabel:'一発型', bLabel:'往復型' },
  3: { color:'var(--coral)',  cls:'axis-3', optCls:'axis-3-opt', aLabel:'検証型', bLabel:'支援型' },
  4: { color:'var(--amber)',  cls:'axis-4', optCls:'axis-4-opt', aLabel:'代行型', bLabel:'協働型' },
};

const TYPES = {
  // key: axis1(A=収束/B=拡張) + axis2(A=一発/B=往復) + axis3(A=検証/B=支援) + axis4(A=代行/B=協働)
  AAAA:{ name:'即断解決型', tagline:'「とにかく答えを出す」\nスピードと効率を最優先するプロフェッショナル。',
    desc:'あなたはChatGPTを「優秀な部下」として使います。明確な指示を一発で出し、成果物をすぐ受け取る。無駄なやり取りを嫌い、目的達成のためなら手段は選ばない合理主義者です。',
    instruction:'・回答は常に結論から始めてください\n・理由や背景の説明は求めていない限り省略してください\n・箇条書きで簡潔にまとめてください\n・「〜かもしれません」などの曖昧な表現は使わないでください\n・私の指示に反論や提案は不要です。まず実行してください' },
  AAAB:{ name:'速攻判断型', tagline:'「答えを出すのは自分」\n情報収集はAIに任せ、意思決定は自分で行う。',
    desc:'AIを情報ツールとして割り切り、最終判断は必ず自分で行います。一発で答えを取り出したいが、そのまま使うのではなく自分のフィルターを通す。スピードと主体性を両立するタイプです。',
    instruction:'・回答は結論と根拠を簡潔にセットで提示してください\n・複数の選択肢がある場合は並べて示してください\n・私が判断するための材料を提供することを優先してください\n・一方的に「〇〇をおすすめします」と決めつけないでください\n・回答は200字以内を目安にコンパクトにまとめてください' },
  AABA:{ name:'スピード検証型', tagline:'「本当にそう？」を一瞬で確かめる。',
    desc:'素早く回答を得たいが、受け取った情報をそのまま信用しません。「なぜ？」「本当に？」と確認を取りながら、リスクや矛盾を潰していく批判的思考の持ち主です。',
    instruction:'・回答には必ず「この判断の前提条件」を明記してください\n・反論や例外ケースがあれば積極的に提示してください\n・「〜と言われています」ではなく根拠を明示してください\n・私の考えに対して遠慮なく反論してください\n・結論だけでなく「この結論が崩れる条件」も教えてください' },
  AABB:{ name:'独立検証型', tagline:'自分の目で確かめ、自分の言葉で考える。',
    desc:'答えはすぐ欲しいが、そのまま使わない。受け取った情報を自分の言葉で咀嚼し、批判的に検証してから行動します。AIとの関係は「情報源」であり「壁打ち相手」ではないタイプです。',
    instruction:'・回答は簡潔に、要点のみ提示してください\n・私が問い返したときは、前提条件や根拠から丁寧に説明してください\n・私の質問に対して逆質問はしないでください\n・情報の信頼度や不確かさを明示してください\n・私が「なぜ？」と聞いたら、その場合のみ詳しく展開してください' },
  ABAA:{ name:'精密依頼型', tagline:'プロンプトを磨き、完成品を受け取る。',
    desc:'一発で決めたいから、プロンプトに全力を注ぎます。背景・条件・例を丁寧に書き込んで、返ってきた答えをそのまま使える状態にする。準備に時間をかけるほど、出力の質にこだわるタイプです。',
    instruction:'・私が長い指示を送ったときは、必ず最初に「理解した内容の要約」を返してください\n・条件が複数ある場合はすべて守ってください\n・出力はそのまま使える形式で返してください\n・不明な点があれば実行前に一度だけ確認してください\n・私が意図を説明した場合は、それを最優先してください' },
  ABAB:{ name:'品質重視型', tagline:'「いいものを作る」ために時間を使う。',
    desc:'丁寧に指示を出し、返ってきたものを自分の視点で磨き上げます。AIは叩き台を作るパートナー。完成品を渡してもらうより、一緒にいいものを作るプロセスに価値を感じます。',
    instruction:'・返答には必ず「なぜそうしたか」の意図を簡潔に添えてください\n・改善案を出す際は複数のバリエーションを示してください\n・私がフィードバックしたら、それを反映して再提案してください\n・一度で完璧にしようとせず、往復でブラッシュアップしましょう\n・私の表現スタイルを学習して、それに近づけてください' },
  ABBA:{ name:'深掘り精査型', tagline:'時間をかけても、本質にたどり着く。',
    desc:'丁寧に指示を出し、返答を徹底的に検証します。表面的な答えに満足せず、矛盾や抜け穴を見つけて掘り下げる。AIとの往復を通じて、より深い理解を得ようとするタイプです。',
    instruction:'・私が送る指示には必ず背景が含まれています。それを踏まえて回答してください\n・私が「なぜ？」「本当に？」と聞いたら、丁寧に根拠から説明してください\n・私の前提や仮定に誤りがあれば指摘してください\n・反論や別の視点を積極的に出してください\n・会話全体の文脈を常に意識してください' },
  ABBB:{ name:'共同探究型', tagline:'AIと一緒に、答えを育てていく。',
    desc:'丁寧に文脈を共有しながら、AIと対話を重ねて思考を深めます。答えより「考えるプロセス」に価値を感じる。自分とAIが協力して何かを作り上げることを理想とするタイプです。',
    instruction:'・私との対話を記録し、前の発言を踏まえて回答してください\n・私が気づいていない視点や論点があれば積極的に提案してください\n・反論や深掘りを遠慮なく行ってください\n・私が考えをまとめるのを助けてください。答えを出すより整理を優先して\n・私の思考の「抜け」や「矛盾」を指摘してください' },
  BAAA:{ name:'視野優先型', tagline:'広く見て、素早く動く。',
    desc:'多角的な視点を得たいが、行動は迅速。AIから幅広いアイデアをもらい、自分でさっと取捨選択して実行に移します。発散は任せて、収束は自分でやるタイプです。',
    instruction:'・回答では複数の視点・アイデア・選択肢を並べてください\n・それぞれのメリット・デメリットをコンパクトに添えてください\n・私が「どれがいい？」と聞いたときだけ、おすすめを一つ挙げてください\n・長文より、箇条書きで広く提示するスタイルにしてください\n・私が「詳しく」と言ったときだけ掘り下げてください' },
  BAAB:{ name:'広角思考型', tagline:'知識はAIから、決断は自分から。',
    desc:'広い視野で情報を集め、自分の考えと照合して判断します。AIを「図書館」として使いながら、アウトプットは自分の言葉で出すことにこだわる。独立した思考を大切にするタイプです。',
    instruction:'・多様な観点や事例を広く提示してください\n・「私はこう思う」という私の発言には同意せず、別の見方を提示してください\n・情報は整理して提示し、結論は私に委ねてください\n・私が自分の考えを言語化するのを助けてください\n・「唯一の正解」を押しつけないでください' },
  BABA:{ name:'批判的探索型', tagline:'「それは本当か？」を広い視野で問い続ける。',
    desc:'様々な視点を得ながら、どれも鵜呑みにしません。批判的思考と好奇心を同時に持ち、AIとの往復で本質を掘り起こしていく。知的に誠実であることを大切にするタイプです。',
    instruction:'・私の質問や前提に対して、反論や例外から入ってください\n・複数の視点を提示し、それぞれの弱点も教えてください\n・「一般的に言われること」と「実態」が違う場合は明示してください\n・私が反論したら、それを検討した上で返してください\n・「正解はない」問題には、そう伝えてください' },
  BABB:{ name:'視野拡張型', tagline:'見えていなかった景色を、一緒に見に行く。',
    desc:'AIとの対話を通じて視野を広げ、自分でその知識を咀嚼します。新しい視点をもらいながら、それを自分のものにして進む。学びのプロセス自体を楽しめるタイプです。',
    instruction:'・私が知らない視点や概念を積極的に提示してください\n・私の考えを否定せず、「別の見方もある」という形で広げてください\n・私が「なるほど」と感じたポイントを深掘りできるよう促してください\n・学びにつながる問いかけを返してください\n・私が理解できているか確認する質問を時々してください' },
  BBAA:{ name:'対話実行型', tagline:'話しながら整理して、AIに任せる。',
    desc:'対話を重ねながら考えを整理し、まとまったら実行をAIに委ねます。「一緒に考える → 任せる」という流れが自然なタイプ。プロセスは共有しつつ、成果物は効率よく得たい。',
    instruction:'・私が話しながら考えを整理しているときは、まず受け止めてください\n・整理が終わった段階で「では〇〇しますね」と実行に移ってください\n・私の意図が不明なときは一つだけ確認してください\n・完成品をそのまま使えるクオリティで返してください\n・私が「これでいいかな？」と聞いたら、判断材料を提示してください' },
  BBAB:{ name:'協議創出型', tagline:'「どうしよう」から「こうしよう」へ、一緒に辿り着く。',
    desc:'対話しながらアイデアを練り、自分でアウトプットを作り上げます。AIは「相談相手」であり「代筆者」ではない。自分の言葉で表現することにこだわりながら、思考を対話で深めるタイプです。',
    instruction:'・私の話を聞いて、整理の手助けをしてください\n・答えを出すより「一緒に考える」姿勢でいてください\n・私が「こうしようと思う」と言ったら、それを発展させる提案をしてください\n・私の言葉のクセや表現スタイルを大切にしてください\n・「あなたならどう思いますか？」と私が聞いたときだけ意見を言ってください' },
  BBBA:{ name:'哲学探求型', tagline:'問いを深め、本質に迫る。',
    desc:'対話を通じて思考を深め、本質的な問いを追い続けます。表面的な答えより、なぜそうなのかという根拠と構造を知りたい。AIとの議論を知的探究として楽しむタイプです。',
    instruction:'・私の問いに対して、まず「その問いの前提」を確認してください\n・表面的な答えより、背景にある構造や原理を説明してください\n・「なぜ？」の連鎖に付き合ってください\n・私の考えに対して遠慮なく反論してください\n・「わからない」「議論が分かれる」問題にはそう正直に伝えてください' },
  BBBB:{ name:'共創探索型', tagline:'AIと共に考え、共に学び、共に作る。',
    desc:'これがあなた自身のタイプでもあります。対話を重ねながら視野を広げ、批判的に検証し、自分の言葉でアウトプットを作る。ChatGPTを最も深く活用できるタイプです。',
    instruction:'・私との対話の流れを常に意識し、文脈を踏まえて回答してください\n・私が見落としている視点や仮定があれば指摘してください\n・私の考えに同意するより、「別の見方」を提示することを優先してください\n・私が自分の考えを深めるための問いかけを返してください\n・回答が長くなる場合は、最初に「何を伝えるか」の構造を示してください' },
};

let currentQ = 0;
let answers = []; // 'A' or 'B'
let selectedOpt = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function startQuiz() {
  currentQ = 0;
  answers = [];
  showScreen('screen-quiz');
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const m = AXIS_META[q.axis];
  selectedOpt = null;

  const pct = Math.round((currentQ / QUESTIONS.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-count').textContent = (currentQ + 1) + ' / ' + QUESTIONS.length;

  const card = document.getElementById('q-card');
  card.classList.remove('fade-up');
  void card.offsetWidth;
  card.classList.add('fade-up');

  card.innerHTML = `
    <div class="q-axis-badge ${m.cls}">
      <span class="q-axis-dot"></span>
      軸${q.axis}　${q.axisName}
    </div>
    <p class="q-text">${q.q}</p>
    <div class="q-options">
      <button class="q-opt-btn ${m.optCls}" id="opt-a" onclick="selectOpt('A')">
        <div class="q-opt-tag" style="color:${m.color}">${m.aLabel}</div>
        <div class="q-opt-text">${q.a}</div>
      </button>
      <button class="q-opt-btn ${m.optCls}" id="opt-b" onclick="selectOpt('B')">
        <div class="q-opt-tag" style="color:${m.color}">${m.bLabel}</div>
        <div class="q-opt-text">${q.b}</div>
      </button>
    </div>
    <div class="q-nav">
      <button class="btn-ghost" onclick="prevQ()" ${currentQ === 0 ? 'disabled' : ''}>← 戻る</button>
      <button class="btn-next" id="btn-next" onclick="nextQ()">
        ${currentQ === QUESTIONS.length - 1 ? '結果を見る →' : '次へ →'}
      </button>
    </div>
  `;
}

function selectOpt(opt) {
  selectedOpt = opt;
  document.getElementById('opt-a').classList.toggle('selected', opt === 'A');
  document.getElementById('opt-b').classList.toggle('selected', opt === 'B');
  const btn = document.getElementById('btn-next');
  btn.classList.add('enabled');
}

function nextQ() {
  if (!selectedOpt) return;
  answers[currentQ] = selectedOpt;
  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    renderQuestion();
    // restore previous answer if exists
    if (answers[currentQ]) {
      selectedOpt = answers[currentQ];
      setTimeout(() => {
        document.getElementById('opt-a').classList.toggle('selected', selectedOpt === 'A');
        document.getElementById('opt-b').classList.toggle('selected', selectedOpt === 'B');
        document.getElementById('btn-next').classList.add('enabled');
      }, 50);
    }
  } else {
    showResult();
  }
}

function prevQ() {
  if (currentQ > 0) {
    if (selectedOpt) answers[currentQ] = selectedOpt;
    currentQ--;
    renderQuestion();
    if (answers[currentQ]) {
      selectedOpt = answers[currentQ];
      setTimeout(() => {
        if (document.getElementById('opt-a')) {
          document.getElementById('opt-a').classList.toggle('selected', selectedOpt === 'A');
          document.getElementById('opt-b').classList.toggle('selected', selectedOpt === 'B');
          document.getElementById('btn-next').classList.add('enabled');
        }
      }, 50);
    }
  }
}

function calcType() {
  const scores = { 1:{A:0,B:0}, 2:{A:0,B:0}, 3:{A:0,B:0}, 4:{A:0,B:0} };
  QUESTIONS.forEach((q, i) => {
    if (answers[i]) scores[q.axis][answers[i]]++;
  });
  const key =
    (scores[1].A >= scores[1].B ? 'A' : 'B') +
    (scores[2].A >= scores[2].B ? 'A' : 'B') +
    (scores[3].A >= scores[3].B ? 'A' : 'B') +
    (scores[4].A >= scores[4].B ? 'A' : 'B');
  return { key, scores };
}

function showResult() {
  const { key, scores } = calcType();
  const type = TYPES[key] || TYPES['BBBB'];
  const m = AXIS_META;

  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('progress-count').textContent = '完了';

  const axisRows = [1,2,3,4].map(ax => {
    const total = scores[ax].A + scores[ax].B;
    const bPct = Math.round((scores[ax].B / total) * 100);
    const aLabel = m[ax].aLabel;
    const bLabel = m[ax].bLabel;
    const dominant = scores[ax].A >= scores[ax].B ? aLabel : bLabel;
    const colors = ['var(--accent)','var(--teal)','var(--coral)','var(--amber)'];
    const iconBgs = ['var(--accent-bg)','var(--teal-bg)','var(--coral-bg)','var(--amber-bg)'];
    return `
      <div class="result-axis-row">
        <div class="result-axis-icon" style="background:${iconBgs[ax-1]};color:${colors[ax-1]}">${ax}</div>
        <div class="result-axis-info">
          <div class="result-axis-label">軸${ax}　${['出力への期待','対話スタイル','回答への姿勢','主体性'][ax-1]}</div>
          <div class="result-axis-value">${dominant}</div>
        </div>
        <div class="result-axis-bar-wrap">
          <div class="result-axis-bar" style="width:${bPct}%;background:${colors[ax-1]}"></div>
        </div>
      </div>`;
  }).join('');

  // typeKeyを保存・Firestoreに結果保存
  _lastTypeKey = key;
  if (currentUser) {
    saveResult(currentUser.uid, key, type.name).catch(() => {});
  }

  const ctaHtml = currentUser
    ? `<button class="btn-primary" onclick="showMemberDetail()">
        詳細レポートを見る
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
       </button>
       <p class="result-cta-note">シーン別テンプレート・設定手順を確認できます</p>`
    : `<button class="btn-primary" onclick="openAuthModal('register')">
        無料会員登録して詳細を見る
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
       </button>
       <p class="result-cta-note">登録するとシーン別カスタム指示テンプレート・ChatGPT設定手順・診断履歴が利用できます</p>`;

  document.getElementById('result-content').innerHTML = `
    <p class="result-eyebrow">あなたのタイプ</p>
    <h2 class="result-type">${type.name}</h2>
    <p class="result-tagline">${type.tagline.replace(/\n/g,'<br>')}</p>

    <div class="result-axes">${axisRows}</div>

    <div class="result-section">
      <div class="result-section-title">タイプの特徴</div>
      <div class="result-section-body">${type.desc}</div>
    </div>

    <div class="result-section">
      <div class="result-section-title">カスタム指示（無料版）</div>
      <div class="result-section-body">ChatGPTのパーソナライズ設定にそのまま貼り付けられます。</div>
      <div class="custom-instruction-box" id="instruction-box">${type.instruction}</div>
      <button class="copy-btn" onclick="copyInstruction()">
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span id="copy-label">コピーする</span>
      </button>
    </div>

    <div class="result-cta">
      ${ctaHtml}
      <div class="share-row">
        <button class="btn-share twitter" onclick="shareTwitter()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Xでシェア
        </button>
        <button class="btn-share native" id="btn-native-share" onclick="shareNative()">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          シェア / コピー
        </button>
      </div>
      <p class="share-label">診断結果を友達に教える</p>
      <br>
      <button class="btn-retry" onclick="startQuiz()">もう一度診断する</button>
    </div>
  `;

  showScreen('screen-result');
}

function copyInstruction() {
  const text = document.getElementById('instruction-box').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const label = document.getElementById('copy-label');
    label.textContent = 'コピーしました！';
    setTimeout(() => { label.textContent = 'コピーする'; }, 2000);
  });
}

// ═══════════════════════════════════════════
// シェア機能
// ═══════════════════════════════════════════
function shareTwitter() {
  const type = TYPES[_lastTypeKey] || TYPES['BBBB'];
  const text = `私のChatGPT活用タイプは「${type.name}」でした！\n${type.tagline.split('\n')[0]}\n\n#ChatGPT活用診断 #AI活用`;
  // 本番ではURLにページURLを入れる。現状はテキストのみ
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=450,noopener,noreferrer');
}

async function shareNative() {
  const type = TYPES[_lastTypeKey] || TYPES['BBBB'];
  const shareData = {
    title: 'ChatGPT活用タイプ診断',
    text: `私のChatGPT活用タイプは「${type.name}」でした！\n${type.tagline.split('\n')[0]}\nあなたも診断してみて👇`,
    // 本番デプロイ後は実際のURLに変更する
    url: location.href,
  };

  // Web Share API が使えるか確認（主にスマホ）
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch(e) {
      // キャンセルは無視
      if (e.name !== 'AbortError') console.error(e);
    }
  } else {
    // PCなど未対応環境はURLをクリップボードにコピー
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      const btn = document.getElementById('btn-native-share');
      if (btn) {
        const orig = btn.innerHTML;
        btn.textContent = 'コピーしました！';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    } catch(e) {
      alert('お使いの環境ではシェア機能が利用できません');
    }
  }
}
