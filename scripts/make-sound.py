"""Generates a small royalty-free sound kit (no external assets): ambient drone loop, whoosh, low impact, paper rustle.
All synthesised here with numpy; mixed far below the narration (see src/audio config)."""
import numpy as np, wave, os
SR=44100; out='public/audio'; os.makedirs(out,exist_ok=True)
def save(name,x,gain=0.9):
    x=x/np.max(np.abs(x))*gain; w=wave.open(f'{out}/{name}.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x*32767).astype('<i2').tobytes()); w.close()
rng=np.random.default_rng(7)
# 1) drone: 48 s seamless loop (all partials complete integer cycles over 48 s)
T=48; t=np.arange(T*SR)/SR; d=np.zeros_like(t)
for f,a in [(55,1.0),(82.5,0.55),(110,0.45),(164.5,0.25),(220,0.12)]:
    f=round(f*T)/T
    for det in (-0.07,0.0,0.07):
        ff=round((f+det)*T)/T; d+=a*np.sin(2*np.pi*ff*t+rng.uniform(0,6.28))
lfo=0.75+0.25*np.sin(2*np.pi*t/T*2); d*=lfo
save('drone',d,0.8)
# 2) whoosh 1.6 s
n=int(1.6*SR); x=rng.normal(size=n); env=np.sin(np.pi*np.linspace(0,1,n))**2
from numpy.fft import rfft,irfft
X=rfft(x); fr=np.linspace(0,1,len(X)); X*=np.exp(-((fr-0.12)/0.09)**2); save('whoosh',irfft(X)*env,0.8)
# 3) low impact 2.4 s
n=int(2.4*SR); t=np.arange(n)/SR; x=np.sin(2*np.pi*(48*np.exp(-t*0.8)+30)*t)*np.exp(-t*2.2)+0.15*rng.normal(size=n)*np.exp(-t*30)
save('impact',x,0.9)
# 4) paper rustle 1.1 s
n=int(1.1*SR); x=rng.normal(size=n)*(rng.random(n)>0.985)*1.0; x=np.convolve(x,np.hanning(40),'same')+0.05*rng.normal(size=n)
env=np.sin(np.pi*np.linspace(0,1,n))**1.5; save('paper',x*env,0.7)
print('ok')
