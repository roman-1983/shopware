/**
 * Shopware 5
 * Copyright (c) shopware AG
 *
 * According to our dual licensing model, this program can be used either
 * under the terms of the GNU Affero General Public License, version 3,
 * or under a proprietary license.
 *
 * The texts of the GNU Affero General Public License with an additional
 * permission and of our proprietary license can be found at and
 * in the LICENSE file you have received along with this program.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * "Shopware" is a registered trademark of shopware AG.
 * The licensing of the program under the AGPLv3 does not imply a
 * trademark license. Therefore any rights, title and interest in
 * our trademarks remain entirely with us.
 */

//{namespace name=backend/custom_search/translation}

//{block name="backend/config/view/custom_search/facet/detail"}

Ext.define('Shopware.apps.Config.view.custom_search.facet.Detail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.config-custom-facet-detail',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    mixins: {
        factory: 'Shopware.attribute.SelectionFactory'
    },
    plugins: [{
        ptype: 'translation',
        translationMerge: true,
        translationType: 'custom_facet'
    }],
    bodyPadding: 15,
    autoScroll: true,

    initComponent: function() {
        var me = this;
        me.handlers = me.initHandlers();
        me.items = me.createItems();
        me.dockedItems = me.createDockedItems();
        me.callParent(arguments);
    },

    createItems: function() {
        var me = this;

        me.facetField = Ext.create('Shopware.apps.Config.view.custom_search.facet.Facet', {
            name: 'facet'
        });

        me.nameField = Ext.create('Ext.form.field.Text', {
            name: 'name',
            fieldLabel: '{s name="name"}{/s}',
            labelWidth: 150,
            allowBlank: false
        });

        me.activeField = Ext.create('Ext.form.field.Checkbox', {
            name: 'active',
            fieldLabel: '{s name="active"}{/s}',
            labelWidth: 150,
            inputValue: true,
            uncheckedValue: false
        });

        me.displayInCategoriesField = Ext.create('Ext.form.field.Checkbox', {
            name: 'displayInCategories',
            fieldLabel: '{s name="display_in_categories"}{/s}',
            labelWidth: 150,
            inputValue: true,
            uncheckedValue: false
        });

        return [{
            xtype: 'fieldset',
            title: '{s name="facet_settings"}{/s}',
            items: [me.nameField, me.activeField, me.displayInCategoriesField]
        }, {
            xtype: 'fieldset',
            title: '{s name="facet_configuration"}{/s}',
            items: [me.facetField]
        }];
    },

    createDockedItems: function() {
        var me = this;
        return [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: me.createToolbarItems()
        }];
    },

    createToolbarItems: function() {
        var me = this;

        me.saveButton = Ext.create('Ext.button.Button', {
            cls: 'primary',
            handler: Ext.bind(me.saveFacet, me),
            text: '{s name="apply_button"}{/s}'
        });
        return ['->', me.saveButton];
    },

    saveFacet: function() {
        var me = this,
            record = me.getRecord();

        if (!me.getForm().isValid()) {
            return;
        }

        me.getForm().updateRecord(record);
        me.setDisabled(true);
        record.save({
            callback: function() {
                me.fireEvent('facet-saved');
            }
        });
    },

    loadFacet: function(record) {
        var me = this,
            facetDefinition,
            handler,
            facetClass;

        facetDefinition = Ext.JSON.decode(record.get('facet'));
        facetClass = Object.keys(facetDefinition);
        handler = me.getHandler(facetClass[0], facetDefinition[facetClass]);

        me.setDisabled(false);

        me.facetField.setHandler(handler);
        me.loadRecord(record);
    },

    getHandler: function(facetClass) {
        var me = this,
            supportedHandler = null;

        Ext.each(me.handlers, function(handler) {
            if (handler.getClass() == facetClass) {
                supportedHandler = handler;
                return false;
            }
        });
        return supportedHandler;
    },

    initHandlers: function() {
        return [
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.CategoryFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.ImmediateDeliveryFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.ManufacturerFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.PriceFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.PropertyFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.ShippingFreeFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.VoteAverageFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.ProductAttributeFacet'),
            Ext.create('Shopware.apps.Config.view.custom_search.facet.classes.CombinedConditionFacet')
        ];
    }
});

//{/block}