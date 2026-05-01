// ========== ROUTING & STATE ==========
let currentPage='home';
let currentFilter='All';
let searchQuery='';
let showCount=12;

function navigateTo(page,id){
  if(page==='explore'&&id){currentPage='explore';renderExplorePage(id)}
  else{currentPage='home';renderHomePage()}
  window.scrollTo({top:0,behavior:'smooth'});
}

// ========== NAVBAR ==========
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open')}
function closeMenu(){document.getElementById('navLinks').classList.remove('open')}
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  nav.classList.toggle('scrolled',window.scrollY>50);
});

// ========== HELPER: Build destination dropdown options ==========
function buildDestOptions(){
  const india=destinations.filter(d=>d.country==='India').sort((a,b)=>getDestLabel(a).localeCompare(getDestLabel(b)));
  const intl=destinations.filter(d=>d.country!=='India').sort((a,b)=>a.name.localeCompare(b.name));
  const countries=[...new Set(intl.map(d=>d.country))].sort();
  let html='<option value="">Select a destination...</option>';
  html+='<optgroup label="🇮🇳 India">';
  india.forEach(d=>{html+='<option value="'+d.id+'">'+getDestLabel(d)+'</option>'});
  html+='</optgroup>';
  countries.forEach(c=>{
    const list=intl.filter(d=>d.country===c);
    html+='<optgroup label="'+c+'">';
    list.forEach(d=>{html+='<option value="'+d.id+'">'+d.name+'</option>'});
    html+='</optgroup>';
  });
  return html;
}

// ========== RENDER HOME ==========
function renderHomePage(){
  const app=document.getElementById('app');
  document.getElementById('navbar').querySelector('.nav-links').style.display='';
  app.innerHTML=`
  <!-- Hero -->
  <section class="hero" id="hero">
    <div class="hero-content">
      <span class="hero-label">⭐ AI-POWERED TRAVEL PLANNING FOR INDIA</span>
      <h1>Discover the<br>World<br>with <span class="gold">SkyRoute</span></h1>
      <p class="hero-subtitle">Personalised trips, real INR budgets, and AI-curated experiences across 50+ breathtaking destinations worldwide.</p>
      <div class="hero-search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Where do you want to go? Try 'Bali' or 'Jaipur'..." id="heroSearch" onkeyup="heroSearchHandler(this.value)">
        <button onclick="document.getElementById('destinations').scrollIntoView({behavior:'smooth'})">Explore →</button>
      </div>
      <div class="hero-chips">
        ${[
          {flag:'🏙',name:'Dubai'},{flag:'🌴',name:'Bali'},{flag:'🗼',name:'Paris'},
          {flag:'🏖',name:'Goa'},{flag:'🏔',name:'Manali'},{flag:'🗾',name:'Tokyo'},
          {flag:'🏛',name:'Jaipur'},{flag:'🏝',name:'Maldives'}
        ].map(c=>'<span class="hero-chip" onclick="heroSearchHandler(\''+c.name+'\')">'+c.flag+' '+c.name+'</span>').join('')}
      </div>
    </div>
    <div class="hero-stats-bar">
      <div class="hero-stat"><h3>50+</h3><p>DESTINATIONS</p></div>
      <div class="hero-stat"><h3>50K+</h3><p>HAPPY TRAVELERS</p></div>
      <div class="hero-stat"><h3>4.9★</h3><p>AVG RATING</p></div>
      <div class="hero-stat"><h3>24/7</h3><p>AI SUPPORT</p></div>
      <div class="hero-scroll-hint">SCROLL TO EXPLORE ↓</div>
    </div>
    <div class="hero-ticker">
      <div class="ticker-track">
        ${['BALI 🌴','MALDIVES 🏝','MANALI 🏔','SINGAPORE 🏙','BANGKOK 🏯','GOA 🏖','TOKYO 🗼','NEW YORK 🗽','JAIPUR 🏛','LONDON 🎡','SANTORINI 🌅','VARANASI 🕉','KYOTO 🎎','DUBAI 🏗','PARIS 🗼','UDAIPUR 🏰','ROME 🏛','BALI 🌴','MALDIVES 🏝','MANALI 🏔','SINGAPORE 🏙','BANGKOK 🏯','GOA 🏖','TOKYO 🗼','NEW YORK 🗽','JAIPUR 🏛','LONDON 🎡','SANTORINI 🌅','VARANASI 🕉','KYOTO 🎎','DUBAI 🏗','PARIS 🗼','UDAIPUR 🏰','ROME 🏛'].map(t=>'<span class="ticker-item">'+t+'</span>').join(' · ')}
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section animate" id="features">
    <div class="section-header">
      <p class="section-label">Why Choose Us</p>
      <h2>Smart Travel, Simplified</h2>
      <p>Experience the future of travel planning with AI-powered recommendations</p>
    </div>
    <div class="features-grid">
      ${[
        {icon:'🤖',title:'AI Itinerary Builder',desc:'Get personalized day-by-day plans based on your preferences, budget, and travel style.'},
        {icon:'🗺',title:'60+ Destinations',desc:"Curated collection of the world's most breathtaking places, from hidden gems to iconic landmarks."},
        {icon:'💰',title:'Budget Optimizer',desc:'Smart budget breakdowns and cost-saving tips for every destination and travel style.'},
        {icon:'🌤',title:'Weather Insights',desc:'Real-time weather data and best-time-to-visit recommendations for perfect timing.'},
        {icon:'🏨',title:'Stay Suggestions',desc:'Handpicked accommodation recommendations from budget hostels to luxury resorts.'},
        {icon:'📱',title:'Mobile Friendly',desc:'Plan on the go with our fully responsive design that works beautifully on any device.'}
      ].map(f=>'<div class="feature-card animate"><div class="feature-icon">'+f.icon+'</div><h3>'+f.title+'</h3><p>'+f.desc+'</p></div>').join('')}
    </div>
  </section>

  <!-- Destinations -->
  <section class="section" id="destinations">
    <div class="section-header animate">
      <p class="section-label">Explore the World</p>
      <h2>Popular Destinations</h2>
      <p>Discover handpicked destinations across India and the world</p>
    </div>
    <div class="dest-controls animate">
      <input class="search-input" type="text" placeholder="Search destinations..." id="destSearch" oninput="filterDestinations()">
      ${['All','India','International','Mountains','Beaches','Heritage','Luxury','Adventure','Budget','Cultural'].map(f=>'<button class="filter-btn'+(f==='All'?' active':'')+'" onclick="setFilter(\''+f+'\')">'+f+'</button>').join('')}
    </div>
    <div class="dest-grid" id="destGrid"></div>
    <button class="show-more-btn" id="showMoreBtn" onclick="showMore()">Show More Destinations</button>
  </section>

  <!-- Inspiration -->
  <section class="section animate" id="inspiration">
    <div class="section-header">
      <p class="section-label">Get Inspired</p>
      <h2>Travel Inspiration</h2>
      <p>Visual stories from around the world</p>
    </div>
    <div class="bento-grid">
      ${[
        {img:'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',title:'Tropical Paradise',sub:'Escape to beaches'},
        {img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',title:'Mountain Highs',sub:'Reach the peaks'},
        {img:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',title:'Ancient Culture',sub:'Explore heritage'},
        {img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',title:'Urban Adventures',sub:'City wonders'},
        {img:'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',title:'Wild Nature',sub:'Into the wild'}
      ].map(b=>'<div class="bento-item"><img src="'+b.img+'" alt="'+b.title+'" loading="lazy" onerror="this.onerror=null; this.src=\'images/default-dest.png\';"><div class="bento-overlay"><div><h3>'+b.title+'</h3><p>'+b.sub+'</p></div></div></div>').join('')}
    </div>
  </section>

  <!-- Planner -->
  <section id="planner">
    <div class="planner-section">
      <div class="planner-header animate">
        <h2>Plan Your <span class="gold-italic">Dream Trip</span></h2>
        <p>Fill in your preferences — our AI generates a personalised itinerary with real budget breakdown <span class="gold-link">instantly</span>.</p>
      </div>
      <div class="planner-card animate">
        <form class="planner-form" id="plannerForm" onsubmit="generatePlan(event)">
          <div class="form-group">
            <label class="form-label">📍 DESTINATION</label>
            <select id="planDest" required>${buildDestOptions()}</select>
          </div>
          <div class="form-group">
            <label class="form-label">👥 NUMBER OF TRAVELERS</label>
            <input type="number" id="planTravelers" placeholder="2" min="1" max="20" required>
          </div>
          <div class="form-group">
            <label class="form-label">📅 DEPARTURE DATE</label>
            <input type="date" id="planDate" required>
          </div>
          <div class="form-group">
            <label class="form-label">⏱ DURATION (DAYS)</label>
            <input type="number" id="planDays" placeholder="5" min="1" max="30" required>
          </div>
          <div class="form-group">
            <label class="form-label">💰 BUDGET RANGE</label>
            <select id="planBudget">${budgetOptions.map(b=>'<option value="'+b.value+'">'+b.label+'</option>').join('')}</select>
          </div>
          <div class="form-group">
            <label class="form-label">🎯 TRAVEL STYLE</label>
            <select id="planStyle">${travelStyles.map(s=>'<option value="'+s+'">'+s+'</option>').join('')}</select>
          </div>
          <div class="form-group full">
            <label class="form-label">✏️ SPECIAL REQUESTS (OPTIONAL)</label>
            <textarea id="planRequests" placeholder="Dietary needs, must-see sights, honeymoon setup, accessibility needs, vegetarian food, Hindi-speaking guide..."></textarea>
          </div>
          <button type="submit" class="planner-submit-btn">✨ Generate My Personalised Itinerary</button>
        </form>
      </div>
      <div class="planner-result" id="plannerResult"></div>
    </div>
  </section>

  <!-- Tips -->
  <section class="section animate" id="tips">
    <div class="section-header">
      <p class="section-label">Travel Smart</p>
      <h2>Essential Travel Tips</h2>
      <p>Expert advice to make your journey smoother</p>
    </div>
    <div class="tips-grid">
      ${[
        {title:'📋 Pack Light',desc:'Roll your clothes, use packing cubes, and stick to a capsule wardrobe. A carry-on is your best friend for flexibility.'},
        {title:'💳 Money Matters',desc:'Always carry some local currency. Use travel-friendly cards with no forex markup. Inform your bank before traveling abroad.'},
        {title:'🛡 Stay Safe',desc:"Keep digital copies of documents. Share your itinerary with family. Get travel insurance — it's non-negotiable."},
        {title:'📱 Stay Connected',desc:'Download offline maps. Get a local SIM or eSIM. Save emergency numbers for your destination.'},
        {title:'🍜 Eat Local',desc:'Skip tourist restaurants. Eat where locals eat. Street food is often the most authentic and affordable option.'},
        {title:'🌍 Be Respectful',desc:'Learn basic greetings in the local language. Dress appropriately at religious sites. Follow local customs and traditions.'}
      ].map(t=>'<div class="tip-card animate"><h3>'+t.title+'</h3><p>'+t.desc+'</p></div>').join('')}
    </div>
  </section>

  <!-- About -->
  <section class="section animate" id="about">
    <div class="about-content">
      <div class="about-text">
        <p class="section-label">About SkyRoute</p>
        <h2>Your AI Travel Companion</h2>
        <p>SkyRoute combines artificial intelligence with deep travel expertise to create personalized itineraries that match your unique travel style, budget, and interests.</p>
        <p>Founded by passionate travelers who believe that the best trips are well-planned ones. Our AI analyzes thousands of data points to recommend the perfect destinations, accommodations, and experiences just for you.</p>
        <a class="btn-primary" href="#planner">Start Planning →</a>
      </div>
      <div class="about-img">
        <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800" alt="Travel" loading="lazy">
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="section animate" id="contact">
    <div class="section-header">
      <p class="section-label">Get In Touch</p>
      <h2>Contact Us</h2>
      <p>Have questions? We'd love to hear from you</p>
    </div>
    <div class="contact-wrap">
      <div class="contact-info">
        <h3>Let's Connect</h3>
        <p>📍 Panipat, Haryana, India</p>
        <p>📧 <a href="mailto:pushparani10290@gmail.com">pushparani10290@gmail.com</a></p>
        <p>🕐 Mon-Sat, 9AM - 7PM IST</p>
        <p style="margin-top:20px;line-height:1.7">Whether you need help planning your dream vacation or have feedback about our platform, our team is here to assist you every step of the way.</p>
      </div>
      <form class="contact-form" onsubmit="event.preventDefault();alert('Thank you! We will get back to you soon.')">
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <h3>✈ SkyRoute</h3>
        <p>Your AI-powered travel companion. Discover, plan, and explore the world's most beautiful destinations with personalized itineraries.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <p><a href="#features">Features</a></p>
        <p><a href="#destinations">Destinations</a></p>
        <p><a href="#planner">Trip Planner</a></p>
        <p><a href="#tips">Travel Tips</a></p>
      </div>
      <div>
        <h3>Categories</h3>
        <p><a href="#" onclick="chipFilter('Mountains')">Mountains</a></p>
        <p><a href="#" onclick="chipFilter('Beaches')">Beaches</a></p>
        <p><a href="#" onclick="chipFilter('Heritage')">Heritage</a></p>
        <p><a href="#" onclick="chipFilter('Luxury')">Luxury</a></p>
      </div>
      <div>
        <h3>Follow Us</h3>
        <p><a href="#">Instagram</a></p>
        <p><a href="#">Twitter</a></p>
        <p><a href="#">Facebook</a></p>
        <p><a href="#">YouTube</a></p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>📧 <a href="mailto:pushparani10290@gmail.com">pushparani10290@gmail.com</a></p>
      <p>This website is created by Pushpa, student at Geeta University, Panipat, Haryana.</p>
      <p>© 2025 SkyRoute. Made with ❤ for travelers worldwide.</p>
    </div>
  </footer>`;

  // Set default date to tomorrow
  const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
  const dateEl=document.getElementById('planDate');
  if(dateEl) dateEl.min=tomorrow.toISOString().split('T')[0];

  renderDestinations();
  initAnimations();
}

// ========== DESTINATIONS LOGIC ==========
function heroSearchHandler(v){searchQuery=v;document.getElementById('destinations').scrollIntoView({behavior:'smooth'});setTimeout(()=>{const el=document.getElementById('destSearch');if(el){el.value=v;filterDestinations()}},500)}
function chipFilter(cat){currentFilter=cat;searchQuery='';showCount=12;document.getElementById('destinations').scrollIntoView({behavior:'smooth'});setTimeout(()=>{document.querySelectorAll('.filter-btn').forEach(b=>{b.classList.toggle('active',b.textContent===cat)});renderDestinations()},500)}
function setFilter(f){currentFilter=f;showCount=12;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b.textContent===f));renderDestinations()}
function filterDestinations(){searchQuery=document.getElementById('destSearch').value.toLowerCase();showCount=12;renderDestinations()}
function showMore(){showCount+=12;renderDestinations()}

function getFiltered(){
  let list=destinations;
  if(currentFilter!=='All'){
    if(currentFilter==='India')list=list.filter(d=>d.country==='India');
    else if(currentFilter==='International')list=list.filter(d=>d.country!=='India');
    else list=list.filter(d=>d.cat.includes(currentFilter));
  }
  if(searchQuery)list=list.filter(d=>d.name.toLowerCase().includes(searchQuery)||d.country.toLowerCase().includes(searchQuery)||d.cat.some(c=>c.toLowerCase().includes(searchQuery)));
  return list;
}

function renderDestinations(){
  const filtered=getFiltered();
  const grid=document.getElementById('destGrid');
  const btn=document.getElementById('showMoreBtn');
  if(!grid)return;
  const showing=filtered.slice(0,showCount);
  grid.innerHTML=showing.map(d=>`
    <div class="dest-card animate visible" onclick="navigateTo('explore',${d.id})">
      <div class="dest-card-img">
        <img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.onerror=null; this.src='images/default-dest.png';">
        <span class="dest-card-badge">⭐ ${d.rating}</span>
      </div>
      <div class="dest-card-body">
        <h3>${d.name}</h3>
        <p class="dest-card-country">📍 ${d.country}</p>
        <div class="dest-card-tags">${d.cat.map(c=>'<span class="dest-tag">'+c+'</span>').join('')}</div>
        <div class="dest-card-footer">
          <span class="dest-rating">${d.budget}</span>
          <span class="dest-explore-btn">Explore →</span>
        </div>
      </div>
    </div>`).join('');
  if(btn)btn.style.display=showCount>=filtered.length?'none':'block';
}

// ========== PLANNER ==========
function generatePlan(e){
  e.preventDefault();
  const destId=parseInt(document.getElementById('planDest').value);
  const travelers=parseInt(document.getElementById('planTravelers').value)||2;
  const dateVal=document.getElementById('planDate').value;
  const days=parseInt(document.getElementById('planDays').value)||5;
  const budgetVal=document.getElementById('planBudget').value;
  const style=document.getElementById('planStyle').value;

  const match=destinations.find(d=>d.id===destId);
  if(!match){alert('Please select a destination');return}

  const destLabel=getDestLabel(match);
  const budgetObj=budgetOptions.find(b=>b.value===budgetVal)||budgetOptions[1];
  const activities=styleActivities[style]||styleActivities["Adventure & Nature"];

  // Format date
  const dateObj=new Date(dateVal+'T00:00:00');
  const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const formattedDate=dayNames[dateObj.getDay()]+', '+dateObj.getDate()+' '+monthNames[dateObj.getMonth()]+' '+dateObj.getFullYear();

  // Build itinerary HTML
  let html=`<div class="itinerary-card">
    <h2 class="itinerary-title">🗺️ Your ${days}-Day ${destLabel} Itinerary</h2>
    <div class="itinerary-summary">
      <div class="summary-item"><div class="summary-label">DESTINATION</div><div class="summary-value">📍 ${destLabel}</div></div>
      <div class="summary-item"><div class="summary-label">TRAVELERS</div><div class="summary-value">👤 ${travelers} person${travelers>1?'s':''}</div></div>
      <div class="summary-item"><div class="summary-label">TRAVEL DATE</div><div class="summary-value">📅 ${formattedDate}</div></div>
      <div class="summary-item"><div class="summary-label">DURATION</div><div class="summary-value">⏱ ${days} days / ${days-1} nights</div></div>
      <div class="summary-item"><div class="summary-label">BUDGET PER PERSON</div><div class="summary-value">💰 ${budgetObj.range}</div></div>
      <div class="summary-item"><div class="summary-label">TRAVEL STYLE</div><div class="summary-value">🎯 ${style}</div></div>
    </div>
    <h3 class="itinerary-days-title">📅 Day-by-Day Itinerary</h3>`;

  for(let i=1;i<=days;i++){
    const act=activities[(i-1)%activities.length];
    html+=`<div class="day-card">
      <div class="day-label">DAY ${i}</div>
      <div class="day-activity"><strong>${act.m}</strong></div>
      <div class="day-activity"><strong>${act.e}</strong></div>
    </div>`;
  }

  html+=`<div class="itinerary-actions">
      <button class="action-btn" onclick="copyPlan()">📋 Copy Plan</button>
      <button class="action-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
    </div>
  </div>`;

  const result=document.getElementById('plannerResult');
  result.innerHTML=html;
  result.classList.add('show');
  result.scrollIntoView({behavior:'smooth',block:'start'});
}

// ========== COPY PLAN ==========
function copyPlan(){
  const card=document.querySelector('.itinerary-card');
  if(!card)return;
  const text=card.innerText;
  navigator.clipboard.writeText(text).then(()=>{
    alert('Itinerary copied to clipboard!');
  }).catch(()=>{
    // Fallback
    const ta=document.createElement('textarea');
    ta.value=text;document.body.appendChild(ta);ta.select();
    document.execCommand('copy');document.body.removeChild(ta);
    alert('Itinerary copied to clipboard!');
  });
}

// ========== EXPLORE PAGE ==========
function renderExplorePage(id){
  const d=destinations.find(x=>x.id===id);
  if(!d){navigateTo('home');return}
  const app=document.getElementById('app');
  app.innerHTML=`
  <button class="back-btn" onclick="navigateTo('home')">← Back</button>
  <div class="explore-hero" style="background-image:url('${d.img}')">
    <div class="explore-hero-content">
      <h1>${d.name}</h1>
      <p>📍 ${d.country} · ⭐ ${d.rating} · ${d.budget}</p>
    </div>
  </div>
  <div class="explore-section">
    <h2>Why Visit ${d.name}?</h2>
    <p>${d.desc} This destination offers a unique blend of experiences that will create memories to last a lifetime. From breathtaking landscapes to rich cultural heritage, ${d.name} has something for every type of traveler.</p>
  </div>
  <div class="explore-section">
    <h2>Key Features</h2>
    <div class="explore-features">
      ${[
        {icon:'🌍',title:'World Class',desc:'Globally recognized destination'},
        {icon:'📸',title:'Instagram Worthy',desc:'Stunning photo opportunities'},
        {icon:'🍜',title:'Amazing Food',desc:'Local culinary experiences'},
        {icon:'🤝',title:'Friendly Locals',desc:'Warm hospitality awaits'}
      ].map(f=>'<div class="explore-feat-card"><div class="icon">'+f.icon+'</div><h4>'+f.title+'</h4><p>'+f.desc+'</p></div>').join('')}
    </div>
  </div>
  <div class="explore-section">
    <h2>Top Places to Visit</h2>
    <div class="places-list">
      ${d.places.map((p,i)=>'<div class="place-item" style="animation-delay:'+i*.1+'s">📍 '+p+'</div>').join('')}
    </div>
  </div>
  <div class="explore-section">
    <h2>Highlights</h2>
    <div class="highlights-list">
      ${d.highlights.map(h=>'<span class="highlight-tag">✨ '+h+'</span>').join('')}
    </div>
  </div>
  <div class="explore-section">
    <h2>Budget Overview</h2>
    <div class="budget-card">
      <h3>${d.budget}</h3>
      <p>Estimated daily budget per person</p>
      <p style="margin-top:12px;font-size:.9rem">Includes accommodation, food, transport & activities</p>
    </div>
  </div>
  <div class="explore-section">
    <div class="explore-cta">
      <h2>Ready to Visit ${d.name}?</h2>
      <p>Let our AI build the perfect itinerary for your trip</p>
      <a class="btn-primary" href="#" onclick="navigateTo('home');setTimeout(()=>document.getElementById('planner').scrollIntoView({behavior:'smooth'}),300)">Plan My Trip →</a>
    </div>
  </div>
  <footer class="footer">
    <div class="footer-bottom">
      <p>📧 <a href="mailto:pushparani10290@gmail.com">pushparani10290@gmail.com</a></p>
      <p>This website is created by Pushpa, student at Geeta University, Panipat, Haryana.</p>
      <p>© 2025 SkyRoute. Made with ❤ for travelers worldwide.</p>
    </div>
  </footer>`;
}

// ========== SCROLL ANIMATIONS ==========
function initAnimations(){
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}});
  },{threshold:0.1});
  document.querySelectorAll('.animate').forEach(el=>observer.observe(el));
}

// ========== INIT ==========
renderHomePage();
