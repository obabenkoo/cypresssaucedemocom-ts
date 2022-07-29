import Header from '../components/Header';
import BasePage from '../base/BasePage';
import Footer from '../components/Footer';
import InventoryItemPage from './InventoryItemPage';

export default class InventoryPage extends BasePage {
    public header: Header = new Header();
    public footer: Footer = new Footer();
    private inventoryContainer: string = '#inventory_container';
    private inventoryItemPriceLocator: string = '.inventory_item_price';
    private inventotyTitleListLocator: string = '[id$="title_link"]';

    constructor() {
        super('Inventory Page', 'inventory.html');
    }

    private get inventoryItems(): Cypress.Chainable {
        return cy.get(`${this.inventoryContainer} [class="inventory_item"]`);
    }
    private getArrayOfItemsPrice(): Cypress.Chainable {
        return this.inventoryItems.find(this.inventoryItemPriceLocator).then(($inventoryItemPrice) => {
            return Cypress._.map(Cypress.$.makeArray($inventoryItemPrice), 'innerText').map(price => price.replace('$', ''));
        });
    }
    public checkGoodsIsSortedByLowToHi(): this {
        this.getArrayOfItemsPrice().each((currentItemPrice, index, list) => {
            if (list.length - 1 != index) {
                expect(Number(currentItemPrice)).lte(Number(list[index + 1]));
            }
        });
        return this;
    }
    public addFirstProductToCart(): this {
        this.inventoryItems.eq(0).contains('button', 'Add to cart').click();
        return this;
    }
    public clickOnRandomProduct(): InventoryItemPage {
        this.inventoryItems.then(inventoryItems => {
            cy.wrap(inventoryItems)
            .eq(Cypress._.random(inventoryItems.length - 1))
            .find(this.inventotyTitleListLocator)
            .click();
        });
        return new InventoryItemPage();
    }
}