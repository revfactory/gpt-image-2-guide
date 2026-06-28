/* codex-image 프롬프트 가이드 — 인터랙션 (의존성 없음) */
(function(){
  "use strict";
  var root = document.documentElement;

  // ---- 테마 ----
  function applyTheme(t){ root.setAttribute("data-theme", t); try{localStorage.setItem("cig-theme",t);}catch(e){}
    var b=document.getElementById("themeBtn"); if(b) b.textContent = t==="dark" ? "☀️" : "🌙"; }
  var saved; try{ saved = localStorage.getItem("cig-theme"); }catch(e){}
  applyTheme(saved || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light"));
  document.addEventListener("click", function(e){
    if(e.target && e.target.id==="themeBtn"){ applyTheme(root.getAttribute("data-theme")==="dark"?"light":"dark"); }
  });

  // ---- 프롬프트 복사 ----
  document.addEventListener("click", function(e){
    var btn = e.target.closest && e.target.closest(".copy");
    if(!btn) return;
    var txt = btn.getAttribute("data-prompt") || "";
    var done = function(){ var o=btn.textContent; btn.textContent="✓ 복사됨"; setTimeout(function(){btn.textContent=o;},1300); };
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
    else { var ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(ta); done(); }
  });

  // ---- 라이트박스 ----
  var lb = document.getElementById("lb");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  document.addEventListener("click", function(e){
    var img = e.target;
    if(img.tagName==="IMG" && (img.closest(".shot")||img.closest(".compare")||img.classList.contains("zoom"))){
      lbImg.src = img.src;
      var p = img.getAttribute("data-prompt")||"";
      var l = img.getAttribute("data-label")||"";
      lbCap.innerHTML = (l?("<b>"+l+"</b>"):"") + (p?("<code>"+p.replace(/</g,"&lt;")+"</code>"):"");
      lb.classList.add("open");
    }
  });
  function closeLb(){ lb.classList.remove("open"); lbImg.src=""; }
  if(lb){ lb.addEventListener("click", function(e){ if(e.target===lb || e.target.id==="lbClose") closeLb(); }); }
  document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeLb(); });

  // ---- 검색(섹션/카드 필터) ----
  var search = document.getElementById("search");
  if(search){
    search.addEventListener("input", function(){
      var q = this.value.trim().toLowerCase();
      var sections = document.querySelectorAll("section.block[data-search]");
      sections.forEach(function(sec){
        var hay = sec.getAttribute("data-search").toLowerCase() + " " + sec.textContent.toLowerCase();
        var hit = !q || hay.indexOf(q) !== -1;
        sec.classList.toggle("hidden", !hit);
        var link = document.querySelector('nav.side a[href="#'+sec.id+'"]');
        if(link) link.classList.toggle("hidden", !hit);
      });
    });
  }

  // ---- 스크롤 스파이(네비 활성화) ----
  var links = Array.prototype.slice.call(document.querySelectorAll('nav.side a[href^="#"]'));
  var map = {};
  links.forEach(function(a){ var id=a.getAttribute("href").slice(1); var el=document.getElementById(id); if(el) map[id]=a; });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        links.forEach(function(a){a.classList.remove("active");});
        var a = map[en.target.id]; if(a){ a.classList.add("active"); }
      }
    });
  }, {rootMargin:"-40% 0px -55% 0px"});
  Object.keys(map).forEach(function(id){ var el=document.getElementById(id); if(el) spy.observe(el); });
})();
