<script>
(function(){
  const KEY = 'sv_cookie_prefs_v1'; // storage key (versioned)
  const has = () => JSON.parse(localStorage.getItem(KEY) || 'null');

  // Utilities
  function save(prefs){ localStorage.setItem(KEY, JSON.stringify(prefs)); }
  function removeBanner(){ const b = document.getElementById('cookie-banner'); if(b) b.remove(); }
  function showPanel(show){ document.getElementById('cookie-settings-panel').style.display = show ? 'flex' : 'none'; }

  // Conditionally load GA only if consented
  function loadAnalytics(){
    if (!document.documentElement.hasAttribute('data-analytics-loaded')) {
      document.documentElement.setAttribute('data-analytics-loaded','1');
      // GA4 loader – loads only after consent
      const gid = 'G-XXXXXXXXXX'; // TODO: replace when you add GA4 (or leave as-is to disable)
      if(!gid || gid === 'G-XXXXXXXXXX'){ return; } // no-op if not configured
      const s1 = document.createElement('script'); s1.async = true;
      s1.src = 'https://www.googletagmanager.com/gtag/js?id='+gid;
      document.head.appendChild(s1);
      const s2 = document.createElement('script');
      s2.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date()); gtag('config', '${gid}', { anonymize_ip: true });
      `;
      document.head.appendChild(s2);
    }
  }

  // Build banner HTML once
  function renderBanner(){
    if (document.getElementById('cookie-banner')) return;
    const div = document.createElement('div');
    div.id = 'cookie-banner';
    div.innerHTML = `
      <div class="inner">
        <p><strong>Cookies & analytics</strong> — We use essential cookies to run this site. With your permission, we may use analytics cookies to understand which pages are most useful. This site is information-only and not financial advice. See our <a href="privacy.html">Privacy Policy</a>.</p>
        <div class="actions">
          <button id="cookie-accept">Accept analytics</button>
          <button id="cookie-reject">Reject analytics</button>
          <button id="cookie-settings">Settings</button>
        </div>
      </div>
    `;
    document.body.appendChild(div);

    document.getElementById('cookie-accept').addEventListener('click', ()=>{
      save({necessary:true, analytics:true, date:new Date().toISOString()});
      removeBanner(); loadAnalytics();
    });
    document.getElementById('cookie-reject').addEventListener('click', ()=>{
      save({necessary:true, analytics:false, date:new Date().toISOString()});
      removeBanner();
    });
    document.getElementById('cookie-settings').addEventListener('click', ()=> showPanel(true));
  }

  // Build settings modal
  function renderSettings(){
    if (document.getElementById('cookie-settings-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'cookie-settings-panel';
    panel.innerHTML = `
      <div id="cookie-settings-card">
        <h3>Cookie settings</h3>
        <p>We always use essential cookies to make this website work. You can choose whether to allow analytics cookies.</p>
        <div>
          <label><input type="checkbox" checked disabled> Essential cookies (always on)</label>
          <label><input type="checkbox" id="opt-analytics"> Analytics cookies (optional)</label>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px;">
          <button id="cookie-save">Save choices</button>
          <button id="cookie-cancel" style="background:#eee; border:0; padding:10px 14px; border-radius:8px; cursor:pointer;">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Prefill from storage
    const prefs = has();
    if (prefs && typeof prefs.analytics === 'boolean') {
      document.getElementById('opt-analytics').checked = !!prefs.analytics;
    }

    document.getElementById('cookie-save').addEventListener('click', ()=>{
      const ok = document.getElementById('opt-analytics').checked;
      save({necessary:true, analytics:ok, date:new Date().toISOString()});
      showPanel(false);
      if (ok) loadAnalytics();
    });
    document.getElementById('cookie-cancel').addEventListener('click', ()=> showPanel(false));
  }

  // Footer "Manage cookies" link
  function hookManageLink(){
    const link = document.getElementById('manage-cookies');
    if (link) link.addEventListener('click', (e)=>{ e.preventDefault(); renderSettings(); showPanel(true); });
  }

  // Init
  window.addEventListener('DOMContentLoaded', ()=>{
    // Inject CSS if present
    const cssHref = (function(){
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      for (const l of links){ if (l.href.endsWith('cookie-consent.css')) return l.href; }
      return null;
    })();
    if (!cssHref){
      // Try to load cookie-consent.css automatically if you placed it in the root
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'cookie-consent.css';
      document.head.appendChild(link);
    }

    const prefs = has();
    hookManageLink();

    if (!prefs) {
      // No choice yet → show banner
      renderBanner(); renderSettings();
    } else {
      // Respect stored choice
      if (prefs.analytics) loadAnalytics();
    }
  });
})();
</script>
