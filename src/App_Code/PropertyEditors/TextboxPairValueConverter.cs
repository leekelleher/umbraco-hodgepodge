using System;
using Newtonsoft.Json;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Our.Umbraco.Web.PropertyEditors
{
    public class TextboxPairValueConverter : PropertyValueConverterBase, IPropertyValueConverterMeta
    {
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias.Equals("Our.Umbraco.TextboxPair");
        }

        public PropertyCacheLevel GetPropertyCacheLevel(PublishedPropertyType propertyType, PropertyCacheValue cacheValue)
        {
            return PropertyCacheLevel.Content;
        }

        public Type GetPropertyValueType(PublishedPropertyType propertyType)
        {
            return typeof(Tuple<string, string>);
        }

        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source is string s)
            {
                var pair = JsonConvert.DeserializeAnonymousType(s, new { item1 = default(string), item2 = default(string) });
                if (pair != null)
                    return new Tuple<string, string>(pair.item1, pair.item2);
            }

            return default(Tuple<string, string>);
        }
    }
}