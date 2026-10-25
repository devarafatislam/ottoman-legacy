"""
Speech-aware re-timing of the supplied Bengali SRT (TEXT IS NEVER CHANGED).

Why: the supplied SRT spreads each sentence's text proportionally over wall-clock time (pauses included),
so cue boundaries drift from the real voice by up to several seconds. Here we
  1. detect real speech / pause regions from the MP3 energy,
  2. split the SRT text into sentences and pick, by dynamic programming, the pause that ends each sentence
     (speech-time per syllable must stay consistent, long pauses are preferred),
  3. place the cues inside every sentence in SPEECH time (pauses skipped) and snap to comma pauses.
Outputs: public/ottoman_36_sultans_bn_subtitles.aligned.srt, src/data/cueTimes.json, src/data/cueWords.json, docs/sync-report.json
The original SRT is left untouched.
"""
import re, json, subprocess, sys, os
import numpy as np

SRT_IN = 'public/ottoman_36_sultans_bn_subtitles.srt'
MP3 = 'public/voice_over.mp3'

# ---------- parse srt ----------
def ts(a):
    m = re.match(r'(\d+):(\d+):(\d+)[,.](\d+)', a.strip()); return int(m[1])*3600+int(m[2])*60+int(m[3])+int(m[4])/1000
raw = open(SRT_IN, encoding='utf-8-sig').read().replace('\r', '')
cues = []
for b in re.split(r'\n\s*\n', raw.strip()):
    l = b.strip().split('\n'); a, e = l[1].split('-->')
    cues.append(dict(i=int(l[0]), s0=ts(a), e0=ts(e), text=' '.join(l[2:]).strip()))
N = len(cues)

# ---------- syllable-ish weight ----------
IND = set('অআইঈউঊঋএঐওঔ'); MATRA = set('ািীুূৃেৈোৌ'); HAS = '্'
def isc(ch): return '\u0995' <= ch <= '\u09B9' or ch in 'ড়ঢ়য়ৎ'
def weight(text):
    w = 0.0; n = len(text)
    for k, ch in enumerate(text):
        nxt = text[k+1] if k+1 < n else ' '
        if ch in IND: w += 1
        elif ch in MATRA: w += 1
        elif isc(ch):
            if nxt == HAS or nxt in MATRA: continue
            w += 0.35 if (not nxt.strip() or nxt in '।,?!.—-' or not ('\u0980' <= nxt <= '\u09FF')) else 0.9
        elif '\u09E6' <= ch <= '\u09EF' or ch.isdigit(): w += 1.9
        elif ch.isascii() and ch.isalpha(): w += 0.5
    return max(w, 0.5)
def word_weights(text):
    return [(m.group(0), weight(m.group(0))) for m in re.finditer(r'\S+', text)]

# ---------- audio → speech segments ----------
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP3, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32)
FR = 160  # 10 ms
n = len(x) // FR
E = 10*np.log10((x[:n*FR].reshape(n, FR)**2).mean(1) + 1e-3)
E = np.convolve(E, np.ones(3)/3, 'same')
# Otsu threshold on dB values
hist, edges = np.histogram(E, bins=120); p = hist/hist.sum(); cen = (edges[:-1]+edges[1:])/2
best, T = -1, cen[0]
for k in range(1, 119):
    w0, w1 = p[:k].sum(), p[k:].sum()
    if w0 < 1e-4 or w1 < 1e-4: continue
    m0, m1 = (p[:k]*cen[:k]).sum()/w0, (p[k:]*cen[k:]).sum()/w1
    v = w0*w1*(m0-m1)**2
    if v > best: best, T = v, cen[k]
T = T - 3.0   # slightly permissive: quiet consonants stay inside speech
sp = E > T
# close tiny gaps, drop tiny blips
def runs(b):
    out = []; s = None
    for i, v in enumerate(b):
        if v and s is None: s = i
        if not v and s is not None: out.append([s, i]); s = None
    if s is not None: out.append([s, len(b)])
    return out
segs = runs(sp)
merged = []
for a, b in segs:
    if merged and a - merged[-1][1] < 9: merged[-1][1] = b      # gap < 90 ms
    else: merged.append([a, b])
merged = [[a, b] for a, b in merged if b - a >= 6]
S = [(a*0.01, b*0.01) for a, b in merged]
DUR = len(x)/16000
cum = [0.0]
for a, b in S: cum.append(cum[-1] + (b-a))
TOTAL_SPEECH = cum[-1]
pauses = [(S[k][1], S[k+1][0]) for k in range(len(S)-1)]

def sp_at(t):             # cumulative speech seconds up to wall-clock t
    lo, hi = 0, len(S)-1
    if t <= S[0][0]: return 0.0
    if t >= S[-1][1]: return TOTAL_SPEECH
    while lo < hi:
        mid = (lo+hi+1)//2
        if S[mid][0] <= t: lo = mid
        else: hi = mid-1
    a, b = S[lo]; return cum[lo] + min(max(t-a, 0), b-a)
def t_at(tau):            # wall-clock time at cumulative speech seconds tau
    tau = min(max(tau, 0), TOTAL_SPEECH)
    lo, hi = 0, len(S)-1
    while lo < hi:
        mid = (lo+hi+1)//2
        if cum[mid] <= tau: lo = mid
        else: hi = mid-1
    a, b = S[lo]; return a + min(tau-cum[lo], b-a)

# ---------- sentences ----------
sent = []; cur = []
for c in cues:
    cur.append(c)
    if re.search(r'[।?!]\s*$', c['text']): sent.append(cur); cur = []
if cur: sent.append(cur)
Wsent = [sum(weight(c['text']) for c in s) for s in sent]
R = TOTAL_SPEECH / sum(Wsent)   # global seconds per weight unit

# candidate sentence-end pauses (>= 0.22 s)
cand = [(a, b) for a, b in pauses if b-a >= 0.22]
# boundary list: 0 = start (speech onset), 1..m = candidates, m+1 = end
bs = [(0.0, S[0][0])] + cand + [(S[-1][1], DUR)]
m = len(bs)
spb = [sp_at(b[0]) for b in bs]             # speech seconds before each boundary
spb[0] = 0.0; spb[-1] = TOTAL_SPEECH
dur = [b[1]-b[0] for b in bs]
nS = len(sent)
INF = 1e18
f = np.full((nS+1, m), INF); bp = np.zeros((nS+1, m), dtype=int)
f[0, 0] = 0.0
WIN = 90
for i in range(1, nS+1):
    wi = Wsent[i-1]; exp = R*wi; sig = 0.14*exp + 0.35
    js = range(1, m) if i < nS else [m-1]
    for j in js:
        lo = max(0, j-WIN); prev = f[i-1, lo:j]
        if not np.isfinite(prev).any() or (prev >= INF).all(): continue
        d = spb[j] - np.array(spb[lo:j])
        cost = prev + ((d-exp)/sig)**2 - 2.2*min(dur[j], 1.0)*(1 if j < m-1 else 0)
        k = int(np.argmin(cost)); f[i, j] = cost[k]; bp[i, j] = lo+k
# backtrack
bounds = [0]*(nS+1); bounds[nS] = m-1
for i in range(nS, 0, -1): bounds[i-1] = bp[i, bounds[i]]
# ---------- place cues + words ----------
lead = 0.06
out = {}; words = {}
rows = []
for si, s in enumerate(sent):
    j0, j1 = bounds[si], bounds[si+1]
    t0 = bs[j0][1] if si else S[0][0]       # speech onset after the previous boundary pause
    t1 = bs[j1][0]                           # speech offset before the next pause
    tau0, tau1 = sp_at(t0), sp_at(t1)
    ws = [weight(c['text']) for c in s]; tot = sum(ws); acc = 0.0
    inner_pauses = [(a, b) for a, b in pauses if t0 < a and b < t1 and b-a >= 0.15]
    cue_t = []
    for k, c in enumerate(s):
        a_t = t_at(tau0 + (tau1-tau0)*acc/tot); acc += ws[k]; b_t = t_at(tau0 + (tau1-tau0)*acc/tot)
        # snap internal boundary to a nearby pause (stronger when the cue ends with a comma)
        if k < len(s)-1:
            tol = 0.7 if re.search(r'[,،;:—]\s*$', c['text']) else 0.3
            near = [(abs((a+b)/2-b_t), (a, b)) for a, b in inner_pauses if abs((a+b)/2-b_t) <= tol]
            if near: _, (pa, pb) = min(near); b_t = (pa+pb)/2
        cue_t.append([a_t, b_t])
    # make contiguous inside the sentence after snapping
    for k in range(1, len(cue_t)): cue_t[k][0] = cue_t[k-1][1]
    cue_t[0][0] = t0; cue_t[-1][1] = t1
    for k, c in enumerate(s):
        a_t, b_t = cue_t[k]
        out[c['i']] = [a_t, b_t]
        # word-level estimate inside the cue (speech-time proportional)
        ww = word_weights(c['text']); tw = sum(w for _, w in ww)
        ta, tb = sp_at(a_t), sp_at(b_t); accw = 0.0; lst = []
        for word, w in ww:
            lst.append([word, round(t_at(ta + (tb-ta)*accw/tw), 3), round(t_at(ta + (tb-ta)*(accw+w)/tw), 3)]); accw += w
        words[c['i']] = lst

# subtitle display times: appear slightly before the voice, stay until next cue (but clear in long pauses)
order = sorted(out)
disp = {}
for idx, ci in enumerate(order):
    a_t, b_t = out[ci]
    start = max(0.0, a_t - lead) if (idx == 0 or out[order[idx-1]][1] < a_t - 0.05 or True) else a_t
    nxt = out[order[idx+1]][0] - lead if idx+1 < len(order) else DUR
    end = min(nxt, b_t + 0.7) if nxt - b_t > 0.9 else nxt
    disp[ci] = [round(start, 3), round(max(end, start+0.4), 3)]
disp[order[0]][0] = 0.0
disp[order[-1]][1] = round(DUR, 3)
# ensure strictly non-overlapping
for a, b in zip(order, order[1:]):
    if disp[b][0] < disp[a][1]: disp[a][1] = disp[b][0]
# ---------- write ----------
def fm(t):
    ms = int(round(t*1000)); h, ms = divmod(ms, 3600000); mi, ms = divmod(ms, 60000); s_, ms = divmod(ms, 1000); return f'{h:02d}:{mi:02d}:{s_:02d},{ms:03d}'
with open('public/ottoman_36_sultans_bn_subtitles.aligned.srt', 'w', encoding='utf-8') as fo:
    for c in cues:
        a, b = disp[c['i']]; fo.write(f"{c['i']}\n{fm(a)} --> {fm(b)}\n{c['text']}\n\n")
json.dump({str(k): v for k, v in disp.items()}, open('src/data/cueTimes.json', 'w'))
json.dump({str(k): v for k, v in words.items()}, open('src/data/cueWords.json', 'w'), ensure_ascii=False)
# ---------- report ----------
shift = np.array([disp[c['i']][0]-c['s0'] for c in cues])
def rate_cv(starts):
    r = []
    for s in sent:
        a, b = starts[s[0]['i']][0], starts[s[-1]['i']][1]
        r.append((sp_at(b)-sp_at(a))/sum(weight(c['text']) for c in s))
    r = np.array(r); return float(r.std()/r.mean())
orig = {c['i']: [c['s0'], c['e0']] for c in cues}
rep = dict(audio_s=round(DUR, 3), speech_s=round(TOTAL_SPEECH, 1), threshold_db=round(float(T), 1), speech_segments=len(S), pauses=len(pauses),
           sentences=nS, cues=N, shift_mean_s=round(float(shift.mean()), 2), shift_max_abs_s=round(float(np.abs(shift).max()), 2),
           cues_shifted_gt1s=int((np.abs(shift) > 1).sum()), cues_shifted_gt2s=int((np.abs(shift) > 2).sum()),
           speech_rate_cv_original=round(rate_cv(orig), 3), speech_rate_cv_aligned=round(rate_cv({k: v for k, v in out.items()} and {c['i']: [out[c['i']][0], out[c['i']][1]] for c in cues}), 3))
# worst-fit sentences (aligned speech-time/weight vs global rate)
bad = []
for si, s in enumerate(sent):
    a, b = out[s[0]['i']][0], out[s[-1]['i']][1]
    ratio = (sp_at(b)-sp_at(a))/(R*Wsent[si]); 
    if abs(ratio-1) > 0.3: bad.append((si+1, round(a, 1), round(ratio, 2)))
rep['sentences_rate_off_gt30pct'] = len(bad); rep['worst_sentences'] = bad[:12]
os.makedirs('docs', exist_ok=True); json.dump(rep, open('docs/sync-report.json', 'w'), indent=1, ensure_ascii=False)
print(json.dumps(rep, indent=1, ensure_ascii=False))
