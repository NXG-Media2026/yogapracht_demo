export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isButton?: boolean;
}

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Diensten', href: '/diensten' },
  { label: 'Aanbod', href: '/yoga-bij-overprikkeling' },
  { label: 'Masterclass', href: '/masterclass' },
  { label: 'Over Mij', href: '/over' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact', isButton: true },
];
