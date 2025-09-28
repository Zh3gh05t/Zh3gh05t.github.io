---
layout: page
icon: fas fa-info-circle
order: 4
---

<div style="text-align: center;">
  <!-- <img src="https://www.svgrepo.com/show/483652/hacker.svg" alt="Hacker Icon" width="150" height="150">  -->
  <img src="/assets/Images/profil2.jpeg" alt="Hacker Icon" width="150" height="150">
<blockquote style="font-style: italic; border-left: 0px solid #ccc; padding-left: 16px; margin: 20px 0; color: #444;">
  "Ceux qui ne comprennent rien ne me verront que comme un criminel."
  <footer style="margin-top: 8px; font-weight: bold;">&mdash; Itachi Uchiwa</footer>
</blockquote>
</div>



<!-- 🎧 Lecteur Audio -->
<div style="text-align:center; margin-top:20px;">
  <audio id="lecteur" controls style="width: 80%;">
    Votre navigateur ne supporte pas l'audio HTML5.
  </audio>
</div>

<!-- 🧠 Texte About en typing -->
<div id="about-text" style="margin-top: 30px;"></div>

<script>
window.addEventListener("load", function () {
  const playlist = [
    "{{ '/assets/audios/voice.m4a' | relative_url }}",
    "{{ '/assets/audios/unravel.m4a' | relative_url }}"
  ];

  let index = 0;
  const audio = document.getElementById("lecteur");
  audio.src = playlist[index];
  audio.volume = 0.8;

  document.body.addEventListener("click", () => {
    audio.play();
  }, { once: true });

  audio.addEventListener("ended", () => {
    index = (index + 1) % playlist.length;
    audio.src = playlist[index];
    audio.play();
  });

  const text = `Je suis Zh3gh05t, un étudiant en cybersécurité 🔐 passionné par l'exploration, l'apprentissage et le dépassement de soi à travers les défis. Le hacking, la sécurité éthique et la résolution de problèmes me fascinent, et j'aime toujours apprendre de nouvelles choses pour progresser.

J'aime relever des défis comme les problèmes de Capture The Flag (CTF) surtout les challenges en cryptographie , web, binary exploitation , la programmation compétitive, l'analyse de vulnérabilités ou la création d'outils innovants.

À part ça, je reste un mec chill , honnête et sympa. Ici, je partage mon parcours, mes projets et mes réflexions sur la cybersécurité, la programmation et le hacking. N'hésite pas à explorer et à me contacter si tu partages la même passion ! 🌟`;
  let i = 0;
  const speed = 15;
  function typeWriter() {
    if (i < text.length) {
      document.getElementById("about-text").innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
});
</script>
