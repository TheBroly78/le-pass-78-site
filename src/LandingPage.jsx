import React, { useEffect, useRef, useState } from 'react';
import {
  motion, AnimatePresence, useScroll, useSpring, useMotionValue,
  useMotionValueEvent, useInView, animate,
} from 'framer-motion';
import {
  CreditCard, Wallet, ScanLine, Coins, ArrowRight, Sparkles,
  MonitorSmartphone, Users, BarChart3, Check, ShieldCheck, MapPin, Zap,
  Menu, X, Plus, Quote, Scissors, UtensilsCrossed, Coffee, ShoppingBag,
  Croissant, Flower2, Dumbbell, Store, Loader2, AlertCircle,
} from 'lucide-react';

// URL de l'API backend (configurable via VITE_API_URL — voir .env.example).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/* -------------------------------------------------------------------------- */
/*  Variantes & helpers d'animation                                           */
/* -------------------------------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Compteur animé qui démarre quand l'élément entre dans le viewport.
function CountUp({ to, suffix = '', className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {Math.round(n).toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

// Carte avec halo lumineux qui suit le curseur (variables CSS --mx / --my).
function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Décor de fond                                                             */
/* -------------------------------------------------------------------------- */
function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric-600/30 blur-[120px] animate-glow" />
      <div className="absolute top-[30%] -right-40 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/20 blur-[120px] animate-glow" />
      <div className="absolute bottom-0 -left-40 h-[32rem] w-[32rem] rounded-full bg-blue-600/20 blur-[120px] animate-glow" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Barre de progression de scroll                                            */
/* -------------------------------------------------------------------------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-electric-400 via-indigo-400 to-blue-400"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar (fond au scroll + menu mobile)                                     */
/* -------------------------------------------------------------------------- */
const NAV_LINKS = [
  { href: '#how', label: 'Comment ça marche' },
  { href: '#merchants', label: 'Commerçants' },
  { href: '#faq', label: 'FAQ' },
];

function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40));

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 px-4"
    >
      <nav
        className={`mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-300 ${
          scrolled
            ? 'border-white/10 bg-ink-950/70 backdrop-blur-xl shadow-lg shadow-black/40'
            : 'border-white/10 bg-white/5 backdrop-blur-md'
        }`}
      >
        <a href="#top" className="flex items-center gap-2 font-bold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric-500 to-blue-600 shadow-lg shadow-electric-600/40">
            <CreditCard size={20} />
          </span>
          Le&nbsp;Pass&nbsp;78
        </a>

        <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#cta"
            className="hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-gray-200 sm:block"
          >
            Rejoindre
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Panneau mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-ink-950/90 p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-gray-200 transition hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-white px-3 py-2.5 text-center font-semibold text-ink-950"
              >
                Rejoindre la liste d'attente
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Carte Apple Wallet "Le Pass 78" — mockup sur-mesure + tilt 3D            */
/* -------------------------------------------------------------------------- */
function FakeQR() {
  // QR-like : 3 repères d'angle + modules pseudo-aléatoires déterministes.
  const N = 11;
  const cells = [];
  const inFinder = (i, j) =>
    (i < 3 && j < 3) || (i < 3 && j >= N - 3) || (i >= N - 3 && j < 3);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (inFinder(i, j)) continue;
      if ((i * 13 + j * 7 + ((i ^ j) % 3)) % 3 === 0) {
        cells.push(<rect key={`${i}-${j}`} x={j * 9 + 1} y={i * 9 + 1} width="7" height="7" rx="1.5" fill="#0a0a12" />);
      }
    }
  }
  const Finder = ({ x, y }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="25" height="25" rx="5" fill="#0a0a12" />
      <rect x="5" y="5" width="15" height="15" rx="3" fill="#fff" />
      <rect x="9" y="9" width="7" height="7" rx="2" fill="#0a0a12" />
    </g>
  );
  return (
    <svg viewBox="0 0 99 99" className="h-full w-full">
      {cells}
      <Finder x={0} y={0} />
      <Finder x={74} y={0} />
      <Finder x={0} y={74} />
    </svg>
  );
}

function WalletCard() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sx = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const sy = useSpring(rotateY, { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(px * 18);
    rotateX.set(-py * 18);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="relative mx-auto" style={{ perspective: 1200 }}>
      {/* Halo */}
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-electric-600/50 to-blue-500/30 blur-3xl" />

      {/* Lévitation (wrapper) */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Tilt 3D (carte) */}
        <motion.div
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}
          className="relative aspect-[1.586] w-[340px] overflow-hidden rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-electric-500 via-indigo-600 to-blue-700 p-6 shadow-2xl shadow-electric-900/50 sm:w-[400px]"
        >
          {/* Reflet animé */}
          <div className="pointer-events-none absolute -inset-y-10 left-0 w-1/3 bg-white/20 blur-xl animate-shine" />

          {/* Haut */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-white/70">MONNAIE UNIVERSELLE</p>
              <p className="mt-0.5 text-xl font-extrabold text-white">Le Pass 78</p>
            </div>
            <Wallet className="text-white/90" size={26} />
          </div>

          {/* Puce */}
          <div className="mt-5 h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200/90 to-yellow-400/80 shadow-inner" />

          {/* Solde + QR */}
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-white/70">SOLDE</p>
              <p className="text-3xl font-extrabold text-white">1 240<span className="ml-1 text-base font-bold">pts</span></p>
              <p className="mt-1 text-xs text-white/70">Jean Dupont · Membre</p>
            </div>
            <div className="h-[72px] w-[72px] rounded-xl bg-white p-1.5 shadow-lg">
              <FakeQR />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Badge flottant "réseau" */}
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-4 -top-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/80 px-3.5 py-2.5 shadow-xl backdrop-blur-xl"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
          <ShieldCheck size={16} />
        </span>
        <div>
          <p className="text-[10px] text-gray-400">Apple Wallet</p>
          <p className="text-xs font-bold text-white">Ajouté ✓</p>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. HERO                                                                   */
/* -------------------------------------------------------------------------- */
function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-6 pt-40 pb-20 md:pt-48">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-400" />
            </span>
            <MapPin size={14} className="text-electric-400" />
            Le réseau de fidélité des Yvelines
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl"
          >
            Une seule carte.
            <br />
            <span className="bg-gradient-to-r from-electric-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Tous vos commerçants du 78.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400"
          >
            Cumulez des points chez votre coiffeur, offrez-vous un resto. Le Pass 78
            s'intègre nativement dans votre Apple Wallet.{' '}
            <span className="font-semibold text-gray-200">Zéro application à télécharger.</span>
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#cta"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-electric-600/40 transition hover:shadow-electric-600/60"
            >
              Rejoindre la liste d'attente
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a
              href="#merchants"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Je suis un commerçant
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500"
          >
            <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-electric-400" /> Sans contact</span>
            <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-electric-400" /> Apple & Google Wallet</span>
            <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-electric-400" /> Monnaie universelle</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-10"
        >
          <WalletCard />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bandeau de partenaires (marquee infini)                                   */
/* -------------------------------------------------------------------------- */
const PARTNERS = [
  { icon: Scissors, label: 'Coiffeurs' },
  { icon: UtensilsCrossed, label: 'Restaurants' },
  { icon: Croissant, label: 'Boulangeries' },
  { icon: Coffee, label: 'Cafés' },
  { icon: ShoppingBag, label: 'Boutiques' },
  { icon: Flower2, label: 'Fleuristes' },
  { icon: Dumbbell, label: 'Salles de sport' },
  { icon: Store, label: 'Épiceries' },
];

function PartnersMarquee() {
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <section className="relative border-y border-white/10 py-8">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        Un réseau pour tous les commerces de proximité
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {items.map((p, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-gray-300"
            >
              <p.icon size={18} className="text-electric-400" />
              <span className="font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. COMMENT ÇA MARCHE                                                      */
/* -------------------------------------------------------------------------- */
const STEPS = [
  { icon: Wallet, title: 'Ajoutez au Wallet', desc: "En un clic, sans aucune application à installer. Votre carte vit dans Apple Wallet." },
  { icon: ScanLine, title: 'Scannez en caisse', desc: 'Présentez votre QR Code au commerçant. La transaction est instantanée.' },
  { icon: Coins, title: 'Dépensez partout', desc: 'Utilisez votre monnaie universelle chez tous les partenaires du réseau.' },
];

function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-electric-300">
          <Sparkles size={14} /> Côté client
        </span>
        <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">Simple comme bonjour</h2>
        <p className="mt-4 text-lg text-gray-400">Trois étapes, zéro friction. De l'ajout à la dépense.</p>
      </Reveal>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-16 grid gap-6 md:grid-cols-3"
      >
        {STEPS.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp}>
            <SpotlightCard className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-electric-500/40">
              <span className="absolute right-6 top-6 text-6xl font-black text-white/5 transition group-hover:text-white/10">
                0{i + 1}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-electric-500 to-blue-600 text-white shadow-lg shadow-electric-600/30">
                <step.icon size={26} />
              </span>
              <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-gray-400">{step.desc}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bandeau de chiffres (compteurs animés)                                    */
/* -------------------------------------------------------------------------- */
const STATS = [
  { to: 120, suffix: '+', label: 'Commerçants visés' },
  { to: 15000, suffix: '+', label: 'Membres attendus' },
  { to: 100, suffix: '%', label: 'Sans contact' },
  { to: 2, suffix: ' min', label: 'Mise en place' },
];

function StatsBand() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink-950 p-8 text-center">
              <CountUp
                to={s.to}
                suffix={s.suffix}
                className="block bg-gradient-to-r from-electric-400 to-blue-400 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
              />
              <p className="mt-2 text-sm text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. COMMERÇANTS — BENTO GRID                                               */
/* -------------------------------------------------------------------------- */
function Merchants() {
  return (
    <section id="merchants" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-fuchsia-300">
          <Zap size={14} /> Côté commerçant
        </span>
        <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Rejoignez le réseau. <span className="text-gray-500">Sans contrainte.</span>
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Comme tous nos <span className="font-semibold text-gray-200">partenaires</span>,
          transformez vos clients occasionnels en habitués.
        </p>
      </Reveal>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-16 grid gap-5 md:grid-cols-3 md:grid-rows-2"
      >
        {/* Carte A */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <SpotlightCard className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="relative z-10 max-w-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-electric-500/20 text-electric-300">
                <MonitorSmartphone size={24} />
              </span>
              <h3 className="mt-5 text-2xl font-bold text-white">Zéro matériel requis</h3>
              <p className="mt-3 leading-relaxed text-gray-400">
                Pas de borne, pas d'installation. Le scanner fonctionne depuis une simple page web
                sur votre tablette ou votre téléphone. Vous êtes opérationnel en 5 minutes.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                {['Tablette', 'Smartphone', 'Navigateur web', 'PWA installable'].map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
              alt="Technologie"
              className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-3xl object-cover opacity-30 blur-[1px] transition group-hover:opacity-40"
            />
          </SpotlightCard>
        </motion.div>

        {/* Carte B — stats */}
        <motion.div variants={fadeUp} className="md:row-span-2">
          <SpotlightCard className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-electric-600/20 to-white/5 p-8 backdrop-blur-xl">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-white">
              <BarChart3 size={24} />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-white">Statistiques en temps réel</h3>
            <p className="mt-3 leading-relaxed text-gray-400">
              Suivez vos transactions, vos points émis et la fréquentation depuis un tableau de
              bord clair.
            </p>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
              alt="Tableau de bord de données"
              className="mt-6 w-full rounded-2xl border border-white/10 object-cover opacity-90 transition group-hover:opacity-100"
            />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold text-white">+38%</p>
                <p className="text-xs text-gray-400">Clients récurrents</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold text-white">2 min</p>
                <p className="text-xs text-gray-400">Mise en place</p>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Carte C */}
        <motion.div variants={fadeUp} className="md:col-span-2">
          <SpotlightCard className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="relative z-10 max-w-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-fuchsia-500/20 text-fuchsia-300">
                <Users size={24} />
              </span>
              <h3 className="mt-5 text-2xl font-bold text-white">Attirez de nouveaux clients</h3>
              <p className="mt-3 leading-relaxed text-gray-400">
                La force du réseau mutualisé : un client qui gagne des points chez un partenaire
                vient les dépenser chez vous. Tout le 78 devient votre vitrine.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-electric-300">
                <ShieldCheck size={16} /> Compensation inter-commerçants automatisée
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
              alt="Réseau de commerçants"
              className="pointer-events-none absolute -bottom-12 -right-8 h-56 w-72 rounded-3xl object-cover opacity-25 transition group-hover:opacity-35"
            />
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Témoignage                                                                */
/* -------------------------------------------------------------------------- */
function Testimonial() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-16">
      <Reveal>
        <figure className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <Quote className="mx-auto text-electric-400/40" size={44} />
          <blockquote className="mx-auto mt-4 max-w-2xl text-xl font-medium leading-relaxed text-gray-200 md:text-2xl">
            « Depuis qu'on est sur Le Pass 78, on voit revenir des clients qui ont gagné leurs
            points ailleurs dans le quartier. Le réseau crée un vrai cercle vertueux. »
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-electric-500 to-blue-600 font-bold text-white">
              P78
            </span>
            <div className="text-left">
              <p className="font-semibold text-white">Un commerçant partenaire</p>
              <p className="text-sm text-gray-400">Réseau Le Pass 78 · Yvelines</p>
            </div>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ (accordéon)                                                           */
/* -------------------------------------------------------------------------- */
const FAQS = [
  { q: 'Faut-il télécharger une application ?', a: "Non. La carte s'ajoute directement à Apple Wallet (ou Google Wallet sur Android) en un clic. Aucune app à installer." },
  { q: 'Comment fonctionne la monnaie universelle ?', a: 'Vos points sont valables dans tout le réseau : vous les gagnez chez un partenaire et les dépensez chez un autre. Le solde est calculé en temps réel.' },
  { q: 'Quel matériel pour les commerçants ?', a: "Aucun matériel spécifique. Le scan se fait via une page web sur une tablette ou un smartphone. La mise en place prend quelques minutes." },
  { q: 'Mes données sont-elles protégées ?', a: 'Oui. Les échanges sont chiffrés (HTTPS), les accès commerçants sont authentifiés et le solde n’est jamais stocké en dur — il est recalculé à partir des transactions.' },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-white">{item.q}</span>
        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="shrink-0 text-electric-300">
          <Plus size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-5 leading-relaxed text-gray-400">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-6 py-24">
      <Reveal className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Questions fréquentes</h2>
        <p className="mt-4 text-lg text-gray-400">Tout ce qu'il faut savoir avant de se lancer.</p>
      </Reveal>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-3"
      >
        {FAQS.map((item, i) => (
          <motion.div key={item.q} variants={fadeUp}>
            <FAQItem item={item} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. CTA FINAL + capture email                                             */
/* -------------------------------------------------------------------------- */
function FinalCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Inscription impossible.');
      }
      setMessage(data.message || 'Merci ! Vous êtes sur la liste.');
      setStatus('sent');
    } catch (err) {
      setMessage(err.message || 'Une erreur est survenue. Réessayez.');
      setStatus('error');
    }
  };

  const loading = status === 'loading';

  return (
    <section id="cta" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-electric-600/30 via-ink-900 to-blue-700/20 p-10 text-center backdrop-blur-xl md:p-16">
          <div className="absolute inset-0 -z-10 bg-grid-faint [background-size:40px_40px] opacity-40" />
          <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Prêt à dynamiser le commerce local de{' '}
            <span className="bg-gradient-to-r from-electric-400 to-blue-400 bg-clip-text text-transparent">
              Montigny-le-Bretonneux
            </span>{' '}
            et du 78 ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Rejoignez la liste d'attente. On vous prévient au lancement.
          </p>

          {status !== 'sent' ? (
            <>
              <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-white placeholder-gray-400 outline-none backdrop-blur transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-ink-950 transition hover:bg-gray-200 disabled:opacity-70"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <>Je m'inscris <ArrowRight size={18} /></>}
                </button>
              </form>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300"
                >
                  <AlertCircle size={16} /> {message}
                </motion.p>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-9 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3.5 font-semibold text-emerald-300"
            >
              <Check size={20} /> {message}
            </motion.div>
          )}

          <p className="mt-4 text-xs text-gray-500">Pas de spam. Désinscription en un clic.</p>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <a href="#top" className="flex items-center gap-2 font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-electric-500 to-blue-600">
            <CreditCard size={16} />
          </span>
          Le Pass 78
        </a>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Le Pass 78 — Réseau de fidélité des Yvelines.
        </p>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#how" className="transition hover:text-white">Clients</a>
          <a href="#merchants" className="transition hover:text-white">Commerçants</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-gray-200">
      <BackgroundFX />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <PartnersMarquee />
        <HowItWorks />
        <StatsBand />
        <Merchants />
        <Testimonial />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
