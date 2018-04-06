using System;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Our.Umbraco.Web.PropertyEditors
{
    public class InlineCheckboxValueConverter : PropertyValueConverterBase, IPropertyValueConverterMeta
    {
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias.Equals("Our.Umbraco.InlineCheckbox");
        }

        public PropertyCacheLevel GetPropertyCacheLevel(PublishedPropertyType propertyType, PropertyCacheValue cacheValue)
        {
            return PropertyCacheLevel.Content;
        }

        public Type GetPropertyValueType(PublishedPropertyType propertyType)
        {
            return typeof(bool);
        }
    }
}