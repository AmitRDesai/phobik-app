import { Header } from '@/components/ui/Header';
import { SchemeToggle } from './SchemeToggle';

/**
 * Header wrapper for Design System showcase screens.
 * Renders the standard back-button Header with `title` + a `SchemeToggle`
 * in the right slot so every showcase can instantly switch between
 * light / dark / system without leaving the screen.
 */
export function ShowcaseHeader({ title }: { title: string }) {
  return <Header title={title} right={<SchemeToggle />} />;
}
