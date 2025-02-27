---
layout: page
icon: fas fa-info-circle
order: 4
---


<div style="text-align: center;">
  <img src="https://www.svgrepo.com/show/483652/hacker.svg" alt="Hacker Icon" width="150" height="150">
</div>

<div id="about-text"></div>

<script>
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
</script>
