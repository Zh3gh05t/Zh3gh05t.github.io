---
title: "Writeup of random crypto"
date: 2025-04-04
categories: [CTF,CRYPTO,Writeup]
tags: [cybersécurité, CTF, SMT, writeup]
---

Quand l’ennui me gagne, j’ai souvent besoin de m’occuper l’esprit — que ce soit en lisant ou en explorant quelque chose d’instructif, comme revisiter un ancien writeup pour apprendre de nouvelles approches.
Récemment, au fil de mes explorations, je suis tombé sur un site proposant un challenge en cryptographie. Cette fois, j’ai décidé de me lancer un vrai défi : le résoudre par moi-même, sans jeter un œil à la solution.
---

## Source code

```python
from Crypto.Util.number import bytes_to_long, getPrime, isPrime, long_to_bytes as ltb
with open("flag.txt", "r") as f:
    flag = f.read().encode()
assert(len(flag) == 48)

def gen_safe_prime():
    while True:
        p = getPrime(256)
        q = 2*p + 1
        if isPrime(q):
            return p, q

p, P = gen_safe_prime()
q, Q = gen_safe_prime()
r, R = gen_safe_prime()

N1 = p * Q
N2 = q * R 
N3 = r * P 

flag = flag[:16], flag[16:32], flag[32:]
m1, m2, m3 = map(bytes_to_long, flag)

c1 = pow(m1, e, N1)
c2 = pow(m2, e, N2)
c3 = pow(m3, e, N3)

print(f"N1 = {N1}")
print(f"N2 = {N2}")
print(f"N3 = {N3}")
print(f"c1 = {c1}")
print(f"c2 = {c2}")
print(f"c3 = {c3}")
```

---

## Analyse

De façon générale, le code divise un flag de 48 octets en trois parties et chiffre chaque partie indépendamment en utilisant le RSA classique. Jusque-là, rien d’extraordinaire.

Décomposons le script :
```python
c1 = pow(m1, e, N1)  # c1 = m^e mod N1
c2 = pow(m2, e, N2)  # c2 = m^e mod N2
c3 = pow(m3, e, N3)  # c3 = m^e mod N3
```

Aucun problème ne se pose si l’on parvient à retrouver les facteurs premiers de N1, N2, et N3.  
Mais hélas, c’est trop facile, et FactorDB ou d’autres outils ne nous seront d’aucune utilité ici.

Il m’est alors venu à l’esprit d’analyser la fonction **gen_safe_prime**.  
Décortiquons-la :

```python
def gen_safe_prime():
    while True:
        p = getPrime(256)
        q = 2*p + 1
        if isPrime(q):
            return p, q
```

Elle génère deux nombres premiers `p` et `q` tels que `q = 2*p + 1`.  
Mais je me suis demandé : à quoi cela peut-il m’aider ?  
À première vue, `p` et `q` sont très proches, ce qui peut s’avérer intéressant si un `N` est généré comme produit de ces deux nombres, car on pourrait alors utiliser la **factorisation de Fermat**.

Mais est-ce utile ici ? Voyons comment `N1`, `N2`, `N3` sont calculés :
```python
N1 = p * Q  # N1 = p * (2*q + 1)
N2 = q * R  # N2 = q * (2*r + 1)
N3 = r * P  # N3 = r * (2*p + 1)
```

Tenter de les factoriser serait voué à l’échec.  
Mais en regardant de plus près, on a un système d’équations à trois inconnues : `p`, `q`, `r`.

À ce stade, j’étais à moitié satisfait, car je ne savais pas comment résoudre ce genre de chose manuellement.  
Comment faire, alors, en programmation ?  

Avec un peu de recherche et de fouille, je suis tombé sur ce qu’on appelle les **SMT** (Satisfiability Modulo Theories).  
Globalement, ces outils permettent de vérifier la satisfiabilité de relations conditionnelles, comme des équations ou inéquations logiques ou arithmétiques.  
Je ferai un article complet sur ça plus tard. Mais bref, c’est ce solver que j’ai utilisé en Python pour retrouver `p`, `q`, et `r`.

---

## Solution

```python
from z3 import *

N1 = 12495068391856999800077002030530346154633251410701993364552383316643702466683773454456456597802923936206937481367758944533287430192110874917786936470363369
N2 = 8077707147198053886290544832343186898331956960638623080378558119874814319984246411074010515131637149736377313917292767376808884023937736055240325038442951
N3 = 10898848501176222929758568549735934974173617359760346224710269537956982757903808181573409877312658404512178685311838325609151823971632352375145906550988157
c1 = 11727185096615670493479944410151790761335959794363922757994065463882149941932060937572492050251349085994568934453243128190891922383731914525051578359318783
c2 = 2327979828535262192716931468063741561142276160684415064469817644730647222015445750643448615540518244828488228477943010970450757391003276726177736335376022
c3 = 4544692061471147250554940137677403449389851357903927336833646427737782533445020327768883285489907725322030741572216172954958842207101301502851102081477126

# Déclaration des variables entières p, q, r
p, q, r = Ints('p q r')

# Création du solveur
s = Solver()

# On impose que p, q, r soient strictement positifs
s.add(p > 0, q > 0, r > 0)

# Ajout des contraintes
s.add(p * (2*q + 1) == N1)
s.add(q * (2*r + 1) == N2)
s.add(r * (2*p + 1) == N3)

# Vérification de la satisfaisabilité
if s.check() == sat:
    m = s.model()
    p = m[p].as_long()
    q = m[q].as_long()
    r = m[r].as_long()
    P = 2*p + 1
    Q = 2*q + 1
    R = 2*r + 1
    e = 0x10001
    d1, d2, d3 = pow(e, -1, p-1), pow(e, -1, q-1), pow(e, -1, r-1)
    print(ltb(pow(c1, d1, p)) + ltb(pow(c2, d2, q)) + ltb(pow(c3, d3, r)))
else:
    print("Aucune solution trouvée.")
```

---

## Conclusion
Cela m’a beaucoup appris. C’est à travers la recherche de problèmes qu’on découvre de nouvelles choses.  
Le savoir est comme un aimant : il attire ceux qui se déplacent vers lui.
