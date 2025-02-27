---
title: "Writeups Crypto for NothHackingday Tetouan"
date: 2025-02-25
categories: [CTF, Writeup]
tags: [cybersécurité, CTF, hacking, writeup]
---
  
Dans ce writeup, je vais expliquer comment resoudre tous les challenges crypto tout en passant par l'analyse du code source jusqu'a l'exploitation

---

## RSOUU

```python
from Crypto.Util.number import getPrime, bytes_to_long,GCD
from gmpy2 import next_prime
import random
from SECRET import FLAG,BITS
from math import prod

assert BITS==1024
seed=getPrime(BITS)
def  customPrime(b):
    prime=seed
    for _ in range( len(BITS*'_')):prime=next_prime(prime)
    return prime

p,q=seed,customPrime(BITS)
n=p*q
phi=(p-1)*(q-1)
values=[0x10001,0x1000f]
c=bytes_to_long(FLAG)
for _ in range(10):
    e=values[random.randint(0,1)]
    c=pow(c,e,n)

print(f"c={c}")

print(f"n={n}")

```

### Analyse
Manifestement nous avons un RSA clasique multi encryption.
le code nous donne la valeur du modulus **n** et le cipher **c**.
la faiblesse de rsa reside dans le fait que n soit difficile a  factoriser c'est a dire trouver la valeur de **p** et **q**.  
un outil en ligne tel que [factordb](http://www.factordb.com/) nous serait d'aucune utilite si **n** n'as pas deja ete factorise au paravant.  
d'apres le code y'a un hint ,la fonction **CustomPrime**.Elle genere le p, et le q ,tel que q soit le 1024 nombre premier apres p.Ce qui nous laisse a croire que p et q sont trop proches.
Donc on pourrait dans ce cas tenter la factorisation de *Fermat* (fonctionne seulement au cas ou p,q sont assez proches).  

Cependant c'est pas fini ,si nous analysons comment le flag est chiffré, c'est un truc assez nouveau.le RSA classique est simple  
$$ c \equiv m^e\mod n $$

ici nous avons dix niveaux de chiffrement ,a chaque iteration m est chiffre soit avec **e1=0x1001** soit **e2=0x1000f**.donc de façon aleatoire cela resemble a ca:
$$ c \equiv  m^{e1e2e2...e1} \mod n $$

donc il suffit de lister toutes les 2¹⁰ possibilites pour trouver la clé publique.

### solution 
```python
from Crypto.Util.number import *
from itertools import product
import gmpy2
from math import prod

def fermat_factor(n):
    assert n % 2 != 0
    a = gmpy2.isqrt(n)
    b2 = gmpy2.square(a) - n
    while not gmpy2.is_square(b2):
        a += 1
        b2 = gmpy2.square(a) - n
    p = a + gmpy2.isqrt(b2)
    q = a - gmpy2.isqrt(b2)
    return int(p), int(q)
c=20456687484717544625313507609366490203275462805201082493192199815230436961177264954866948007422800205777065622186962792676217307022223739385630549832734336914980506330583166500435056537957045161311239170779454116526768632530226146952708998300307171642289453623507392646974501129496637943587902833273575848035618186959820064922651851691166530937661469620980881061859633438829321295968194396451278949315896074356456092013002179103274167170571957146663917852344607438306071979481230596371008331744342258226350910529238589941370025410713751220152916176909844565302728288600709731997922301919628725743575977375829366640914
n=21549384233337918033927241494401411808381196931703435037744645694509049072015850791287241379850257981995420379915087171885551973622998839883731504653194225756633127575644520171042817082791749614512197046910293717320394451184723342361335232079982083801253487673676697687221056613649915379719695784667558717040003806445684246137253374852279169223498840569035232840756353204790453714335575466397543572341571915780666146100041122079636260703456489229463290447087913303509840274180121799988027112356178607664528124825670781886013486660618412902714887567070773932844305786249601051615325149836408162395660085324273214927847

values=[0x10001,0x1000f]
p,q=fermat_factor(n)
assert p*q==n
phi=(p-1)*(q-1)
e_values={prod(x) for x in list(product(values,repeat=10))}
for e in e_values:
    try:
        d=pow(e,-1,phi)
        flag=long_to_bytes(pow(c,d,n)).decode('utf-8')
        print(flag)
        break
    except: continue
```
on trouve le flag: `NHD{H0ll4_m4dr1d1st4_h4ll4_m4dr1d}`


---

## NOISE
```python
from Crypto.Util.number import getPrime,bytes_to_long,GCD
import random
from SECRET import flag
m=bytes_to_long(flag)
p,q=getPrime(1024),getPrime(1024)
n=p*q
phi=(p-1)*(q-1)
e,f=0x1001,0x100f
d=pow(f,-1,phi)
print(f"D={d+random.getrandbits(8)}")
c=pow(m,e,n)
print(f"c={c}")
print(f"n={n}")
```

## Analyse

- le flag est converti en entier `m`
- on genere un RSA avec deux exposants:
    - `e=0x1001` (4097) utilise pour chiffre le message
    - `f=0x100f` (4111) 
- ensuite on calcule $$ d \equiv f^{-1} \mod phi$$ , puis on affiche `D=d+r` ou r est un nombre aleatoire de 8bits donc `r ∈ [0, 255]`.

comme d'habitude pour retrouver m,on suit ces etaphes:
- factoriser `n` 
- recalculer `phi`
- trouver la cle privé $$ d \equiv e^{-1} \mod phi$$

Est ce possible de retrouver `phi` sans calculer n, si oui comment?
revenons aux sources pour comprendre la magie derriere RSA et voir comment le dechiffrement s'opere.
on a:
On part de la formule de chiffrement RSA :  
```
C ≡ m^e (mod n)
```
où `C` est le message chiffré, `m` le message original, `e` l'exposant public, et `n` le module.
Si `d` est la clé privée, alors :  
```
C^d ≡ m^(e * d) (mod n)
```
En utilisant la propriété RSA :  
```
e * d - 1 = k * φ(n)
```
où `k` est un entier quelconque, on peut réécrire :  
```
C^d ≡ m^(k * φ(n) + 1) (mod n)
```
En utilisant les propriétés des congruences :  
```
C^d ≡ (m (mod n) * m^(k * φ(n)) (mod n)) (mod n)
```

D'après le petit théorème de Fermat :  
```
m^φ(n) ≡ 1 (mod n)
```
Cela implique :  
```
m^(k * φ(n)) ≡ 1 (mod n)
```
On en déduit que :  
```
C^d ≡ m (mod n)
```
Pour retrouver `m`, il n'est donc pas nécessaire de factoriser `n`, mais plutôt de trouver un multiple de `φ(n)`.  

Il est aussi intéressant de noter que si l'on trouve un `d'` tel que :  
```
e * d' - 1 = k' * (k * φ(n))
```
La relation reste valide !  

Autrement dit, au lieu de chercher un unique `d` tel que :  
```
d ≡ e⁻¹ (mod φ(n))
```
On peut utiliser un autre `d'` vérifiant :  
```
d' ≡ e⁻¹ (mod (k * φ(n)))
``` 
La clé privée RSA n'est donc pas unique, ouvrant la porte à des alternatives pour la génération ou la recherche de la clé privée.

une fois compris voyons comment dechiffre `c`
- on connait `c` , `n` , `D`
- retrouver `d=D-r` pour `r ∈ [0, 255]`
- calculer un multiple de phi : `f*d-1 = k*phi`

- trouver un $$d_e$$ : $$d_e \equiv e^{-1} \mod (k*phi).$$

### solution
```python

from Crypto.Util.number import *

D=77485167556926449864854498812087025494223695205588991420574407469822845971224551368376587380102957497725807498013811830767234365829421129694534183156358028822437502038763032736354236453694312935287417107818109157216069348753204125922948580679100268715626045339934405193889240338879239878095031414294595797420399622048280703846593576162147256541039940869153948115423799362521809263234803958547851228608230254041472394945090265930057643814418992796092280508145131003390319545226948006490153006883621504950497767212005090311152777934737364314582553383304745816883041495172792225512453934198371010146833853210806470780
c=5185513932123750114003482503955330011709866216449395349113845956132466509277048859118152508218883061695704491415754627359865093854059755082669252486594514900448185215924067384557434351303359983385839462309064609839247492136631488698232483025628944697724194630118225282861097664728205815818262846678957715259137361830751836731343765450694193276888817128786746225732422079475026367091609051646357548314626684675052768800317661292721605907257755520638658856859506754471581311616376362255635468961480388638800615997011227987655528589476061220470479887918919912609733070518273242724703473477526974598618614552752650059432
n=11376482993804451264086315879160348635955486106792012276070763896730061420989433238407005382842973509755385522297670729867289302783026795149079643819849566303180020388619815270684009502183475731320234704651437383761259324740157934345330057684706471596069238299731083562574238108326162683530309790863038690114330368965288395236367397353403062094129844003226460107015719671049822721950410649273795269818531982574457689334590499631535584682550729551847311462064795964344905919483286902560907210682741234495891726503812296533596021515189272739463998966303364216083176994486127847203664263825050514154896592259538173287237
e,f=0x1001,0x100f
for i in range(0,255):
    try:
        d=pow(e,-1,(D-i)*f-1)
        flag=long_to_bytes(pow(c,d,n))
        print(flag.decode('utf-8'))
        break
    except:pass
```
on retrouve le flag : `NHD{Cr7_1s_b3tt3r_th4n_m3ss1_suuuu}`

## Matrix RSA
```python
from secret_matrix import SECRET_MATRIX
import numpy as np
from Crypto.Util.number import getPrime
def encrypt_flag(flag):
    pad_len = (3 - (len(flag) % 3)) % 3
    padded = flag + '\x00' * pad_len
    matrix = np.array([ord(c) for c in padded], dtype=np.int64).reshape(-1, 3)
    secret_matrix = SECRET_MATRIX.astype(np.int64)
    encrypted = np.dot(matrix, secret_matrix) % 256  
    return encrypted.astype(np.uint8).flatten().tobytes()

def rsa_encrypt_matrix():
    p = getPrime(60)
    q = getPrime(60)
    N = p * q
    e = 65537
    
    encrypted = [pow(int(x), e, N) for x in SECRET_MATRIX.flatten()]

    return N, e, encrypted

if __name__ == "__main__":
    with open("challenge\\flag.txt", "r") as f:
        flag = f.read().strip()
    
    flag_ciphertext = encrypt_flag(flag)
    N, e, rsa_matrix = rsa_encrypt_matrix()
    
    with open("output.txt", "wb") as f:
        f.write(flag_ciphertext.hex().encode())
        f.write(f"\n\nRSA_N={N}\nRSA_e={e}\nMATRIX=".encode())
        f.write(','.join(map(str, rsa_matrix)).encode())
```
### Analyse
Je ne sais pas comment le créateur a eu cette idée de combiner l'algèbre linéaire avec du RSA, mais c'est quand même génial.  
Voyons voir :

- Une fonction **rsa_encrypt_matrix** qui apparemment chiffre une matrice secrète et renvoie le chiffre (`cipher`) ainsi que la clé publique `N`, `e`.
- La fonction **encrypt_flag** fait simplement le produit scalaire de **SECRET_MATRIX** avec le **flag** et renvoie son `CIPHER`.
    - `[FLAG] * [SECRET_MATRIX] = [CIPHER]`
    - Pour retrouver le `FLAG`, il suffit d'inverser `[SECRET_MATRIX]` :
    - `[FLAG] = [CIPHER] * [SECRET_MATRIX]⁻¹`
- Le problème qui reste est de savoir comment retrouver `SECRET_MATRIX`, puisqu'elle est chiffrée avec du RSA.
- Un point intéressant : les valeurs de `p` et `q` sont très petites (60 bits). On peut utiliser `sympy` de Python `factor` en ligne de commande  ou simplement [factordb](http://www.factordb.com/) pour factoriser `N`, ce qui permet de retrouver `p`, `q` et donc `d`.

### Solution
```python
from Crypto.Util.number import inverse
import numpy as np
p = 123456789101112109
q = 123456789101112167
N = 15241578775156480783033428450930203
e = 65537
phi = (p-1) * (q-1)
d = inverse(e, phi)
rsa_encrypted = [
    11791464256267140990777504562540600,
    7219134406778211662973003900210694,
    1399894760414228088825466709461522,
    1399894760414228088825466709461522,
    2490109280310724176411854803797731,
    4537521947095011276109162778417834,
    7219134406778211662973003900210694,
    14414456528926267106295884874449739,
    4537521947095011276109162778417834
]
secret_entries = [pow(c, d, N) for c in rsa_encrypted]
SECRET_MATRIX = np.array(secret_entries, dtype=np.int64).reshape(3,3)
mod = 256
det = int(round(np.linalg.det(SECRET_MATRIX)))
det_mod = det % mod
det_inv = inverse(det_mod, mod)
adj = np.zeros((3,3), dtype=int)
for i in range(3):
    for j in range(3):
        minor = np.delete(np.delete(SECRET_MATRIX, i, axis=0), j, axis=1)
        cofactor = ((-1)**(i+j)) * int(round(np.linalg.det(minor)))
        adj[j][i] = cofactor % mod
M_inv = (det_inv * adj) % mod
flag_ct_hex = "0be7c99c7302c426fc775e813bcaeeeb04e09fee1cdb0dd7cb099a5d7e0b25069154aa69"
flag_ct = bytes.fromhex(flag_ct_hex)
blocks = [flag_ct[i:i+3] for i in range(0, len(flag_ct), 3)]
plaintext = ""
for block in blocks:
    vec = np.array(list(block), dtype=int)
    dec_vec = (np.dot(vec, M_inv) % mod).astype(int)
    plaintext += "".join(chr(x) for x in dec_vec)
flag = plaintext.rstrip('\x00')
print(flag)

```
`Flag: NHD{linear_algebra_meets_rsa}`

---

## SP33DGAME
```python
from Crypto.Util.number import *
import random
from SECRET import *
import time

p=getPrime(351)
seed = random.randint(p // 4, p)
print(banner)
print(f"p: {p}")
print(f"seed:  {seed}")
bin_Flag=bin(bytes_to_long(FLAG))[2:]
for _  in bin_Flag:
    seed = pow(seed,2,p)
    h = 2 * random.getrandbits(351) + 1
    blue = pow(seed, h, p)
    red = pow(-seed, h, p)
    print("\nGive me red pill")
    random.shuffle(tmp := [blue, red])
    print(*tmp,sep='\n')
    init = time.time()
    answ = input(">>>")
    if time.time() - init > 60:
        print("Boboch sra3 mnk khouya hhhhh")  
        exit()
    try:
        if int(answ) != red:
            print("You don't wanna know the truth, stay in your matrix.")
            exit()
        else:
            print(_)
    except: exit()
```

### Analyse
- genere un nombre premier aleatoire `p` de 351 bits
- genere un seed tel que `seed ∈ [p//4, p]`
- convertis le flag au format binaire
- pour chaque iteration :
    - $$ blue \equiv seed^{2*h} \mod p $$
    -  $$ red \equiv -seed^{2*h} \mod p $$
    - red,blue est renvoyé de façon aleatoire a l'utilisateur
si l'utilisateur devinne le red alors un bit du flag lui est revélé.
La solution de ce probleme est de trouver un moyen unique de verifier lequel des deux valeurs est le red.
remarquons que:
`blue ≡ (seed^h)^2 mod p`
 donc ,blue est un **residu quadratic**.
En utilisant **la formule de legendre** on peut verifier si un nombre est un residu quadratic ou pas.
on peut remarquer que `red ≡ -blue mod p`.
D'après le symbole de Legendre :  

- `blue^(p-1)/2 ≡ 1 mod p ` 
- `(-red)^(p-1)/2 ≡ 1 mod p  `

D'ici, il y a deux cas :  
- Si (p-1)/2 est pair, c'est-à-dire `p ≡ 1 mod 4`,  
  alors `red^(p-1)/2 ≡ 1 mod p`, donc red est aussi un **quadratic residu**.  
- Sinon, si (p-1)/2 est impair, c'est-à-dire `p ≡ 3 mod 4`,  
  alors `red^(p-1)/2 ≡ -1 mod p`, donc red est alors **non quadratic** et c'est ça notre hint.  

Il suffit de forcer le serveur à nous renvoyer un p tel que :  
`p ≡ 3 mod 4` et la magie s'opère.
## solution
```python
from pwn import *
from Crypto.Util.number import *

context.log_level = 'debug'
FLAG = ""

while True:
    conn = remote('localhost', 5551)
    conn.recvuntil(b'p: ')
    p = int(conn.recvline().decode())

    if p % 4 == 3:
        legendre = lambda a: pow(a, (p - 1) // 2, p) == 1

        while True:
            try:
                conn.recvuntil(b'red pill')
                conn.recvline()
                r = int(conn.recvline().decode())
                b = int(conn.recvline().decode())
                conn.recv()

                if legendre(r):
                    conn.sendline(str(b).encode())
                else:
                    conn.sendline(str(r).encode())

                f = conn.recvline().decode().strip()
                FLAG += f
                # print(FLAG)

            except:
                conn.close()
                m = int(FLAG, 2)
                print(long_to_bytes(m))
                exit()
    else:
        conn.close()
```
flag: `NHD{th15_15_7h3_r34l17y_7h3_d0n7_w4n7_y0u_70_know}`




