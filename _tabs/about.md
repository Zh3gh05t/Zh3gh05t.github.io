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
  const text = `I am MAMA TOURE Ridiwane, a passionate cybersecurity 🔐 student who loves exploring, learning, and pushing my limits through challenges. Hacking, ethical security, and problem-solving fascinate me, and I am always looking for ways to improve my skills.  

I thrive on challenges, whether it’s solving Capture The Flag (CTF) problems, competitive programming, analyzing vulnerabilities, or developing creative tools. I enjoy learning from real-world scenarios and experimenting with new technologies to better understand the evolving landscape of cybersecurity.  

This space is where I share my journey, projects, and insights on cybersecurity, programming, and hacking. Feel free to explore and reach out if you share the same passion! 🌟`;

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
