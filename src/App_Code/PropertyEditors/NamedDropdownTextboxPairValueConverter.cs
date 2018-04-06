using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Our.Umbraco.Web.PropertyEditors
{
    public class NamedDropdownTextboxPairValueConverter : PropertyValueConverterBase, IPropertyValueConverterMeta
    {
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias.Equals("Our.Umbraco.NamedDropdownTextboxPair");
        }

        public PropertyCacheLevel GetPropertyCacheLevel(PublishedPropertyType propertyType, PropertyCacheValue cacheValue)
        {
            return PropertyCacheLevel.Content;
        }

        public Type GetPropertyValueType(PublishedPropertyType propertyType)
        {
            return typeof(KeyValuePair<string, string>);
        }

        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source is string s)
            {
                var pair = JsonConvert.DeserializeAnonymousType(s, new { key = default(string), value = default(string) });
                if (pair != null)
                    return new KeyValuePair<string, string>(pair.key, pair.value);
            }

            return default(KeyValuePair<string, string>);
        }
    }
}