using System;
using System.Collections.Generic;
using System.Globalization;
using Newtonsoft.Json.Linq;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;

namespace Our.Umbraco.Web.PropertyEditors
{
    public class CountryPickerValueConverter : PropertyValueConverterBase, IPropertyValueConverterMeta
    {
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias.Equals("Our.Umbraco.CountryPicker");
        }

        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source is string json)
            {
                var items = JArray.Parse(json);
                if (items != null)
                {
                    var regions = new List<RegionInfo>();

                    foreach (var item in items)
                    {
                        var iso = item.Value<string>("iso");
                        regions.Add(new RegionInfo(iso));
                    }

                    return regions;
                }
            }

            return base.ConvertSourceToObject(propertyType, source, preview);
        }

        public PropertyCacheLevel GetPropertyCacheLevel(PublishedPropertyType propertyType, PropertyCacheValue cacheValue)
        {
            return PropertyCacheLevel.Content;
        }

        public Type GetPropertyValueType(PublishedPropertyType propertyType)
        {
            return typeof(IEnumerable<RegionInfo>);
        }
    }
}