using System.Collections.Generic;
using System.Linq;
using Cyborg.Core;

namespace Cyborg
{
    public static class Debug
    {
        private static readonly IDictionary<string, string> _properties = new Dictionary<string, string>();

        public static bool Enabled;
        public static void Add(IEntity entity, string property, string value) => _properties[$"{entity.GetType().Name}:{property}"] = value;
        public static string Output => string.Join('\n', _properties.Select(p => $"{p.Key}: {p.Value}"));
        public static void Clear() => _properties.Clear();
    }
}