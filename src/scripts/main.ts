/**
 * Site runtime entry — imported once by BaseLayout.
 * Order matters only for module evaluation; per-page work is scheduled through
 * lifecycle.onPage() with explicit `order` values.
 */
import './lifecycle';
import './smooth-scroll';
import './motion';
import './nav';
import './transition';
import { runLoader } from './loader';

runLoader();
