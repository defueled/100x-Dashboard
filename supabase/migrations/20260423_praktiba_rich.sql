-- Pratība enrichment: add educational fields + forum-proof requirement.
-- Run after 20260423_praktiba_expansion.sql. Idempotent.

ALTER TABLE task_catalog
  ADD COLUMN IF NOT EXISTS instructions_lv     TEXT,           -- step-by-step "kā jādara"
  ADD COLUMN IF NOT EXISTS external_links      JSONB DEFAULT '[]'::jsonb,  -- [{label,url}] registration / tutorials
  ADD COLUMN IF NOT EXISTS forum_url           TEXT,           -- direct URL to the right 100x forum
  ADD COLUMN IF NOT EXISTS forum_label         TEXT,           -- button text e.g. "Atvērt AI forumu"
  ADD COLUMN IF NOT EXISTS forum_template_lv   TEXT,           -- copy-paste post template
  ADD COLUMN IF NOT EXISTS requires_forum_proof BOOLEAN DEFAULT FALSE;  -- enforce platforma.100x.lv URL

-- ============================================================
-- AI tasks — enriched
-- ============================================================
UPDATE task_catalog SET
  instructions_lv = $$1. Atver ChatGPT.com vai Claude.ai un izveido bezmaksas kontu.
2. Uzsāc savu pirmo sarunu — vienkāršu jautājumu vai tēmu.
3. Saglabā saites uz savu publisko sarunu (Share button) VAI screenshot uz imgur.com.
4. Iesniedz saiti šeit + dalies AI forumā ar pirmo iespaidu.$$,
  external_links = '[
    {"label":"Reģistrēties ChatGPT","url":"https://chatgpt.com"},
    {"label":"Reģistrēties Claude","url":"https://claude.ai"},
    {"label":"Imgur (screenshots)","url":"https://imgur.com/upload"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Atvērt AI forumu',
  forum_template_lv = $$Sveiki! Tikko izveidoju savu pirmo AI kontu un sāku eksperimentēt.

Mans pirmais iespaids: [tavs apraksts]
Ko jautāju AI: [tavs jautājums]
Atbilde, kas pārsteidza: [īss citāts]

Saite uz manu sarunu: [paste link]$$,
  requires_forum_proof = false
WHERE id = 'ai_t1_chatgpt_account';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies VIENU mērķi (piem. "ģenerēt 5 biznesa idejas Latvijas tirgum").
2. Uzraksti 5 dažādus promptus tam pašam mērķim — mainot stilu, kontekstu, lomu.
3. Pieraksti kuru promptu rezultāts patika visvairāk un kāpēc.
4. Publicē salīdzinājumu Google Doc / Notion (publisks links).
5. Dalies linkā AI forumā lai citi var iemācīties.$$,
  external_links = '[
    {"label":"Google Docs","url":"https://docs.google.com/document/u/0/?tgif=d"},
    {"label":"Notion","url":"https://www.notion.so/"},
    {"label":"Prompting gids (OpenAI)","url":"https://platform.openai.com/docs/guides/prompt-engineering"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Atvērt AI forumu',
  forum_template_lv = $$# 5 dažādi promptu eksperimenti

Mērķis: [tavs mērķis]

| # | Prompts | Kvalitāte 1-5 | Piezīmes |
|---|---------|---------------|----------|
| 1 | … | … | … |
| 2 | … | … | … |
| 3 | … | … | … |
| 4 | … | … | … |
| 5 | … | … | … |

Mans secinājums: [kāds prompts strādāja vislabāk un kāpēc]
Pilns dokuments: [paste link]$$,
  requires_forum_proof = false
WHERE id = 'ai_t1_prompt_basics';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies vienu vizuālo koncepciju (piem. "futūristisks rīgas centrs naktī").
2. Ģenerē vismaz 3 attēlus ar Midjourney / DALL·E / Stable Diffusion / Nano Banana.
3. Saglabā promptu evolūciju — kā mainījās prompts katrā iterācijā.
4. Publicē AI forumā postu ar attēliem + promptiem + ko iemācījies.
5. Iesniedz forum posta URL šeit.$$,
  external_links = '[
    {"label":"Midjourney","url":"https://www.midjourney.com/"},
    {"label":"DALL·E (ChatGPT)","url":"https://chatgpt.com"},
    {"label":"Stable Diffusion (free)","url":"https://stablediffusionweb.com/"},
    {"label":"Nano Banana","url":"https://nanobanana.ai/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Publicē AI forumā',
  forum_template_lv = $$# Mans pirmais Text-to-Image eksperiments

Koncepcija: [tava ideja]
Rīks: [Midjourney / DALL·E / SD / Nano Banana]

## Iterācijas
1. Pirmais prompts: "..." → [pievieno attēlu]
2. Uzlabotais prompts: "..." → [pievieno attēlu]
3. Galīgais prompts: "..." → [pievieno attēlu]

Ko iemācījos: [tava refleksija]$$,
  requires_forum_proof = true
WHERE id = 'ai_t2_text_to_image';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies konkrētu darba uzdevumu, kuru gribi automatizēt ar AI.
2. Uzraksti strukturētu promptu pēc šablona:
   - ROLE: kas AI ir (piem. "Esi pieredzējis copywriter")
   - CONTEXT: kāds ir konteksts (mērķauditorija, situācija)
   - CONSTRAINTS: ierobežojumi (formāts, garums, tonis)
   - EXAMPLE: 1-2 piemēri ar gaidāmo rezultātu
3. Pārbaudi promptu vairākas reizes, uzlabo.
4. Publicē strukturēto promptu AI forumā ar reālu rezultātu, ko tas radīja.$$,
  external_links = '[
    {"label":"Anthropic Prompt Library","url":"https://docs.anthropic.com/en/prompt-library/library"},
    {"label":"OpenAI Cookbook","url":"https://cookbook.openai.com/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Publicē AI forumā',
  forum_template_lv = $$# Strukturētais prompts: [īss apraksts]

**Uzdevums kuru risinu:** [konteksts]

```
ROLE: Esi …
CONTEXT: …
CONSTRAINTS: …
EXAMPLE:
Q: …
A: …

Tagad: [reālais jautājums]
```

**Rezultāts ko ieguvu:** [īss kopsavilkums vai citāts]
**Ko tagad varu pārliecinoši automatizēt:** [tava atziņa]$$,
  requires_forum_proof = true
WHERE id = 'ai_t2_prompt_post';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies VIENU saturu kas tev jāradot tuvākās 7 dienās (LinkedIn raksts, blog, video script, e-pasta sērija).
2. Izmanto AI lai ģenerētu pirmo melnrakstu.
3. Rediģē + uzlabo to ar savu pieredzi (parasti AI dod 70% — tu pieliec 30% personisko).
4. Publicē saturu (LinkedIn / blog / YouTube / utt.).
5. Dalies forumā: kā AI palīdzēja, kur AI bija jārediģē, cik laika ietaupīji.$$,
  external_links = '[
    {"label":"ChatGPT","url":"https://chatgpt.com"},
    {"label":"Claude","url":"https://claude.ai"},
    {"label":"LinkedIn","url":"https://www.linkedin.com/feed/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Atvērt AI forumu',
  forum_template_lv = $$# AI palīdzēja man uzrakstīt: [tavs satura nosaukums]

**Rīks:** [ChatGPT / Claude / cits]
**Saturs:** [paste publication link]

## AI vs. cilvēks
- AI dāva: [piem. struktūru, pirmo melnrakstu, 5 versijas virsraksta]
- Es pielikām: [tavs personiskais leņķis, fakti, valoda]
- Laika ietaupījums: [piem. 4h → 1h]

Galvenā mācība: [īss insights]$$,
  requires_forum_proof = false
WHERE id = 'ai_t2_content_creation';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies VIENU ikdienas uzdevumu (e-pastu atbildes, soc.mediju plāns, datu apkopošana, faili u.c.).
2. Izvēlies platformu: n8n (open-source), Zapier, Make.com, vai pašrakstīts Python/Node skripts ar AI API.
3. Uzbūvē automatizāciju kas darbojas vismaz 1 nedēļu bez kļūdām.
4. Ieraksti Loom video (5-10 min) kas parāda demo + arhitektūru.
5. Publicē video + workflow eksports / kods uz GitHub vai Loom.
6. Iesniedz video URL — admin pārbaudīs ka tā strādā.$$,
  external_links = '[
    {"label":"n8n (self-host)","url":"https://n8n.io/"},
    {"label":"Zapier","url":"https://zapier.com/"},
    {"label":"Make.com","url":"https://www.make.com/"},
    {"label":"Loom","url":"https://www.loom.com/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Dalies forumā pēc apstiprinājuma',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'ai_t3_automation';

UPDATE task_catalog SET
  instructions_lv = $$1. Atrod problēmu kuru tu PATS gribi atrisināt — tas motivēs.
2. Uzbūvē minimālu rīku: web app, CLI, MCP serveri vai aģentu (var izmantot Lovable, v0, Cursor).
3. Publicē kodu publiski uz GitHub ar README (kā instalēt + lietot).
4. Iznes uz publisku URL (Vercel/Cloudflare Pages — bezmaksas).
5. Iesniedz GitHub repo + dzīvu URL šeit. Admin pārbaudīs.$$,
  external_links = '[
    {"label":"GitHub","url":"https://github.com/new"},
    {"label":"Vercel (deploy)","url":"https://vercel.com/new"},
    {"label":"Lovable","url":"https://lovable.dev/"},
    {"label":"v0 by Vercel","url":"https://v0.app/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Pasludini forumā',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'ai_t3_ship_ai_tool';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies vienu AI prasmi: prompting konsultācijas, AI satura, AI automatizācija, AI freelance dizains.
2. Atrodi pirmo klientu (Upwork, Fiverr, LinkedIn, vai 100x komūna).
3. Izpildi pasūtījumu, sasniedz €100+ ieņēmumu 30 dienu laikā.
4. Uzraksti case-study: kā atrada klientu, ko pārdeva, ko iemācījies. Slēp jūtīgus klienta datus.
5. Publicē formā vai uz Mirror.xyz / Notion. Iesniedz linku.$$,
  external_links = '[
    {"label":"Upwork","url":"https://www.upwork.com/"},
    {"label":"Fiverr","url":"https://www.fiverr.com/"},
    {"label":"Mirror.xyz","url":"https://mirror.xyz/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/aii/home',
  forum_label = 'Atvērt AI forumu',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'ai_t3_ai_income';

-- ============================================================
-- DeFi tasks — enriched
-- ============================================================
UPDATE task_catalog SET
  instructions_lv = $$1. Lejupielādē MetaMask vai Rabby (Chrome/Firefox extension).
2. Sekot vednim: izveido jaunu maku, IZRAKSTI seed frāzi uz papīra.
3. NEKAD nesaglabā seed frāzi cloud / browser / e-pastā / foto.
4. Pierādījumam iesniedz savu publisko 0x… adresi (publiski drošs).
5. Dalies DeFi forumā ka esi pievienojies — 1. solis ir spertspersi.$$,
  external_links = '[
    {"label":"MetaMask","url":"https://metamask.io/download/"},
    {"label":"Rabby (uzlabotais)","url":"https://rabby.io/"},
    {"label":"Drošības pamācība","url":"https://support.metamask.io/managing-my-wallet/secret-recovery-phrase/secret-recovery-phrase-guide/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Dalies DeFi forumā',
  forum_template_lv = $$Tikko izveidoju savu pirmo Web3 maku ([MetaMask / Rabby])!

Mana 0x adrese: [tava 0x adrese]
Tīkls kuru izvēlējos sākumā: [Ethereum / Base / Arbitrum / cits]

Jautājums citiem biedriem: [piem. ko ieteiktu kā nākamo soli?]$$,
  requires_forum_proof = false
WHERE id = 'defi_t1_wallet_setup';

UPDATE task_catalog SET
  instructions_lv = $$1. Atver Sepolia faucet vai Base Sepolia faucet (sk. links).
2. Ielīmē savu 0x adresi un saņem free testnet ETH (parasti 0.1 ETH).
3. Atver MetaMask, pārslēdzies uz testnet (Sepolia vai Base Sepolia).
4. Veic darījumu — sūti sev pašam 0.001 ETH.
5. Atrod tx hash Etherscan / Basescan un iesniedz to šeit (0x + 64 simboli).$$,
  external_links = '[
    {"label":"Sepolia Faucet","url":"https://sepoliafaucet.com/"},
    {"label":"Base Sepolia Faucet","url":"https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"},
    {"label":"Sepolia Etherscan","url":"https://sepolia.etherscan.io/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Dalies DeFi forumā',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'defi_t1_testnet_tokens';

UPDATE task_catalog SET
  instructions_lv = $$1. Atver Uniswap (uniswap.org) vai 1inch.
2. Pieslēdz savu maku (Connect Wallet).
3. Izvēlies sākuma tokenu (USDC vai ETH) un mērķa tokenu (jebkurš).
4. PIRMAIS swap — sāc ar mazu summu (<$5 mainnet vai testnet).
5. Apstiprini approval transakciju (vienreizēja), tad swap transakciju.
6. Saņem tx hash no MetaMask aktivitātes vai Etherscan, iesniedz šeit.$$,
  external_links = '[
    {"label":"Uniswap","url":"https://app.uniswap.org/swap"},
    {"label":"1inch","url":"https://app.1inch.io/"},
    {"label":"Matcha (cheap fees)","url":"https://matcha.xyz/"},
    {"label":"Slippage izskaidrojums","url":"https://help.uniswap.org/en/articles/8643879-what-is-slippage"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Dalies DeFi forumā',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'defi_t2_first_swap';

UPDATE task_catalog SET
  instructions_lv = $$1. Atver Uniswap v3, izvēlies pool (piem. ETH/USDC).
2. Pieslēdz maku, izvēlies cenas range (concentrated liquidity).
3. Apstiprini deposit transakciju — saņem LP NFT.
4. Pirms iesniegšanas, paskaidro forum postā: kāpēc šo pool, kāds range, kā saproti impermanent loss.
5. Iesniedz tx hash šeit.$$,
  external_links = '[
    {"label":"Uniswap v3","url":"https://app.uniswap.org/positions"},
    {"label":"IL kalkulators","url":"https://defi-lab.xyz/uniswapv3simulator"},
    {"label":"v3 LP gids","url":"https://docs.uniswap.org/concepts/protocol/concentrated-liquidity"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Publicē DeFi forumā',
  forum_template_lv = $$# Mans pirmais LP — [pool nosaukums]

Pool: [piem. ETH/USDC 0.3%]
Range: [piem. $3500 — $4200]
Iemesls range izvēlei: [tava analīze]
Risks: [kā saproti impermanent loss]

Tx hash: [paste]$$,
  requires_forum_proof = false
WHERE id = 'defi_t2_liquidity';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies populāru smart kontraktu (piem. Uniswap V2 Router, USDC, vai aizdevuma protokols).
2. Atver Etherscan/Basescan, atrod kontraktu, klikšķini "Contract" → "Code" (verified avots).
3. Izlasi visu vienu funkciju — piem. swapExactTokensForTokens. Saproti ko tā dara.
4. Uzraksti 200+ vārdu apskatu DeFi forumā: kā kontrakts strādā, kādi galvenie mainīgie, kur ir riski.$$,
  external_links = '[
    {"label":"Etherscan","url":"https://etherscan.io/"},
    {"label":"Basescan","url":"https://basescan.org/"},
    {"label":"Solidity by Example","url":"https://solidity-by-example.org/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Publicē DeFi forumā',
  forum_template_lv = $$# Smart contract apskats: [kontrakta nosaukums]

Adrese: [0x…]
Avota saite: [Etherscan link]

## Ko šis kontrakts dara
[tavs apraksts saviem vārdiem]

## Galvenās funkcijas
- `funkcijasNosaukums()` — [ko dara]

## Riski / mainīgie
[ko ievēroju kā potenciāli bīstamu vai svarīgu]$$,
  requires_forum_proof = true
WHERE id = 'defi_t2_smart_contract';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies 1 DeFi protokolu kuru gribi izprast dziļi (Aave, Compound, GMX, Pendle, vai cits).
2. Izpēti: white paper, dokumentāciju, DefiLlama TVL trends, audita reportus.
3. Uzraksti 800+ vārdu analīzi:
   - Kā tas pelna ($)
   - Risku profils (smart contract, governance, market)
   - TVL un lietotāju skaita trendi
   - Konkurenti un priekšrocība
4. Publicē DeFi forumā. Admin pārbaudīs dziļumu un oriģinalitāti (ne copy-paste).$$,
  external_links = '[
    {"label":"DefiLlama","url":"https://defillama.com/"},
    {"label":"Aave docs","url":"https://docs.aave.com/"},
    {"label":"Compound docs","url":"https://docs.compound.finance/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Publicē DeFi forumā',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'defi_t3_protocol_review';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies stratēģiju (lending, LP, perps, options) un mazu kapitāl ($50-$500).
2. Sāk dienu 1 — ieraksti journalā: pozīcijas, gas fees, hipoteze.
3. Katru dienu seko + atjauno journal. 30 dienu garumā.
4. Pēc 30d publicē retrospektīvu Mirror.xyz / Notion: PnL, ko iemācījies, ko darītu citādi.
5. Iesniedz publisku linku — admin pārbaudīs dziļumu.$$,
  external_links = '[
    {"label":"Mirror.xyz","url":"https://mirror.xyz/"},
    {"label":"DeBank (portfolio)","url":"https://debank.com/"},
    {"label":"Zapper","url":"https://zapper.xyz/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Dalies pēc apstiprinājuma',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'defi_t3_case_study';

UPDATE task_catalog SET
  instructions_lv = $$1. Aktīvi piedalies DeFi forumā — atbildi citiem, dali pieredzi, palīdzi iesācējiem.
2. Sasniedz GHL forum līmeni 5 (admin redz tavu aktivitāti GHL CRM).
3. Iesniedz saiti uz savu forum profilu — admin manuāli pārbaudīs.$$,
  external_links = '[]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/defi/home',
  forum_label = 'Atvērt DeFi forumu',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'defi_t3_forum_reward';

-- ============================================================
-- TradFi tasks — enriched
-- ============================================================
UPDATE task_catalog SET
  instructions_lv = $$1. Atver TradingView (bezmaksas konts) vai sava brokera platformu.
2. Izveido watchlist nosaukumu "100x" vai līdzīgu.
3. Pievieno 5 aktīvus, vismaz 2 dažādās asset klasēs (akcijas + ETF, vai krypto + forex).
4. Veic screenshot kur redzams watchlist.
5. Augšupielādē uz imgur.com vai loom.com un iesniedz saiti.$$,
  external_links = '[
    {"label":"TradingView","url":"https://www.tradingview.com/"},
    {"label":"Imgur","url":"https://imgur.com/upload"},
    {"label":"Loom","url":"https://www.loom.com/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Dalies TradFi forumā',
  forum_template_lv = $$# Mans pirmais watchlist

| # | Aktīvs | Kāpēc to izvēlējos |
|---|--------|---------------------|
| 1 | … | … |
| 2 | … | … |
| 3 | … | … |
| 4 | … | … |
| 5 | … | … |

Screenshot: [imgur link]$$,
  requires_forum_proof = false
WHERE id = 'tradfi_t1_watchlist';

UPDATE task_catalog SET
  instructions_lv = $$1. TradingView vai brokera platformā atver alert iestatījumus.
2. Izveido 3 alerts uz savas watchlist aktīviem (cenas, RSI, vai breakout).
3. Pārbaudi ka notifikācijas darbojas (e-pasts vai mobile).
4. Veic screenshot ar redzamiem aktīviem alertiem.$$,
  external_links = '[
    {"label":"TradingView Alerts","url":"https://www.tradingview.com/support/solutions/43000478132/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Atvērt TradFi forumu',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'tradfi_t1_price_alert';

UPDATE task_catalog SET
  instructions_lv = $$1. Atrod un izlasi par RSI, MACD un Bollinger Bands (Investopedia, YouTube).
2. Saviem vārdiem (NE Google copy) uzraksti 1-2 teikumus par katru: ko mēra, kā lasīt.
3. Publicē Google Doc / Notion publisko lapu.
4. Iesniedz saiti šeit.$$,
  external_links = '[
    {"label":"RSI (Investopedia)","url":"https://www.investopedia.com/terms/r/rsi.asp"},
    {"label":"MACD (Investopedia)","url":"https://www.investopedia.com/terms/m/macd.asp"},
    {"label":"Bollinger Bands","url":"https://www.investopedia.com/terms/b/bollingerbands.asp"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Dalies TradFi forumā',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'tradfi_t1_indicators';

UPDATE task_catalog SET
  instructions_lv = $$1. Atver demo / paper trading kontu savā brokerī (Interactive Brokers, eToro, vai TradingView paper).
2. 1-2 nedēļu laikā veic 5 demo darījumus.
3. Pirms KATRA darījuma uzraksti journalā: entry, target, stop-loss, iemesls.
4. Pēc katra: rezultāts, ko iemācījies, vai sekoji savai stratēģijai.
5. Publicē journal Notion / Google Doc publiski + dalies forumā.$$,
  external_links = '[
    {"label":"TradingView Paper Trading","url":"https://www.tradingview.com/support/solutions/43000516466/"},
    {"label":"IBKR (demo)","url":"https://www.interactivebrokers.com/en/index.php?f=46390"},
    {"label":"Notion","url":"https://www.notion.so/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Publicē TradFi forumā',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'tradfi_t2_demo_journal';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies vienu konkrētu tēmu (makro notikums, sektors, aktīvs).
2. Apkopo datus: cenu chart, volume, fundamentāli skaitļi, ziņas.
3. Uzraksti 300+ vārdu analīzi: kāda ir tava tēze, kāpēc, kādi riski.
4. Publicē TradFi forumā ar atbildēm uz "kas?" "kāpēc?" "kā šobrīd?"$$,
  external_links = '[
    {"label":"Yahoo Finance","url":"https://finance.yahoo.com/"},
    {"label":"TradingView","url":"https://www.tradingview.com/"},
    {"label":"Koyfin","url":"https://www.koyfin.com/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Publicē TradFi forumā',
  forum_template_lv = $$# Tirgus analīze: [tema]

**Tēze:** [tava ideja vienā teikumā]
**Aktīvs / sektors:** [ko apskati]

## Konteksts
[fakti, skaitļi, ziņas]

## Argumenti par
- …
- …

## Argumenti pret / riski
- …
- …

## Mans skatījums
[secinājums]$$,
  requires_forum_proof = true
WHERE id = 'tradfi_t2_market_analysis';

UPDATE task_catalog SET
  instructions_lv = $$1. Uzraksti pilnu riska vadības plānu Notion / Google Doc:
   - Position size formula (piem. 1-2% no portfeļa)
   - Stop-loss likumi (kur, kā)
   - Max drawdown tolerance
   - Emocionālie triggers ko atpazīsi
2. 30 dienu laikā stingri seko plānam un veid journal.
3. Pēc 30d publicē plānu + journal + refleksiju (ko tev neizdevās, ko korekti).
4. Iesniedz publisku linku — admin pārbaudīs disciplīnu.$$,
  external_links = '[
    {"label":"Notion","url":"https://www.notion.so/"},
    {"label":"TJournal (paid, super)","url":"https://www.tradezella.com/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Dalies pēc apstiprinājuma',
  forum_template_lv = NULL,
  requires_forum_proof = false
WHERE id = 'tradfi_t3_risk_plan';

UPDATE task_catalog SET
  instructions_lv = $$1. Aktīvi piedalies TradFi forumā — atbildi citiem, dali pieredzi, palīdzi iesācējiem.
2. Sasniedz GHL forum līmeni 4.
3. Iesniedz saiti uz savu forum profilu — admin pārbaudīs.$$,
  external_links = '[]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/tradfi/home',
  forum_label = 'Atvērt TradFi forumu',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'tradfi_t3_forum_reward';

-- ============================================================
-- Kultūra tasks — enriched
-- ============================================================
UPDATE task_catalog SET
  instructions_lv = $$1. Atver Kultūras forumu (poga zemāk).
2. Spied "Create post" (jauns ieraksts).
3. Pastāsti kas tu esi, ar ko nodarbojies, kas tevi aizrauj. 100+ vārdi — komunītei vajag tevi iepazīt.
4. Iesniedz forum posta URL šeit.$$,
  external_links = '[]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Publicē Kultūras forumā',
  forum_template_lv = $$# Sveiki, esmu [tavs vārds]

**Ar ko nodarbojos:** [tava nodarbošanās / mācības]
**Kas mani 100x atved:** [iemesls pievienoties]
**Kas mani aizrauj ārpus tehnoloģijas:** [hobiji, intereses]
**Mērķis 2026.gadam:** [tava ambīcija]

Priecīgs iepazīt visus! 👋$$,
  requires_forum_proof = true
WHERE id = 'culture_t1_intro';

UPDATE task_catalog SET
  instructions_lv = $$1. Pārlūko AI / DeFi / TradFi / Kultūras forumus.
2. Atrodi 3 ierakstus, kuros vari dot vērtību: jautājums, pieredze, iedrošinājums.
3. Uzraksti jēgpilnus komentārus — NE "good post", bet konkrētus.
4. Iesniedz saites uz 3 saviem komentāriem (formātā: link1 / link2 / link3).$$,
  external_links = '[
    {"label":"AI Forums","url":"https://platforma.100x.lv/communities/groups/aii/home"},
    {"label":"DeFi Forums","url":"https://platforma.100x.lv/communities/groups/defi/home"},
    {"label":"TradFi Forums","url":"https://platforma.100x.lv/communities/groups/tradfi/home"},
    {"label":"Kultūras Forums","url":"https://platforma.100x.lv/communities/groups/kultura/home"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Atvērt Kultūras forumu',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'culture_t1_comments';

UPDATE task_catalog SET
  instructions_lv = $$1. Radi VIENU oriģinālu saturu — teksts, video, grafika, mūzika, poezija.
2. Tēma: kaut kas, kas saista 100x komūnu (identitāte, mācīšanās, Latvija + tehnoloģija, finanses utt.).
3. Publicē Kultūras forumā ar īsu paskaidrojumu — kāpēc šī tēma tev svarīga.$$,
  external_links = '[
    {"label":"Canva (dizains)","url":"https://www.canva.com/"},
    {"label":"Figma","url":"https://www.figma.com/"},
    {"label":"CapCut (video)","url":"https://www.capcut.com/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Publicē Kultūras forumā',
  forum_template_lv = $$# [Tava darba nosaukums]

[Pievieno saturu: attēls, video embed, vai teksts]

**Kāpēc šī tēma man svarīga:** [tava motivācija]
**Vēlos dzirdēt:** [ko gribi atbildē no komūnas]$$,
  requires_forum_proof = true
WHERE id = 'culture_t2_original';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies citu 100x biedru (jautā viņam atļauju!).
2. Veic interviju 30-60 min vai veic profila pētījumu.
3. Uzraksti 500+ vārdu profilu vai uzraksti 5-10 min video.
4. Publicē Kultūras forumā ar biedra atļauju + tag-ojot viņu.$$,
  external_links = '[
    {"label":"Loom (video)","url":"https://www.loom.com/"},
    {"label":"Otter.ai (transkripcija)","url":"https://otter.ai/"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Publicē Kultūras forumā',
  forum_template_lv = $$# Spotlight: [biedra vārds]

[Pievieno foto / avatara]

**Ar ko nodarbojas:** …
**100x ceļojums:** …
**Lielākā atklāsme šajā gadā:** …
**Ko viņš/-a iesaka iesācējiem:** …

Pateicība: @[lietotājs]$$,
  requires_forum_proof = true
WHERE id = 'culture_t2_member_spotlight';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies tematu (AI, DeFi, dzīves ceļš, vai brīvs Q&A).
2. Saplāno datumu un platformu (Telegram, Zoom, Twitter Spaces).
3. Paziņo komūnai 1 nedēļu iepriekš ar tematu un datumu.
4. Vadi pasākumu — vismaz 10 aktīvi dalībnieki.
5. Pēc tam publicē kopsavilkumu + 3-5 svarīgākās atziņas Kultūras forumā.$$,
  external_links = '[
    {"label":"Zoom","url":"https://zoom.us/"},
    {"label":"X Spaces","url":"https://twitter.com/i/spaces/start"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Publicē kopsavilkumu Kultūras forumā',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'culture_t3_ama';

UPDATE task_catalog SET
  instructions_lv = $$1. Izvēlies pilsētu (Rīga, Valmiera, jebkur Latvijā vai ārzemēs).
2. Plāno datumu, vietu (kafejnīca, koworking, maza zāle).
3. Paziņo komūnai 2 nedēļas iepriekš.
4. Sapulcini vismaz 5 biedrus klātienē.
5. Pēc pasākuma publicē Kultūras forumā: bildes + dalībnieku saraksts + atskate.$$,
  external_links = '[
    {"label":"Lu.ma (event RSVP)","url":"https://lu.ma/create"}
  ]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Publicē atskati Kultūras forumā',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'culture_t3_meetup';

UPDATE task_catalog SET
  instructions_lv = $$1. Aktīvi piedalies Kultūras forumā — komentē, sāk diskusijas, palīdzi.
2. Sasniedz GHL forum līmeni 2.
3. Iesniedz saiti uz savu forum profilu.$$,
  external_links = '[]'::jsonb,
  forum_url = 'https://platforma.100x.lv/communities/groups/kultura/home',
  forum_label = 'Atvērt Kultūras forumu',
  forum_template_lv = NULL,
  requires_forum_proof = true
WHERE id = 'culture_t3_forum_reward';
