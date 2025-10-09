<script>
  // ===========================
  // ✅ Cookie Banner + Tawk Loader (FCA/GDPR Safe)
  // ===========================
  const KEY_COOKIE = 'sv_cookie_choice';
  const banner = document.getElementById('cookieBanner');
  const accept = document.getElementById('cookieAccept');
  const reject = document.getElementById('cookieReject');

  function hideBanner(){ banner.style.display = 'none'; }
  function showBanner(){ banner.style.display = 'block'; }

  // Load Tawk.to only after consent
  function loadTawk(){
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
      var s1=document.createElement("script"),
          s0=document.getElementsByTagName("script")[0];
      s1.async=true;
      s1.src='https://embed.tawk.to/68de753d32ab2019572623eb/1j6ifjtsp';
      s1.charset='UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode.insertBefore(s1,s0);
    })();
  }

  (function setupCookieBanner(){
    try {
      const choice = localStorage.getItem(KEY_COOKIE);
      if(!choice){ showBanner(); } 
      else if(choice === 'accept'){ loadTawk(); }

      accept.addEventListener('click', ()=>{
        localStorage.setItem(KEY_COOKIE,'accept');
        loadTawk();
        hideBanner();
      });

      reject.addEventListener('click', ()=>{
        localStorage.setItem(KEY_COOKIE,'reject');
        hideBanner();
      });
    } catch(e){
      showBanner();
    }
  })();
</script>
