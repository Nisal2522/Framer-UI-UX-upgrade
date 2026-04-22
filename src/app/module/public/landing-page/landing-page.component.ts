import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private slideTimerId?: ReturnType<typeof setInterval>;
  currentSlide = 0;
  private isTransitioning = false;
  readonly fallbackImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%230F2F8F'/><stop offset='100%' stop-color='%23032EA1'/></linearGradient></defs><rect width='800' height='450' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='Arial,sans-serif' font-size='28'>FOMMP</text></svg>";

  readonly heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80',
      title: 'Empowering Agricultural Cooperatives',
      subtitle: 'Through Digital Innovation',
      description: 'A unified platform connecting Farmers, Cooperatives, and Government for sustainable agricultural growth in Cambodia.'
    },
    {
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80',
      title: 'Building Sustainable Futures',
      subtitle: 'For Rural Communities',
      description: 'Enabling data-driven decisions, transparent operations, and collaborative growth across the agricultural sector.'
    },
    {
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80',
      title: 'From Farm to Framework',
      subtitle: 'Smart Cooperative Management',
      description: 'Streamline business plans, track assets, manage members, and monitor crop production - all in one place.'
    }
  ];

  readonly farmerImages = [
    {
      src: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?auto=format&fit=crop&w=600&q=80',
      alt: 'Farmer harvesting rice in paddy field',
      caption: 'Sustainable rice farming practices'
    },
    {
      src: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
      alt: 'Farmers working together in field',
      caption: 'Cooperative collaboration'
    },
    {
      src: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
      alt: 'Agricultural landscape with crops',
      caption: 'Diverse crop cultivation'
    },
    {
      src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
      alt: 'Green rice terraces',
      caption: 'Eco-friendly land management'
    }
  ];

  readonly features = [
    { iconSet: 'bootstrap', icon: 'bi-bar-chart-line-fill', title: 'Dashboard & Insights', description: 'Real-time analytics and comprehensive overview of cooperative performance', gradientClass: 'from-cyan-500 to-emerald-500' },
    { iconSet: 'bootstrap', icon: 'bi-people-fill', title: 'Farmer & Land Management', description: 'Complete member profiles, land registration, and crop tracking', gradientClass: 'from-emerald-500 to-green-500' },
    { iconSet: 'feather', icon: 'sprout', title: 'Crop Tracking', description: 'Monitor crop types, cultivation areas, and production data', gradientClass: 'from-lime-500 to-green-500' },
    { iconSet: 'material', icon: 'description', title: 'Business Plan Management', description: 'Submit, review, and track business plan approval workflows', gradientClass: 'from-sky-500 to-blue-500' },
    { iconSet: 'bootstrap', icon: 'bi-box-seam-fill', title: 'Asset Management', description: 'Track equipment, inventory, and resource allocation efficiently', gradientClass: 'from-amber-500 to-orange-500' },
    { iconSet: 'feather', icon: 'git-branch', title: 'Committee Hierarchy', description: 'Manage organizational structure and member responsibilities', gradientClass: 'from-violet-500 to-indigo-500' },
    { iconSet: 'material', icon: 'menu_book', title: 'Knowledge Hub', description: 'Access agricultural resources, best practices, and training materials', gradientClass: 'from-pink-500 to-fuchsia-500' },
    { iconSet: 'bootstrap', icon: 'bi-chat-dots-fill', title: 'AI Chatbot Support', description: '24/7 intelligent assistance for queries and guidance', gradientClass: 'from-purple-500 to-violet-500' },
    { iconSet: 'bootstrap', icon: 'bi-graph-up-arrow', title: 'Reports & Analytics', description: 'Generate comprehensive reports and data-driven insights', gradientClass: 'from-cyan-500 to-blue-500' }
  ];

  readonly stats = [
    { value: '447+', label: 'Registered Farmers', iconSet: 'bootstrap', icon: 'bi-people-fill' },
    { value: '120+', label: 'Cooperatives', iconSet: 'material', icon: 'apartment' },
    { value: '1.2K', label: 'Hectares Managed', iconSet: 'feather', icon: 'globe' },
    { value: '15+', label: 'Provinces Covered', iconSet: 'bootstrap', icon: 'bi-geo-alt-fill' }
  ];

  readonly aboutItems = [
    { iconSet: 'material', icon: 'admin_panel_settings', label: 'Government', desc: 'Oversight, approvals, and nationwide analytics.' },
    { iconSet: 'bootstrap', icon: 'bi-buildings-fill', label: 'Cooperatives', desc: 'Member management, business plans, and resources.' },
    { iconSet: 'feather', icon: 'user', label: 'Farmers', desc: 'Profiles, land tracking, and training access.' }
  ];

  readonly steps = [
    { number: '01', title: 'Government Registration', description: 'Authorities register and verify Agricultural Cooperatives in the system' },
    { number: '02', title: 'Resource Management', description: 'Cooperatives manage farmers, land, crops, and organizational structure' },
    { number: '03', title: 'Business Plan Workflow', description: 'Submit business plans for review and approval by government officials' },
    { number: '04', title: 'Analytics & Growth', description: 'Leverage data insights for informed decision-making and cooperative development' }
  ];

  readonly testimonials = [
    {
      quote: 'FOMMP has completely transformed how we manage our cooperative. We can now track every farmer and every hectare efficiently.',
      name: 'Sok Chanthy',
      role: 'Cooperative President, Battambang',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote: "The business plan approval process used to take weeks. Now it's streamlined and transparent for everyone involved.",
      name: 'Chea Sopheap',
      role: 'Provincial Agriculture Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote: 'Having access to crop data and market information in one place has helped our farmers make better decisions for their land.',
      name: 'Meas Sothea',
      role: 'Farmer, Siem Reap Province',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ];

  readonly impactItems = [
    { iconSet: 'feather', icon: 'check-circle', label: 'Improved Transparency' },
    { iconSet: 'bootstrap', icon: 'bi-graph-up-arrow', label: 'Better Yield Tracking' },
    { iconSet: 'material', icon: 'track_changes', label: 'Data-Driven Farming' },
    { iconSet: 'bootstrap', icon: 'bi-database-fill', label: 'Centralized Records' }
  ];

  readonly partners = [
    { iconSet: 'feather', icon: 'sprout', name: 'FAO' },
    { iconSet: 'material', icon: 'public', name: 'PEARL Project' },
    { iconSet: 'bootstrap', icon: 'bi-shield-fill-check', name: 'MAFF Cambodia' }
  ];

  readonly socialLinks = [
    { name: 'Facebook', icon: 'bi-facebook', href: '#' },
    { name: 'Twitter', icon: 'bi-twitter-x', href: '#' },
    { name: 'LinkedIn', icon: 'bi-linkedin', href: '#' },
    { name: 'YouTube', icon: 'bi-youtube', href: '#' }
  ];

  readonly quickLinks = [
    { label: 'Login', routerLink: '/login', href: null as string | null },
    { label: 'About Us', routerLink: null as string | null, href: '#' },
    { label: 'Features', routerLink: null as string | null, href: '#features' },
    { label: 'User Guide', routerLink: null as string | null, href: '#' },
    { label: 'FAQ', routerLink: null as string | null, href: '#' }
  ];

  readonly galleryImages = [
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80'
  ];

  ngOnInit(): void {
    this.slideTimerId = setInterval(() => this.nextSlide(), 6000);
  }

  ngOnDestroy(): void {
    if (this.slideTimerId) {
      clearInterval(this.slideTimerId);
      this.slideTimerId = undefined;
    }
  }

  goToSlide(index: number): void {
    if (this.isTransitioning) {
      return;
    }
    this.isTransitioning = true;
    this.currentSlide = index;
    setTimeout(() => {
      this.isTransitioning = false;
    }, 700);
  }

  nextSlide(): void {
    this.goToSlide((this.currentSlide + 1) % this.heroSlides.length);
  }

  prevSlide(): void {
    this.goToSlide((this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  getFarmerImageCardClass(index: number): string {
    const classes = [
      'relative overflow-hidden rounded-2xl ring-1 ring-black/[0.06] shadow-lg shadow-slate-900/10',
      index === 0 ? 'row-span-2 min-h-[200px] sm:min-h-[260px]' : 'min-h-[120px] sm:min-h-[140px]',
      index === 3 ? 'col-span-2 min-h-[140px] sm:min-h-[160px]' : ''
    ];
    return classes.join(' ');
  }

  getFeatherPath(iconName: string): string {
    const iconMap: Record<string, string> = {
      globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 0 1 0 18M12 3a15.3 15.3 0 0 0 0 18',
      user: 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
      sprout: 'M7 20h10M12 20V10M12 10c0-3 2-5 5-6 0 3-2 6-5 6ZM12 12c0-3-2-5-5-6 0 3 2 6 5 6',
      'git-branch': 'M6 3v12M6 7h8a4 4 0 0 1 4 4v10M6 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM18 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4',
      'check-circle': 'M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0'
    };

    return iconMap[iconName] ?? iconMap['user'];
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (!img || img.src === this.fallbackImage) return;
    img.src = this.fallbackImage;
  }
}