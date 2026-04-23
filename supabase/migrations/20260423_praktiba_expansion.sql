-- Pratība expansion: port legacy forum-view curriculums + expand catalog.
-- Idempotent via ON CONFLICT (id) DO UPDATE. Run in Supabase SQL editor.

INSERT INTO task_catalog (id, pillar, tier, title_lv, description_lv, xp_amount, proof_type, proof_hint_lv, auto_approve, position) VALUES

-- ========================================================================
-- AI — 8 tasks
-- ========================================================================
  ('ai_t1_chatgpt_account', 'ai', 1,
   'Izveido AI rīka kontu (ChatGPT vai Claude)',
   'Reģistrējies ChatGPT.com vai Claude.ai. Uzsāc pirmo sarunu un saglabā linku vai screenshot, kur redzams konts ar vismaz 1 sarunu.',
   100, 'url', 'Ielīmē saiti uz savu pirmo sarunu vai imgur screenshot.', true, 10),

  ('ai_t1_prompt_basics', 'ai', 1,
   'Prompting pamati — uzraksti 5 dažādus promptus',
   'Uzraksti 5 atšķirīgus promptus vienam mērķim (piemēram: biznesa idejas AI jomā). Salīdzini atbildes un atzīmē, kurš prompts strādā labāk un kāpēc. Publicē salīdzinājumu Google Doc vai Notion.',
   100, 'url', 'Ielīmē saiti uz publisko Google Doc/Notion lapu ar 5 promptiem un rezultātiem.', true, 20),

  ('ai_t2_text_to_image', 'ai', 2,
   'Text-to-Image — ģenerē kvalitatīvu attēlu un publicē',
   'Izmanto Midjourney / DALL·E / Stable Diffusion / Nano Banana, lai izveidotu vismaz 3 attēlus ap vienu vizuālo koncepciju. Publicē rezultātus AI forumā ar izmantoto promptu un iterāciju piezīmēm.',
   500, 'url', 'Ielīmē saiti uz savu forum postu platforma.100x.lv.', false, 30),

  ('ai_t2_prompt_post', 'ai', 2,
   'Publicē strukturētu promptu AI forumā',
   'Uzraksti strukturētu promptu (role + context + constraints + example) konkrētam darba uzdevumam. Publicē AI forumā ar piemēru rezultātu — kā prompts palīdzēja atrisināt reālu problēmu.',
   500, 'url', 'Ielīmē saiti uz forum postu vietnē platforma.100x.lv.', false, 40),

  ('ai_t2_content_creation', 'ai', 2,
   'Satura radīšana ar AI — publicē apskatu',
   'Izmanto AI (ChatGPT, Claude, vai citu) lai radītu vienu saturu: blog posts, LinkedIn raksts, video scripts, vai e-pasta sērija. Publicē rezultātu + apraksti, kurus promptus izmantoji un ko AI palīdzēja vs. cik tev pašam bija jārediģē.',
   500, 'url', 'Ielīmē saiti uz publicēto saturu (LinkedIn, blog, YouTube, utt.).', false, 50),

  ('ai_t3_automation', 'ai', 3,
   'Automatizē vienu ikdienas uzdevumu ar AI',
   'Izvēlies vienu ikdienas uzdevumu (e-pastu atbildes, sociālo mediju plāns, datu kopošana) un automatizē to ar n8n, Zapier, Make vai pašrakstītu skriptu, kas izmanto AI API. Demo video un koda/workflow pamācība obligāta.',
   1500, 'admin_review', 'Ielīmē saiti uz Loom/YouTube demo + pamācību vai repo.', false, 60),

  ('ai_t3_ship_ai_tool', 'ai', 3,
   'Uzbūvē un publicē savu AI rīku vai aģentu',
   'Uzbūvē nelielu AI rīku (web app, chat interface, MCP serveri vai aģentu) un publicē koda repo GitHub ar README. Rīkam jādara kaut kas noderīgs — ne tikai "hello world".',
   1500, 'admin_review', 'Ielīmē GitHub repo URL ar darbīgu README un dzīvu demo saiti.', false, 70),

  ('ai_t3_ai_income', 'ai', 3,
   'AI kā ienākumu rīks — nopelni pirmos €100',
   'Izmanto AI kā monetizējamu prasmi: freelance uzdevumi, saviem klientiem, vai pārdots produkts. Nopelni vismaz €100 30 dienu laikā un dalies case-study (bez klientu datiem) komūnai.',
   1500, 'admin_review', 'Ielīmē saiti uz forum postu / case-study ar izskaidrotu pieeju un rezultātu (apslēptiem klientu datiem).', false, 80),

-- ========================================================================
-- DeFi — 8 tasks
-- ========================================================================
  ('defi_t1_wallet_setup', 'defi', 1,
   'Uzstādi savu pirmo Web3 maciņu',
   'Instalē MetaMask, Rabby vai citu self-custody maciņu. Saglabā seed frāzi OFFLINE (nekad browseris, nekad cloud). Pierādījumam iesniedz savu EVM publisko adresi — tā nav slepena.',
   100, 'url', 'Ielīmē savu EVM adresi (0x…40 hex simboli).', true, 10),

  ('defi_t1_testnet_tokens', 'defi', 1,
   'Saņem testnet tokenus un nosūti sev atpakaļ',
   'No faucet (Sepolia, Base Sepolia vai cits) saņem testnet ETH. Veic pirmo on-chain darījumu — nosūti sev pašam. Testnet nav riskants un der kā treniņš.',
   100, 'tx_hash', 'Ielīmē tx hash no testnet explorer (0x + 64 hex).', true, 20),

  ('defi_t2_first_swap', 'defi', 2,
   'Veic pirmo swap DEX-ā',
   'Apmaini vienu tokenu pret citu uz Uniswap / Sushi / 1inch / Matcha. Testnet vai mainnet — mainnet ieteicams ar mazu summu (<$5). Iemācies gas fee konceptu, slippage un approval darbības.',
   500, 'tx_hash', 'Ielīmē swap transakcijas hash (0x + 64 hex). Mēs pārbaudīsim on-chain.', false, 30),

  ('defi_t2_liquidity', 'defi', 2,
   'Pievieno likviditāti DEX pool-ā',
   'Pievieno savu pirmo likviditāti LP pool-ā (Uniswap v3, Curve, Balancer vai cits). Var būt mikro-summa. Saglabā pozīciju vismaz 24h un saproti impermanent loss konceptu.',
   500, 'tx_hash', 'Ielīmē tx hash no LP add transakcijas.', false, 40),

  ('defi_t2_smart_contract', 'defi', 2,
   'Izlasi vienu smart contract un publicē apskatu',
   'Atver Etherscan / Basescan lapu kādam smart contract (piem. Uniswap Router) un izlasi verified avotu. Uzraksti savu apskatu 200+ vārdos — kā kontrakts strādā, kādi ir galvenie mainīgie, kur ir funkcijas. Publicē DeFi forumā.',
   500, 'url', 'Ielīmē saiti uz savu forum postu.', false, 50),

  ('defi_t3_protocol_review', 'defi', 3,
   'Publicē padziļinātu DeFi protokola analīzi',
   'Izvēlies 1 DeFi protokolu (Aave, Compound, GMX, vai cits) un uzraksti 800+ vārdu analīzi: mehānika, ienākumu modelis, risku profils, TVL trendi, konkurenti. Publicē komūnas forumā — gaidām kvalitāti, ne copy-paste.',
   1500, 'admin_review', 'Ielīmē forum posta URL. Mēs pārskatīsim dziļumu un oriģinalitāti.', false, 60),

  ('defi_t3_case_study', 'defi', 3,
   'Pilns DeFi case-study — no iesākuma līdz iznākumam',
   'Dokumentē pilnu DeFi stratēģiju 30 dienu garumā: sākotnējais kapitāls, mainītās pozīcijas, gas izmaksas, gala PnL, un ko iemācījies. Publicē ar screenshots un tx hash ķēdē saprotamiem soļiem.',
   1500, 'admin_review', 'Ielīmē saiti uz publiski pieejamu case-study (Mirror.xyz, Notion vai forums).', false, 70),

  ('defi_t3_forum_reward', 'defi', 3,
   'DeFi foruma Lvl 5 bonus',
   'Sasniedz 5. līmeni GHL forumā (aktīvi piedalies, dod vērtību citiem biedriem), lai atbloķētu DeFi Dungeon bonusus. Administrācija apstiprinās manuāli pēc aktivitātes pārskata.',
   1500, 'admin_review', 'Ielīmē saiti uz savu forum profilu.', false, 80),

-- ========================================================================
-- TradFi — 7 tasks
-- ========================================================================
  ('tradfi_t1_watchlist', 'tradfi', 1,
   'Izveido watchlist ar 5 aktīviem',
   'Izvēlies 5 dažādus aktīvus (akcijas, ETF, kripto, forex) un izveido watchlist savā brokera vai TradingView platformā. Iekļauj vismaz 2 atšķirīgu asset klašu pozīcijas diversifikācijai.',
   100, 'url', 'Ielīmē screenshot saiti (imgur/loom) ar savu watchlist.', true, 10),

  ('tradfi_t1_price_alert', 'tradfi', 1,
   'Iestati price alert vismaz 3 aktīviem',
   'Izveido cenas brīdinājumus TradingView, brokera app vai savā izvēlētā rīkā. Alerts palīdz neuztraukties par cenu ikdienā.',
   100, 'url', 'Ielīmē screenshot ar redzamiem aktīviem alertiem.', true, 20),

  ('tradfi_t1_indicators', 'tradfi', 1,
   'Iepazīsties ar 3 tehniskajiem indikātoriem',
   'Izpēti RSI, MACD un Bollinger Bands. Uzraksti katram 1-2 teikumu skaidrojumu saviem vārdiem — nevis Google atbilde, bet tas, kā TU tos saproti.',
   100, 'url', 'Ielīmē saiti uz savu Google Doc / Notion ar skaidrojumiem.', true, 30),

  ('tradfi_t2_demo_journal', 'tradfi', 2,
   'Veic 5 demo darījumus un dokumentē journal',
   'Savā brokerī atver demo/paper-trading kontu un veic 5 darījumus 1-2 nedēļu laikā. Pirms katra darījuma uzraksti tēzi (entry, target, stop-loss, iemesls). Pēc katra — rezultāts + ko iemācījies.',
   500, 'url', 'Ielīmē saiti uz publisko journal (Notion, Google Doc) ar 5 darījumiem.', false, 40),

  ('tradfi_t2_market_analysis', 'tradfi', 2,
   'Publicē tirgus analīzi forumā',
   'Uzraksti 300+ vārdu tirgus analīzi par vienu konkrētu tēmu (makro notikums, sektors, aktīvs). Argumenti + skaitļi + savs skatījums. Publicē TradFi forumā.',
   500, 'url', 'Ielīmē forum posta URL.', false, 50),

  ('tradfi_t3_risk_plan', 'tradfi', 3,
   'Riska vadības plāns + 30 dienu izpilde',
   'Uzraksti pilnu riska vadības plānu (pozīciju izmērs %, stop-loss likumi, max drawdown robeža, emocionālie triggers). 30 dienas seko tam ar journal. Iesniedz plānu + journal + refleksiju.',
   1500, 'admin_review', 'Ielīmē saiti uz plānu + 30d journal. Admin pārbaudīs disciplīnu.', false, 60),

  ('tradfi_t3_forum_reward', 'tradfi', 3,
   'TradFi foruma Lvl 4 bonus',
   'Sasniedz 4. līmeni GHL forumā (aktīvi ieguldi TradFi sarunās, palīdzi iesācējiem), lai atbloķētu TradFi Arena bonusus. Administrācija apstiprinās pēc aktivitātes pārskata.',
   1500, 'admin_review', 'Ielīmē saiti uz savu forum profilu.', false, 70),

-- ========================================================================
-- Kultūra — 7 tasks
-- ========================================================================
  ('culture_t1_intro', 'culture', 1,
   'Iepazīstini sevi Kultūras forumā',
   'Uzraksti iepazīstināšanās postu Kultūras forumā — kas tu esi, ar ko nodarbojies, kas tevi aizrauj ārpus Web3/AI. 100+ vārdi, lai cilvēki tevi var iepazīt.',
   100, 'url', 'Ielīmē forum posta URL.', true, 10),

  ('culture_t1_comments', 'culture', 1,
   'Komentē 3 citu biedru ierakstus',
   'Atrodi 3 ierakstus komūnas forumos (jebkurā pīlārā) un uzraksti jēgpilnus komentārus — nevis "good post", bet konkrētu jautājumu, pieredzi vai atbalstu. Kopiena veidojas caur sarunām.',
   100, 'url', 'Ielīmē saites uz 3 saviem komentāriem (vienā īpašā formātā: link1 / link2 / link3).', true, 20),

  ('culture_t2_original', 'culture', 2,
   'Radi oriģinālu saturu un publicē',
   'Radi oriģinālu saturu — teksts, video, grafika, mūzika, poezija vai kas tev tuvs. Par komūnai interesējošu tēmu (identitāte, mācīšanās, Latvija + tehnoloģija, utt.). Publicē Kultūras forumā.',
   500, 'url', 'Ielīmē saiti uz savu publikāciju.', false, 30),

  ('culture_t2_member_spotlight', 'culture', 2,
   'Biedra spotlight — intervija vai profils',
   'Izvēlies citu 100x biedru, intervē vai uzraksti profilu viņu ceļojumam. 500+ vārdi vai 5-10 min video. Publicē Kultūras forumā ar biedra atļauju.',
   500, 'url', 'Ielīmē forum posta URL.', false, 40),

  ('culture_t3_ama', 'culture', 3,
   'Vadi AMA vai diskusiju ar 10+ dalībniekiem',
   'Organizē un vadi "Ask Me Anything" vai tematisku diskusiju online ar vismaz 10 aktīviem dalībniekiem. Pēc pasākuma — publicē kopsavilkumu + svarīgākās atziņas.',
   1500, 'admin_review', 'Ielīmē saiti uz ierakstu vai forum summary. Admin pārbaudīs dalībnieku skaitu.', false, 50),

  ('culture_t3_meetup', 'culture', 3,
   'Organizē klātienes tikšanos (meetup)',
   'Organizē klātienes meetup-u komūnai (Rīga, Valmiera, jebkur Latvijā vai ārzemēs). 5+ biedri pulcējas. Publicē bildes + īsu atskati par pasākumu.',
   1500, 'admin_review', 'Ielīmē saiti uz forum postu ar bildēm un dalībnieku sarakstu.', false, 60),

  ('culture_t3_forum_reward', 'culture', 3,
   'Kultūras foruma Lvl 2 bonus',
   'Sasniedz 2. līmeni GHL forumā (regulāra aktivitāte Kultūras diskusijās), lai atbloķētu Kultūras pīlāra bonusus.',
   1500, 'admin_review', 'Ielīmē saiti uz savu forum profilu.', false, 70)

ON CONFLICT (id) DO UPDATE SET
  pillar         = EXCLUDED.pillar,
  tier           = EXCLUDED.tier,
  title_lv       = EXCLUDED.title_lv,
  description_lv = EXCLUDED.description_lv,
  xp_amount      = EXCLUDED.xp_amount,
  proof_type     = EXCLUDED.proof_type,
  proof_hint_lv  = EXCLUDED.proof_hint_lv,
  auto_approve   = EXCLUDED.auto_approve,
  position       = EXCLUDED.position,
  active         = EXCLUDED.active;
