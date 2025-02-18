---
layout: page
icon: fas fa-info-circle
order: 4
---

## Whoami <i class="fas fa-user-circle"></i> 🚀

<div id="about-text"></div>

<script>
  const text = `I'm a cybersecurity enthusiast 🔐 and an aspiring ethical hacker 🕵️‍♂️, constantly diving into the depths of the digital world 🌐 to uncover vulnerabilities, exploit weaknesses, and fortify systems 💪. My journey is driven by curiosity 🤓 and the relentless pursuit of knowledge 📚 in the ever-evolving realm of cybersecurity.

Whether it's tackling Capture The Flag (CTF) challenges 🎯, reverse engineering exploits 🧩, or building innovative security tools 🔧 from scratch, I'm always up for the next challenge. I thrive when I'm navigating through complex networks 🖧, cracking codes 🔓, and outsmarting adversaries 🧠—because that's how I level up my skills 🎮.

This space is my digital playground 🎮 where I document my hacking adventures 📝, dissect code 💻, and share my discoveries 🔍. From vulnerability assessments 🕵️‍♀️ to cutting-edge security techniques 🔒, expect to see some deep dives into the core of cybersecurity 🛡️, programming 💻, and ethical hacking ⚔️.

If you're a fellow hacker or security enthusiast, don't hesitate to connect 🔗—let's collaborate 🤝, learn 🧑‍🏫, and push the boundaries of what's possible! 🌟`;
  
  let i = 0;
  const speed = 10; // Adjust speed of typing

  function typeWriter() {
    if (i < text.length) {
      document.getElementById("about-text").innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed); // Recursively call the function
    }
  }

  typeWriter(); // Start typing effect
</script>
