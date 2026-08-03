import { register } from '../registry';
import { SduiCarousel, SduiGrid, SduiScreen, SduiSection, SduiText } from './Layout';
import { SduiSearchHeader, SduiTopTab, SduiTopTabs } from './Header';
import { SduiCategoryCard, SduiCircleCard, SduiServiceTile } from './Cards';
import { SduiBottomNav, SduiNavItem } from './BottomNav';

/**
 * The app's entire UI vocabulary. Anything not listed here cannot be rendered,
 * no matter what the server sends — which is exactly the property that makes
 * server-driven UI safe to ship.
 */
register('screen', SduiScreen);
register('section', SduiSection);
register('carousel', SduiCarousel);
register('grid', SduiGrid);
register('text', SduiText);

register('searchHeader', SduiSearchHeader);
register('topTabs', SduiTopTabs);
register('topTab', SduiTopTab);

register('categoryCard', SduiCategoryCard);
register('circleCard', SduiCircleCard);
register('serviceTile', SduiServiceTile);

register('bottomNav', SduiBottomNav);
register('navItem', SduiNavItem);
