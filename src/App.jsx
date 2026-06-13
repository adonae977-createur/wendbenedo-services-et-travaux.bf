import React, { useState, useEffect } from 'react';

// Palette de design premium africain & international : Or/Bronze chêne (#D4AF37), Ébène profond (#0F0E0C), Lin sauvage (#FDFBF7)
const BRAND_COLORS = {
  primary: '#0F0E0C',   // Ébène profond luxueux
  secondary: '#B45309', // Terracotta d'Afrique / Ambre chaleureux
  accent: '#D4AF37',    // Or / Laiton brossé pour les détails haut de gamme
  background: '#FDFBF7',// Lin sauvage / Ivoire doux
  cardBg: '#FFFFFF',    // Blanc pur pour les cartes
  textDark: '#1C1A17',  // Noir terreux pour la lisibilité
  textMuted: '#6B5F50'  // Nuance écorce pour les textes de description
};

export default function App() {
  // Navigation & Vues active
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mode Réseau & PWA
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Filtre du Catalogue de réalisations
  const [catalogFilter, setCatalogFilter] = useState('all');

  // Simulateur de projet interactif (Outil d'engagement client)
  const [projectType, setProjectType] = useState('meuble');
  const [woodType, setWoodType] = useState('vene');
  const [projectSize, setProjectSize] = useState('moyen');
  const [simulationResult, setSimulationResult] = useState(null);

  // Formulaire de contact & Demande de formation
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '', target: 'general' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Détection de l'état réseau et événement d'installation PWA
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Déclencheur d'installation pour l'utilisateur
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Calculateur de projet (Simulateur interactif)
  const handleSimulateProject = (e) => {
    e.preventDefault();
    let basePrice = 0;
    let duration = "";

    if (projectType === 'meuble') {
      basePrice = 180000;
      duration = "2 à 3 semaines";
    } else if (projectType === 'agencement') {
      basePrice = 520000;
      duration = "4 à 6 semaines";
    } else {
      basePrice = 95000;
      duration = "1 à 2 semaines";
    }

    // Coefficients multiplicateurs de bois nobles et dimensions
    const woodCoeff = woodType === 'vene' ? 1.6 : woodType === 'teck' ? 1.9 : 1.1;
    const sizeCoeff = projectSize === 'grand' ? 1.7 : projectSize === 'petit' ? 0.75 : 1.0;

    const finalEstimate = Math.round(basePrice * woodCoeff * sizeCoeff);

    setSimulationResult({
      priceRange: `${finalEstimate.toLocaleString()} - ${(Math.round(finalEstimate * 1.2)).toLocaleString()} FCFA`,
      duration: duration,
      wood: woodType === 'vene' ? 'VÈNE LOCALE' : woodType === 'teck' ? 'TECK PREMIUM' : 'IROKO PRÉCIEUX',
      type: projectType === 'meuble' ? 'AMEUBLEMENT D’ART' : projectType === 'agencement' ? 'MENUISERIE BÂTIMENT' : 'COMMERCE GÉNÉRAL'
    });
  };

  // Envoi sécurisé du formulaire (Simulé en local)
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '', target: 'general' });
    }, 4500);
  };

  // Fonction utilitaire pour changer d'onglet avec effet "Scroll to top" fluide
  const navigateTo = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-700 selection:text-white" style={{ backgroundColor: BRAND_COLORS.background, color: BRAND_COLORS.textDark }}>
      
      {/* Balise de styles d'animations personnalisées (Fades tridimensionnels et micro-interactions) */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-subtle-pulse {
          animation: subtlePulse 3s ease-in-out infinite;
        }
        .card-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(15, 14, 12, 0.08);
        }
      `}</style>

      {/* Notification de connectivité discrète en cas de coupure réseau */}
      {!isOnline && (
        <div className="bg-amber-900 text-amber-50 text-xs py-2.5 px-4 text-center transition-all duration-300 flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <svg className="w-4 h-4 animate-pulse text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m0 0l3-3m-3 3H3m8-6a9 9 0 0111.36 0" />
          </svg>
          <span className="font-medium">Mode hors-ligne actif. Wend Benedo continue de vous présenter son savoir-faire local.</span>
        </div>
      )}

      {/* En-tête de Marque Premium */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-sm border-b border-stone-200/60" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Identité de Marque */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white font-serif font-extrabold text-xl shadow-md transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: BRAND_COLORS.primary, borderLeft: `3px solid ${BRAND_COLORS.accent}` }}>
              W
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight uppercase transition-colors group-hover:text-amber-800" style={{ color: BRAND_COLORS.primary }}>WEND BENEDO</span>
              <span className="block text-xxs font-semibold tracking-widest uppercase text-amber-700">Service &amp; Travaux Bois</span>
            </div>
          </div>

          {/* Navigation Bureau */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Accueil' },
              { id: 'history', label: 'Histoire & Vision' },
              { id: 'catalog', label: 'Réalisations' },
              { id: 'team', label: 'Notre Équipe' },
              { id: 'academy', label: 'Formations' },
              { id: 'contact', label: 'Contact & Devis' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`text-xs font-semibold tracking-widest transition-all uppercase duration-300 pb-1 border-b-2 ${
                  activeTab === link.id 
                    ? 'border-amber-700 text-stone-900 font-bold' 
                    : 'border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Boutons d'Action / Installation */}
          <div className="hidden lg:flex items-center gap-4">
            {isInstallable && (
              <button 
                onClick={handleInstallClick}
                className="text-xs font-bold py-2 px-4 rounded-full border border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <i className="fa-solid fa-mobile-screen"></i> Installer l'App
              </button>
            )}
            <button 
              onClick={() => navigateTo('contact')}
              className="text-xs font-bold py-3 px-6 rounded-lg text-white tracking-wider uppercase shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: BRAND_COLORS.secondary }}
            >
              Demander une Étude
            </button>
          </div>

          {/* Déclencheur Menu Mobile */}
          <div className="md:hidden flex items-center gap-3">
            {isInstallable && (
              <button 
                onClick={handleInstallClick}
                className="p-2.5 rounded-full border border-amber-800 text-amber-800 hover:bg-amber-50"
              >
                <i className="fa-solid fa-download"></i>
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 focus:outline-none transition-transform"
              style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'none' }}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

        </div>

        {/* Menu Mobile Déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 py-5 px-6 space-y-3 shadow-xl animate-fade-in-up">
            {[
              { id: 'home', label: 'Accueil' },
              { id: 'history', label: 'Histoire & Vision' },
              { id: 'catalog', label: 'Nos Réalisations' },
              { id: 'team', label: 'Notre Équipe' },
              { id: 'academy', label: 'Formations d\'Apprentis' },
              { id: 'contact', label: 'Contact' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === link.id 
                    ? 'bg-amber-50 text-amber-800 font-bold' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-stone-150">
              <button 
                onClick={() => navigateTo('contact')}
                className="w-full text-center py-3.5 px-4 rounded-lg text-white font-bold uppercase text-xs tracking-wider"
                style={{ backgroundColor: BRAND_COLORS.secondary }}
              >
                Demander un Devis
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        
        {/* ==================== ONGLET : ACCUEIL ==================== */}
        {activeTab === 'home' && (
          <div className="animate-fade-in-up">
            {/* Hero Section Premium avec design texturé bois */}
            <section className="relative bg-stone-950 text-white py-28 sm:py-36 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <img 
                  className="w-full h-full object-cover scale-105 transition-transform duration-10000"
                  style={{ animation: 'subtlePulse 20s infinite' }}
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1600&q=80" 
                  alt="Ébéniste de précision façonnant une pièce de bois noble dans un atelier haut de gamme" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-stone-950/80 to-stone-900/60" />
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-700/30 border border-amber-500/50 text-amber-300 text-xxs font-bold uppercase tracking-widest mb-6">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                    Créateur de Confiance &amp; Excellence depuis 2004
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 font-serif leading-tight">
                    Wend Benedo <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">L'Architecture du Bois d'Art.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-stone-300 mb-10 leading-relaxed font-light">
                    Dans Bogandé et toute la région de la Sirba, nous façonnons des agencements intérieurs haut de gamme, des meubles durables en essences nobles et transmettons le savoir-faire de référence aux jeunes générations du Burkina Faso.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <button 
                      onClick={() => navigateTo('catalog')}
                      className="text-center py-4 px-8 rounded-lg font-bold uppercase text-xs tracking-wider shadow-lg hover:-translate-y-0.5 hover:shadow-amber-500/10 transition-all duration-300"
                      style={{ backgroundColor: BRAND_COLORS.secondary }}
                    >
                      Explorer nos créations
                    </button>
                    <button 
                      onClick={() => navigateTo('academy')}
                      className="text-center py-4 px-8 rounded-lg border border-stone-400 text-white font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-stone-950 transition-all duration-300"
                    >
                      Le Pôle Formation Apprentis
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Chiffres Clés Réalistes */}
            <section className="py-14 bg-stone-950 border-t border-stone-900/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  <div className="p-4 rounded-xl border border-stone-900/40 bg-stone-900/20">
                    <span className="block text-4xl sm:text-5xl font-extrabold text-amber-500 font-serif">30+ Ans</span>
                    <span className="text-xxs uppercase tracking-widest text-stone-400 mt-2 block">D'Expertise Terrain</span>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-900/40 bg-stone-900/20">
                    <span className="block text-4xl sm:text-5xl font-extrabold text-amber-500 font-serif">800+</span>
                    <span className="text-xxs uppercase tracking-widest text-stone-400 mt-2 block">Chantiers &amp; Mobilier Livrés</span>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-900/40 bg-stone-900/20">
                    <span className="block text-4xl sm:text-5xl font-extrabold text-amber-500 font-serif">150+</span>
                    <span className="text-xxs uppercase tracking-widest text-stone-400 mt-2 block">Diplômés CQP &amp; BQP formés</span>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-900/40 bg-stone-900/20">
                    <span className="block text-4xl sm:text-5xl font-extrabold text-amber-500 font-serif">100%</span>
                    <span className="text-xxs uppercase tracking-widest text-stone-400 mt-2 block">Bois Éco-Géré Local</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Nos Domaines d'Intervention Spécifiques */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block mb-3">Compétences d'Ingénierie &amp; Artisanat</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: BRAND_COLORS.primary }}>
                  Des Prestations Certifiées et Exclusives
                </h2>
                <div className="w-16 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Menuiserie Bois & Agencement",
                    desc: "Étude et conception de menuiseries extérieures et intérieures haut de gamme (portes isolantes, fenêtres architecturales) pour les bâtiments d'institutions et de particuliers.",
                    icon: <i className="fa-solid fa-tree-city text-2xl text-amber-800"></i>
                  },
                  {
                    title: "Conception de Meubles d'Exception",
                    desc: "Création artisanale sur-mesure de salons, buffets, bureaux d'institutions en bois nobles d'Afrique de l'Ouest (Teck de plantation, Vène sauvage, Iroko) avec finitions satinées.",
                    icon: <i className="fa-solid fa-couch text-2xl text-amber-800"></i>
                  },
                  {
                    title: "Formation Jeunes d'Avenir",
                    desc: "Fidèles à notre rôle social, nous accompagnons les apprentis locaux par une formation pratique de haut niveau les préparant rigoureusement aux examens CQP et BQP d'État.",
                    icon: <i className="fa-solid fa-graduation-cap text-2xl text-amber-800"></i>
                  }
                ].map((item, index) => (
                  <div key={index} className="p-8 rounded-xl shadow-sm border border-stone-200/60 card-hover bg-white">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 bg-amber-50">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-4 font-serif" style={{ color: BRAND_COLORS.primary }}>{item.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== ONGLET : HISTOIRE ==================== */}
        {activeTab === 'history' && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block mb-3">La Force de la Transmission</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: BRAND_COLORS.primary }}>
                Une Aventure Humaine &amp; Technique
              </h2>
              <div className="w-16 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-serif text-amber-800">Fondée en 2004, Structurée pour Relever vos Grands Défis</h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
                  L'entreprise <strong>Wend Benedo Service et Travaux (WBST)</strong> est née de la passion artisanale d'un maître charpentier-ébéniste burkinabè. Créée en 2004, notre structure s'est forgée sur les chantiers rudes et exigeants de la province de la Gnagna à Bogandé.
                </p>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
                  Pour répondre avec professionnalisme aux appels d'offres publics de l'État, des mairies, des ONG d'aide au développement et des entrepreneurs privés, l'entreprise s'est officiellement formalisée en 2017 (Registre du Commerce et du Crédit Mobilier - RCCM).
                </p>
                
                <div className="p-6 rounded-xl border border-amber-100 bg-amber-50/40">
                  <h4 className="font-bold text-amber-900 mb-2 font-serif text-sm">Notre Politique de Qualité Totale</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Chez Wend Benedo, chaque planche de Teck ou de Vène subit un séchage naturel contrôlé à l'abri de l'humidité. Nous veillons scrupuleusement au respect de l'environnement forestier en collaboration étroite avec les autorités des eaux et forêts du Burkina Faso.
                  </p>
                </div>
              </div>

              {/* Image montrant un véritable artisan façonnant le bois */}
              <div className="relative">
                <div className="absolute inset-0 bg-amber-600/10 rounded-2xl z-10 pointer-events-none"></div>
                <img 
                  className="rounded-2xl shadow-lg w-full object-cover h-[450px]"
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
                  alt="Établi d'ébéniste de luxe et assemblage d'une table haut de gamme" 
                />
                <div className="absolute -bottom-6 -left-6 bg-stone-950 text-white p-6 rounded-xl shadow-xl hidden sm:block border-l-4 border-amber-500">
                  <span className="block text-3xl font-extrabold text-amber-400 font-serif">2004</span>
                  <span className="text-xxs uppercase tracking-widest text-stone-400">Origine et Création Initiale</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== ONGLET : CATALOGUE ==================== */}
        {activeTab === 'catalog' && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block mb-3">Galerie des Œuvres</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: BRAND_COLORS.primary }}>
                Nos Réalisations d'Exception
              </h2>
              <p className="mt-2 text-stone-500 text-xs sm:text-sm">Découvrez nos chantiers emblématiques d'agencements et d'ameublement.</p>
              <div className="w-16 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Filtres Catégories */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {[
                { id: 'all', label: 'Tout notre savoir-faire' },
                { id: 'furniture', label: 'Conception Meubles' },
                { id: 'fitting', label: 'Menuiserie & Agencement' },
                { id: 'public', label: 'Bâtiments & Marchés Publics' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCatalogFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    catalogFilter === filter.id 
                      ? 'bg-amber-800 text-white shadow-md' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Grille de véritables travaux de bois */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  title: "Agencement de Bureaux d'Institutions",
                  category: "public",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                  desc: "Chantier d'installation de cloisons murales en bois verni et bureaux de haut fonctionnaire dans la région de l'Est."
                },
                {
                  id: 2,
                  title: "Porte d'Entrée Massive en Teck",
                  category: "fitting",
                  image: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&q=80",
                  desc: "Porte de sécurité blindée de manière invisible par de l'acier interne, recouverte de teck de plantation burkinabè sculpté."
                },
                {
                  id: 3,
                  title: "Mobilier Scolaire d'École Primaire",
                  category: "public",
                  image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
                  desc: "Conception de tables-bancs robustes en teck et structure métallique pour les marchés publics d'écoles à Bogandé."
                },
                {
                  id: 4,
                  title: "Salon Royal en Bois de Vène",
                  category: "furniture",
                  image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
                  desc: "Série complète de canapés et tables basses haut de gamme, utilisant la couleur naturelle de la vène avec un traitement anti-parasites."
                },
                {
                  id: 5,
                  title: "Bibliothèque Encastrée Moderne",
                  category: "fitting",
                  image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
                  desc: "Optimisation d'espace pour une résidence privée de prestige, intégrant de la lumière LED basse consommation dans les étagères de chêne."
                },
                {
                  id: 6,
                  title: "Table de Conférence Institutionnelle",
                  category: "furniture",
                  image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
                  desc: "Une table d'une longueur de 6 mètres, conçue pour accueillir 18 décideurs. Piétement sculptural ultra-robuste."
                }
              ]
              .filter(item => catalogFilter === 'all' || item.category === catalogFilter)
              .map((item) => (
                <div key={item.id} className="group rounded-xl overflow-hidden bg-white shadow-sm border border-stone-200/60 card-hover">
                  <div className="relative h-60 overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.image} alt={item.title} />
                    <span className="absolute top-4 left-4 text-xxs font-extrabold tracking-widest uppercase bg-stone-950 text-white px-3.5 py-2 rounded-lg shadow-sm">
                      {item.category === 'furniture' ? 'Ameublement' : item.category === 'fitting' ? 'Agencement' : 'Marché Public'}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-base mb-2 group-hover:text-amber-800 transition-colors font-serif">{item.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================== ONGLET : NOTRE EQUIPE ==================== */}
        {}
        {activeTab === 'team' && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block mb-3">Les Artisans de la Sirba</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: BRAND_COLORS.primary }}>
                Le Visage de l'Excellence &amp; du Savoir-faire
              </h2>
              <p className="mt-2 text-stone-500 text-xs sm:text-sm">Une équipe de professionnels hautement qualifiés, passionnés par la rigueur et la transmission.</p>
              <div className="w-16 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Trombinoscope des cadres techniques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
              {[
                {
                  name: "M. Yempabou Lankoandé",
                  role: "Fondateur & Maître Ébéniste",
                  bio: "Plus de 30 ans d'expérience. Compagnon ébéniste d'exception et garant de l'esprit Wend Benedo depuis 2004.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
                  specialty: "Séchage & Sélection des Bois"
                },
                {
                  name: "M. Harouna Thiombiano",
                  role: "Directeur de l'Atelier",
                  bio: "Spécialiste de la lecture de plans complexes et de la découpe industrielle assistée par ordinateur.",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
                  specialty: "Agencement Bâtiment & Machines"
                },
                {
                  name: "Mme Mariam Lompo",
                  role: "Responsable Administrative & Formations",
                  bio: "Pilote avec rigueur les candidatures des apprentis aux examens d'État CQP / BQP et la relation client.",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
                  specialty: "Suivi Académique & Gestion"
                },
                {
                  name: "M. Salifou Diallo",
                  role: "Chef d'Équipe Finitions",
                  bio: "Expert des vernis à la main et des traitements de surface haut de gamme sur essences rares d'Iroko et de Teck.",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80",
                  specialty: "Polissage & Qualité Ébéniste"
                }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden border border-stone-200/60 shadow-sm card-hover flex flex-col h-full">
                  <div className="relative h-72 w-full overflow-hidden bg-stone-100">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                      src={member.image} 
                      alt={member.name} 
                    />
                    <span className="absolute bottom-4 left-4 text-xxs font-extrabold tracking-widest uppercase bg-amber-800 text-amber-50 px-3 py-1.5 rounded-lg shadow-sm">
                      {member.specialty}
                    </span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg font-serif mb-1" style={{ color: BRAND_COLORS.primary }}>{member.name}</h3>
                      <span className="block text-xxs font-bold uppercase tracking-wider text-amber-700 mb-4">{member.role}</span>
                      <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: BRAND_COLORS.textMuted }}>{member.bio}</p>
                    </div>
                    <div className="border-t border-stone-100 pt-4 flex gap-3 text-stone-400">
                      <a href="#" className="hover:text-amber-700 transition-colors"><i className="fa-brands fa-whatsapp text-sm"></i></a>
                      <a href="#" className="hover:text-amber-700 transition-colors"><i className="fa-solid fa-envelope text-xs"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section sur la cohésion d'équipe et la formation d'avenir */}
            <div className="rounded-2xl bg-stone-900 text-stone-100 p-8 md:p-12 border border-stone-850 relative overflow-hidden">
              <div className="absolute inset-0 opacity-15">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" 
                  alt="Travail collaboratif en atelier" 
                />
              </div>
              <div className="relative max-w-3xl z-10">
                <span className="text-xxs font-extrabold uppercase tracking-widest text-amber-400 block mb-3">La Force Collective de nos Compagnons</span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-4 text-white">Une synergie unique au cœur de Bogandé</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-300 mb-6 font-light">
                  Au-delà de nos cadres permanents, <strong>Wend Benedo Service et Travaux</strong> c'est un collectif de plus de 15 charpentiers-compagnons mobiles et 10 apprentis hautement impliqués sur vos chantiers. Chaque projet que vous nous confiez fait grandir un jeune du Burkina Faso en cours de professionnalisation d'État.
                </p>
                <button 
                  onClick={() => navigateTo('academy')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Découvrir notre pôle académique <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================== ONGLET : FORMATIONS & SIMULATION ==================== */}
        {activeTab === 'academy' && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block mb-3">Notre Devoir de Transmission</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: BRAND_COLORS.primary }}>
                Pôle de Formation et de Qualification
              </h2>
              <p className="mt-2 text-stone-500 text-xs sm:text-sm">Nous accompagnons nos apprentis depuis l'initiation pratique à l'établi jusqu'aux examens certifiants nationaux.</p>
              <div className="w-16 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Certifications professionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-8 rounded-xl border border-stone-200 bg-white hover:border-amber-500 transition-colors duration-300">
                <span className="text-xxs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1.5 rounded-md">Diplôme Certifié</span>
                <h3 className="text-xl font-bold font-serif mt-4 mb-2">CQP - Certificat de Qualification Professionnelle</h3>
                <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
                  Parcours fondamental de 2 ans. Les élèves apprennent les gestes de base de la charpente, la découpe géométrique parfaite, l'utilisation sécurisée des machines-outils de l'atelier et l'art de l'assemblage traditionnel à tenon et mortaise.
                </p>
                <div className="border-t border-stone-150 pt-5">
                  <h4 className="font-bold text-xxs uppercase tracking-widest text-stone-400 mb-3">Enseignements clés :</h4>
                  <ul className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Maîtrise des mesures</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Ponçage et préparation</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Sécurité de l'atelier</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Finitions laquées</li>
                  </ul>
                </div>
              </div>

              <div className="p-8 rounded-xl border border-stone-200 bg-white hover:border-amber-500 transition-colors duration-300">
                <span className="text-xxs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1.5 rounded-md">Brevet d'État</span>
                <h3 className="text-xl font-bold font-serif mt-4 mb-2">BQP - Brevet de Qualification Professionnelle</h3>
                <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
                  Spécialisation avancée de 1 an destinée aux artisans souhaitant encadrer des chantiers ou ouvrir leur propre atelier. Accent mis sur le tracé de charpente, la lecture de plans d'architectes et la conception assistée par ordinateur.
                </p>
                <div className="border-t border-stone-150 pt-5">
                  <h4 className="font-bold text-xxs uppercase tracking-widest text-stone-400 mb-3">Enseignements clés :</h4>
                  <ul className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Lecture de plans</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Estimation des coûts</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Management d'équipe</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-amber-700"></i> Dessin technique DAO</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Simulateur de projet interactif */}
            <div className="max-w-4xl mx-auto rounded-xl shadow-sm border border-stone-200/80 overflow-hidden bg-white">
              <div className="p-8 md:p-10 text-center border-b border-stone-150 bg-stone-50">
                <h3 className="text-xl font-bold font-serif text-stone-900">Simulateur de Devis &amp; d'Essence Bois</h3>
                <p className="text-xs sm:text-sm mt-1" style={{ color: BRAND_COLORS.textMuted }}>Estimez le budget indicatif et la durée requise pour votre projet d'agencement.</p>
              </div>

              <form onSubmit={handleSimulateProject} className="p-8 md:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div>
                    <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Type d'agencement</label>
                    <select 
                      value={projectType} 
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full p-3 rounded-lg border border-stone-200 bg-white focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                    >
                      <option value="meuble">Ameublement d'art (Buffet, Lit, Table)</option>
                      <option value="agencement">Menuiserie Bâtiment (Portes, Placards)</option>
                      <option value="trade">Fournitures &amp; Commerce Général</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Choix de l'Essence</label>
                    <select 
                      value={woodType} 
                      onChange={(e) => setWoodType(e.target.value)}
                      className="w-full p-3 rounded-lg border border-stone-200 bg-white focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                    >
                      <option value="vene">Bois de Vène Local (Teinte ambrée, dense)</option>
                      <option value="teck">Teck d'Afrique de l'Ouest (Noble &amp; Extérieur)</option>
                      <option value="iroko">Iroko (Résistance et finesse)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Échelle du Projet</label>
                    <select 
                      value={projectSize} 
                      onChange={(e) => setProjectSize(e.target.value)}
                      className="w-full p-3 rounded-lg border border-stone-200 bg-white focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                    >
                      <option value="petit">Pièce unique / Standard</option>
                      <option value="moyen">Aménagement complet (Maison / Bureau)</option>
                      <option value="grand">Chantier d'envergure publique / Institution</option>
                    </select>
                  </div>

                </div>

                <div className="text-center pt-2">
                  <button 
                    type="submit" 
                    className="px-8 py-3.5 rounded-lg text-white font-bold uppercase text-xs tracking-wider shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    style={{ backgroundColor: BRAND_COLORS.secondary }}
                  >
                    Estimer mon projet
                  </button>
                </div>
              </form>

              {simulationResult && (
                <div className="p-8 md:p-10 bg-amber-50/50 border-t border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xxs font-bold tracking-widest text-amber-800 uppercase block mb-1">Budget d'étude prévisionnel</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-serif block">{simulationResult.priceRange}</span>
                    <span className="text-xs text-amber-800 block mt-1">Délai indicatif d'exécution : {simulationResult.duration}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setFormData({
                        ...formData,
                        message: `Bonjour l'équipe de Wend Benedo, je souhaite obtenir un devis finalisé pour un projet de type "${simulationResult.type}" en essence "${simulationResult.wood}".`
                      });
                      navigateTo('contact');
                    }}
                    className="px-6 py-3.5 rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                    style={{ backgroundColor: BRAND_COLORS.primary }}
                  >
                    Valider et envoyer une demande
                  </button>
                </div>
              )}

            </div>
          </section>
        )}

        {/* ==================== ONGLET : CONTACT & ADRESSES ==================== */}
        {activeTab === 'contact' && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-amber-800 uppercase block mb-3">Discutons de vos Travaux</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif" style={{ color: BRAND_COLORS.primary }}>
                Entrez en relation avec notre Direction
              </h2>
              <div className="w-16 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Coordonnées */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold font-serif mb-4" style={{ color: BRAND_COLORS.primary }}>Une Équipe Mobile</h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
                    Bien que profondément enracinée dans la province de la Gnagna à Bogandé, l'entreprise <strong>Wend Benedo Service et Travaux</strong> dispose d'équipes mobiles prêtes à intervenir dans toute la région de la Sirba, Fada N'Gourma et Ouagadougou.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-200/60 bg-white">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-50 text-amber-800 shrink-0">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Notre Siège</h4>
                      <p className="text-stone-600 text-xs sm:text-sm mt-1">Secteur 2, Face au Marché, Bogandé, Burkina Faso</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-200/60 bg-white">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-50 text-amber-800 shrink-0">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Secrétariat &amp; WhatsApp</h4>
                      <p className="text-stone-600 text-xs sm:text-sm mt-1">+226 24 77 9X XX / +226 70 XX XX XX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-200/60 bg-white">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-50 text-amber-800 shrink-0">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Adresse Courriel</h4>
                      <p className="text-stone-600 text-xs sm:text-sm mt-1">direction@wendbenedo-bois.bf</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire de Contact */}
              <div className="p-8 md:p-10 rounded-xl border border-stone-200 bg-white shadow-sm">
                {formSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-fade-in-up">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                      <i className="fa-solid fa-circle-check text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">Message transmis avec succès !</h3>
                    <p className="text-xs sm:text-sm max-w-sm" style={{ color: BRAND_COLORS.textMuted }}>
                      Notre secrétariat technique va étudier vos dimensions et vous rappellera dans les plus brefs délais par téléphone ou WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Nom &amp; Prénom</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 rounded-lg border border-stone-200 focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                        placeholder="Ex: Sawadogo Ibrahim"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Téléphone</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-3 rounded-lg border border-stone-200 focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                          placeholder="Ex: +226 70 00 00 00"
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Adresse email</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-3 rounded-lg border border-stone-200 focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                          placeholder="Ex: ibrahim@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Objet de votre démarche</label>
                      <select 
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        className="w-full p-3 rounded-lg border border-stone-200 bg-white focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                      >
                        <option value="general">Prestation d'Agencement / Devis Mobilier</option>
                        <option value="training">Candidature à une formation (CQP/BQP)</option>
                        <option value="trade">Appels d'offres / Commerce Général</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xxs font-extrabold uppercase tracking-widest text-stone-500 mb-2">Description du Projet ou Message</label>
                      <textarea 
                        rows="4"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 rounded-lg border border-stone-200 focus:border-amber-700 outline-none text-xs font-semibold text-stone-700"
                        placeholder="Précisez ici les dimensions souhaitées, l'essence du bois et les contraintes de votre chantier..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full text-center py-4 rounded-lg text-white font-bold uppercase text-xs tracking-wider shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      style={{ backgroundColor: BRAND_COLORS.secondary }}
                    >
                      Envoyer ma Demande de Devis
                    </button>
                  </form>
                )}
              </div>

            </div>
          </section>
        )}

      </main>

      {/* Pied de page Professionnel */}
      <footer className="text-stone-400 py-16" style={{ backgroundColor: BRAND_COLORS.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-800 pb-12">
            
            {/* Colonne Identité */}
            <div className="space-y-4">
              <span className="text-xl font-bold tracking-tight uppercase block text-white font-serif">WEND BENEDO</span>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
                Depuis plus de 30 ans, nous perpétuons l'excellence des métiers du bois au Burkina Faso, de la haute ébénisterie d'art à la formation CQP et BQP d'État.
              </p>
            </div>

            {/* Colonne Plan de navigation */}
            <div>
              <h4 className="font-bold text-xxs uppercase tracking-widest text-amber-500 mb-4">Accès Rapides</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li><button onClick={() => navigateTo('home')} className="hover:text-amber-500 transition-colors">Accueil Principal</button></li>
                <li><button onClick={() => navigateTo('history')} className="hover:text-amber-500 transition-colors">Histoire &amp; Qualité</button></li>
                <li><button onClick={() => navigateTo('catalog')} className="hover:text-amber-500 transition-colors">Galerie des Réalisations</button></li>
                <li><button onClick={() => navigateTo('team')} className="hover:text-amber-500 transition-colors">Notre Équipe d'Artisans</button></li>
                <li><button onClick={() => navigateTo('academy')} className="hover:text-amber-500 transition-colors">Espace Formation Jeunes</button></li>
              </ul>
            </div>

            {/* Colonne Certifications et localités */}
            <div>
              <h4 className="font-bold text-xxs uppercase tracking-widest text-amber-500 mb-4">Renseignements Généraux</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>Enregistrement : Création 2004 / RCCM 2017</li>
                <li>Région d'intervention : Sirba / Gnagna / Centre (Ouagadougou)</li>
                <li>Hébergement : Compatible PWA Standard</li>
                <li>Spécialité : Menuiserie, Mobilier, Agencement &amp; Commerce</li>
              </ul>
            </div>

          </div>

          <div className="pt-8 text-center text-xxs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Wend Benedo Service et Travaux. Tous droits réservés.</p>
            <div className="flex gap-4">
              <span className="hover:text-stone-400 cursor-pointer">Réglementation Bois local</span>
              <span>•</span>
              <span className="hover:text-stone-400 cursor-pointer">Conditions Générales de Chantier</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}