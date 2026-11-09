import { startPortal } from './panel.js?v=20261109i';
import { panel as admin } from './admin.js?v=20261109i';
import { panel as seller } from './seller.js?v=20261109i';
import { panel as shipper } from './shipper.js?v=20261109i';

startPortal([admin, seller, shipper]);
